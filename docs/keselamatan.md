# Keselamatan

Dokumen ini menerangkan lapisan keselamatan yang telah dibina, apa yang perlu
dikonfigurasi sebelum pelancaran, dan turutan pengukuhan yang perlu diikuti.

Prinsipnya berlapis: tiada satu lapisan pun diandaikan sempurna. Kalau CAPTCHA
gagal, had kadar masih ada. Kalau had kadar gagal, moderasi masih ada. Kalau
pangkalan data bocor, data peribadi masih bersulit.

---

## 1. Perimeter

| Kawalan | Status | Di mana |
| --- | --- | --- |
| HTTPS wajib (pengalihan 308) | ✅ | `src/middleware.ts`, suis `PAKSA_HTTPS` |
| HSTS (2 tahun, includeSubDomains, preload) | ✅ | `src/middleware.ts` |
| Content-Security-Policy dengan nonce | ✅ | `src/middleware.ts` |
| `X-Frame-Options`, `nosniff`, `Referrer-Policy: no-referrer` | ✅ | `next.config.ts` |
| Had kadar — penghantaran laporan | ✅ | 5 / 15 minit setiap IP |
| Had kadar — semakan laporan komuniti | ✅ | 120 / 5 minit setiap IP |
| Had kadar — log masuk moderator | ✅ | 10 / 15 minit setiap IP |
| Had kadar — bantahan & langganan digest | ✅ | 5 / jam setiap IP |
| CAPTCHA pada borang laporan | ⚙️ perlu konfigurasi | `CAPTCHA_PENYEDIA` (Turnstile / hCaptcha) |
| Perangkap umpan + semakan masa | ✅ | Berfungsi tanpa penyedia luar |
| Senarai putih IP untuk panel moderasi | ⚙️ pilihan | `MODERATOR_IP_DIBENARKAN` |
| WAF / perlindungan DDoS | ⏳ selepas pentest | Lihat turutan di bawah |

Tanpa CAPTCHA, borang laporan **ditutup** dalam produksi. Ini disengajakan:
borang awam tanpa halangan adalah jemputan kepada banjir laporan palsu, dan
laporan palsu di portal ini bermakna nama orang yang tidak bersalah. Untuk
membukanya tanpa CAPTCHA (contohnya kerana WAF sudah menapis bot), tetapkan
`CAPTCHA_TIDAK_DIPERLUKAN=1` — papan pemuka moderasi akan memaparkan amaran
selagi ia aktif.

## 2. Aplikasi

- **Suntikan SQL** — semua pertanyaan menggunakan parameter (`$1`, `$2`, …).
  Tiada nilai pengguna pernah digabungkan ke dalam rentetan SQL. Nilai yang
  dilaporkan turut dinormalkan mengikut jenis (nombor telefon ditapis kepada
  digit sahaja) sebelum disimpan.
- **XSS** — React melarikan (escape) semua teks secara lalai.
  `dangerouslySetInnerHTML` digunakan hanya untuk Markdown yang ditulis pasukan
  kandungan dalam repo, tidak pernah untuk kandungan pengguna. CSP tanpa
  `unsafe-inline` untuk skrip adalah lapisan kedua.
- **Muat naik bukti** — turutannya: had saiz → jenis sebenar daripada bait
  ajaib (bukan nama fail atau `Content-Type`) → buang metadata (EXIF/GPS,
  chunk teks PNG, chunk EXIF WebP) → imbasan malware → enkripsi → tulis.
  Nama fail dijana; nama daripada pengguna tidak pernah menyentuh sistem fail.
  Fail disimpan di luar `public/` dan hanya boleh dibaca melalui
  `/api/bukti/[nama]` selepas log masuk moderator, dengan
  `Content-Security-Policy: default-src 'none'; sandbox`.
- **Imbasan malware** — sokongan ClamAV melalui `IMBASAN_MALWARE=clamav`.
  Gagal-tutup: pengimbas yang dikonfigurasi tetapi tidak dapat dihubungi
  menolak muat naik.

## 3. Data

- **Enkripsi semasa simpan** — AES-256-GCM untuk e-mel pelapor, e-mel
  pembantah, alamat langganan digest, dan fail bukti. Kunci daripada
  `DATA_ENCRYPTION_KEY`; produksi enggan menyimpan data peribadi tanpanya.
  Carian alamat digest menggunakan indeks buta (HMAC), jadi alamat tidak
  pernah disimpan dalam bentuk jelas.
- **Kawalan akses** — e-mel pelapor tidak pernah dipaparkan kepada orang awam
  (diuji secara automatik). RLS Postgres dengan grant per lajur menghadkan
  peranan `anon` kepada lajur yang selamat sahaja.
- **Log carian** — alat semakan berjalan dalam pelayar. Semakan laporan
  menggunakan k-anonymity: pelayan hanya menerima 5 aksara pertama cap jari.
  Tiada log permintaan disimpan pada endpoint itu.
- **Dasar simpanan** — laporan ditolak dipadam selepas 90 hari; laporan dibuang
  selepas 30 hari; laporan tersiar kekal sebagai amaran tetapi kontak dan bukti
  dibuang selepas `simpan_sehingga` (2 tahun). Jalankan `jalankanPembersihan()`
  harian (cron / Supabase scheduled function), atau gunakan butang dalam papan
  pemuka moderasi. Permintaan pembuangan atas permintaan dikendalikan melalui
  tindakan **Padam data peribadi**, yang direkod dalam log audit.

## 4. Akaun admin

| Kawalan | Status | Nota |
| --- | --- | --- |
| MFA (TOTP, RFC 6238) | ✅ | `MODERATOR_TOTP`. SMS sengaja tidak disokong — ia terdedah kepada SIM swap |
| Token unik & kuat | ✅ semakan | Papan pemuka memberi amaran jika ada token < 24 aksara |
| Amaran peranti baharu | ✅ | E-mel ke `MODERATOR_EMEL_AMARAN` + rekod dalam log audit |
| Had masa sesi | ✅ | 4 jam, kuki HttpOnly + SameSite=Strict + Secure |
| Senarai putih IP | ⚙️ pilihan | `MODERATOR_IP_DIBENARKAN` |
| Log audit (siapa, apa, bila, IP) | ✅ | Jadual `moderator_log`, dipaparkan dalam papan pemuka |

Langkah kedua log masuk menggunakan token pra-sesi bertandatangan (5 minit),
jadi token moderator tidak perlu ditaip atau dihantar semula bersama kod TOTP.

## 5. Pemboleh ubah persekitaran

```bash
# Wajib dalam produksi
DATABASE_URL=postgres://…
SESSION_SECRET=$(openssl rand -hex 32)
DATA_ENCRYPTION_KEY=$(openssl rand -hex 32)
MODERATOR_AKAUN="aisyah:<token 32+ aksara>,farid:<token 32+ aksara>"
MODERATOR_TOTP="aisyah:<rahsia base32>,farid:<rahsia base32>"
NEXT_PUBLIC_SITE_URL=https://…
NEXT_PUBLIC_KONTAK_EMEL=privasi@…

# CAPTCHA (borang laporan ditutup tanpanya)
CAPTCHA_PENYEDIA=turnstile
CAPTCHA_KUNCI_TAPAK=…
CAPTCHA_KUNCI_RAHSIA=…

# Pilihan
MODERATOR_IP_DIBENARKAN=203.0.113.5,203.0.113.6   # MASA BINAAN (edge middleware)
DI_BELAKANG_CLOUDFLARE=1             # MASA BINAAN; percaya CF-Connecting-IP
MODERATOR_EMEL_AMARAN=keselamatan@…
IMBASAN_MALWARE=clamav
CLAMD_HOS=127.0.0.1
CLAMD_PORT=3310
DATA_DIR=/var/lib/portal-scam        # simpan bukti di luar direktori aplikasi
EMEL_PENGHANTAR=…                    # digest & amaran peranti baharu
PAKSA_HTTPS=0                        # hanya jika proksi hadapan sudah mengalihkan
CAPTCHA_TIDAK_DIPERLUKAN=1           # keputusan disengajakan; amaran dipaparkan
```

> **Masa binaan vs runtime.** `MODERATOR_IP_DIBENARKAN` dan
> `DI_BELAKANG_CLOUDFLARE` digunakan dalam `src/middleware.ts` (runtime edge),
> yang tidak membaca env runtime sewenang-wenangnya. Kedua-duanya disalin masa
> binaan melalui `env` dalam `next.config.ts`, jadi **tetapkannya semasa
> `next build`**. Senarai putih IP utama yang boleh diubah semasa runtime ialah
> WAF Cloudflare — lihat [`cloudflare-waf.md`](cloudflare-waf.md).

---

## Fasa ujian keselamatan

Jalankan di **staging sahaja**, dengan data ujian, sebelum menambah Cloudflare.

### Ujian automatik yang sudah ada

```bash
npm run check                 # typecheck + lint + 130+ ujian unit
npm audit                     # pustaka dengan CVE diketahui
DATABASE_URL=… npm test       # termasuk ujian integrasi Postgres
BASE_URL=… node scripts/pentest.mjs   # suite pentest black-box (33 semakan HTTP)
```

`scripts/pentest.mjs` menyerang binaan produksi di staging melalui HTTP sahaja:
header/CSP/HSTS, injection pada endpoint julat, IDOR bukti, keselamatan sesi
(pemalsuan, gangguan tandatangan, luput, token pra-sesi), path traversal, had
kadar dan pengendalian kaedah HTTP. Ia keluar dengan kod bukan sifar jika mana-mana
semakan gagal, jadi ia sesuai untuk CI.

Ujian keselamatan khusus ada dalam `tests/keselamatan.test.ts`: enkripsi,
TOTP (vektor rujukan RFC 6238), perangkap bot, protokol clamd, dan dasar
simpanan data.

### Senarai semak manual

| Kategori | Apa yang diuji | Alat |
| --- | --- | --- |
| Injection | Muatan SQL dalam setiap medan carian dan borang | OWASP ZAP, Burp Suite Community |
| XSS | Muatan skrip dalam penerangan laporan, hujah bantahan, nama pembantah | ZAP, manual |
| Muat naik | Fail bukan imej bernama `.jpg`; fail 50 MB; nama laluan `../../etc/passwd`; imej dengan muatan skrip | Manual |
| IDOR | Tukar ID laporan dalam URL; capai `/api/bukti/*` tanpa sesi; capai `/moderasi` tanpa sesi | Manual |
| Auth | Had cubaan log masuk; MFA tidak boleh dilangkau; kuki sesi diubah suai; sesi luput | Manual |
| Kebergantungan | `npm audit` pada setiap kemas kini | CI |

Proses: **dokumen setiap isu → patch → uji semula → ulang sehingga bersih.**
Simpan catatan setiap pusingan; ia diperlukan jika berlaku insiden kemudian.

### Keputusan pentest (pusingan 1 — 2026-09-03)

Dijalankan terhadap binaan produksi (`npm run build && npm start`) di staging
tempatan dengan data ujian sahaja — tiada data pengguna sebenar, dan sebelum
sebarang WAF dipasang (mengikut turutan pengukuhan di bawah).

**Liputan dan keputusan:**

| Kategori | Serangan diuji | Keputusan |
| --- | --- | --- |
| Header/CSP | nosniff, DENY, no-referrer, HSTS, CSP nonce unik + `strict-dynamic`, tiada `unsafe-eval`, tiada `X-Powered-By` | ✅ semua hadir |
| Injection (SQL) | muatan SQL melalui nama syarikat (disimpan verbatim) + endpoint julat; 9 muatan tak sah | ✅ 400 untuk input tak sah, tiada 500, jadual `report` utuh, aksara `'` di-escape ke `&#x27;` |
| XSS tersimpan | `<script>`, `<img onerror>`, `<svg onload>` dalam nilai laporan & penerangan → diluluskan → dipapar awam | ✅ tiada pelaksanaan JS, tiada elemen DOM aktif dicipta, muatan dipapar sebagai teks di-escape |
| Muat naik | EXE (`MZ`) bernama `.jpg`, fail 6 MB, PNG 1×1 sah | ✅ EXE ditolak (bait ajaib), >5 MB ditolak (saiz), PNG sah diterima |
| IDOR / akses | `/api/bukti/*` tanpa sesi; `/moderasi` tanpa sesi; kuki palsu | ✅ 401 tanpa sesi, papan pemuka tidak bocor tanpa sesi |
| Path traversal | `../../etc/passwd`, `%2e%2e`, null-byte pada nama bukti | ✅ tidak pernah 200, tiada kebocoran fail |
| Sesi | token tandatangan salah, token luput, token pra-sesi sebagai sesi penuh | ✅ semua ditolak; kuki `HttpOnly` + `SameSite=Strict` + `Secure` |
| Auth / MFA | log masuk id+token → langkah TOTP (RFC 6238); MFA tidak boleh dilangkau | ✅ log masuk perlu TOTP; moderasi hujung ke hujung berfungsi |
| Bot | perangkap honeypot + ambang masa 3 saat | ✅ penghantaran bot ditolak |
| Had kadar | 135 permintaan ke endpoint julat dari satu IP | ✅ 429 + `Retry-After` selepas had |
| Kebergantungan | `npm audit` (prod dan dev) | ✅ 0 kerentanan |

Jumlah: **33/33 semakan black-box lulus** (`scripts/pentest.mjs`),
**17 serangan pelayar dineutralkan** (dipandu Playwright), **72 ujian unit
keselamatan lulus**, **0 kerentanan `npm audit`**.

**Isu ditemui dan tindakan:**

- Tiada kerentanan aplikasi ditemui pada pusingan ini. Semua muatan berniat
  jahat dineutralkan oleh lapisan sedia ada (escaping automatik React untuk
  kandungan pengguna; `dangerouslySetInnerHTML` hanya untuk kandungan repo yang
  dipercayai; pengesahan bait ajaib untuk muat naik; token sesi bertandatangan
  HMAC; carian k-anonymity tanpa pepper rahsia jadi ia kekal boleh dikira di
  pelayar).
- Nota: bukti XSS disahkan dua kali — HTML mentah dari pelayan menunjukkan
  muatan di-escape (`&lt;script&gt;`), dan pelayar mengesahkan `window.__xss*`
  tidak pernah ditetapkan. Rentetan muatan hanya muncul di dalam data Flight
  Next.js (`self.__next_f`) sebagai nilai rentetan bersiri — data, bukan skrip
  boleh laksana.

Pentest ini perlu diulang selepas setiap perubahan besar dan sebelum
pelancaran awam (lihat nota pentest profesional di bawah).

### Turutan pengukuhan

1. Bina ciri teras di staging. ✅ selesai
2. Jalankan pentest sendiri mengikut senarai di atas → patch semua isu. ✅ pusingan 1 selesai (2026-09-03), tiada isu ditemui
3. Uji semula selepas patch. ✅ suite `scripts/pentest.mjs` boleh diulang bila-bila masa
4. **Baru** tambah Cloudflare (WAF, perlindungan DDoS, had kadar edge) sebagai
   lapisan luaran sebelum pelancaran awam. ✅ config sebagai kod disediakan —
   [`cloudflare-waf.md`](cloudflare-waf.md) + [`../infra/cloudflare/`](../infra/cloudflare/)
   (untuk di-apply pada akaun/domain sebenar).

Turutan ini penting: WAF yang dipasang sebelum ujian akan menyembunyikan isu
sebenar dalam logik aplikasi, bukan membetulkannya.

### Sebelum pelancaran awam penuh

Pertimbangkan pentest profesional bertauliah (CREST / OSCP). Portal ini
menyimpan tuduhan awam terhadap individu dan data peribadi pelapor — risiko
undang-undang jika bocor adalah tinggi, dan ujian sendiri ada hadnya.

## Melaporkan kelemahan

Hantar butiran ke alamat dalam `NEXT_PUBLIC_KONTAK_EMEL`. Sila beri masa yang
munasabah untuk patch sebelum pendedahan awam.

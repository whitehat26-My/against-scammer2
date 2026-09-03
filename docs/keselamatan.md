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
MODERATOR_IP_DIBENARKAN=203.0.113.5,203.0.113.6
MODERATOR_EMEL_AMARAN=keselamatan@…
IMBASAN_MALWARE=clamav
CLAMD_HOS=127.0.0.1
CLAMD_PORT=3310
DATA_DIR=/var/lib/portal-scam        # simpan bukti di luar direktori aplikasi
EMEL_PENGHANTAR=…                    # digest & amaran peranti baharu
PAKSA_HTTPS=0                        # hanya jika proksi hadapan sudah mengalihkan
CAPTCHA_TIDAK_DIPERLUKAN=1           # keputusan disengajakan; amaran dipaparkan
```

---

## Fasa ujian keselamatan

Jalankan di **staging sahaja**, dengan data ujian, sebelum menambah Cloudflare.

### Ujian automatik yang sudah ada

```bash
npm run check                 # typecheck + lint + 130+ ujian unit
npm audit                     # pustaka dengan CVE diketahui
DATABASE_URL=… npm test       # termasuk ujian integrasi Postgres
```

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

### Turutan pengukuhan

1. Bina ciri teras di staging. ✅ selesai
2. Jalankan pentest sendiri mengikut senarai di atas → patch semua isu.
3. Uji semula selepas patch.
4. **Baru** tambah Cloudflare (WAF, perlindungan DDoS, had kadar edge) sebagai
   lapisan luaran sebelum pelancaran awam.

Turutan ini penting: WAF yang dipasang sebelum ujian akan menyembunyikan isu
sebenar dalam logik aplikasi, bukan membetulkannya.

### Sebelum pelancaran awam penuh

Pertimbangkan pentest profesional bertauliah (CREST / OSCP). Portal ini
menyimpan tuduhan awam terhadap individu dan data peribadi pelapor — risiko
undang-undang jika bocor adalah tinggi, dan ujian sendiri ada hadnya.

## Melaporkan kelemahan

Hantar butiran ke alamat dalam `NEXT_PUBLIC_KONTAK_EMEL`. Sila beri masa yang
munasabah untuk patch sebelum pendedahan awam.

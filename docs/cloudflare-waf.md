# Cloudflare / WAF — fasa pinggir

Ini **fasa 4** dalam turutan pengukuhan portal, dipasang **selepas** pentest
aplikasi selesai (lihat [`keselamatan.md`](keselamatan.md)). WAF diletak dahulu
sebelum ujian akan menyembunyikan isu logik aplikasi sebenar — sebab itu ia
datang terakhir, bukan pertama.

Config sebagai kod ada dalam [`../infra/cloudflare/`](../infra/cloudflare/).

## Apa yang lapisan ini tambah

Aliran permintaan menjadi: **pelawat → Cloudflare (pinggir) → origin (aplikasi Next.js)**.

| Lapisan pinggir | Fungsi |
| --- | --- |
| TLS Full (strict) + HSTS | Sulitkan hujung ke hujung; halang MITM Cloudflare↔origin |
| WAF terurus + OWASP | Sekat tandatangan serangan biasa & pemarkahan anomali |
| Had kadar pinggir | Serap banjir sebelum sampai ke origin |
| Perlindungan DDoS (L3/4/7) | Automatik pada rangkaian Cloudflare |
| Firewall tersuai | Senarai putih IP untuk `/moderasi` & `/api/bukti` |
| Peraturan cache | Pintas cache untuk laluan dinamik/sensitif |

Setiap satu ialah **pertahanan tambahan** di atas kawalan aplikasi yang sedia
ada — bukan pengganti. Jika Cloudflare dipintas (capaian terus ke origin),
aplikasi masih mempunyai HTTPS, had kadar, moderasi, enkripsi, dan log masuk MFA.

## Langkah pemasangan

### 1. Proksi DNS melalui Cloudflare

Tambah domain ke Cloudflare, tukar nameserver, dan pastikan rekod A/AAAA/CNAME
untuk domain portal **Proxied** (awan oren), bukan DNS-only. Tanpa proksi, tiada
satu pun kawalan di bawah berkuat kuasa.

### 2. TLS: Full (strict) + sijil origin

Tetapkan mod SSL/TLS ke **Full (strict)** (dilakukan oleh `settings.tf`). Ini
mewajibkan sijil **sah** pada origin:

- **Hos terurus** (Vercel/Netlify/Fly): origin sudah ada sijil sah — tiada kerja
  tambahan.
- **Self-host**: jana **Cloudflare Origin CA certificate** dan pasang pada
  pelayan origin, atau guna sijil awam sah (cth. Let's Encrypt).

Jangan sekali-kali guna mod **Flexible** — ia menyulitkan hanya pelawat↔Cloudflare
dan menghantar HTTP jelas ke origin, memecahkan jaminan HTTPS wajib portal.

### 3. Kunci origin (halang pintasan)

WAF tidak berguna jika penyerang boleh terus ke IP origin. Pilih satu:

- **Authenticated Origin Pulls (mTLS)** — origin hanya terima sambungan yang
  membawa sijil klien Cloudflare. Paling teguh.
- **Hadkan firewall origin kepada julat IP Cloudflare** sahaja
  (https://www.cloudflare.com/ips). Sesuai untuk self-host.
- **Cloudflare Tunnel (cloudflared)** — origin tiada IP awam langsung.

Aplikasi turut membantu: apabila `DI_BELAKANG_CLOUDFLARE=1`, permintaan tanpa
pengepala `CF-Connecting-IP` (biasanya capaian terus ke origin) diberi pengenal
`tempatan` dan tidak akan lulus senarai putih IP admin.

### 4. Konfigurasi aplikasi untuk Cloudflare

Tetapkan **semasa `next build`** (lihat nota masa binaan di bawah):

```bash
DI_BELAKANG_CLOUDFLARE=1
# Pilihan: senarai putih IP admin di peringkat aplikasi (pertahanan tambahan)
MODERATOR_IP_DIBENARKAN=203.0.113.10,198.51.100.0/24
```

Kesannya:

- **IP klien sebenar** diambil daripada `CF-Connecting-IP` (ditetapkan Cloudflare,
  tidak boleh dipalsukan), bukan `X-Forwarded-For` (boleh diprakata klien). Ini
  penting untuk had kadar, senarai putih IP, dan log audit — tanpanya, penyerang
  boleh memintas senarai putih dengan XFF palsu, atau meracuni baldi had kadar.
- Ujian: `tests/ip.test.ts` mengesahkan XFF palsu diabaikan apabila mod ini aktif.

> **Nota masa binaan (penting).** `DI_BELAKANG_CLOUDFLARE` dan
> `MODERATOR_IP_DIBENARKAN` digunakan dalam `src/middleware.ts`, yang berjalan
> pada runtime **edge**. Runtime edge tidak mendedahkan pemboleh ubah
> persekitaran sewenang-wenangnya semasa runtime, jadi kedua-duanya disalin
> masa binaan melalui `env` dalam `next.config.ts`. Tetapkannya semasa
> `next build`, bukan hanya `next start`. Senarai putih IP **utama** yang boleh
> diubah semasa runtime ialah peraturan firewall Cloudflare (langkah 5).

### 5. Pasang WAF, had kadar, cache (Terraform)

```bash
cd infra/cloudflare
export CLOUDFLARE_API_TOKEN=xxxxxxxx
cp terraform.tfvars.example terraform.tfvars   # isi zone_id, admin_ip_allowlist
terraform init
terraform plan            # semak dahulu
terraform apply
```

Lihat [`../infra/cloudflare/README.md`](../infra/cloudflare/README.md) untuk
keizinan token dan butiran fail.

### 6. Bot & CAPTCHA

Portal sudah menyokong **Cloudflare Turnstile** pada borang laporan
(`CAPTCHA_PENYEDIA=turnstile`, lihat `keselamatan.md`). Di dashboard Cloudflare,
boleh juga aktifkan **Bot Fight Mode** untuk trafik automatik yang ketara. CSP
aplikasi sudah membenarkan hos Turnstile.

## Pengesahan selepas apply

```bash
# HSTS + TLS
curl -sI https://DOMAIN | grep -i strict-transport-security

# Laluan admin ditolak dari IP bukan senarai putih (jangka 403 dari Cloudflare)
curl -s -o /dev/null -w "%{http_code}\n" https://DOMAIN/moderasi

# Aset statik di-cache (jangka cf-cache-status: HIT selepas permintaan kedua)
curl -sI https://DOMAIN/_next/static/... | grep -i cf-cache-status

# Laluan dinamik tidak di-cache (jangka BYPASS/DYNAMIC)
curl -sI https://DOMAIN/semak | grep -i cf-cache-status
```

Pantau **Security → Events** di dashboard untuk positif palsu WAF pada minggu
pertama.

## Interaksi dengan kawalan aplikasi

| Kawalan | Aplikasi | Cloudflare | Nota |
| --- | --- | --- | --- |
| Paksa HTTPS | `PAKSA_HTTPS` (middleware) | Always Use HTTPS | Kedua-dua serasi; Cloudflare mengalih di pinggir dahulu |
| HSTS | `src/middleware.ts` | `settings.tf` | Sama arahan; sandaran untuk capaian terus ke origin |
| Had kadar | ketat, ikut logik | longgar, serap banjir | Berlapis, bukan pendua |
| Senarai putih IP admin | pertahanan tambahan (masa binaan) | utama (runtime) | Cloudflare menyekat sebelum origin |
| IP klien | `CF-Connecting-IP` bila `DI_BELAKANG_CLOUDFLARE=1` | menetapkan `CF-Connecting-IP` | Elak kepercayaan XFF palsu |

## Menala positif palsu WAF

Jika trafik sah disekat:

1. Security → Events → cari peraturan yang mencetuskan.
2. Turunkan `owasp_paranoia_level` (high → medium → low) dalam `terraform.tfvars`,
   atau tambah pengecualian khusus peraturan.
3. `terraform apply` semula. Jangan matikan WAF sepenuhnya untuk menyelesaikan
   satu positif palsu.

## Rollback

- Peraturan tunggal: lumpuhkan di dashboard (Security → WAF) untuk pantas, atau
  `enabled = false` pada peraturan berkenaan kemudian `terraform apply`.
- Semua config: `terraform destroy` di `infra/cloudflare/` mengeluarkan ruleset
  yang diurus di sini (tetapan zon kembali ke lalai).
- Kecemasan: tukar rekod DNS ke **DNS-only** (awan kelabu) untuk memintas
  Cloudflare buat sementara — ingat ini juga mematikan semua perlindungan.

## Jangan buat

- Jangan pasang WAF **sebelum** pentest aplikasi — ia menyembunyikan isu sebenar.
- Jangan guna SSL **Flexible**.
- Jangan biar origin boleh dicapai terus tanpa penguncian (langkah 3).
- Jangan matikan WAF untuk satu positif palsu — tala sebaliknya.

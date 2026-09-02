# Portal Semakan Scam Malaysia

Laman web untuk rakyat Malaysia menyemak dan mempelajari taktik scam terkini.

Platform ini **melengkapkan, bukan menggantikan** sistem rasmi kerajaan
(Semak Mule PDRM, NSRC 997, National Fraud Portal). Ia menumpu kepada dua
perkara yang sistem rasmi tidak buat secara terbuka:

1. **Ensiklopedia modus operandi** yang ditulis untuk orang awam.
2. **Lapisan laporan komuniti** sebagai amaran awal — dengan status yang jelas
   supaya ia tidak pernah dianggap rekod jenayah rasmi. (Fasa 2.)

> Portal ini bukan laman rasmi kerajaan. Untuk semakan berstatus rasmi, guna
> [Semak Mule](https://semakmule.rmp.gov.my). Untuk kes yang baru berlaku,
> hubungi NSRC di **997**.

## Status: MVP (fasa 1)

Siap dan berfungsi:

- Halaman utama
- **Ensiklopedia** `/taktik` dan `/taktik/[kategori]` — 6 kategori lengkap
  (love scam, Macau scam, job scam, parcel scam, pelaburan/kripto, penyamaran
  pegawai kerajaan & bank), dengan carian dan tapisan ikut platform serta
  tahap risiko
- **Alat semakan** `/semak` — mengenal pasti jenis input (telefon / akaun bank /
  URL / nama syarikat), memberi panduan khusus, dan sentiasa merujuk keluar ke
  Semak Mule. Tiada pangkalan data rekod jenayah dibina atau ditiru.
- **`/kalau-dah-kena`** — langkah 997 langkah demi langkah dan saluran rasmi
- **`/status-laporan`** — reka bentuk sistem status laporan komuniti
- **`/privasi`** — notis privasi PDPA 2010
- **`/hak-menjawab`** — saluran bantahan & permintaan PDPA
- Bahasa Malaysia dengan toggle Bahasa Inggeris, mobile-first

Fasa akan datang (belum dibina): borang laporan komuniti penuh + papan pemuka
moderasi, suapan berita automatik + digest e-mel, akaun pengguna.
Skema pangkalan data untuk semua entiti itu ada dalam [`db/schema.sql`](db/schema.sql).

## Menjalankan projek

```bash
npm install
npm run dev        # http://localhost:3000
```

Skrip lain:

```bash
npm run build      # binaan produksi
npm start          # jalankan binaan produksi
npm test           # ujian unit (vitest)
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run check      # typecheck + lint + test
```

### Pemboleh ubah persekitaran

Semuanya ada nilai lalai untuk pembangunan. Tetapkan sebelum pelancaran sebenar:

| Pemboleh ubah | Kegunaan |
| --- | --- |
| `NEXT_PUBLIC_KONTAK_EMEL` | Alamat e-mel untuk hak menjawab & permintaan PDPA |
| `NEXT_PUBLIC_SITE_URL` | URL kanonik untuk `sitemap.xml` dan `robots.txt` |

## Struktur

```
content/taktik/       Kandungan ensiklopedia (Markdown + frontmatter, ms & en)
db/schema.sql         Skema Postgres/Supabase untuk entiti fasa 2
src/app/              Halaman Next.js (App Router)
src/components/       Komponen UI yang dikongsi
src/lib/
  content.ts          Pemuat Markdown (server sahaja)
  kategori.ts         Jenis data & carian kategori (tulen, selamat untuk klien)
  query.ts            Pengelasan input alat semakan + heuristik URL
  status.ts           Sistem status laporan komuniti (teras anti-fitnah)
  taxonomy.ts         Taksonomi platform & tahap risiko yang dikongsi
  official.ts         Saluran rasmi kerajaan
  i18n.ts             Pemilihan bahasa
  dictionaries/       Teks antara muka BM & EN
tests/                Ujian unit
```

## Keputusan reka bentuk yang penting

Keperluan undang-undang dalam brief dibina ke dalam seni bina, bukan ditampal
pada UI.

### Tiada pangkalan data rekod jenayah

Alat semakan tidak menyimpan atau meniru rekod PDRM. Ia mengenal pasti jenis
maklumat yang pengguna ada, memberi panduan yang sesuai, dan sentiasa
memaparkan butang keluar ke Semak Mule — untuk **setiap** jenis input.

### Privasi carian dibina ke dalam struktur, bukan dasar sahaja

- Pengelasan carian berlaku sepenuhnya dalam pelayar (`src/lib/query.ts`
  adalah fungsi tulen yang dipanggil oleh komponen klien). Tiada permintaan
  rangkaian dibuat dengan teks carian.
- Teks carian tidak dimasukkan ke dalam URL, jadi ia tidak bocor melalui
  sejarah pelayar, pautan yang dikongsi, atau header `Referer`.
- `Referrer-Policy: no-referrer` ditetapkan dalam `next.config.ts` supaya
  Semak Mule tidak diberitahu dari mana pengguna datang.
- Jika statistik penggunaan diperlukan kelak, jadual `search_stat` dalam
  `db/schema.sql` hanya menyimpan *jenis* carian dan tarikh — tiada teks
  carian, tiada IP, tiada pengenalan pengguna.

### Anti-fitnah dikuatkuasakan oleh kod dan ujian

`src/lib/status.ts` mentakrifkan tiga status sahaja — `belum_disemak`,
`dilaporkan_komuniti`, `dipertikai` — dan tiada satu pun bermaksud pengesahan
jenayah. Kiraan sokongan dipaparkan sebagai `(×N)` tetapi **tidak pernah**
menaik taraf status.

Dua ujian menguatkuasakan dasar ini supaya ia tidak boleh terhakis secara tidak
sengaja pada masa hadapan:

- `tests/status.test.ts` — tiada label status boleh mengandungi perkataan yang
  mengesahkan jenayah, dan laporan `belum_disemak` tidak boleh tersiar.
- `tests/i18n.test.ts` — frasa menuduh seperti "disahkan scammer" hanya
  dibenarkan dalam teks antara muka apabila ia dinafikan.

Dalam pangkalan data, `report_moderation_first` (CHECK constraint) menghalang
mana-mana laporan meninggalkan status `belum_disemak` tanpa rekod siapa yang
menyemak dan bila.

### Hak menjawab yang berfungsi

`/hak-menjawab` menetapkan siapa boleh membantah, apa yang perlu dihantar, dan
SLA sebenar (akuan 3 hari bekerja, keputusan 14 hari bekerja). Jadual `dispute`
menyimpan setiap peringkat SLA itu, dan `moderator_log` merekod setiap tindakan.

Ganti `NEXT_PUBLIC_KONTAK_EMEL` dengan peti masuk yang benar-benar dipantau
sebelum pelancaran — saluran ini tidak boleh menjadi borang mati.

## Kandungan

Lihat [`content/README.md`](content/README.md) untuk panduan pasukan kandungan:
medan frontmatter, peraturan penulisan, dan cara menambah kategori baharu.

Nombor telefon dan URL agensi dalam `src/lib/official.ts` perlu disemak semula
secara berkala. Kemas kini `DISEMAK_PADA` setiap kali disahkan.

## Penafian

Maklumat di portal ini bersifat pendidikan am dan bukan nasihat undang-undang.
Ketiadaan sesuatu nombor di sini bukan bukti bahawa ia selamat.

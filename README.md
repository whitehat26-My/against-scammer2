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

## Apa yang siap

Siap dan berfungsi:

- Halaman utama
- **Ensiklopedia** `/taktik` dan `/taktik/[kategori]` — 7 kategori lengkap
  (love scam, Macau scam, job scam, parcel scam, pelaburan/kripto, penyamaran
  pegawai kerajaan & bank, pautan phishing), dengan carian dan tapisan ikut
  platform serta tahap risiko
- **Alat semakan** `/semak` — mengenal pasti jenis input (telefon / akaun bank /
  URL / nama syarikat), memberi panduan khusus, dan sentiasa merujuk keluar ke
  Semak Mule. Untuk input jenis URL ia turut memaparkan petunjuk teknikal
  heuristik dan memaut ke entri ensiklopedia *Pautan phishing*. Tiada
  pangkalan data rekod jenayah dibina atau ditiru.
- **Laporan komuniti** `/lapor` — borang dengan persetujuan PDPA, muat naik bukti
  (metadata imej dibuang secara automatik), dan kontak pelapor yang pilihan.
  Tiada laporan diterbitkan tanpa semakan moderator.
- **Papan pemuka moderasi** `/moderasi` — giliran semakan, tindakan
  terima/tolak/tanda dipertikai/buang, dan log audit penuh
- **Halaman laporan awam** `/laporan/[id]` — status, sokongan pelapor lain, dan
  borang hak menjawab yang menukar status kepada "Dipertikai"
- **Suapan berita & amaran** `/berita` dan `/berita/[slug]` — entri pendek yang
  ditag mengikut taksonomi ensiklopedia yang sama, dengan pautan silang dua
  hala. Setiap entri meringkaskan dalam ayat sendiri dan memaut ke sumber asal.
- **Digest e-mel mingguan** — langganan opt-in dengan pengesahan dua langkah,
  dan pautan berhenti yang membuang alamat sepenuhnya
- **`/kalau-dah-kena`** — langkah 997 langkah demi langkah dan saluran rasmi
- **`/status-laporan`** — sistem status laporan komuniti
- **`/privasi`** — notis privasi PDPA 2010
- **`/hak-menjawab`** — saluran bantahan & permintaan PDPA
- Bahasa Malaysia dengan toggle Bahasa Inggeris, mobile-first

Fasa akan datang (belum dibina): pengumpulan berita automatik daripada
kenyataan media, akaun pengguna untuk menjejak laporan sendiri, dan log masuk
moderator melalui SSO.

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
| `DATABASE_URL` | Postgres/Supabase. Jika tidak ditetapkan, storan fail JSON di bawah `.data/` digunakan (pembangunan sahaja). |
| `DATA_DIR` | Lokasi storan fail dan bukti imej. Lalai `.data/`. |
| `MODERATOR_AKAUN` | Akaun moderator, format `id:token,id2:token2`. **Wajib dalam produksi** — tanpanya papan pemuka menolak semua log masuk. |
| `SESSION_SECRET` | Rahsia HMAC untuk cookie sesi moderator. **Wajib dalam produksi.** |
| `EMEL_PENGHANTAR` | Penghantar e-mel untuk digest dan amaran peranti baharu. `log` menulis e-mel ke log pelayan (pembangunan). Tanpa nilai, borang digest tidak dipaparkan langsung. |
| `DATA_ENCRYPTION_KEY` | Kunci AES-256 (64 aksara hex) untuk menyulitkan kontak pelapor dan bukti. **Wajib dalam produksi.** |
| `MODERATOR_TOTP` | Rahsia TOTP setiap moderator, format `id:rahsia-base32,...`. Kod dua faktor diwajibkan untuk akaun yang mempunyainya. |
| `CAPTCHA_PENYEDIA` | `turnstile` atau `hcaptcha`, dengan `CAPTCHA_KUNCI_TAPAK` dan `CAPTCHA_KUNCI_RAHSIA`. Borang laporan ditutup dalam produksi tanpanya. |
| `MODERATOR_IP_DIBENARKAN` | Senarai IP yang boleh mencapai `/moderasi` dan `/api/bukti` (pilihan). |
| `IMBASAN_MALWARE` | `clamav` untuk mengimbas bukti melalui clamd (`CLAMD_HOS`, `CLAMD_PORT`). |
| `PAKSA_HTTPS` | `0` untuk mematikan pengalihan HTTPS jika proksi hadapan sudah mengendalikannya. |

Senarai penuh, dasar setiap kawalan, dan senarai semak pentest ada dalam
[`docs/keselamatan.md`](docs/keselamatan.md).

Untuk menjalankan dengan Postgres:

```bash
createdb portal_scam
psql portal_scam -f db/schema.sql
DATABASE_URL=postgres://…/portal_scam \
MODERATOR_AKAUN="aisyah:token-rahsia" \
SESSION_SECRET="$(openssl rand -hex 32)" \
npm run dev
```

Ujian integrasi Postgres (`tests/pg-store.test.ts`) berjalan secara automatik
apabila `DATABASE_URL` ditetapkan, dan dilangkau apabila tidak.

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
  moderator.ts        Sesi moderator (HMAC) untuk papan pemuka moderasi
  rate-limit.ts       Had kadar dalam ingatan, tanpa menyimpan alamat IP
  i18n.ts             Pemilihan bahasa
  dictionaries/       Teks antara muka BM & EN
  laporan/
    types.ts          Entiti laporan + peraturan keterlihatan
    nilai.ts          Normalisasi & hashing untuk carian k-anonymity
    validasi.ts       Pengesahan borang (kod ralat, bukan ayat)
    store.ts          Antara muka storan + pemilih pelaksanaan
    file-store.ts     Storan JSON (pembangunan)
    pg-store.ts       Storan Postgres/Supabase (produksi)
    bukti.ts          Pengesahan imej + pembuangan metadata EXIF
  artikel.ts          Jenis & penapisan suapan berita (tulen)
  berita.ts           Pemuat Markdown suapan berita (server sahaja)
  digest.ts           Jenis & pengesahan langganan digest
  emel.ts             Adaptor penghantar e-mel
tests/                Ujian unit + integrasi
```

## Sistem reka bentuk

Antara muka menggunakan permukaan kaca (*liquid glass*) di atas latar grid
dengan satu jalur cahaya yang menyapu perlahan. Semuanya ada dalam
`src/app/globals.css` dan dua komponen kecil.

**Hierarki permukaan.** Hanya perkara yang boleh disentuh mendapat kaca:
pengepala, navigasi bawah, borang, kad boleh klik, dan footer. Teks biasa
duduk terus atas latar. Ini yang membezakan antara muka yang kemas dan
antara muka yang penuh kotak — kalau semuanya kotak, tiada yang menonjol.

**Kaca itu sendiri** dibina daripada empat lapisan pada setiap permukaan:
`backdrop-filter` (kabur + tepu), tepi lensa (sempadan kecerunan yang lebih
terang di atas dan gelap di bawah, melalui `mask-composite`), pantulan
specular pada tepi atas, dan bayang berlapis. Elemen dengan kelas `kilau`
turut mendapat sheen yang mengikut kursor — `KesanKaca` menetapkan `--sx`
dan `--sy` melalui satu pendengar `pointermove` untuk seluruh halaman,
didikit oleh `requestAnimationFrame`, dan hanya pada peranti penuding tepat.

**Latar** (`LatarBelakang`) ialah grid halus yang ditapis supaya lenyap ke
bawah, dengan satu jalur cahaya kabur yang menyapu setiap 30 saat. Jalur itu
menganimasikan `transform` sahaja, jadi ia kekal pada thread komposit.

**Sandaran.** Permukaan menjadi legap apabila `backdrop-filter` tidak
disokong atau pengguna memilih `prefers-reduced-transparency`; sapuan
berhenti pada `prefers-reduced-motion`; grid dan sapuan dimatikan sepenuhnya
pada `prefers-contrast: more`. Kontras teks kecil disemak pada 4.5:1 dalam
kedua-dua mod cerah dan gelap.

Untuk menukar animasi latar kepada sesuatu yang lain, hanya `.latar__grid`,
`.latar__sapu` dan keyframe `sapuan` perlu disentuh — tiada komponen lain
bergantung padanya.

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
- Semakan laporan komuniti menggunakan **k-anonymity**: pelayar mengira
  SHA-256 bagi maklumat yang dicari dan menghantar hanya 5 aksara pertama
  kepada `/api/laporan/julat`. Pelayan mengembalikan semua laporan tersiar
  yang berkongsi awalan itu, dan padanan tepat dibuat semula dalam pelayar.
  Satu awalan dikongsi berjuta-juta nilai, jadi pelayan tidak boleh
  menentukan apa yang dicari. Endpoint itu juga tidak menyimpan log.
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
menyemak dan bila. Kedua-dua pelaksanaan storan (fail dan Postgres) diuji
terhadap peraturan yang sama.

Nota: "ditolak" dan "dibuang" bukan status awam. Ia disimpan sebagai cap masa
berasingan supaya senarai status awam kekal tiga sahaja seperti direka.

### Suapan berita: ringkaskan, jangan salin

Setiap entri menyimpan ringkasan yang ditulis oleh pasukan portal sendiri
(dihadkan kepada 1200 aksara oleh pemuat kandungan) bersama nama dan URL sumber
asal. Halaman entri memaparkan butang "Baca di sumber asal" dan menyatakan
dengan jelas bahawa teks penuh tidak disalin.

Setiap entri dilabel sama ada `berita` (ringkasan sesuatu yang diterbitkan di
tempat lain) atau `amaran` (nota evergreen yang ditulis oleh pasukan portal).
Pembaca diberitahu perbezaannya pada setiap halaman entri, supaya nota kami
sendiri tidak disalah anggap sebagai laporan peristiwa.

Tag menggunakan slug ensiklopedia yang sama. Pemuat kandungan menolak tag yang
tiada dalam ensiklopedia, jadi pautan silang tidak boleh reput secara senyap.

### Digest e-mel

- Double opt-in: langganan hanya aktif selepas pengguna klik pautan pengesahan.
- Borang memberi jawapan yang sama sama ada alamat itu baharu atau sudah
  dilanggan, jadi ia tidak boleh digunakan untuk menguji alamat orang lain.
- Berhenti melanggan membuang baris tersebut, bukan menandanya.
- Borang hanya dipaparkan apabila `EMEL_PENGHANTAR` dikonfigurasi — kami tidak
  menjanjikan e-mel pengesahan yang tidak dapat dihantar.

### Data peribadi dalam laporan komuniti

- Kontak pelapor adalah pilihan; laporan tanpa nama diterima sepenuhnya, dan
  e-mel pelapor tidak pernah dipaparkan kepada orang awam.
- Imej bukti hanya boleh dibaca melalui `/api/bukti/[nama]`, yang menolak
  sesiapa yang belum log masuk sebagai moderator.
- Metadata imej (termasuk koordinat GPS dalam EXIF) dibuang pada titik masuk,
  sebelum fail ditulis ke cakera — lihat `src/lib/laporan/bukti.ts`.
- Had kadar tidak menyimpan alamat IP: kunci ialah hash dengan garam rawak
  yang dijana semula setiap kali proses bermula.

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

## Sebelum pelancaran

Rujuk [`docs/keselamatan.md`](docs/keselamatan.md) untuk senarai penuh dan
turutan pengukuhan (bina → pentest → patch → uji semula → baru pasang WAF).

1. Tetapkan `MODERATOR_AKAUN`, `MODERATOR_TOTP`, `SESSION_SECRET` dan
   `DATA_ENCRYPTION_KEY`. Tanpa `MODERATOR_AKAUN`, papan pemuka moderasi
   menolak semua log masuk dalam produksi; tanpa `SESSION_SECRET` atau
   `DATA_ENCRYPTION_KEY`, pelayan enggan mengendalikan sesi atau menyimpan
   data peribadi.
2. Tetapkan `DATABASE_URL` — storan fail JSON hanya untuk pembangunan.
3. Ganti `NEXT_PUBLIC_KONTAK_EMEL` dengan peti masuk yang benar-benar dipantau.
   Tetapkan juga `NEXT_PUBLIC_SITE_URL` — pautan pengesahan digest dibina
   daripadanya.
4. Sambungkan penyedia e-mel sebenar dalam `src/lib/emel.ts`. Sehingga itu,
   borang digest kekal tersembunyi (`EMEL_PENGHANTAR=log` hanya menulis ke log
   pelayan dan sesuai untuk pembangunan sahaja).
5. Token kongsi moderator adalah penyelesaian sementara. Gantikan
   `src/lib/moderator.ts` dengan Supabase Auth atau SSO organisasi anda apabila
   pasukan moderasi bertambah besar.

## Penafian

Maklumat di portal ini bersifat pendidikan am dan bukan nasihat undang-undang.
Ketiadaan sesuatu nombor di sini bukan bukti bahawa ia selamat.

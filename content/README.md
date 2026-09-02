# Panduan pasukan kandungan

Kandungan Ensiklopedia disimpan sebagai fail Markdown di bawah `content/taktik/`.
Setiap kategori mempunyai satu fail bagi setiap bahasa:

```
content/taktik/<slug>.ms.md   # Bahasa Malaysia (wajib)
content/taktik/<slug>.en.md   # English (jika tiada, versi BM dipaparkan)
```

`<slug>` menjadi alamat halaman: `content/taktik/love-scam.ms.md` → `/taktik/love-scam`.
Gunakan huruf kecil, nombor dan sempang sahaja.

## Medan frontmatter

| Medan | Wajib | Keterangan |
| --- | --- | --- |
| `slug` | ya | Mesti sama dengan nama fail. |
| `nama` | ya | Nama kategori seperti yang dipaparkan. |
| `ringkasan` | ya | Satu ayat. Muncul pada kad senarai dan hasil carian. |
| `risiko` | ya | `sederhana`, `tinggi` atau `sangat-tinggi`. |
| `susunan` | tidak | Nombor untuk mengawal turutan senarai (kecil dahulu). |
| `platform` | ya | Senarai daripada taksonomi dalam `src/lib/taxonomy.ts`. |
| `juga_dikenali` | tidak | Nama lain yang orang ramai guna — membantu carian. |
| `red_flags` | ya | Sekurang-kurangnya 5 tanda amaran, satu ayat setiap satu. |
| `contoh_taktik` | ya | Sekurang-kurangnya 2 contoh: `tajuk`, `mesej`, `kenapa_bahaya`. |
| `langkah_pantas` | ya | Sekurang-kurangnya 3 langkah untuk mangsa yang baru kena. |
| `kemas_kini` | ya | Tarikh `YYYY-MM-DD`. |

Badan Markdown selepas frontmatter digunakan untuk naratif. Gunakan tajuk `##`
untuk bahagian seperti *Cara ia bermula*, *Kenapa ia berkesan* dan
*Cara lindung diri*.

Ujian `tests/content.test.ts` menyemak semua peraturan di atas. Jalankan
`npm test` sebelum menghantar perubahan.

## Peraturan penulisan

1. **Contoh mesej mesti ditulis semula.** Jangan salin tampal perbualan sebenar
   mangsa dan jangan muat naik tangkapan skrin. Tukar nama, nombor dan jumlah.
2. **Jangan namakan individu, syarikat atau nombor sebenar** dalam entri
   ensiklopedia. Ensiklopedia menerangkan taktik, bukan menuduh pihak tertentu.
3. **Guna bahasa "dilaporkan" dan "disyaki".** Jangan tulis "disahkan scammer"
   atau apa-apa yang membawa maksud pengesahan jenayah.
4. **Nada memberi amaran dan mendidik**, bukan menakutkan. Elakkan bahasa yang
   menyalahkan mangsa.
5. **Bahasa mudah.** Ayat pendek. Elakkan istilah undang-undang dan teknikal
   yang tidak perlu.
6. Apabila memautkan pautan scam sebagai contoh, tulis ia supaya tidak boleh
   diklik, contohnya `hxxps://contoh-tipu[.]xyz`.

## Menambah kategori baharu

1. Salin fail sedia ada sebagai templat.
2. Tukar `slug`, `nama` dan semua kandungan.
3. Sediakan versi `.ms.md` dan `.en.md`. `risiko`, `platform` dan `susunan`
   mesti sama antara kedua-dua bahasa (diuji secara automatik) supaya pautan
   silang dengan modul berita kekal konsisten.
4. Jalankan `npm test` dan `npm run build`.

Dalam MVP ini, kandungan diterbitkan melalui git — satu commit mencetuskan
deploy semula. Papan pemuka CMS untuk pasukan kandungan mengemas kini tanpa
deploy adalah kerja fasa 2; jadual `scam_category` dan `article` dalam
`db/schema.sql` sudah disediakan untuk itu.

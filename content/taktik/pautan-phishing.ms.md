---
slug: pautan-phishing
nama: "Pautan phishing (link palsu)"
ringkasan: "Satu pautan dalam SMS, WhatsApp, e-mel atau kod QR yang membawa anda ke halaman log masuk palsu — dan mengambil ID, kata laluan serta OTP anda."
risiko: sangat-tinggi
susunan: 7
platform:
  - sms
  - whatsapp
  - telegram
  - e-mel
  - facebook
  - laman-web
  - kod-qr
juga_dikenali:
  - "Phishing"
  - "Smishing (phishing melalui SMS)"
  - "Quishing (phishing melalui kod QR)"
  - "Link palsu"
  - "Laman log masuk palsu"
red_flags:
  - "Pautan datang bersama tekanan masa: “dalam 12 jam”, “sebelum akaun disekat”, “hari ini sahaja”."
  - "Nama domain hampir sama dengan yang sebenar tetapi tidak serupa — ada sempang, huruf tambahan, atau hujung domain yang berlainan."
  - "Pautan pendek atau kod QR yang tidak menunjukkan alamat penuh sebelum anda klik."
  - "Halaman meminta ID, kata laluan DAN nombor TAC/OTP dalam satu borang yang sama."
  - "Halaman meminta anda memuat turun fail aplikasi (APK) untuk “meneruskan”."
  - "Laman yang mendakwa kerajaan tetapi tidak berakhir dengan .gov.my."
  - "Log masuk “gagal” berulang kali, dan anda diminta mencuba lagi dengan OTP baharu."
  - "Alamat mengandungi aksara pelik atau bermula dengan xn-- apabila disalin."
  - "Halaman kelihatan betul tetapi butang lain pada laman itu tidak berfungsi."
contoh_taktik:
  - tajuk: "SMS akaun akan disekat"
    mesej: "Makluman: Akaun perbankan internet anda akan digantung pada 30/09 kerana maklumat belum dikemas kini. Sila sahkan sekarang: hxxps://maybank2u-com-my[.]top/verify"
    kenapa_bahaya: "Domain sebenar di sini ialah maybank2u-com-my[.]top, bukan maybank2u.com.my. Titik ditukar menjadi sempang supaya nama jenama kekal kelihatan betul pada pandangan pertama. Bank tidak menggantung akaun melalui pautan SMS."
  - tajuk: "Kod QR promosi di tempat awam"
    mesej: "Imbas untuk tuntut baucar RM50. Tawaran terhad kepada 100 pelanggan pertama hari ini."
    kenapa_bahaya: "Kod QR menyembunyikan alamat sepenuhnya sehingga ia dibuka. Pelekat QR palsu sering ditampal di atas kod sebenar pada meter letak kereta, poster dan resit. Semak alamat yang dipaparkan telefon anda sebelum meneruskan."
  - tajuk: "Halaman log masuk yang meminta OTP dua kali"
    mesej: "Pengesahan gagal. Sila masukkan semula nombor TAC yang dihantar ke telefon anda untuk meneruskan sesi anda."
    kenapa_bahaya: "Halaman itu bukan sedang mengesahkan apa-apa. Ia menghantar apa yang anda taip kepada sindiket, yang sedang log masuk ke akaun sebenar anda pada masa yang sama. Setiap OTP yang anda beri meluluskan satu transaksi atau satu pendaftaran peranti baharu."
  - tajuk: "E-mel “bayaran balik” dengan lampiran"
    mesej: "Tuntutan bayaran balik anda sebanyak RM842.60 telah diluluskan. Sila buka borang yang dilampirkan dan lengkapkan maklumat akaun bank untuk menerima bayaran dalam tempoh 3 hari bekerja."
    kenapa_bahaya: "Agensi kerajaan dan bank tidak meminta butiran akaun melalui lampiran e-mel. Borang itu mengumpul maklumat perbankan anda, dan sesetengah lampiran turut memasang perisian hasad."
langkah_pantas:
  - "Tutup halaman itu dan jangan masukkan apa-apa lagi, walaupun ia kata log masuk gagal."
  - "Jika anda sudah memasukkan kata laluan atau OTP, hubungi bank anda sekarang untuk menyekat akaun, kemudian tukar kata laluan perbankan dan e-mel."
  - "Jika anda sudah memasang aplikasi daripada pautan itu, matikan data mudah alih dan Wi-Fi, buang aplikasi tersebut, dan tetapkan semula peranti jika perlu."
  - "Jika duit sudah keluar, hubungi NSRC 997 dan buat laporan polis. Laporkan pautan dan nombor penghantar kepada MCMC."
kemas_kini: "2026-08-15"
---

## Cara ia bermula

Phishing tidak bermula dengan pautan. Ia bermula dengan satu ayat yang membuat anda tidak sempat berfikir.

Mesejnya sentiasa berbunyi seperti sesuatu yang perlu diselesaikan sekarang: akaun akan disekat, bayaran gagal, mata ganjaran akan luput, bayaran balik menunggu tuntutan, bungkusan tidak dapat dihantar. Ia mungkin tiba melalui SMS, WhatsApp, Telegram, e-mel, mesej Facebook, atau kod QR yang ditampal di tempat awam.

Pautan itu membawa anda ke halaman yang kelihatan betul. Logo betul, warna betul, susun atur betul — kerana ia disalin terus daripada laman sebenar. Satu-satunya perbezaan ialah alamat di bahagian atas pelayar.

Apa yang anda taip di halaman itu pergi terus kepada sindiket. Dalam banyak kes mereka sedang log masuk ke akaun sebenar anda pada saat yang sama, dan menggunakan anda sebagai mesin untuk membekalkan OTP. Sebab itulah halaman palsu sering berkata “gagal, cuba lagi” — setiap percubaan memberi mereka satu kod baharu.

## Cara baca alamat laman dengan betul

Ini kemahiran paling berguna dalam seluruh entri ini. Domain sebenar ialah **dua bahagian terakhir sebelum garis miring pertama**, dibaca dari kanan ke kiri.

```
https://www.maybank2u.com.my/2u/login
        └──────┬──────────┘ └───┬───┘
          domain sebenar      laluan (boleh ditulis apa sahaja)
```

Empat helah yang paling kerap digunakan:

| Alamat | Domain sebenar | Helah |
| --- | --- | --- |
| `maybank2u.com.my.secure-login.top` | `secure-login.top` | Nama jenama dijadikan subdomain |
| `maybank2u-com-my.xyz` | `maybank2u-com-my.xyz` | Titik ditukar kepada sempang |
| `secure-login.top/maybank2u.com.my` | `secure-login.top` | Nama jenama disorok dalam laluan |
| `mαybank2u.com.my` | domain punycode | Huruf Latin ditukar dengan aksara yang serupa |

Dua peraturan mudah yang menyelesaikan kebanyakan kes: laman rasmi kerajaan Malaysia **sentiasa** berakhir dengan `.gov.my`, dan bank tempatan menggunakan domain mereka sendiri yang boleh anda sahkan pada penyata atau di belakang kad.

## Kenapa ia berkesan

Kita membaca alamat laman seperti kita membaca ayat — sekali imbas, dari kiri ke kanan, dan berhenti sebaik sahaja nampak sesuatu yang dikenali. Sindiket membina alamat mereka khusus untuk kelemahan itu: nama jenama diletakkan di sebelah kiri, di mana mata kita berhenti.

Telefon menjadikannya lebih sukar lagi. Bar alamat pada skrin kecil memotong hujung alamat, iaitu bahagian yang paling penting. Kod QR pula tidak menunjukkan apa-apa sehingga anda membukanya.

Dan mesej itu sengaja dihantar pada waktu anda sibuk. Tekanan masa bukan kebetulan — ia sebahagian daripada reka bentuk.

## Cara lindung diri

Jangan buka pautan perbankan atau kerajaan daripada mesej. Buka aplikasi rasmi, atau taip alamat itu sendiri. Ini satu tabiat yang menutup hampir keseluruhan kategori scam ini.

Sebelum menaip apa-apa di halaman log masuk, berhenti dan baca alamat dari kanan ke kiri. Kalau anda tidak pasti, salin alamat itu dan semak melalui [alat semakan](/semak) portal ini — ia akan menunjukkan petunjuk teknikal pada alamat tersebut.

Anggap OTP sebagai tandatangan, bukan kata laluan. Ia meluluskan satu perbuatan tertentu. Baca teks SMS OTP itu sepenuhnya: jika ia menyebut pemindahan atau pendaftaran peranti sedangkan anda hanya cuba log masuk, hentikan segalanya dan hubungi bank.

Hidupkan pengesahan dua langkah di semua akaun penting, dan jangan sekali-kali memasang aplikasi daripada pautan yang dihantar kepada anda.

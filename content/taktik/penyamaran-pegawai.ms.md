---
slug: penyamaran-pegawai
nama: "Penyamaran pegawai kerajaan & bank"
ringkasan: "Panggilan, SMS atau mesej yang mendakwa datang daripada bank, LHDN, JPJ, KWSP atau syarikat telekomunikasi — untuk mendapatkan OTP, kata laluan atau pemasangan aplikasi."
risiko: sangat-tinggi
susunan: 6
platform:
  - panggilan
  - sms
  - whatsapp
  - e-mel
  - laman-web
juga_dikenali:
  - "Scam pegawai bank"
  - "Scam LHDN / JPJ / KWSP"
  - "Phishing OTP"
  - "Scam APK"
red_flags:
  - "Pemanggil mendakwa dari bank anda dan sudah tahu sebahagian butiran anda."
  - "Mesej mendesak: kad kredit anda telah dicaj, akaun akan disekat, insurans telah diaktifkan."
  - "Diminta mengesahkan identiti dengan memberi OTP, PIN, kata laluan atau jawapan soalan keselamatan."
  - "Diminta memasang aplikasi daripada pautan (fail APK) supaya masalah boleh “diselesaikan dari jauh”."
  - "Nombor pemanggil kelihatan sama dengan nombor rasmi bank — nombor boleh dipalsukan."
  - "SMS mengandungi pautan ke laman log masuk perbankan yang meniru laman sebenar."
  - "E-mel “LHDN” atau “KWSP” tentang bayaran balik yang memerlukan anda memasukkan butiran akaun."
  - "Diminta bertindak segera dan tidak menamatkan panggilan."
contoh_taktik:
  - tajuk: "Caj tidak dikenali pada kad kredit"
    mesej: "Ini dari unit penipuan bank. Kami mengesan transaksi RM4,299 di sebuah kedai elektronik di Johor. Jika ini bukan tuan, saya akan batalkan sekarang. Untuk membatalkan, sila sahkan kod 6 digit yang baru dihantar ke telefon tuan."
    kenapa_bahaya: "Kod itu bukan untuk membatalkan apa-apa. Ia membenarkan transaksi atau pendaftaran peranti baharu. Pegawai bank sebenar tidak akan meminta OTP dalam apa jua keadaan."
  - tajuk: "Pemasangan aplikasi sokongan"
    mesej: "Untuk membolehkan kami memeriksa akaun tuan, sila muat turun aplikasi sokongan kami di pautan ini dan benarkan kebenaran skrin. Ia hanya untuk tempoh panggilan ini."
    kenapa_bahaya: "Fail APK ini memberi sindiket keupayaan membaca skrin dan memintas SMS, termasuk OTP. Selepas dipasang, mereka boleh masuk ke akaun perbankan anda tanpa perlu bertanya apa-apa lagi."
  - tajuk: "Bayaran balik cukai"
    mesej: "LHDN: Anda layak menerima bayaran balik cukai sebanyak RM1,268.40. Sila kemas kini maklumat akaun bank anda sebelum 30 haribulan untuk menerima bayaran: hxxps://lhdn-refund-my[.]xyz"
    kenapa_bahaya: "Agensi kerajaan Malaysia menggunakan domain `.gov.my`. Laman ini direka untuk mengumpul butiran log masuk perbankan anda."
langkah_pantas:
  - "Tamatkan panggilan dan hubungi bank menggunakan nombor di belakang kad anda."
  - "Kalau OTP telah diberi, hubungi bank untuk menyekat akaun dan tukar kata laluan segera."
  - "Kalau aplikasi telah dipasang, tutup data mudah alih dan Wi-Fi, kemudian buang aplikasi itu dan tetapkan semula peranti jika perlu."
  - "Hubungi 997 dan buat laporan polis jika wang telah keluar."
kemas_kini: "2026-08-15"
---

## Cara ia bermula

Semua versi scam ini berkongsi satu tujuan: membuat anda menyerahkan kunci kepada akaun anda sendiri.

Ia mungkin datang sebagai panggilan daripada “unit penipuan bank” tentang caj yang mencurigakan. Ia mungkin datang sebagai SMS tentang insurans yang telah diaktifkan, atau e-mel LHDN tentang bayaran balik cukai. Kadangkala ia datang sebagai mesej daripada “syarikat telekomunikasi” tentang tuntutan mata ganjaran yang akan luput.

Bahagian yang meyakinkan adalah butiran. Mereka mungkin tahu nama penuh anda, empat digit terakhir kad anda, atau nama bank anda. Maklumat ini datang daripada kebocoran data yang dijual dalam talian.

Selepas kepercayaan terbentuk, permintaan sebenar muncul: sahkan kod 6 digit, masukkan kata laluan di laman yang dipautkan, atau pasang aplikasi supaya mereka boleh “membantu dari jauh”.

## Kenapa ia berkesan

Skrip ini membalikkan kedudukan. Anda tidak diminta memberi duit — anda diminta menghalang sesuatu yang buruk daripada berlaku. Rasa terdesak untuk melindungi wang sendiri membuat orang bertindak lebih cepat daripada rasa tamak.

Penyamaran nombor pemanggil menjadikannya lebih sukar. Nombor rasmi bank boleh dipaparkan pada skrin telefon anda walaupun panggilan datang dari tempat lain, jadi mengesahkan nombor pemanggil tidak memberi jaminan apa-apa.

## Cara lindung diri

Peraturannya ringkas dan tiada pengecualian: **tiada pegawai bank, polis atau kerajaan yang akan meminta OTP, kata laluan atau PIN anda.** Sesiapa yang meminta, tidak kira betapa meyakinkan mereka, bukan pegawai.

Tamatkan panggilan dan hubungi semula menggunakan nombor rasmi yang anda cari sendiri. Kalau panggilan itu benar, bank boleh mengesahkannya melalui talian rasmi mereka.

Jangan pasang aplikasi daripada pautan yang dihantar kepada anda. Muat turun hanya melalui gedung aplikasi rasmi, dan berhati-hati dengan sebarang aplikasi yang meminta kebenaran membaca SMS atau memaparkan di atas skrin lain.

Untuk urusan kerajaan, taip alamat laman sendiri dan pastikan ia berakhir dengan `.gov.my`.

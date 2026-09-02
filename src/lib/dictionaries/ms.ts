/**
 * Dictionary Bahasa Malaysia — sumber kebenaran untuk semua teks antara muka.
 *
 * Nada: memberi amaran dan mendidik. Bukan menakutkan, bukan menuduh.
 * Bahasa: mudah difahami orang awam. Elakkan istilah undang-undang/teknikal.
 *
 * PERATURAN: jangan sekali-kali guna perkataan yang membawa maksud
 * "disahkan scammer" / "terbukti bersalah". Rujuk src/lib/status.ts.
 */
export const ms = {
  meta: {
    title: 'Portal Semakan Scam Malaysia',
    titlePendek: 'Semakan Scam',
    titleTemplate: '%s — Portal Semakan Scam',
    description:
      'Belajar kenal taktik scam terkini di Malaysia dalam bahasa yang senang faham, dan tahu ke mana nak rujuk untuk semakan rasmi.',
  },
  nav: {
    skip: 'Terus ke kandungan utama',
    home: 'Utama',
    taktik: 'Taktik scam',
    taktikPendek: 'Taktik',
    semak: 'Semak',
    bantuan: 'Kalau dah kena',
    bantuanPendek: 'Bantuan',
    lapor: 'Lapor',
    berita: 'Berita',
    tentang: 'Tentang',
    moderasi: 'Moderasi',
    menu: 'Menu',
  },
  lang: {
    label: 'Bahasa',
    ms: 'BM',
    en: 'EN',
    switchTo: 'Tukar ke Bahasa Inggeris',
    current: 'Bahasa semasa: Bahasa Malaysia',
  },
  banner: {
    text: 'Portal komuniti — bukan portal rasmi kerajaan.',
    cta: 'Semak Mule (PDRM)',
    urgent: 'Baru kena? Telefon 997',
  },
  common: {
    kemasKini: 'Kemas kini',
    risiko: 'Tahap risiko',
    platform: 'Platform',
    jugaDikenali: 'Juga dikenali sebagai',
    redFlags: 'Tanda amaran (red flags)',
    contohMesej: 'Contoh mesej / skrip',
    kenapaBahaya: 'Kenapa ia berbahaya',
    caraBermula: 'Cara ia bermula',
    semua: 'Semua',
    cari: 'Cari',
    kosongkan: 'Kosongkan',
    tapis: 'Tapis',
    bacaLagi: 'Baca penuh',
    sumber: 'Sumber',
    pautanLuar: 'pautan keluar',
    salin: 'Salin',
    disalin: 'Disalin',
    contohAnonim:
      'Contoh di bawah ditulis semula (anonymized). Ia bukan tangkapan skrin sebenar mana-mana mangsa.',
    terjemahanBelumSedia:
      'Versi bahasa ini belum tersedia untuk entri ini. Teks Bahasa Malaysia dipaparkan.',
  },
  home: {
    eyebrow: 'Semak dulu, baru transfer',
    title: 'Kenal taktik scam sebelum ia kena pada anda',
    lead:
      'Setiap hari ada modus operandi baharu. Portal ini menerangkan cara setiap scam bermula, tanda amaran yang boleh anda perasan awal, dan ke mana nak rujuk untuk semakan rasmi.',
    searchTitle: 'Nak semak sesuatu?',
    searchLead:
      'Masukkan nombor telefon, nombor akaun bank, nama syarikat atau pautan laman web. Semakan dibuat dalam pelayar anda sahaja.',
    ctaSemak: 'Buka alat semakan',
    ctaTaktik: 'Lihat semua taktik scam',
    ctaBantuan: 'Saya rasa saya dah kena',
    taktikTitle: 'Modus operandi yang paling kerap',
    taktikLead: 'Klik mana-mana kategori untuk lihat tanda amaran dan contoh mesej sebenar yang ditulis semula.',
    taktikSemua: 'Lihat semua kategori',
    caraTitle: 'Macam mana portal ini berfungsi',
    caraSteps: [
      {
        tajuk: 'Belajar',
        teks: 'Baca ensiklopedia modus operandi — ditulis untuk orang awam, bukan untuk penguat kuasa.',
      },
      {
        tajuk: 'Semak',
        teks: 'Gunakan alat semakan untuk kenal pasti jenis maklumat yang anda ada, kemudian rujuk semakan rasmi di Semak Mule.',
      },
      {
        tajuk: 'Bertindak',
        teks: 'Kalau dah terlanjur bayar, ikut langkah 997 secepat mungkin. Jam pertama paling penting.',
      },
    ],
    hadTitle: 'Apa portal ini tidak buat',
    hadItems: [
      'Kami tidak membina atau meniru pangkalan data rekod jenayah. Semakan rasmi kekal di Semak Mule (PDRM).',
      'Kami tidak melabel sesiapa sebagai “scammer yang disahkan”. Hanya PDRM dan mahkamah boleh menentukan status jenayah.',
      'Kami tidak menggantikan laporan polis atau talian NSRC 997.',
    ],
    hadCta: 'Baca tentang skop & had portal ini',
  },
  taktik: {
    title: 'Ensiklopedia taktik scam',
    lead:
      'Setiap entri menerangkan cara scam itu bermula, tanda amaran yang boleh anda perasan, dan contoh mesej yang ditulis semula supaya anda kenal gayanya.',
    cariPlaceholder: 'Cari taktik, cth. “loan”, “parcel”, “OTP”',
    tapisPlatform: 'Tapis ikut platform',
    tapisRisiko: 'Tapis ikut tahap risiko',
    hasil: '{n} kategori dipaparkan',
    tiadaHasil: 'Tiada kategori sepadan dengan tapisan anda.',
    tiadaHasilCta: 'Kosongkan tapisan',
    kategoriTiadaTitle: 'Kategori tidak dijumpai',
    kategoriTiadaLead: 'Entri yang anda cari mungkin telah dipindahkan atau belum diterbitkan.',
    kembali: 'Kembali ke semua taktik',
    langkahPantasTitle: 'Kalau anda dah terlanjur',
    langkahPantasCta: 'Lihat langkah penuh 997',
    ringkasanNav: 'Dalam entri ini',
  },
  semak: {
    title: 'Alat semakan',
    lead:
      'Masukkan nombor telefon, nombor akaun bank, nama syarikat atau pautan. Alat ini akan kenal pasti jenis maklumat anda dan tunjukkan langkah semakan rasmi yang betul.',
    placeholder: 'Cth. 012-345 6789, 1234567890, atau contoh-tipu.xyz',
    label: 'Maklumat yang nak disemak',
    butang: 'Semak',
    reset: 'Semak benda lain',
    privasiNota:
      'Carian anda tidak dihantar ke pelayan kami dan tidak disimpan. Semuanya berlaku dalam pelayar anda.',
    privasiPautan: 'Cara kami jaga privasi carian',
    kosongRalat: 'Sila masukkan sesuatu untuk disemak.',
    hasilTitle: 'Hasil semakan',
    dikenalPastiSebagai: 'Dikenal pasti sebagai',
    bolehJadiJuga: 'Boleh jadi juga',
    rasmiTitle: 'Langkah semakan rasmi',
    rasmiLead:
      'Portal ini tidak menyimpan rekod jenayah. Untuk semakan berstatus rasmi, gunakan portal PDRM di bawah.',
    semakMuleCta: 'Semak rasmi di Semak Mule',
    semakMuleNota: 'Pautan keluar ke semakmule.rmp.gov.my (laman rasmi PDRM).',
    komunitiTitle: 'Laporan komuniti',
    komunitiMenyemak: 'Menyemak laporan komuniti…',
    komunitiTiada:
      'Tiada laporan komuniti yang sepadan. Ini BUKAN bermakna ia selamat — kebanyakan nombor yang digunakan untuk menipu tidak pernah dilaporkan oleh sesiapa.',
    komunitiAda: '{n} laporan komuniti sepadan dengan maklumat ini.',
    komunitiLihat: 'Lihat laporan',
    komunitiPrivasi:
      'Semakan ini menggunakan padanan separa: pelayar anda menghantar hanya 5 aksara pertama cap jari maklumat tersebut, jadi pelayan tidak tahu apa yang anda cari.',
    komunitiRalat: 'Semakan laporan komuniti tidak dapat dijalankan sekarang. Sila guna semakan rasmi di bawah.',
    komunitiStatusCta: 'Bagaimana status laporan berfungsi',
    laporCta: 'Laporkan kepada komuniti',
    laporNota:
      'Laporan komuniti adalah amaran awal, bukan laporan polis. Untuk kes yang baru berlaku, hubungi 997 dahulu.',
    kinds: {
      telefon: 'Nombor telefon',
      akaun_bank: 'Nombor akaun bank',
      url: 'Pautan / laman web',
      syarikat: 'Nama syarikat atau orang',
      kosong: 'Tiada input',
    },
    panduan: {
      telefon: [
        'Semak nombor ini di Semak Mule (PDRM) — ia menunjukkan sama ada nombor pernah dilaporkan dalam kes penipuan.',
        'Nombor yang “bersih” tidak bermakna selamat. Nombor baharu digunakan setiap hari.',
        'Jangan sekali-kali kongsi OTP walaupun pemanggil kata dia dari bank, polis atau kurier.',
      ],
      akaun_bank: [
        'Semak nombor akaun ini di Semak Mule sebelum buat sebarang pemindahan.',
        'Kalau penjual minta bayaran ke akaun atas nama orang lain, itu tanda amaran besar.',
        'Simpan tangkapan skrin butiran akaun sebelum anda bayar — ia diperlukan kalau anda perlu buat laporan.',
      ],
      url: [
        'Periksa ejaan domain huruf demi huruf. Kebanyakan laman phishing hanya berbeza satu atau dua huruf.',
        'Jangan log masuk perbankan melalui pautan dalam SMS atau WhatsApp. Taip alamat bank sendiri atau guna aplikasi rasmi.',
        'Laman rasmi kerajaan Malaysia berakhir dengan .gov.my.',
      ],
      syarikat: [
        'Semak sama ada syarikat berdaftar dengan SSM, dan sama ada ia disenaraikan dalam Senarai Amaran Kewangan Bank Negara.',
        'Cari nama syarikat bersama perkataan “scam” atau “tipu” di enjin carian sebelum berurusan.',
        'Untuk pelaburan, semak lesen di laman Suruhanjaya Sekuriti. Pulangan “terjamin” adalah tanda amaran.',
      ],
      kosong: [],
    },
    hints: {
      title: 'Petunjuk automatik pada alamat ini',
      lead:
        'Ini pemerhatian teknikal ringkas pada alamat yang anda masukkan — bukan pengesahan bahawa ia scam. Laman yang tiada petunjuk pun boleh jadi berbahaya.',
      pelajariCta: 'Belajar kenal pautan phishing',
      tiada: 'Tiada petunjuk teknikal dikesan pada alamat ini. Ia tetap tidak bermakna laman ini selamat.',
      codes: {
        bukan_https: 'Alamat menggunakan http:// dan bukan https:// — sambungan tidak disulitkan.',
        alamat_ip: 'Alamat menggunakan nombor IP dan bukan nama domain. Laman rasmi jarang berbuat begini.',
        punycode: 'Domain mengandungi aksara bukan Latin yang disamarkan (punycode) — kerap digunakan untuk meniru nama jenama.',
        pemendek_url: 'Ini pautan pendek. Destinasi sebenar tersembunyi sehingga anda klik.',
        tiru_gov: 'Alamat mengandungi perkataan berkaitan kerajaan tetapi tidak berakhir dengan .gov.my.',
        tiru_jenama: 'Alamat mengandungi nama jenama terkenal tetapi domainnya bukan domain rasmi jenama itu.',
        subdomain_panjang: 'Alamat mempunyai banyak subdomain — teknik biasa untuk menyembunyikan domain sebenar.',
        tld_kerap_disalahguna: 'Hujung domain ini kerap digunakan dalam kempen penipuan. Ia bukan bukti, cuma sebab untuk lebih berhati-hati.',
        domain_pelik: 'Nama domain mengandungi banyak sempang atau nombor — corak biasa bagi domain yang dijana pukal.',
      },
    },
  },
  bantuan: {
    title: 'Kalau dah kena scam',
    lead:
      'Tarik nafas. Anda bukan orang bodoh — sindiket ini bekerja penuh masa untuk menipu orang. Yang penting sekarang adalah kelajuan.',
    masaTitle: 'Jam pertama paling penting',
    masaLead:
      'Duit yang baru dipindahkan kadangkala masih boleh dibekukan jika bank dan NSRC dimaklumkan dengan cepat. Selepas duit dikeluarkan atau dipecahkan ke akaun lain, peluang itu mengecil dengan mendadak.',
    langkahTitle: 'Langkah demi langkah',
    langkah: [
      {
        tajuk: 'Berhenti bayar dan putuskan hubungan',
        teks: 'Jangan hantar apa-apa lagi, walaupun mereka kata “sikit lagi untuk lepaskan duit”. Permintaan bayaran tambahan selepas anda mula ragu adalah sebahagian daripada skrip.',
      },
      {
        tajuk: 'Hubungi bank anda serta-merta',
        teks: 'Guna nombor rasmi di belakang kad atau dalam aplikasi bank — bukan nombor yang diberi oleh pemanggil. Minta transaksi disekat dan minta nombor rujukan aduan.',
      },
      {
        tajuk: 'Telefon NSRC 997',
        teks: 'Talian Pusat Respons Penipuan Kebangsaan. Mereka menyelaras antara bank dan polis untuk cuba membekukan akaun penerima.',
      },
      {
        tajuk: 'Buat laporan polis',
        teks: 'Pergi ke balai polis terdekat. Laporan polis diperlukan untuk siasatan rasmi dan untuk sebarang tuntutan kemudian. Bawa semua bukti yang anda ada.',
      },
      {
        tajuk: 'Kumpul dan simpan bukti',
        teks: 'Tangkapan skrin perbualan, resit pemindahan, nombor akaun penerima, nama akaun, nombor telefon, pautan laman web dan nama profil media sosial.',
      },
      {
        tajuk: 'Amankan akaun digital anda',
        teks: 'Tukar kata laluan perbankan dan e-mel, aktifkan pengesahan dua langkah, dan buang mana-mana aplikasi yang anda dipasang atas arahan mereka.',
      },
      {
        tajuk: 'Jaga diri anda',
        teks: 'Rasa malu dan marah selepas kena tipu adalah normal. Bercakap dengan orang yang anda percaya, dan hubungi talian sokongan jika ia mula menjejaskan kesihatan anda.',
      },
    ],
    siapkanTitle: 'Siapkan maklumat ini sebelum telefon 997',
    siapkan: [
      'Nombor akaun bank penerima dan nama pada akaun itu',
      'Jumlah yang dipindahkan dan masa transaksi',
      'Nombor rujukan transaksi daripada aplikasi bank anda',
      'Nombor telefon, ID Telegram atau profil media sosial yang menghubungi anda',
      'Ringkasan pendek apa yang berlaku mengikut urutan masa',
    ],
    saluranTitle: 'Saluran rasmi',
    saluranLead: 'Semua pautan di bawah adalah laman rasmi. Kami hanya merujuk anda ke sana.',
    jangkaanTitle: 'Apa yang boleh dijangka',
    jangkaan: [
      'Membuat laporan tidak menjamin duit akan kembali. Pembekuan hanya berjaya jika duit masih ada dalam akaun penerima.',
      'Siasatan mengambil masa. Simpan nombor rujukan laporan anda untuk membuat susulan.',
      'Sesiapa yang menawarkan “khidmat pulihkan duit” dengan bayaran pendahuluan hampir pasti adalah scam kedua ke atas anda.',
    ],
    emosiTitle: 'Sokongan emosi',
    emosiLead:
      'Kalau anda rasa tertekan, malu atau tidak mampu berfungsi seperti biasa, hubungi talian sokongan. Ia percuma dan sulit.',
    emosiTalian: [
      { nama: 'Talian Kasih (KPWKM)', nombor: '15999' },
      { nama: 'Befrienders KL', nombor: '03-7627 2929' },
    ],
  },
  laporan: {
    title: 'Sistem status laporan komuniti',
    lead:
      'Setiap laporan komuniti membawa satu daripada tiga status di bawah. Tiada satu pun bermaksud pengesahan jenayah — hanya PDRM dan mahkamah boleh menentukannya.',
    kenapaTitle: 'Kenapa label ini penting',
    kenapaLead:
      'Satu laporan orang awam bukan bukti jenayah. Label yang salah boleh memusnahkan nama seseorang yang tidak bersalah — termasuk mangsa yang akaunnya dicuri untuk dijadikan akaun keldai. Sebab itu tiada satu pun status di bawah bermaksud “disahkan”.',
    statusTitle: 'Tiga status yang digunakan',
    peraturanTitle: 'Peraturan tetap',
    peraturan: [
      'Tiada laporan diterbitkan secara automatik. Setiap laporan disemak moderator dahulu.',
      'Label kekal “dilaporkan” walaupun sepuluh orang melapor perkara yang sama. Bilangan ditunjukkan, bukan status dinaik taraf.',
      'Pihak yang dinamakan boleh membantah, dan penjelasan mereka dipaparkan bersama laporan.',
      'Setiap tindakan moderator direkod dalam log audit: siapa, apa tindakan, bila.',
    ],
    hakCta: 'Saluran hak menjawab',
  },
  hakMenjawab: {
    title: 'Hak menjawab',
    lead:
      'Kalau nama, nombor telefon, nombor akaun atau perniagaan anda disebut dalam laporan di portal ini, anda berhak membantah dan memberi penjelasan.',
    siapaTitle: 'Siapa boleh guna saluran ini',
    siapa: [
      'Individu yang nombor telefon atau nombor akaunnya disebut dalam sesuatu laporan.',
      'Perniagaan atau syarikat yang namanya disebut.',
      'Wakil yang diberi kuasa oleh mana-mana pihak di atas.',
    ],
    caraTitle: 'Cara membuat bantahan',
    cara: [
      'Hantar e-mel ke alamat di bawah dengan pautan atau rujukan laporan berkenaan.',
      'Nyatakan bahagian mana yang anda pertikaikan dan sebabnya.',
      'Sertakan apa-apa dokumen sokongan jika ada, contohnya laporan polis anda sendiri jika akaun anda telah dicuri.',
    ],
    prosesTitle: 'Apa yang berlaku selepas itu',
    proses: [
      'Kami mengakui penerimaan dalam tempoh 3 hari bekerja.',
      'Laporan berkenaan ditandakan “Dipertikai” sementara semakan dijalankan, dan penjelasan anda dipaparkan bersamanya.',
      'Keputusan semakan dimaklumkan dalam tempoh 14 hari bekerja: laporan kekal dengan status dipertikai, dipinda, atau dibuang sepenuhnya.',
      'Setiap tindakan direkod dalam log audit kami.',
    ],
    pdpaTitle: 'Permintaan pembetulan atau pembuangan data',
    pdpaLead:
      'Di bawah Akta Perlindungan Data Peribadi 2010, anda boleh meminta akses, pembetulan atau pembuangan data peribadi anda. Gunakan alamat e-mel yang sama dan nyatakan permintaan anda dengan jelas.',
    kontakTitle: 'Hubungi kami',
    kontakNota:
      'Sila ganti alamat ini dengan alamat sebenar pasukan anda sebelum portal dilancarkan kepada orang awam.',
  },
  privasi: {
    title: 'Notis privasi',
    lead:
      'Notis ini menerangkan data apa yang kami kumpul, kenapa, berapa lama disimpan, dan bagaimana anda boleh meminta pembetulan atau pembuangan — seperti dikehendaki Akta Perlindungan Data Peribadi 2010 (PDPA).',
    carianTitle: 'Carian anda tidak disimpan',
    carianLead:
      'Alat semakan berjalan sepenuhnya dalam pelayar anda. Nombor telefon, nombor akaun, nama atau pautan yang anda taip tidak dihantar ke pelayan kami, tidak direkod, dan tidak dikaitkan dengan anda.',
    carianButiran: [
      'Kami tidak menyimpan log carian yang mengandungi teks carian anda.',
      'Teks carian tidak dimasukkan ke dalam alamat URL, jadi ia tidak bocor melalui sejarah pelayar atau pautan yang anda kongsi.',
      'Apabila anda klik keluar ke Semak Mule, pelayan kami menetapkan dasar “no-referrer” supaya laman itu tidak diberitahu dari mana anda datang.',
      'Jika kami perlu mengukur penggunaan pada masa hadapan, kami hanya akan merekod jenis carian (contohnya “telefon”) tanpa teks carian dan tanpa pengenalan pengguna.',
    ],
    kumpulTitle: 'Apa yang kami kumpul sekarang',
    kumpul: [
      { apa: 'Pilihan bahasa', kenapa: 'Untuk mengingati sama ada anda mahu BM atau EN.', simpan: 'Cookie selama 1 tahun. Tiada pengenalan pengguna di dalamnya.' },
      { apa: 'Log pelayan asas', kenapa: 'Diperlukan untuk menyampaikan laman dan mengesan penyalahgunaan.', simpan: 'Dikendalikan oleh penyedia hosting mengikut tetapan lalai mereka. Kami tidak menggunakannya untuk profil pengguna.' },
      { apa: 'Kandungan laporan komuniti', kenapa: 'Untuk menilai laporan dan, jika ia diterbitkan, memberi amaran awal kepada orang lain.', simpan: 'Dua tahun dari tarikh laporan, kemudian dibuang jika tidak lagi diperlukan.' },
      { apa: 'E-mel pelapor (pilihan)', kenapa: 'Supaya moderator boleh menghubungi anda jika laporan perlu dijelaskan.', simpan: 'Bersama laporan berkenaan. Tidak pernah dipaparkan kepada orang awam.' },
      { apa: 'Imej bukti (pilihan)', kenapa: 'Untuk membantu moderator menilai laporan.', simpan: 'Akses terhad kepada moderator. Metadata imej dibuang sebelum penyimpanan.' },
      { apa: 'Butiran bantahan hak menjawab', kenapa: 'Untuk mengendalikan bantahan dan memaklumkan keputusan kepada anda.', simpan: 'Bersama rekod bantahan dan log audit berkaitan.' },
      { apa: 'Alamat e-mel digest (opt-in)', kenapa: 'Untuk menghantar digest mingguan yang anda minta.', simpan: 'Sehingga anda berhenti melanggan. Berhenti membuang alamat anda sepenuhnya, bukan sekadar menandanya.' },
    ],
    fasaTitle: 'Apabila anda menghantar laporan komuniti',
    fasaLead:
      'Borang laporan mengumpul data peribadi, jadi prinsip berikut terpakai pada setiap laporan yang dihantar.',
    fasa: [
      'Borang hanya meminta maklumat yang benar-benar perlu untuk menilai laporan.',
      'Memberi e-mel adalah pilihan. Laporan tanpa nama diterima sepenuhnya.',
      'Persetujuan PDPA diminta melalui kotak semak sebelum penghantaran, bukan tersembunyi dalam terma.',
      'Bukti imej hanya boleh dilihat oleh moderator yang telah log masuk. Metadata imej, termasuk koordinat GPS, dibuang secara automatik sebelum fail disimpan.',
      'E-mel pelapor tidak pernah dipaparkan kepada orang awam.',
      'Data peribadi disimpan selama dua tahun dari tarikh laporan, kemudian dibuang jika ia tidak lagi diperlukan.',
      'Anda boleh meminta akses, pembetulan atau pembuangan data anda pada bila-bila masa.',
    ],
    hakTitle: 'Hak anda',
    hakLead:
      'Anda berhak meminta akses kepada data peribadi anda, meminta pembetulan jika ia tidak tepat, menarik balik persetujuan, dan meminta pembuangan. Kami akan membalas dalam tempoh 14 hari bekerja.',
    hakCta: 'Buat permintaan atau bantahan',
    kemasKiniTitle: 'Perubahan pada notis ini',
    kemasKiniLead:
      'Jika kami mengubah cara data dikendalikan, notis ini dikemas kini dan tarikh di bawah ditukar sebelum perubahan berkuat kuasa.',
  },
  tentang: {
    title: 'Tentang portal ini',
    lead:
      'Portal Semakan Scam Malaysia adalah projek komuniti. Ia melengkapkan — bukan menggantikan — sistem rasmi kerajaan.',
    tujuanTitle: 'Kenapa portal ini wujud',
    tujuanLead:
      'Sistem rasmi menjawab soalan “adakah nombor ini pernah dilaporkan?”. Ia tidak menerangkan secara terbuka bagaimana setiap scam berfungsi, atau apa yang patut anda perasan sebelum anda jadi mangsa. Itu jurang yang portal ini cuba isi.',
    bezaTitle: 'Beza dengan sistem rasmi',
    bezaRasmiTitle: 'Sistem rasmi',
    bezaRasmi: [
      'Semak Mule (PDRM) — semakan rekod laporan penipuan.',
      'NSRC 997 — respons segera untuk kes yang baru berlaku.',
      'National Fraud Portal — penyelarasan antara bank dan penguat kuasa.',
    ],
    bezaKamiTitle: 'Portal ini',
    bezaKami: [
      'Ensiklopedia modus operandi dalam bahasa orang awam.',
      'Alat semakan yang menerangkan langkah rasmi yang betul untuk setiap jenis maklumat.',
      'Lapisan laporan komuniti sebagai amaran awal, dengan status yang tidak pernah mengesahkan jenayah.',
    ],
    fasaTitle: 'Peringkat pembangunan',
    fasaSekarang: 'Versi semasa (MVP)',
    fasaSekarangItems: [
      'Ensiklopedia modus operandi dengan kategori teras',
      'Alat semakan yang merujuk keluar ke Semak Mule',
      'Laporan komuniti dengan moderasi wajib sebelum penerbitan',
      'Papan pemuka moderasi dengan log audit',
      'Suapan berita & amaran, ditag mengikut kategori ensiklopedia',
      'Digest e-mel mingguan dengan pengesahan dua langkah',
      'Panduan langkah demi langkah “kalau dah kena scam”',
      'Notis privasi PDPA dan saluran hak menjawab',
    ],
    fasaSeterusnya: 'Fasa akan datang',
    fasaSeterusnyaItems: [
      'Pengumpulan berita automatik daripada kenyataan media rasmi',
      'Akaun pengguna untuk menjejak status laporan sendiri',
      'Pengesahan moderator melalui SSO organisasi',
    ],
    kandunganTitle: 'Dari mana kandungan ini datang',
    kandunganLead:
      'Entri ensiklopedia disusun daripada amaran awam pihak berkuasa, laporan media dan corak yang dilaporkan berulang kali oleh orang ramai. Contoh mesej ditulis semula sepenuhnya — kami tidak menyiarkan tangkapan skrin perbualan sebenar mangsa.',
    hadTitle: 'Had portal ini',
    hadItems: [
      'Kami bukan agensi penguat kuasa dan tidak boleh menyiasat, membekukan akaun atau memulangkan duit.',
      'Kami tidak menyimpan salinan pangkalan data rekod jenayah mana-mana agensi.',
      'Ketiadaan sesuatu nombor di portal ini bukan bukti ia selamat.',
      'Maklumat di sini bersifat pendidikan am dan bukan nasihat undang-undang.',
    ],
    sumbanganTitle: 'Sumbangan dan pembetulan',
    sumbanganLead:
      'Jumpa maklumat yang salah atau sudah lapuk? Beritahu kami. Pembetulan fakta adalah keutamaan.',
  },
  lapor: {
    title: 'Laporkan kepada komuniti',
    lead:
      'Laporan anda menjadi amaran awal untuk orang lain. Ia disemak oleh moderator dahulu, dan ia tidak akan pernah dilabel sebagai pengesahan jenayah.',
    amaranTitle: 'Baca dulu sebelum hantar',
    amaran: [
      'Laporan ini bukan laporan polis. Untuk kes yang baru berlaku, hubungi NSRC 997 dan buat laporan polis — itu yang membolehkan siasatan dan pembekuan akaun.',
      'Tulis apa yang benar-benar berlaku kepada anda sahaja. Jangan menuduh, dan jangan salin cerita orang lain.',
      'Jangan masukkan nombor kad pengenalan, nombor kad bank penuh, atau maklumat peribadi orang lain yang tidak berkaitan.',
      'Pihak yang dinamakan berhak membantah dan memberi penjelasan. Laporan yang tidak dapat disokong akan dibuang.',
    ],
    medan: {
      jenis: 'Jenis maklumat',
      jenisPilih: 'Pilih satu',
      nilai: 'Maklumat yang dilaporkan',
      nilaiBantuan: 'Contoh: nombor telefon, nombor akaun bank, alamat laman web, atau nama syarikat.',
      kategori: 'Kategori scam',
      kategoriKosong: 'Saya tidak pasti',
      penerangan: 'Apa yang berlaku',
      peneranganBantuan: 'Ceritakan mengikut urutan masa. Sekurang-kurangnya 20 aksara.',
      bukti: 'Bukti (pilihan)',
      buktiBantuan:
        'Imej JPG, PNG atau WEBP, maksimum 3 fail dan 5 MB setiap satu. Metadata imej termasuk lokasi GPS dibuang secara automatik sebelum disimpan. Hanya moderator boleh melihat fail ini.',
      emel: 'E-mel anda (pilihan)',
      emelBantuan:
        'Hanya digunakan jika moderator perlu menjelaskan sesuatu tentang laporan anda. Laporan tanpa nama diterima sepenuhnya.',
      pdpa:
        'Saya faham laporan ini akan disemak moderator, dan saya bersetuju maklumat yang saya berikan diproses untuk tujuan itu di bawah Akta Perlindungan Data Peribadi 2010.',
    },
    jenis: {
      telefon: 'Nombor telefon',
      akaun_bank: 'Nombor akaun bank',
      url: 'Laman web / pautan',
      syarikat: 'Nama syarikat atau perniagaan',
      profil_sosial: 'Profil media sosial',
      lain: 'Lain-lain',
    },
    hantar: 'Hantar laporan',
    menghantar: 'Menghantar…',
    ralat: {
      wajib: 'Medan ini wajib diisi.',
      terlalu_pendek: 'Terlalu pendek. Sila beri sedikit lagi butiran.',
      terlalu_panjang: 'Terlalu panjang. Sila ringkaskan.',
      tidak_sah: 'Nilai ini tidak sah.',
      pdpa: 'Persetujuan diperlukan sebelum laporan boleh dihantar.',
      umum: 'Laporan tidak dapat dihantar. Sila cuba lagi.',
      kadar: 'Terlalu banyak laporan dihantar dari peranti ini. Sila cuba lagi sebentar nanti.',
      bukti_jenis: 'Hanya fail imej JPG, PNG atau WEBP diterima.',
      bukti_saiz: 'Fail terlalu besar. Maksimum 5 MB setiap satu.',
      bukti_banyak: 'Maksimum 3 fail bukti.',
    },
    jayaTitle: 'Laporan anda telah diterima',
    jayaLead:
      'Laporan anda kini dalam giliran semakan. Ia belum dipaparkan kepada orang awam dan tidak akan dipaparkan sehingga seorang moderator menyemaknya.',
    jayaLangkah: [
      'Moderator menyemak laporan anda secara manual.',
      'Jika ia diterbitkan, ia dilabel "Dilaporkan komuniti" — bukan pengesahan jenayah.',
      'Pihak yang dinamakan boleh membantah, dan penjelasan mereka akan dipaparkan bersama laporan.',
    ],
    jayaRasmi: 'Kalau anda kehilangan wang, jangan berhenti di sini. Hubungi 997 dan buat laporan polis.',
    kembali: 'Kembali ke halaman utama',
  },
  laporanAwam: {
    title: 'Laporan komuniti',
    tidakDijumpai: 'Laporan ini tidak dijumpai atau belum diterbitkan.',
    dilaporkanPada: 'Dilaporkan pada',
    kategoriLabel: 'Kategori',
    jenisLabel: 'Jenis maklumat',
    peneranganLabel: 'Apa yang dilaporkan',
    penafian:
      'Ini laporan daripada orang awam, bukan rekod rasmi. Ia tidak bermakna satu jenayah telah disahkan. Untuk semakan berstatus rasmi, gunakan Semak Mule (PDRM).',
    sokongTitle: 'Perkara sama berlaku kepada anda?',
    sokongLead:
      'Jika anda juga berdepan perkara yang sama dengan maklumat ini, anda boleh menyokong laporan ini. Bilangan pelapor akan ditunjukkan, tetapi status laporan kekal "dilaporkan".',
    sokongCta: 'Saya juga mengalaminya',
    sokongJaya: 'Terima kasih. Sokongan anda telah direkodkan.',
    bantahTitle: 'Ini tentang anda atau perniagaan anda?',
    bantahLead:
      'Anda berhak membantah dan memberi penjelasan. Laporan ini akan ditanda "Dipertikai" sementara semakan dijalankan, dan penjelasan anda dipaparkan bersamanya.',
    bantahCta: 'Hantar bantahan',
    bantahNama: 'Nama anda',
    bantahEmel: 'E-mel untuk kami hubungi',
    bantahHujah: 'Penjelasan anda',
    bantahPdpa:
      'Saya bersetuju maklumat hubungan saya diproses untuk tujuan mengendalikan bantahan ini sahaja.',
    bantahJaya:
      'Bantahan anda telah diterima. Laporan ini kini ditanda "Dipertikai" dan kami akan menghubungi anda dalam tempoh 3 hari bekerja.',
    bantahSedia: 'Penjelasan daripada pihak yang dinamakan',
  },
  moderasi: {
    title: 'Papan pemuka moderasi',
    lead: 'Semak laporan komuniti sebelum ia dipaparkan kepada orang awam.',
    masukTitle: 'Log masuk moderator',
    masukId: 'ID moderator',
    masukToken: 'Token',
    masukCta: 'Log masuk',
    masukGagal: 'ID atau token tidak sah.',
    masukLalai:
      'Akaun demo pembangunan sedang digunakan (ID "demo"). Tetapkan MODERATOR_AKAUN dan SESSION_SECRET sebelum pelancaran.',
    masukTiada:
      'Moderasi belum dikonfigurasi. Tetapkan MODERATOR_AKAUN dalam persekitaran pelayan sebelum menggunakan papan pemuka ini.',
    keluar: 'Log keluar',
    sebagai: 'Log masuk sebagai',
    giliranTitle: 'Giliran semakan',
    giliranKosong: 'Tiada laporan menunggu semakan.',
    tersiarTitle: 'Laporan tersiar',
    tersiarKosong: 'Belum ada laporan yang diterbitkan.',
    logTitle: 'Log audit',
    logKosong: 'Belum ada tindakan direkodkan.',
    logLajur: { tarikh: 'Tarikh', moderator: 'Moderator', tindakan: 'Tindakan', laporan: 'Laporan', sebab: 'Sebab' },
    buktiTitle: 'Bukti',
    buktiTiada: 'Tiada bukti dilampirkan.',
    sebabLabel: 'Catatan (pilihan)',
    tindakan: {
      terima: 'Terbitkan sebagai dilaporkan',
      tolak: 'Tolak',
      tanda_dipertikai: 'Tanda dipertikai',
      buang: 'Buang',
      buka_semula: 'Buka semula',
    },
    tindakanNota:
      'Setiap tindakan direkodkan dalam log audit bersama ID anda dan masa. Terbitkan hanya jika laporan cukup jelas dan tidak menuduh pihak yang tidak berkaitan.',
    pelaporEmel: 'E-mel pelapor',
    tanpaNama: 'Tanpa nama',
    sokongan: 'Sokongan',
  },
  berita: {
    title: 'Suapan berita & amaran',
    lead:
      'Ringkasan pendek tentang taktik semasa dan saluran rasmi, ditag mengikut kategori yang sama seperti ensiklopedia. Setiap entri memautkan balik ke sumber asalnya.',
    cariPlaceholder: 'Cari tajuk atau sumber',
    tapisTag: 'Tapis ikut kategori',
    hasil: '{n} entri dipaparkan',
    tiada: 'Tiada entri sepadan dengan tapisan anda.',
    kosongkan: 'Kosongkan tapisan',
    jenisLabel: {
      berita: 'Berita',
      amaran: 'Amaran',
    },
    jenisNota: {
      berita: 'Ringkasan sesuatu yang diterbitkan di tempat lain. Baca sumber asal untuk butiran penuh.',
      amaran: 'Nota amaran yang ditulis oleh pasukan portal ini, bukan laporan sesuatu peristiwa.',
    },
    sumberLabel: 'Sumber',
    bacaSumber: 'Baca di sumber asal',
    sumberNota:
      'Kami meringkaskan dalam ayat kami sendiri dan tidak menyalin teks penuh. Untuk butiran rasmi, rujuk sumber asal.',
    kembali: 'Kembali ke suapan berita',
    tidakDijumpai: 'Entri ini tidak dijumpai.',
    kategoriBerkaitan: 'Kategori berkaitan',
    beritaUntukKategori: 'Berita & amaran berkaitan',
    lihatSemua: 'Lihat suapan berita',
  },
  digest: {
    title: 'Digest e-mel mingguan',
    lead:
      'Satu e-mel seminggu dengan entri baharu. Tiada iklan, tiada perkongsian alamat anda dengan pihak lain, dan anda boleh berhenti pada bila-bila masa.',
    emel: 'Alamat e-mel anda',
    emelBantuan: 'Kami hanya menggunakannya untuk menghantar digest ini.',
    pdpa:
      'Saya bersetuju alamat e-mel saya diproses untuk tujuan menghantar digest mingguan ini di bawah Akta Perlindungan Data Peribadi 2010.',
    hantar: 'Langgan digest',
    menghantar: 'Menghantar…',
    jaya:
      'Jika alamat itu boleh dilanggan, kami telah menghantar satu e-mel pengesahan. Langganan hanya aktif selepas anda klik pautan di dalamnya.',
    nota:
      'Kami tidak memberitahu sama ada alamat itu sudah berada dalam senarai — jawapan yang sama diberikan setiap kali supaya borang ini tidak boleh digunakan untuk menguji alamat orang lain.',
    ralat: {
      emel: 'Alamat e-mel itu tidak sah.',
      pdpa: 'Persetujuan diperlukan sebelum anda boleh melanggan.',
      kadar: 'Terlalu banyak percubaan dari peranti ini. Sila cuba lagi sebentar nanti.',
      umum: 'Langganan tidak dapat diproses sekarang. Sila cuba lagi.',
    },
    sahkanTitle: 'Pengesahan langganan',
    sahkanJaya: 'Langganan anda telah disahkan. Anda akan menerima digest mingguan yang seterusnya.',
    sahkanGagal:
      'Pautan pengesahan ini tidak sah atau telah digantikan oleh permintaan yang lebih baharu. Sila langgan semula.',
    berhentiTitle: 'Berhenti melanggan',
    berhentiJaya: 'Anda telah berhenti melanggan dan alamat e-mel anda telah dibuang daripada senarai kami.',
    berhentiGagal: 'Pautan ini tidak sah, atau alamat itu telah pun dibuang.',
    emelSubjek: 'Sahkan langganan digest Portal Semakan Scam',
    emelTeks:
      'Seseorang meminta digest mingguan Portal Semakan Scam dihantar ke alamat ini.\n\nJika ia anda, sahkan langganan di sini:\n{sahkan}\n\nJika bukan anda, abaikan e-mel ini — tiada apa-apa akan dihantar tanpa pengesahan.\n\nUntuk berhenti kemudian:\n{berhenti}',
  },
  footer: {
    tentang: 'Tentang portal',
    privasi: 'Notis privasi',
    hakMenjawab: 'Hak menjawab',
    status: 'Sistem status laporan',
    saluranRasmi: 'Saluran rasmi',
    penafian:
      'Portal ini bukan laman rasmi kerajaan Malaysia. Maklumat di sini bersifat pendidikan. Untuk semakan berstatus rasmi, sila guna Semak Mule (PDRM). Untuk kes yang baru berlaku, hubungi NSRC 997.',
    disemakPada: 'Butiran saluran rasmi disemak pada',
    hakCipta: 'Projek komuniti sumber terbuka.',
  },
  notFound: {
    title: 'Halaman tidak dijumpai',
    lead: 'Pautan yang anda ikuti mungkin sudah lapuk atau tersalah taip.',
    cta: 'Kembali ke halaman utama',
  },
};

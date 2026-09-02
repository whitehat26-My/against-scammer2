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
    titleTemplate: '%s — Portal Semakan Scam',
    description:
      'Belajar kenal taktik scam terkini di Malaysia dalam bahasa yang senang faham, dan tahu ke mana nak rujuk untuk semakan rasmi.',
  },
  nav: {
    skip: 'Terus ke kandungan utama',
    home: 'Utama',
    taktik: 'Taktik scam',
    semak: 'Semak',
    bantuan: 'Kalau dah kena',
    tentang: 'Tentang',
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
    cta: 'Semakan rasmi: Semak Mule (PDRM)',
    urgent: 'Baru kena tipu? Terus telefon 997.',
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
    komunitiBelumAda:
      'Modul laporan komuniti belum dibuka. Dalam MVP ini, tiada laporan orang awam dipaparkan — jadi ketiadaan laporan di sini BUKAN bermakna sesuatu itu selamat.',
    komunitiStatusCta: 'Bagaimana status laporan akan berfungsi',
    laporCta: 'Laporkan nombor ini',
    laporNota: 'Buat masa ini butang ini membawa anda ke saluran laporan rasmi.',
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
      'Modul laporan komuniti belum dibuka dalam versi ini. Kami menerbitkan reka bentuk statusnya lebih awal supaya anda tahu apa maksud setiap label apabila ia hidup nanti.',
    kenapaTitle: 'Kenapa label ini penting',
    kenapaLead:
      'Satu laporan orang awam bukan bukti jenayah. Label yang salah boleh memusnahkan nama seseorang yang tidak bersalah — termasuk mangsa yang akaunnya dicuri untuk dijadikan akaun keldai. Sebab itu tiada satu pun status di bawah bermaksud “disahkan”.',
    statusTitle: 'Tiga status yang akan digunakan',
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
    ],
    fasaTitle: 'Apabila modul laporan komuniti dibuka',
    fasaLead:
      'Modul laporan belum aktif. Apabila ia dibuka, prinsip berikut akan terpakai dan notis ini akan dikemas kini dengan butiran penuh sebelum sebarang data dikumpul.',
    fasa: [
      'Borang laporan hanya meminta maklumat yang benar-benar perlu untuk menilai laporan.',
      'Memberi maklumat hubungan adalah pilihan. Laporan tanpa nama diterima.',
      'Persetujuan PDPA diminta secara jelas melalui kotak semak sebelum penghantaran, bukan tersembunyi dalam terma.',
      'Bukti imej disimpan dengan akses terhad kepada moderator sahaja.',
      'Data peribadi yang tidak lagi diperlukan untuk tujuan asal akan dibuang.',
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
      'Lapisan laporan komuniti sebagai amaran awal (fasa akan datang), dengan status yang tidak pernah mengesahkan jenayah.',
    ],
    fasaTitle: 'Peringkat pembangunan',
    fasaSekarang: 'Versi semasa (MVP)',
    fasaSekarangItems: [
      'Ensiklopedia modus operandi dengan kategori teras',
      'Alat semakan yang merujuk keluar ke Semak Mule',
      'Panduan langkah demi langkah “kalau dah kena scam”',
      'Notis privasi PDPA dan saluran hak menjawab',
    ],
    fasaSeterusnya: 'Fasa akan datang',
    fasaSeterusnyaItems: [
      'Borang laporan komuniti penuh dengan papan pemuka moderasi dan log audit',
      'Suapan berita automatik dan digest e-mel mingguan (opt-in)',
      'Akaun pengguna untuk menjejak status laporan sendiri',
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

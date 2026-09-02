/**
 * Saluran rasmi kerajaan / pihak berkuasa.
 *
 * PENTING: Portal ini TIDAK menyimpan atau meniru pangkalan data rekod jenayah.
 * Semua semakan berstatus rasmi mesti dirujuk keluar ke pautan di bawah.
 *
 * Nombor & URL di sini perlu disemak semula secara berkala oleh pasukan kandungan.
 * Kemas kini `disemak_pada` setiap kali disahkan.
 */

export type OfficialChannel = {
  id: string;
  nama: string;
  name: string;
  keterangan_ms: string;
  keterangan_en: string;
  url?: string;
  telefon?: string;
};

export const DISEMAK_PADA = '2026-08-01';

export const SEMAK_MULE_URL = 'https://semakmule.rmp.gov.my';
export const NSRC_TALIAN = '997';

export const OFFICIAL_CHANNELS: OfficialChannel[] = [
  {
    id: 'semak-mule',
    nama: 'Semak Mule (PDRM)',
    name: 'Semak Mule (Royal Malaysia Police)',
    keterangan_ms:
      'Portal rasmi PDRM untuk menyemak sama ada nombor akaun bank atau nombor telefon pernah dilaporkan dalam kes penipuan. Ini adalah rujukan rasmi — bukan portal ini.',
    keterangan_en:
      'The official PDRM portal to check whether a bank account or phone number has been reported in a fraud case. This is the official reference — not this site.',
    url: SEMAK_MULE_URL,
  },
  {
    id: 'nsrc',
    nama: 'NSRC — Pusat Respons Penipuan Kebangsaan',
    name: 'NSRC — National Scam Response Centre',
    keterangan_ms:
      'Talian 997 untuk kes penipuan kewangan yang BARU berlaku. Semakin cepat anda hubungi, semakin tinggi peluang duit sempat dibekukan. Beroperasi setiap hari.',
    keterangan_en:
      'Hotline 997 for financial scams that have JUST happened. The faster you call, the higher the chance the funds can still be frozen. Operates daily.',
    telefon: NSRC_TALIAN,
    url: 'https://www.nsrc.com.my',
  },
  {
    id: 'pdrm-ccid',
    nama: 'CCID Scam Response Centre (PDRM)',
    name: 'CCID Scam Response Centre (PDRM)',
    keterangan_ms:
      'Talian bantuan Jabatan Siasatan Jenayah Komersial PDRM untuk nasihat berkaitan penipuan komersial.',
    keterangan_en:
      'PDRM Commercial Crime Investigation Department helpline for advice on commercial fraud.',
    telefon: '013-211 1222',
    url: 'https://www.rmp.gov.my',
  },
  {
    id: 'mcmc',
    nama: 'Aduan MCMC / SKMM',
    name: 'MCMC Complaints',
    keterangan_ms:
      'Untuk aduan berkaitan SMS, panggilan, laman web dan kandungan dalam talian yang menipu.',
    keterangan_en:
      'For complaints about scam SMS, calls, websites and online content.',
    url: 'https://aduan.mcmc.gov.my',
  },
  {
    id: 'bnm',
    nama: 'BNMTELELINK (Bank Negara Malaysia)',
    name: 'BNMTELELINK (Central Bank of Malaysia)',
    keterangan_ms:
      'Untuk semakan senarai amaran kewangan BNM dan aduan berkaitan institusi kewangan berlesen.',
    keterangan_en:
      'To check BNM’s financial consumer alert list and to complain about licensed financial institutions.',
    telefon: '1-300-88-5465',
    url: 'https://www.bnm.gov.my/amaran',
  },
  {
    id: 'polis',
    nama: 'Balai Polis / Talian Kecemasan',
    name: 'Police station / Emergency line',
    keterangan_ms:
      'Laporan polis rasmi wajib dibuat untuk membolehkan siasatan. Talian kecemasan: 999.',
    keterangan_en:
      'An official police report is required for an investigation to proceed. Emergency line: 999.',
    telefon: '999',
    url: 'https://www.rmp.gov.my',
  },
];

export function getChannel(id: string): OfficialChannel | undefined {
  return OFFICIAL_CHANNELS.find((c) => c.id === id);
}

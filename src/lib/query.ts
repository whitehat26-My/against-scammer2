/**
 * Pengelasan input Alat Semakan.
 *
 * Semua fungsi di sini adalah PURE dan dijalankan di dalam pelayar pengguna.
 * Tiada apa-apa yang dihantar ke pelayan — lihat /privasi.
 */

export type QueryKind = 'telefon' | 'akaun_bank' | 'url' | 'syarikat' | 'kosong';

export type UrlHintCode =
  | 'bukan_https'
  | 'alamat_ip'
  | 'punycode'
  | 'pemendek_url'
  | 'tiru_gov'
  | 'tiru_jenama'
  | 'subdomain_panjang'
  | 'tld_kerap_disalahguna'
  | 'domain_pelik';

export type QueryClassification = {
  kind: QueryKind;
  /** Bentuk bersih untuk paparan (cth. +60123456789). */
  normalized: string;
  /** Input asal selepas trim. */
  raw: string;
  /** Bacaan lain yang munasabah — cth. 10 digit boleh jadi telefon ATAU akaun bank. */
  alternatives: QueryKind[];
  /** Hos untuk input jenis URL. */
  host?: string;
  /** Petunjuk heuristik untuk URL. BUKAN pengesahan, hanya isyarat awal. */
  urlHints: UrlHintCode[];
};

const SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'is.gd', 'cutt.ly', 'rb.gy',
  'shorturl.at', 's.id', 'rebrand.ly', 'tiny.cc', 'ow.ly', 't.ly', 'lnk.to',
]);

const RISKY_TLDS = new Set([
  'xyz', 'top', 'icu', 'buzz', 'rest', 'click', 'link', 'cyou', 'cfd', 'sbs',
  'quest', 'monster', 'bar', 'work', 'zip', 'mov',
]);

/** Kata kunci jenama yang paling kerap ditiru dalam kempen phishing di Malaysia. */
const BRAND_KEYWORDS: Record<string, string[]> = {
  maybank: ['maybank2u.com.my', 'maybank.com', 'maybank.com.my'],
  cimb: ['cimbclicks.com.my', 'cimb.com', 'cimbbank.com.my'],
  publicbank: ['pbebank.com'],
  rhb: ['rhbgroup.com'],
  ambank: ['ambank.com.my', 'amonline.com.my'],
  bankislam: ['bankislam.com'],
  hongleong: ['hlb.com.my'],
  bsn: ['bsn.com.my'],
  affin: ['affinalways.com', 'affinbank.com.my'],
  touchngo: ['touchngo.com.my', 'tngdigital.com.my'],
  tngd: ['tngdigital.com.my'],
  boost: ['myboost.com.my'],
  shopee: ['shopee.com.my'],
  lazada: ['lazada.com.my'],
  grab: ['grab.com'],
  poslaju: ['pos.com.my'],
  jpj: ['jpj.gov.my'],
  lhdn: ['hasil.gov.my'],
  pdrm: ['rmp.gov.my'],
  myeg: ['myeg.com.my'],
};

const GOV_KEYWORDS = ['gov', 'kerajaan', 'jpj', 'lhdn', 'pdrm', 'polis', 'imigresen', 'kwsp', 'perkeso'];

export function normalizeWhitespace(input: string): string {
  return input.replace(/\s+/g, ' ').trim();
}

/** Buang semua kecuali digit dan '+' di hadapan. */
export function digitsOnly(input: string): string {
  return input.replace(/[^\d]/g, '');
}

/**
 * Nombor telefon Malaysia:
 *  - mudah alih: 01X-XXXXXXX (10-11 digit termasuk '0' di depan)
 *  - talian tetap: 0X-XXXXXXX (9-10 digit)
 *  - format antarabangsa: +60 diikuti 9-10 digit
 */
export function isMalaysianPhone(input: string): boolean {
  const trimmed = normalizeWhitespace(input);
  const hasPlus60 = /^\+?60/.test(trimmed.replace(/[\s-]/g, ''));
  const d = digitsOnly(trimmed);
  if (hasPlus60) {
    const rest = d.replace(/^60/, '');
    return /^[1-9]\d{7,9}$/.test(rest);
  }
  if (/^01\d{7,9}$/.test(d)) return true; // mudah alih
  if (/^0[3-9]\d{6,8}$/.test(d)) return true; // talian tetap
  return false;
}

export function normalizePhone(input: string): string {
  const d = digitsOnly(input);
  if (d.startsWith('60')) return `+${d}`;
  if (d.startsWith('0')) return `+60${d.slice(1)}`;
  return `+60${d}`;
}

/** Nombor akaun bank Malaysia lazimnya 8-20 digit tanpa simbol. */
export function looksLikeBankAccount(input: string): boolean {
  const cleaned = input.replace(/[\s-]/g, '');
  return /^\d{8,20}$/.test(cleaned);
}

export function looksLikeUrl(input: string): boolean {
  const s = normalizeWhitespace(input).toLowerCase();
  if (/^https?:\/\//.test(s)) return true;
  if (/\s/.test(s)) return false;
  return /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,24}(?:[:/?#].*)?$/.test(s);
}

export function extractHost(input: string): string | undefined {
  const s = normalizeWhitespace(input);
  const withScheme = /^https?:\/\//i.test(s) ? s : `http://${s}`;
  try {
    return new URL(withScheme).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return undefined;
  }
}

/** Ambil domain berdaftar secara kasar (dua atau tiga label terakhir). */
export function registrableDomain(host: string): string {
  const parts = host.split('.');
  if (parts.length <= 2) return host;
  const twoLevelSuffixes = new Set(['com.my', 'net.my', 'org.my', 'gov.my', 'edu.my', 'mil.my', 'co.uk', 'com.sg']);
  const lastTwo = parts.slice(-2).join('.');
  if (twoLevelSuffixes.has(lastTwo) && parts.length >= 3) return parts.slice(-3).join('.');
  return lastTwo;
}

export function analyseUrl(rawInput: string): { host?: string; hints: UrlHintCode[] } {
  const host = extractHost(rawInput);
  if (!host) return { hints: [] };

  const hints: UrlHintCode[] = [];
  const domain = registrableDomain(host);
  const labels = host.split('.');
  const tld = labels[labels.length - 1] ?? '';

  if (/^https?:\/\//i.test(rawInput.trim()) && !/^https:\/\//i.test(rawInput.trim())) {
    hints.push('bukan_https');
  }
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) hints.push('alamat_ip');
  if (labels.some((l) => l.startsWith('xn--'))) hints.push('punycode');
  if (SHORTENERS.has(domain)) hints.push('pemendek_url');
  if (RISKY_TLDS.has(tld)) hints.push('tld_kerap_disalahguna');
  if (labels.length > 4) hints.push('subdomain_panjang');

  const flat = host.replace(/[^a-z0-9]/g, '');
  if (GOV_KEYWORDS.some((k) => flat.includes(k)) && !host.endsWith('.gov.my')) {
    hints.push('tiru_gov');
  }
  for (const [brand, official] of Object.entries(BRAND_KEYWORDS)) {
    if (flat.includes(brand) && !official.some((o) => domain === o || host === o)) {
      hints.push('tiru_jenama');
      break;
    }
  }
  const domainLabel = domain.split('.')[0] ?? '';
  if ((domainLabel.match(/-/g)?.length ?? 0) >= 3 || /\d{4,}/.test(domainLabel)) {
    hints.push('domain_pelik');
  }

  return { host, hints: [...new Set(hints)] };
}

export function classifyQuery(rawInput: string): QueryClassification {
  const raw = normalizeWhitespace(rawInput);
  if (!raw) {
    return { kind: 'kosong', normalized: '', raw: '', alternatives: [], urlHints: [] };
  }

  if (looksLikeUrl(raw)) {
    const { host, hints } = analyseUrl(raw);
    return { kind: 'url', normalized: host ?? raw.toLowerCase(), raw, alternatives: [], host, urlHints: hints };
  }

  const phone = isMalaysianPhone(raw);
  const bank = looksLikeBankAccount(raw);

  if (phone) {
    return {
      kind: 'telefon',
      normalized: normalizePhone(raw),
      raw,
      // 10-11 digit yang bermula '01' juga boleh jadi nombor akaun bank.
      alternatives: bank ? ['akaun_bank'] : [],
      urlHints: [],
    };
  }
  if (bank) {
    return {
      kind: 'akaun_bank',
      normalized: raw.replace(/[\s-]/g, ''),
      raw,
      alternatives: [],
      urlHints: [],
    };
  }

  return { kind: 'syarikat', normalized: raw, raw, alternatives: [], urlHints: [] };
}

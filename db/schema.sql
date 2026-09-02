-- =============================================================================
-- Portal Semakan Scam Malaysia — skema Postgres (Supabase)
--
-- Skema ini menyediakan entiti untuk FASA 2 (laporan komuniti, moderasi,
-- suapan berita). MVP fasa 1 tidak menggunakan pangkalan data: kandungan
-- ensiklopedia disimpan sebagai Markdown dalam `content/taktik/` dan alat
-- semakan berjalan sepenuhnya dalam pelayar.
--
-- Keperluan undang-undang dikuatkuasakan pada peringkat SKEMA, bukan hanya UI:
--   * Tiada status yang bermaksud "disahkan scammer" (lihat enum report_status).
--   * Moderation-first: laporan hanya boleh tersiar selepas disemak moderator.
--   * PDPA: persetujuan direkod, tempoh simpan direkod, kontak pelapor optional.
--   * Hak menjawab: jadual `dispute` adalah saluran rasmi, bukan borang mati.
--   * Privasi carian: `search_stat` menyimpan JENIS carian sahaja, tanpa teks
--     carian, tanpa IP dan tanpa pengenalan pengguna.
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Taksonomi & kandungan
-- -----------------------------------------------------------------------------

create table if not exists scam_category (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique check (slug ~ '^[a-z0-9-]+$'),
  nama          text not null,
  penerangan    text not null,
  red_flags     text[] not null default '{}',
  contoh_taktik jsonb  not null default '[]'::jsonb,
  risiko        text   not null check (risiko in ('sederhana', 'tinggi', 'sangat-tinggi')),
  platform      text[] not null default '{}',
  bahasa        text   not null default 'ms' check (bahasa in ('ms', 'en')),
  kemas_kini    date   not null default current_date,
  created_at    timestamptz not null default now()
);

comment on table scam_category is
  'Ensiklopedia modus operandi. Dalam MVP kandungan ini disimpan sebagai Markdown; jadual ini untuk CMS fasa 2.';

-- -----------------------------------------------------------------------------
-- Laporan komuniti
-- -----------------------------------------------------------------------------

-- Tiada nilai "disahkan"/"confirmed" dibenarkan dalam enum ini. Menambah nilai
-- sedemikian adalah perubahan dasar, bukan perubahan teknikal.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'report_status') then
    create type report_status as enum ('belum_disemak', 'dilaporkan_komuniti', 'dipertikai');
  end if;
  if not exists (select 1 from pg_type where typname = 'jenis_kenalan') then
    create type jenis_kenalan as enum ('telefon', 'akaun_bank', 'url', 'syarikat', 'profil_sosial', 'lain');
  end if;
  if not exists (select 1 from pg_type where typname = 'tindakan_moderator') then
    create type tindakan_moderator as enum ('terima', 'tolak', 'tanda_dipertikai', 'pinda', 'buang', 'buka_semula');
  end if;
end $$;

create table if not exists report (
  id                 uuid primary key default gen_random_uuid(),

  -- Apa yang dilaporkan
  jenis_kenalan      jenis_kenalan not null,
  nilai_kenalan      text not null check (length(btrim(nilai_kenalan)) between 3 and 200),
  kategori_id        uuid references scam_category (id) on delete set null,
  penerangan         text not null check (length(btrim(penerangan)) between 20 and 5000),
  bukti_url          text[] not null default '{}',

  -- Status & sokongan
  status             report_status not null default 'belum_disemak',
  bilangan_sokongan  integer not null default 1 check (bilangan_sokongan >= 1),

  -- Pelapor: SEMUANYA optional. Laporan tanpa nama diterima.
  pelapor_emel       text,
  pelapor_telefon    text,

  -- PDPA 2010
  pdpa_persetujuan   boolean not null check (pdpa_persetujuan is true),
  pdpa_persetujuan_pada timestamptz not null default now(),
  -- Tarikh data peribadi perlu dibuang jika tiada tujuan pemprosesan lagi.
  simpan_sehingga    date not null default (current_date + interval '2 years'),

  -- Moderasi
  disemak_oleh       uuid,
  disemak_pada       timestamptz,
  catatan_moderator  text,

  tarikh_hantar      timestamptz not null default now(),
  dikemaskini_pada   timestamptz not null default now(),

  -- Moderation-first: tiada laporan boleh meninggalkan 'belum_disemak'
  -- tanpa rekod siapa yang menyemak dan bila.
  constraint report_moderation_first check (
    status = 'belum_disemak'
    or (disemak_oleh is not null and disemak_pada is not null)
  )
);

create index if not exists report_nilai_idx on report (lower(btrim(nilai_kenalan)));
create index if not exists report_status_idx on report (status);
create index if not exists report_simpan_sehingga_idx on report (simpan_sehingga);

comment on column report.bilangan_sokongan is
  'Bilangan pelapor berasingan. Kiraan ini TIDAK menaik taraf status — label kekal "dilaporkan".';

-- Sokongan daripada pelapor berasingan ke atas laporan sedia ada.
create table if not exists report_support (
  id             uuid primary key default gen_random_uuid(),
  report_id      uuid not null references report (id) on delete cascade,
  penerangan     text,
  pdpa_persetujuan boolean not null check (pdpa_persetujuan is true),
  tarikh_hantar  timestamptz not null default now(),
  disemak_pada   timestamptz
);

create index if not exists report_support_report_idx on report_support (report_id);

-- -----------------------------------------------------------------------------
-- Hak menjawab (right of reply)
-- -----------------------------------------------------------------------------

create table if not exists dispute (
  id             uuid primary key default gen_random_uuid(),
  report_id      uuid not null references report (id) on delete cascade,
  -- Pihak yang dinamakan boleh membantah. Kontak diperlukan untuk maklum balas.
  pembantah_nama text not null,
  pembantah_emel text not null,
  hujah          text not null check (length(btrim(hujah)) >= 20),
  dokumen_url    text[] not null default '{}',
  -- SLA yang dijanjikan pada halaman /hak-menjawab.
  diterima_pada  timestamptz not null default now(),
  diakui_pada    timestamptz,
  keputusan      text check (keputusan in ('kekal_dipertikai', 'dipinda', 'dibuang')),
  keputusan_pada timestamptz,
  keputusan_oleh uuid
);

create index if not exists dispute_report_idx on dispute (report_id);

-- -----------------------------------------------------------------------------
-- Log audit moderator
-- -----------------------------------------------------------------------------

create table if not exists moderator_log (
  id          uuid primary key default gen_random_uuid(),
  report_id   uuid references report (id) on delete set null,
  dispute_id  uuid references dispute (id) on delete set null,
  moderator_id uuid not null,
  tindakan    tindakan_moderator not null,
  sebab       text,
  tarikh      timestamptz not null default now()
);

create index if not exists moderator_log_report_idx on moderator_log (report_id, tarikh desc);
create index if not exists moderator_log_moderator_idx on moderator_log (moderator_id, tarikh desc);

comment on table moderator_log is
  'Log audit tidak boleh dipadam atau dipinda. Berikan hak INSERT dan SELECT sahaja kepada peranan moderator.';

-- -----------------------------------------------------------------------------
-- Suapan berita
-- -----------------------------------------------------------------------------

create table if not exists article (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique check (slug ~ '^[a-z0-9-]+$'),
  tajuk         text not null,
  -- Ringkasan sahaja. Jangan salin teks penuh daripada sumber asal.
  ringkasan     text not null check (length(btrim(ringkasan)) between 40 and 1200),
  kategori_tags text[] not null default '{}',
  sumber_nama   text not null,
  sumber_url    text not null check (sumber_url ~ '^https://'),
  bahasa        text not null default 'ms' check (bahasa in ('ms', 'en')),
  tarikh_terbit timestamptz not null default now(),
  created_at    timestamptz not null default now()
);

create index if not exists article_tarikh_idx on article (tarikh_terbit desc);
create index if not exists article_tags_idx on article using gin (kategori_tags);

create table if not exists digest_subscriber (
  id             uuid primary key default gen_random_uuid(),
  emel           text not null unique,
  -- Double opt-in: langganan hanya aktif selepas pengesahan emel.
  disahkan_pada  timestamptz,
  token_batal    uuid not null default gen_random_uuid(),
  pdpa_persetujuan boolean not null check (pdpa_persetujuan is true),
  created_at     timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Statistik carian (tanpa identiti pencari)
-- -----------------------------------------------------------------------------

-- Hanya jenis carian dan tarikh disimpan. TIADA teks carian, TIADA IP,
-- TIADA user id, TIADA cap masa penuh — supaya carian tidak boleh dikaitkan
-- semula dengan seseorang.
create table if not exists search_stat (
  tarikh  date not null default current_date,
  jenis   jenis_kenalan not null,
  bilangan bigint not null default 0,
  primary key (tarikh, jenis)
);

comment on table search_stat is
  'Kiraan agregat sahaja. Jangan sekali-kali menambah lajur untuk teks carian, IP atau pengenalan pengguna.';

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------

alter table report          enable row level security;
alter table report_support  enable row level security;
alter table dispute         enable row level security;
alter table moderator_log   enable row level security;
alter table article         enable row level security;
alter table scam_category   enable row level security;
-- Tiada polisi untuk `dispute`, `moderator_log`, `report_support` dan
-- `digest_subscriber`: RLS aktif tanpa polisi bermakna tiada akses awam
-- langsung. Semua bacaan/tulisan mesti melalui peranan pelayan.
alter table digest_subscriber enable row level security;

-- Orang awam hanya nampak BARIS laporan yang sudah disemak...
drop policy if exists report_public_read on report;
create policy report_public_read on report
  for select
  using (status in ('dilaporkan_komuniti', 'dipertikai') and disemak_pada is not null);

-- ...dan hanya LAJUR yang selamat. Kontak pelapor serta URL bukti tidak boleh
-- didedahkan walaupun barisnya tersiar, jadi kebenaran diberi per lajur.
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on report from anon, authenticated;
    grant select (
      id, jenis_kenalan, nilai_kenalan, kategori_id, penerangan,
      status, bilangan_sokongan, tarikh_hantar
    ) on report to anon, authenticated;
  end if;
end $$;

-- View mudah untuk klien. `security_invoker` memastikan RLS di atas tetap
-- terpakai kepada peranan yang membuat pertanyaan.
create or replace view report_public
  with (security_invoker = true)
  as
  select
    id,
    jenis_kenalan,
    nilai_kenalan,
    kategori_id,
    penerangan,
    status,
    bilangan_sokongan,
    tarikh_hantar
  from report
  where status in ('dilaporkan_komuniti', 'dipertikai')
    and disemak_pada is not null;

drop policy if exists article_public_read on article;
create policy article_public_read on article for select using (true);

drop policy if exists category_public_read on scam_category;
create policy category_public_read on scam_category for select using (true);

-- Nota penyediaan Supabase:
--   1. Bucket storage `bukti` mesti PRIVATE. Berikan akses signed URL kepada
--      peranan moderator sahaja.
--   2. Tulis ke `report`, `report_support`, `dispute` dan `digest_subscriber`
--      melalui Edge Function / server action dengan rate limiting, bukan terus
--      dari pelayar dengan anon key.
--   3. Jadualkan kerja harian untuk memadam data peribadi yang telah melepasi
--      `simpan_sehingga`, dan untuk menghantar peringatan SLA `dispute`.

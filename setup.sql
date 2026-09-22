-- ============================================================================
-- KUMANDANG - Setup Supabase
-- Jalankan skrip ini di Supabase: Dashboard -> SQL Editor -> New query -> Run
-- Setelah dijalankan, isi kredensial di js/config.js lalu push ulang ke GitHub.
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Fungsi bantu: apakah pengguna yang login terdaftar sebagai pengurus?
-- (dipakai RLS agar hanya pengurus yang boleh menulis/kelola konten)
-- ---------------------------------------------------------------------------
create or replace function public.is_staf()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.pengurus where email = (auth.jwt() -> 'email')::text
  );
$$;

-- ---------------------------------------------------------------------------
-- TABEL
-- ---------------------------------------------------------------------------

-- Email pengurus yang berhak login ke Panel Admin
create table if not exists public.pengurus (
  email text primary key,
  nama text,
  jabatan text
);

-- Data keanggotaan (hasil form "Daftar Anggota" di halaman kontak)
create table if not exists public.anggota (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  kampus text not null,
  prodi text not null,
  angkatan text,
  kecamatan text,
  hp text,
  minat text,
  status text default 'baru',
  created_at timestamptz default now()
);

-- Berita / artikel (ditulis dari Panel Admin)
create table if not exists public.artikel (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  kategori text default 'Berita',
  ringkasan text,
  konten text,
  penulis text,
  cover_url text,
  status text default 'terbit',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Foto kegiatan (ditampilkan di galeri)
create table if not exists public.galeri_foto (
  id uuid primary key default gen_random_uuid(),
  caption text,
  foto_url text not null,
  created_at timestamptz default now()
);

-- Dokumen unduhan (PDF, formulir, materi, dll.)
create table if not exists public.dokumen (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  kategori text,
  file_url text not null,
  nama_file text,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- KEAMANAN (Row Level Security)
--   - Publik (anon): boleh membaca artikel/foto/dokumen, boleh mendaftar anggota.
--   - Pengurus (authenticated + ada di tabel pengurus): bebas kelola semuanya.
-- ---------------------------------------------------------------------------
alter table public.pengurus enable row level security;
alter table public.anggota enable row level security;
alter table public.artikel enable row level security;
alter table public.galeri_foto enable row level security;
alter table public.dokumen enable row level security;

drop policy if exists "pengurus_public_read" on public.pengurus;
create policy "pengurus_public_read" on public.pengurus
  for select to anon, authenticated using (true);

drop policy if exists "anggota_public_insert" on public.anggota;
create policy "anggota_public_insert" on public.anggota
  for insert to anon, authenticated with check (true);

drop policy if exists "anggota_staf_all" on public.anggota;
create policy "anggota_staf_all" on public.anggota
  for all to authenticated using (public.is_staf()) with check (public.is_staf());

drop policy if exists "artikel_public_read" on public.artikel;
create policy "artikel_public_read" on public.artikel
  for select to anon, authenticated using (true);

drop policy if exists "artikel_staf_write" on public.artikel;
create policy "artikel_staf_write" on public.artikel
  for all to authenticated using (public.is_staf()) with check (public.is_staf());

drop policy if exists "foto_public_read" on public.galeri_foto;
create policy "foto_public_read" on public.galeri_foto
  for select to anon, authenticated using (true);

drop policy if exists "foto_staf_write" on public.galeri_foto;
create policy "foto_staf_write" on public.galeri_foto
  for all to authenticated using (public.is_staf()) with check (public.is_staf());

drop policy if exists "dokumen_public_read" on public.dokumen;
create policy "dokumen_public_read" on public.dokumen
  for select to anon, authenticated using (true);

drop policy if exists "dokumen_staf_write" on public.dokumen;
create policy "dokumen_staf_write" on public.dokumen
  for all to authenticated using (public.is_staf()) with check (public.is_staf());

-- ---------------------------------------------------------------------------
-- STORAGE (penyimpanan file: cover artikel, foto, dokumen)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('cover', 'cover', true), ('foto', 'foto', true), ('dokumen', 'dokumen', true)
on conflict (id) do nothing;

drop policy if exists "storage_public_read" on storage.objects;
create policy "storage_public_read" on storage.objects
  for select to anon, authenticated using (bucket_id in ('cover', 'foto', 'dokumen'));

drop policy if exists "storage_staf_insert" on storage.objects;
create policy "storage_staf_insert" on storage.objects
  for insert to authenticated with check (bucket_id in ('cover', 'foto', 'dokumen'));

drop policy if exists "storage_staf_update" on storage.objects;
create policy "storage_staf_update" on storage.objects
  for update to authenticated using (bucket_id in ('cover', 'foto', 'dokumen'));

drop policy if exists "storage_staf_delete" on storage.objects;
create policy "storage_staf_delete" on storage.objects
  for delete to authenticated using (bucket_id in ('cover', 'foto', 'dokumen'));

-- ---------------------------------------------------------------------------
-- PENGGURUS AWAL
-- Ganti email di bawah dengan email (Gmail) pengurus yang berhak login.
-- Tambahkan baris baru untuk pengurus lain.
-- PENTING: email harus sama dengan email yang dipakai saat login di Panel Admin.
-- ---------------------------------------------------------------------------
insert into public.pengurus (email, nama, jabatan)
values
  ('pengurus1@gmail.com', 'Nama Pengurus 1', 'Divisi Humas & Media')
  -- ,('pengurus2@gmail.com', 'Nama Pengurus 2', 'Ketua Umum')
on conflict (email) do nothing;

-- ---------------------------------------------------------------------------
-- CONTOH ARTIKEL AWAL (agar blog tidak kosong)
-- ---------------------------------------------------------------------------
insert into public.artikel (judul, kategori, ringkasan, konten, penulis, status)
values
  (
    'Makrab Angkatan Baru Sukses Digelar di Bumi Rancabali',
    'Berita',
    'Lebih dari 200 mahasiswa baru asal Pandeglang mengikuti malam keakraban KUMANDANG.',
    $$<p>Pandeglang, Bumi Rancabali — Malam keakraban (makrab) angkatan baru Keluarga Mahasiswa Pandeglang (KUMANDANG) berlangsung meriah. Lebih dari 200 mahasiswa baru yang merantau dari berbagai kota turut hadir.</p><h2>Rangkaian Kegiatan</h2><ul><li>Games keakraban dan ice breaking antar angkatan.</li><li>Pentas seni dari tiap kelompok mahasiswa baru.</li><li>Sesi motivasi dari ketua umum dan alumni.</li></ul><p>Dengan terselenggaranya makrab ini, KUMANDANG semakin siap memasuki program kerja berikutnya.</p>$$,
    'Divisi Humas',
    'terbit'
  ),
  (
    'Pendaftaran Bakti Sosial Ramadan Sedang Dibuka',
    'Pengumuman',
    'KUMANDANG membuka pendaftaran relawan untuk program berbagi di bulan Ramadan.',
    $$<p>KUMANDANG mengajak seluruh anggota untuk ikut serta dalam program Bakti Sosial Ramadan. Pendaftaran relawan dibuka hingga H-7 pelaksanaan.</p><p>Kegiatan berupa pembagian paket sembako dan santunan kepada warga kurang mampu di beberapa kecamatan Kabupaten Pandeglang.</p>$$,
    'Divisi Sosial',
    'terbit'
  ),
  (
    'Tim KUMANDANG Raih Juara Futsal Antar Komunitas',
    'Prestasi',
    'Semangat juang tim futsal KUMANDANG membawa pulang trofi juara pertama.',
    $$<p>Tim futsal KUMANDANG berhasil meraih juara pertama pada turnamen futsal antar komunitas yang digelar di Pandeglang.</p><p>Kemenangan ini menjadi kebanggaan bersama dan pembuktian bahwa kekompakan anggota membuahkan hasil.</p>$$,
    'Divisi Olahraga',
    'terbit'
  ),
  (
    'Tips Bertahan di Perantauan bagi Mahasiswa Baru',
    'Artikel',
    'Catatan ringan untuk adik-adik yang baru menapak di kota perantauan.',
    $$<p>Merantau memang tidak mudah. Berikut beberapa tips agar adik-adik cepat beradaptasi di kota perantauan.</p><ul><li>Jalin relasi dengan teman dan kakak tingkat.</li><li>Kelola keuangan bulanan dengan disiplin.</li><li>Jangan ragu bertanya pada keluarga besar KUMANDANG.</li></ul>$$,
    'Divisi Humas',
    'terbit'
  )
on conflict (id) do nothing;

-- Selesai. Kembali ke Dashboard: Settings -> API, salin Project URL & Anon Key
-- ke js/config.js, lalu push ulang repository.
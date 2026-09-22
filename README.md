# KUMANDANG — Keluarga Mahasiswa Pandeglang

Website resmi wadah silaturahmi, kepedulian, dan pengembangan diri mahasiswa
asal Kabupaten Pandeglang. Dibangun sebagai website statis (HTML, CSS, JS)
di-host di **GitHub Pages**, dengan **Supabase** sebagai backend gratis untuk:

- Database keanggotaan (form "Daftar Anggota")
- Panel admin login (Google / kode email) untuk upload artikel, foto & dokumen
- Penyimpanan file (foto sampul, galeri, dokumen PDF)

## Halaman

| Halaman  | File | Keterangan |
| -------- | ---- | ---------- |
| Beranda | `index.html` | Hero, tentang, visi misi, kegiatan |
| Kegiatan | `kegiatan.html` | Program & aktivitas komunitas |
| Pengurus | `pengurus.html` | Struktur pengurus inti & divisi |
| Galeri | `galeri.html` | Foto kegiatan (statis + dari Supabase) |
| Blog | `blog.html` | Indeks artikel (dinamis dari Supabase) |
| Artikel | `artikel.html?id=` | Detail artikel dinamis |
| Dokumen | `dokumen.html` | Unduhan dokumen resmi |
| Kontak | `kontak.html` | Form kontak + pendaftaran anggota |
| Panel Admin | `admin.html` | Login pengurus: kelola artikel/foto/dokumen/anggota |

## Struktur

```
kumandang/
├── index.html  kegiatan.html  pengurus.html  galeri.html
├── blog.html   artikel.html   dokumen.html   kontak.html
├── admin.html          # Panel admin (butuh Supabase)
├── artikel/contoh.html # Template/arsip artikel lama
├── css/style.css
├── js/
│   ├── config.js       # <<< isi kredensial Supabase di sini
│   ├── supabase.js     # inisialisasi client
│   └── main.js         # interaksi + render data dinamis
├── setup.sql           # skrip setup database & storage
└── assets/img/         # foto statis (opsional)
```

## Setup (2 langkah)

### 1. Aktifkan backend dengan Supabase (gratis)

1. Daftar di https://supabase.com → **New project** (pilih region dekat, mis. Asia).
2. Di dashboard, buka **SQL Editor** → buat query baru → tempel seluruh isi
   `setup.sql` → **Run**.
3. Khusus login **Google**: buka **Authentication → Sign In / Providers →
   Google → Enable**, lalu buat OAuth client di Google Cloud Console
   (Redirect URL yang diminta diisikan `https://<project-ref>.supabase.co/auth/v1/callback`).
   Alternatif tanpa setup Google: cukup pakai **Email** provider (sudah aktif), penulis
   cukup memasukkan Gmail lalu menerima kode (OTP).
4. Klik **Settings → API**. Salin **Project URL** dan **anon public key**.

### 2. Isi kredensial & publish

Edit `js/config.js`:

```js
window.APP_CONFIG = {
  supabaseUrl: "https://XXXX.supabase.co",
  supabaseAnonKey: "eyJ...",
};
```

Commit & push → GitHub Pages otomatis deploy.

```bash
git add -A && git commit -m "Aktifkan Supabase" && git push
```

Wajib di `setup.sql` diganti juga: baris `pengurus1@gmail.com` menjadi email
Gmail pengurus yang berhak login ke `admin.html` (bisa beberapa baris).

## Penggunaan

- **Pendaftaran anggota**: publik mengisi form di `kontak.html#daftar` →
  tersimpan otomatis di tabel `anggota`, dilihat di Panel Admin → tab Anggota.
- **Upload artikel**: pengurus buka `admin.html` → login Google/kode email →
  tab Artikel → tulis & simpan. Artikel muncul langsung di `blog.html`.
  Foto sampul diunggah dari panel.
- **Upload foto**: tab Foto pada panel → muncul di `galeri.html`.
- **Upload dokumen**: tab Dokumen pada panel → muncul di `dokumen.html` untuk diunduh anggota.
- **Menambah pengurus**: insert baris di tabel `pengurus` (email + nama + jabatan).

## Menjalankan Lokal

```bash
python3 -m http.server 8000
```

Buka `http://localhost:8000`. (Login Google di lingkungan lokal butuh redirect
URL `http://localhost:8000` ditambahkan di pengaturan Auth Supabase.)

## Foto & Logo

- **Logo**: SVG (`assets/logo.svg`) + PNG 512×512 transparan.
- **Foto kegiatan**: JPG/WebP, landscape 4:3 / 16:9, maks ±300KB — bisa diunggah
  langsung lewat Panel Admin tanpa menyentuh kode.

## Keamanan singkat

- File hanya bisa diunggah pengurus (RLS via tabel `pengurus`).
- Publik hanya bisa membaca konten & mendaftar anggota.
- Arahkan email pengurus ke daftar `pengurus`; jangan pakai `service_role` key
  di sisi website.
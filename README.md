# KUMANDANG — Keluarga Mahasiswa Pandeglang

Website company profile resmi wadah silaturahmi, kepedulian, dan pengembangan diri
mahasiswa asal Kabupaten Pandeglang. Dikembangkan sebagai **website statis**
murni (HTML, CSS, JavaScript) tanpa dependensi — cepat, ringan, dan mudah dirawat.

## Halaman

| Halaman        | File               | Isi                                            |
| -------------- | ------------------ | ---------------------------------------------- |
| Beranda        | `index.html`       | Hero, tentang, visi misi, kegiatan unggulan    |
| Kegiatan       | `kegiatan.html`    | Daftar program & aktivitas komunitas           |
| Pengurus       | `pengurus.html`    | Struktur pengurus inti & divisi                |
| Galeri         | `galeri.html`      | Dokumentasi foto + lightbox                    |
| Blog           | `blog.html`        | Indeks artikel/berita                          |
| Artikel        | `artikel/contoh.html` | Template artikel (salin untuk artikel baru) |
| Kontak         | `kontak.html`      | Form kontak & pendaftaran anggota              |

## Struktur

```
kumandang/
├── index.html
├── kegiatan.html
├── pengurus.html
├── galeri.html
├── blog.html
├── kontak.html
├── artikel/
│   └── contoh.html
├── css/
│   └── style.css
├── js/
│   └── main.js
└── assets/img/   (opsional, untuk foto asli)
```

## Menjalankan Lokal

Jalankan dari folder proyek:

```bash
python3 -m http.server 8000
```

Lalu buka `http://localhost:8000`.

## Deploy ke GitHub Pages

1. Buat repository baru di GitHub, misalnya `kumandang`.
2. Unggah seluruh isi folder ini ke repository (termasuk `index.html`).
3. Buka **Settings** → **Pages**.
4. Pada **Source**, pilih `Deploy from a branch` → branch `main` → folder `/ (root)`.
5. Simpan, tunggu beberapa menit, website tampil di
   `https://username.github.io/kumandang/`.

> Jika konten dipindah ke subfolder lain, sesuaikan path relatif (`css/`,
> `js/`, `artikel/`) di tiap file HTML sesuai lokasi baru.

## Menyesuaikan Konten

- **Nama/nomor pengurus** → ubah pada `pengurus.html`.
- **Kegiatan & deskripsi** → ubah pada `kegiatan.html`.
- **Foto** → letakkan gambar di `assets/img/` lalu ganti elemen placeholder
  `.kegiatan-img`, `.post-thumb`, `.gallery-item`, atau `.cover` dengan `<img>`.
- **Artikel baru** → salin `artikel/contoh.html`, ganti isi, lalu tambahkan
  entri di `blog.html`.
- **Warna tema** → ubah variabel `:root` di `css/style.css`
  (contoh: `--orange-500`, `--black`).

## Fitur

- Responsif (menu hamburger di layar kecil).
- Lightbox galeri foto (klik untuk memperbesar).
- Form kontak & pendaftaran memakai `mailto:` (terbuka otomatis di aplikasi
  email perangkat) — tanpa backend.
- Tidak bergantung pada framework atau build tool apa pun.
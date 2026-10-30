# Direktori E-reader

Direktori unduhan berbahasa Indonesia, dibuat dengan Vite dan vanilla JavaScript.

## Menjalankan

```sh
npm install
npm run dev
```

```sh
npm run build
npm run preview
```

Upload hasil build di `dist/` ke hosting statis untuk akses publik. File di
`public/download/` ikut disalin ke hasil build. Project ini belum dipublikasikan.

## Mengubah halaman

Edit `src/config.json`:

- `brand`: nama kecil di header.
- `title`, `intro`, `footer`: teks halaman.
- `categories`: kategori sesuai urutan tampil. Setiap kategori punya `id` unik
  (huruf kecil tanpa spasi), `title`, `description`, `emptyText`, dan `items`.

## Menambah download

1. Taruh file di `public/download/`. Subfolder `apps/`, `fonts/`, dan `epub/`
   sudah disiapkan.
2. Tambahkan objek ke array `items` kategori yang sesuai, misalnya:

```json
{
  "name": "Nama aplikasi",
  "description": "Deskripsi singkat dan perangkat yang didukung.",
  "file": "apps/nama-aplikasi.apk",
  "format": "APK",
  "size": "12 MB",
  "version": "v1.0"
}
```

`name` dan `file` wajib diisi. `description`, `format`, `size`, dan `version`
opsional. Ukuran dan versi ditulis manual. Jalur `file` relatif terhadap
`public/download/`, tanpa awalan `/`; kapitalisasi harus sama dengan nama file.
Spasi pada nama file didukung. Jangan gunakan `..` pada jalur file.

File contoh di atas hanya contoh config, bukan file yang tersedia. Menaruh file saja tidak
menambahkannya ke daftar: tambahkan juga entri config. Build dan deploy ulang
setelah mengubah config atau menambah file.

## Deploy ke Vercel

1. Push project beserta file di `public/download/` ke repository Git.
2. Import repository tersebut sebagai project di Vercel. Root Directory adalah
   folder project yang berisi `package.json`.
3. `vercel.json` sudah mengatur preset **Vite**, build `npm run build`, dan output
   `dist`. Gunakan install command default. Environment variable tidak diperlukan.
4. Deploy, lalu coba ketiga tombol Unduh pada URL production.

File download disajikan langsung sebagai file statis di `/download/`.
Header `Content-Disposition: attachment` meminta browser mengunduh file.
Tidak ada rewrite semua URL ke HTML, sehingga URL file yang salah tetap 404.

Alternatif dari folder project: jalankan `npx vercel --prod` dan ikuti instruksinya.
Total tiga file saat ini sekitar 74,5 MB. Batas upload source via CLI untuk paket
Hobby saat ini 100 MB; perhatikan totalnya saat menambah file.

Referensi: [Vite di Vercel](https://vite.dev/guide/static-deploy#vercel),
[konfigurasi Vercel](https://vercel.com/docs/project-configuration/vercel-json),
[batas upload](https://vercel.com/docs/limits#static-file-uploads).

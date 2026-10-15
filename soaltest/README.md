# CBT SMA

Aplikasi Computer Based Test untuk sekolah menengah atas. Aplikasi berjalan sepenuhnya di browser; data disimpan pada IndexedDB melalui Dexie. Tidak ada server atau sinkronisasi jaringan.

## Instalasi dan menjalankan

Gunakan Node.js 20 atau lebih baru.

```sh
npm install
npm run dev
```

Buka alamat lokal yang ditampilkan Vite. Untuk membuat build produksi jalankan `npm run build`, lalu tinjau hasil di `dist/` dengan `npm run preview`.

## Akun awal

- Admin: `admin` / `admin123` (ubah melalui Pengaturan)
- Guru contoh: `guru1` atau `guru2` / `guru123`
- Siswa contoh: NISN `00620260001` sampai `00620260020` / `siswa123`
- Siswa yang ditambahkan atau diimpor: kata sandi awal adalah NISN.

Data contoh dibuat otomatis pada pembukaan pertama database. Untuk masuk ke komputer lab lain, impor paket ujian terlebih dahulu. Browser memiliki database terpisah untuk tiap profil/perangkat.

## Alur ujian di laboratorium

1. Di komputer admin, kelola siswa, bank soal, dan buat jadwal ujian. Token enam karakter tampil pada tabel ujian.
2. Pilih **Ekspor paket** untuk membuat file JSON. Salin file ke komputer peserta.
3. Di komputer peserta, buka aplikasi dan gunakan menu **Impor paket** pada Manajemen Ujian. Siswa masuk dengan NISN dan kata sandi, memilih ujian, lalu memasukkan token dari proktor.
4. Jawaban disimpan otomatis di browser. Setelah ujian selesai, admin dapat mengumpulkan file hasil JSON dari komputer peserta dan mengimpornya di menu Hasil & rekap.
5. Ekspor nilai ke Excel atau backup database melalui Pengaturan.

## Isi aplikasi

- Login berbasis peran admin, guru, dan siswa. Password seed di-hash dengan SHA-256 Web Crypto.
- IndexedDB/Dexie dengan tabel pengguna, siswa, guru, kelas, mapel, tahun ajaran, soal, ujian, peserta, jawaban, hasil, pelanggaran, dan pengaturan.
- CRUD dasar siswa, template/import Excel siswa dan soal, bank soal beberapa jenis, jadwal/token, paket ujian, impor hasil, ekspor rekap Excel, backup dan pemulihan.
- Halaman ujian dengan konfirmasi peserta, token, timer berbasis waktu mulai yang tersimpan, jawaban autosave, penanda ragu-ragu, navigasi soal, fullscreen, dan pencatatan perpindahan tab.
- Penilaian objektif lokal dan status sementara untuk soal esai.

## Catatan pemakaian

Penyimpanan dan keamanan browser bersifat lokal. Jangan menghapus data situs/browser selama ujian berjalan. Siapkan dan uji impor paket pada browser laboratorium sebelum hari ujian. Fitur pencegahan salin/keluar tab merupakan penghalang dasar di sisi browser, bukan penguncian perangkat.

Untuk mengosongkan data aplikasi, hapus penyimpanan situs `cbtSMA` dari pengaturan browser. Simpan backup terlebih dahulu jika data masih dibutuhkan.

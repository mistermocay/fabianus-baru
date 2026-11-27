# Fabi & Oca — Wedding Invitation

Website undangan digital statis untuk GitHub Pages + Google Sheets melalui Google Apps Script.

## Isi paket
- `index.html` — seluruh section undangan.
- `style.css` — desain responsif hijau gelap/krem dan animasi Fly In/Float In.
- `config.js` — tempat mengganti nama, tanggal, venue, rekening, dan URL Apps Script.
- `script.js` — countdown, Google Calendar, Maps, RSVP, ucapan, musik.
- `gas/Code.gs` — backend Google Apps Script untuk menyimpan RSVP ke Google Sheets.
- `assets/` — tempat foto dan musik.

## 1. Ganti informasi undangan
Buka `config.js`, lalu ganti:
- Nama lengkap mempelai dan nama orang tua.
- Jam acara pada `dateISO` dan `eventTime`.
- Detail `ceremony` dan `reception` (nama venue, alamat, jam, Maps) jika ada perubahan.
- Data rekening pada array `gifts` jika ada perubahan. Website sumber tidak mencantumkan alamat pengiriman hadiah, sehingga bagian tersebut tidak diisi.

Tanggal dan jam acara sudah diisi berdasarkan website referensi: Holy Matrimony pukul 10.00 WIB dan resepsi pukul 19.00 WIB pada Rabu, 30 Desember 2026.

Nama mempelai, nama ayah kedua mempelai, dua lokasi acara, alamat, tautan Maps, serta dua rekening wedding gift sudah diisi berdasarkan website referensi.

## 2. Masukkan foto dan musik
Masukkan file dengan nama berikut ke folder `assets/` (JPG/MP3):
- `cover.jpg` — foto utama cover.
- `groom.jpg` — foto mempelai pria.
- `bride.jpg` — foto mempelai wanita.
- `event.jpg` — foto untuk detail acara.
- `story.jpg` — foto untuk section cerita.
- `gallery-1.jpg` sampai `gallery-6.jpg` — foto galeri.
- `music.mp3` — backsound (opsional).

Foto galeri final belum disertakan karena PDF menyebutkan Fabi akan memilih foto yang akan digunakan. Gunakan foto yang memang sudah mendapat izin dari pemiliknya. Ukuran rekomendasi: cover/story 1600×2200 px; portrait 1000×1400 px; gallery 1200×1500 px; kompres JPG/WebP agar cepat dibuka di ponsel.

## 3. Hubungkan Google Sheets
1. Buat Google Spreadsheet baru.
2. Buka **Extensions → Apps Script**.
3. Salin seluruh isi `gas/Code.gs` ke editor Apps Script.
4. Jalankan fungsi `setupSheet` satu kali dan berikan izin.
5. Pilih **Deploy → New deployment → Web app**.
6. Set **Execute as: Me** dan **Who has access: Anyone**.
7. Deploy, lalu salin URL Web App.
8. Tempel URL tersebut pada `appsScriptUrl` di `config.js`.
9. Jika mengubah kode Apps Script setelah deployment, buat versi deployment baru.

**Catatan keamanan:** Web app menerima kiriman publik karena formulir memang untuk tamu. Jangan simpan data sensitif selain informasi RSVP. Uji kirim data percobaan sebelum menyebarkan tautan undangan.

## 4. Jalankan lokal
Buka folder dengan VS Code, lalu jalankan Live Server. Form RSVP baru bisa tersimpan setelah URL Apps Script diisi. Google Calendar dan Maps memakai tautan langsung.

## 5. Deploy GitHub Pages
1. Buat repository GitHub baru, misalnya `fabi-oca-wedding`.
2. Upload seluruh isi folder ini (bukan folder ZIP-nya).
3. Buka **Settings → Pages**.
4. Pada **Build and deployment**, pilih **Deploy from a branch**.
5. Pilih branch `main` dan folder `/ (root)`, lalu Save.
6. Tunggu proses selesai; URL Pages akan tampil di bagian GitHub Pages.

## 6. Personalisasi nama tamu
Gunakan parameter URL:
`https://USERNAME.github.io/REPOSITORY/?to=Nama%20Tamu`
Contoh:
`...?to=Bapak%20Andi%20dan%20Keluarga`

## Fitur yang tersedia
- [x] Cover pembuka dan nama tamu via URL.
- [x] Profil kedua mempelai dan orang tua.
- [x] Countdown (tanggal 30 Desember 2026; jam default sementara).
- [x] Google Calendar.
- [x] Google Maps (alamat final perlu diisi).
- [x] Galeri foto (slot siap diisi).
- [x] Wedding gift (data rekening/alamat perlu diisi).
- [x] Form RSVP dan endpoint Google Sheets (perlu deploy Apps Script).
- [x] Wedding wishes tampil dari Google Sheets (refresh berkala 20 detik).
- [x] Musik opsional dan animasi saat scroll.
- [ ] Deploy GitHub Pages — perlu akses akun/repository pemilik.
- [ ] Hubungkan Apps Script dan uji RSVP — perlu izin akun Google pemilik.
- [ ] Isi foto final, jam, venue, data rekening, serta alamat hadiah.


## Data acara yang dimasukkan dari website referensi
- Holy Matrimony: Rabu, 30 Desember 2026, 10.00 WIB — Gereja St. Antonius Padua, Purbayan Surakarta.
- Resepsi: Rabu, 30 Desember 2026, 19.00 WIB — Graha Perhutani, Surakarta.
- Google Calendar menyediakan tautan terpisah untuk kedua acara.
- Wedding gift: BCA 8175324280 a.n. Ocarina Oktoberlian; BRI 302201040689530 a.n. Fabianus Siltian Simbarja.
- Website sumber hanya menyebut nama ayah kedua mempelai; nama ibu dan alamat pengiriman hadiah tidak ditambahkan.

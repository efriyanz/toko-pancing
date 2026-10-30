// data.js: data dummy produk.
// Harga berupa angka (tanpa titik dan tanpa "Rp") supaya bisa dihitung.
// Format Rupiah dibuat saat ditampilkan (lihat formatRupiah di utils.js).
// Di Fase 7, array ini diganti data dari API Laravel dengan bentuk yang sama.

const produk = [
  { id: 1, nama: "Joran Carbon 2.1m", kategori: "joran", harga: 350000, stok: 12, gambar: "img/produk/joran.svg" },
  { id: 2, nama: "Joran Telescopic 3.0m", kategori: "joran", harga: 275000, stok: 8, gambar: "img/produk/joran.svg" },
  { id: 3, nama: "Joran Spinning 1.8m", kategori: "joran", harga: 220000, stok: 15, gambar: "img/produk/joran.svg" },
  { id: 4, nama: "Reel Spinning 2000", kategori: "reel", harga: 185000, stok: 20, gambar: "img/produk/reel.svg" },
  { id: 5, nama: "Reel Baitcasting 300", kategori: "reel", harga: 420000, stok: 5, gambar: "img/produk/reel.svg" },
  { id: 6, nama: "Umpan Soft Frog", kategori: "umpan", harga: 35000, stok: 40, gambar: "img/produk/umpan.svg" },
  { id: 7, nama: "Umpan Minnow 9cm", kategori: "umpan", harga: 48000, stok: 30, gambar: "img/produk/umpan.svg" },
  { id: 8, nama: "Umpan Jig Metal 20g", kategori: "umpan", harga: 27000, stok: 0, gambar: "img/produk/umpan.svg" },
  { id: 9, nama: "Senar Nylon 0.30mm 100m", kategori: "senar", harga: 25000, stok: 60, gambar: "img/produk/senar.svg" },
  { id: 10, nama: "Senar PE Braid 0.20mm", kategori: "senar", harga: 95000, stok: 18, gambar: "img/produk/senar.svg" },
  { id: 11, nama: "Kotak Alat Pancing", kategori: "aksesoris", harga: 65000, stok: 10, gambar: "img/produk/aksesoris.svg" },
  { id: 12, nama: "Kail Octopus isi 20", kategori: "aksesoris", harga: 12000, stok: 100, gambar: "img/produk/aksesoris.svg" },
];

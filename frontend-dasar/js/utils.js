// utils.js: fungsi bantu kecil yang dipakai banyak file.

// 350000 -> "Rp 350.000"
function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);
}

// Cari satu produk berdasarkan id. Hasilnya undefined kalau tidak ada.
function cariProduk(id) {
  return produk.find((p) => p.id === id);
}

// Membuat link WhatsApp. encodeURIComponent mengubah spasi, baris baru, dan
// karakter khusus menjadi bentuk yang aman di dalam URL.
function buatLinkWa(pesan) {
  return `https://wa.me/${config.nomorWa}?text=${encodeURIComponent(pesan)}`;
}

// Membuat elemen HTML dengan aman.
// Contoh: buatEl("p", { class: "harga" }, "Rp 10.000")
// Teks dimasukkan sebagai teks biasa (bukan HTML), jadi aman walau datanya
// nanti datang dari API.
function buatEl(tag, atribut = {}, anak = []) {
  const elemen = document.createElement(tag);
  for (const [nama, nilai] of Object.entries(atribut)) {
    if (nilai === false || nilai === null || nilai === undefined) continue;
    elemen.setAttribute(nama, nilai === true ? "" : nilai);
  }
  for (const isi of [].concat(anak)) {
    elemen.append(isi);
  }
  return elemen;
}

// Pesan singkat di bawah layar, hilang sendiri setelah 2 detik.
let waktuToast;
function tampilkanToast(pesan) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = pesan;
  toast.classList.add("tampil");
  clearTimeout(waktuToast);
  waktuToast = setTimeout(() => toast.classList.remove("tampil"), 2000);
}

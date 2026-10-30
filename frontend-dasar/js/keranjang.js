// keranjang.js: data keranjang saja (tanpa menyentuh tampilan).
// Setiap item bentuknya { id, jumlah }. Disimpan di localStorage supaya
// tidak hilang saat halaman di-refresh.

const KUNCI_KERANJANG = "toko-pancing:keranjang";

const keranjang = {
  item: [],
  pendengar: [],

  // Daftarkan fungsi yang dipanggil setiap keranjang berubah.
  dengarkan(fungsi) {
    this.pendengar.push(fungsi);
  },

  beritahu() {
    this.pendengar.forEach((fungsi) => fungsi());
  },

  // Baca dari localStorage. Data rusak atau produk yang sudah tidak ada dibuang.
  muat() {
    try {
      const mentah = localStorage.getItem(KUNCI_KERANJANG);
      const data = mentah ? JSON.parse(mentah) : [];
      this.item = Array.isArray(data) ? data.map((i) => this.bersihkan(i)).filter(Boolean) : [];
    } catch (galat) {
      this.item = [];
    }
    this.beritahu();
  },

  // Pastikan satu item valid: produknya ada, stok ada, jumlah 1 sampai stok.
  bersihkan(entri) {
    const p = entri ? cariProduk(entri.id) : undefined;
    if (!p || p.stok < 1) return null;
    const jumlah = Math.min(Math.max(Math.floor(Number(entri.jumlah)) || 1, 1), p.stok);
    return { id: p.id, jumlah };
  },

  simpan() {
    try {
      localStorage.setItem(KUNCI_KERANJANG, JSON.stringify(this.item));
    } catch (galat) {
      // Penyimpanan diblokir (mode privat, dll). Keranjang tetap jalan, hanya tidak tersimpan.
    }
    this.beritahu();
  },

  // Kembalikan true kalau berhasil, false kalau stok tidak cukup.
  tambah(id) {
    const p = cariProduk(id);
    if (!p || p.stok < 1) return false;
    const ada = this.item.find((i) => i.id === id);
    if (ada) {
      if (ada.jumlah >= p.stok) return false;
      ada.jumlah += 1;
    } else {
      this.item.push({ id, jumlah: 1 });
    }
    this.simpan();
    return true;
  },

  // delta = +1 atau -1. Jumlah 0 berarti item dihapus.
  ubahJumlah(id, delta) {
    const ada = this.item.find((i) => i.id === id);
    const p = cariProduk(id);
    if (!ada || !p) return false;
    const baru = ada.jumlah + delta;
    if (baru > p.stok) return false;
    if (baru < 1) return this.hapus(id);
    ada.jumlah = baru;
    this.simpan();
    return true;
  },

  hapus(id) {
    this.item = this.item.filter((i) => i.id !== id);
    this.simpan();
    return true;
  },

  kosongkan() {
    this.item = [];
    this.simpan();
  },

  jumlahDiKeranjang(id) {
    const ada = this.item.find((i) => i.id === id);
    return ada ? ada.jumlah : 0;
  },

  totalItem() {
    return this.item.reduce((total, i) => total + i.jumlah, 0);
  },

  // Daftar siap tampil: produk lengkap + jumlah + subtotal.
  rincian() {
    return this.item.map((i) => {
      const p = cariProduk(i.id);
      return { produk: p, jumlah: i.jumlah, subtotal: p.harga * i.jumlah };
    });
  },

  totalHarga() {
    return this.rincian().reduce((total, baris) => total + baris.subtotal, 0);
  },
};

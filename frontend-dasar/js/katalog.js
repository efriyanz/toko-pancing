// katalog.js: menampilkan kartu produk, filter kategori, dan pencarian.

const katalog = {
  kategoriAktif: "semua",
  kataKunci: "",
  halaman: 1,

  mulai() {
    this.elFilter = document.getElementById("filter-kategori");
    this.elDaftar = document.getElementById("daftar-produk");
    this.elHasil = document.getElementById("jumlah-hasil");
    this.elCari = document.getElementById("cari");
    this.elPaging = document.getElementById("paging");
    this.elInfoHalaman = document.getElementById("info-halaman");
    this.elSebelumnya = document.getElementById("halaman-sebelumnya");
    this.elBerikutnya = document.getElementById("halaman-berikutnya");

    this.gambarFilter();
    this.gambarDaftar();

    // Satu pendengar untuk semua tombol filter (event delegation).
    // Ganti filter atau kata kunci selalu kembali ke halaman 1.
    this.elFilter.addEventListener("click", (e) => {
      const tombol = e.target.closest("button[data-kategori]");
      if (!tombol) return;
      this.kategoriAktif = tombol.dataset.kategori;
      this.halaman = 1;
      this.gambarFilter();
      this.gambarDaftar();
    });

    this.elCari.addEventListener("input", () => {
      this.kataKunci = this.elCari.value.trim().toLowerCase();
      this.halaman = 1;
      this.gambarDaftar();
    });

    this.elSebelumnya.addEventListener("click", () => this.pindahHalaman(-1));
    this.elBerikutnya.addEventListener("click", () => this.pindahHalaman(1));

    // Satu pendengar untuk semua tombol "Tambah ke keranjang".
    this.elDaftar.addEventListener("click", (e) => {
      const tombol = e.target.closest("button[data-id]");
      if (!tombol) return;
      const id = Number(tombol.dataset.id);
      const p = cariProduk(id);
      if (keranjang.tambah(id)) {
        tampilkanToast(`${p.nama} masuk keranjang`);
      } else {
        tampilkanToast(`Stok ${p.nama} tidak cukup untuk ditambah lagi`);
      }
    });
  },

  // Daftar kategori diambil dari data, jadi kategori baru otomatis muncul.
  daftarKategori() {
    return ["semua", ...new Set(produk.map((p) => p.kategori))];
  },

  gambarFilter() {
    this.elFilter.replaceChildren(
      ...this.daftarKategori().map((kategori) =>
        buatEl(
          "button",
          {
            class: "chip",
            type: "button",
            "data-kategori": kategori,
            "aria-pressed": String(kategori === this.kategoriAktif),
          },
          kategori
        )
      )
    );
  },

  // Produk yang lolos filter kategori DAN pencarian nama.
  produkTampil() {
    return produk.filter((p) => {
      const cocokKategori = this.kategoriAktif === "semua" || p.kategori === this.kategoriAktif;
      const cocokKata = p.nama.toLowerCase().includes(this.kataKunci);
      return cocokKategori && cocokKata;
    });
  },

  totalHalaman(jumlahProduk) {
    return Math.max(1, Math.ceil(jumlahProduk / config.produkPerHalaman));
  },

  gambarDaftar() {
    const hasil = this.produkTampil();
    const total = this.totalHalaman(hasil.length);
    this.halaman = Math.min(Math.max(this.halaman, 1), total);
    this.elHasil.textContent = `${hasil.length} produk`;

    if (hasil.length === 0) {
      this.elDaftar.replaceChildren(
        buatEl("p", { class: "kosong" }, "Produk tidak ditemukan. Ubah kata kunci atau pilih kategori Semua.")
      );
      this.gambarPaging(total);
      return;
    }

    // Ambil hanya produk untuk halaman yang sedang dibuka.
    const mulai = (this.halaman - 1) * config.produkPerHalaman;
    const potongan = hasil.slice(mulai, mulai + config.produkPerHalaman);
    this.elDaftar.replaceChildren(...potongan.map((p) => this.buatKartu(p)));
    this.gambarPaging(total);
  },

  // Paging hanya muncul kalau hasilnya lebih dari satu halaman.
  // aria-disabled dipakai (bukan disabled) supaya fokus keyboard tidak hilang.
  gambarPaging(total) {
    this.elPaging.hidden = total <= 1;
    this.elInfoHalaman.textContent = `Halaman ${this.halaman} dari ${total}`;
    this.elSebelumnya.setAttribute("aria-disabled", String(this.halaman <= 1));
    this.elBerikutnya.setAttribute("aria-disabled", String(this.halaman >= total));
  },

  pindahHalaman(arah) {
    const total = this.totalHalaman(this.produkTampil().length);
    const baru = this.halaman + arah;
    if (baru < 1 || baru > total) return; // sudah mentok, tombolnya tidak berbuat apa-apa
    this.halaman = baru;
    this.gambarDaftar();
    // Kembali ke awal katalog supaya produk baru terlihat dari atas.
    document.getElementById("katalog").scrollIntoView({ block: "start" });
  },

  buatKartu(p) {
    const habis = p.stok < 1;
    const tipis = !habis && p.stok <= 5;
    const teksStok = habis ? "Stok habis" : tipis ? `Sisa ${p.stok}` : `Stok ${p.stok}`;

    return buatEl("article", { class: "kartu-produk" }, [
      buatEl("div", { class: "kartu-gambar" }, [
        buatEl("img", { src: p.gambar, alt: p.nama, loading: "lazy", width: 400, height: 300 }),
      ]),
      buatEl("div", { class: "kartu-isi" }, [
        buatEl("p", { class: "kartu-kategori" }, p.kategori),
        buatEl("h3", { class: "kartu-nama" }, p.nama),
        buatEl("p", { class: "kartu-harga" }, formatRupiah(p.harga)),
        buatEl("p", { class: `kartu-stok${tipis || habis ? " tipis" : ""}` }, teksStok),
        buatEl(
          "button",
          {
            class: "tombol tombol-utama",
            type: "button",
            "data-id": p.id,
            disabled: habis,
          },
          habis ? "Habis" : "Tambah ke keranjang"
        ),
      ]),
    ]);
  },
};

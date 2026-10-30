// panel-keranjang.js: tampilan keranjang (panel geser dari kanan) dan tombol pesan WhatsApp.

const panelKeranjang = {
  mulai() {
    this.elPanel = document.getElementById("panel-keranjang");
    this.elTirai = document.getElementById("tirai");
    this.elIsi = document.getElementById("isi-keranjang");
    this.elTombolBuka = document.getElementById("tombol-keranjang");
    this.elLencana = document.getElementById("jumlah-keranjang");

    this.elTombolBuka.addEventListener("click", () => this.buka());
    document.getElementById("tutup-keranjang").addEventListener("click", () => this.tutup());
    this.elTirai.addEventListener("click", () => this.tutup());
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.terbuka()) this.tutup();
    });

    // Satu pendengar untuk tombol kurang, tambah, hapus, dan kosongkan.
    this.elIsi.addEventListener("click", (e) => {
      const tombol = e.target.closest("button[data-aksi]");
      if (!tombol) return;
      const id = Number(tombol.dataset.id);
      this.ingatFokus = { aksi: tombol.dataset.aksi, id };

      switch (tombol.dataset.aksi) {
        case "kurang":
          keranjang.ubahJumlah(id, -1);
          break;
        case "tambah":
          if (!keranjang.ubahJumlah(id, 1)) tampilkanToast("Stok tidak cukup untuk ditambah lagi");
          break;
        case "hapus":
          keranjang.hapus(id);
          break;
        case "kosongkan":
          keranjang.kosongkan();
          break;
        case "lanjut":
          this.tutup();
          break;
      }
    });

    keranjang.dengarkan(() => this.gambar());
    this.gambar();
  },

  terbuka() {
    return this.elPanel.classList.contains("terbuka");
  },

  buka() {
    // Sembunyikan toast yang masih tampil supaya tidak menimpa isi panel
    document.getElementById("toast").classList.remove("tampil");
    this.elTirai.hidden = false;
    this.elPanel.inert = false;
    // requestAnimationFrame supaya animasi geser sempat berjalan
    requestAnimationFrame(() => this.elPanel.classList.add("terbuka"));
    document.getElementById("tutup-keranjang").focus();
  },

  tutup() {
    this.elPanel.classList.remove("terbuka");
    this.elTirai.hidden = true;
    this.elPanel.inert = true;
    this.elTombolBuka.focus();
  },

  // Isi pesan WhatsApp dari isi keranjang.
  buatPesan() {
    const baris = keranjang
      .rincian()
      .map((r) => `- ${r.produk.nama} x${r.jumlah} = ${formatRupiah(r.subtotal)}`);
    return [
      `Halo ${config.namaToko}, saya mau pesan:`,
      ...baris,
      `Total: ${formatRupiah(keranjang.totalHarga())}`,
      "",
      "Nama:",
      "Alamat pengiriman:",
    ].join("\n");
  },

  gambar() {
    const jumlah = keranjang.totalItem();
    this.elLencana.textContent = jumlah;
    this.elLencana.setAttribute("aria-label", `${jumlah} item`);

    if (jumlah === 0) {
      this.elIsi.replaceChildren(
        buatEl("div", { class: "panel-kosong" }, [
          buatEl("p", {}, "Keranjang masih kosong. Pilih produk dari katalog untuk memulai."),
          buatEl("button", { class: "tombol tombol-garis", type: "button", "data-aksi": "lanjut" }, "Lihat katalog"),
        ])
      );
      return;
    }

    const daftar = buatEl(
      "ul",
      { class: "panel-daftar" },
      keranjang.rincian().map((r) => this.buatBaris(r))
    );

    const kaki = buatEl("div", { class: "panel-kaki" }, [
      buatEl("p", { class: "total" }, ["Total", buatEl("strong", {}, formatRupiah(keranjang.totalHarga()))]),
      buatEl(
        "a",
        { class: "tombol tombol-utama", href: buatLinkWa(this.buatPesan()), target: "_blank", rel: "noopener" },
        "Pesan lewat WhatsApp"
      ),
      buatEl("p", { class: "catatan" }, "Pesan terisi otomatis. Admin akan mengonfirmasi stok dan ongkir lewat chat."),
      buatEl("button", { class: "tombol-teks", type: "button", "data-aksi": "kosongkan" }, "Kosongkan keranjang"),
    ]);

    this.elIsi.replaceChildren(daftar, kaki);
    this.pulihkanFokus();
  },

  buatBaris(r) {
    const id = r.produk.id;
    return buatEl("li", { class: "baris-keranjang" }, [
      buatEl("p", { class: "baris-nama" }, r.produk.nama),
      buatEl("p", { class: "baris-harga" }, `${formatRupiah(r.produk.harga)} per item`),
      buatEl("div", { class: "baris-aksi" }, [
        buatEl("div", { class: "jumlah" }, [
          buatEl("button", { type: "button", "data-aksi": "kurang", "data-id": id, "aria-label": `Kurangi ${r.produk.nama}` }, "-"),
          buatEl("output", {}, String(r.jumlah)),
          buatEl("button", { type: "button", "data-aksi": "tambah", "data-id": id, "aria-label": `Tambah ${r.produk.nama}` }, "+"),
        ]),
        buatEl("span", { class: "baris-subtotal" }, formatRupiah(r.subtotal)),
        buatEl("button", { class: "tombol-teks", type: "button", "data-aksi": "hapus", "data-id": id }, "Hapus"),
      ]),
    ]);
  },

  // Panel digambar ulang setiap ada perubahan, jadi fokus keyboard dikembalikan
  // ke tombol yang sama supaya pengguna keyboard tidak "terlempar".
  pulihkanFokus() {
    if (!this.ingatFokus || !this.terbuka()) return;
    const { aksi, id } = this.ingatFokus;
    this.ingatFokus = null;
    const selektor = aksi === "kosongkan" ? `[data-aksi="kosongkan"]` : `[data-aksi="${aksi}"][data-id="${id}"]`;
    const tombol = this.elIsi.querySelector(selektor);
    if (tombol) tombol.focus();
  },
};

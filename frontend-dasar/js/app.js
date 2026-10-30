// app.js: penghubung. Dimuat paling akhir, tugasnya hanya menyalakan bagian-bagian lain.

function aturLinkWa() {
  const pesanTanya = `Halo ${config.namaToko}, saya mau tanya soal produk.`;
  const link = buatLinkWa(pesanTanya);

  const tombolMelayang = document.getElementById("wa-melayang");
  tombolMelayang.href = link;

  const linkKontak = document.getElementById("kontak-wa");
  linkKontak.href = link;
  linkKontak.target = "_blank";
  linkKontak.rel = "noopener";

  // Tombol "Tanya admin" di hero juga membuka WhatsApp
  const tanyaAdmin = document.getElementById("tanya-admin");
  tanyaAdmin.href = link;
  tanyaAdmin.target = "_blank";
  tanyaAdmin.rel = "noopener";
}

// Urutan penting: keranjang dimuat dulu, lalu tampilan yang membacanya.
keranjang.muat();
katalog.mulai();
panelKeranjang.mulai();
aturLinkWa();
document.getElementById("tahun").textContent = new Date().getFullYear();

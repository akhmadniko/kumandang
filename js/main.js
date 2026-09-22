document.addEventListener("DOMContentLoaded", function () {
  var yearNodes = document.querySelectorAll("#year, .year");
  yearNodes.forEach(function (node) {
    node.textContent = new Date().getFullYear();
  });

  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });

    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
      }
    });
  }

  var lightbox = document.getElementById("lightbox");
  var closeBtn = document.getElementById("lbClose");
  var lbTitle = document.getElementById("lbTitle");
  var lbCaption = document.getElementById("lbCaption");

  document.querySelectorAll("[data-lightbox]").forEach(function (item) {
    item.addEventListener("click", function () {
      if (lbTitle) {
        lbTitle.textContent = item.getAttribute("data-title") || "Foto Kegiatan";
      }
      if (lbCaption) {
        lbCaption.textContent =
          item.getAttribute("data-caption") || item.getAttribute("data-title") || "";
      }
      if (lightbox) {
        lightbox.classList.add("open");
      }
    });
  });

  function closeBox() {
    if (lightbox) {
      lightbox.classList.remove("open");
    }
  }

  if (closeBtn) closeBtn.addEventListener("click", closeBox);
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeBox();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeBox();
  });

  var contactForm = document.getElementById("form-kontak");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var nama = contactForm.nama.value.trim();
      var email = contactForm.email.value.trim();
      var topik = contactForm.topik.value;
      var pesan = contactForm.pesan.value.trim();
      if (!nama || !email || !pesan) return;
      var subject = encodeURIComponent("[Pesan] " + topik + " dari " + nama);
      var body = encodeURIComponent(
        "Nama: " + nama + "\nEmail: " + email + "\nTopik: " + topik + "\n\n" + pesan
      );
      window.location.href = "mailto:kumandang65@gmail.com?subject=" + subject + "&body=" + body;
    });
  }

  var daftarForm = document.getElementById("form-daftar");
  if (daftarForm) {
    daftarForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var nama = daftarForm.nama.value.trim();
      var kampus = daftarForm.kampus.value.trim();
      var prodi = daftarForm.prodi.value.trim();
      var angkatan = daftarForm.angkatan.value.trim();
      var kecamatan = daftarForm.kecamatan.value.trim();
      var hp = daftarForm.hp.value.trim();
      var minat = daftarForm.minat.value;
      if (!nama || !kampus || !prodi) return;
      var subject = encodeURIComponent("[Pendaftaran Anggota] " + nama);
      var body = encodeURIComponent(
        "Nama Lengkap: " + nama +
        "\nKampus: " + kampus +
        "\nProgram Studi: " + prodi +
        "\nAngkatan: " + (angkatan || "-") +
        "\nKecamatan Asal: " + (kecamatan || "-") +
        "\nWA: " + (hp || "-") +
        "\nMinat Divisi: " + minat
      );
      window.location.href = "mailto:kumandang65@gmail.com?subject=" + subject + "&body=" + body;
    });
  }
});
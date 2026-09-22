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
  var currentLbData = null;

  document.querySelectorAll("[data-lightbox]").forEach(function (item) {
    item.addEventListener("click", function () {
      currentLbData = item;
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

  function getParam(name) {
    var m = new URLSearchParams(window.location.search);
    return m.get(name);
  }

  function tglID(iso) {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (e) {
      return iso;
    }
  }

  function esc(str) {
    var d = document.createElement("div");
    d.textContent = str == null ? "" : String(str);
    return d.innerHTML;
  }

  /* ---------- Form kontak (mailto) ---------- */
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

  function suksesForm(form, msg) {
    var el = form.querySelector(".form-success");
    if (!el) {
      el = document.createElement("p");
      el.className = "form-note form-success";
      form.appendChild(el);
    }
    el.textContent = msg;
    el.style.color = "#15803d";
    form.querySelectorAll("input, select, textarea").forEach(function (f) {
      f.value = "";
    });
  }

  /* ---------- Form daftar anggota -> Supabase (fallback mailto) ---------- */
  var daftarForm = document.getElementById("form-daftar");
  if (daftarForm) {
    daftarForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = {
        nama: daftarForm.nama.value.trim(),
        kampus: daftarForm.kampus.value.trim(),
        prodi: daftarForm.prodi.value.trim(),
        angkatan: daftarForm.angkatan.value.trim() || null,
        kecamatan: daftarForm.kecamatan.value.trim() || null,
        hp: daftarForm.hp.value.trim() || null,
        minat: daftarForm.minat.value,
        status: "baru",
      };
      if (!data.nama || !data.kampus || !data.prodi) return;

      if (window.SupaReady) {
        document.getElementById("btn-daftar").disabled = true;
        window.Supa
          .from("anggota")
          .insert([data])
          .then(function (res) {
            document.getElementById("btn-daftar").disabled = false;
            if (res.error) {
              alert("Gagal menyimpan: " + res.error.message);
              return;
            }
            suksesForm(
              daftarForm,
              "Terima kasih! Data keanggotaanmu tersimpan. Pengurus akan menghubungi untuk konfirmasi."
            );
          });
      } else {
        var subject = encodeURIComponent("[Pendaftaran Anggota] " + data.nama);
        var body = encodeURIComponent(
          "Nama Lengkap: " + data.nama +
          "\nKampus: " + data.kampus +
          "\nProgram Studi: " + data.prodi +
          "\nAngkatan: " + (data.angkatan || "-") +
          "\nKecamatan Asal: " + (data.kecamatan || "-") +
          "\nWA: " + (data.hp || "-") +
          "\nMinat Divisi: " + data.minat
        );
        window.location.href = "mailto:kumandang65@gmail.com?subject=" + subject + "&body=" + body;
      }
    });
  }

  /* ---------- Blog: daftar artikel dari Supabase ---------- */
  var blogPosts = document.getElementById("blog-posts");
  if (blogPosts && window.SupaReady) {
    window.Supa
      .from("artikel")
      .select("id,judul,kategori,ringkasan,cover_url,created_at")
      .eq("status", "terbit")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(function (res) {
        if (res.error || !res.data || res.data.length === 0) return;
        blogPosts.innerHTML = res.data
          .map(function (a) {
            var thumb =
              '<div class="post-thumb" style="background:#111827;color:#f97316">' +
              (a.cover_url
                ? '<img src="' + esc(a.cover_url) + '" alt="' + esc(a.judul) + '" style="width:100%;height:100%;object-fit:cover;border-radius:10px" />'
                : "📰") +
              "</div>";
            return (
              '<article class="post">' +
              thumb +
              "<div>" +
              '<span class="meta">' +
              esc(a.kategori || "Berita") +
              " · " +
              tglID(a.created_at) +
              "</span>" +
              '<h3><a href="artikel.html?id=' +
              a.id +
              '">' +
              esc(a.judul) +
              "</a></h3>" +
              (a.ringkasan ? "<p>" + esc(a.ringkasan) + "</p>" : "") +
              "</div></article>"
            );
          })
          .join("");
      });
  }

  /* ---------- Artikel detail dari Supabase ---------- */
  var articleBox = document.getElementById("article-dinamis");
  if (articleBox && window.SupaReady) {
    var artId = getParam("id");
    if (artId) {
      window.Supa
        .from("artikel")
        .select("*")
        .eq("id", artId)
        .single()
        .then(function (res) {
          if (res.error || !res.data) {
            articleBox.innerHTML = "<p>Artikel tidak ditemukan.</p>";
            return;
          }
          var a = res.data;
          document.title = a.judul + " — KUMANDANG";
          var cover = "";
          if (a.cover_url) {
            cover =
              '<img class="cover" src="' +
              esc(a.cover_url) +
              '" alt="' +
              esc(a.judul) +
              '" />';
          }
          articleBox.innerHTML =
            '<div class="article">' +
            '<div class="breadcrumb" style="margin-bottom:18px"><a href="blog.html">Blog</a> / ' +
            esc(a.kategori || "Berita") +
            "</div>" +
            "<h1>" +
            esc(a.judul) +
            "</h1>" +
            '<div class="meta">Ditulis oleh ' +
            esc(a.penulis || "Divisi Humas") +
            " · " +
            tglID(a.created_at) +
            "</div>" +
            cover +
            '<div class="article-body">' +
            a.konten +
            "</div></div>";
        });
    }
  }

  /* ---------- Galeri: foto dari Supabase ---------- */
  var gallery = document.getElementById("gallery-grid");
  if (gallery && window.SupaReady) {
    window.Supa
      .from("galeri_foto")
      .select("caption,foto_url,created_at")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(function (res) {
        if (res.error || !res.data || res.data.length === 0) return;
        var html = "";
        res.data.forEach(function (f) {
          html +=
            '<div class="gallery-item" data-lightbox data-title="' +
            esc(f.caption || "Foto Kegiatan") +
            '" data-caption="' +
            esc(f.caption || "") +
            '"><img src="' +
            esc(f.foto_url) +
            '" alt="' +
            esc(f.caption || "Foto") +
            '" style="width:100%;height:100%;object-fit:cover" /><span class="gallery-caption">' +
            esc(f.caption || "Foto Kegiatan") +
            "</span></div>";
        });
        gallery.insertAdjacentHTML("afterbegin", html);
      });
  }

  /* ---------- Dokumen dari Supabase ---------- */
  var docList = document.getElementById("doc-list");
  if (docList && window.SupaReady) {
    window.Supa
      .from("dokumen")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(function (res) {
        if (res.error || !res.data || res.data.length === 0) {
          docList.innerHTML = "<p>Belum ada dokumen tersedia.</p>";
          return;
        }
        docList.innerHTML = res.data
          .map(function (d) {
            return (
              '<div class="card"><div class="card-body">' +
              "<h3>" +
              esc(d.judul) +
              "</h3>" +
              '<p class="meta">' +
              esc(d.kategori || "Dokumen") +
              "</p>" +
              '<a class="btn btn-outline" style="padding:8px 18px;font-size:.85rem" href="' +
              esc(d.file_url) +
              '" target="_blank" rel="noopener">Unduh</a>' +
              "</div></div>"
            );
          })
          .join("");
      });
  }
});
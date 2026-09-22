(function () {
  var cfg = window.APP_CONFIG || {};
  window.Supa = null;

  if (cfg.supabaseUrl && cfg.supabaseAnonKey && window.supabase) {
    try {
      window.Supa = supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
    } catch (e) {
      console.error("Gagal inisialisasi Supabase:", e);
      window.Supa = null;
    }
  }

  window.SupaReady = Boolean(window.Supa);
})();
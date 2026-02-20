(() => {
  const THEME_KEY = "pwa_theme";
  const CFG_KEY = "pwa_professional_config";

  const html = document.documentElement;
  const themeColorMeta = document.getElementById("themeColorMeta");

  const toggleThemeBtn = document.getElementById("toggleTheme");
  const themeIcon = document.getElementById("themeIcon");
  const themeLabel = document.getElementById("themeLabel");

  const installBtn = document.getElementById("installBtn");

  const pageTitle = document.getElementById("pageTitle");
  const pageSubtitle = document.getElementById("pageSubtitle");
  const profileName = document.getElementById("profileName");

  const hamburger = document.getElementById("hamburger");
  const sidebar = document.querySelector(".sidebar");

  const cfgName = document.getElementById("cfgName");
  const cfgTitle = document.getElementById("cfgTitle");
  const cfgAddress = document.getElementById("cfgAddress");
  const saveConfigBtn = document.getElementById("saveConfig");

  let deferredPrompt = null;

  const viewMeta = {
    dashboard: { title: "Dashboard", subtitle: "Visão geral do seu consultório" },
    agenda: { title: "Agenda", subtitle: "Calendário e atendimentos do dia" },
    pacientes: { title: "Pacientes", subtitle: "Cadastro e histórico clínico" },
    documentos: { title: "Documentos", subtitle: "Impressão individual e PDFs" },
    financeiro: { title: "Livro Caixa", subtitle: "Receitas, despesas, metas e materiais" },
    config: { title: "Configurações", subtitle: "Perfil, documentos e preferências" }
  };

  function setTheme(theme) {
    html.setAttribute("data-theme", theme);

    const isDark = theme === "dark";
    themeIcon.textContent = isDark ? "☀️" : "🌙";
    themeLabel.textContent = isDark ? "Modo claro" : "Modo escuro";

    // Ajusta theme-color (barra do celular)
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", isDark ? "#0b1220" : "#f7f8fb");
    }
    localStorage.setItem(THEME_KEY, theme);
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      return;
    }
    // Se não tem salvo, respeita o sistema:
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }

  function toggleTheme() {
    const current = html.getAttribute("data-theme") || "light";
    setTheme(current === "dark" ? "light" : "dark");
  }

  function showView(viewKey) {
    document.querySelectorAll(".view").forEach(v => v.classList.remove("is-visible"));
    const el = document.getElementById(`view-${viewKey}`);
    if (el) el.classList.add("is-visible");

    document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("is-active"));
    const btn = document.querySelector(`.nav-item[data-view="${viewKey}"]`);
    if (btn) btn.classList.add("is-active");

    const meta = viewMeta[viewKey] || { title: "App", subtitle: "" };
    pageTitle.textContent = meta.title;
    pageSubtitle.textContent = meta.subtitle;

    // Fecha sidebar no mobile
    if (sidebar.classList.contains("is-open")) sidebar.classList.remove("is-open");
  }

  function initNav() {
    document.querySelectorAll(".nav-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const view = btn.getAttribute("data-view");
        if (view) showView(view);
      });
    });
  }

  function initSidebarMobile() {
    if (!hamburger || !sidebar) return;
    hamburger.addEventListener("click", () => {
      sidebar.classList.toggle("is-open");
    });

    // Clique fora fecha (mobile)
    document.addEventListener("click", (e) => {
      if (window.matchMedia("(max-width: 900px)").matches) {
        const clickedInside = sidebar.contains(e.target) || hamburger.contains(e.target);
        if (!clickedInside) sidebar.classList.remove("is-open");
      }
    });
  }

  function initPWAInstall() {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      installBtn.hidden = false;
    });

    installBtn.addEventListener("click", async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      installBtn.hidden = true;
    });

    window.addEventListener("appinstalled", () => {
      installBtn.hidden = true;
      deferredPrompt = null;
    });
  }

  function initServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // Se falhar, o app segue funcionando online normalmente
    });
  }

  function loadConfig() {
    try {
      const raw = localStorage.getItem(CFG_KEY);
      if (!raw) return { name: "Dr(a). Orlando", title: "dr", address: "" };
      const parsed = JSON.parse(raw);
      return {
        name: typeof parsed.name === "string" ? parsed.name : "Dr(a). Orlando",
        title: parsed.title === "dra" ? "dra" : "dr",
        address: typeof parsed.address === "string" ? parsed.address : ""
      };
    } catch {
      return { name: "Dr(a). Orlando", title: "dr", address: "" };
    }
  }

  function saveConfig(cfg) {
    localStorage.setItem(CFG_KEY, JSON.stringify(cfg));
  }

  function initConfigUI() {
    if (!cfgName || !cfgTitle || !cfgAddress || !saveConfigBtn) return;

    const cfg = loadConfig();
    cfgName.value = cfg.name;
    cfgTitle.value = cfg.title;
    cfgAddress.value = cfg.address;

    // Atualiza chip no topo com o nome
    profileName.textContent = cfg.name;

    saveConfigBtn.addEventListener("click", () => {
      const newCfg = {
        name: cfgName.value.trim() || "Dr(a). Orlando",
        title: cfgTitle.value === "dra" ? "dra" : "dr",
        address: cfgAddress.value.trim()
      };
      saveConfig(newCfg);
      profileName.textContent = newCfg.name;
      alert("Configurações salvas ✅");
    });
  }

  // INIT
  initTheme();
  initNav();
  initSidebarMobile();
  initPWAInstall();
  initServiceWorker();
  initConfigUI();

  toggleThemeBtn.addEventListener("click", toggleTheme);

  // Abre dashboard por padrão
  showView("dashboard");
})();

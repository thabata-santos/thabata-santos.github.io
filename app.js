const state = {
  lang: "pt",
  projects: [],
  filtered: [],
};

const i18n = {
  pt: {
    "nav.about": "Sobre",
    "nav.projects": "Projetos",
    "nav.certs": "Certificações",
    "nav.contact": "Contato",
    "hero.subtitle": "Construindo sistemas resilientes e escaláveis.",
    "hero.lead": "Estudante de Engenharia da Computação, focada em AWS, redes e infraestrutura. Portfólio com labs, automações e projetos.",
    "hero.ctaProjects": "Ver projetos",
    "chips.networks": "Redes",
    "hero.panelTitle": "Status • Portfólio",
    "hero.panelRole": "Foco",
    "hero.panelNow": "Agora",
    "hero.panelMode": "Modo",
    "hero.panelHint": "Dica: clique nos cards para expandir.",
    "about.title": "Sobre",
    "about.sub": "Um resumo rápido, direto e profissional.",
    "about.card1.title": "Quem sou",
    "about.card1.body": "Sou estudante de Engenharia da Computação e estou em transição para Cloud/Infra. Gosto de aprender na prática com labs e projetos replicáveis.",
    "about.card2.title": "Stack & interesses",
    "projects.title": "Projetos",
    "projects.sub": "Cards dinâmicos carregados de JSON.",
    "projects.filterAll": "Todos",
    "projects.filterNetwork": "Redes",
    "projects.filterAutomation": "Automação",
    "certs.title": "Certificações & estudos",
    "certs.sub": "Você pode atualizar isso em minutos.",
    "certs.card1.title": "Em andamento",
    "certs.card2.title": "Próximas",
    "contact.title": "Contato",
    "contact.sub": "Links e formas fáceis de falar com você.",
    "contact.card1.title": "Email",
    "contact.card1.hint": "Respondo mais rápido por email.",
    "contact.card2.title": "Social",
    "contact.card2.hint": "Depois você cola seus links aqui:"
  },
  en: {
    "nav.about": "About",
    "nav.projects": "Projects",
    "nav.certs": "Certifications",
    "nav.contact": "Contact",
    "hero.subtitle": "Building resilient, scalable systems.",
    "hero.lead": "Computer Engineering student focused on AWS, networking, and infrastructure. Portfolio with labs, automations, and projects.",
    "hero.ctaProjects": "View projects",
    "chips.networks": "Networking",
    "hero.panelTitle": "Status • Portfolio",
    "hero.panelRole": "Focus",
    "hero.panelNow": "Now",
    "hero.panelMode": "Mode",
    "hero.panelHint": "Tip: click cards to expand.",
    "about.title": "About",
    "about.sub": "A quick, direct, professional summary.",
    "about.card1.title": "Who I am",
    "about.card1.body": "I’m a Computer Engineering student transitioning into Cloud/Infra. I learn by doing hands-on labs and replicable projects.",
    "about.card2.title": "Stack & interests",
    "projects.title": "Projects",
    "projects.sub": "Dynamic cards loaded from JSON.",
    "projects.filterAll": "All",
    "projects.filterNetwork": "Networking",
    "projects.filterAutomation": "Automation",
    "certs.title": "Certifications & studies",
    "certs.sub": "Update this in minutes.",
    "certs.card1.title": "In progress",
    "certs.card2.title": "Next",
    "contact.title": "Contact",
    "contact.sub": "Easy ways to reach you.",
    "contact.card1.title": "Email",
    "contact.card1.hint": "Email is the fastest way.",
    "contact.card2.title": "Social",
    "contact.card2.hint": "Paste your links here later:"
  }
};

function applyI18n(){
  document.documentElement.lang = state.lang === "pt" ? "pt-BR" : "en";
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = i18n[state.lang][key] ?? el.textContent;
  });
  const search = document.getElementById("search");
  if (search) search.placeholder = state.lang === "pt" ? "Buscar projeto..." : "Search project...";
}

function setNow(){
  const el = document.getElementById("nowText");
  const dt = new Date();
  const text = state.lang === "pt"
    ? `Atualizando portfólio • ${dt.toLocaleString("pt-BR")}`
    : `Updating portfolio • ${dt.toLocaleString("en-US")}`;
  if (el) el.textContent = text;
}

async function loadProjects(){
  const res = await fetch("data/projects.json", { cache: "no-store" });
  const data = await res.json();
  state.projects = data;
  state.filtered = data;
  renderProjects();
}

function matchesFilter(p){
  const q = (document.getElementById("search")?.value ?? "").toLowerCase().trim();
  const f = document.getElementById("filter")?.value ?? "all";
  const text = `${p.title} ${p.subtitle} ${(p.tags||[]).join(" ")}`.toLowerCase();
  const okQ = !q || text.includes(q);
  const okF = (f === "all") || (p.category === f);
  return okQ && okF;
}

function renderProjects(){
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;

  const list = state.projects.filter(matchesFilter);
  grid.innerHTML = "";

  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "card project";
    card.tabIndex = 0;

    const badges = (p.tags||[]).slice(0,6).map(t => `<span class="badge">${escapeHtml(t)}</span>`).join("");

    card.innerHTML = `
      <div class="card-title">${escapeHtml(p.subtitle)}</div>
      <h3 style="margin:10px 0 6px; font-family: Orbitron, sans-serif;">${escapeHtml(p.title)}</h3>
      <div class="badges">${badges}</div>
      <p style="margin:12px 0 0; color: var(--muted);">
        ${escapeHtml(state.lang === "pt" ? p.description_pt : p.description_en)}
      </p>
    `;

    card.addEventListener("click", () => openModal(p));
    card.addEventListener("keydown", (e) => { if (e.key === "Enter") openModal(p); });

    grid.appendChild(card);
  });
}

function openModal(p){
  const modal = document.getElementById("modal");
  const title = document.getElementById("modalTitle");
  const sub = document.getElementById("modalSub");
  const body = document.getElementById("modalBody");
  const actions = document.getElementById("modalActions");

  title.textContent = p.title;
  sub.textContent = p.subtitle;

  body.innerHTML = `
    <p>${escapeHtml(state.lang === "pt" ? p.description_pt : p.description_en)}</p>
    ${(p.tags||[]).length ? `<div class="badges">${p.tags.map(t=>`<span class="badge">${escapeHtml(t)}</span>`).join("")}</div>` : ""}
  `;

  actions.innerHTML = "";
  (p.links||[]).forEach(l => {
    const a = document.createElement("a");
    a.className = "btn primary";
    a.href = l.url;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = l.label;
    actions.appendChild(a);
  });

  modal.setAttribute("aria-hidden", "false");
}

function closeModal(){
  document.getElementById("modal")?.setAttribute("aria-hidden","true");
}

function escapeHtml(str){
  return String(str ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function wire(){
  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("build").textContent = `build: ${new Date().toISOString().slice(0,10)}`;

  document.getElementById("toggleLang").addEventListener("click", () => {
    state.lang = state.lang === "pt" ? "en" : "pt";
    applyI18n();
    setNow();
    renderProjects();
  });

  document.getElementById("search").addEventListener("input", renderProjects);
  document.getElementById("filter").addEventListener("change", renderProjects);

  document.getElementById("closeModal").addEventListener("click", closeModal);
  document.getElementById("modalBackdrop").addEventListener("click", closeModal);
  document.addEventListener("keydown", (e)=>{ if(e.key==="Escape") closeModal(); });
}

(async function init(){
  wire();
  applyI18n();
  setNow();
  await loadProjects();
})();

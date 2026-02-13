/* =========================
   CONFIG — COLE SEUS LINKS AQUI
========================= */
const PROFILE_LINKS = {
  linkedin: "https://www.linkedin.com/in/thabata-santos",
  github: "https://github.com/thabata-santos",
  email: "thabata@thabatasantos.com"
};

const DEFAULT_LANG = "pt"; // "pt" | "en"

/* =========================
   I18N STRINGS (PT/EN)
========================= */
const I18N = {
  pt: {
    nav_about: "Sobre",
    nav_projects: "Projetos",
    nav_certs: "Certificações",
    nav_contact: "Contato",
    hero_lead: "Construindo sistemas resilientes e escaláveis.",
    hero_body:
      "Estudante de Engenharia da Computação, focada em AWS, redes e infraestrutura. Portfólio com labs, automações e projetos replicáveis.",
    hero_cta_projects: "Ver projetos",
    chip_networks: "Redes",
    panel_title: "Highlights",
    panel_focus_k: "Foco",
    panel_now_k: "Agora",
    panel_mode_k: "Modo",
    panel_online: "Online",
    panel_hint: "Dica: clique nos cards para expandir.",
    sec_about: "Sobre",
    about_who_title: "Quem sou",
    about_who_body:
      "Sou estudante de Engenharia da Computação em transição para Cloud/Infra. Gosto de aprender na prática com labs e projetos replicáveis.",
    about_stack_title: "Stack & interesses",
    about_stack_1: "AWS (EC2, VPC, S3, RDS, Lambda, Route 53)",
    about_stack_2: "Linux, redes, troubleshooting",
    about_stack_3: "Infra como código (IaC) e automação",
    skills_hard_title: "Hard skills",
    skills_soft_title: "Soft skills",
    sec_projects: "Projetos",
    filter_all: "Todos",
    sec_certs: "Certificações & estudos",
    certs_in_progress: "Em andamento",
    certs_next: "Próximas",
    sec_contact: "Contato",
    contact_subtitle: "Vamos nos conectar?",
    contact_email_title: "E-mail",
    contact_social_title: "Social",
    contact_hint: "(Você vai colar seus links no app.js)",
    footer_build: "build:"
  },

  en: {
    nav_about: "About",
    nav_projects: "Projects",
    nav_certs: "Certifications",
    nav_contact: "Contact",
    hero_lead: "Building resilient and scalable systems.",
    hero_body:
      "Computer Engineering student focused on AWS, networking and infrastructure. Portfolio with labs, automation and replicable projects.",
    hero_cta_projects: "View projects",
    chip_networks: "Networking",
    panel_title: "Highlights",
    panel_focus_k: "Focus",
    panel_now_k: "Now",
    panel_mode_k: "Mode",
    panel_online: "Online",
    panel_hint: "Tip: click cards to expand.",
    sec_about: "About",
    about_who_title: "Who I am",
    about_who_body:
      "Computer Engineering student transitioning into Cloud/Infra. I learn by doing labs and replicable projects.",
    about_stack_title: "Stack & interests",
    about_stack_1: "AWS (EC2, VPC, S3, RDS, Lambda, Route 53)",
    about_stack_2: "Linux, networking, troubleshooting",
    about_stack_3: "Infrastructure as Code (IaC) and automation",
    skills_hard_title: "Hard skills",
    skills_soft_title: "Soft skills",
    sec_projects: "Projects",
    filter_all: "All",
    sec_certs: "Certifications & learning",
    certs_in_progress: "In progress",
    certs_next: "Next",
    sec_contact: "Contact",
    contact_subtitle: "Let’s connect?",
    contact_email_title: "Email",
    contact_social_title: "Social",
    contact_hint: "(Paste your links in app.js)",
    footer_build: "build:"
  }
};

/* =========================
   HELPERS
========================= */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function formatNow(lang) {
  const d = new Date();
  const opt = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  };
  const locale = lang === "en" ? "en-US" : "pt-BR";
  return new Intl.DateTimeFormat(locale, opt).format(d);
}

/* =========================
   I18N APPLY
========================= */
let LANG = localStorage.getItem("lang") || DEFAULT_LANG;

function applyI18n() {
  const dict = I18N[LANG] || I18N.pt;

  $$("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });

  // update search placeholder
  const search = $("#searchInput");
  if (search) {
    search.placeholder = LANG === "en" ? "Search project..." : "Buscar projeto...";
  }

  document.documentElement.lang = LANG === "en" ? "en" : "pt-BR";
  $("#nowText").textContent = formatNow(LANG);

  // update email
  const email = PROFILE_LINKS.email;
  $("#emailText").textContent = email;
  $("#emailLink").textContent = email;
  $("#emailLink").href = `mailto:${email}`;
  $("#emailBtn").href = `mailto:${email}`;

  // update social links
  $("#linkedinBtn").href = PROFILE_LINKS.linkedin || "#";
  $("#githubBtn").href = PROFILE_LINKS.github || "#";
}

/* =========================
   REVEAL ON SCROLL
========================= */
function setupReveal() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("show");
      });
    },
    { threshold: 0.12 }
  );

  $$(".reveal").forEach((el) => io.observe(el));
}

/* =========================
   EMAIL COPY
========================= */
function setupEmailCopy() {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE_LINKS.email);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = PROFILE_LINKS.email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
  };

  $("#copyEmailBtn")?.addEventListener("click", copy);
  $("#copyEmailBtn2")?.addEventListener("click", copy);
}

/* =========================
   PROJECTS (JSON) + FILTERS + MODAL
========================= */
let DATA = null;

function projectCardHTML(p) {
  const title = p.title?.[LANG] || p.title?.pt || "";
  const summary = p.summary?.[LANG] || p.summary?.pt || "";
  const tags = (p.tags || []).slice(0, 6);

  return `
    <article class="card projectCard reveal" data-id="${p.id}">
      <h3 class="cardTitle">${title}</h3>
      <p class="cardText">${summary}</p>

      <div class="projectMeta">
        ${tags.map((t) => `<span class="pillTag">${t}</span>`).join("")}
      </div>
    </article>
  `;
}

function renderProjects() {
  const grid = $("#projectsGrid");
  if (!grid || !DATA) return;

  const q = ($("#searchInput").value || "").toLowerCase().trim();
  const tag = $("#tagSelect").value;

  const list = (DATA.projects || []).filter((p) => {
    const title = (p.title?.[LANG] || p.title?.pt || "").toLowerCase();
    const summary = (p.summary?.[LANG] || p.summary?.pt || "").toLowerCase();
    const matchText = !q || title.includes(q) || summary.includes(q);

    const tags = p.tags || [];
    const matchTag = tag === "all" ? true : tags.includes(tag);

    return matchText && matchTag;
  });

  grid.innerHTML = list.map(projectCardHTML).join("");

  // re-attach reveal for new cards
  $$(".projectCard.reveal").forEach((el) => el.classList.remove("show"));
  setupReveal();

  // click open modal
  $$(".projectCard").forEach((el) => {
    el.addEventListener("click", () => openModal(el.getAttribute("data-id")));
  });
}

function openModal(id) {
  const p = (DATA.projects || []).find((x) => x.id === id);
  if (!p) return;

  const title = p.title?.[LANG] || p.title?.pt || "";
  const summary = p.summary?.[LANG] || p.summary?.pt || "";
  const details = p.details?.[LANG] || p.details?.pt || [];
  const repo = p.links?.repo || "";
  const demo = p.links?.demo || "";

  $("#modalContent").innerHTML = `
    <h3 class="cardTitle" style="font-size:20px;margin-top:0">${title}</h3>
    <p class="cardText" style="margin-bottom:14px">${summary}</p>

    ${details.length ? `<ul class="bullets">${details.map((d) => `<li>${d}</li>`).join("")}</ul>` : ""}

    <div class="projectMeta" style="margin-top:14px">
      ${(p.tags || []).map((t) => `<span class="pillTag">${t}</span>`).join("")}
    </div>

    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px">
      ${demo ? `<a class="btn primary" href="${demo}" target="_blank" rel="noreferrer">${LANG==="en"?"Open site":"Abrir site"}</a>` : ""}
      ${repo ? `<a class="btn ghost" href="${repo}" target="_blank" rel="noreferrer">${LANG==="en"?"Open repo":"Abrir repo"}</a>` : ""}
    </div>
  `;

  $("#modal").classList.add("open");
  $("#modal").setAttribute("aria-hidden", "false");
}

function closeModal() {
  $("#modal").classList.remove("open");
  $("#modal").setAttribute("aria-hidden", "true");
}

function setupModal() {
  $("#modal")?.addEventListener("click", (e) => {
    if (e.target?.dataset?.close) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

function fillTagSelect() {
  const select = $("#tagSelect");
  if (!select || !DATA) return;

  const set = new Set();
  (DATA.projects || []).forEach((p) => (p.tags || []).forEach((t) => set.add(t)));

  const tags = Array.from(set).sort((a, b) => a.localeCompare(b));

  // keep first option (All/Todos) then append
  select.innerHTML = `<option value="all">${I18N[LANG].filter_all}</option>` + tags.map((t) => `<option value="${t}">${t}</option>`).join("");
}

/* =========================
   SKILLS + CERTS from JSON
========================= */
function renderSkillsAndCerts() {
  if (!DATA) return;

  const hard = $("#hardSkills");
  const soft = $("#softSkills");

  hard.innerHTML = (DATA.hardSkills || []).map((s) => `<span class="tag">${s[LANG] || s.pt}</span>`).join("");
  soft.innerHTML = (DATA.softSkills || []).map((s) => `<span class="tag">${s[LANG] || s.pt}</span>`).join("");

  const now = $("#certsNow");
  const next = $("#certsNext");

  now.innerHTML = (DATA.certs?.now || []).map((c) => `<li>${c[LANG] || c.pt}</li>`).join("");
  next.innerHTML = (DATA.certs?.next || []).map((c) => `<li>${c[LANG] || c.pt}</li>`).join("");
}

/* ================= PREMIUM CURSOR ================= */

const cursor = document.querySelector('.cursor');

let mouseX = 0;
let mouseY = 0;
let currentX = 0;
let currentY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  currentX += (mouseX - currentX) * 0.12;
  currentY += (mouseY - currentY) * 0.12;

  cursor.style.left = currentX + 'px';
  cursor.style.top = currentY + 'px';

  requestAnimationFrame(animateCursor);
}

animateCursor();

/* HOVER EFFECT */

const interactiveElements = document.querySelectorAll('a, button, .card, .project-card');

interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('cursor-hover');
  });

  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('cursor-hover');
  });
});

/* =========================
   NEURAL NETWORK BACKGROUND (Canvas)
========================= */
function setupNeural() {
  const canvas = $("#neural");
  const ctx = canvas.getContext("2d");

  let w, h, dpr;
  const points = [];
  const N = 62;
  const maxDist = 140;

  function resize() {
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    w = canvas.width = Math.floor(window.innerWidth * dpr);
    h = canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    points.length = 0;
    for (let i = 0; i < N; i++) {
      points.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35 * dpr,
        vy: (Math.random() - 0.5) * 0.35 * dpr
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // nodes
    for (const p of points) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    }

    // lines
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const a = points[i], b = points[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < maxDist * dpr) {
          const t = 1 - dist / (maxDist * dpr);
          // cyan ↔ pink alternation
          ctx.strokeStyle = `rgba(34,240,255,${0.10 * t})`;
          ctx.lineWidth = 1 * dpr;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();

          ctx.strokeStyle = `rgba(255,43,214,${0.06 * t})`;
          ctx.beginPath();
          ctx.moveTo(a.x+1*dpr, a.y+1*dpr);
          ctx.lineTo(b.x+1*dpr, b.y+1*dpr);
          ctx.stroke();
        }
      }
    }

    // nodes glow
    for (const p of points) {
      ctx.fillStyle = "rgba(34,240,255,.28)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6 * dpr, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(255,43,214,.18)";
      ctx.beginPath();
      ctx.arc(p.x + 1.2*dpr, p.y + 1.2*dpr, 1.3 * dpr, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  draw();
}

/* =========================
   LOAD JSON
========================= */
async function loadData() {
  const res = await fetch("./data/projects.json", { cache: "no-store" });
  DATA = await res.json();
}

/* =========================
   INIT
========================= */
function setupLangToggle() {
  $("#langToggle").addEventListener("click", () => {
    LANG = LANG === "pt" ? "en" : "pt";
    localStorage.setItem("lang", LANG);

    applyI18n();
    fillTagSelect();
    renderSkillsAndCerts();
    renderProjects();
  });
}

function setupFilters() {
  $("#searchInput").addEventListener("input", renderProjects);
  $("#tagSelect").addEventListener("change", renderProjects);
}

function setupFooter() {
  $("#year").textContent = new Date().getFullYear();
  $("#buildStamp").textContent = formatNow(LANG);
}

(async function init() {
  // stamp now (and update every second)
  $("#nowText").textContent = formatNow(LANG);
  setInterval(() => ($("#nowText").textContent = formatNow(LANG)), 1000);

  setupCursor();
  setupNeural();

  await loadData();

  applyI18n();
  setupReveal();
  setupEmailCopy();
  setupModal();

  renderSkillsAndCerts();
  fillTagSelect();
  renderProjects();

  setupFilters();
  setupLangToggle();
  setupFooter();
})();
function setupCursorReactive() {
  const cursor = document.getElementById("cursorGlow");

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });

  document.querySelectorAll("a, button, .glassCard").forEach(el => {
    el.addEventListener("mouseenter", () => {
      cursor.style.background = "var(--neon-blue)";
      cursor.style.transform = "scale(1.8)";
    });
    el.addEventListener("mouseleave", () => {
      cursor.style.background = "var(--neon-pink)";
      cursor.style.transform = "scale(1)";
    });
  });
}

setupCursorReactive();


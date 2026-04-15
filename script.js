/* ============================================================
   PORTFOLIO — script.js
   Handles: routing, projects, ideas (localStorage), canvas,
   chaos mode, theme toggle, search/filter, modal, animations
   ============================================================ */

'use strict';

/* ===================================================
   1. DATA — Edit these to add your projects!
   =================================================== */

/**
 * PROJECTS ARRAY
 * To add a new project, copy one object and fill in your details.
 * status: "Completed" | "In Progress" | "Idea"
 */
const PROJECTS = [
  {
    id: 1,
    title: "Portfolio Website",
    description: "This very site! A personal hub to showcase projects and ideas, built with pure HTML, CSS, and JS.",
    tags: ["HTML", "CSS", "JavaScript"],
    status: "Completed",
    techStack: ["HTML5", "CSS3", "Vanilla JS", "Canvas API"],
    fullDescription: "A fully responsive personal portfolio with dark/light mode, an Ideas Vault with localStorage persistence, project search & filtering, chaos mode, and smooth JS-based routing — no frameworks used.",
    link: "#",
    image: null, // Set to an image path like "images/portfolio.png"
  },
  {
    id: 2,
    title: "My First App",
    description: "A short description of your first app goes here. What does it do? Who is it for?",
    tags: ["Tool", "JavaScript"],
    status: "In Progress",
    techStack: ["JavaScript", "LocalStorage"],
    fullDescription: "Replace this with your actual project's full description. Explain the problem it solves, how it works, and what you learned building it.",
    link: "#",
    image: null,
  },
  {
    id: 3,
    title: "Game Concept",
    description: "A browser-based game idea you want to build. Describe the gameplay mechanics here.",
    tags: ["Game", "HTML", "Canvas"],
    status: "Idea",
    techStack: ["HTML5 Canvas", "JavaScript"],
    fullDescription: "Games are one of the best ways to learn programming. This is a placeholder for your upcoming game project. Replace with real details when you start building.",
    link: "#",
    image: null,
  },
  {
    id: 4,
    title: "Web Tool",
    description: "A useful utility or web tool that solves a problem you have. Add your real description here.",
    tags: ["Tool", "JavaScript"],
    status: "Completed",
    techStack: ["JavaScript", "CSS", "HTML"],
    fullDescription: "This is a placeholder for a completed web tool. Replace all fields in the PROJECTS array in script.js with your actual project information.",
    link: "#",
    image: null,
  },
];

/* ===================================================
   1b. SKILLS DATA — Edit these!
   =================================================== */

const SKILLS = [
  {
    category: "Languages",
    icon: "fa-solid fa-code",
    items: ["JavaScript", "HTML5", "CSS3", "Python", "Java"]
  },
  {
    category: "Frontend",
    icon: "fa-solid fa-palette",
    items: ["React", "CSS Grid", "Flexbox", "Canvas API", "Responsive Design"]
  },
  {
    category: "Backend & DB",
    icon: "fa-solid fa-server",
    items: ["Node.js", "Express", "MongoDB", "Firebase", "LocalStorage"]
  },
  {
    category: "Tools",
    icon: "fa-solid fa-wrench",
    items: ["Git", "GitHub", "VS Code", "Figma", "Chrome DevTools"]
  },
  {
    category: "Interests",
    icon: "fa-solid fa-star",
    items: ["Game Dev", "AI/ML", "Open Source", "UI Design", "Automation"]
  },
];

/* ===================================================
   1c. TIMELINE DATA — Edit these!
   =================================================== */

const TIMELINE = [
  {
    year: "2024",
    title: "Started building publicly",
    description: "Began sharing projects online, documenting the process of learning by doing."
  },
  {
    year: "2023",
    title: "First real web project",
    description: "Built and shipped my first complete web application from scratch."
  },
  {
    year: "2022",
    title: "Learned to code seriously",
    description: "Committed to daily coding practice and picked up JavaScript properly."
  },
  {
    year: "2021",
    title: "First line of code",
    description: "Wrote Hello World and got completely hooked. Been building ever since."
  },
];



let currentSection = 'home';

/**
 * Navigates to a named section and updates the nav.
 * @param {string} sectionId
 */
function navigateTo(sectionId) {
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link');

  // Hide all sections
  sections.forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });

  // Show target
  const target = document.getElementById(sectionId);
  if (target) {
    target.style.display = 'block';
    // Trigger reflow for animation
    void target.offsetHeight;
    target.classList.add('active');
  }

  // Update nav active state
  navLinks.forEach(l => {
    l.classList.toggle('active', l.dataset.section === sectionId);
  });

  // Update history (so back button works)
  history.pushState({ section: sectionId }, '', `#${sectionId}`);

  // Close mobile menu
  closeMobileMenu();

  currentSection = sectionId;

  // Trigger scroll-based reveals for the new section
  setTimeout(runRevealAnimations, 50);

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ===================================================
   3. NAV — Mobile hamburger + nav link wiring
   =================================================== */

function initNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Wire all nav-link clicks
  document.querySelectorAll('[data-section]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(el.dataset.section);
    });
  });

  // Handle browser back/forward
  window.addEventListener('popstate', (e) => {
    const section = e.state?.section || 'home';
    navigateTo(section);
  });

  // Handle direct URL hash on load
  const hash = location.hash.replace('#', '');
  const validSections = ['home', 'projects', 'skills', 'ideas', 'contact'];
  if (hash && validSections.includes(hash)) {
    navigateTo(hash);
  }
}

function closeMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.remove('open');
  hamburger.classList.remove('open');
}

/* ===================================================
   4. CANVAS GRID — Animated background on home
   =================================================== */

function initCanvas() {
  const canvas = document.getElementById('gridCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, dots = [], animFrameId;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildDots();
  }

  function buildDots() {
    dots = [];
    const spacing = 44;
    const cols = Math.ceil(W / spacing) + 1;
    const rows = Math.ceil(H / spacing) + 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push({
          x: c * spacing,
          y: r * spacing,
          baseX: c * spacing,
          baseY: r * spacing,
          phase: Math.random() * Math.PI * 2,
          amp: Math.random() * 1.5,
        });
      }
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const dotColor = isDark ? 'rgba(157,255,89,0.25)' : 'rgba(60,160,20,0.2)';
    const lineColor = isDark ? 'rgba(157,255,89,0.05)' : 'rgba(60,160,20,0.07)';

    // Draw connection lines
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 0.5;
    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      const dx = d.x + Math.sin(t * 0.0008 + d.phase) * d.amp;
      const dy = d.y + Math.cos(t * 0.0008 + d.phase) * d.amp;
      for (let j = i + 1; j < dots.length; j++) {
        const d2 = dots[j];
        const dx2 = d2.x + Math.sin(t * 0.0008 + d2.phase) * d2.amp;
        const dy2 = d2.y + Math.cos(t * 0.0008 + d2.phase) * d2.amp;
        const dist = Math.hypot(dx2 - dx, dy2 - dy);
        if (dist < 60) {
          ctx.globalAlpha = (1 - dist / 60) * 0.3;
          ctx.beginPath();
          ctx.moveTo(dx, dy);
          ctx.lineTo(dx2, dy2);
          ctx.stroke();
        }
      }
    }

    // Draw dots
    ctx.globalAlpha = 1;
    ctx.fillStyle = dotColor;
    dots.forEach(d => {
      const dx = d.x + Math.sin(t * 0.0008 + d.phase) * d.amp;
      const dy = d.y + Math.cos(t * 0.0008 + d.phase) * d.amp;
      ctx.beginPath();
      ctx.arc(dx, dy, 1.2, 0, Math.PI * 2);
      ctx.fill();
    });

    animFrameId = requestAnimationFrame(draw);
  }

  // Observer: only animate when home is visible (performance)
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        if (!animFrameId) animFrameId = requestAnimationFrame(draw);
      } else {
        if (animFrameId) { cancelAnimationFrame(animFrameId); animFrameId = null; }
      }
    });
  });
  observer.observe(canvas.parentElement);

  window.addEventListener('resize', resize);
  resize();
}

/* ===================================================
   5. CURSOR GLOW (desktop)
   =================================================== */

function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;
  window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

/* ===================================================
   6. PROJECTS — Render, search, filter
   =================================================== */

let activeFilter = 'all';
let searchQuery = '';

function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  const empty = document.getElementById('projectsEmpty');

  const filtered = PROJECTS.filter(p => {
    const matchFilter = activeFilter === 'all' || p.status === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q));
    return matchFilter && matchSearch;
  });

  grid.innerHTML = '';

  if (filtered.length === 0) {
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  filtered.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'project-card reveal';
    card.style.transitionDelay = `${i * 0.07}s`;
    card.dataset.id = p.id;

    const statusClass = p.status === 'Completed' ? 'status-completed'
      : p.status === 'In Progress' ? 'status-in-progress'
      : 'status-idea';

    card.innerHTML = `
      <div class="card-header">
        <h3 class="card-title">${escHtml(p.title)}</h3>
        <span class="card-status ${statusClass}">${escHtml(p.status)}</span>
      </div>
      <p class="card-desc">${escHtml(p.description)}</p>
      <div class="card-tags">
        ${p.tags.map(t => `<span class="tag">${escHtml(t)}</span>`).join('')}
      </div>
      <div class="card-footer">
        <span class="card-view-btn">
          View details <i class="fa-solid fa-arrow-right"></i>
        </span>
      </div>
    `;

    card.addEventListener('click', () => openProjectModal(p));
    grid.appendChild(card);
  });

  setTimeout(runRevealAnimations, 50);
}

function openProjectModal(project) {
  const modal = document.getElementById('projectModal');
  const body = document.getElementById('modalBody');

  const statusClass = project.status === 'Completed' ? 'status-completed'
    : project.status === 'In Progress' ? 'status-in-progress'
    : 'status-idea';

  body.innerHTML = `
    ${project.image
      ? `<img src="${escHtml(project.image)}" alt="${escHtml(project.title)}" style="width:100%;border-radius:8px;margin-bottom:20px;">`
      : `<div class="modal-img-placeholder"><i class="fa-regular fa-image" style="margin-right:8px;"></i> Image coming soon</div>`
    }
    <h2 class="modal-title">${escHtml(project.title)}</h2>
    <div class="modal-meta">
      <span class="card-status ${statusClass}">${escHtml(project.status)}</span>
      ${project.tags.map(t => `<span class="tag">${escHtml(t)}</span>`).join('')}
    </div>
    <p class="modal-desc">${escHtml(project.fullDescription || project.description)}</p>
    ${project.techStack?.length ? `
      <div class="modal-section">
        <div class="modal-section-label">Tech Stack</div>
        <div class="modal-tech">
          ${project.techStack.map(t => `<span class="tag">${escHtml(t)}</span>`).join('')}
        </div>
      </div>` : ''}
    ${project.link && project.link !== '#' ? `
      <a href="${escHtml(project.link)}" target="_blank" rel="noopener" class="modal-link">
        <i class="fa-solid fa-up-right-from-square"></i> View Live Project
      </a>` : `
      <span class="modal-link" style="opacity:0.4;cursor:default;">
        <i class="fa-solid fa-link-slash"></i> Link coming soon
      </span>`
    }
  `;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  document.getElementById('projectModal').classList.add('hidden');
  document.body.style.overflow = '';
}

function initProjects() {
  renderProjects();

  // Search
  const searchInput = document.getElementById('projectSearch');
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderProjects();
  });

  // Filter tags
  document.getElementById('filterTags').addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-tag');
    if (!btn) return;
    document.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    renderProjects();
  });

  // Modal close
  document.getElementById('modalClose').addEventListener('click', closeProjectModal);
  document.getElementById('projectModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('projectModal')) closeProjectModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeProjectModal();
  });
}

/* ===================================================
   7. IDEAS VAULT — localStorage CRUD
   =================================================== */

const IDEAS_KEY = 'portfolio_ideas';

function loadIdeas() {
  try {
    return JSON.parse(localStorage.getItem(IDEAS_KEY)) || [];
  } catch { return []; }
}

function saveIdeas(ideas) {
  localStorage.setItem(IDEAS_KEY, JSON.stringify(ideas));
}

function renderIdeas() {
  const ideas = loadIdeas();
  const grid = document.getElementById('ideasGrid');
  const empty = document.getElementById('ideasEmpty');

  grid.innerHTML = '';

  if (ideas.length === 0) {
    empty.classList.remove('hidden');
    updateStats();
    return;
  }
  empty.classList.add('hidden');

  // Show newest first
  [...ideas].reverse().forEach((idea, i) => {
    const card = document.createElement('div');
    card.className = 'idea-card reveal';
    card.style.transitionDelay = `${i * 0.06}s`;

    const prioClass = idea.priority === 'High' ? 'priority-high'
      : idea.priority === 'Medium' ? 'priority-medium'
      : 'priority-low';

    card.innerHTML = `
      <div class="idea-header">
        <h3 class="idea-title">${escHtml(idea.title)}</h3>
        <span class="idea-priority ${prioClass}">${escHtml(idea.priority)}</span>
      </div>
      <p class="idea-desc">${escHtml(idea.description)}</p>
      <div class="idea-footer">
        <span class="idea-category">${escHtml(idea.category)}</span>
        <button class="idea-delete" data-id="${idea.id}" title="Delete idea">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `;
    grid.appendChild(card);
  });

  // Delete buttons
  grid.querySelectorAll('.idea-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteIdea(btn.dataset.id);
    });
  });

  setTimeout(runRevealAnimations, 50);
  updateStats();
}

function deleteIdea(id) {
  let ideas = loadIdeas();
  ideas = ideas.filter(i => i.id !== id);
  saveIdeas(ideas);
  renderIdeas();
  showToast('Idea deleted');
}

function addIdea(data) {
  const ideas = loadIdeas();
  const newIdea = {
    id: Date.now().toString(),
    title: data.title.trim(),
    description: data.description.trim(),
    category: data.category,
    priority: data.priority,
    createdAt: new Date().toISOString(),
  };
  ideas.push(newIdea);
  saveIdeas(ideas);
  renderIdeas();
  showToast('✓ Idea saved!');
}

function initIdeas() {
  renderIdeas();

  const toggleBtn = document.getElementById('toggleIdeaForm');
  const form = document.getElementById('ideaForm');
  const cancelBtn = document.getElementById('cancelIdea');
  const saveBtn = document.getElementById('saveIdea');

  toggleBtn.addEventListener('click', () => {
    form.classList.toggle('hidden');
    if (!form.classList.contains('hidden')) {
      document.getElementById('ideaTitle').focus();
      toggleBtn.innerHTML = '<i class="fa-solid fa-minus"></i> Cancel';
    } else {
      toggleBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add New Idea';
    }
  });

  cancelBtn.addEventListener('click', () => {
    form.classList.add('hidden');
    toggleBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add New Idea';
    clearIdeaForm();
  });

  saveBtn.addEventListener('click', () => {
    const title = document.getElementById('ideaTitle').value;
    const desc = document.getElementById('ideaDesc').value;
    const category = document.getElementById('ideaCategory').value;
    const priority = document.getElementById('ideaPriority').value;

    if (!title.trim()) { showToast('⚠ Please enter a title'); return; }
    if (!desc.trim()) { showToast('⚠ Please enter a description'); return; }

    addIdea({ title, description: desc, category, priority });
    clearIdeaForm();
    form.classList.add('hidden');
    toggleBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add New Idea';
  });
}

function clearIdeaForm() {
  document.getElementById('ideaTitle').value = '';
  document.getElementById('ideaDesc').value = '';
  document.getElementById('ideaCategory').value = 'App';
  document.getElementById('ideaPriority').value = 'Medium';
}

/* ===================================================
   8b. SKILLS — Render skill categories
   =================================================== */

function renderSkills() {
  const grid = document.getElementById('skillsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  SKILLS.forEach((cat, i) => {
    const div = document.createElement('div');
    div.className = 'skill-category reveal';
    div.style.transitionDelay = `${i * 0.07}s`;
    div.innerHTML = `
      <div class="skill-cat-header">
        <div class="skill-cat-icon"><i class="${escHtml(cat.icon)}"></i></div>
        <span class="skill-cat-name">${escHtml(cat.category)}</span>
      </div>
      <div class="skill-items">
        ${cat.items.map(item => `<span class="skill-pill">${escHtml(item)}</span>`).join('')}
      </div>
    `;
    grid.appendChild(div);
  });
  setTimeout(runRevealAnimations, 50);
}

function renderTimeline() {
  const tl = document.getElementById('timeline');
  if (!tl) return;
  tl.innerHTML = '';
  TIMELINE.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'timeline-item reveal';
    div.style.transitionDelay = `${i * 0.1}s`;
    div.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-year">${escHtml(item.year)}</div>
      <h3 class="timeline-title">${escHtml(item.title)}</h3>
      <p class="timeline-desc">${escHtml(item.description)}</p>
    `;
    tl.appendChild(div);
  });
  setTimeout(runRevealAnimations, 50);
}

/* ===================================================
   8. THEME TOGGLE — Dark / Light
   =================================================== */

function initTheme() {
  const saved = localStorage.getItem('portfolio_theme') || 'dark';
  setTheme(saved);

  document.getElementById('themeToggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('portfolio_theme', theme);
}

/* ===================================================
   9. CHAOS MODE — For fun 🎉
   =================================================== */

let chaosActive = false;
let chaosTimeout = null;

function initChaos() {
  document.getElementById('chaosBtn').addEventListener('click', () => {
    if (chaosActive) {
      deactivateChaos();
    } else {
      activateChaos();
    }
  });
}

function activateChaos() {
  chaosActive = true;
  document.body.classList.add('chaos');

  // Randomly jitter cards
  document.querySelectorAll('.project-card, .idea-card, .contact-card').forEach(card => {
    card.style.transform = `rotate(${(Math.random() - 0.5) * 3}deg)`;
  });

  // Change accent colour randomly
  const hues = [120, 180, 0, 280, 60];
  const pick = hues[Math.floor(Math.random() * hues.length)];
  document.documentElement.style.setProperty('--accent',
    `hsl(${pick}, 100%, 65%)`);

  showToast('⚡ CHAOS MODE ACTIVATED');

  // Auto-disable after 5s
  chaosTimeout = setTimeout(deactivateChaos, 5000);
}

function deactivateChaos() {
  clearTimeout(chaosTimeout);
  chaosActive = false;
  document.body.classList.remove('chaos');
  document.documentElement.style.removeProperty('--accent');

  document.querySelectorAll('.project-card, .idea-card, .contact-card').forEach(card => {
    card.style.transform = '';
  });

  showToast('😌 Calm restored');
}

/* ===================================================
   10. SCROLL REVEAL ANIMATIONS
   =================================================== */

function runRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal:not(.visible)');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => observer.observe(el));
}

/* ===================================================
   11. STATS COUNTER — Home page animated numbers
   =================================================== */

function updateStats() {
  const ideas = loadIdeas();
  animateCount('statProjects', PROJECTS.length);
  animateCount('statIdeas', ideas.length);
}

function animateCount(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  const start = parseInt(el.textContent) || 0;
  const duration = 800;
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    el.textContent = Math.round(start + (target - start) * eased);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ===================================================
   12. TOAST NOTIFICATIONS
   =================================================== */

let toastTimeout = null;

function showToast(message, duration = 2800) {
  const toast = document.getElementById('toast');
  toast.classList.remove('hidden');
  toast.textContent = message;
  // Trigger show animation
  void toast.offsetHeight;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.classList.add('hidden'), 350);
  }, duration);
}

/* ===================================================
   13. UTILS
   =================================================== */

/** Escape HTML to prevent XSS */
function escHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ===================================================
   14. CONTACT — Set current year
   =================================================== */

function initContact() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ===================================================
   15. INIT — Wire everything up on DOMContentLoaded
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Set up all modules
  initNav();
  initCanvas();
  initCursorGlow();
  initProjects();
  initIdeas();
  initTheme();
  initChaos();
  initContact();
  renderSkills();
  renderTimeline();

  // Show home section by default
  const hash = location.hash.replace('#', '');
  const validSections = ['home', 'projects', 'ideas', 'contact'];
  const startSection = (hash && validSections.includes(hash)) ? hash : 'home';

  // Make sections display:none except active
  document.querySelectorAll('.section').forEach(s => {
    if (s.id !== startSection) {
      s.style.display = 'none';
      s.classList.remove('active');
    }
  });

  navigateTo(startSection);
  updateStats();
  runRevealAnimations();

  console.log('%c[ Portfolio loaded ]', 'color:#9dff59;font-family:monospace;font-size:14px;');
  console.log('%cEdit the PROJECTS array in script.js to add your own projects!', 'color:#59ffda;font-family:monospace;');
});

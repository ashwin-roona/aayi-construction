/* =============================================
   FORGED CONSTRUCTION — main.js
   Three.js + GSAP + Parallax + Interactions
============================================= */

'use strict';

/* ── LOADER ─────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loader');
  const pct    = document.getElementById('loaderPercent');
  let count = 0;

  const tick = setInterval(() => {
    count += Math.random() * 12 + 4;
    if (count >= 100) {
      count = 100;
      clearInterval(tick);
      pct.textContent = '100%';

      setTimeout(() => {
        gsap.to(loader, {
          yPercent: -100,
          duration: 1.2,
          ease: 'power4.inOut',
          onComplete: () => { loader.style.display = 'none'; initAll(); }
        });
      }, 400);
    }
    pct.textContent = Math.floor(count) + '%';
  }, 80);
})();

/* ── INIT EVERYTHING after loader ───────────── */
function initAll() {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  initCursor();
  initNav();
  initFeatureCanvas();
  initBlueprintCanvas();
  initStructuralCanvas();
  initCityCanvas();
  initContactPageCanvas();
  initAwardsCanvas();
  initRevealAnimations();
  initParallax();
  initCounters();
  initMarquee();
  initProjectFilter();
  initSlider();
  initProcessSteps();
  initContactForm();
  initSmoothScroll();
  initHamburger();
  initFAQ();
}

/* ── CUSTOM CURSOR ──────────────────────────── */
function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || window.matchMedia('(max-width: 768px)').matches) return;

  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    gsap.to(cursor, { x: mx, y: my, duration: 0.1 });
  });

  (function loop() {
    fx += (mx - fx) * 0.08;
    fy += (my - fy) * 0.08;
    gsap.set(follower, { x: fx, y: fy });
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll('a, button, .service-card, .project-card, .filter-btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursor,   { scale: 2, duration: 0.3 });
      gsap.to(follower, { scale: 1.5, duration: 0.3 });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(cursor,   { scale: 1, duration: 0.3 });
      gsap.to(follower, { scale: 1, duration: 0.3 });
    });
  });
}

/* ── NAVIGATION ─────────────────────────────── */
function initNav() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
}

/* ── HAMBURGER / MOBILE MENU ────────────────── */
function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
    const spans = btn.querySelectorAll('span');
    if (menu.classList.contains('open')) {
      gsap.to(spans[0], { rotation: 45, y: 6, duration: 0.3 });
      gsap.to(spans[1], { opacity: 0, duration: 0.2 });
      gsap.to(spans[2], { rotation: -45, y: -6, duration: 0.3 });
    } else {
      gsap.to(spans, { rotation: 0, y: 0, opacity: 1, duration: 0.3 });
    }
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      gsap.to(btn.querySelectorAll('span'), { rotation: 0, y: 0, opacity: 1, duration: 0.3 });
    });
  });
}

/* ── SMOOTH SCROLL ──────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      gsap.to(window, { scrollTo: { y: target, offsetY: 80 }, duration: 1.2, ease: 'power3.inOut' });
    });
  });
}

/* ── THREE.JS FEATURE CANVAS ────────────────── */
function initFeatureCanvas() {
  const canvas = document.getElementById('featureCanvas');
  if (!canvas || !window.THREE) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
  camera.position.z = 5;

  // Rotating geometric structure
  const group = new THREE.Group();

  // Outer icosahedron wireframe
  const icoGeo = new THREE.IcosahedronGeometry(2, 1);
  const icoMat = new THREE.MeshBasicMaterial({ color: 0xc8a96e, wireframe: true, transparent: true, opacity: 0.15 });
  const ico = new THREE.Mesh(icoGeo, icoMat);
  group.add(ico);

  // Inner octahedron
  const octGeo = new THREE.OctahedronGeometry(1.2, 1);
  const octMat = new THREE.MeshBasicMaterial({ color: 0xe8c87a, wireframe: true, transparent: true, opacity: 0.2 });
  const oct = new THREE.Mesh(octGeo, octMat);
  group.add(oct);

  // Core sphere
  const sphGeo = new THREE.SphereGeometry(0.5, 16, 16);
  const sphMat = new THREE.MeshBasicMaterial({ color: 0xc8a96e, wireframe: true, transparent: true, opacity: 0.4 });
  const sph = new THREE.Mesh(sphGeo, sphMat);
  group.add(sph);

  // Ring particles
  const ringCount = 80;
  const rPositions = new Float32Array(ringCount * 3);
  for (let i = 0; i < ringCount; i++) {
    const angle = (i / ringCount) * Math.PI * 2;
    const r = 2.8 + Math.sin(i * 0.5) * 0.3;
    rPositions[i * 3]     = Math.cos(angle) * r;
    rPositions[i * 3 + 1] = Math.sin(angle * 2) * 0.3;
    rPositions[i * 3 + 2] = Math.sin(angle) * r;
  }
  const rGeo = new THREE.BufferGeometry();
  rGeo.setAttribute('position', new THREE.BufferAttribute(rPositions, 3));
  const rMat = new THREE.PointsMaterial({ color: 0xc8a96e, size: 0.05, transparent: true, opacity: 0.6 });
  const ring = new THREE.Points(rGeo, rMat);
  group.add(ring);

  scene.add(group);

  let mx = 0, my = 0;
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mx = (e.clientX - rect.left) / rect.width  - 0.5;
    my = (e.clientY - rect.top)  / rect.height - 0.5;
  });

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.005;

    ico.rotation.y = t * 0.4;
    ico.rotation.x = t * 0.2;
    oct.rotation.y = -t * 0.6;
    oct.rotation.z = t * 0.3;
    sph.rotation.x = t;
    ring.rotation.y = t * 0.2;

    group.rotation.y += (mx * 0.5 - group.rotation.y) * 0.03;
    group.rotation.x += (-my * 0.3 - group.rotation.x) * 0.03;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  });
}

/* ── REVEAL ANIMATIONS ──────────────────────── */
function initRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal, .reveal-light');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 120);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => observer.observe(el));

  // Service cards stagger
  const serviceCards = document.querySelectorAll('.service-card');
  const sObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      gsap.fromTo(serviceCards,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }
      );
      sObserver.unobserve(entries[0].target);
    }
  }, { threshold: 0.1 });
  if (serviceCards[0]) sObserver.observe(serviceCards[0]);

  // Process steps
  const processSteps = document.querySelectorAll('.process-step');
  const pObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      gsap.fromTo(processSteps,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
      );
      pObserver.unobserve(entries[0].target);
    }
  }, { threshold: 0.1 });
  if (processSteps[0]) pObserver.observe(processSteps[0]);

  // Project cards
  const projectCards = document.querySelectorAll('.project-card');
  const prObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      gsap.fromTo(projectCards,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' }
      );
      prObserver.unobserve(entries[0].target);
    }
  }, { threshold: 0.05 });
  if (projectCards[0]) prObserver.observe(projectCards[0]);
}

/* ── PARALLAX LAYER ─────────────────────────── */
function initParallax() {
  const layer = document.getElementById('parallaxBg');
  if (!layer) return;

  window.addEventListener('scroll', () => {
    const section = layer.parentElement;
    const rect    = section.getBoundingClientRect();
    const pct     = -rect.top / window.innerHeight;
    layer.style.transform = `translateY(${pct * 60}px)`;
  });

  // About image parallax
  const aboutImg = document.getElementById('aboutImg');
  if (aboutImg) {
    window.addEventListener('scroll', () => {
      const rect = aboutImg.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const pct = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        aboutImg.style.transform = `translateY(${(pct - 0.5) * -30}px)`;
      }
    });
  }
}

/* ── COUNTER ANIMATION ──────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-count]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count);
      const dur    = 2000;
      const step   = Math.ceil(target / (dur / 16));
      let current  = 0;

      const tick = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(tick); }
        el.textContent = current;
      }, 16);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ── MARQUEE HOVER PAUSE ────────────────────── */
function initMarquee() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;
  track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
}

/* ── PROJECT FILTER ─────────────────────────── */
function initProjectFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.cat === filter;
        gsap.to(card, {
          opacity: show ? 1 : 0.15,
          scale:   show ? 1 : 0.95,
          duration: 0.4,
          ease: 'power2.inOut'
        });
      });
    });
  });
}

/* ── TESTIMONIAL SLIDER ─────────────────────── */
function initSlider() {
  const track    = document.getElementById('testimonialsTrack');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  const dots     = document.querySelectorAll('.slider-dots .dot');
  if (!track) return;

  let current = 0;
  const total = track.children.length;

  function goTo(idx) {
    current = (idx + total) % total;
    gsap.to(track, { x: `-${current * 100}%`, duration: 0.7, ease: 'power3.inOut' });
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

  // Auto-advance
  setInterval(() => goTo(current + 1), 5000);
}

/* ── PROCESS STEPS HOVER ────────────────────── */
function initProcessSteps() {
  document.querySelectorAll('.process-step').forEach(step => {
    step.addEventListener('mouseenter', () => {
      gsap.to(step.querySelector('.step-number'), { color: '#c8a96e', duration: 0.3 });
    });
    step.addEventListener('mouseleave', () => {
      gsap.to(step.querySelector('.step-number'), { color: 'rgba(255,255,255,0.06)', duration: 0.3 });
    });
  });
}

/* ── CONTACT FORM ───────────────────────────── */
function initContactForm() {
  const forms = document.querySelectorAll('.contact-form');
  forms.forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = 'Message Sent ✓';
      btn.style.background = '#4ade80';
      btn.style.color = '#000';
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        btn.style.color = '';
        form.reset();
      }, 3000);
    });

    form.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('focus', () => {
        gsap.to(input, { borderColor: '#c8a96e', duration: 0.3 });
      });
      input.addEventListener('blur', () => {
        gsap.to(input, { borderColor: '#333', duration: 0.3 });
      });
    });
  });
}

/* ── HERO CANVAS (about.html hero) ──────────── */
function initBlueprintCanvas() {
  const canvas = document.getElementById('blueprintCanvas');
  if (!canvas || !window.THREE) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
  camera.position.set(0, 0, 5);

  // Particle field
  const pCount = 2500;
  const positions = new Float32Array(pCount * 3);
  const colors    = new Float32Array(pCount * 3);

  for (let i = 0; i < pCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

    const gold = Math.random() > 0.7;
    colors[i * 3]     = gold ? 0.78 : 0.9;
    colors[i * 3 + 1] = gold ? 0.66 : 0.9;
    colors[i * 3 + 2] = gold ? 0.27 : 0.9;
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute('color',    new THREE.BufferAttribute(colors,    3));

  const pMat = new THREE.PointsMaterial({
    size: 0.04, vertexColors: true,
    transparent: true, opacity: 0.7, sizeAttenuation: true,
  });

  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // Wireframe skyline silhouette
  const buildingGroup = new THREE.Group();

  function addBox(w, h, d, x, y, z, col = 0xc8a96e) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshBasicMaterial({ color: col, wireframe: true, transparent: true, opacity: 0.12 })
    );
    mesh.position.set(x, y, z);
    buildingGroup.add(mesh);
  }

  addBox(0.6, 3.5, 0.6,  -3,   -0.75, 0);
  addBox(0.5, 2.2, 0.5,  -2.2, -1.4,  0);
  addBox(0.8, 5.0, 0.8,  -1.2,  0.5,  0);
  addBox(0.4, 1.8, 0.4,  -0.4, -1.6,  0);
  addBox(1.0, 6.5, 1.0,   0.8,  1.25, 0);
  addBox(0.5, 2.8, 0.5,   2.0, -1.1,  0);
  addBox(0.7, 4.2, 0.7,   2.9,  0.1,  0);
  addBox(0.4, 1.6, 0.4,   3.8, -1.7,  0);

  buildingGroup.position.y = -1.5;
  scene.add(buildingGroup);

  // Ground grid
  const gridHelper = new THREE.GridHelper(20, 30, 0xc8a96e, 0x1a1a1a);
  gridHelper.material.opacity = 0.08;
  gridHelper.material.transparent = true;
  gridHelper.position.y = -4;
  scene.add(gridHelper);

  // Mouse parallax
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Animation loop
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.003;

    particles.rotation.y = t * 0.05;
    particles.rotation.x = t * 0.02;

    buildingGroup.rotation.y += (mouseX * 0.08 - buildingGroup.rotation.y) * 0.03;
    camera.position.x += (mouseX * 0.5  - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    pMat.opacity = 0.5 + Math.sin(t * 0.8) * 0.2;
    renderer.render(scene, camera);
  }
  animate();

  // Scroll parallax
  window.addEventListener('scroll', () => {
    const s = window.scrollY;
    gsap.to(particles.position,    { y: s * 0.003, duration: 0.5 });
    gsap.to(buildingGroup.position, { y: -1.5 + s * 0.002, duration: 0.5 });
  });

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  });
}

/* ── STRUCTURAL CANVAS (services.html hero) ─── */
function initStructuralCanvas() {
  const canvas = document.getElementById('structuralCanvas');
  if (!canvas || !window.THREE) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
  camera.position.set(0, 2, 12);

  const wireMat  = new THREE.MeshBasicMaterial({ color: 0xc8a96e, wireframe: true, transparent: true, opacity: 0.18 });
  const goldLine = new THREE.LineBasicMaterial({ color: 0xc8a96e, transparent: true, opacity: 0.5 });
  const dimLine  = new THREE.LineBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.1 });

  const group = new THREE.Group();

  // I-beam structure: horizontal beams
  function addBeam(sx,sy,sz, ex,ey,ez) {
    const mid = new THREE.Vector3((sx+ex)/2,(sy+ey)/2,(sz+ez)/2);
    const len = Math.sqrt((ex-sx)**2+(ey-sy)**2+(ez-sz)**2);
    const geo = new THREE.BoxGeometry(len, 0.08, 0.3);
    const mesh = new THREE.Mesh(geo, wireMat);
    mesh.position.copy(mid);
    mesh.lookAt(new THREE.Vector3(ex,ey,ez));
    group.add(mesh);
  }

  // Columns
  for (let x = -4; x <= 4; x += 2) {
    for (let z = -2; z <= 2; z += 2) {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.12, 6, 0.12), wireMat);
      col.position.set(x, 0, z);
      group.add(col);
    }
  }

  // Horizontal beams per floor
  for (let y = -3; y <= 3; y += 1.5) {
    for (let z = -2; z <= 2; z += 2) {
      addBeam(-4, y, z, 4, y, z);
    }
    for (let x = -4; x <= 4; x += 2) {
      addBeam(x, y, -2, x, y, 2);
    }
  }

  // Diagonal bracing
  addBeam(-4, -3, -2,  0,  3, 2);
  addBeam( 4, -3,  2,  0,  3, -2);
  addBeam(-4,  3, -2,  0, -3, 2);

  // Grid floor
  const grid = new THREE.GridHelper(14, 20, 0xc8a96e, 0x333333);
  grid.material.opacity = 0.06;
  grid.material.transparent = true;
  grid.position.y = -3;
  scene.add(grid);

  scene.add(group);

  // Particles
  const pCount = 1500;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPos[i*3]   = (Math.random() - 0.5) * 20;
    pPos[i*3+1] = (Math.random() - 0.5) * 14;
    pPos[i*3+2] = (Math.random() - 0.5) * 10;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMesh = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xc8a96e, size: 0.05, transparent: true, opacity: 0.4 }));
  scene.add(pMesh);

  let mx = 0, my = 0, t = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth - 0.5);
    my = (e.clientY / window.innerHeight - 0.5);
  });

  function animate() {
    requestAnimationFrame(animate);
    t += 0.004;
    group.rotation.y += (mx * 0.4 - group.rotation.y) * 0.025;
    group.rotation.x += (-my * 0.15 - group.rotation.x) * 0.025;
    pMesh.rotation.y = t * 0.05;
    camera.position.y += (-my * 0.6 + 2 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  });
}

/* ── CITY CANVAS (projects.html hero) ────────── */
function initCityCanvas() {
  const canvas = document.getElementById('cityCanvas');
  if (!canvas || !window.THREE) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
  camera.position.set(0, 6, 14);
  camera.lookAt(0, 0, 0);

  const group = new THREE.Group();

  const heights = [
    [3,3,8,4,10,3,5,3,2],
    [4,2,6,9,5,7,3,6,4],
    [2,5,3,7,4,8,5,3,6],
    [5,3,7,3,6,2,8,4,3],
    [3,6,4,5,3,9,2,7,5],
  ];

  for (let row = 0; row < heights.length; row++) {
    for (let col = 0; col < heights[row].length; col++) {
      const h = heights[row][col];
      const x = (col - heights[row].length / 2) * 1.4;
      const z = (row - heights.length / 2) * 1.4;

      const geo = new THREE.BoxGeometry(0.9, h, 0.9);
      const mat = new THREE.MeshBasicMaterial({
        color: 0xc8a96e,
        wireframe: true,
        transparent: true,
        opacity: 0.1 + Math.random() * 0.1
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, h/2 - 5, z);
      group.add(mesh);

      // Solid base (very subtle)
      const baseMat = new THREE.MeshBasicMaterial({ color: 0x1a1a1a, wireframe: false });
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.88, h - 0.1, 0.88), baseMat);
      base.position.copy(mesh.position);
      group.add(base);
    }
  }

  const grid = new THREE.GridHelper(20, 28, 0xc8a96e, 0x2a2a2a);
  grid.material.opacity = 0.08;
  grid.material.transparent = true;
  grid.position.y = -5;
  scene.add(grid);

  scene.add(group);

  // Particles
  const pCount = 1200;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPos[i*3]   = (Math.random() - 0.5) * 22;
    pPos[i*3+1] = (Math.random() - 0.5) * 14;
    pPos[i*3+2] = (Math.random() - 0.5) * 10;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMesh = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xc8a96e, size: 0.04, transparent: true, opacity: 0.3 }));
  scene.add(pMesh);

  let mx = 0, my = 0, t = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth - 0.5);
    my = (e.clientY / window.innerHeight - 0.5);
  });

  function animate() {
    requestAnimationFrame(animate);
    t += 0.003;
    group.rotation.y += (mx * 0.3 - group.rotation.y) * 0.02;
    group.rotation.x += (-my * 0.08 - group.rotation.x) * 0.02;
    pMesh.rotation.y = t * 0.04;
    camera.position.y += (-my * 0.5 + 6 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  });
}

/* ── CONTACT PAGE CANVAS (contact.html hero) ── */
function initContactPageCanvas() {
  const canvas = document.getElementById('contactPageCanvas');
  if (!canvas || !window.THREE) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
  camera.position.z = 6;

  // Network nodes
  const nodeCount = 40;
  const positions = [];
  for (let i = 0; i < nodeCount; i++) {
    positions.push(new THREE.Vector3(
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 4
    ));
  }

  // Connecting lines between nearby nodes
  const lineGroup = new THREE.Group();
  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      const dist = positions[i].distanceTo(positions[j]);
      if (dist < 3.5) {
        const geo = new THREE.BufferGeometry().setFromPoints([positions[i], positions[j]]);
        const mat = new THREE.LineBasicMaterial({
          color: 0xc8a96e,
          transparent: true,
          opacity: Math.max(0.05, 0.25 - dist * 0.06)
        });
        lineGroup.add(new THREE.Line(geo, mat));
      }
    }
  }
  scene.add(lineGroup);

  // Node spheres
  positions.forEach(pos => {
    const geo = new THREE.SphereGeometry(0.06, 6, 6);
    const mat = new THREE.MeshBasicMaterial({ color: 0xc8a96e, transparent: true, opacity: 0.6 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(pos);
    scene.add(mesh);
  });

  // Particle bg
  const pCount = 800;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPos[i*3]   = (Math.random() - 0.5) * 18;
    pPos[i*3+1] = (Math.random() - 0.5) * 12;
    pPos[i*3+2] = (Math.random() - 0.5) * 8;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.025, transparent: true, opacity: 0.15 })));

  let mx = 0, my = 0, t = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth - 0.5);
    my = (e.clientY / window.innerHeight - 0.5);
  });

  function animate() {
    requestAnimationFrame(animate);
    t += 0.004;
    lineGroup.rotation.y += (mx * 0.3 - lineGroup.rotation.y) * 0.02;
    lineGroup.rotation.x += (-my * 0.2 - lineGroup.rotation.x) * 0.02;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  });
}

/* ── AWARDS CANVAS (about.html background) ───── */
function initAwardsCanvas() {
  const canvas = document.getElementById('awardsCanvas');
  if (!canvas || !window.THREE) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
  camera.position.z = 5;

  const group = new THREE.Group();

  // Rotating icosahedron
  const icoGeo = new THREE.IcosahedronGeometry(3, 2);
  const icoMat = new THREE.MeshBasicMaterial({ color: 0xc8a96e, wireframe: true, transparent: true, opacity: 0.08 });
  group.add(new THREE.Mesh(icoGeo, icoMat));

  const innerGeo = new THREE.OctahedronGeometry(1.8, 1);
  const innerMat = new THREE.MeshBasicMaterial({ color: 0xe8c87a, wireframe: true, transparent: true, opacity: 0.12 });
  group.add(new THREE.Mesh(innerGeo, innerMat));

  scene.add(group);

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.003;
    group.rotation.y = t * 0.2;
    group.rotation.x = t * 0.1;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  });
}

/* ── FAQ ACCORDION ──────────────────────────── */
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ── PAGE HERO TITLE ANIMATION ──────────────── */
function initPageHeroAnimations() {
  const lines = document.querySelectorAll('.page-hero-title .line');
  if (!lines.length) return;
  lines.forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transform = 'translateY(30px)';
  });
}

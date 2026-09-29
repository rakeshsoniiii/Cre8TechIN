import * as THREE from "./vendor/three.module.min.js";
import { animate, stagger } from "./vendor/anime.esm.min.js";

const sections = [...document.querySelectorAll(".scene")];
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
let paused = reduced.matches;
let dirty = true,
  active = 0,
  sectionProgress = 0,
  bounds = [];
let heroArtCenter = 700;
function measure() {
  bounds = sections.map((s) => ({ top: s.offsetTop, height: s.offsetHeight }));
  const copy = document.querySelector(".hero-copy");
  heroArtCenter = copy.offsetTop + copy.offsetHeight + 185;
  updateScroll();
}
function updateScroll() {
  const probe = scrollY + innerHeight * 0.45;
  active = Math.max(
    0,
    bounds.findLastIndex((s) => probe >= s.top),
  );
  const b = bounds[active];
  sectionProgress = b
    ? Math.max(
        0,
        Math.min(
          1,
          (scrollY - b.top) / Math.max(1, b.height - innerHeight * 0.2),
        ),
      )
    : 0;
  document.querySelector(".reading-progress").style.transform =
    `scaleX(${scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)})`;
  document.querySelector("#chapter-number").textContent = String(
    active + 1,
  ).padStart(2, "0");
  document.querySelector("#chapter-label").textContent =
    sections[active].dataset.chapter;
  document
    .querySelectorAll(".header nav a")
    .forEach((a) =>
      a.classList.toggle("active", a.hash === `#${sections[active].id}`),
    );
  dirty = true;
}
addEventListener("scroll", updateScroll, { passive: true });
addEventListener("resize", measure);
document.fonts.ready.then(measure);
measure();
const pointer = { x: 0, y: 0 };
addEventListener(
  "pointermove",
  (e) => {
    pointer.x = e.clientX / innerWidth - 0.5;
    pointer.y = e.clientY / innerHeight - 0.5;
  },
  { passive: true },
);
const motionButton = document.querySelector(".motion-toggle");
function syncMotion() {
  motionButton.setAttribute("aria-pressed", String(paused));
  motionButton.querySelector(".motion-label").textContent = paused
    ? "Enable motion"
    : "Pause motion";
  motionButton.firstElementChild.textContent = paused ? "▷" : "Ⅱ";
  motionButton.title = paused ? "Enable animations" : "Pause animations";
  document.documentElement.classList.toggle("motion-paused", paused);
  dirty = true;
}
motionButton.addEventListener("click", () => {
  paused = !paused;
  syncMotion();
});
reduced.addEventListener("change", () => {
  paused = reduced.matches;
  syncMotion();
});
syncMotion();
document.querySelector(".menu-toggle").addEventListener("click", (e) => {
  const open = document.querySelector(".header").classList.toggle("open");
  e.currentTarget.setAttribute("aria-expanded", String(open));
  e.currentTarget.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation",
  );
});
document.querySelectorAll(".header nav a").forEach((a) =>
  a.addEventListener("click", () => {
    document.querySelector(".header").classList.remove("open");
    document
      .querySelector(".menu-toggle")
      .setAttribute("aria-expanded", "false");
  }),
);
if (!paused)
  animate(".hero-copy > *", {
    opacity: [0, 1],
    translateY: [25, 0],
    delay: stagger(100),
    duration: 1100,
    ease: "outExpo",
  });

const tracks = {
  ai: {
    tag: "4 WEEKS · INTERMEDIATE",
    title: "AI/ML Project Builder",
    description:
      "Work with real-world datasets, build an intelligent model, and take it all the way to deployment.",
    outcomes: [
      "Image classification model",
      "NLP sentiment analyzer",
      "A complete ML pipeline",
    ],
  },
  web: {
    tag: "BUILD A CONNECTED EXPERIENCE",
    title: "Web + AI",
    description:
      "Bring your interface, application logic, and an intelligent feature together in a useful web project.",
    outcomes: [
      "An interface people can use",
      "Connected data and APIs",
      "A project you can demonstrate",
    ],
  },
  explore: {
    tag: "FOLLOW YOUR CURIOSITY",
    title: "Find your next challenge",
    description:
      "Curious about cybersecurity, research, design, or product building? Explore the current programs to find your starting point.",
    outcomes: [
      "Discover available project tracks",
      "Choose a problem worth solving",
      "Build with a clear outcome in mind",
    ],
  },
};
const tabs = [...document.querySelectorAll("[role=tab]")];
function chooseTrack(tab) {
  tabs.forEach((t) => {
    const selected = t === tab;
    t.setAttribute("aria-selected", String(selected));
    t.tabIndex = selected ? 0 : -1;
  });
  const t = tracks[tab.dataset.track];
  document
    .querySelector("#program-panel")
    .setAttribute("aria-labelledby", tab.id);
  document.querySelector("#program-tag").textContent = t.tag;
  document.querySelector("#program-title").textContent = t.title;
  document.querySelector("#program-description").textContent = t.description;
  document.querySelector("#program-outcomes").replaceChildren(
    ...t.outcomes.map((x) => {
      const li = document.createElement("li");
      li.textContent = x;
      return li;
    }),
  );
  if (!paused)
    animate("#program-panel", {
      opacity: [0.4, 1],
      translateY: [8, 0],
      duration: 350,
      ease: "outQuad",
    });
}
tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => chooseTrack(tab));
  tab.addEventListener("keydown", (e) => {
    let next = i;
    if (e.key === "ArrowDown" || e.key === "ArrowRight")
      next = (i + 1) % tabs.length;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft")
      next = (i + tabs.length - 1) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;
    e.preventDefault();
    tabs[next].focus();
    chooseTrack(tabs[next]);
  });
});
const projects = {
  medichain: {
    name: "MediChain",
    description:
      "Explore a patient-controlled health record system, where access is explicit and changes leave a trace.",
    features: [
      "A patient dashboard using synthetic records",
      "Consent-based sharing with role-based access",
      "An audit trail for record changes",
    ],
    tags: ["React", "Web3", "Access control"],
  },
  shield: {
    name: "SHIELD",
    description:
      "Build a security dashboard that helps a user understand suspicious activity and decide what to investigate.",
    features: [
      "Analyze a synthetic network event dataset",
      "Flag unusual activity with explainable rules",
      "Present findings in an understandable dashboard",
    ],
    tags: ["Python", "Machine learning", "Security"],
  },
  studyai: {
    name: "StudyAI",
    description:
      "Imagine a study companion that turns your own notes into an active learning experience.",
    features: [
      "Upload example notes and organize topics",
      "Generate practice questions from source material",
      "Show progress and revisit difficult concepts",
    ],
    tags: ["AI", "Next.js", "Learning experience"],
  },
};
const dialog = document.querySelector("#project-dialog");
let projectTrigger;
document.querySelectorAll("[data-project]").forEach((button) =>
  button.addEventListener("click", () => {
    const p = projects[button.dataset.project];
    projectTrigger = button;
    document.querySelector("#dialog-title").textContent = p.name;
    document.querySelector("#dialog-description").textContent = p.description;
    document.querySelector("#dialog-features").replaceChildren(
      ...p.features.map((text) => {
        const li = document.createElement("li");
        li.textContent = text;
        return li;
      }),
    );
    document.querySelector("#dialog-tags").replaceChildren(
      ...p.tags.map((text) => {
        const el = document.createElement("span");
        el.textContent = text;
        return el;
      }),
    );
    dialog.showModal();
    document.body.classList.add("dialog-open");
  }),
);
document
  .querySelector(".dialog-close")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      dialog.close();
  }
});
dialog.addEventListener("close", () => {
  document.body.classList.remove("dialog-open");
  projectTrigger?.focus();
});
document.querySelector("#builder-name").addEventListener("input", (e) => {
  document.querySelector("#card-name").textContent =
    e.target.value.trim() || "Your name here.";
});
document.querySelector("#builder-track").addEventListener("change", (e) => {
  document.querySelector("#card-track").textContent = e.target.value;
  document.querySelector("#card-project").textContent =
    e.target.value === "AI / ML Builder"
      ? "StudyAI concept"
      : e.target.value === "Web + AI Builder"
        ? "MediChain concept"
        : "Your next idea";
});
const card = document.querySelector(".student-id");
card.addEventListener("click", () => {
  card.style.transform = "";
  const flipped = card.classList.toggle("flipped");
  card.setAttribute("aria-pressed", String(flipped));
});
card.addEventListener("pointermove", (e) => {
  if (paused || e.pointerType === "touch") return;
  const r = card.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5,
    y = (e.clientY - r.top) / r.height - 0.5;
  card.style.transform = `rotateX(${-y * 14}deg) rotateY(${(card.classList.contains("flipped") ? 180 : 0) + x * 22}deg) rotateZ(3deg)`;
});
card.addEventListener("pointerleave", () => (card.style.transform = ""));
const reveals = new IntersectionObserver(
  (entries) =>
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      if (!paused)
        animate(target, {
          opacity: [0.2, 1],
          translateY: [25, 0],
          duration: 850,
          ease: "outExpo",
        });
      reveals.unobserve(target);
    }),
  { threshold: 0.18 },
);
document
  .querySelectorAll(
    ".scene:not(.hero) .display,.scene:not(.hero) .eyebrow,.project-card,.proof-list",
  )
  .forEach((el) => reveals.observe(el));
const counters = new IntersectionObserver(
  (entries) =>
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      const total = Number(target.dataset.count);
      if (!paused) {
        const value = { n: 0 };
        animate(value, {
          n: total,
          duration: 1400,
          ease: "outExpo",
          onUpdate: () => (target.textContent = Math.round(value.n)),
        });
      }
      counters.unobserve(target);
    }),
  { threshold: 0.8 },
);
document.querySelectorAll("[data-count]").forEach((el) => counters.observe(el));

let renderer;
try {
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(
    Math.min(devicePixelRatio, innerWidth < 760 ? 1.25 : 1.75),
  );
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  document.querySelector("#world").appendChild(renderer.domElement);
  document.body.classList.add("webgl-ready");
} catch (e) {
  document.body.classList.add("no-webgl");
  console.info("Using the lightweight illustrated experience.", e.message);
}
if (renderer) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    42,
    innerWidth / innerHeight,
    0.1,
    100,
  );
  camera.position.z = 11;
  scene.add(new THREE.AmbientLight(0xb2a1e8, 2));
  const key = new THREE.DirectionalLight(0xe0d4ff, 5);
  key.position.set(2, 4, 5);
  scene.add(key);
  const cyan = new THREE.PointLight(0x76e7ff, 32, 20);
  cyan.position.set(-3, -2, 4);
  scene.add(cyan);
  const purple = new THREE.PointLight(0x9650ff, 45, 20);
  purple.position.set(3, 1, 3);
  scene.add(purple);
  const orbit = new THREE.Group();
  scene.add(orbit);
  const metal = new THREE.MeshStandardMaterial({
    color: 0x8a5bd5,
    metalness: 0.62,
    roughness: 0.24,
  });
  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.28, 0.33, 180, 24, 2, 3),
    metal,
  );
  orbit.add(knot);
  const sphere = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.79, 1),
    new THREE.MeshPhysicalMaterial({
      color: 0xb49af1,
      metalness: 0.7,
      roughness: 0.18,
      flatShading: true,
    }),
  );
  orbit.add(sphere);
  const wire = new THREE.LineSegments(
    new THREE.EdgesGeometry(sphere.geometry),
    new THREE.LineBasicMaterial({
      color: 0xe1d0ff,
      transparent: true,
      opacity: 0.38,
    }),
  );
  sphere.add(wire);
  const rings = [];
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.1 + i * 0.23, i === 0 ? 0.019 : 0.008, 8, 150),
      new THREE.MeshBasicMaterial({
        color: i === 1 ? 0xc7e8a0 : 0x8265ad,
        transparent: true,
        opacity: i === 0 ? 0.7 : 0.4,
      }),
    );
    ring.rotation.set(1.05 + i * 0.43, 0.4 + i * 0.5, -0.4);
    orbit.add(ring);
    rings.push(ring);
  }
  const satellites = [];
  for (let i = 0; i < 7; i++) {
    const m = new THREE.Mesh(
      new THREE.OctahedronGeometry(i % 2 ? 0.13 : 0.21),
      new THREE.MeshStandardMaterial({
        color: i % 3 === 0 ? 0xd3f995 : 0x9770e5,
        metalness: 0.45,
        roughness: 0.3,
      }),
    );
    orbit.add(m);
    satellites.push(m);
  }
  const coords = [];
  for (let i = 0; i < 420; i++) {
    const rand = (n) => {
      const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
      return x - Math.floor(x);
    };
    coords.push(
      (rand(i + 1) - 0.5) * 32,
      (rand(i + 801) - 0.5) * 22,
      (rand(i + 1701) - 0.5) * 16 - 5,
    );
  }
  const starsGeometry = new THREE.BufferGeometry();
  starsGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(coords, 3),
  );
  const stars = new THREE.Points(
    starsGeometry,
    new THREE.PointsMaterial({
      color: 0xc2afef,
      size: 0.018,
      transparent: true,
      opacity: 0.6,
    }),
  );
  scene.add(stars);
  const laptop = new THREE.Group();
  scene.add(laptop);
  laptop.scale.setScalar(0.001);
  const chassis = new THREE.MeshStandardMaterial({
    color: 0x252234,
    metalness: 0.8,
    roughness: 0.28,
  });
  const base = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.13, 2.5), chassis);
  base.position.y = -1;
  laptop.add(base);
  const screenGroup = new THREE.Group();
  screenGroup.position.set(0, -0.96, -1.12);
  screenGroup.rotation.x = -0.18;
  laptop.add(screenGroup);
  const bezel = new THREE.Mesh(new THREE.BoxGeometry(3.9, 2.55, 0.13), chassis);
  bezel.position.y = 1.25;
  screenGroup.add(bezel);
  const screenCanvas = document.createElement("canvas");
  screenCanvas.width = 1024;
  screenCanvas.height = 660;
  const ctx = screenCanvas.getContext("2d");
  ctx.fillStyle = "#10111c";
  ctx.fillRect(0, 0, 1024, 660);
  ctx.fillStyle = "#242333";
  ctx.fillRect(0, 0, 1024, 65);
  ["#ff8d8d", "#e6d58b", "#b9dc94"].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(30 + i * 28, 32, 7, 0, 7);
    ctx.fill();
  });
  ctx.fillStyle = "#9c93af";
  ctx.font = "20px monospace";
  ctx.fillText("your-first-build / src / future.js", 240, 40);
  const code = [
    ["#746e89", "01   // every great thing starts somewhere"],
    ["#c6a4ff", "02   const builder = {"],
    ["#e3dabf", "03     name: 'you',"],
    ["#e3dabf", "04     curiosity: Infinity,"],
    ["#e3dabf", "05     ready: true"],
    ["#c6a4ff", "06   };"],
    ["#9bdfd7", "07"],
    ["#c6a4ff", "08   async function createSomething() {"],
    ["#e3dabf", "09     const idea = await imagine();"],
    ["#e3dabf", "10     return build(idea, together);"],
    ["#c6a4ff", "11   }"],
  ];
  ctx.font = "25px monospace";
  code.forEach(([c, t], i) => {
    ctx.fillStyle = c;
    ctx.fillText(t, 30, 118 + i * 37);
  });
  ctx.fillStyle = "#1b2924";
  ctx.fillRect(0, 560, 1024, 100);
  ctx.fillStyle = "#c6ef98";
  ctx.font = "24px monospace";
  ctx.fillText("> project deployed successfully", 35, 612);
  const screenTexture = new THREE.CanvasTexture(screenCanvas);
  screenTexture.colorSpace = THREE.SRGBColorSpace;
  const display = new THREE.Mesh(
    new THREE.PlaneGeometry(3.65, 2.3),
    new THREE.MeshBasicMaterial({ map: screenTexture }),
  );
  display.position.set(0, 1.27, 0.071);
  screenGroup.add(display);
  const keyGeo = new THREE.BoxGeometry(0.22, 0.025, 0.18);
  const keyMaterial = new THREE.MeshStandardMaterial({
    color: 0x80718f,
    metalness: 0.3,
    roughness: 0.5,
  });
  const keys = new THREE.InstancedMesh(keyGeo, keyMaterial, 52);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 52; i++) {
    dummy.position.set(
      ((i % 13) - 6) * 0.26,
      -0.915,
      Math.floor(i / 13) * 0.24 - 0.65,
    );
    dummy.updateMatrix();
    keys.setMatrixAt(i, dummy.matrix);
  }
  laptop.add(keys);
  const touchpad = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.014, 0.42),
    new THREE.MeshStandardMaterial({
      color: 0x494151,
      metalness: 0.8,
      roughness: 0.3,
    }),
  );
  touchpad.position.set(0, -0.922, 0.76);
  laptop.add(touchpad);
  const network = new THREE.Group();
  scene.add(network);
  network.scale.setScalar(0.001);
  const points = [];
  const nodeGeometry = new THREE.IcosahedronGeometry(0.08, 1);
  const nodeMats = [
    new THREE.MeshStandardMaterial({
      color: 0xbfa0ff,
      emissive: 0x4b217e,
      emissiveIntensity: 0.5,
      metalness: 0.3,
      roughness: 0.35,
    }),
    new THREE.MeshStandardMaterial({
      color: 0xd5f994,
      emissive: 0x4f6828,
      emissiveIntensity: 0.5,
    }),
  ];
  const nodeCount = innerWidth < 760 ? 28 : 48;
  for (let i = 0; i < nodeCount; i++) {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / nodeCount),
      theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const v = new THREE.Vector3(
      Math.cos(theta) * Math.sin(phi) * 2.25,
      Math.sin(theta) * Math.sin(phi) * 2.25,
      Math.cos(phi) * 2.25,
    );
    points.push(v);
    const mesh = new THREE.Mesh(nodeGeometry, nodeMats[i % 7 === 0 ? 1 : 0]);
    mesh.position.copy(v);
    mesh.scale.setScalar(i % 7 === 0 ? 1.8 : 1);
    network.add(mesh);
  }
  const lines = [];
  points.forEach((p, i) => {
    points.forEach((q, j) => {
      if (j > i && p.distanceTo(q) < 1.2)
        lines.push(p.x, p.y, p.z, q.x, q.y, q.z);
    });
    if (i % 5 === 0) lines.push(0, 0, 0, p.x, p.y, p.z);
  });
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(lines, 3));
  network.add(
    new THREE.LineSegments(
      lineGeo,
      new THREE.LineBasicMaterial({
        color: 0x9672cf,
        transparent: true,
        opacity: 0.35,
      }),
    ),
  );
  const hub = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.36, 1),
    new THREE.MeshStandardMaterial({
      color: 0xe0f4b1,
      emissive: 0x6f8c36,
      emissiveIntensity: 0.5,
      metalness: 0.5,
      roughness: 0.2,
    }),
  );
  network.add(hub);
  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(0.55, 0.009, 6, 60),
    new THREE.MeshBasicMaterial({ color: 0xd0f38a }),
  );
  network.add(halo);
  const portal = new THREE.Group();
  scene.add(portal);
  portal.scale.setScalar(0.001);
  for (let i = 0; i < 12; i++) {
    const g = new THREE.TorusGeometry(
      2.3,
      0.022 + (i === 0 ? 0.028 : 0),
      8,
      120,
    );
    const m = new THREE.MeshBasicMaterial({
      color: i % 3 === 0 ? 0xd2f293 : 0xa075ed,
      transparent: true,
      opacity: 0.7 - i * 0.045,
    });
    const mesh = new THREE.Mesh(g, m);
    mesh.position.z = -i * 0.5;
    mesh.scale.set(1, 1.3, 1);
    portal.add(mesh);
  }
  const portalPoints = [];
  for (let i = 0; i < 200; i++) {
    const a = i * 2.399963;
    const rad = 2.35 + (i % 7) * 0.065;
    portalPoints.push(
      Math.cos(a) * rad,
      Math.sin(a) * rad * 1.3,
      -(i % 12) * 0.5,
    );
  }
  const portalGeo = new THREE.BufferGeometry();
  portalGeo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(portalPoints, 3),
  );
  portal.add(
    new THREE.Points(
      portalGeo,
      new THREE.PointsMaterial({
        color: 0xc6eeb2,
        size: 0.035,
        transparent: true,
        opacity: 0.8,
      }),
    ),
  );
  const groups = { orbit, laptop, network, portal };
  const settings = [
    ["orbit", 2.65, 0, 1.12],
    ["orbit", 2.6, -0.1, 1.04],
    ["quiet", 0, 0, 0],
    ["orbit", 3.0, 0, 0.95],
    ["laptop", 2.55, -0.25, 1.07],
    ["network", 2.75, 0, 1.08],
    ["network", -2.7, 0, 1.1],
    ["quiet", 0, 0, 0],
    ["quiet", 0, 0, 0],
    ["quiet", 0, 0, 0],
    ["quiet", 0, 0, 0],
    ["network", 3.6, -0.2, 1.2],
    ["orbit", 0, 0, 0.9],
    ["portal", 0, 0, 1.5],
  ];
  let last = 0,
    elapsed = 0;
  renderer.domElement.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    document.body.classList.remove("webgl-ready");
    document.body.classList.add("no-webgl");
  });
  renderer.domElement.addEventListener("webglcontextrestored", () => {
    document.body.classList.add("webgl-ready");
    document.body.classList.remove("no-webgl");
    dirty = true;
  });
  function frame(now) {
    requestAnimationFrame(frame);
    if (document.hidden) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!paused) elapsed += dt;
    if (paused && !dirty) return;
    dirty = false;
    const mobile = innerWidth < 760;
    const [type, tx, ty, scale] = settings[active];
    const blend = paused ? 1 : 1 - Math.exp(-dt * 5);
    let visualY = mobile ? (active === 13 ? 0 : active === 12 ? 0 : -2.35) : ty;
    if (mobile && active === 0)
      visualY =
        (0.5 - (heroArtCenter - scrollY) / innerHeight) *
        (2 * 11 * Math.tan((21 * Math.PI) / 180));
    const visualX = mobile ? 0 : tx;
    const size = mobile
      ? active === 13
        ? 1.2
        : active === 12
          ? 0.65
          : active === 6
            ? 0.68
            : active === 4
              ? 0.7
              : 0.58
      : scale;
    for (const [name, group] of Object.entries(groups)) {
      const target = name === type ? size : 0.001;
      group.scale.lerp(new THREE.Vector3(target, target, target), blend);
      group.visible = group.scale.x > 0.015;
      if (name === type) {
        group.position.x = THREE.MathUtils.lerp(
          group.position.x,
          visualX,
          blend,
        );
        group.position.y = THREE.MathUtils.lerp(
          group.position.y,
          visualY,
          blend,
        );
      }
    }
    const tiltX = paused ? 0 : pointer.x * 0.16,
      tiltY = paused ? 0 : pointer.y * 0.12;
    orbit.rotation.set(
      0.25 + tiltY,
      -0.25 + elapsed * 0.1 + tiltX + sectionProgress * 0.6,
      -0.25,
    );
    knot.rotation.y = elapsed * 0.07;
    sphere.rotation.set(elapsed * 0.12, elapsed * 0.15, 0);
    laptop.rotation.set(
      0.22 + tiltY,
      -0.28 + tiltX + sectionProgress * 0.35,
      -0.04,
    );
    network.rotation.set(
      0.2 + tiltY,
      elapsed * 0.08 + sectionProgress * 0.4 + tiltX,
      -0.2,
    );
    hub.rotation.set(elapsed * 0.2, elapsed * 0.3, 0);
    halo.rotation.set(1.1, 0.3 + elapsed * 0.2, 0.2);
    portal.rotation.y = tiltX * 0.3;
    portal.rotation.z = paused ? 0 : Math.sin(elapsed * 0.12) * 0.025;
    portal.position.z = active === 13 ? sectionProgress * 1.3 : 0;
    const rushing = active === 12 && sectionProgress < 0.4 && !paused;
    stars.rotation.z = elapsed * 0.004;
    stars.position.z = rushing ? (elapsed * 4) % 3 : 0;
    stars.material.opacity = type === "quiet" ? 0.18 : 0.6;
    stars.scale.z = rushing ? 2.5 : 1;
    satellites.forEach((m, i) => {
      const a = (i * Math.PI * 2) / 7 + elapsed * 0.12;
      m.position.set(Math.cos(a) * 2.7, Math.sin(a) * 2, Math.sin(a * 2) * 0.8);
      m.rotation.set(a, a, 0);
    });
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
  addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(
      Math.min(devicePixelRatio, innerWidth < 760 ? 1.25 : 1.75),
    );
    renderer.setSize(innerWidth, innerHeight);
    dirty = true;
  });
}

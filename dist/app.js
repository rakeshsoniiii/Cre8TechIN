import * as THREE from "./vendor/three.module.min.js";
import { animate, stagger } from "./vendor/anime.esm.min.js";
const { gsap, ScrollTrigger } = window;
gsap.registerPlugin(ScrollTrigger);
let chapterMotion = null;

const sections = [...document.querySelectorAll(".scene")];
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
let paused = reduced.matches;
let dirty = true,
  active = 0,
  bounds = [];
let heroArtCenter = 700;
let joinArtCenter = 0;
const scrollTracks = [];
const counterTracks = [];
const clamp = (value) => Math.max(0, Math.min(1, value));
let scrollFrame = 0;
function measure() {
  bounds = sections.map((s) => ({ top: s.offsetTop, height: s.offsetHeight }));
  const copy = document.querySelector(".hero-copy");
  heroArtCenter = copy.offsetTop + copy.offsetHeight + 220;
  const join = document.querySelector(".join");
  const joinNote = document.querySelector(".join-note");
  joinArtCenter = join.offsetTop + joinNote.offsetTop + joinNote.offsetHeight + 185;
  [...scrollTracks, ...counterTracks].forEach((track) => {
    let top = 0;
    for (let node = track.el; node; node = node.offsetParent) top += node.offsetTop;
    track.top = top;
  });
  updateScroll();
}
function updateScroll() {
  const probe = scrollY + innerHeight * 0.45;
  active = Math.max(
    0,
    bounds.findLastIndex((s) => probe >= s.top),
  );
  document.querySelector(".reading-progress").style.transform =
    `scaleX(${scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)})`;
  const chapterNumber = document.querySelector("#chapter-number");
  const chapter = String(active + 1).padStart(2, "0");
  if (chapterNumber.textContent !== chapter) {
    chapterNumber.textContent = chapter;
    if (!paused) animate("#chapter-number,#chapter-label", {
      opacity: [0.25, 1], translateY: [6, 0], duration: 350, ease: "outCubic"
    });
  }
  document.querySelector("#chapter-label").textContent =
    sections[active].dataset.chapter;
  const navSection = active >= 8 ? "projects" : active >= 7 ? "programs" : active >= 5 ? "mentors" : "story";
  document.querySelectorAll(".header nav a").forEach((a) => {
    const selected = a.hash === `#${navSection}` && active < 13;
    a.classList.toggle("active", selected);
    if (selected) a.setAttribute("aria-current", "location");
    else a.removeAttribute("aria-current");
  });
  document.querySelector(".header").classList.toggle("scrolled", scrollY > 40);
  document.querySelector("#world").dataset.chapter = sections[active].id;
  scrollTracks.forEach((track) => {
    const progress = paused ? 1 : clamp((scrollY + innerHeight * 0.94 - track.top) / (innerHeight * track.range));
    track.animation.currentTime = progress * 1000;
  });
  counterTracks.forEach((track) => {
    const progress = paused ? 1 : clamp((scrollY + innerHeight * 0.87 - track.top) / (innerHeight * 0.3));
    track.el.textContent = Math.round(track.total * (1 - (1 - progress) ** 3));
  });
  dirty = true;
}
addEventListener("scroll", () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => { scrollFrame = 0; updateScroll(); });
}, { passive: true });
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
  document.querySelectorAll(".magnetic").forEach((el) => {
    el.style.removeProperty("--magnetic-x");
    el.style.removeProperty("--magnetic-y");
  });
  updateScroll();
  if (chapterMotion) gsap.matchMediaRefresh();
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
function closeMenu() {
  document.querySelector(".header").classList.remove("open");
  const toggle = document.querySelector(".menu-toggle");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Open navigation");
}
document
  .querySelectorAll(".header nav a, .nav-join")
  .forEach((a) => a.addEventListener("click", closeMenu));
document.addEventListener("keydown", (e) => {
  if (
    e.key === "Escape" &&
    document.querySelector(".header").classList.contains("open")
  ) {
    closeMenu();
    document.querySelector(".menu-toggle").focus();
  }
});
if (!paused)
  animate(".hero-copy h1 > span,.hero-description,.hero-copy .button,.hero-note,.hero-topline,.orbital-label,.object-caption,.hero-bottom", {
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
const tabs = [...document.querySelectorAll(".program-tabs [role=tab]")];
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
  measure();
  ScrollTrigger.refresh();
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
    if (!paused) animate("#project-dialog > :not(.dialog-close)", {
      opacity: [0, 1], translateY: [12, 0], delay: stagger(35), duration: 500, ease: "outCubic"
    });
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
const ideaDirections = {
  web: ["↗", "What if your campus had one place for everything?", "Start with a useful campus hub. Bring events, resources, and people together."],
  ai: ["✳", "What if your notes could help you practise?", "Turn a set of sample notes into questions, flashcards, and a focused study session."],
  security: ["⌁", "What if suspicious activity was easier to spot?", "Build a clear dashboard that helps someone explore unusual events in sample data."]
};
document.querySelectorAll("[data-idea]").forEach((button) => button.addEventListener("click", () => {
  document.querySelectorAll("[data-idea]").forEach((el) => el.setAttribute("aria-pressed", String(el === button)));
  const [symbol, title, description] = ideaDirections[button.dataset.idea];
  document.querySelector("#idea-symbol").textContent = symbol;
  document.querySelector("#idea-title").textContent = title;
  document.querySelector("#idea-description").textContent = description;
  if (!paused) gsap.fromTo(".idea-result", { autoAlpha: 0.3, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out", overwrite: true });
  measure();
  ScrollTrigger.refresh();
}));
document.querySelector("#workbench-toggle").addEventListener("click", (event) => {
  const button = event.currentTarget;
  const building = button.getAttribute("aria-pressed") !== "true";
  button.setAttribute("aria-pressed", String(building));
  document.querySelector(".build-workbench").dataset.mode = building ? "build" : "watch";
  document.querySelector("#workbench-label").textContent = building ? "YOUR FIRST PROJECT PLAN" : "THE NEXT MOVE IS YOURS";
  document.querySelector("#workbench-title").textContent = building ? "One useful feature. One first commit." : "Close one tab. Open a possibility.";
  document.querySelector("#workbench-description").textContent = building ? "Create a page, connect one interaction, and explain what you made in a README. That is a place to start." : "Take the thing you just learned and give it a job to do.";
  button.firstChild.textContent = building ? "Back to the starting point " : "Turn it into a project ";
  if (!paused) gsap.fromTo(".workbench-files > div", { x: -10, autoAlpha: 0.3 }, { x: 0, autoAlpha: 1, stagger: 0.08, duration: 0.5, ease: "power3.out", overwrite: true });
  measure();
  ScrollTrigger.refresh();
});
const processSteps = {
  build: ["↗", "START SMALL. START YOURS.", "Make the first version.", "Choose one problem. Write the first line. Build something you can put in front of another person."],
  learn: ["↔", "FEEDBACK IS PART OF THE WORK.", "Find a better way.", "Walk someone through your project. Ask a useful question. Take the feedback and improve one thing."],
  launch: ["↑", "GIVE YOUR WORK A PLACE TO LIVE.", "Share what you made.", "Publish a working demo, document the choices you made, and show the project behind the skills."]
};
const stepTabs = [...document.querySelectorAll("[data-step]")];
function chooseStep(button) {
  stepTabs.forEach((el) => { const selected = el === button; el.setAttribute("aria-selected", String(selected)); el.tabIndex = selected ? 0 : -1; });
  const values = processSteps[button.dataset.step];
  ["sequence-mark", "sequence-kicker", "sequence-title", "sequence-description"].forEach((id, i) => document.getElementById(id).textContent = values[i]);
  document.querySelector("#sequence-panel").setAttribute("aria-labelledby", button.id);
  if (!paused) gsap.fromTo("#sequence-panel", { autoAlpha: 0.3, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out", overwrite: true });
  measure();
  ScrollTrigger.refresh();
}
stepTabs.forEach((button, i) => {
  button.addEventListener("click", () => chooseStep(button));
  button.addEventListener("keydown", (event) => {
    let next = i;
    if (["ArrowRight", "ArrowDown"].includes(event.key)) next = (i + 1) % stepTabs.length;
    else if (["ArrowLeft", "ArrowUp"].includes(event.key)) next = (i + stepTabs.length - 1) % stepTabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = stepTabs.length - 1;
    else return;
    event.preventDefault(); stepTabs[next].focus(); chooseStep(stepTabs[next]);
  });
});
// Paused Web Animations are scrubbed by native scroll, including reverse scrolling.
// Individual translate/rotate properties preserve the card's hover and flip transforms.
function scrollAnimate(el, frames, range = 0.55) {
  const animation = el.animate(frames, { duration: 1000, fill: "both", easing: "linear" });
  animation.pause();
  el.dataset.scrollMotion = "true";
  scrollTracks.push({ el, animation, range, top: 0 });
}
document.querySelectorAll(".scene:not(.hero) h2,.scene:not(.hero) .section-copy,.old-loop > span,.manifesto-words > span,.feedback-flow > span,.program-tabs > button,.project-card,.proof-list > span,.stats > div,.sequence-steps button,.idea-options button,.studio-top,.sequence-top").forEach((el, i) => {
  scrollAnimate(el, el.matches("button") ? [{ opacity: 0.2 }, { opacity: 1 }] : [{ opacity: 0.12, translate: "0 32px" }, { opacity: 1, translate: "0 0" }], 0.22 + (i % 3) * 0.025);
});
scrollAnimate(document.querySelector(".join-button"), [{ opacity: 0.4, scale: 0.97 }, { opacity: 1, scale: 1 }], 0.25);
scrollAnimate(document.querySelector(".discipline-strip"), [{ translate: "16% 0" }, { translate: "-10% 0" }], 1.5);
scrollAnimate(document.querySelector(".community-photo"), [{ scale: 1.18, translate: "0 -3%" }, { scale: 1, translate: "0 3%" }], 1.7);
scrollAnimate(document.querySelector(".question-line"), [{ scale: "0 1" }, { scale: "1 1" }], 0.55);
scrollAnimate(document.querySelector(".id-stage"), [{ rotate: "-8deg", translate: "0 70px" }, { rotate: "0deg", translate: "0 0" }], 0.9);
scrollAnimate(document.querySelector(".proof-art"), [{ rotate: "-18deg", scale: 0.8 }, { rotate: "0deg", scale: 1 }], 1);
scrollAnimate(document.querySelector(".hype h2"), [{ scale: 0.85, opacity: 0.15 }, { scale: 1, opacity: 1 }], 0.85);
document.querySelectorAll(".artifact-cube,.shield-object,.study-object").forEach((el) => {
  scrollAnimate(el, [{ rotate: "0 1 0 -28deg", scale: 0.85 }, { rotate: "0 1 0 22deg", scale: 1 }], 1.1);
});
// Reveal remaining copy and controls without stacking motion on their children.
document.querySelectorAll(".scene:not(.hero) h3,.scene:not(.hero) p,.scene:not(.hero) a,.scene:not(.hero) label,.scene:not(.hero) select,.scene:not(.hero) .name-input,.scene:not(.hero) .eyebrow,.inline-points,.community-roles,.project-tags,.join-note,.join footer,.network-note,.build-caption").forEach((el) => {
  if (el.closest("[data-scroll-motion]")) return;
  const frames = el.matches("a,button,select")
    ? [{ opacity: 0.35, scale: 0.97 }, { opacity: 1, scale: 1 }]
    : [{ opacity: 0.18, translate: "0 12px" }, { opacity: 1, translate: "0 0" }];
  scrollAnimate(el, frames, 0.18);
});
document.querySelectorAll("[data-count]").forEach((el) => {
  counterTracks.push({ el, total: Number(el.dataset.count), top: 0 });
});
// A small magnetic pull is reserved for mouse users; touch targets stay still.
document.querySelectorAll(".button,.nav-join,.header nav a,.text-link,.hype-arrow,.motion-toggle,.dialog-close,.menu-toggle,.idea-options button,.sequence-steps button,.studio-bottom a").forEach((el) => {
  el.classList.add("magnetic");
  const reset = () => {
    el.style.setProperty("--magnetic-x", "0px");
    el.style.setProperty("--magnetic-y", "0px");
  };
  el.addEventListener("pointermove", (event) => {
    if (paused || event.pointerType !== "mouse" || innerWidth <= 760) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(-5, Math.min(5, (event.clientX - rect.left - rect.width / 2) * 0.1));
    const y = Math.max(-4, Math.min(4, (event.clientY - rect.top - rect.height / 2) * 0.1));
    el.style.setProperty("--magnetic-x", `${x}px`);
    el.style.setProperty("--magnetic-y", `${y}px`);
  });
  el.addEventListener("pointerleave", reset);
  el.addEventListener("pointerdown", reset);
  el.addEventListener("blur", reset);
});
// One delegated feedback layer also covers copy updated by the chapter controls.
// Copy remains selectable text; only real controls receive keyboard focus.
const controlSelector = 'a,button,input,select,textarea,summary,[role="button"]';
document.querySelectorAll('h1,h2,h3,h4,p,span,b,strong,em,small,label,li,figcaption,dt,dd').forEach((el) => {
  if (el.closest(`${controlSelector},[aria-hidden="true"]`)) return;
  if ([...el.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim())) el.classList.add('responsive-copy');
});
let hoveredFeedback = null;
let pressedFeedback = null;
let releaseFeedback;
function feedbackTarget(target) {
  if (!(target instanceof Element)) return null;
  const control = target.closest(controlSelector);
  if (control) return control;
  const copy = target.closest('.responsive-copy,h1,h2,h3,h4,p,li,figcaption,dt,dd');
  if (!copy || copy.closest('[aria-hidden="true"]')) return null;
  copy.classList.add('responsive-copy');
  return copy;
}
function clearPress() {
  clearTimeout(releaseFeedback);
  pressedFeedback?.el.classList.remove('feedback-pressed');
  pressedFeedback = null;
}
function clearHover() {
  hoveredFeedback?.classList.remove('feedback-hover');
  hoveredFeedback = null;
}
document.addEventListener('pointerover', (event) => {
  if (event.pointerType !== 'mouse') return;
  const el = feedbackTarget(event.target);
  if (el === hoveredFeedback) return;
  clearHover();
  hoveredFeedback = el;
  el?.classList.add('feedback-hover');
});
document.addEventListener('pointerout', (event) => {
  if (!event.relatedTarget) clearHover();
});
document.addEventListener('pointerdown', (event) => {
  clearPress();
  if (!event.isPrimary || event.button !== 0) return;
  const el = feedbackTarget(event.target);
  if (!el || el.matches(':disabled')) return;
  pressedFeedback = { el, id: event.pointerId, x: event.clientX, y: event.clientY };
  el.classList.add('feedback-pressed');
}, { passive: true });
document.addEventListener('pointermove', (event) => {
  if (pressedFeedback?.id === event.pointerId && Math.hypot(event.clientX - pressedFeedback.x, event.clientY - pressedFeedback.y) > 10) clearPress();
}, { passive: true });
document.addEventListener('pointerup', (event) => {
  if (pressedFeedback?.id === event.pointerId) releaseFeedback = setTimeout(clearPress, 180);
}, { passive: true });
document.addEventListener('pointercancel', clearPress, { passive: true });
window.addEventListener('scroll', () => { clearPress(); clearHover(); }, { passive: true });
window.addEventListener('blur', () => { clearPress(); clearHover(); });
measure();

// GSAP owns only the new chapter visuals; existing text/hover transforms stay independent.
chapterMotion = gsap.matchMedia();
chapterMotion.add({ desktop: "(min-width: 761px)", mobile: "(max-width: 760px)", reduce: "(prefers-reduced-motion: reduce)" }, (context) => {
  if (paused || context.conditions.reduce) return;
  const distance = context.conditions.desktop ? 45 : 22;
  const idea = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: ".idea-studio", start: "clamp(top 90%)", end: "clamp(bottom 35%)", scrub: 0.45 } });
  idea.fromTo(".sheet-back", { y: distance, rotationZ: -28 }, { y: 0, rotationZ: -18, duration: 1 }, 0)
    .fromTo(".sheet-front", { y: distance * 1.6, rotationZ: 8 }, { y: -5, rotationZ: -8, duration: 1 }, 0)
    .fromTo(".drawing-grid", { autoAlpha: 0.1 }, { autoAlpha: 1, duration: 1 }, 0);
  gsap.fromTo(".workbench-files", { y: 25, autoAlpha: 0.25 }, { y: 0, autoAlpha: 1, ease: "none", scrollTrigger: { trigger: ".build-workbench", start: "clamp(top 75%)", end: "clamp(center 50%)", scrub: 0.35 } });
  gsap.fromTo(".sequence-art", { rotationY: -35, scale: 0.8 }, { rotationY: 0, scale: 1, ease: "none", scrollTrigger: { trigger: ".launch-sequence", start: "clamp(top 85%)", end: "clamp(bottom 65%)", scrub: 0.4 } });
});
document.fonts.ready.then(() => ScrollTrigger.refresh());

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
  scene.add(new THREE.AmbientLight(0xd7d2c8, 1.5));
  const key = new THREE.DirectionalLight(0xfff0d5, 4);
  key.position.set(2, 4, 5);
  scene.add(key);
  const cyan = new THREE.PointLight(0xffffff, 24, 20);
  cyan.position.set(-3, -2, 4);
  scene.add(cyan);
  const purple = new THREE.PointLight(0xd3a659, 22, 20);
  purple.position.set(3, 1, 3);
  scene.add(purple);
  // A small procedural studio environment gives the sculpture real reflections.
  const studio = document.createElement("canvas");
  studio.width = 1024;
  studio.height = 512;
  const light = studio.getContext("2d");
  light.fillStyle = "#151515";
  light.fillRect(0, 0, 1024, 512);
  [
    [140, 55, 90, 350],
    [600, 30, 210, 390],
    [930, 100, 35, 240],
  ].forEach(([x, y, w, h]) => {
    const glow = light.createLinearGradient(x, y, x + w, y);
    glow.addColorStop(0, "#393734");
    glow.addColorStop(0.35, "#fff5dc");
    glow.addColorStop(1, "#8e877a");
    light.fillStyle = glow;
    light.fillRect(x, y, w, h);
  });
  const environment = new THREE.CanvasTexture(studio);
  environment.mapping = THREE.EquirectangularReflectionMapping;
  environment.colorSpace = THREE.SRGBColorSpace;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromEquirectangular(environment).texture;
  environment.dispose();
  pmrem.dispose();
  const orbit = new THREE.Group();
  scene.add(orbit);
  const metal = new THREE.MeshPhysicalMaterial({
    color: 0xaaa59b,
    metalness: 1,
    roughness: 0.23,
    clearcoat: 0.55,
    envMapIntensity: 1.4,
  });
  const gold = new THREE.MeshPhysicalMaterial({
    color: 0xb49a63,
    metalness: 1,
    roughness: 0.28,
    clearcoat: 0.3,
    envMapIntensity: 1.3,
  });
  const shape = new THREE.Shape();
  const outline = [
    [-0.68, 1.8],
    [0.68, 1.8],
    [1.18, 1.3],
    [1.18, 0.7],
    [0.52, 0],
    [1.18, -0.7],
    [1.18, -1.3],
    [0.68, -1.8],
    [-0.68, -1.8],
    [-1.18, -1.3],
    [-1.18, -0.7],
    [-0.52, 0],
    [-1.18, 0.7],
    [-1.18, 1.3],
  ];
  outline.forEach(([x, y], i) => (i ? shape.lineTo(x, y) : shape.moveTo(x, y)));
  shape.closePath();
  for (const sign of [-1, 1]) {
    const hole = new THREE.Path();
    [
      [-0.39, 0.58],
      [-0.62, 0.83],
      [-0.62, 1.13],
      [-0.34, 1.4],
      [0.34, 1.4],
      [0.62, 1.13],
      [0.62, 0.83],
      [0.39, 0.58],
    ].forEach(([x, y], i) =>
      i ? hole.lineTo(x, y * sign) : hole.moveTo(x, y * sign),
    );
    hole.closePath();
    shape.holes.push(hole);
  }
  const sculptureGeo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.32,
    bevelEnabled: true,
    bevelThickness: 0.045,
    bevelSize: 0.045,
    bevelSegments: 3,
    steps: 1,
  });
  sculptureGeo.center();
  const knot = new THREE.Mesh(sculptureGeo, [metal, gold]);
  orbit.add(knot);
  const plates = [];
  for (let i = 0; i < 2; i++) {
    const plate = new THREE.Mesh(sculptureGeo, i ? metal : gold);
    plate.scale.set(1, 1, 0.2);
    plate.position.z = -0.35 - i * 0.18;
    orbit.add(plate);
    plates.push(plate);
  }
  const blueprint = new THREE.LineSegments(
    new THREE.EdgesGeometry(sculptureGeo, 25),
    new THREE.LineBasicMaterial({
      color: 0xd8bb7f,
      transparent: true,
      opacity: 0.12,
    }),
  );
  blueprint.scale.setScalar(1.19);
  blueprint.position.z = -0.8;
  orbit.add(blueprint);
  const rings = [];
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.6 + i * 0.34, 0.004, 6, 120),
      new THREE.MeshBasicMaterial({
        color: 0xa69574,
        transparent: true,
        opacity: i === 0 ? 0.3 : 0.13,
      }),
    );
    ring.rotation.set(Math.PI / 2, 0, 0);
    ring.position.y = -2.1;
    orbit.add(ring);
    rings.push(ring);
  }
  const satellites = [];
  for (let i = 0; i < 4; i++) {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.18, 0.18),
      new THREE.MeshStandardMaterial({
        color: 0xc3ae83,
        metalness: 1,
        roughness: 0.25,
      }),
    );
    orbit.add(m);
    satellites.push(m);
  }
  const coords = [];
  for (let i = 0; i < 160; i++) {
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
      color: 0xd4cbbb,
      size: 0.012,
      transparent: true,
      opacity: 0.3,
    }),
  );
  scene.add(stars);
  const laptop = new THREE.Group();
  scene.add(laptop);
  laptop.scale.setScalar(0.001);
  const chassis = new THREE.MeshStandardMaterial({
    color: 0x383735,
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
    color: 0x696761,
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
      color: 0xc8bda5,
      emissive: 0x4b412a,
      emissiveIntensity: 0.5,
      metalness: 0.3,
      roughness: 0.35,
    }),
    new THREE.MeshStandardMaterial({
      color: 0xd6bd86,
      emissive: 0x655638,
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
        color: 0xa1977c,
        transparent: true,
        opacity: 0.35,
      }),
    ),
  );
  const hub = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.36, 1),
    new THREE.MeshStandardMaterial({
      color: 0xe3d1a2,
      emissive: 0x806a3a,
      emissiveIntensity: 0.5,
      metalness: 0.5,
      roughness: 0.2,
    }),
  );
  network.add(hub);
  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(0.55, 0.009, 6, 60),
    new THREE.MeshBasicMaterial({ color: 0xcab27c }),
  );
  network.add(halo);
  const portal = new THREE.Group();
  scene.add(portal);
  portal.scale.setScalar(0.001);
  // One architectural doorway, reserved exclusively for the closing chapter.
  const arch = new THREE.Shape();
  arch.moveTo(-1.45, -2.2);
  arch.lineTo(-1.45, 0.85);
  arch.absarc(0, 0.85, 1.45, Math.PI, 0, true);
  arch.lineTo(1.45, -2.2);
  arch.lineTo(1.19, -2.2);
  arch.lineTo(1.19, 0.85);
  arch.absarc(0, 0.85, 1.19, 0, Math.PI, false);
  arch.lineTo(-1.19, -2.2);
  arch.closePath();
  const doorway = new THREE.Mesh(new THREE.ExtrudeGeometry(arch, {
    depth: 0.5, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 3, curveSegments: 48
  }), gold);
  portal.add(doorway);
  const threshold = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.16, 1.9), metal);
  threshold.position.set(0, -2.25, 0.25);
  portal.add(threshold);
  const groups = { orbit, laptop, network, portal };
  const placements = {
    orbit: [2.65, 0, 1.12], laptop: [2.55, -0.25, 1.07],
    network: [2.75, 0, 1.08], portal: [3.05, -0.1, 1.03]
  };
  let last = 0;
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
    if (paused && !dirty) return;
    dirty = false;
    const mobile = innerWidth < 760;
    const type = sections[active].dataset.world;
    const [tx, ty, scale] = placements[type] || [0, 0, 0];
    const b = bounds[active];
    const travel = paused ? 0.5 : clamp((scrollY + innerHeight * 0.45 - b.top) / b.height);
    const entrance = active === 0 || paused ? 1 : THREE.MathUtils.smoothstep(travel, 0, 0.15);
    const exit = active === 13 || paused ? 1 : 1 - THREE.MathUtils.smoothstep(travel, 0.72, 1);
    const presence = entrance * exit;
    const blend = paused ? 1 : 1 - Math.exp(-dt * 9);
    let visualY = mobile ? (active === 13 ? -2.3 : -2.35) : ty;
    if (mobile && active === 0)
      visualY =
        (0.5 - (heroArtCenter - scrollY) / innerHeight) *
        (2 * 11 * Math.tan((21 * Math.PI) / 180));
    if (mobile && active === 13)
      visualY = (0.5 - (joinArtCenter - scrollY) / innerHeight) *
        (2 * 11 * Math.tan((21 * Math.PI) / 180));
    const desktopFit = Math.min(1, camera.aspect / 1.45);
    const visualX = mobile ? 0 : tx * desktopFit;
    const size = mobile
      ? active === 13
        ? 0.62
        : active === 12
          ? 0.65
          : active === 6
            ? 0.68
            : active === 4
              ? 0.7
              : 0.8
      : scale * desktopFit;
    for (const [name, group] of Object.entries(groups)) {
      const target = name === type ? Math.max(0.001, size * presence) : 0.001;
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
      -0.4 + tiltX + travel * 1.1,
      -0.25,
    );
    knot.rotation.y = travel * 0.15;
    plates.forEach((plate, i) => {
      plate.position.z =
        -0.35 - i * 0.18 - travel * (i + 1) * 0.7;
    });
    laptop.rotation.set(
      0.22 + tiltY,
      -0.5 + tiltX + travel * 0.9,
      -0.04,
    );
    screenGroup.rotation.x = -1.3 + THREE.MathUtils.smoothstep(travel, 0, 0.65) * 1.15;
    network.rotation.set(
      0.2 + tiltY,
      travel * 1.6 + tiltX,
      -0.2,
    );
    hub.rotation.set(travel, travel * 2, 0);
    halo.rotation.set(1.1, 0.3 + travel * 2, 0.2);
    portal.rotation.y = -0.45 + travel * 0.65 + tiltX * 0.3;
    portal.rotation.z = 0;
    portal.position.z = active === 13 ? travel * 0.3 : 0;
    stars.visible = active === 0;
    stars.rotation.z = travel * 0.04;
    stars.material.opacity = type === "quiet" ? 0.08 : 0.28;
    satellites.forEach((m, i) => {
      const a = (i * Math.PI * 2) / 4 + travel * 0.6;
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

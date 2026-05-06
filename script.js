const MEDIA_FILES = [
  "foto1.jpg",
  "foto2.png",
  "video1.mp4"
];

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".mov"];

const mediaContainer = document.getElementById("media-container");
const phraseBlock = document.getElementById("phrase-block");
const phraseText = document.getElementById("phrase-text");
const nextButton = document.getElementById("next-button");

let lastMedia = null;
let lastPhrase = null;

function getRandomItem(list, previousItem) {
  if (!Array.isArray(list) || list.length === 0) return null;
  if (list.length === 1) return list[0];

  let candidate = list[Math.floor(Math.random() * list.length)];
  while (candidate === previousItem) {
    candidate = list[Math.floor(Math.random() * list.length)];
  }
  return candidate;
}

function getFileType(fileName) {
  const lower = fileName.toLowerCase();
  if (IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext))) return "image";
  if (VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext))) return "video";
  return "unknown";
}

function renderMedia(fileName) {
  const mediaType = getFileType(fileName);
  const path = `./assets/${fileName}`;

  mediaContainer.innerHTML = "";

  if (mediaType === "image") {
    const img = document.createElement("img");
    img.src = path;
    img.alt = "Foto di auguri";
    img.loading = "eager";
    mediaContainer.appendChild(img);
    return;
  }

  if (mediaType === "video") {
    const video = document.createElement("video");
    video.src = path;
    video.controls = true;
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    mediaContainer.appendChild(video);
    return;
  }

  mediaContainer.textContent = "Formato media non supportato.";
}

function preloadMedia(fileName) {
  const mediaType = getFileType(fileName);
  const path = `./assets/${fileName}`;
  if (mediaType === "image") {
    const preload = new Image();
    preload.src = path;
    return;
  }
  if (mediaType === "video") {
    const preload = document.createElement("video");
    preload.preload = "metadata";
    preload.src = path;
  }
}

function runFadeTransition(element, callback) {
  element.classList.add("fade-out");
  window.setTimeout(() => {
    callback();
    element.classList.remove("fade-out");
    element.classList.add("fade-in");
  }, 220);
}

function pickAndRenderContent() {
  const nextMedia = getRandomItem(MEDIA_FILES, lastMedia);
  const nextPhrase = getRandomItem(window.FRASES || [], lastPhrase);

  if (nextMedia) {
    renderMedia(nextMedia);
    lastMedia = nextMedia;
  }

  if (nextPhrase) {
    phraseText.textContent = nextPhrase;
    lastPhrase = nextPhrase;
  } else {
    phraseText.textContent = "Aggiungi almeno una frase in frasi.js";
  }

  const upcomingMedia = getRandomItem(MEDIA_FILES, lastMedia);
  if (upcomingMedia) preloadMedia(upcomingMedia);
}

function setupConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  const particles = [];
  const colors = ["#ffd84d", "#f8f9ff", "#9fb8ff"];
  let rafId = null;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: -20,
      size: Math.random() * 5 + 2,
      speedY: Math.random() * 1.4 + 0.8,
      drift: Math.random() * 1.2 - 0.6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (particles.length < 45) {
      particles.push(createParticle());
    }

    particles.forEach((p, index) => {
      p.y += p.speedY;
      p.x += p.drift;
      p.rotation += 0.02;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();

      if (p.y > canvas.height + 20) {
        particles[index] = createParticle();
      }
    });

    rafId = window.requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);
  draw();

  window.addEventListener("beforeunload", () => {
    if (rafId) window.cancelAnimationFrame(rafId);
  });
}

function init() {
  pickAndRenderContent();
  setupConfetti();

  nextButton.addEventListener("click", () => {
    mediaContainer.classList.add("fade-out");
    phraseBlock.classList.add("fade-out");

    window.setTimeout(() => {
      pickAndRenderContent();
      mediaContainer.classList.remove("fade-out");
      phraseBlock.classList.remove("fade-out");
      mediaContainer.classList.add("fade-in");
      phraseBlock.classList.add("fade-in");
    }, 220);
  });
}

init();

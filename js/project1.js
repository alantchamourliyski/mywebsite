const fileInput = document.getElementById("fileInput");
const assetSelect = document.getElementById("assetSelect");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

let audioCtx;
let analyser;
let source;
let dataArray;
let bufferLength;
let audioElement;

// Resize canvas to fit
function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Load selected audio (from file or asset)
function loadAudio(urlOrFile) {
  if (audioElement) {
    audioElement.pause();
    audioElement = null;
  }

  audioElement = new Audio();
  if (urlOrFile instanceof File) {
    audioElement.src = URL.createObjectURL(urlOrFile);
  } else {
    audioElement.src = urlOrFile;
  }

  audioElement.crossOrigin = "anonymous";
  audioElement.load();

  // Create Web Audio context
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (source) source.disconnect();

  source = audioCtx.createMediaElementSource(audioElement);
  analyser = audioCtx.createAnalyser();
  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  analyser.fftSize = 256;
  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);
}

// Play / pause buttons
playBtn.addEventListener("click", () => {
  if (audioCtx.state === "suspended") audioCtx.resume();
  if (audioElement) audioElement.play();
});

pauseBtn.addEventListener("click", () => {
  if (audioElement) audioElement.pause();
});

// File input
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) loadAudio(file);
});

// Asset select
assetSelect.addEventListener("change", (e) => {
  const val = e.target.value;
  if (val) loadAudio(val);
});

// Visualizer
function draw() {
  requestAnimationFrame(draw);
  if (!analyser) return;

  analyser.getByteFrequencyData(dataArray);

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const barWidth = canvas.width / bufferLength;
  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i];
    ctx.fillStyle = `hsl(${i * 4}, 100%, 50%)`;
    ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 1, barHeight);
  }
}

draw();

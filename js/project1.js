const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
window.addEventListener("resize", resize);
resize();

const audioCtx = new AudioContext();
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 256;

const data = new Uint8Array(analyser.frequencyBinCount);

fetch("../assets/songs/wav/sample.wav")
  .then(r => r.arrayBuffer())
  .then(b => audioCtx.decodeAudioData(b))
  .then(buf => {
    const src = audioCtx.createBufferSource();
    src.buffer = buf;
    src.connect(analyser);
    analyser.connect(audioCtx.destination);
    src.start();
    draw();
  });

function draw() {
  requestAnimationFrame(draw);
  analyser.getByteFrequencyData(data);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const barW = canvas.width / data.length;

  data.forEach((v, i) => {
    ctx.fillStyle = `hsl(${i * 4},100%,50%)`;
    ctx.fillRect(i * barW, canvas.height, barW - 1, -v * 1.5);
  });
}

document.body.addEventListener("click", () => audioCtx.resume(), { once: true });

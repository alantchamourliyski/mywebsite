const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Simple animated bars
let t = 0;

function draw() {
  requestAnimationFrame(draw);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 50; i++) {
    const x = (i / 50) * canvas.width;
    const h = Math.sin(t + i * 0.5) * 100 + 150;
    ctx.fillStyle = `hsl(${i * 7}, 100%, 50%)`;
    ctx.fillRect(x, canvas.height - h, 10, h);
  }

  t += 0.05;
}

draw();

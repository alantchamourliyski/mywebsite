// main.js - landing page logic

// Example: animate a subtle background effect or text
document.addEventListener("DOMContentLoaded", () => {
  const mainHeading = document.querySelector("main h1");

  if (mainHeading) {
    let opacity = 0;
    let increasing = true;

    function pulse() {
      requestAnimationFrame(pulse);

      if (increasing) {
        opacity += 0.01;
        if (opacity >= 1) increasing = false;
      } else {
        opacity -= 0.01;
        if (opacity <= 0.5) increasing = true;
      }

      mainHeading.style.opacity = opacity;
    }

    pulse();
  }
});

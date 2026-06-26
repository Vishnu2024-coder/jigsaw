export const difficulties = {
  Easy: 3,
  Medium: 4,
  Hard: 5,
  Expert: 6
};

export const presetImages = [
  {
    id: "aurora",
    name: "Aurora Lake",
    image:
      "data:image/svg+xml;utf8," +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 900">
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
              <stop stop-color="#13173f"/>
              <stop offset=".45" stop-color="#6338c9"/>
              <stop offset="1" stop-color="#26d6ff"/>
            </linearGradient>
            <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
              <stop stop-color="#192b68"/>
              <stop offset="1" stop-color="#07182f"/>
            </linearGradient>
          </defs>
          <rect width="900" height="900" fill="url(#sky)"/>
          <path d="M0 420 C160 310 250 440 410 325 C560 215 640 350 900 250 L900 900 L0 900Z" fill="#09142d"/>
          <path d="M0 535 C200 475 340 590 520 505 C680 430 755 510 900 455 L900 900 L0 900Z" fill="url(#water)"/>
          <path d="M110 120 C170 250 220 290 275 390 C230 245 315 210 340 80" stroke="#8df7ff" stroke-width="28" fill="none" opacity=".8"/>
          <path d="M360 80 C430 260 510 300 610 410 C545 240 610 210 685 95" stroke="#ff8fe9" stroke-width="24" fill="none" opacity=".68"/>
          <circle cx="710" cy="165" r="62" fill="#fff6bb"/>
          <g fill="#ffffff" opacity=".7">
            <circle cx="95" cy="90" r="5"/><circle cx="210" cy="185" r="4"/><circle cx="510" cy="145" r="5"/><circle cx="790" cy="320" r="4"/>
          </g>
        </svg>`)
  },
  {
    id: "garden",
    name: "Neon Garden",
    image:
      "data:image/svg+xml;utf8," +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 900">
          <defs>
            <radialGradient id="bg" cx=".5" cy=".35" r=".7">
              <stop stop-color="#ffe599"/><stop offset=".45" stop-color="#ff6fb5"/><stop offset="1" stop-color="#24164f"/>
            </radialGradient>
          </defs>
          <rect width="900" height="900" fill="url(#bg)"/>
          <circle cx="690" cy="160" r="88" fill="#fff2a7"/>
          <path d="M0 640 C160 520 250 650 390 540 C520 440 670 590 900 470 L900 900 L0 900Z" fill="#123f38"/>
          <g stroke="#2effc8" stroke-width="15" stroke-linecap="round">
            <path d="M150 800 C150 650 210 560 270 455"/><path d="M450 820 C430 640 490 520 600 420"/><path d="M730 820 C715 660 770 560 840 490"/>
          </g>
          <g>
            <circle cx="270" cy="430" r="54" fill="#ff5fa8"/><circle cx="232" cy="448" r="36" fill="#ffcb57"/><circle cx="600" cy="395" r="62" fill="#8cf7ff"/><circle cx="635" cy="420" r="34" fill="#7a4dff"/><circle cx="835" cy="465" r="46" fill="#ffd166"/>
          </g>
        </svg>`)
  },
  {
    id: "city",
    name: "Cyber City",
    image:
      "data:image/svg+xml;utf8," +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 900">
          <defs>
            <linearGradient id="night" x1="0" y1="0" x2="0" y2="1">
              <stop stop-color="#06152f"/><stop offset=".58" stop-color="#1c1a52"/><stop offset="1" stop-color="#020611"/>
            </linearGradient>
          </defs>
          <rect width="900" height="900" fill="url(#night)"/>
          <circle cx="720" cy="155" r="84" fill="#c9fff9"/>
          <g fill="#11172d">
            <rect x="50" y="400" width="120" height="420"/><rect x="205" y="300" width="155" height="520"/><rect x="405" y="365" width="130" height="455"/><rect x="585" y="250" width="185" height="570"/><rect x="790" y="445" width="80" height="375"/>
          </g>
          <g fill="#8cf7ff">
            <rect x="80" y="445" width="25" height="40"/><rect x="125" y="520" width="25" height="40"/><rect x="240" y="350" width="30" height="38"/><rect x="305" y="430" width="30" height="38"/><rect x="435" y="420" width="30" height="38"/><rect x="625" y="305" width="34" height="42"/><rect x="700" y="390" width="34" height="42"/>
          </g>
          <path d="M0 750 C220 690 390 805 570 735 C705 682 790 720 900 675 L900 900 L0 900Z" fill="#061022"/>
          <path d="M90 815 L805 815" stroke="#ff5bd8" stroke-width="18" stroke-linecap="round"/>
        </svg>`)
  }
];

export function createGeneratedImage() {
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 900;
  const context = canvas.getContext("2d");
  const gradient = context.createLinearGradient(0, 0, 900, 900);
  const hue = Math.floor(Math.random() * 360);

  gradient.addColorStop(0, `hsl(${hue}, 90%, 18%)`);
  gradient.addColorStop(0.5, `hsl(${(hue + 90) % 360}, 90%, 52%)`);
  gradient.addColorStop(1, `hsl(${(hue + 180) % 360}, 90%, 32%)`);
  context.fillStyle = gradient;
  context.fillRect(0, 0, 900, 900);

  for (let i = 0; i < 22; i += 1) {
    context.beginPath();
    context.fillStyle = `hsla(${(hue + i * 37) % 360}, 95%, ${52 + (i % 3) * 8}%, .72)`;
    context.arc(Math.random() * 900, Math.random() * 900, 35 + Math.random() * 110, 0, Math.PI * 2);
    context.fill();
  }

  context.fillStyle = "rgba(255,255,255,.72)";
  context.font = "bold 86px system-ui";
  context.fillText("PUZZLE", 250, 470);
  return canvas.toDataURL("image/png");
}

export function createPieces(size, rotationMode) {
  const total = size * size;
  const cells = Array.from({ length: total }, (_, index) => index);
  const shuffledCells = [...cells].sort(() => Math.random() - 0.5);

  return cells.map((index) => ({
    id: `piece-${index}`,
    correctIndex: index,
    currentIndex: shuffledCells[index],
    rotation: rotationMode ? [0, 90, 180, 270][Math.floor(Math.random() * 4)] : 0,
    locked: false
  }));
}

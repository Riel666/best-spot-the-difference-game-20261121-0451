// The three original scenes of Lantern Garden. Each round paints the same
// picture twice: variant 0 is the original (left panel), variant 1 is the
// changed copy (right panel). A difference is one deliberate change between
// the two variants, listed in `diffs` with its panel coordinates and the
// click radius the game accepts. All art is drawn with canvas primitives;
// nothing is loaded from the network.
function grad(ctx, y0, y1, stops) {
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  for (const [at, color] of stops) g.addColorStop(at, color);
  return g;
}

function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function poly(ctx, pts, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
  ctx.fill();
}

function line(ctx, x0, y0, x1, y1, stroke, width = 2) {
  ctx.strokeStyle = stroke;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}

function glow(ctx, x, y, r, color) {
  const g = ctx.createRadialGradient(x, y, 1, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, 'rgba(255, 190, 90, 0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function sparkle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}

function stars(ctx, pts, fill = 'rgba(255,255,255,0.85)') {
  for (const [x, y, r] of pts) sparkle(ctx, x, y, r, fill);
}

function text(ctx, str, x, y, size, fill, align = 'left') {
  ctx.fillStyle = fill;
  ctx.font = `bold ${size}px Georgia, serif`;
  ctx.textAlign = align;
  ctx.fillText(str, x, y);
}

// ---------------------------------------------------------------- round 1
const GARDEN_STARS = [
  [40, 60, 3], [110, 40, 2], [180, 90, 3], [250, 50, 2], [320, 80, 3],
  [390, 45, 2], [450, 110, 3], [540, 50, 2], [90, 140, 2], [210, 160, 2],
  [300, 130, 2], [380, 170, 2], [520, 130, 2], [150, 110, 2], [560, 100, 3],
];
const GARDEN_FIREFLIES = [
  [120, 200], [180, 150], [260, 120], [350, 180], [420, 140], [470, 220],
];

function paintGarden(ctx, W, H, variant) {
  // Dusk sky.
  ctx.fillStyle = grad(ctx, 0, 340, [[0, '#2b1e4f'], [0.7, '#7a3d63'], [1, '#e07840']]);
  ctx.fillRect(0, 0, W, 340);
  stars(ctx, GARDEN_STARS);
  // Moon: full in the original, crescent in the changed copy.
  if (variant === 0) {
    circle(ctx, 480, 78, 34, '#fdf3d0');
    circle(ctx, 470, 70, 6, '#e8d9a8');
    circle(ctx, 492, 88, 4, '#e8d9a8');
    circle(ctx, 488, 66, 3, '#e8d9a8');
  } else {
    ctx.fillStyle = '#fdf3d0';
    ctx.beginPath();
    ctx.arc(480, 78, 34, -0.5, Math.PI * 1.15);
    ctx.arc(494, 70, 30, Math.PI * 1.1, -0.6, true);
    ctx.closePath();
    ctx.fill();
  }
  // Distant hills and a pagoda silhouette.
  poly(ctx, [[0, 340], [0, 300], [120, 285], [240, 318], [340, 300], [460, 325], [600, 305], [600, 340]], '#241a3e');
  rect(ctx, 78, 250, 64, 90, '#1c1433');
  poly(ctx, [[66, 252], [154, 252], [140, 232], [80, 232]], '#1c1433');
  poly(ctx, [[72, 232], [148, 232], [136, 214], [84, 214]], '#1c1433');
  poly(ctx, [[80, 214], [140, 214], [130, 198], [90, 198]], '#1c1433');
  line(ctx, 110, 198, 110, 182, '#1c1433', 3);
  circle(ctx, 110, 180, 3, '#1c1433');
  rect(ctx, 92, 268, 10, 14, '#ffd98a');
  rect(ctx, 118, 268, 10, 14, '#ffd98a');
  rect(ctx, 92, 296, 10, 14, '#ffd98a');
  // Lawn.
  ctx.fillStyle = grad(ctx, 340, 600, [[0, '#1e4d2e'], [1, '#122e1b']]);
  ctx.fillRect(0, 340, W, 260);
  for (let x = 20; x < 600; x += 46) {
    line(ctx, x, 380, x + 4, 368, '#2c6b3e', 2);
    line(ctx, x + 18, 420, x + 22, 408, '#2c6b3e', 2);
  }
  // Pond with a koi (the fish swims away in the changed copy).
  ellipse(ctx, 430, 512, 135, 48, '#274b8f');
  ellipse(ctx, 430, 512, 118, 38, '#2f5aa8');
  line(ctx, 330, 500, 380, 496, 'rgba(255,255,255,0.35)', 2);
  line(ctx, 460, 528, 520, 524, 'rgba(255,255,255,0.35)', 2);
  if (variant === 0) {
    ellipse(ctx, 430, 512, 16, 7, '#ff8c42');
    poly(ctx, [[414, 512], [404, 504], [404, 520]], '#ff8c42');
    circle(ctx, 443, 510, 2, '#1c1433');
  }
  // Stream and a little wooden bridge at the bottom left.
  rect(ctx, 0, 556, 220, 44, '#2f5aa8');
  line(ctx, 20, 575, 200, 570, 'rgba(255,255,255,0.3)', 2);
  for (let i = 0; i < 5; i++) {
    if (variant === 1 && i === 2) continue; // the middle plank is gone
    const x = 62 + i * 26;
    rect(ctx, x, 538, 22, 10, '#8a6b45');
    line(ctx, x, 538, x, 548, '#6b4f30', 1);
  }
  line(ctx, 58, 540, 58, 556, '#6b4f30', 3);
  line(ctx, 196, 540, 196, 556, '#6b4f30', 3);
  // Fence with a cat sitting on it (the cat wanders off in the changed copy).
  rect(ctx, 240, 388, 190, 6, '#5a4632');
  rect(ctx, 240, 406, 190, 6, '#5a4632');
  rect(ctx, 250, 380, 8, 44, '#4a3826');
  rect(ctx, 414, 380, 8, 44, '#4a3826');
  if (variant === 0) {
    // A slate-blue cat, dark enough for dusk but light enough to spot.
    ellipse(ctx, 330, 372, 20, 14, '#453d5e');
    circle(ctx, 344, 352, 11, '#453d5e');
    poly(ctx, [[336, 344], [338, 332], [345, 341]], '#453d5e');
    poly(ctx, [[348, 342], [352, 331], [355, 342]], '#453d5e');
    circle(ctx, 341, 350, 1, '#ffd98a');
    circle(ctx, 347, 350, 1, '#ffd98a');
    ctx.strokeStyle = '#453d5e';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(312, 378);
    ctx.quadraticCurveTo(296, 372, 300, 356);
    ctx.stroke();
  }
  // Old tree with a paper lantern hanging from it.
  rect(ctx, 568, 240, 14, 110, '#4a3826');
  circle(ctx, 545, 175, 42, '#1a3a24');
  circle(ctx, 588, 150, 38, '#1e4529');
  circle(ctx, 600, 195, 30, '#1a3a24');
  if (variant === 0) {
    line(ctx, 545, 212, 545, 240, '#cbb8ff', 1);
    glow(ctx, 545, 253, 26, 'rgba(255, 150, 60, 0.55)');
    rect(ctx, 535, 240, 20, 26, '#d94f3d');
    rect(ctx, 538, 236, 14, 4, '#ffd98a');
    rect(ctx, 538, 266, 14, 4, '#ffd98a');
  }
  // Stone lanterns: the middle one burns in the original, dark in the copy.
  for (const [x, y, lit] of [[95, 470, true], [205, 495, variant === 0], [520, 455, true]]) {
    if (lit) glow(ctx, x, y - 18, 30, 'rgba(255, 190, 90, 0.5)');
    rect(ctx, x - 14, y, 28, 8, '#8f8a80');
    rect(ctx, x - 4, y - 22, 8, 22, '#8f8a80');
    rect(ctx, x - 12, y - 38, 24, 16, '#a39d90');
    rect(ctx, x - 7, y - 34, 14, 8, lit ? '#ffd98a' : '#2a2a33');
    poly(ctx, [[x - 16, y - 38], [x + 16, y - 38], [x + 8, y - 50], [x - 8, y - 50]], '#7a7468');
    circle(ctx, x, y - 52, 3, '#7a7468');
  }
  // Fireflies: one blinks out in the changed copy.
  for (const [x, y] of GARDEN_FIREFLIES) {
    if (variant === 1 && x === 470 && y === 150) continue;
    glow(ctx, x, y, 10, 'rgba(190, 255, 130, 0.7)');
    circle(ctx, x, y, 2, '#d8ffb0');
  }
  // Tulips along the bottom: one changes colour.
  for (let i = 0; i < 9; i++) {
    const x = 250 + i * 20;
    line(ctx, x, 566, x, 582, '#2c6b3e', 2);
    let color = ['#e84a5f', '#ffd23e', '#f5ead6'][i % 3];
    if (variant === 1 && i === 4) color = '#ffd23e'; // the red tulip turns yellow
    if (variant === 0 && i === 4) color = '#e84a5f';
    ellipse(ctx, x, 560, 7, 9, color);
  }
}

// ---------------------------------------------------------------- round 2
function paintHarbor(ctx, W, H, variant) {
  // Morning sky, sun and clouds.
  ctx.fillStyle = grad(ctx, 0, 360, [[0, '#a8d8ee'], [0.7, '#e8f3f8'], [1, '#fdf3cf']]);
  ctx.fillRect(0, 0, W, 360);
  // Sun: eight rays in the original, five in the changed copy.
  const rays = variant === 0 ? 8 : 5;
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2;
    line(ctx, 500 + Math.cos(a) * 38, 72 + Math.sin(a) * 38, 500 + Math.cos(a) * 52, 72 + Math.sin(a) * 52, '#f2c14e', 3);
  }
  circle(ctx, 500, 72, 30, '#ffe08a');
  // Clouds: one drifts away in the changed copy.
  for (const [x, y] of [[120, 90], [360, 80]]) {
    ellipse(ctx, x, y, 42, 16, 'rgba(255,255,255,0.95)');
    ellipse(ctx, x + 24, y + 4, 30, 13, 'rgba(255,255,255,0.95)');
  }
  if (variant === 0) {
    ellipse(ctx, 200, 120, 42, 16, 'rgba(255,255,255,0.95)');
    ellipse(ctx, 224, 124, 30, 13, 'rgba(255,255,255,0.95)');
  }
  // Gulls: one flies off in the changed copy.
  ctx.strokeStyle = '#3a4a5a';
  ctx.lineWidth = 2;
  for (const [x, y] of [[250, 150], [370, 145]]) {
    ctx.beginPath();
    ctx.moveTo(x - 9, y);
    ctx.quadraticCurveTo(x - 3, y - 7, x, y);
    ctx.quadraticCurveTo(x + 3, y - 7, x + 9, y);
    ctx.stroke();
  }
  if (variant === 0) {
    ctx.beginPath();
    ctx.moveTo(301, 180);
    ctx.quadraticCurveTo(307, 173, 310, 180);
    ctx.quadraticCurveTo(313, 173, 319, 180);
    ctx.stroke();
  }
  // Sea.
  ctx.fillStyle = grad(ctx, 360, 600, [[0, '#2e7f9e'], [1, '#174a63']]);
  ctx.fillRect(0, 360, W, 240);
  for (let y = 390; y < 600; y += 34) {
    for (let x = (y % 68 === 0 ? 30 : 0); x < 600; x += 68) {
      ctx.strokeStyle = 'rgba(255,255,255,0.28)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + 12, y - 6, x + 26, y);
      ctx.stroke();
    }
  }
  // Lighthouse with its flag: the flag flies the other way in the copy.
  poly(ctx, [[62, 360], [72, 190], [108, 190], [118, 360]], '#f5ead6');
  rect(ctx, 66, 300, 48, 26, '#d94f3d');
  rect(ctx, 70, 230, 40, 26, '#d94f3d');
  rect(ctx, 68, 178, 44, 14, '#3a4a5a');
  rect(ctx, 78, 158, 24, 20, '#ffd98a');
  line(ctx, 90, 158, 90, 132, '#3a4a5a', 3);
  if (variant === 0) poly(ctx, [[90, 132], [118, 138], [90, 146]], '#d94f3d');
  else poly(ctx, [[90, 132], [62, 138], [90, 146]], '#d94f3d');
  // Wooden dock and crates: the top crate is gone in the changed copy.
  rect(ctx, 0, 530, 210, 70, '#7a5a38');
  for (let x = 0; x < 210; x += 30) line(ctx, x, 530, x, 600, '#5a4026', 2);
  line(ctx, 0, 555, 210, 555, '#5a4026', 2);
  rect(ctx, 95, 505, 42, 42, '#b08a4a');
  line(ctx, 95, 505, 137, 547, '#8a6b35', 2);
  line(ctx, 137, 505, 95, 547, '#8a6b35', 2);
  if (variant === 0) {
    rect(ctx, 140, 463, 42, 42, '#b08a4a');
    line(ctx, 140, 463, 182, 505, '#8a6b35', 2);
    line(ctx, 182, 463, 140, 505, '#8a6b35', 2);
  }
  // Rowboat with an oar.
  poly(ctx, [[160, 500], [220, 500], [210, 516], [170, 516]], '#8a5a3a');
  line(ctx, 190, 500, 190, 478, '#6b4f30', 3);
  line(ctx, 190, 478, 214, 462, '#6b4f30', 2);
  // Sailboats: the far sail is red in the original, blue in the copy.
  poly(ctx, [[280, 448], [330, 448], [318, 462], [290, 462]], '#5a4632');
  line(ctx, 305, 448, 305, 392, '#4a3826', 3);
  poly(ctx, [[305, 392], [305, 446], [338, 446]], '#f5ead6');
  poly(ctx, [[440, 470], [490, 470], [478, 484], [450, 484]], '#5a4632');
  line(ctx, 465, 470, 465, 408, '#4a3826', 3);
  poly(ctx, [[465, 408], [465, 468], [500, 468]], variant === 0 ? '#d94f3d' : '#3d6fd9');
  // Buoys: the far one is yellow in the original, green in the copy.
  circle(ctx, 350, 520, 12, '#ff8c42');
  rect(ctx, 342, 514, 16, 4, '#fff');
  circle(ctx, 520, 545, 12, variant === 0 ? '#ffd23e' : '#4caf50');
  rect(ctx, 512, 539, 16, 4, '#fff');
}

// ---------------------------------------------------------------- round 3
const PICNIC_STARS = [
  [40, 70, 3], [100, 40, 2], [170, 90, 3], [230, 50, 2], [360, 60, 3],
  [420, 150, 2], [470, 60, 2], [560, 90, 3], [80, 140, 2], [260, 120, 2],
  [330, 160, 2], [580, 160, 2], [140, 190, 2], [480, 200, 2], [40, 210, 2],
];

function paintPicnic(ctx, W, H, variant) {
  // Starry night.
  ctx.fillStyle = grad(ctx, 0, 380, [[0, '#0b1035'], [1, '#2a4a8f']]);
  ctx.fillRect(0, 0, W, 380);
  for (const [x, y, r] of PICNIC_STARS) {
    if (variant === 1 && x === 520 && y === 120) continue; // one star winks out
    sparkle(ctx, x, y, r, 'rgba(255,255,255,0.9)');
  }
  // Moon with craters.
  circle(ctx, 300, 80, 30, '#fdf3d0');
  circle(ctx, 290, 72, 5, '#e8d9a8');
  circle(ctx, 308, 88, 4, '#e8d9a8');
  // Comet: streaks across the original, gone in the copy.
  if (variant === 0) {
    const g = ctx.createLinearGradient(430, 110, 500, 70);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(1, 'rgba(255,255,255,0.9)');
    ctx.strokeStyle = g;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(430, 110);
    ctx.lineTo(498, 68);
    ctx.stroke();
    glow(ctx, 500, 66, 12, 'rgba(255,255,255,0.8)');
    circle(ctx, 500, 66, 4, '#fff');
  }
  // Old tree with an owl: eyes open in the original, shut in the copy.
  rect(ctx, 74, 200, 14, 180, '#3a2a1e');
  circle(ctx, 60, 180, 40, '#122e1b');
  circle(ctx, 110, 160, 36, '#16351f');
  circle(ctx, 140, 200, 30, '#122e1b');
  line(ctx, 88, 230, 150, 216, '#3a2a1e', 6);
  ellipse(ctx, 150, 206, 16, 20, '#6b4f30');
  circle(ctx, 150, 186, 12, '#6b4f30');
  poly(ctx, [[140, 178], [142, 166], [149, 175]], '#6b4f30');
  poly(ctx, [[152, 175], [159, 166], [160, 178]], '#6b4f30');
  if (variant === 0) {
    circle(ctx, 145, 184, 3, '#fff');
    circle(ctx, 155, 184, 3, '#fff');
    circle(ctx, 145, 184, 1, '#1c1433');
    circle(ctx, 155, 184, 1, '#1c1433');
  } else {
    line(ctx, 142, 184, 148, 184, '#1c1433', 2);
    line(ctx, 152, 184, 158, 184, '#1c1433', 2);
  }
  // Meadow.
  ctx.fillStyle = grad(ctx, 380, 600, [[0, '#16351f'], [1, '#0c2113']]);
  ctx.fillRect(0, 380, W, 220);
  for (let x = 16; x < 600; x += 52) {
    line(ctx, x, 420, x + 4, 408, '#2c6b3e', 2);
    line(ctx, x + 24, 580, x + 28, 568, '#2c6b3e', 2);
  }
  // Picnic blanket, red and white checks.
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 8; c++) {
      rect(ctx, 200 + c * 28, 470 + r * 25, 28, 25, (r + c) % 2 === 0 ? '#d94f3d' : '#f5ead6');
    }
  }
  rect(ctx, 200, 470, 224, 100, 'rgba(0,0,0,0)');
  ctx.strokeStyle = '#8a3a30';
  ctx.lineWidth = 2;
  ctx.strokeRect(200, 470, 224, 100);
  // Basket: lid open in the original, shut in the copy.
  rect(ctx, 246, 478, 48, 30, '#a8793f');
  line(ctx, 246, 488, 294, 488, '#8a5f2e', 2);
  line(ctx, 246, 498, 294, 498, '#8a5f2e', 2);
  ctx.strokeStyle = '#8a5f2e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(270, 478, 14, Math.PI, 0);
  ctx.stroke();
  if (variant === 0) {
    ctx.save();
    ctx.translate(246, 478);
    ctx.rotate(-0.9);
    rect(ctx, 0, -6, 48, 8, '#c08a4a');
    ctx.restore();
  } else {
    rect(ctx, 246, 470, 48, 8, '#c08a4a');
  }
  // Cake with candles: three in the original, two in the copy.
  rect(ctx, 312, 500, 44, 22, '#f5ead6');
  rect(ctx, 312, 500, 44, 8, '#ff9ec6');
  const candles = variant === 0 ? [322, 334, 346] : [328, 342];
  for (const x of candles) {
    rect(ctx, x, 488, 3, 12, '#fff');
    glow(ctx, x + 1, 484, 7, 'rgba(255, 200, 80, 0.8)');
    circle(ctx, x + 1, 484, 2, '#ffd23e');
  }
  // A cup on the blanket, gone in the copy.
  if (variant === 0) {
    rect(ctx, 378, 536, 16, 14, '#fff');
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(396, 543, 5, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
  }
  // Telescope: aimed at the sky in the original, level in the copy.
  line(ctx, 480, 470, 462, 512, '#3a4a5a', 4);
  line(ctx, 480, 470, 498, 512, '#3a4a5a', 4);
  line(ctx, 480, 470, 480, 514, '#3a4a5a', 4);
  ctx.strokeStyle = '#c8b060';
  ctx.lineWidth = 7;
  ctx.beginPath();
  if (variant === 0) {
    ctx.moveTo(470, 452);
    ctx.lineTo(522, 408);
  } else {
    ctx.moveTo(470, 452);
    ctx.lineTo(526, 452);
  }
  ctx.stroke();
  circle(ctx, 470, 452, 6, '#8a6b35');
  // A little dog by the blanket, gone in the copy.
  if (variant === 0) {
    ellipse(ctx, 150, 516, 20, 14, '#8a5a3a');
    circle(ctx, 166, 496, 11, '#8a5a3a');
    poly(ctx, [[160, 488], [162, 478], [168, 486]], '#8a5a3a');
    ctx.strokeStyle = '#8a5a3a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(132, 520);
    ctx.quadraticCurveTo(118, 514, 122, 500);
    ctx.stroke();
    circle(ctx, 170, 494, 2, '#1c1433');
  }
  // Paper lantern on the grass: lit in the original, dark in the copy.
  if (variant === 0) glow(ctx, 545, 545, 30, 'rgba(255, 190, 90, 0.55)');
  rect(ctx, 533, 532, 24, 26, variant === 0 ? '#d94f3d' : '#5a3a35');
  rect(ctx, 537, 528, 16, 4, variant === 0 ? '#ffd98a' : '#3a2a28');
  rect(ctx, 537, 558, 16, 4, variant === 0 ? '#ffd98a' : '#3a2a28');
  // Fireflies.
  for (const [x, y] of [[90, 300], [200, 340], [420, 320], [520, 420]]) {
    glow(ctx, x, y, 9, 'rgba(190, 255, 130, 0.65)');
    circle(ctx, x, y, 2, '#d8ffb0');
  }
}

export const ROUNDS = [
  {
    name: 'Round 1 · Lantern Garden at Dusk',
    short: 'Lantern Garden',
    timeLimit: 180,
    message: 'Click a difference on either picture. Seven hide in this garden.',
    paint: paintGarden,
    diffs: [
      { x: 545, y: 253, r: 26, hint: 'Something glows from the old tree.' },
      { x: 330, y: 368, r: 26, hint: 'A fence makes a fine seat.' },
      { x: 205, y: 495, r: 26, hint: 'One lantern burns brighter than the rest.' },
      { x: 470, y: 150, r: 18, hint: 'A light blinks out high in the dusk.' },
      { x: 130, y: 545, r: 24, hint: 'The bridge is missing a step.' },
      { x: 340, y: 565, r: 20, hint: 'A flower changed its dress.' },
      { x: 430, y: 512, r: 28, hint: 'Something orange swims in the pond.' },
    ],
  },
  {
    name: 'Round 2 · Harbor Morning',
    short: 'Harbor Morning',
    timeLimit: 180,
    message: 'Seven changes hide in the harbor. The gulls saw them all.',
    paint: paintHarbor,
    diffs: [
      { x: 500, y: 72, r: 30, hint: 'Count the sunbeams.' },
      { x: 200, y: 120, r: 26, hint: 'A cloud drifted away.' },
      { x: 310, y: 180, r: 18, hint: 'One gull flew off.' },
      { x: 95, y: 155, r: 22, hint: 'The wind changed its mind.' },
      { x: 455, y: 430, r: 28, hint: 'A sail was repainted.' },
      { x: 520, y: 545, r: 22, hint: 'A buoy changed colour.' },
      { x: 161, y: 483, r: 26, hint: 'A crate went missing from the dock.' },
    ],
  },
  {
    name: 'Round 3 · Starlight Picnic',
    short: 'Starlight Picnic',
    timeLimit: 240,
    message: 'Nine changes hide under the stars. Mind the owl — it saw everything.',
    paint: paintPicnic,
    diffs: [
      { x: 445, y: 100, r: 28, hint: 'Something streaked across the sky.' },
      { x: 150, y: 215, r: 24, hint: 'The owl blinked.' },
      { x: 330, y: 495, r: 24, hint: 'Count the candles on the cake.' },
      { x: 500, y: 430, r: 28, hint: 'The telescope is looking somewhere else.' },
      { x: 150, y: 510, r: 28, hint: 'A small friend wandered off.' },
      { x: 545, y: 545, r: 26, hint: 'A lantern went dark on the grass.' },
      { x: 520, y: 120, r: 18, hint: 'A star winked out.' },
      { x: 270, y: 465, r: 24, hint: 'The basket lid moved.' },
      { x: 385, y: 540, r: 20, hint: 'Something small vanished from the blanket.' },
    ],
  },
];

// Bootstrap: wire the game to the page, pose a screenshot state when the
// URL asks for one (?shot=cover, ?shot=round2, ?shot=victory — see shots.js),
// otherwise show the title screen. The game repaints on a gentle loop so
// hint pulses and wrong-click flashes animate.
import { Game } from './game.js';
import { applyShot } from './shots.js';

const game = new Game(document);
const posed = applyShot(game);
if (!posed) game.showTitle();

function loop() {
  if (game.state === 'play') game.draw();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

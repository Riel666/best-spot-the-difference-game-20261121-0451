// Posed states for the entry's screenshots (shots.json). A ?shot= value puts
// the game into a state a real play session reaches, so the screenshots are
// honest renders of the game itself: same code, same state, only the path
// there is a query instead of clicks.
import { ROUNDS } from './scenes.js';

export function applyShot(game) {
  const shot = new URLSearchParams(window.location.search).get('shot');
  if (!shot) return false;
  if (shot === 'cover') {
    // Round 1 mid-hunt: three differences found (rings on both panels),
    // four still hiding, timer at 2:31, counter reading 3 found / 4 to go.
    game.startRound(0);
    game.found = new Set([0, 1, 2]);
    game.timeLeft = 151;
    game.score = 300;
    game.setMessage('Found it! 4 more hide in this scene.');
    game.updateHud();
    game.draw();
    return true;
  }
  if (shot === 'round2') {
    // Round 2 mid-hunt: two found, five to go, timer at 2:12.
    game.startRound(1);
    game.found = new Set([0, 3]);
    game.timeLeft = 132;
    game.score = 900;
    game.setMessage('Found it! 5 more hide in this scene.');
    game.updateHud();
    game.draw();
    return true;
  }
  if (shot === 'victory') {
    // The celebration after the last round: all three rounds cleared.
    game.score = 2540;
    game.state = 'victory';
    game.roundIndex = ROUNDS.length - 1;
    game.found = new Set(ROUNDS[2].diffs.map((d, i) => i));
    game.timeLeft = 64;
    game.setMessage('All 23 differences found — the lanterns burn for you tonight.');
    game.updateHud();
    game.draw();
    game.victory();
    return true;
  }
  return false;
}

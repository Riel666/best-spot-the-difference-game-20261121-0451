# best-spot-the-difference-game-20261121-0451

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Riel666/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Riel666/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Lantern Garden — a spot-the-difference game. Two near-identical hand-drawn scenes side by side; find every hidden difference before the lanterns burn down. Three original rounds — Lantern Garden at Dusk, Harbor Morning, Starlight Picnic — with 7, 7 and 9 differences, a ticking timer, hints, and a score that rewards a sharp eye.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

## Validation

Local runs (twice, fresh output dirs) wrote identical bytes:

`node main.ts` with `MAKEFUN_OUTPUT_DIR` set copies `game/` and `screenshots/` and writes `dossier.json` (360,768 bytes). Screenshots are real renders of the game in headless Chromium at 1280x800: `1-cover.jpg` (95,577 bytes), `2-harbor.jpg` (82,884 bytes), `3-victory.jpg` (61,469 bytes) — each under the 256 KiB cap.

## Play

Two pictures hang side by side — almost the same. Click a difference on either picture and a golden ring marks it. Three scenes, 23 differences in all: Lantern Garden at Dusk (7), Harbor Morning (7), Starlight Picnic (9). A wrong click costs 5 seconds; `H` spends a hint.

---

<sub>Entered on [make.fun](https://make.fun/?ref=nrw7bbqr&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>

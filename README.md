<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/English-selected-2ea44f?style=for-the-badge" alt="English"></a>
  <a href="README.ko.md"><img src="https://img.shields.io/badge/%ED%95%9C%EA%B5%AD%EC%96%B4-%EC%9D%BD%EA%B8%B0-555?style=for-the-badge" alt="한국어"></a>
</p>

<p align="center">
  <img src="screenshots/ko/card-01.png" width="320" alt="A pixel hamster on a wheel">
</p>

<p align="center">A menu bar app that tells you when to rest your eyes.</p>
<p align="center">You can ignore it. It just counts how many times you did.</p>
<p align="center">3.9MB · 0.43% idle CPU · online only to check for updates · free</p>

---

## Why

Most 20-minute reminder apps lock the screen. Get one at the wrong moment and it gets
uninstalled on the spot.

This one doesn't block anything. Skipping a break is always one click, and instead of
stopping you, it counts how often you skipped — shown on the hamster's cheek and in a
weekly log.

## One break is 40 seconds

| | |
|---|---|
| 20s | The hamster runs two laps around the screen edge. Follow it with your eyes. |
| 10s | Look out a window or at something far away. Moving your eyes inside the screen doesn't change focal distance. |
| 10s | Stretch. |

<p>
  <img src="screenshots/en/card-05.png" width="420" alt="The notification card that appears in a corner">
  <img src="screenshots/en/card-07.png" width="420" alt="The weekly log screen">
</p>

## Install

Get it from the [download page](https://ganggangstone.github.io/hamstretch/).

On macOS, move the app to Applications and right-click → Open. It's unsigned, so a plain
double-click gets blocked, and this is needed once per new version. On Windows (beta),
run the installer; if SmartScreen appears, click "More info → Run anyway".

## Collects nothing

The app goes online once a day, only to check GitHub for a new version tag — nothing
about your usage is ever sent. What you did and when is appended to a single file on
this computer, and that file never leaves it. You can confirm this yourself in Activity
Monitor.

## Decisions made while building it

[DECISIONS.md](DECISIONS.md) records 23 decisions with the alternatives considered.
Two are starred — decisions reversed after measuring instead of guessing (idle CPU cost,
what the weekly goal counts).

This repository holds the landing page, release files, and the decision log — not the
app's source.

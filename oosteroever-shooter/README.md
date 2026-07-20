# Oosteroever Shooter — POC

A **light top-down survival shooter** that plays on a **real-world location**:
the *Oosteroever* (east bank of the harbour) in **Oostende, Belgium**.

The entire arena is a live map. There is no baked-in artwork — every street,
quay, and building you see is real **OpenStreetMap** data, rendered under an
HTML5 canvas where the game runs.

![type: browser game · one file · no build step](https://img.shields.io/badge/POC-single%20file-3ddc84)

---

## How to run

No build, no dependencies to install.

```bash
# from this folder, just open the file in a browser:
xdg-open index.html      # Linux
open index.html          # macOS
start index.html         # Windows
```

Or serve it (recommended, avoids any browser file:// quirks):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000/
```

> **Needs internet** while playing — the map tiles stream from OpenStreetMap.

## Controls

**Desktop**

| Action | Keys |
| --- | --- |
| Move  | `W A S D` or arrow keys |
| Aim   | Mouse |
| Shoot | Left click or `Space` |

**Mobile / touch** (controls appear automatically on touch devices)

| Action | Touch |
| --- | --- |
| Move  | Drag on the **left half** — a virtual joystick appears where you press |
| Aim & shoot | Touch the **right half** — auto-fires toward your finger while held |

Survive the waves. Enemies stream in from the edges of the neighbourhood and
chase you; each kill is +10, contact costs health, and the spawn rate tightens
every wave.

Use the **🗺 / 🛰 button** (top-right) to flip between the OpenStreetMap street
view and Esri satellite imagery of the Oosteroever at any time.

---

## How it works

The trick that makes it feel like a *real place* rather than a background image:

- The map is a [Leaflet](https://leafletjs.com/) view centred on the
  Oosteroever, with panning/zoom **disabled** so the game controls the camera.
- **Every entity has a real latitude/longitude.** Each frame we project those
  coordinates to screen pixels with `map.latLngToContainerPoint(...)`, so
  players, enemies, and bullets stay glued to the world.
- The **player stays at screen centre**; moving pans the map underneath
  (`map.setView`), giving the feeling of walking through the actual streets.
- Motion is computed in intuitive screen-pixel space, then converted back to
  lat/lng (`containerPointToLatLng`) so nothing drifts when the camera moves.

Everything lives in a single `index.html` (inline CSS + JS). Leaflet loads from
a CDN with SRI hashes.

## Change the location

Want to play somewhere else? Edit two constants near the top of the script in
`index.html`:

```js
const START = { lat: 51.23705, lng: 2.93470 }; // Oosteroever, Oostende
const ZOOM  = 17;
```

Drop in any `lat`/`lng` (right-click → "What's here?" on Google Maps, or use
[openstreetmap.org](https://www.openstreetmap.org)) and it just works.

## Tuning

Gameplay knobs are grouped as constants — easy to feel out:

```js
const PLAYER_SPEED = 2.6;   // walk speed (px/frame)
const BULLET_SPEED = 8.5;
const BULLET_LIFE  = 70;    // frames before a shot expires
const PLAYER_R = 11, ENEMY_R = 12, BULLET_R = 3.5;
```

Wave pacing lives in `update()` (`waveTimer` / `cadence`), and enemy speed
scales with the wave number in `spawnEnemy()`.

---

## Already in the POC

- ✅ **Satellite ⇄ street toggle** — live Esri World Imagery vs OpenStreetMap.
- ✅ **Mobile controls** — auto-detected virtual joystick + touch-to-fire.

## Ideas to take it further

- **Real-place objectives**: capture the lighthouse, defend the marina,
  extraction points at real POIs pulled from the OSM Overpass API.
- **Cover & collision** derived from OSM building footprints.
- **Sound, power-ups, ammo, reloads, a minimap.**

## Notes / limitations

- This is a proof of concept: single file, arcade physics, no persistence.
- Map tiles are © OpenStreetMap contributors (attribution shown in-game).
  For anything beyond a POC, respect the
  [OSM tile usage policy](https://operations.osmfoundation.org/policies/tiles/)
  or self-host / use a commercial tile provider.

# ssaillesh.github.io — The Private Residence

Personal portfolio of Saillesh Somasundaram, built as an interactive architectural model:
a converted-warehouse residence at ground level with five rooms around a central core, each one part of the story.

Live: https://ssaillesh.github.io/

| Room | Purpose | What's in it |
| --- | --- | --- |
| 01 Foyer | Introduction | A sealed envelope with a short intro, running shoes |
| 02 Study | Education & awards | Degree on the wall, a lit display cabinet (opens the Cabinet view of every award), résumé on the desk, textbooks, microscope |
| 03 Workshop | Experience | Laptop + security key, sample vials, bag of chips, SQL monitor, lidar sensor, tool chest |
| 04 Vault | Projects | A bank vault signed PROJECTS; unlocking it opens a secure-storage wall of displays, one per GitHub project |
| 05 Lounge | Personal & contact | Scale car, dumbbells, cast-iron pan, bicycle, photographs, rotary phone |

## Stack

React 19 + Vite, Tailwind CSS 4, Framer Motion, Three.js via React Three Fiber and Drei.

## How it is put together

```
src/
  data/            all content (edit these, not components)
    profile.js     name, intro, links, skills
    education.js   degree and honours
    experience.js  workshop stations (from the résumé and previous site)
    projects.js    projects + vaultDisplays (order of the Vault displays)
    awards.js      awards (shown around the Study)
    artifacts.js   every object in the house: what it is, where it is, what it opens
    inspect.js     close-up copy, derived from artifacts.js
    lounge.js      interests and photos
    rooms.js       floor plan: room ids and bounds in metres
  scene/           the 3D residence (lazy-loaded chunk)
    Residence.jsx  canvas and room hit areas (hover lights a room, no floating labels)
    Architecture.jsx  ground, plinth, walls (fade when they block the open room), glazing
    CameraRig.jsx  narrow-lens presentation camera and room transitions
    Lights.jsx     per-room warm lighting that responds to the open room
    rooms/*.jsx    furniture for each room; interactive pieces wrap <Interactive>
  ui/              the interface over the scene
    ResidenceView.jsx  desktop experience (3D + panel + plan mini-map)
    PlanView.jsx       mobile / no-WebGL / "plain view" layout
    RoomContent.jsx    room content, shared by desktop panel and mobile page
    VaultPage.jsx      unlock sequence + the wall of project displays and project files
    CabinetPage.jsx    the Study's award cabinet (3D, scene/cabinet/CabinetScene.jsx)
  legacy/          the previous site, kept intact
```

Routing is hash-based (`#/workshop/symcor`), so deep links work on GitHub Pages.

URL flags: `?plan` forces the mobile/plain layout, `?3d` forces the 3D residence,
`?classic` shows the previous site.

## Develop

```bash
npm install
npm run dev
```

`npm run build` outputs to `dist/`; pushing to `main` deploys via `.github/workflows/deploy-pages.yml`.

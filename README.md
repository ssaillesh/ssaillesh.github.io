# ssaillesh.github.io — The Private Residence

Personal portfolio of Saillesh Somasundaram, built as an interactive architectural model:
a converted-warehouse residence at ground level with six rooms around a central core, plus a garage wing, each one part of the story.

Live: https://ssaillesh.github.io/

| Room | Purpose | What's in it |
| --- | --- | --- |
| 01 Foyer | Introduction | A sealed envelope with a short intro, running shoes |
| 02 Study | Education & awards | Degree on the wall, a lit display cabinet (opens the Cabinet view of every award), résumé on the desk, textbooks, microscope |
| 03 Garage | Experience | East wing with a south roll-up door and driveway: UWAFT autonomous crossover (detailed, src/scene/CrossoverCar.jsx) on a two-post lift + lidar bench, Symcor server rack, OmniaBio test tubes, PepsiCo clipboard and chip pallet, tool chest, training corner (bike, dumbbells), hangout corner (couch, fridge, neon SM) |
| 04 Vault | Projects | A bank vault signed PROJECTS; a 3D unlock opens a hall-of-fame walk: lit glass cases for each project, with Rova framed at the end. Scroll to walk, click a case to look closer; "Open full file" shows the details |
| 05 Den | Theater, games & contact | Theater: big screen over the fireplace, sofa, riser recliners, popcorn cart. Games: PC battlestation, racing sim rig (cars), arcade cabinet (Invasion), drinks cabinet + armchairs. Photographs, rotary phone |
| 06 Dining | Kitchen & dining | Kitchen run, marble island with the cast-iron pan, dining table for six |

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
    rooms.js       floor plan: footprint, room ids and bounds in metres
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

## Images for the Vault

Every project display has an image slot. Put a screenshot in `public/residence/` and set
`image: '/residence/<file>.jpg'` on the project in `src/data/projects.js`; until then a placeholder frame
is shown.

## Develop

```bash
npm install
npm run dev
```

`npm run build` outputs to `dist/`; pushing to `main` deploys via `.github/workflows/deploy-pages.yml`.

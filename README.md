# ssaillesh.github.io — The Private Residence

Personal portfolio of Saillesh Somasundaram, built as an interactive architectural model:
a converted-warehouse penthouse with five rooms, each one part of the story.

Live: https://ssaillesh.github.io/

| Room | Purpose | What's in it |
| --- | --- | --- |
| 01 Foyer | Introduction | Name monolith, résumé folio, links |
| 02 Study | Education | Bookshelves, honours on the wall, desk facing the city |
| 03 Workshop | Experience | One workstation per role (Symcor, OmniaBio, PepsiCo ×2, UWAFT) |
| 04 Gallery | Projects | Exhibits for Rova, LapZero, CodeGraphRAG |
| 05 Lounge | Personal & contact | Interests as objects, photographs, contact |

## Stack

React 19 + Vite, Tailwind CSS 4, Framer Motion, Three.js via React Three Fiber and Drei.

## How it is put together

```
src/
  data/            all content (edit these, not components)
    profile.js     name, intro, links, skills
    education.js   degree and honours
    experience.js  workshop stations (from the résumé and previous site)
    projects.js    gallery exhibits
    lounge.js      interests and photos
    rooms.js       floor plan: room ids and bounds in metres
  scene/           the 3D residence (lazy-loaded chunk)
    Residence.jsx  canvas, room hit areas, floating room labels
    Architecture.jsx  slab, tower, walls (fade when they block the open room), glazing
    CameraRig.jsx  narrow-lens presentation camera and room transitions
    Lights.jsx     per-room warm lighting that responds to the open room
    Skyline.jsx    instanced night city
    rooms/*.jsx    furniture for each room; interactive pieces wrap <Interactive>
  ui/              the interface over the scene
    ResidenceView.jsx  desktop experience (3D + panel + plan mini-map)
    PlanView.jsx       mobile / no-WebGL / "plain view" layout
    RoomContent.jsx    room content, shared by desktop panel and mobile page
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

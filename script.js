const emotions = ["😁", "😡", "😖", "😱", "😥"];
const emotionNames = ["happy", "angry", "disgusted", "fearful", "sad"];
const gridW = 5;
const gridH = 4;
let grid = [];
let stepToggle = false;


function randomEmotions() {
  return emotionNames.reduce((obj, name) => {
    obj[name] = Math.floor(Math.random() * 6);
    return obj;
  }, {});
}


function createGrid() {
  grid = [];
  for (let y = 0; y < gridH; y++) {
    const row = [];
    for (let x = 0; x < gridW; x++) {
      row.push({
        state: randomEmotions(),
        about: { top: null, right: null, bottom: null, left: null }
      });
    }
    grid.push(row);
  }
}


function getDominantEmotion(state) {
  return emotionNames.reduce((max, name) =>
    state[name] > state[max] ? name : max, emotionNames[0]);
}


function renderGrid() {
  const el = document.getElementById("grid");
  el.innerHTML = "";
  for (let y = 0; y < gridH; y++) {
    for (let x = 0; x < gridW; x++) {
      const person = grid[y][x];
      const domEmo = getDominantEmotion(person.state);
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.innerHTML = `
        <div class="top">${person.about.top ? emotions[emotionNames.indexOf(person.about.top)] : ""}</div>
        <div class="right">${person.about.right ? emotions[emotionNames.indexOf(person.about.right)] : ""}</div>
        <div class="bottom">${person.about.bottom ? emotions[emotionNames.indexOf(person.about.bottom)] : ""}</div>
        <div class="left">${person.about.left ? emotions[emotionNames.indexOf(person.about.left)] : ""}</div>
        <div class="center">${emotions[emotionNames.indexOf(domEmo)]}</div>
      `;
      el.appendChild(cell);
    }
  }
}


function updateAboutYou() {
  for (let y = 0; y < gridH; y++) {
    for (let x = 0; x < gridW; x++) {
      const person = grid[y][x];
      const myDom = getDominantEmotion(person.state);
      const neighbors = [
        { dx: 0, dy: -1, key: "top", theirKey: "bottom" },
        { dx: 1, dy: 0, key: "right", theirKey: "left" },
        { dx: 0, dy: 1, key: "bottom", theirKey: "top" },
        { dx: -1, dy: 0, key: "left", theirKey: "right" },
      ];
      for (const { dx, dy, key, theirKey } of neighbors) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < gridW && ny < gridH) {
          const neighbor = grid[ny][nx];
          const theirDom = getDominantEmotion(neighbor.state);
          neighbor.about[theirKey] = (theirDom === myDom) ? "happy" : "angry";
        }
      }
    }
  }
}


function applyInfluence() {
  for (let y = 0; y < gridH; y++) {
    for (let x = 0; x < gridW; x++) {
      const person = grid[y][x];
      const influences = ["top", "right", "bottom", "left"];
      const angerCount = influences.filter(dir => person.about[dir] === "angry").length;
      if (angerCount >= 2) {
        const options = influences
          .map(dir => {
            const nx = x + (dir === "right" ? 1 : dir === "left" ? -1 : 0);
            const ny = y + (dir === "bottom" ? 1 : dir === "top" ? -1 : 0);
            if (nx >= 0 && ny >= 0 && nx < gridW && ny < gridH) {
              return getDominantEmotion(grid[ny][nx].state);
            }
            return null;
          })
          .filter(Boolean);
        if (options.length) {
          const chosen = options[Math.floor(Math.random() * options.length)];
          emotionNames.forEach(e => person.state[e] = (e === chosen ? 5 : 0));
        }
      }
      person.about = { top: null, right: null, bottom: null, left: null };
    }
  }
}


function nextAB() {
  if (!stepToggle) updateAboutYou();
  else applyInfluence();
  stepToggle = !stepToggle;
  renderGrid();
}


function next20() {
  for (let i = 0; i < 20; i++) {
    updateAboutYou();
    applyInfluence();
  }
  renderGrid();
}


function resetGrid() {
  createGrid();
  stepToggle = false;
  renderGrid();
}


// Initialize the grid when the page loads
document.addEventListener('DOMContentLoaded', () => {
  createGrid();
  renderGrid();
});

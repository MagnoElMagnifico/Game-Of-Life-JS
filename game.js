////// Configuration //////
const px        = 800;
let size        = 20;
let update_time = 100;
let render_grid = true;
let update      = false;
let moore       = true;

////// Action buttons //////
let button;
let clear;

////// Game state //////
let cells;

////// SET UP GAME //////
function setup() {
  createCanvas(px, px).parent("game");
  frameRate(30);

  cells = Array(pow(px/size, 2)).fill(false);

  // Set up buttons
  button = createButton("Play").parent("buttons");
  button.mousePressed(() => { // Switch update, button text and clear visibility
    update = !update;
    if (update) {
      button.html("Edit");
      clear.attribute("style", "display: none");
    }
    else {
      button.html("Play");
      clear.removeAttribute("style");
    }
  });

  clear = createButton("Clear").parent("buttons");
  clear.mousePressed(() => { cells.fill(false); });
}

////// EVENTS //////
function mouseReleased() {
  if (!update && mouseX >= 0 && mouseY >= 0 && mouseX <= px && mouseY <= px) {
    const x = Math.trunc(mouseX / size);
    const y = Math.trunc(mouseY / size);
    const i = y * (px/size) + x;
    cells[i] = !cells[i];
  }
}

////// RENDER & UPDATE /////
function countNeighbors(i, c) {
  if (i >= c.length || i < 0) { console.error("Invalid param"); return undefined; }

  //   Moore   // Von Neumann
  //  1  2  3  //  -  2  -
  //  4  i  5  //  4  i  5
  //  6  7  8  //  -  7  -
  let n = 0;
  const l = int(px / size);
  if (c[i - 1 - l] && c[i - 1 - l] != undefined && moore) n++; // 1
  if (c[i     - l] && c[i     - l] != undefined)          n++; // 2
  if (c[i + 1 - l] && c[i + 1 - i] != undefined && moore) n++; // 3
  if (c[i - 1]     && c[i - 1] != undefined) n++; // 4
  if (c[i + 1]     && c[i + 1] != undefined) n++; // 5
  if (c[i - 1 + l] && c[i - 1 + l] != undefined && moore) n++; // 6
  if (c[i     + l] && c[i     + l] != undefined)          n++; // 7
  if (c[i + 1 + l] && c[i + 1 + l] != undefined && moore) n++; // 8
  return n;
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function draw() {
  background(100);

  ////// GRID //////
  if (render_grid) {
    stroke(90);
    strokeWeight(1);

    for (let x = 0; x < px; x += size) line(0, x, px, x);
    for (let y = 0; y < px; y += size) line(y, 0, y, px);
  }

  ////// CELLS //////
  ////// Render cells //////
  fill(0);
  noStroke();
  for (let i = 0; i < cells.length; i++) {
    if (cells[i]) {
      const l = px / size;
      const x = i % l * size;
      const y = int(i / l) * size;
      square(x, y, size);
    }
  }

  ////// Update cells //////
  if (update) {

    let new_cells = Array(pow(px/size, 2)).fill(false);

    for (let i = 0; i < new_cells.length; i++) {
      const n = countNeighbors(i, cells);

      // Birth rule
      if (!cells[i] && n == 3)
        new_cells[i] = true;

      // Death rule
      else if (cells[i] && (n == 0 || n == 1 || n >= 4))
        new_cells[i] = false;

      // Survival rule
      else if (cells[i] && (n == 2 || n == 3))
        new_cells[i] = true;
    }

    cells = new_cells;

    sleep(update_time);
  }
}

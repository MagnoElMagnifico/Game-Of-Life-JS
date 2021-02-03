////// Configuration //////
let w      = 600;
let ncells = 20;
let wcell  = w / ncells;

let update_time = 100;
let render_grid = true;
let moore       = true;

////// Action buttons //////
let button;
let clear;

////// Game state //////
let cells;
let update = false;

////// SET UP GAME //////
function setup() {
  createCanvas(w, w).parent("game").id("game-canvas");
  frameRate(30);

  cells = new Array(ncells); // cols or y
  for (let i = 0; i < ncells; i++)
    cells[i] = new Array(ncells).fill(false); // rows or x

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
  clear.mousePressed(() => {
    for (let y = 0; y < ncells; y++)
    for (let x = 0; x < ncells; x++)
      cells[y][x] = false;
   });
}

////// EVENTS //////
function mouseReleased() {
  if (!update && mouseX >= 0 && mouseY >= 0 && mouseX <= w && mouseY <= w) {
    const x = int(mouseX / wcell);
    const y = int(mouseY / wcell);
    cells[y][x] = !cells[y][x];
  }
}

////// RENDER & UPDATE /////
function draw() {
  background(100);

  ////// GRID //////
  if (render_grid) {
    stroke(90);
    strokeWeight(1);

    for (let x = 0; x < w; x += wcell) line(0, x, w, x);
    for (let y = 0; y < w; y += wcell) line(y, 0, y, w);
  }

  ////// RENDER CELLS //////
  fill(0);
  noStroke();
  for (let y = 0; y < ncells; y++)
  for (let x = 0; x < ncells; x++)
    if (cells[y][x])
      square(x*wcell, y*wcell, wcell);

  ////// UPDATE CELLS //////
  if (update) {

    let new_cells = new Array(ncells); // cols or y
    for (let i = 0; i < ncells; i++)
      new_cells[i] = new Array(ncells).fill(false); // rows or x

    for (let y = 0; y < ncells; y++)
    for (let x = 0; x < ncells; x++) {

      ////// Count neighbors //////
      let n = 0; // Number of neighbors

      //   Moore   // Von Neumann
      //  1  2  3  //  -  2  -
      //  4  i  5  //  4  i  5
      //  6  7  8  //  -  7  -

      if (cells[y-1] != undefined && cells[y-1][x-1] != undefined && cells[y-1][x-1] && moore) n++; // 1
      if (cells[y-1] != undefined && cells[y-1][x])                                            n++; // 2
      if (cells[y-1] != undefined && cells[y-1][x+1] != undefined && cells[y-1][x+1] && moore) n++; // 3

      if (cells[y][x-1] != undefined && cells[y][x-1]) n++; // 4
      if (cells[y][x+1] != undefined && cells[y][x+1]) n++; // 5

      if (cells[y+1] != undefined && cells[y+1][x-1] != undefined && cells[y+1][x-1] && moore) n++; // 6
      if (cells[y+1] != undefined && cells[y+1][x])                                            n++; // 7
      if (cells[y+1] != undefined && cells[y+1][x+1] != undefined && cells[y+1][x+1] && moore) n++; // 8

      ////// Apply game rules //////
      // Birth rule
      if (!cells[y][x] && n == 3)
        new_cells[y][x] = true;

      // Death rule
      else if (cells[y][x] && (n == 0 || n == 1 || n >= 4))
        new_cells[y][x] = false;

      // Survival rule
      else if (cells[y][x] && (n == 2 || n == 3))
        new_cells[y][x] = true;
    }

    cells = new_cells;

    ////// WAIT /////
    const init = Date.now(); let current;
    do { current = Date.now(); } while (current - init < update_time);

  }
}

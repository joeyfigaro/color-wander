// Biscuits
// Roni Kaufman, January 2022
// https://openprocessing.org/sketch/1461298

let palette = ['#0863d3', '#f5d216', '#f43809', '#08b233', '#9913bf', 140]

/** OPC START **/
OPC.slider('seed', Math.floor(Math.random() * 1000), 0, 1000, 1)
OPC.slider('grid_size', 24, 18, 30, 6)
OPC.slider(
  'highlight_color',
  Math.floor(Math.random() * palette.length),
  0,
  palette.length - 1,
  1,
)
OPC.slider('style', 0, 0, 2, 1)
/** OPC END**/

function setup() {
  createCanvas(windowWidth, windowHeight)
  pixelDensity(2)
  frameRate(5)
  noFill()
}

function draw() {
  translate(width / 2, height / 2)

  size = min(width, height) * 0.8
  eps = size / 600
  u = size / grid_size
  strokeWeight(u / 4)
  idCount = 0
  arcs = []

  let backCol = 15,
    strokeCol = 240
  let highlightCol = palette[highlight_color]
  if (style == 1)
    [backCol, strokeCol, highlightCol] = [highlightCol, backCol, strokeCol]
  else if (style == 2)
    [backCol, strokeCol, hightlightCol] = [strokeCol, backCol, highlightCol]

  background(backCol)
  randomSeed(seed)
  if (random() < 1 / 2) rotate(PI)

  let divPossibilities = [1]
  let divisors = []
  for (let i = 2; i < grid_size; i++) {
    if (grid_size / i == floor(grid_size / i)) divisors.push(i)
  }
  while (divPossibilities.length == 1) {
    for (let d of divisors) {
      if (random() < 1 / 2) divPossibilities.push(d)
    }
  }

  let y = -size / 2,
    s
  while (y < size / 2 - eps) {
    do {
      s = random(divPossibilities) * u
    } while (y + s > size / 2 + eps)
    for (let x = -size / 2; x < size / 2 - eps; x += s) {
      makeTile(x, y, s)
    }
    y += s
  }

  for (let x = -size / 2; x < size / 2 - u / 2; x += 2 * u) {
    addArc(x + u, -size / 2, u, PI, PI * 2)
    addArc(x + u, size / 2, u, 0, PI)
  }
  for (let y = -size / 2; y < size / 2 - u / 2; y += 2 * u) {
    addArc(-size / 2, y + u, u, PI / 2, (3 * PI) / 2)
    addArc(size / 2, y + u, u, (3 * PI) / 2, (5 * PI) / 2)
  }

  let ids = new Array(arcs.length).fill(0)
  stroke(strokeCol)
  for (let a of arcs) {
    ids[a.id]++
  }

  let idMax = ids.indexOf(max([...ids]))
  for (let a of arcs) {
    if (a.id == idMax) {
      stroke(highlightCol)
    } else {
      stroke(strokeCol)
    }
    arc(a.x, a.y, a.d, a.d, a.theta1, a.theta2)
  }
}

function makeTile(x, y, s) {
  let dMin, dMax
  switch (s) {
    case u:
      dMin = 0
      dMax = 1
      break
    case 2 * u:
      dMin = 1
      dMax = 2
      break
    case 3 * u:
      dMin = 2
      dMax = 3
      break
    case 4 * u:
      dMin = 2
      dMax = 4
      break
    case 5 * u:
      dMin = 3
      dMax = 6
      break
    case 6 * u:
      dMin = 3
      dMax = 8
      break
    case 8 * u:
      dMin = 5
      dMax = 10
      break
    case 9 * u:
      dMin = 5
      dMax = 12
      break
    case 10 * u:
      dMin = 6
      dMax = 13
      break
    case 12 * u:
      dMin = 7
      dMax = 16
      break
    case 15 * u:
      dMin = 9
      dMax = 20
  }
  let d1 = floor(random(dMin, dMax + 1))
  let d2 = round((2 * s) / u) - d1 - 1
  for (let i = 1; i <= d1; i++) {
    addArc(x, y, i * u, 0, PI / 2)
    addArc(x + s, y + s, i * u, PI, (3 * PI) / 2)
  }
  for (let i = 1; i <= d2; i++) {
    addArc(x + s, y, i * u, PI / 2, PI)
    addArc(x, y + s, i * u, (3 * PI) / 2, 2 * PI)
  }
}

function addArc(x, y, d, theta1, theta2) {
  let id = -1
  let x1 = x + (d / 2) * cos(theta1)
  let y1 = y + (d / 2) * sin(theta1)
  let x2 = x + (d / 2) * cos(theta2)
  let y2 = y + (d / 2) * sin(theta2)
  let matches = []
  for (let a of arcs) {
    let a_x1 = a.x + (a.d / 2) * cos(a.theta1)
    let a_y1 = a.y + (a.d / 2) * sin(a.theta1)
    let a_x2 = a.x + (a.d / 2) * cos(a.theta2)
    let a_y2 = a.y + (a.d / 2) * sin(a.theta2)
    if (
      (abs(x1 - a_x1) < eps && abs(y1 - a_y1) < eps) ||
      (abs(x1 - a_x2) < eps && abs(y1 - a_y2) < eps) ||
      (abs(x2 - a_x1) < eps && abs(y2 - a_y1) < eps) ||
      (abs(x2 - a_x2) < eps && abs(y2 - a_y2) < eps)
    ) {
      matches.push(a.id)
    }
  }
  if (matches.length > 0) {
    id = matches[0]
    if (matches.length == 2) {
      for (let a of arcs) {
        if (a.id == matches[1]) a.id = matches[0]
      }
    }
  } else {
    id = idCount++
  }
  arcs.push({
    x: x,
    y: y,
    d: d,
    theta1: theta1,
    theta2: theta2,
    id: id,
  })
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
}

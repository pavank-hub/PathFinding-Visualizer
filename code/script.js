const grid = document.getElementById("grid");
const rows = 20;
const cols = 30;

let startNode = null;
let endNode = null;
let mode = "wall";
let speed = 40;

const cells = [];

/* ---------------- GRID CREATION ---------------- */

for (let r = 0; r < rows; r++) {
    cells[r] = [];
    for (let c = 0; c < cols; c++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = r;
        cell.dataset.col = c;

        cell.addEventListener("click", () => handleClick(r, c));

        grid.appendChild(cell);
        cells[r][c] = cell;
    }
}

/* ---------------- BUTTON EVENTS ---------------- */

document.getElementById("startBtn").onclick = () => mode = "start";
document.getElementById("endBtn").onclick = () => mode = "end";
document.getElementById("wallBtn").onclick = () => mode = "wall";
document.getElementById("clearBtn").onclick = clearGrid;
document.getElementById("bfsBtn").addEventListener("click", bfs);

document.getElementById("speedRange").addEventListener("input", (e) => {
    speed = 105 - e.target.value;
});

/* ---------------- CELL CLICK HANDLER ---------------- */

function handleClick(r, c) {
    const cell = cells[r][c];

    if (mode === "start") {
        if (startNode) startNode.classList.remove("start");
        startNode = cell;
        cell.classList.remove("wall");
        cell.classList.add("start");
    }

    else if (mode === "end") {
        if (endNode) endNode.classList.remove("end");
        endNode = cell;
        cell.classList.remove("wall");
        cell.classList.add("end");
    }

    else {
        if (!cell.classList.contains("start") &&
            !cell.classList.contains("end")) {
            cell.classList.toggle("wall");
        }
    }
}

/* ---------------- BFS ALGORITHM ---------------- */

async function bfs() {

    if (!startNode || !endNode) {
        alert("Set Start and End nodes!");
        return;
    }

    clearVisited();

    const queue = [];
    const visited = new Set();
    const parent = new Map();

    const start = getPos(startNode);
    const end = getPos(endNode);

    queue.push(start);
    visited.add(key(start));

    while (queue.length > 0) {

        const current = queue.shift();

        if (current.row === end.row && current.col === end.col) {
            await drawPath(parent, end);
            return;
        }

        for (let [dr, dc] of directions()) {

            const nr = current.row + dr;
            const nc = current.col + dc;

            const nextKey = key({ row: nr, col: nc });

            if (isValid(nr, nc) && !visited.has(nextKey)) {

                visited.add(nextKey);
                parent.set(nextKey, current);
                queue.push({ row: nr, col: nc });

                await animateVisit(nr, nc);
            }
        }
    }

    alert("No Path Found!");
}

/* ---------------- HELPERS ---------------- */

function directions() {
    return [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1]
    ];
}

function isValid(r, c) {
    return r >= 0 &&
           r < rows &&
           c >= 0 &&
           c < cols &&
           !cells[r][c].classList.contains("wall");
}

function key(pos) {
    return pos.row + "-" + pos.col;
}

function getPos(cell) {
    return {
        row: parseInt(cell.dataset.row),
        col: parseInt(cell.dataset.col)
    };
}

function animateVisit(r, c) {
    return new Promise(resolve => {

        const cell = cells[r][c];

        if (!cell.classList.contains("start") &&
            !cell.classList.contains("end")) {
            cell.classList.add("visited");
        }

        setTimeout(resolve, speed);
    });
}

async function drawPath(parent, end) {

    let current = end;

    while (parent.has(key(current))) {

        current = parent.get(key(current));
        const cell = cells[current.row][current.col];

        if (!cell.classList.contains("start")) {
            cell.classList.add("path");
        }

        await new Promise(resolve => setTimeout(resolve, speed));
    }
}

function clearVisited() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            cells[r][c].classList.remove("visited");
            cells[r][c].classList.remove("path");
        }
    }
}

function clearGrid() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            cells[r][c].className = "cell";
        }
    }
    startNode = null;
    endNode = null;
}

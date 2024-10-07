import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const GRID_SIZE = 20;

function App() {

const [grid, setGrid] = useState(
  Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0))
);
const [start, setStart] = useState(null);
const [end, setEnd] = useState(null);
const [path, setPath] = useState([]);
const [placingObstacles, setPlacingObstacles] = useState(false);

// Handle click event for placing start, end, or obstacle
const handleClick = (x, y) => {
  if (placingObstacles) {
    const newGrid = [...grid];
    newGrid[x][y] = grid[x][y] === 1 ? 0 : 1; // Toggle obstacle
    setGrid(newGrid);
  } else if (!start) {
    setStart([x, y]);
  } else if (!end) {
    setEnd([x, y]);
  }
};

// Handle the "Find Path" button
const handleFindPath = async () => {
  if (start && end) {
    const response = await axios.post("http://localhost:5000/find-path", {
      grid,
      start,
      end,
    });
    setPath(response.data.path);
  }
};

// Handle the "Reset" button
const handleReset = () => {
  setGrid(Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0)));
  setStart(null);
  setEnd(null);
  setPath([]);
};

// Check if a cell is part of the calculated path
const isPath = (x, y) => path.some(([px, py]) => px === x && py === y);

return (
  <div className="App">
    <h1>Grid Pathfinder with DFS</h1>
    <div className="controls">
      <button onClick={() => setPlacingObstacles(!placingObstacles)}>
        {placingObstacles ? "Stop Placing Obstacles" : "Place Obstacles"}
      </button>
      <button onClick={handleFindPath} disabled={!start || !end}>
        Find Path
      </button>
      <button onClick={handleReset}>Reset</button>
    </div>

    <div className="grid">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isStart =
            start && start[0] === rowIndex && start[1] === colIndex;
          const isEnd = end && end[0] === rowIndex && end[1] === colIndex;
          const isObstacle = grid[rowIndex][colIndex] === 1;
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`cell ${isStart ? "start" : ""} ${
                isEnd ? "end" : ""
              } ${isPath(rowIndex, colIndex) ? "path" : ""} ${
                isObstacle ? "obstacle" : ""
              }`}
              onClick={() => handleClick(rowIndex, colIndex)}
            ></div>
          );
        })
      )}
    </div>
  </div>
);
}
export default App;

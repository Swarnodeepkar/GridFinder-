
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Function to find path using DFS
const dfs = (grid, start, end) => {
  const [startX, startY] = start;
  const [endX, endY] = end;
  const path = [];
  const visited = Array.from({ length: 20 }, () => Array(20).fill(false));

  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1], // up, down, left, right
  ];

  const isValid = (x, y) => {
    return (
      x >= 0 &&
      x < 20 &&
      y >= 0 &&
      y < 20 &&
      !visited[x][y] &&
      grid[x][y] !== 1 // 1 represents an obstacle
    );
  };

  const dfsRecursive = (x, y) => {
    if (x === endX && y === endY) {
      path.push([x, y]);
      return true;
    }

    visited[x][y] = true;
    path.push([x, y]);

    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;

      if (isValid(newX, newY)) {
        if (dfsRecursive(newX, newY)) {
          return true;
        }
      }
    }

    path.pop(); // backtrack if no valid path
    return false;
  };

  if (dfsRecursive(startX, startY)) {
    return path;
  } else {
    return [];
  }
};

// API endpoint to find the path
app.post('/find-path', (req, res) => {
  const { grid, start, end } = req.body;

  const path = dfs(grid, start, end);
  res.json({ path });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

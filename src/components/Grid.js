import React, { useState, useEffect } from "react";
import "./Grid.css";

const Grid = () => {
  const [data, setData] = useState("");
  const [grid, setGrid] = useState([]);
  const columns = 10;
  const rows = 20;

  const createGrid = () => {
    for (let r = 0; r < rows; r++) {
      grid[r] = [];
      for (let c = 0; c < columns; c++) {
        let id = `[${c}][${r}]`;
        grid[r][c] = id;
      }
    }
    return grid;
  };

  useEffect(() => {
    setData("This is a Grid!");
    setGrid(createGrid());
    console.log(grid);
  });

  return (
    <div>
      <div id="body">
        <div id="wrapper">
          <div id="centered">
            <div id="container">
              {grid.map(g => g.map(c => (
                <div id={c}></div>
              )))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grid;

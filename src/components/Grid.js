import React, { useState } from "react";
import "./Grid.css";
import Cell from "./Cell";
import Tetrominos from "./Tetrominos";
import IntervalHook from "./IntervalHook";

const Grid = () => {
  const columns = 10;
  const rows = 20;
  const random = () => {
    const tetrominos = Tetrominos();
    return tetrominos[Math.floor(Math.random() * tetrominos.length)];
  };
  const initial = random();
  const [grid, setGrid] = useState([]);
  const [active, setActive] = useState(initial);
  const [frozen, setFrozen] = useState([]);

  const [speed, setSpeed] = useState(1001);

  IntervalHook(() => {
    startGame();
  }, speed);

  IntervalHook(() => {
    if (speed > 100) {
      setSpeed(speed / 2);
    }
  }, 1000);

  const getColor = (r, c) => {
    const isActive = active.shape.some(s => (s.row === r) & (s.col === c));
    const isFrozen = frozen.filter(f =>
      f.shape.some(s => (s.row === r) & (s.col === c))
    );
    if (isActive) return active.color;
    if (isFrozen.length > 0) return isFrozen[0].color;
    return "#282c34";
  };

  const squareFrozen = (row, col) => {
    const isFloor = active.shape.some(r => r.row === 19);
    const isFrozen = frozen.some(f =>
      f.shape.some(s => (s.row === row) & (s.col === col))
    );
    const isCeiling = isFrozen && active.shape.some(r => r.row === 1);
    if (isCeiling) {
      setSpeed(999999999);
    }
    return isFloor || isFrozen;
  };

  const shapeFrozen = () => {
    return active.shape.some(s => squareFrozen(s.row + 1, s.col));
  };

  const updateGrid = () => {
    const isFrozen = shapeFrozen();
    if (isFrozen) setFrozen([...frozen, active]);
    let updated = isFrozen ? random() : active;
    updated.shape.map(s => (s.row += 1));
    setActive(updated);
  };

  const startGame = () => {
    drawGrid(active);
    updateGrid();
  };

  const drawGrid = () => {
    let g = [];
    for (let r = 0; r < rows; r++) {
      g[r] = [];
      for (let c = 0; c < columns; c++) {
        let id = `[${r}][${c}]`;
        g[r][c] = {
          id: id,
          column: c,
          row: r,
          color: getColor(r, c)
        };
      }
    }
    setGrid(g);
  };

  return (
    <div>
      <div id="body">
        <div id="wrapper">
          <div id="centered">
            <div id="container">
              {grid.map(g =>
                g.map(c => (
                  <Cell key={c.id} row={c.row} column={c.col} color={c.color} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grid;

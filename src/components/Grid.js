import React, { useState, useEffect } from "react";
import "./Grid.css";
import Cell from "./Cell";
import Tetrominos from "./Tetrominos";
import IntervalHook from "./IntervalHook";

const Grid = () => {
  const clone = require("rfdc")(); // Returns the deep copy function
  const left_key = 37;
  const right_key = 39;
  const up_key = 38;
  const down_key = 40;
  const esc_key = 27;
  const enter_key = 13;
  const columns = 10;
  const rows = 20;
  const default_speed = 1001;
  const randomShape = () => {
    const tetrominos = Tetrominos();
    return tetrominos[Math.floor(Math.random() * tetrominos.length)];
  };
  const initial_shape = randomShape();
  const [grid, setGrid] = useState([]);
  const [current, setCurrent] = useState(initial_shape);
  const [frozen, setFrozen] = useState([]);
  const [speed, setSpeed] = useState(default_speed);

  IntervalHook(() => {
    updateGame();
  }, speed);

  IntervalHook(() => {
    if (speed > 100) {
      setSpeed(speed / 1.5);
    }
  }, default_speed);

  const shiftColumns = dir => {
    if (isEdge(dir)) return;
    const updated = clone(current);
    updated.shape.map(s => (s.col += dir));
    return updated;
  };

  const getColor = (r, c) => {
    const isActive = current.shape.some(s => (s.row === r) & (s.col === c));
    const isFrozen = frozen.filter(f =>
      f.shape.some(s => (s.row === r) & (s.col === c))
    );
    if (isActive) return current.color;
    if (isFrozen.length > 0) return isFrozen[0].color;
    return "#282c34";
  };

  const checkSquareFrozen = (row, col) => {
    const isFloor = current.shape.some(r => r.row === 19);
    const isFrozen = frozen.some(f =>
      f.shape.some(s => (s.row === row) & (s.col === col))
    );
    const isCeiling = isFrozen && current.shape.some(r => r.row === 1);
    if (isCeiling) {
      setSpeed(null);
    }
    return isFloor || isFrozen;
  };

  const checkFrozen = () => {
    return current.shape.some(s => checkSquareFrozen(s.row + 1, s.col));
  };

  const updateCurrentShape = () => {
    const isFrozen = checkFrozen();
    if (isFrozen) setFrozen([...frozen, current]);
    let updated = isFrozen ? randomShape() : clone(current);
    updated.shape.map(s => (s.row += 1));
    setCurrent(updated);
  };

  const updateGame = () => {
    updateGrid();
    updateCurrentShape();
  };

  const updateGrid = () => {
    let grid = [];
    for (let r = 0; r < rows; r++) {
      grid[r] = [];
      for (let c = 0; c < columns; c++) {
        let id = `[${r}][${c}]`;
        grid[r][c] = {
          id: id,
          column: c,
          row: r,
          color: getColor(r, c)
        };
      }
    }
    setGrid(grid);
  };

  const isEdge = dir => {
    return current.shape.some(
      s => s.col + dir < 0 || s.col + dir > columns - 1
    );
  };

  useEffect(() => {
    const handler = event => {
      switch (event.keyCode) {
        case left_key:
          setCurrent(shiftColumns(-1));
          break;
        case right_key:
          setCurrent(shiftColumns(1));
          break;
        case up_key:
          //rotate();
          break;
        case esc_key:
          setSpeed(null);
          break;
        case enter_key:
          //setGameSpeed(currentSpeed);
          break;
        case down_key:
          //dropShapeFast();
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handler);
    const cleanup = () => {
      window.removeEventListener("keydown", handler);
    };
    return cleanup;
  });

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

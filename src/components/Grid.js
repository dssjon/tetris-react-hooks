import React, { useState, useEffect } from "react";
import "./Grid.css";
import Cell from "./Cell";
import Tetrominos from "./Tetrominos";
import IntervalHook from "./IntervalHook";

const Grid = () => {
  const clone = require("rfdc")();
  const left_key = 37;
  const right_key = 39;
  const up_key = 38;
  const down_key = 40;
  const esc_key = 27;
  const enter_key = 13;
  const columns = 10;
  const rows = 20;
  const default_speed = 1000;
  const drop_speed = 5;
  const randomShape = () => {
    const tetrominos = Tetrominos();
    return tetrominos[Math.floor(Math.random() * tetrominos.length)];
  };
  const [grid, setGrid] = useState([]);
  const [current, setCurrent] = useState(randomShape());
  const [frozen, setFrozen] = useState([]);
  const [speed, setSpeed] = useState(default_speed);
  const [dropInProgress, setDropInProgress] = useState(false);
  const [preDropSpeed, setPreDropSpeed] = useState(default_speed)

  IntervalHook(() => {
    updateGame();
  }, speed);

  IntervalHook(() => {
    if (speed > 100) {
      setSpeed(speed / 1.1);
    }
  }, default_speed);

  const shiftColumns = dir => {
    if (isEdge(dir)) {
      return;
    }
    const updated = clone(current);
    updated.shape.map(s => (s.col += dir));
    setCurrent(updated);
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

  const Collided = (row, col) => {
    const floor = current.shape.some(r => r.row === rows - 1);
    const adjacent = frozen.some(f =>
      f.shape.some(s => (s.row === row) & (s.col === col))
    );
    const ceiling = adjacent && current.shape.some(r => r.row === 1);
    if (ceiling) {
      setSpeed(null);
    }
    return floor || adjacent;
  };

  const Collision = () => {
    return current.shape.some(s => Collided(s.row + 1, s.col));
  };

  const updateCurrentShape = () => {
    const updated = getNextShape();
    updated.shape.map(s => (s.row += 1));
    setCurrent(updated);
  };

  const getNextShape = () => {
    if (Collision()) {
      setFrozen([...frozen, current]);
      resetSpeed();
      return randomShape();
    } else {
      return clone(current);
    }
  };

  const updateGame = () => {
    updateCurrentShape();
    updateGrid();
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

  const rotate = () => {
    [0, 2, 3].forEach(n => {
      // Destructure back into current shape excluding pivot vector [1]
      [current.shape[n].row, current.shape[n].col] = rotateVector(current, n);
    });
  };

  const rotateVector = (matrix, idx) => {
    // Adapted from the math explained here: https://www.youtube.com/watch?v=Atlr5vvdchY

    // Encode vector operation as a rotation of PI/2 (90 degrees)
    const R1 = [0, -1];
    const R2 = [1, 0];

    // Get individual square to rotate, i.e. the x/y or row/col coordinates
    const vector = matrix.shape[idx];

    // Get origin to pivot around which is always the second element (arr[1])
    const pivot = matrix.shape[1];

    // Get difference between pivot and vector
    let delta = { row: null, col: null };
    delta.row = vector.row - pivot.row;
    delta.col = vector.col - pivot.col;

    // Apply operation R against delta for matrix transformation
    let transform = { row: null, col: null };
    transform.row = R1[0] * delta.row + R1[1] * delta.col;
    transform.col = R2[0] * delta.row + R2[1] * delta.col;

    // Return new position by summing pivot & transform vectors
    return [pivot.row + transform.row, pivot.col + transform.col];
  };
  const resetSpeed = () => {
    if (dropInProgress) {
      setDropInProgress(false);
      setSpeed(preDropSpeed);
    }
  };

  const dropShapeFast = () => {
    setDropInProgress(true);
    setPreDropSpeed(speed)
    setSpeed(drop_speed);
  };

  useEffect(() => {
    const handler = event => {
      switch (event.keyCode) {
        case left_key:
          shiftColumns(-1);
          break;
        case right_key:
          shiftColumns(1);
          break;
        case up_key:
          rotate();
          break;
        case esc_key:
          setSpeed(null);
          break;
        case enter_key:
          //setGameSpeed(currentSpeed);
          break;
        case down_key:
          dropShapeFast();
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

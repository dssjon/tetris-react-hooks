import React, { useState, useEffect } from 'react'
import './Grid.css'
import Cell from './Cell'
import Tetrominos from './Tetrominos'
import IntervalHook from './IntervalHook'
import Key from './Key'
import Default from './Default'

const Grid = () => {
  const clone = require('rfdc')()

  const randomShape = () => {
    const tetrominos = Tetrominos()
    return tetrominos[Math.floor(Math.random() * tetrominos.length)]
  }
  const [grid, setGrid] = useState([])
  const [current, setCurrent] = useState(randomShape())
  const [frozen, setFrozen] = useState([])
  const [currentSpeed, setSpeed] = useState(Default.speed)
  const [dropInProgress, setDropInProgress] = useState(false)
  const [preDropSpeed, setPreDropSpeed] = useState(Default.speed)

  IntervalHook(() => {
    updateGame()
  }, currentSpeed)

  IntervalHook(() => {
    if (currentSpeed > 100) {
      setSpeed(currentSpeed / 1.05)
    }
  }, Default.speed)

  const shiftColumns = (dir) => {
    if (isEdge(dir)) {
      return
    }
    const updated = clone(current)
    updated.shape.map((s) => (s.col += dir))
    setCurrent(updated)
  }

  const getColor = (r, c) => {
    const isActive = current.shape.some((s) => (s.row === r) & (s.col === c))
    const isFrozen = frozen.filter((f) =>
      f.shape.some((s) => (s.row === r) & (s.col === c))
    )
    if (isActive) return current.color
    if (isFrozen.length > 0) return isFrozen[0].color
    return Default.default_color
  }

  const endGame = () => {
    setSpeed(null)
  }

  const colliding = (row, col) => {
    if (isAdjacent(row, col) && isCeiling()) {
      endGame()
    }
    return isFloor() || isAdjacent(row, col)
  }

  const isCeiling = () => {
    return current.shape.some((r) => r.row === 1)
  }

  const isAdjacent = (row, col) => {
    return frozen.some((f) =>
      f.shape.some((s) => (s.row === row) & (s.col === col))
    )
  }
  const isFloor = () => {
    return current.shape.some((r) => r.row === Default.rows - 1)
  }

  const collided = () => {
    return current.shape.some((s) => colliding(s.row + 1, s.col))
  }

  const updateCurrentShape = () => {
    const updated = getNextShape()
    updated.shape.map((s) => (s.row += 1))
    setCurrent(updated)
  }

  const getNextShape = () => {
    if (collided()) {
      setFrozen([...frozen, current])
      clearLines()
      resetSpeed()
      return randomShape()
    } else {
      return clone(current)
    }
  }
  const clearLines = () => {
    grid.map((row, idx) => {
      if (row.every((cell) => cell.color !== Default.default_color)) {
        // TODO: Find out the proper way to do this!
        const cloned = clone(frozen)
        cloned.map((f) => (f.shape = filterArrayOfObjects(f.shape, idx)))
        cloned.map((f) => f.shape.map((s) => (s.row += 1)))
        setFrozen(cloned)
        dropRows(row)
      }
    })
  }

  const filterArrayOfObjects = (arr, val) => {
    const result = arr.filter((o) => o.row !== val)
    return [result[0]]
  }

  const dropRows = (row) => {
    row.map((cell) => (cell.color = 'gold'))
  }

  const updateGame = () => {
    updateCurrentShape()
    updateGrid()
  }

  const updateGrid = () => {
    let grid = []
    for (let r = 0; r < Default.rows; r++) {
      grid[r] = []
      for (let c = 0; c < Default.columns; c++) {
        let id = `[${r}][${c}]`
        grid[r][c] = {
          id: id,
          column: c,
          row: r,
          color: getColor(r, c)
        }
      }
    }
    setGrid(grid)
  }

  const isEdge = (dir) => {
    return current.shape.some(
      (s) => s.col + dir < 0 || s.col + dir > Default.columns - 1
    )
  }

  const rotate = () => {
    ;[0, 2, 3].forEach((n) => {
      // Destructure back into current shape excluding pivot vector [1]
      ;[current.shape[n].row, current.shape[n].col] = rotateVector(current, n)
    })
  }

  const rotateVector = (matrix, idx) => {
    // Adapted from the math explained here: https://www.youtube.com/watch?v=Atlr5vvdchY

    // Encode vector operation as a rotation of PI/2 (90 degrees)
    const R1 = [0, -1]
    const R2 = [1, 0]

    // Get individual square to rotate, i.e. the x/y or row/col coordinates
    const vector = matrix.shape[idx]

    // Get origin to pivot around which is always the second element (arr[1])
    const pivot = matrix.shape[1]

    // Get difference between pivot and vector
    let delta = { row: null, col: null }
    delta.row = vector.row - pivot.row
    delta.col = vector.col - pivot.col

    // Apply operation R against delta for matrix transformation
    let transform = { row: null, col: null }
    transform.row = R1[0] * delta.row + R1[1] * delta.col
    transform.col = R2[0] * delta.row + R2[1] * delta.col

    // Return new position by summing pivot & transform vectors
    return [pivot.row + transform.row, pivot.col + transform.col]
  }
  const resetSpeed = () => {
    if (dropInProgress) {
      setDropInProgress(false)
      setSpeed(preDropSpeed)
    }
  }

  const dropShapeFast = () => {
    setDropInProgress(true)
    setPreDropSpeed(currentSpeed)
    setSpeed(Default.dropping)
  }

  useEffect(() => {
    const handler = (event) => {
      switch (event.keyCode) {
        case Key.left:
          shiftColumns(-1)
          break
        case Key.right:
          shiftColumns(1)
          break
        case Key.up:
          rotate()
          break
        case Key.esc:
          endGame()
          break
        case Key.enter:
          //setGameSpeed(currentSpeed);
          break
        case Key.down:
          dropShapeFast()
          break
        default:
          break
      }
    }
    window.addEventListener('keydown', handler)
    const cleanup = () => {
      window.removeEventListener('keydown', handler)
    }
    return cleanup
  })

  return (
    <div>
      <div id="body">
        <div id="wrapper">
          <div id="centered">
            <div id="container">
              {grid.map((g) =>
                g.map((c) => (
                  <Cell key={c.id} row={c.row} column={c.col} color={c.color} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Grid

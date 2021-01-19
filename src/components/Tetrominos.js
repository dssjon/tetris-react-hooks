const Tetrominos = () => {
  const I = {
    color: "rgb(0,204,204)",
    shape: [
      { row: 0, col: 3 },
      { row: 0, col: 4 },
      { row: 0, col: 5 },
      { row: 0, col: 6 }
    ]
  };
  const T = {
    color: "rgb(153,0,204)",
    shape: [
      { row: 0, col: 4 },
      { row: 1, col: 4 },
      { row: 1, col: 3 },
      { row: 1, col: 5 }
    ]
  };
  const O = {
    color: "rgb(204,204,0)",
    shape: [
      { row: 0, col: 3 },
      { row: 0, col: 4 },
      { row: 1, col: 3 },
      { row: 1, col: 4 }
    ]
  };
  const Z = {
    color: "rgb(204,0,0)",
    shape: [
      { row: 0, col: 3 },
      { row: 0, col: 4 },
      { row: 1, col: 4 },
      { row: 1, col: 5 }
    ]
  };
  const S = {
    color: "rgb(153,0,204)",
    shape: [
      { row: 0, col: 5 },
      { row: 0, col: 4 },
      { row: 1, col: 4 },
      { row: 1, col: 3 }
    ]
  };
  return [I, T, O, S, Z];
};

export default Tetrominos;

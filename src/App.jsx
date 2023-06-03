import { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const size = 16;
  const [board, setBoard] = useState(Array(size * size).fill(null));
  const [isXTurn, setisXTurn] = useState(false);
  const [scoreX, setScoreX] = useState(0);
  const [scoreO, setScoreO] = useState(0);

  useEffect(() => {
    const getScore = () => {
      const storedScoreX = localStorage.getItem("scoreX");
      if (storedScoreX) {
        setScoreX(parseInt(storedScoreX));
      }
      const storedScoreO = localStorage.getItem("scoreO");
      if (storedScoreO) {
        setScoreO(parseInt(storedScoreO));
      }
    };
    getScore();
  }, []);

  useEffect(() => {
    localStorage.setItem("scoreX", scoreX.toString());
    localStorage.setItem("scoreO", scoreO.toString());
  }, [scoreX, scoreO]);

  const handleClick = (index) => {
    const updateBoard = [...board];
    if (calculateWinner(board) || updateBoard[index]) {
      return;
    }
    updateBoard[index] = isXTurn ? "X" : "O";
    setBoard(updateBoard);
    setisXTurn(!isXTurn);
  };

  const handleReset = () => {
    setBoard(Array(size * size).fill(null));
  };

  const calculateWinner = (board) => {
    const boardSize = Math.sqrt(board.length);
    const winningLines = [];

    // Kiểm tra hàng ngang
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col <= boardSize - 5; col++) {
        const line = [];
        for (let i = 0; i < 5; i++) {
          line.push(row * boardSize + col + i);
        }
        winningLines.push(line);
      }
    }

    // Kiểm tra hàng dọc
    for (let col = 0; col < boardSize; col++) {
      for (let row = 0; row <= boardSize - 5; row++) {
        const line = [];
        for (let i = 0; i < 5; i++) {
          line.push((row + i) * boardSize + col);
        }
        winningLines.push(line);
      }
    }

    // Kiểm tra đường chéo xuôi
    for (let row = 0; row <= boardSize - 5; row++) {
      for (let col = 0; col <= boardSize - 5; col++) {
        const line = [];
        for (let i = 0; i < 5; i++) {
          line.push((row + i) * boardSize + col + i);
        }
        winningLines.push(line);
      }
    }

    // Kiểm tra đường chéo ngược
    for (let row = 4; row < boardSize; row++) {
      for (let col = 0; col <= boardSize - 5; col++) {
        const line = [];
        for (let i = 0; i < 5; i++) {
          line.push((row - i) * boardSize + col + i);
        }
        winningLines.push(line);
      }
    }

    for (let i = 0; i < winningLines.length; i++) {
      const line = winningLines[i];
      const [a, b, c, d, e] = line;
      if (
        board[a] &&
        board[a] === board[b] &&
        board[a] === board[c] &&
        board[a] === board[d] &&
        board[a] === board[e]
      ) {
        return board[a];
      }
    }

    return null;
  };

  const renderSquare = (index) => {
    const squareValue = board[index];
    const squareClass = `square ${squareValue}`;

    return (
      <div className={squareClass} onClick={(e) => handleClick(index)}>
        {board[index]}
      </div>
    );
  };

  const renderBoard = () => {
    const boardSize = size * size;
    const boardRows = [];
    let squareIndex = 0;

    for (var i = 0; i < size; i++) {
      const boardRow = [];
      for (var j = 0; j < size; j++) {
        boardRow.push(renderSquare(squareIndex));
        squareIndex++;
      }
      boardRows.push(<div className="board-row">{boardRow}</div>);
    }

    return boardRows;
  };

  let winner = calculateWinner(board);
  const status = winner
    ? `Winner: ${winner}`
    : `Next player: ${isXTurn ? "X" : "O"}`;

  return (
    <div className="app">
      <div className="game">
        <div
          className="game-board"
          style={{
            pointerEvents: winner ? "none" : "auto",
            opacity: winner ? "0.3" : "1",
          }}
        >
          {renderBoard()}
        </div>
      </div>
      <div className="game-info">
        <p>{status}</p>
        <div className="game-controller" style={{
          pointerEvents: winner ? "auto" : "none",
          opacity: winner ? "1" : "0"
          }}>
          <button className="btn btn-reset" onClick={(e) => handleReset()}>
            NEW GAME
          </button>
          <button className="btn btn-reset">UNDO</button>
        </div>
      </div>
    </div>
  );
};

export default App;

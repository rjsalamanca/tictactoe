import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const rowStyle = {
   display: 'flex'
}

const squareStyle = {
   'width': '60px',
   'height': '60px',
   'backgroundColor': '#ddd',
   'margin': '4px',
   'display': 'flex',
   'justifyContent': 'center',
   'alignItems': 'center',
   'fontSize': '20px',
   'color': 'white'
}

const boardStyle = {
   'backgroundColor': '#eee',
   'width': '208px',
   'alignItems': 'center',
   'justifyContent': 'center',
   'display': 'flex',
   'flexDirection': 'column',
   'border': '3px #eee solid'
}

const containerStyle = {
   'display': 'flex',
   'alignItems': 'center',
   'flexDirection': 'column'
}

const instructionsStyle = {
   'marginTop': '5px',
   'marginBottom': '5px',
   'fontWeight': 'bold',
   'fontSize': '16px',
}

const buttonStyle = {
   'marginTop': '15px',
   'marginBottom': '16px',
   'width': '80px',
   'height': '40px',
   'backgroundColor': '#8acaca',
   'color': 'white',
   'fontSize': '16px',
}

const ORIGINAL_GRID = [
   ['', '', ''],
   ['', '', ''],
   ['', '', '']
];

function Square({ row, col, display, handleSquareClick }) {
   return (
      <div
         onClick={() => handleSquareClick(row, col)}
         className="square"
         style={squareStyle} >
         {display}
      </div >
   );
}

function Board({ grid, winner, nextPlayer, handleReset, handleSquareClick }) {

   const generateGrid = (g) => {
      return (
         <div style={boardStyle}>
            {g.map((row, i) =>
               <div key={`row_${i}`} className="board-row" style={rowStyle} >
                  {row.map((col, j) => <Square handleSquareClick={handleSquareClick} key={`col_${j}`} row={i} col={j} display={col} />)}
               </div>
            )}
         </div>
      );
   }

   return (
      <div style={containerStyle} className="gameBoard">
         <div id="statusArea" className="status" style={instructionsStyle}>Next player: <span>{nextPlayer}</span></div>
         <div id="winnerArea" className="winner" style={instructionsStyle}>Winner: <span>{winner}</span></div>
         <button style={buttonStyle} onClick={() => handleReset()}>Reset</button>
         <div style={boardStyle}>
            {generateGrid(grid)}
         </div>
      </div>
   );
}

function Game() {
   const [grid, setGrid] = useState(ORIGINAL_GRID);
   const [currentPlayer, setCurrentPlayer] = useState('X');
   const [winner, setWinner] = useState({ player: 'None', won: false })
   const [moves, setMoves] = useState(0);

   useEffect(() => {
      checkWinner();
   }, [grid])

   const oppositePlayer = () => currentPlayer === 'O' ? 'X' : 'O';

   const handleSquareClick = (row, col) => {
      const tempGrid = JSON.parse(JSON.stringify(grid));
      // only change states when we dont have a winner
      if (!winner.won && winner.player !== 'Tie') {
         if (tempGrid[row][col] === '') {
            setCurrentPlayer(oppositePlayer());
            tempGrid[row][col] = currentPlayer;
            setGrid(tempGrid);
            setMoves(moves + 1);
         } else {
            alert('This space is already taken');
         }
      }
   }

   const checkWinner = () => {
      // Check Diags
      let [checkDiag1X, checkDiag1O, checkDiag2X, checkDiag2O] = Array(4).fill(0);

      grid.every((row, i,) => {
         let [countRowX, countRowO, countColX, countColO] = Array(4).fill(0) // set initial value to 0
         row.forEach((col, j) => {
            // loop through each row
            if (col === 'X') {
               countRowX++
            } else if (col === 'O') {
               countRowO++;
            }

            // loop through each column
            if (grid[j][i] === 'X') {
               countColX++;
            } else if (grid[j][i] === 'O') {
               countColO++
            }

            // Check diag values here
            if (i === j) {
               // check diag 1 top left to bottom right
               if (grid[i][j] === 'X') {
                  checkDiag1X++;
               } else if (grid[i][j] === 'O') {
                  checkDiag1O++
               }

               //check diag top right to bottom left
               if (grid[i][(row.length - 1) - j] === 'X') {
                  checkDiag2X++
               } else if (grid[i][(row.length - 1) - j] === 'X') {
                  checkDiag2O++
               }
            }
         });

         if (countRowX === 3 ||
            countRowO === 3 ||
            countColX === 3 ||
            countColO === 3 ||
            checkDiag1X === 3 ||
            checkDiag1O === 3 ||
            checkDiag2X === 3 ||
            checkDiag2O === 3) {
            // winner is the opposite player
            setWinner({ player: oppositePlayer(), won: true })
            return false;
         } else if (moves === 9) {
            setWinner({ player: 'Tie', won: false })
         }
         return true;
      });
   }

   const handleReset = () => {
      console.log('reset')
      setGrid(ORIGINAL_GRID);
      setCurrentPlayer('X');
      setWinner({ player: 'None', won: false })
      setMoves(0);
   }

   return (
      < div className="game" >
         <div className="game-board">
            <Board grid={grid} handleSquareClick={handleSquareClick} handleReset={handleReset} winner={winner.player} nextPlayer={currentPlayer} />
         </div>
      </div >
   );
}

ReactDOM.render(
   <Game />,
   document.getElementById('root')
);
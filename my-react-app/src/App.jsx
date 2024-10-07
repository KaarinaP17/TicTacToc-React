import './App.css'
import { useCallback, useEffect, useState } from 'react'
import Box from './components/Box/Box';

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

function App() {

  const [board, setBoard] = useState(['', '', '', '', '', '', '', '', '']);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [gameActive, setGameActive] = useState(true);
  const [message, setMessage] = useState('');
  const [isMachineTurn, setIsMachineTurn] = useState(false);
  const handleCellClick = (index) => {
    console.log(isMachineTurn);
    if (board[index] !== '' || !gameActive || isMachineTurn)
      return;
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    checkResult(newBoard);

  }

  const checkResult = useCallback( (board) => {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
      const [a, b, c] = winningConditions[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        roundWon = true;
        break;
      }
    }

    if (roundWon) {
      setMessage(`Player ${currentPlayer} has won!`);
      setGameActive(false);
      return;
    }
    else if (!board.includes('')) {
      setMessage('It is a tie');
      setGameActive(false);
    }
    else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  }, [currentPlayer])

  const machineTurn = useCallback( () => {
    let newBoard = [...board];
    if (!gameActive) return;
    let bestMove = findBestMove(newBoard, 'O');
    if (bestMove !== -1) {
      newBoard[bestMove] = 'O';
      setBoard(newBoard);
      checkResult(newBoard);
      setIsMachineTurn(false);
      return;
    }

    bestMove = findBestMove(newBoard, 'X');
    if (bestMove !== -1) {
      newBoard[bestMove] = 'O';
      setBoard(newBoard);
      checkResult(newBoard);
      setIsMachineTurn(false);
      return;
    }

    let emptyCells = [];
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === '') {
        emptyCells.push(i);
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      newBoard[randomIndex] = 'O';
      setBoard(newBoard);
      checkResult(newBoard);
    }
    setIsMachineTurn(false);
  }, [board, checkResult, gameActive])

  const findBestMove = (board, player) => {
    for (let i = 0; i < winningConditions.length; i++) {
      const [a, b, c] = winningConditions[i];
      let values = [board[a], board[b], board[c]];

      if (values.filter(val => val === player).length === 2 && values.includes('')) {
        return values.indexOf('') === 0 ? a : values.indexOf('') === 1 ? b : c;
      }
    }
    return -1;
  }

  function restartGame() {
    setCurrentPlayer('X');
    setBoard(['', '', '', '', '', '', '', '', '']);
    setGameActive(true);
    setMessage('');
    setIsMachineTurn(false);
  }

  useEffect(() => {
    if (currentPlayer === 'O' && gameActive) {
      setIsMachineTurn(true);
      const Time = setTimeout(machineTurn, 500);
      return () => {
        clearTimeout(Time);
      }
    }
  }, [currentPlayer, gameActive, machineTurn])

  const Cells = board.map((value, index) => {
    return <Box key={index} action={() => {
      handleCellClick(index);
    }} value={value} />;
  })

  return (
    <div>
      <section>
      <h1>Tic Tac Toc</h1>
      <div className='board'>
        {
          Cells && Cells.length > 0 ?
            Cells : <></>
        }
      </div>
      <div className='message' id='message'>
        {message}
      </div>
      <button id='restart' onClick={restartGame}>Restart</button>
    </section>
    </div>
  )
}

export default App
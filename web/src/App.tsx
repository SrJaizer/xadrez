import React, { useState, useEffect } from 'react';
import { socket } from "./lib/socket";

import { Chessboard } from "./components/Chessboard"

export function App() {

const [playerChessboardView, setPlayerChessboardView] = useState("white")
const [horizontalAxis, setHorizontalAxis] = useState(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'])
const [verticalAxis, setVerticalAxis] = useState(['8', '7', '6', '5', '4', '3', '2', '1'])
const [winningPlayer, setWinningPlayer] = useState("")

useEffect(() => {
  socket.on('chess_team', (msg: string) => {
    console.log(`server msg(chess_team): ${msg}`)
    if (msg == "black") {
      setPlayerChessboardView("black")
      setHorizontalAxis(prev => prev.reverse())
      setVerticalAxis(prev => prev.reverse())
    }
  });
  
  socket.on('game_over', (msg: string) => {
    console.log(`server msg(game_over): ${msg}`)
    if (msg == "black") {
      setWinningPlayer(" As peças pretas venceram!")
    } else if (msg == "white") {
      setWinningPlayer(" As peças brancas venceram!")
    }
  });
}, [])

  return (
    <>
      <Chessboard 
        playerChessboardView={playerChessboardView}
        horizontalAxis={horizontalAxis}
        verticalAxis={verticalAxis}
      />
      <h1 className='game-result'>{winningPlayer}</h1>
    </>
  );
}


import React, { useState, useEffect } from 'react';
// import { socket } from "./lib/socket";

import { Chessboard } from "./components/Chessboard"

let playerChessboardView = "white"
let horizontalAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
let verticalAxis = ['8', '7', '6', '5', '4', '3', '2', '1']

// useEffect(() => {
//   socket.on('chess_team', (msg: string) => {
//     if (msg == "0") {
//       playerChessboardView = "black"
//       horizontalAxis = horizontalAxis.reverse()
//       verticalAxis = verticalAxis.reverse()
//     }
//   });
// }, []);

export function App() {

  return (
    <Chessboard 
      playerChessboardView={playerChessboardView}
      horizontalAxis={horizontalAxis}
      verticalAxis={verticalAxis}
    />
  );
}


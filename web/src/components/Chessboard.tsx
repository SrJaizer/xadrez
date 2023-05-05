import React, { JSXElementConstructor, useEffect, useRef, useState } from "react";
import { socket } from "../lib/socket";

import { Square } from "./Square";

import { startChessboard } from "../utils/startChessboard";
import { centerElementOnCursor, getChessNotation, pieceInChessboardConstraint, resetChessPiecePosition } from "../utils/handlePieces";

import "./../styles/Chessboard.css";

let initialChessboardMap: {[key: string]: string | null} = startChessboard()

interface ChessboardProps {
  playerChessboardView: string;
  horizontalAxis: string[];
  verticalAxis: string[];
}
// console.log("Initial render!")

export function Chessboard({ playerChessboardView, horizontalAxis, verticalAxis }: ChessboardProps) {
  console.log("renderizei!")
  const axis = {horizontalAxis, verticalAxis}
  const [chessboardMap, setChessboardMap] = useState<{[key: string]: string | null}>(initialChessboardMap)
  
  let activePiece: HTMLElement | null = null;
  
  const pieceMoveOriginRef = useRef("")
  const pieceMoveDestinationRef = useRef("")
  const pieceImageRef = useRef("")
  const chessboardRef = useRef<HTMLDivElement>(null)
  
  function checkLegalMove(from: string, to: string) {
    socket.emit(`${playerChessboardView}_move`, `${from}${to}`);
  }

  useEffect( () => {
    socket.on('legal_move', (msg: string) => {
      console.log(`server msg(legal_move): ${msg}`)
      const origin = msg.slice(0, 2)
      const destination = msg.slice(2, 4)
  
      updateChessboardMap(origin, destination)
    });
  }, [])

  function updateChessboardMap(origin: string, destination: string) {
    setChessboardMap(prevState => ({
      ...prevState,
      [origin]: null,
      [destination]: pieceImageRef.current,
    }))
  }

  function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement
    if (!element.classList.contains("chess-piece")) return;
    
    activePiece = element
    centerElementOnCursor(e, activePiece)
    pieceMoveOriginRef.current = getChessNotation(e, chessboardRef, axis)
    pieceImageRef.current = chessboardMap[pieceMoveOriginRef.current]!

    // console.log(`FROM: ${pieceMoveOriginRef.current}`)
  }
  
  function movePiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current
    if (!activePiece) return
   
    centerElementOnCursor(e, activePiece)
  }  
  
  function dropPiece(e: React.MouseEvent) {
    if (!activePiece) return;

    pieceMoveDestinationRef.current = getChessNotation(e, chessboardRef, axis)

    if (!pieceInChessboardConstraint(e, activePiece, chessboardRef) || 
        pieceMoveOriginRef.current == pieceMoveDestinationRef.current ||
        (chessboardMap[pieceMoveOriginRef.current]!)[0]!=playerChessboardView[0]) {
      resetChessPiecePosition(activePiece)
      activePiece = null
      return;
    }
    
    activePiece = null
    checkLegalMove(pieceMoveOriginRef.current, pieceMoveDestinationRef.current)    

    // console.log(`TO: ${pieceMoveDestination}`)
  }

  return (
    <div 
      id="chessboard"
      onMouseDown={e => grabPiece(e)}
      onMouseMove={e => movePiece(e)}
      onMouseUp={e => dropPiece(e)}
      ref={chessboardRef}
    >
      {
        verticalAxis.map((y, yIndex) =>
          horizontalAxis.map((x, xIndex) => {
            const coordinates: string = `${x}${y}` 
            let colorSquare = ((yIndex + xIndex) % 2 === 0) ? "black" : "white";
            const chessPieceImage: string|null = chessboardMap[coordinates]
            
            if (coordinates === pieceMoveOriginRef.current ||
              coordinates === pieceMoveDestinationRef.current) colorSquare = "marked"
            return (
              <Square 
                key={coordinates} 
                color={colorSquare}
                image={chessPieceImage} 
              />
            );
          })
        )
      }
    </div>
  )
}
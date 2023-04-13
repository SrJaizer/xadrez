import React from "react";

interface axis {
  horizontalAxis: string[];
  verticalAxis: string[];
}

export function centerElementOnCursor(e: React.MouseEvent, activePiece: HTMLElement) {
  activePiece.style.position = "absolute"
  const centerPieceX = activePiece.offsetWidth / 2
  const centerPieceY = activePiece.offsetHeight / 2

  activePiece.style.left = `${e.clientX - centerPieceX}px`
  activePiece.style.top = `${e.clientY - centerPieceY}px`
}

export function pieceInChessboardConstraint(e: React.MouseEvent, activePiece: HTMLElement, chessboardRef: React.RefObject<HTMLDivElement>) {
  const chessboard = chessboardRef.current

  const cursorX = e.clientX
  const cursorY = e.clientY

  const minX = Number(chessboard!.offsetLeft)
  const minY = Number(chessboard!.offsetTop)
  const maxX = Number(minX + chessboard!.clientWidth)
  const maxY = Number(minY + chessboard!.clientHeight)

  if (cursorX < minX || cursorX > maxX || cursorY < minY || cursorY > maxY) {
    return false
  }
  return true
}

export function getChessNotation(e: React.MouseEvent, chessboardRef: React.RefObject<HTMLDivElement>, {horizontalAxis, verticalAxis}: axis): string {
  const chessboard = chessboardRef.current

  const x = Math.floor((e.clientX - Number(chessboard!.offsetLeft)) / 100) 
  const y = Math.floor((e.clientY - Number(chessboard!.offsetTop)) / 100)
  return `${horizontalAxis[x]}${verticalAxis[y]}`
}

export function resetChessPiecePosition(activePiece: HTMLElement) {
  console.log("POSICAO RESETADA!")

  activePiece.style.left = ""
  activePiece.style.top = ""
}





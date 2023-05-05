export function startChessboard() {
  const horizontalAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] 
  const verticalAxis = [8, 7, 6, 5, 4, 3, 2, 1]
  let chessboard: {[key: string]: string | null} = {};
    
    
  const colors = ['b', 'w']
    
  // insert pawns
  for (let colorPiece of colors) {
    const y = (colorPiece === 'b') ? 7 : 2
    const imagePiece = `${colorPiece}_pawn.svg`
  
    for (let x of horizontalAxis) {
      chessboard[`${x}${y}`] = imagePiece;
    }
  }  

  //  insert other pieces
  for (let colorPiece of colors) {
    const y = (colorPiece === 'b') ? 8 : 1
    
    for (let x of horizontalAxis) {
      const piece = (
                      (x === 'a' || x === 'h') ? "rook"
                    : (x === 'b' || x === 'g') ? "knight"
                    : (x === 'c' || x === 'f') ? "bishop"
                    : (x === 'd') ? "queen"
                    : "king"
                  )

      let imagePiece = `${colorPiece}_${piece}.svg`
      chessboard[`${x}${y}`] = imagePiece
    }
  }

  //  void squares
  for (let y = 6; y > 2; y--) {
    for (let x of horizontalAxis) {
      chessboard[`${x}${y}`] = null
    }
  }

  return chessboard;
}
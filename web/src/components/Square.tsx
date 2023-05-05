import "./../styles/Square.css"

interface SquareProps {
  color: string;
  image: string|null;
}

export function Square({ color, image }: SquareProps) {

  return (
    <div className={`square ${color}-square`}>
      {
        image &&
        <div 
          style={{backgroundImage: `url(${image})`}} 
          className="chess-piece"
        />
      }
    </div>
  )
}
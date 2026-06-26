import PuzzlePiece from "./PuzzlePiece.jsx";

export default function PuzzleBoard({
  activePieceId,
  hintedPieceId,
  image,
  paused,
  pieces,
  showPreview,
  size,
  zoom,
  onDragOver,
  onDragStart,
  onDrop,
  onRotate
}) {
  const cells = Array.from({ length: size * size }, (_, index) => index);

  return (
    <section className="board-shell">
      <div className="board-toolbar">
        <span>{size} x {size} puzzle</span>
        <span>{paused ? "Paused" : showPreview ? "Preview on" : "Solve mode"}</span>
      </div>

      <div className="puzzle-stage" style={{ "--size": size, "--zoom": zoom }}>
        {showPreview && <img className="preview-image" src={image} alt="Puzzle preview" />}
        {paused && <div className="pause-shield">Paused</div>}

        <div className="puzzle-board" aria-label="Jigsaw puzzle board">
          {cells.map((cellIndex) => {
            const piece = pieces.find((item) => item.currentIndex === cellIndex);

            return (
              <div
                className="puzzle-cell"
                key={cellIndex}
                onDragOver={onDragOver}
                onDrop={(event) => onDrop(event, cellIndex)}
              >
                {piece && (
                  <PuzzlePiece
                    image={image}
                    isActive={activePieceId === piece.id}
                    isHinted={hintedPieceId === piece.id}
                    onDragStart={onDragStart}
                    onRotate={onRotate}
                    paused={paused}
                    piece={piece}
                    size={size}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

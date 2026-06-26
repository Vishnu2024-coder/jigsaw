export default function PuzzlePiece({
  piece,
  image,
  size,
  isActive,
  isHinted,
  paused,
  onDragStart,
  onRotate
}) {
  const row = Math.floor(piece.correctIndex / size);
  const col = piece.correctIndex % size;

  return (
    <button
      className={`puzzle-piece ${piece.locked ? "locked" : ""} ${isActive ? "active" : ""} ${isHinted ? "hinted" : ""}`}
      draggable={!piece.locked && !paused}
      onClick={() => onRotate(piece.id)}
      onDragStart={(event) => onDragStart(event, piece.id)}
      style={{
        backgroundImage: `url("${image}")`,
        backgroundSize: `${size * 100}% ${size * 100}%`,
        backgroundPosition: `${(col / (size - 1)) * 100}% ${(row / (size - 1)) * 100}%`,
        transform: `rotate(${piece.rotation}deg)`
      }}
      title={piece.locked ? "Locked in place" : "Drag this piece"}
      type="button"
    >
      <span>{piece.locked ? "✓" : ""}</span>
    </button>
  );
}

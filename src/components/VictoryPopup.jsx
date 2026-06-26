import { formatTime } from "./Timer.jsx";

export default function VictoryPopup({ accuracy, achievements, elapsed, moves, onNewGame }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <section className="victory-popup">
        <span className="badge">Puzzle solved</span>
        <h2>Victory!</h2>
        <div className="victory-stats">
          <span>Time <b>{formatTime(elapsed)}</b></span>
          <span>Moves <b>{moves}</b></span>
          <span>Accuracy <b>{accuracy}%</b></span>
        </div>
        <div className="achievement-row">
          {achievements.length === 0 ? <span>Try for achievements next run.</span> : achievements.map((item) => <b key={item}>{item}</b>)}
        </div>
        <button onClick={onNewGame} type="button">Play Again</button>
      </section>
    </div>
  );
}

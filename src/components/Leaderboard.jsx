import { formatTime } from "./Timer.jsx";

export default function Leaderboard({ leaderboard }) {
  return (
    <section className="glass-panel leaderboard">
      <div className="section-title">
        <span>Leaderboard</span>
        <strong>Local best scores</strong>
      </div>
      {leaderboard.length === 0 ? (
        <p>No completed puzzles yet.</p>
      ) : (
        <ol>
          {leaderboard.map((entry) => (
            <li key={entry.id}>
              <span>{entry.difficulty}</span>
              <b>{formatTime(entry.time)}</b>
              <small>{entry.moves} moves · {entry.accuracy}%</small>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

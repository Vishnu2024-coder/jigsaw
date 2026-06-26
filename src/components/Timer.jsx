function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

export default function Timer({ elapsed }) {
  return (
    <div className="stat-card">
      <span>Time</span>
      <strong>{formatTime(elapsed)}</strong>
    </div>
  );
}

export { formatTime };

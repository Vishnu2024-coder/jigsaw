export default function Achievements({ unlocked }) {
  const achievements = ["Fast finisher", "Perfect player", "No hint winner"];

  return (
    <section className="glass-panel achievements">
      <div className="section-title">
        <span>Achievements</span>
        <strong>Unlocks</strong>
      </div>
      <div className="achievement-list">
        {achievements.map((item) => (
          <span className={unlocked.includes(item) ? "unlocked" : ""} key={item}>{item}</span>
        ))}
      </div>
    </section>
  );
}

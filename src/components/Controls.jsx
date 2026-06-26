import { difficulties } from "../puzzleData.js";

export default function Controls({
  accent,
  backgroundMusic,
  difficulty,
  hintsLeft,
  isStarted,
  muted,
  paused,
  preview,
  progress,
  rotationMode,
  theme,
  zoom,
  onDailyChallenge,
  onHint,
  onRandomImage,
  onReset,
  onReshuffle,
  setAccent,
  setBackgroundMusic,
  setDifficulty,
  setMuted,
  setPreview,
  setRotationMode,
  setTheme,
  setZoom,
  togglePause
}) {
  return (
    <section className="glass-panel controls-panel">
      <div className="control-block">
        <label>Difficulty</label>
        <div className="segmented">
          {Object.keys(difficulties).map((level) => (
            <button
              className={difficulty === level ? "selected" : ""}
              key={level}
              onClick={() => setDifficulty(level)}
              type="button"
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="control-block">
        <label>Actions</label>
        <div className="button-row">
          <button disabled={!isStarted} onClick={togglePause} type="button">{paused ? "Resume" : "Pause"}</button>
          <button disabled={!isStarted} onClick={onReset} type="button">Reset</button>
          <button disabled={!isStarted} onClick={onReshuffle} type="button">Reshuffle</button>
          <button onClick={onDailyChallenge} type="button">Daily</button>
        </div>
      </div>

      <div className="control-block">
        <label>Help</label>
        <div className="button-row">
          <button disabled={!isStarted || hintsLeft <= 0} onClick={onHint} type="button">Hint ({hintsLeft})</button>
          <button disabled={!isStarted} onClick={() => setPreview((value) => !value)} type="button">{preview ? "Hide Preview" : "Preview"}</button>
          <button onClick={onRandomImage} type="button">Random Image</button>
        </div>
      </div>

      <div className="control-block">
        <label>Options</label>
        <div className="toggle-grid">
          <label><input checked={theme === "dark"} onChange={(event) => setTheme(event.target.checked ? "dark" : "light")} type="checkbox" /> Dark mode</label>
          <label><input checked={rotationMode} onChange={(event) => setRotationMode(event.target.checked)} type="checkbox" /> Rotation</label>
          <label><input checked={muted} onChange={(event) => setMuted(event.target.checked)} type="checkbox" /> Mute SFX</label>
          <label><input checked={backgroundMusic} onChange={(event) => setBackgroundMusic(event.target.checked)} type="checkbox" /> Music</label>
        </div>
      </div>

      <div className="control-block slider-block">
        <label>Zoom</label>
        <input max="1.25" min="0.75" onChange={(event) => setZoom(Number(event.target.value))} step="0.05" type="range" value={zoom} />
      </div>

      <div className="control-block slider-block">
        <label>Theme color</label>
        <input onChange={(event) => setAccent(event.target.value)} type="color" value={accent} />
      </div>

      <div className="progress-wrap">
        <span>Progress {progress}%</span>
        <div className="progress-bar">
          <b style={{ width: `${progress}%` }} />
        </div>
      </div>
    </section>
  );
}

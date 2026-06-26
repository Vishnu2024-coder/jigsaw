import { useEffect, useMemo, useState } from "react";
import Achievements from "./components/Achievements.jsx";
import AnimatedBackground from "./components/AnimatedBackground.jsx";
import Controls from "./components/Controls.jsx";
import ImagePicker from "./components/ImagePicker.jsx";
import Leaderboard from "./components/Leaderboard.jsx";
import PuzzleBoard from "./components/PuzzleBoard.jsx";
import Timer from "./components/Timer.jsx";
import VictoryPopup from "./components/VictoryPopup.jsx";
import { playMusicTick, playSound } from "./audio.js";
import { createGeneratedImage, createPieces, difficulties, presetImages } from "./puzzleData.js";

const storageKeys = {
  progress: "jigsaw-progress",
  leaderboard: "jigsaw-leaderboard",
  achievements: "jigsaw-achievements"
};

function readStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function checkPiece(piece) {
  return piece.currentIndex === piece.correctIndex && piece.rotation % 360 === 0;
}

function getAccuracy(correctDrops, moves) {
  if (moves === 0) return 100;
  return Math.round((correctDrops / moves) * 100);
}

export default function App() {
  const savedProgress = readStorage(storageKeys.progress, null);
  const [theme, setTheme] = useState(savedProgress?.theme || "dark");
  const [accent, setAccent] = useState(savedProgress?.accent || "#8cf7ff");
  const [difficulty, setDifficulty] = useState(savedProgress?.difficulty || "Medium");
  const [images, setImages] = useState(presetImages);
  const [selectedImage, setSelectedImage] = useState(savedProgress?.selectedImage || presetImages[0]);
  const [pieces, setPieces] = useState(savedProgress?.pieces || []);
  const [started, setStarted] = useState(Boolean(savedProgress?.started));
  const [paused, setPaused] = useState(false);
  const [won, setWon] = useState(false);
  const [elapsed, setElapsed] = useState(savedProgress?.elapsed || 0);
  const [moves, setMoves] = useState(savedProgress?.moves || 0);
  const [correctDrops, setCorrectDrops] = useState(savedProgress?.correctDrops || 0);
  const [hintsLeft, setHintsLeft] = useState(savedProgress?.hintsLeft ?? 3);
  const [usedHints, setUsedHints] = useState(savedProgress?.usedHints || 0);
  const [preview, setPreview] = useState(false);
  const [rotationMode, setRotationMode] = useState(savedProgress?.rotationMode ?? true);
  const [activePieceId, setActivePieceId] = useState("");
  const [hintedPieceId, setHintedPieceId] = useState("");
  const [muted, setMuted] = useState(false);
  const [backgroundMusic, setBackgroundMusic] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [leaderboard, setLeaderboard] = useState(() => readStorage(storageKeys.leaderboard, []));
  const [unlockedAchievements, setUnlockedAchievements] = useState(() => readStorage(storageKeys.achievements, []));
  const size = difficulties[difficulty];

  const lockedCount = pieces.filter((piece) => piece.locked).length;
  const totalPieces = size * size;
  const progress = totalPieces === 0 ? 0 : Math.round((lockedCount / totalPieces) * 100);
  const accuracy = getAccuracy(correctDrops, moves);

  const currentRunAchievements = useMemo(() => {
    if (!won) return [];
    const unlocked = [];
    if (elapsed <= 180) unlocked.push("Fast finisher");
    if (accuracy === 100) unlocked.push("Perfect player");
    if (usedHints === 0) unlocked.push("No hint winner");
    return unlocked;
  }, [accuracy, elapsed, usedHints, won]);

  useEffect(() => {
    document.body.dataset.theme = theme;
    document.documentElement.style.setProperty("--accent", accent);
  }, [accent, theme]);

  useEffect(() => {
    if (!started || paused || won) return undefined;
    const interval = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(interval);
  }, [paused, started, won]);

  useEffect(() => {
    if (!backgroundMusic || paused || won) return undefined;
    const interval = window.setInterval(() => playMusicTick(muted), 800);
    return () => window.clearInterval(interval);
  }, [backgroundMusic, muted, paused, won]);

  useEffect(() => {
    localStorage.setItem(storageKeys.leaderboard, JSON.stringify(leaderboard));
  }, [leaderboard]);

  useEffect(() => {
    localStorage.setItem(storageKeys.achievements, JSON.stringify(unlockedAchievements));
  }, [unlockedAchievements]);

  useEffect(() => {
    if (!started || won) return;
    const progressData = {
      accent,
      correctDrops,
      difficulty,
      elapsed,
      hintsLeft,
      moves,
      pieces,
      rotationMode,
      selectedImage,
      started,
      theme,
      usedHints
    };
    localStorage.setItem(storageKeys.progress, JSON.stringify(progressData));
  }, [accent, correctDrops, difficulty, elapsed, hintsLeft, moves, pieces, rotationMode, selectedImage, started, theme, usedHints, won]);

  function startPuzzle(nextImage = selectedImage, nextDifficulty = difficulty) {
    const boardSize = difficulties[nextDifficulty];
    const freshPieces = createPieces(boardSize, rotationMode).map((piece) => ({
      ...piece,
      locked: checkPiece(piece)
    }));

    setSelectedImage(nextImage);
    setDifficulty(nextDifficulty);
    setPieces(freshPieces);
    setStarted(true);
    setPaused(false);
    setWon(false);
    setElapsed(0);
    setMoves(0);
    setCorrectDrops(freshPieces.filter((piece) => piece.locked).length);
    setHintsLeft(3);
    setUsedHints(0);
    setPreview(false);
    setHintedPieceId("");
  }

  function finishPuzzle(nextMoves, nextCorrectDrops) {
    const finalAccuracy = getAccuracy(nextCorrectDrops, nextMoves);
    const earnedAchievements = [];
    if (elapsed <= 180) earnedAchievements.push("Fast finisher");
    if (finalAccuracy === 100) earnedAchievements.push("Perfect player");
    if (usedHints === 0) earnedAchievements.push("No hint winner");
    const entry = {
      id: Date.now(),
      difficulty,
      time: elapsed,
      moves: nextMoves,
      accuracy: finalAccuracy
    };

    setWon(true);
    playSound("victory", muted);
    localStorage.removeItem(storageKeys.progress);
    setLeaderboard((items) => [entry, ...items].sort((a, b) => a.time - b.time || b.accuracy - a.accuracy).slice(0, 8));
    setUnlockedAchievements((items) => [...new Set([...items, ...earnedAchievements])]);
  }

  function evaluateBoard(nextPieces, nextMoves, nextCorrectDrops) {
    if (nextPieces.every((piece) => piece.locked || checkPiece(piece))) {
      const lockedPieces = nextPieces.map((piece) => ({ ...piece, locked: true, rotation: 0, currentIndex: piece.correctIndex }));
      setPieces(lockedPieces);
      finishPuzzle(nextMoves, nextCorrectDrops);
    }
  }

  function handleDragStart(event, pieceId) {
    if (paused) return;
    event.dataTransfer.setData("text/plain", pieceId);
    setActivePieceId(pieceId);
    playSound("pick", muted);
  }

  function handleDrop(event, targetIndex) {
    event.preventDefault();
    if (paused || won) return;

    const pieceId = event.dataTransfer.getData("text/plain");
    if (!pieceId) return;

    setPieces((currentPieces) => {
      const draggedPiece = currentPieces.find((piece) => piece.id === pieceId);
      const targetPiece = currentPieces.find((piece) => piece.currentIndex === targetIndex);
      if (!draggedPiece || draggedPiece.locked || targetPiece?.locked) return currentPieces;

      const nextMoves = moves + 1;
      let nextCorrectDrops = correctDrops;
      const sourceIndex = draggedPiece.currentIndex;
      let correctThisMove = false;

      const nextPieces = currentPieces.map((piece) => {
        if (piece.id === draggedPiece.id) {
          const movedPiece = { ...piece, currentIndex: targetIndex };
          if (checkPiece(movedPiece)) {
            movedPiece.locked = true;
            movedPiece.rotation = 0;
            correctThisMove = true;
          }
          return movedPiece;
        }

        if (piece.currentIndex === targetIndex) {
          const swappedPiece = { ...piece, currentIndex: sourceIndex };
          if (checkPiece(swappedPiece)) {
            swappedPiece.locked = true;
          }
          return swappedPiece;
        }

        return piece;
      });

      if (correctThisMove) nextCorrectDrops += 1;
      setMoves(nextMoves);
      setCorrectDrops(nextCorrectDrops);
      playSound(correctThisMove ? "correct" : "drop", muted);
      window.setTimeout(() => evaluateBoard(nextPieces, nextMoves, nextCorrectDrops), 0);
      return nextPieces;
    });

    setActivePieceId("");
  }

  function handleRotate(pieceId) {
    if (!rotationMode || paused || won) return;

    setPieces((currentPieces) => {
      let correctThisMove = false;
      const nextMoves = moves + 1;
      let nextCorrectDrops = correctDrops;

      const nextPieces = currentPieces.map((piece) => {
        if (piece.id !== pieceId || piece.locked) return piece;
        const rotatedPiece = { ...piece, rotation: (piece.rotation + 90) % 360 };
        if (checkPiece(rotatedPiece)) {
          rotatedPiece.locked = true;
          correctThisMove = true;
        }
        return rotatedPiece;
      });

      if (correctThisMove) nextCorrectDrops += 1;
      setMoves(nextMoves);
      setCorrectDrops(nextCorrectDrops);
      if (correctThisMove) playSound("correct", muted);
      window.setTimeout(() => evaluateBoard(nextPieces, nextMoves, nextCorrectDrops), 0);
      return nextPieces;
    });
  }

  function reshufflePuzzle() {
    startPuzzle(selectedImage, difficulty);
  }

  function resetPuzzle() {
    setStarted(false);
    setWon(false);
    setPaused(false);
    setPieces([]);
    setElapsed(0);
    setMoves(0);
    setCorrectDrops(0);
    localStorage.removeItem(storageKeys.progress);
  }

  function showHint() {
    if (hintsLeft <= 0) return;
    const nextPiece = pieces.find((piece) => !piece.locked);
    setHintsLeft((value) => value - 1);
    setUsedHints((value) => value + 1);
    setHintedPieceId(nextPiece?.id || "");
    setPreview(true);
    window.setTimeout(() => {
      setPreview(false);
      setHintedPieceId("");
    }, 3000);
  }

  function addRandomImage() {
    const randomImage = {
      id: `random-${Date.now()}`,
      name: "Generated Art",
      image: createGeneratedImage()
    };
    setImages((items) => [randomImage, ...items]);
    setSelectedImage(randomImage);
  }

  function handleUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const uploadedImage = {
        id: `upload-${Date.now()}`,
        name: file.name.replace(/\.[^.]+$/, ""),
        image: reader.result
      };
      setImages((items) => [uploadedImage, ...items]);
      setSelectedImage(uploadedImage);
    };
    reader.readAsDataURL(file);
  }

  function dailyChallenge() {
    const dayNumber = Math.floor(Date.now() / 86400000);
    const dailyImage = presetImages[dayNumber % presetImages.length];
    setSelectedImage(dailyImage);
    startPuzzle(dailyImage, "Medium");
  }

  return (
    <main className="app-shell">
      <AnimatedBackground won={won} />

      <header className="hero">
        <div>
          <span className="eyebrow">Frontend-only React game</span>
          <h1>Jigsaw Puzzle Studio</h1>
        </div>
        <p>Upload a picture, pick a difficulty, drag pieces into place, rotate tricky tiles, and chase a better solve time.</p>
      </header>

      <ImagePicker
        currentImageId={selectedImage.id}
        images={images}
        onSelectImage={setSelectedImage}
        onStart={() => startPuzzle()}
        onUpload={handleUpload}
      />

      <Controls
        accent={accent}
        backgroundMusic={backgroundMusic}
        difficulty={difficulty}
        hintsLeft={hintsLeft}
        isStarted={started}
        muted={muted}
        onDailyChallenge={dailyChallenge}
        onHint={showHint}
        onRandomImage={addRandomImage}
        onReset={resetPuzzle}
        onReshuffle={reshufflePuzzle}
        paused={paused}
        preview={preview}
        progress={progress}
        rotationMode={rotationMode}
        setAccent={setAccent}
        setBackgroundMusic={setBackgroundMusic}
        setDifficulty={setDifficulty}
        setMuted={setMuted}
        setPreview={setPreview}
        setRotationMode={setRotationMode}
        setTheme={setTheme}
        setZoom={setZoom}
        theme={theme}
        togglePause={() => setPaused((value) => !value)}
        zoom={zoom}
      />

      <section className="game-grid">
        <div className="left-column">
          <div className="stats-row">
            <Timer elapsed={elapsed} />
            <div className="stat-card"><span>Moves</span><strong>{moves}</strong></div>
            <div className="stat-card"><span>Accuracy</span><strong>{accuracy}%</strong></div>
          </div>

          {started ? (
            <PuzzleBoard
              activePieceId={activePieceId}
              hintedPieceId={hintedPieceId}
              image={selectedImage.image}
              onDragOver={(event) => event.preventDefault()}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              onRotate={handleRotate}
              paused={paused}
              pieces={pieces}
              showPreview={preview}
              size={size}
              zoom={zoom}
            />
          ) : (
            <section className="empty-state glass-panel">
              <div className="loader" />
              <h2>Choose an image and press Start Puzzle.</h2>
              <p>Your progress, leaderboard, and achievements are saved in this browser.</p>
            </section>
          )}
        </div>

        <aside className="side-column">
          <div className="glass-panel preview-card">
            <div className="section-title">
              <span>Preview</span>
              <strong>{selectedImage.name}</strong>
            </div>
            <img src={selectedImage.image} alt={selectedImage.name} />
          </div>
          <Achievements unlocked={unlockedAchievements} />
          <Leaderboard leaderboard={leaderboard} />
        </aside>
      </section>

      {won && (
        <VictoryPopup
          achievements={currentRunAchievements}
          accuracy={accuracy}
          elapsed={elapsed}
          moves={moves}
          onNewGame={resetPuzzle}
        />
      )}
    </main>
  );
}

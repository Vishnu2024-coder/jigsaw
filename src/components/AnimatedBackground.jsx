export default function AnimatedBackground({ won }) {
  return (
    <>
      <div className="particles" aria-hidden="true">
        {Array.from({ length: 22 }, (_, index) => (
          <span
            key={index}
            style={{
              left: `${(index * 19) % 100}%`,
              animationDelay: `${index * 0.38}s`,
              animationDuration: `${8 + (index % 6)}s`
            }}
          />
        ))}
      </div>

      {won && (
        <div className="confetti" aria-hidden="true">
          {Array.from({ length: 90 }, (_, index) => (
            <i
              key={index}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1.4}s`,
                background: `hsl(${Math.random() * 360}, 90%, 62%)`
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}

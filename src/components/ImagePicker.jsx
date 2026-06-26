export default function ImagePicker({ currentImageId, images, onSelectImage, onUpload, onStart }) {
  return (
    <section className="glass-panel image-picker">
      <div className="section-title">
        <span>Choose image</span>
        <strong>Start → Choose image → Select difficulty → Shuffle → Solve</strong>
      </div>

      <div className="image-options">
        {images.map((item) => (
          <button
            className={currentImageId === item.id ? "selected image-option" : "image-option"}
            key={item.id}
            onClick={() => onSelectImage(item)}
            type="button"
          >
            <img src={item.image} alt={item.name} />
            <span>{item.name}</span>
          </button>
        ))}
      </div>

      <div className="picker-actions">
        <label className="upload-button">
          Upload custom image
          <input accept="image/*" onChange={onUpload} type="file" />
        </label>
        <button onClick={onStart} type="button">Start Puzzle</button>
      </div>
    </section>
  );
}

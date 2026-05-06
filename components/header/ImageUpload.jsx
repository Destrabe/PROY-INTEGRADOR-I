"use client";
import { useState } from "react";

export default function ImageUpload() {
  const [images, setImages] = useState([]);

  const handleFiles = (files) => {
    const arr = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
    }));
    setImages([...images, ...arr]);
  };

  return (
    <div className="upload-box">
      <p>Adjunta imágenes (opcional)</p>
      <input type="file" multiple onChange={(e) => handleFiles(e.target.files)} />

      <div className="preview">
        {images.map((img, i) => (
          <img key={i} src={img.url} />
        ))}
      </div>
    </div>
  );
}
"use client";
import { useState } from "react";
import "./request.css";
import ImageUpload from "@/components/ImageUpload";
import Header from "@/components/header/header";

export default function RequestPage() {
  const [category, setCategory] = useState("");

  const categories = [
    "Tecnología",
    "Hogar",
    "Diseño",
    "Educación",
    "Legal",
    "Transporte",
    "Salud",
    "Otro",
  ];

  return (
    <>
      <Header />
      <div className="page-bg">
        <div className="container">
          <h1 className="title">Nueva solicitud</h1>

          {/* Categorías */}
          <p className="subtitle">¿Qué tipo de servicio necesitas?</p>
          <div className="category-grid">
            {categories.map((cat) => (
              <div
                key={cat}
                className={`category-card ${category === cat ? "active" : ""}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </div>
            ))}
          </div>

          {/* Formulario */}
          <div className="form-box">
            <h3>Describe tu solicitud</h3>

            <input
              className="input"
              placeholder="Ej: Necesito técnico para instalar cámaras de seguridad en casa"
            />

            <textarea
              className="textarea"
              placeholder="Cuéntanos que necesitas exactamente..."
            />

            <div className="row">
              <input className="input" placeholder="S/ 100 - 200" />

              <select className="input">
                <option>Presencial</option>
                <option>Virtual</option>
              </select>
            </div>

            <div className="row">
              <input className="input" placeholder="Distrito y referencia" />

              <select className="input">
                <option>Hoy mismo (urgente)</option>
                <option>Esta semana</option>
              </select>
            </div>
          </div>

          {/* Upload */}
          <ImageUpload />

          {/* Botones */}
          <div className="buttons">
            <button className="btn cancel">Cancelar</button>
            <button className="btn draft">Guardar Borrador</button>
            <button className="btn publish">Publicar solicitud</button>
          </div>
        </div>
      </div>
    </>
  );
}

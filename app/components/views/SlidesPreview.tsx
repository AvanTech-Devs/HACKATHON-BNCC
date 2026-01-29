"use client";

import { useState } from "react";
import { parseRichText } from "@/app/utils/parseRichText";
import { ParsedSlide } from "@/app/utils/slidePreview";
type SlidesPreviewProps = {
  slides: ParsedSlide[];
  editable?: boolean;                // modo edição
  onChange?: (updatedSlides: ParsedSlide[]) => void; // callback ao editar
};

export function SlidesPreview({ slides, editable = false, onChange }: SlidesPreviewProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [localSlides, setLocalSlides] = useState(slides);

  const handleTextChange = (index: number, newText: string) => {
    const updated = [...localSlides];
    const currentSlide = updated[index];
    if (currentSlide.type === "content") {
      updated[index] = { ...currentSlide, text: newText };
    }
    setLocalSlides(updated);
    onChange?.(updated); // informa MaterialDetailsPage
  };

  if (!slides.length) return <p>Nenhum slide gerado.</p>;

  return (
    <>
      <h2>Preview dos Slides</h2>
      <div className="slides-workspace">
        <aside className="slides-sidebar">
  {localSlides.map((slide, index) => (
    <div
      key={index}
      className={`slide-thumb ${index === activeSlide ? "active" : ""}`}
      onClick={() => setActiveSlide(index)}
    >
      <span className="slide-number">{index + 1}</span>
      {slide.type === "cover" ? (
        <strong>{slide.title}</strong>
      ) : (
        <div className="thumb-text">
          {slide.text
            .split("\n")
            .slice(0, 2)
            .map((line, i) => (
              <p key={i}>{parseRichText(line)}</p>
            ))}
        </div>
      )}
    </div>
  ))}
</aside>


        <div className="slide-stage">
          {renderSlide(localSlides[activeSlide], editable, handleTextChange, activeSlide)}
        </div>
      </div>
    </>
  );
}

function renderSlide(
  slide: ParsedSlide,
  editable: boolean,
  onChange?: (index: number, newText: string) => void,
  slideIndex?: number
) {
  if (!slide) return null;

  if (slide.type === "cover") {
    return (
      <div className="slide slide-cover slide-large">
        <div className="slide-header" />
        <h3>{slide.title}</h3>
        <span className="slide-sub">Tópico</span>
      </div>
    );
  }

  return (
    <div className="slide slide-content slide-large">
      <div className="slide-header" />
      <div className="slide-body">
        {editable ? (
          <textarea
            value={slide.text}
            onChange={(e) => onChange?.(slideIndex!, e.target.value)}
            style={{ width: "100%", height: "100%", fontFamily: "inherit" }}
          />
        ) : (
          <div className="slide-text">
            {slide.text
              .split("\n")
              .map((line, i) => (
                <p key={i}>{parseRichText(line)}</p>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

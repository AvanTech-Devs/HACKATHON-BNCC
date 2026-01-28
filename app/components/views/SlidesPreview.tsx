"use client";

import { useState } from "react";
import { parseRichText } from "@/app/utils/parseRichText";
import { ParsedSlide } from "@/app/utils/slidePreview";

type Props = {
  slides: ParsedSlide[];
};

export function SlidesPreview({ slides }: Props) {
  const [activeSlide, setActiveSlide] = useState(0);

  if (!slides.length) {
    return <p>Nenhum slide gerado.</p>;
  }

  return (
    <>
      <h2>Preview dos Slides</h2>

      <div className="slides-workspace">
        {/* SIDEBAR */}
        <aside className="slides-sidebar">
          {slides.map((slide, index) => (
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

        {/* SLIDE PRINCIPAL */}
        <div className="slide-stage">
          {renderSlide(slides[activeSlide])}
        </div>
      </div>
    </>
  );
}

function renderSlide(slide: ParsedSlide) {
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
        <div className="slide-text">
          {slide.text.split("\n").map((line, i) => (
            <p key={i}>{parseRichText(line)}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

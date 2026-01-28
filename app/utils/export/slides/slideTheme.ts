// slideTheme.ts
import PptxGenJS from "pptxgenjs";

export type SlideTheme = {
  background: string;
  titleColor: string;
  textColor: string;
  accent: string;
  titleFontSize: number;
  bodyFontSize: number;
};

// 🎓 Tema Acadêmico Clássico
export const academicTheme: SlideTheme = {
  background: "FFFFFF",
  titleColor: "1F2937",
  textColor: "374151",
  accent: "1D4ED8",
  titleFontSize: 32,
  bodyFontSize: 18,
};

// Fundo padrão
export function applyBackground(
  slide: PptxGenJS.Slide,
  theme: SlideTheme
) {
  slide.background = { color: theme.background };
}

// Linha superior de destaque (FIXED ✅)
export function applyHeaderAccent(
  slide: PptxGenJS.Slide,
  theme: SlideTheme
) {
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: "100%",
    h: 0.15,
    fill: { color: theme.accent },
  });
}

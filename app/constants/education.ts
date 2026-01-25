export type EducationLevel = "fundamental" | "medio";

export const EDUCATION_STRUCTURE = {
  fundamental: {
    label: "Ensino Fundamental",
    years: [
      "1º Ano",
      "2º Ano",
      "3º Ano",
      "4º Ano",
      "5º Ano",
      "6º Ano",
      "7º Ano",
      "8º Ano",
      "9º Ano",
    ],
    disciplines: [
      "Arte",
      "Ciências",
      "Educação Física",
      "Geografia",
      "História",
      "Língua Portuguesa",
      "Matemática",
      "Ensino Religioso",
    ],
  },

  medio: {
    label: "Ensino Médio",
    years: ["1º Ano", "2º Ano", "3º Ano"],
    disciplines: [
      "Língua Portuguesa",
      "Matemática",
      "Biologia",
      "História",
      "Geografia",
      "Física",
      "Química",
      "Arte",
      "Filosofia",
      "Sociologia",
      "Inglês",
      "Educação Física",
    ],
  },
};

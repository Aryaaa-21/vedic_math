import { Technique, VEDIC_TECHNIQUES } from "@/store/useStore";

export interface PracticeQuestion {
  question: string;
  answer: number;
  hint: string;
  source?: "ai" | "local";
}

const multiplySymbol = "×";

const mutateDuplicateQuestion = (question: string) => {
  const parts = question.split(multiplySymbol).map((part) => part.trim());
  if (parts.length !== 2) return question;

  const a = Number.parseInt(parts[0], 10);
  const b = Number.parseInt(parts[1], 10);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return question;

  const nextA = Math.max(2, a + (Math.random() > 0.5 ? 1 : -1));
  const nextB = Math.max(2, b + (Math.random() > 0.5 ? 1 : -1));
  return `${nextA} ${multiplySymbol} ${nextB}`;
};

export function generateLocalPracticeQuestions(
  technique: Technique,
  totalQuestions = 15
): PracticeQuestion[] {
  const questions: PracticeQuestion[] = [];
  const isSuperHard = technique.level >= 9;
  const pool = isSuperHard
    ? VEDIC_TECHNIQUES.filter((item) => item.level >= 9)
    : [technique];

  const seen = new Set<string>();

  for (let i = 0; i < totalQuestions; i++) {
    const pick = pool.length === 1 ? pool[0] : pool[Math.floor(Math.random() * pool.length)];

    let question = "";
    let answer = 0;
    let hint = pick.formula || "Apply the sutra steps.";

    if (pick.id === "ekadhikena-purvena") {
      const tens = Math.floor(Math.random() * 8) + 1;
      const num = tens * 10 + 5;
      question = `${num} ${multiplySymbol} ${num}`;
      answer = num * num;
      hint = `Multiply ${tens} by ${tens + 1} and append 25.`;
    } else if (pick.id === "nikhilam-subtraction") {
      const n1 = Math.floor(Math.random() * 8) + 91;
      const n2 = Math.floor(Math.random() * 8) + 91;
      question = `${n1} ${multiplySymbol} ${n2}`;
      answer = n1 * n2;
      hint = `Find deficits: ${100 - n1} and ${100 - n2}. Cross-subtract, then append the deficits product.`;
    } else if (pick.id === "yavadunam") {
      const deficiency = Math.floor(Math.random() * 6) + 1;
      const num = 100 - deficiency;
      question = `${num} ${multiplySymbol} ${num}`;
      answer = num * num;
      hint = `Deficit is ${deficiency}. Use ${num} - ${deficiency}, then append ${deficiency} squared.`;
    } else if (pick.id === "ekanyunena-purvena") {
      const num = Math.floor(Math.random() * 80) + 11;
      question = `${num} ${multiplySymbol} 99`;
      answer = num * 99;
      hint = `Left part: ${num} - 1. Right part: 99 - (${num} - 1).`;
    } else if (pick.id === "vertically-crosswise") {
      const n1 = Math.floor(Math.random() * 15) + 11;
      const n2 = Math.floor(Math.random() * 15) + 11;
      question = `${n1} ${multiplySymbol} ${n2}`;
      answer = n1 * n2;
      hint = "Solve vertically and crosswise.";
    } else if (pick.id === "anurupyena") {
      const n1 = Math.floor(Math.random() * 8) + 41;
      const n2 = Math.floor(Math.random() * 8) + 41;
      question = `${n1} ${multiplySymbol} ${n2}`;
      answer = n1 * n2;
      hint = `Compare both numbers to sub-base 50. Deficits are ${50 - n1} and ${50 - n2}.`;
    } else {
      const examplesList = pick.examples || [];
      if (examplesList.length > 0) {
        const ex = examplesList[Math.floor(Math.random() * examplesList.length)];
        question = ex.problem.replace(/Ã—/g, multiplySymbol);
        answer = ex.answer;
        hint = pick.formula || hint;
      } else {
        const n1 = Math.floor(Math.random() * 10) + 2;
        const n2 = Math.floor(Math.random() * 10) + 2;
        question = `${n1} ${multiplySymbol} ${n2}`;
        answer = n1 * n2;
        hint = pick.formula || hint;
      }
    }

    let attempt = 0;
    while (seen.has(question) && attempt < 6) {
      attempt++;
      question = mutateDuplicateQuestion(question);
      const parts = question.split(multiplySymbol).map((part) => Number.parseInt(part.trim(), 10));
      if (parts.length === 2 && parts.every(Number.isFinite)) {
        answer = parts[0] * parts[1];
      }
    }

    seen.add(question);
    questions.push({ question, answer, hint, source: "local" });
  }

  return questions;
}

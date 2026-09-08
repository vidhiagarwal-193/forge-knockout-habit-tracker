const PHRASES = [
  "Tiny win. Big deal.",
  "Look at you.",
  "Main character behaviour.",
  "One less thing haunting you.",
  "We take those.",
  "That streak is cooking.",
  "Okay, certified locked in.",
  "Future you just exhaled.",
  "Filed under: handled.",
  "Low-key impressive.",
];

export function randomPhrase() {
  return PHRASES[Math.floor(Math.random() * PHRASES.length)];
}

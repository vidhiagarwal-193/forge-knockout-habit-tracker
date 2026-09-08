export const CATEGORIES = [
  {
    id: "academics",
    label: "Brain Admin",
    emoji: "🎓",
    blurb: "Keep the brain fed.",
    accent: "academics",
  },
  {
    id: "self",
    label: "Body OS",
    emoji: "🌱",
    blurb: "Keep the human alive.",
    accent: "self",
  },
  {
    id: "byob",
    label: "Founder Mode",
    emoji: "🚀",
    blurb: "₹7L doesn't chase itself.",
    accent: "byob",
  },
];

export function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
}

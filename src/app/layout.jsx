import "./globals.css";

export const metadata = {
  title: "MESA Forge — Habit Tracker",
  description: "A personal operating system for ambitious students.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

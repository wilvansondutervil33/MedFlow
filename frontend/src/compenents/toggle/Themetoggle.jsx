import { useTheme } from "../../context/ThemeContest";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className= "button" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
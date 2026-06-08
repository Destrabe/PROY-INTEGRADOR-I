"use client";
import { useThemeStore } from "@/store/themeStore";

export default function ThemeToggle({ onChange }) {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const background = useThemeStore((state) => state.background);
  const textColor = useThemeStore((state) => state.textColor);

  return (
    <>
      <div
        style={{
          backgroundColor: background[theme],
          color: textColor[theme],
        }}
        onClick={() => {
          toggleTheme(theme === "dark" ? "light" : "dark");
          console.log(theme);
        }}
        className="relative flex items-center gap-2 w-fit h-[42px] p-2 rounded-lg border"
      >
        <div
          style={{
            right: theme === "dark" ? "2px" : "36px",
            backgroundColor:
              theme === "dark" ? background["light"] : background["dark"],
          }}
          className="absolute bg-red-400 z-10 h-8 w-8 rounded-full duration-300"
        />
        <div>
          <img src="/svg/moonIcon.svg" alt="Moon icon" width="24" height="24" />
        </div>
        <div>
          <img src="/svg/sunIcon.svg" alt="Sun icon" width="24" height="24" />
        </div>
      </div>
    </>
  );
}

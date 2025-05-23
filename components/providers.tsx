"use client";
import { SessionProvider } from "next-auth/react";
import React, { createContext, useEffect, useState } from "react";
interface themeContextType{
  theme:Theme,
  toggleTheme:()=>void 
}
type Theme = "dark" | "light"
export const themeContext = createContext<themeContextType | null>(null);

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState(() => {
    if(typeof window !== "undefined"){
    const savedTheme = localStorage.getItem("theme") as Theme;
    return savedTheme || "dark";
    }
    return "dark"
  });

  useEffect(()=>{
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme==="dark")
  },[theme])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <themeContext.Provider value={{theme, toggleTheme}}>
      {children}
    </themeContext.Provider>
  );
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
}

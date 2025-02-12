"use client";
import { Sun, Moon, LogOut } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import {  useContext } from "react";
import { themeContext } from "./providers";

export default function Appbar() {
  const session = useSession();
  const useTheme = useContext(themeContext);

  return (
    <div className="fixed backdrop-blur-xl  shadow-lg top-0 w-full h-24  border-b-[0.5px] dark:border-gray-600 border-black border-opacity-50 dark:text-white">
      <div className="flex justify-between mx-12 lg:mx-96 items-center h-full ">
        <div className="flex">
          <div className="font-extrabold text-xl">HabitTracker</div>
        </div>
        <div className="flex h-full items-center gap-8">
          <button onClick={useTheme?.toggleTheme}>
            {useTheme?.theme === "dark" ? <Sun /> : <Moon />}
          </button>
          <div>
            {session.data?.user && (
              <div>
                <button
                  className="h-10 hidden lg:block w-28 rounded-md border-[1px] border-violet-500 text-violet-500 dark:text-white"
                  onClick={() => signOut({ callbackUrl: "/", })}
                >
                  Logout
                </button>
                <button
                  className="block lg:hidden cursor-pointer"
                  onClick={() => signOut}
                >
                  <LogOut
                    className="block lg:hidden cursor-pointer"
                    color="#8e51ff"
                  />
                </button>
              </div>
            )}
            {!session.data?.user && (
              <button
                  className="h-10  w-28 rounded-md border-[1px] border-violet-500 text-violet-500 dark:text-white"
                onClick={() => signIn()}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { Sun, Moon, LogOut } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useContext } from "react";
import { themeContext } from "./providers";
import Image from "next/image";

export default function Appbar() {
  const session = useSession();
  const useTheme = useContext(themeContext);

  return (
    <div className="fixed backdrop-blur-xl  shadow-lg top-0 w-full h-24  border-b-[0.5px] dark:border-gray-600 border-black border-opacity-50 dark:text-white">
      <div className="flex justify-between mx-6 lg:mx-96 items-center h-full ">
        <div className="flex">
          <div className="font-extrabold text-xl">
            {useTheme?.theme === "dark" ? (
              <Image
                src="/habitualLogoDark.png"
                alt=""
                width={100}
                height={100}
              />
            ) : (
              <Image
                src="/habitualLogoLight.png"
                alt=""
                width={100}
                height={100}
              />
            )}
          </div>
        </div>
        <div className="flex h-full items-center gap-8">
          <button onClick={useTheme?.toggleTheme}>
            {useTheme?.theme === "dark" ? <Sun /> : <Moon />}
          </button>
          <div>
            {session.data?.user && (
              <div>
                <button
                  className="h-10 bg-violet-600 hidden lg:block w-28 rounded-md border-[1px] border-violet-500 text-violet-500 dark:text-white"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Logout
                </button>
                <button
                  className="block lg:hidden cursor-pointer"
                  onClick={() => signOut({ callbackUrl: "/" })}
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
                className="h-10 bg-violet-600 w-28 rounded-md border-[1px] border-violet-500 text-white"
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

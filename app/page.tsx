import Appbar from "@/components/Appbar";
import Image from "next/image";
import image from "../public/photo-1484480974693-6ca0a78fb36b.webp"
export default function Home() {
  return (
    <div className="min-h-screen  h-screen bg-stone-200 dark:bg-zinc-900 text-zinc-900 dark:text-white">
      <Appbar />
      <div className="dark:text-white text-3xl flex justify-center items-center w-full h-full container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2">
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Build Better Habits,
              <br />
              <span className="text-violet-600">One Day at a Time</span>
            </h1>
            <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-8">
              {"make progress towards a better you :>"}
            </p>
            <div className="flex items-center space-x-4"></div>
          </div>
          <div className="lg:w-1/2">
            <Image
              src={image}
              height={0}
              width={0}
              alt="Productivity Dashboard"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

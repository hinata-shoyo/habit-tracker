import Appbar from "@/components/Appbar";

export default function Home() {
  return (
    <div className="dark:bg-gray-950 bg-stone-200 h-screen">
      <Appbar />
      <div className="dark:text-white text-3xl flex justify-center items-center w-full h-full">
        <div className="w-1/2">
          <p>make progress towards a better you :{">"}</p>
        </div>
      </div>
    </div>
  );
}

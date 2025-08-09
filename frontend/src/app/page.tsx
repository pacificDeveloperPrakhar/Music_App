import "./style.css"
import Navbar from "./components/navbar";
import Playlist from "./components/Playlist";

export default function Page({
  searchParams,
}: {
  searchParams?: Record<string, string>;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-black ">
      <Navbar />
      <div className="main_portion relative flex-1 m-2">
        <Playlist searchParams={searchParams} />
        <div className="min-h-full flex-1/2 bg-amber-100">main portion</div>
        <div className="min-h-full flex-1/4 bg-green-200">left panel</div>
      </div>
      <div className="playback bg-white">playback</div>
    </div>
  );
}

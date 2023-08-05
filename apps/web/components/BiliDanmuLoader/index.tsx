"use client";

import useBiliDanmaku from "../../hooks/useBiliDanmaku";
import useDanmakuApp from "../../hooks/useDanmakuApp";

const BiliDanmuLoader = () => {
  const { loading, fetch: fetchBiliDanmu } = useBiliDanmaku();
  const { preload, app: danmakuApp } = useDanmakuApp();

  const handleFetchBiliData = async (e) => {
    e.preventDefault();
    const { id } = e.target;
    const biliDanmu = await fetchBiliDanmu({ bvid: id.value });
    preload(biliDanmu);
    danmakuApp.start();
    id.placeholder = id.value;
    id.value = "";
  };

  return (
    <div className="mb-4">
      <label htmlFor="bili-video-id" className="text-3 font-500">Bili Danmu Loader</label>
      <form onSubmit={handleFetchBiliData} className="flex">
        <input
          name="id"
          id="bili-video-id"
          placeholder="Video aid or bvid"
          className="text-3 px-2 py-1 border b-rd-l resize flex-auto focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white font-500 py-1 px-2 text-3 w-16 text-center b-rd-r"
        >
          { loading ? "Loading" : "Fetch" }
        </button>
      </form>
    </div>
  );
};

export default BiliDanmuLoader;
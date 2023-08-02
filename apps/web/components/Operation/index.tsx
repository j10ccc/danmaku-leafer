"use client";

import { useRef, useState, useEffect } from "react";
import type { Mode } from "danmaku-leafer";
import useDanmakuApp from "../../hooks/useDanmakuApp";

interface DynamicModule {
  Mode: typeof Mode | null
}

const Operation = () => {
  const [playing, setPlaying] = useState(false);
  const dynamicModule = useRef<DynamicModule>({ Mode: null });
  const { app: danmakuApp } = useDanmakuApp();
  const contentRef = useRef<HTMLTextAreaElement>();

  const loadDynamicModule = async () => {
    dynamicModule.current = await import("danmaku-leafer");
  };

  useEffect(() => {
    loadDynamicModule();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { content, mode } = e.target;
    danmakuApp.insertBullets({
      text: content.value as any,
      mode: parseInt(mode.value) as any,
      color: "white"
    });
    content.value = "";
  };

  const handleSwitch = () => {
    if (playing) {
      danmakuApp.pause();
    } else {
      danmakuApp.start();
    }
    setPlaying(!playing);
  };

  return (
    <div className="h-full pb-4 px-4 pt-2 b-t">
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className="flex gap-2 mb-2">
          <select name="mode" className="text-gray-700 text-3 font-500 border border-blue-500 rounded-sm py-1 px-2">
            <option value={dynamicModule.current.Mode?.Normal}>Normal</option>
            <option value={dynamicModule.current.Mode?.Top}>Top</option>
            <option value={dynamicModule.current.Mode?.Bottom}>Bottom</option>
          </select>
        </div>
        <div className="h-16 mb-2">
          <textarea
            name="content"
            ref={contentRef}
            className="w-full h-full border border-black-400 rounded-sm resize-none p-2 text-3"
            rows={3}
            placeholder="Input your magic and create miracles!"
            required
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSwitch}
            className="bg-blue-500 text-white font-500 py-1 px-2 rounded-sm text-3"
          >
            { playing ? "Pause app" : "Start app" }
          </button>
          <button
            type="submit"
            disabled={!playing}
            className="bg-blue-500 text-white font-500 py-1 px-2 rounded-sm text-3"
          >
            Submit danmaku~
          </button>
        </div>
      </form>
    </div>
  );
};

export default Operation;
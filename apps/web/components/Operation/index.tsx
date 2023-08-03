"use client";

import { useRef, useEffect } from "react";
import type { Mode } from "danmaku-leafer";
import useDanmakuApp from "../../hooks/useDanmakuApp";

interface DynamicModule {
  Mode: typeof Mode | null
}

const Operation = () => {
  const dynamicModule = useRef<DynamicModule>({ Mode: null });
  const { insert } = useDanmakuApp();
  const formRef = useRef<HTMLFormElement>();

  const loadDynamicModule = async () => {
    dynamicModule.current = await import("danmaku-leafer");
  };

  useEffect(() => {
    loadDynamicModule();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { content, mode } = e.target;
    insert({
      text: content.value.trim(),
      mode: parseInt(mode.value),
      color: "white",
      sender: "User"
    });
    content.value = "";
  };

  return (
    <div className="h-full pb-4 px-4 pt-2 b-t">
      <form
        ref={formRef}
        className="flex flex-col"
        onSubmit={handleSubmit}>
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
            className="w-full h-full border border-black-400 rounded-sm resize-none p-2 text-3"
            rows={3}
            placeholder="Input your magic and create miracles!"
            onKeyDown={(e) => e.key === "Enter" && formRef.current.requestSubmit() }
            required
          />
        </div>
        <div className="flex gap-2">
          <div className="flex-auto" />
          <button
            type="submit"
            className="bg-blue-500 text-white font-500 py-1 px-2 rounded-sm text-3 flex gap-1 flex-items-center"
          >
            <div className="inline-block i-mdi-send" />
            <span>Submit</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Operation;
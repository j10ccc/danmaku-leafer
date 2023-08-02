"use client";

import { useEffect, useRef, useState } from "react";
import type { Danmaku, Mode } from "danmaku-leafer";

interface DynamicModule {
  Danmaku: typeof Danmaku | null;
  Mode: typeof Mode | null
}

const DemoPage = () => {
  const danmakuApp = useRef<Danmaku>();
  const [playing, setPlaying] = useState(false);

  const dynamicModule = useRef<DynamicModule>({ Danmaku: null, Mode: null });

  const loadDynamicModule = async () => {
    dynamicModule.current = await import("danmaku-leafer");
  };

  const createApp = async () => {
    await loadDynamicModule();
    danmakuApp.current = new dynamicModule.current.Danmaku("container");
  };

  useEffect(() => {
    createApp();
  }, []);

  const handleInsertNormal = async () => {
    danmakuApp.current.insertBullets({
      text: "hello",
      mode: dynamicModule.current.Mode.Normal
    });
  };

  const handleInsertTop = async () => {
    danmakuApp.current.insertBullets({
      text: "top",
      mode: dynamicModule.current.Mode.Top
    });
  };

  const handleInsertBottom = async () => {
    danmakuApp.current.insertBullets({
      text: "bottom",
      mode: dynamicModule.current.Mode.Bottom
    });
  };

  const handleSwitch = () => {
    if (playing) {
      danmakuApp.current.pause();
    } else {
      danmakuApp.current.start();
    }
    setPlaying(!playing);
  };

  return (
    <>
      <h1>Demo</h1>
      <div style={{ border: "2px solid black"}}>
        <div id="container" />
      </div>
      <ul>
        <li>
          <button onClick={handleSwitch}>
            { playing ? "pause app" : "start app" }
          </button>
        </li>
        <li> <button disabled={!playing} onClick={handleInsertNormal}>insert normal danmaku</button> </li>
        <li> <button disabled={!playing} onClick={handleInsertBottom}>insert bottom danmaku</button> </li>
        <li> <button disabled={!playing} onClick={handleInsertTop}>insert top danmaku</button> </li>
      </ul>
    </>
  );
};

export default DemoPage;
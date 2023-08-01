"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type {
  Danmaku as Danmaku,
  Bullet as Bullet,
  Mode as Mode
} from "danmaku-leafer";

interface DynamicModule {
  Danmaku: typeof Danmaku | null;
  Bullet: typeof Bullet | null;
  Mode: typeof Mode | null
}

const DemoPage = () => {
  const danmakuApp = useRef<Danmaku>();
  const [playing, setPlaying] = useState(false);

  const dynamicModule = useRef<DynamicModule>({ Danmaku: null, Bullet: null, Mode: null });

  const debugApp = useRef<Danmaku["app"]>();

  const loadDynamicModule = async () => {
    dynamicModule.current = await import("danmaku-leafer");
    console.log(dynamicModule.current);
  };

  const createApp = async () => {
    await loadDynamicModule();
    danmakuApp.current = new dynamicModule.current.Danmaku("container");
    debugApp.current = danmakuApp.current.app;
  };

  useEffect(() => {
    createApp();
  }, []);

  const handleInsertNormal = useCallback(async () => {
    danmakuApp.current.insertBullets(
      new dynamicModule.current.Bullet({
        text: "hello",
        ctime: danmakuApp.current.currentTime + 500,
        mode: dynamicModule.current.Mode.Normal
      })
    );
  }, []);

  const handleInsertTop = async () => {
    danmakuApp.current.insertBullets(
      new dynamicModule.current.Bullet({
        text: "top",
        ctime: danmakuApp.current.currentTime + 500,
        mode: dynamicModule.current.Mode.Top
      })
    );
  };

  const handleInsertBottom = async () => {
    danmakuApp.current.insertBullets(
      new dynamicModule.current.Bullet({
        text: "bottom",
        ctime: danmakuApp.current.currentTime + 500,
        mode: dynamicModule.current.Mode.Bottom
      })
    );
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
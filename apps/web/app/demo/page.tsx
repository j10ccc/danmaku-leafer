"use client";

import { useEffect, useRef, useState } from "react";
import { Bullet, Danmaku } from "danmaku-leafer";
import { Mode } from "danmaku-leafer";

const DemoPage = () => {
  const danmakuApp = useRef<Danmaku>();
  const [playing, setPlaying] = useState(false);

  const debugApp = useRef<Danmaku["app"]>();

  useEffect(() => {
    danmakuApp.current = new Danmaku("container");
    debugApp.current = danmakuApp.current.app;
  }, []);

  const handleInsertNormal = () => {
    danmakuApp.current.insertBullets(
      new Bullet({ text: "hello", ctime: danmakuApp.current.currentTime + 500, mode: Mode.Normal })
    );
  };

  const handleInsertTop = () => {
    danmakuApp.current.insertBullets(
      new Bullet({ text: "top", ctime: danmakuApp.current.currentTime + 500, mode: Mode.Top })
    );
  };

  const handleInsertBottom = () => {
    danmakuApp.current.insertBullets(
      new Bullet({ text: "bottom", ctime: danmakuApp.current.currentTime + 500, mode: Mode.Bottom })
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
      <div id="container" style={{ border: "2px solid black"}}></div>
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
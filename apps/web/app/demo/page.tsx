"use client";

import { useEffect, useRef } from "react";
import { Bullet, Danmaku } from "danmaku-leafer";

const DemoPage = () => {
  const danmakuApp = useRef<Danmaku>();

  const debugApp = useRef<Danmaku["app"]>();

  useEffect(() => {
    danmakuApp.current = new Danmaku("container");
    debugApp.current = danmakuApp.current.app;
  }, []);

  const handleLoad = () => {
    danmakuApp.current.preloadBullets([
      new Bullet({ text: "load", ctime: 0 })
    ]);
  };

  const handleInsert = () => {
    danmakuApp.current.insertBullets(
      new Bullet({ text: "hello", ctime: danmakuApp.current.currentTime + 500 })
    );
  };

  const handlePause = () => {
    danmakuApp.current.pause();
  };

  const handleStart = () => {
    danmakuApp.current.start();
  };

  return (
    <>
      <h1>Demo</h1>
      <div id="container" style={{ border: "2px solid black"}}></div>
      <ul>
        <li> <button onClick={handleLoad}>load danmaku</button> </li>
        <li> <button onClick={handleInsert}>insert danmaku</button> </li>
        <li> <button onClick={handlePause}>pause danmaku</button> </li>
        <li> <button onClick={handleStart}>start danmaku</button> </li>
      </ul>
    </>
  );
};

export default DemoPage;
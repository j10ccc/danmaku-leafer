"use client";

import { useEffect, useRef } from "react";
import { Bullet, Danmaku } from "danmaku-leafer";
import { Leafer, Text } from "leafer-ui";

const DemoPage = () => {
  const danmakuApp = useRef<Danmaku>();

  const debugApp = useRef<Leafer>();

  useEffect(() => {
    danmakuApp.current = new Danmaku("container");
    debugApp.current = danmakuApp.current.app;
  }, []);

  const debugRender = () => {
    debugApp.current.add(new Text({ text: "你好", fill: "black"}));
  };

  const handleLoad = () => {
    danmakuApp.current.preloadBullets([new Bullet({ text: "load" })]);
  };

  const handleInsert = () => {
    danmakuApp.current.insertBullets(new Bullet({ text: "hello" }));
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
        <li> <button onClick={debugRender}>debug render</button> </li>
      </ul>
    </>
  );
};

export default DemoPage;
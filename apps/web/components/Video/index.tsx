"use client";

import { useEffect } from "react";
import useDanmakuApp from "../../hooks/useDanmakuApp";

const Video = () => {
  const danmakuContainerName = "d-container";
  const { mount: mountDanmaku } = useDanmakuApp();

  useEffect(() => {
    mountDanmaku(danmakuContainerName);
  }, []);

  return (
    <div className="w-full bg-black">
      <div style={{ border: "2px solid black" }}>
        <div id={danmakuContainerName} />
      </div>
    </div>
  );
};

export default Video;
"use client";

import { useEffect } from "react";
import useDanmakuApp from "../../hooks/useDanmakuApp";

const Video = () => {
  const danmakuContainerName = "d-container";
  const { mount: mountDanmaku } = useDanmakuApp();

  useEffect(() => {
    mountDanmaku(danmakuContainerName).then(res => {
      res.start();
    });
  }, []);

  return (
    <div className="w-full bg-black">
      <div className="h-full">
        <div id={danmakuContainerName} className="h-full" />
      </div>
    </div>
  );
};

export default Video;
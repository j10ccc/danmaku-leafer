import { create } from "zustand";
import type { Danmaku } from "danmaku-leafer";

interface DanmakuAppState {
  app: Danmaku | null;
  mount: (id: string) => void;
}

const useDanmakuApp = create<DanmakuAppState>(
  (set, get) => ({
    app: null,
    mount: async (id) => {
      const { Danmaku } = await import("danmaku-leafer");
      return set({
        app: new Danmaku(id)
      });
    }
  })
);

export default useDanmakuApp;
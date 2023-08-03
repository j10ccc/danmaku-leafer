import { create } from "zustand";
import type { Danmaku, Mode } from "danmaku-leafer";

interface Danmu {
  id: string;
  text: string;
  mode: Mode;
  color: string;
  sender: string;
  ctime: number;
}

interface DanmakuAppState {
  app: Danmaku | null;
  mount: (id: string) => Promise<Danmaku>;
  list: Danmu[];
  preload: (value: Danmu[]) => void;
  insert: (value: Omit<Danmu, "ctime" | "id">) => void;
}

const useDanmakuApp = create<DanmakuAppState>(
  (set, get) => ({
    app: null,
    mount: async (id) => {
      const { Danmaku } = await import("danmaku-leafer");
      const app = new Danmaku(id);
      set({ app });
      return app;
    },
    list: [],
    preload: (value) => {
      const app = get().app;
      if (!app) return;
      app.preloadBullets(value);
    },
    insert: (value) => {
      const app = get().app;
      if (!app) return;
      const { text, mode, color } = value;
      const { ctime, id } = app.insertBullets({ text, mode, color, residenceTime: 5000 });
      set(state => ( {
        list: state.list.concat([{ ...value, ctime, id }])
      }));
    }

  })
);

export default useDanmakuApp;
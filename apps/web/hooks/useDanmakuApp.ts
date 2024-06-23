import type { Danmaku, Mode } from "danmaku-leafer";
import { create } from "zustand";

export interface Danmu {
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
  preload: (value: Omit<Danmu, "id">[]) => void;
  insert: (value: Omit<Danmu, "ctime" | "id">) => void;
  destroy: () => void;
}

const useDanmakuApp = create<DanmakuAppState>(
  (set, get) => ({
    app: null,
    mount: async (id) => {
      const { Danmaku } = await import("danmaku-leafer");
      const app = new Danmaku({ view: id, fireInterval: 200 });
      set({ app });
      return app;
    },
    list: [],
    preload: (value) => {
      const app = get().app;
      if (!app) return;
      const newBullets = app.preloadBullets(value);
      set({
        list: newBullets.map(item => {
          const { id, text, mode, color, ctime } = item;
          return { id, text, mode, color, ctime, sender: "Other" };
        })
      });
    },
    insert: (value) => {
      const app = get().app;
      if (!app) return;
      const { text, mode, color } = value;
      const { ctime, id } = app.insertBullet({ text, mode, color, residenceTime: 5000 });
      set(state => ({
        list: state.list.concat([{ ...value, ctime, id }])
      }));
    },
    destroy: () => {
      const app = get().app;
      if (!app) return;
      app.destroy();
    }
  })
);

export default useDanmakuApp;

import { Danmaku } from "danmaku-leafer";

export const setupDanmaku = (id) => {
  const app = new Danmaku(id);
  app.start();

  const form = document.querySelector("#form");

  form.addEventListener("submit", e => {
    e.preventDefault();
    const { mode, text } = e.target;
    const res = app.insertBullet({
      mode: mode.value,
      text: text.value
    });
    text.value = "";
  });

};

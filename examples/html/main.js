import { setupDanmaku } from "./setup.js";

const containerId = "d-container";

document.querySelector("#app").innerHTML = `
  <div>
    <h1>Danmaku-leafer HTML Example</h1>
    <div style="font-weight: bold;">Danmaku screen</div>
    <div class="wrapper" style="border: solid; margin-bottom: 1rem">
      <div id=${containerId}></div>
    </div>

    <form id="form">
      <textarea name="text" rows="3" placeholder="App is running, submit your danmu! 🕶️"></textarea>
      <select name="mode">
        <option value="normal">Normal</option>
        <option value="top">Top</option>
        <option value="bottom">Bottom</option>
      </select>
      <button type="submit">Submit</button>
    </form>
  </div>
`;

setupDanmaku(containerId);
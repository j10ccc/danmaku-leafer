# `danmaku-leafer`

Danmaku-leafer is a high performance canvas danmaku for dense data scenario.

It is built using vanilla TypeScript, making it suitable for any environment.

## Usage

```js
import { Danmaku } from "danmaku-leafer";

const app = new Danmaku();
app.start();

app.insertBullet({ mode: "normal", text: "hello danmaku" });
```

# danmaku-leafer [![npm version](https://img.shields.io/npm/v/danmaku-leafer.svg?style=flat)](https://www.npmjs.com/package/danmaku-leafer)

High performance canvas danmaku for dense data scenario.

It is built using vanilla TypeScript, making it suitable for any environment.

## Examples

Examples show danmus render in a `div` element with id `container`.

Vanilla JS

```js
<body>
  <div class="wrapper">
    <div id="container"></div>
  </div>
</body>

<script>
import { Danmaku } from "danmaku-leafer";

const app = new Danmaku("container");
app.start();

app.insertBullet({ mode: "normal", text: "hello danmaku" });
</script>
```

JS library like React

```tsx
import { Danmaku } from "danmaku-leafer";
import { useRef, useEffect } from "react";

export default () => {
  const containerName = "container";

  const app = useRef<Danmaku>();

  useEffect(() => {
    app.current = new Danmaku(containerName);
  }, []);

  const handleInsert = () => {
    app.current?.insertBullet({ mode: "normal", text: "hello" });
  };

  return (
    <>
      <div class="wrapper">
        <div id={containerName} />
      </div>
      <button onClick={handleInsert}>Insert Hello</button>
    </>
  );
};
```

**Note:** Because of Canvas APIs, maybe you should use [lazy loading](https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading#with-external-libraries) to use the package in server side rendering.
## TODOs

- [x] add license
- [x] app animate(bullet motion) event scheduler
- [x] bullet animation(normal, pinned)
- [x] multi bullet placement
- [x] class properties visibility completion
- [ ] floating speed of bullets
- [ ] timeline leap and bullet refresh
- [ ] bullet style completion(initial_rotate...)
- [ ] bullet custom render
- [ ] app support full screen
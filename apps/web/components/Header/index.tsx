const Header = () => {
  return (
    <header className="p-t-2 h-16 flex flex-row flex-items-center px-8 flex-gap-1 flex-none">
      <a href="./" className="decoration-none color-black">
        <div className="font-200 op50 block"> j10ccc </div>
        <div className="font-400 block"> Danmaku-leafer </div>
      </a>
      <div className="flex-auto" />
      <div className="flex gap-2">
        <a href="https://github.com/j10ccc/danmaku-leafer" className="decoration-none color-block text-6 i-mdi-github op60" />
      </div>
    </header>
  );
};

export default Header;
"use client";

import useDanmakuApp from "../../hooks/useDanmakuApp";

const DanmakuList = () => {
  const danmuData = useDanmakuApp(store => store.list);

  return (
    <div className="h-full relative">
      { danmuData.length ?
        <div className="flex flex-col px-4">
          {danmuData.map(danmu => {
            return(
              <div className="my-2" key={danmu.id} style={{ fontSize: ".9em"}}>
                <span className="op-50"> { danmu.sender }：</span>
                <span>{ danmu.text }</span>
              </div>
            );
          })}
        </div>:
        <div className="absolute text-center w-full op-30" style={{ top: "50%", transform: "translateY(-50%)"}}>
          <div className="i-mdi-mailbox-open-up text-8 inline-block" />
          <div className="font-500"> Empty Danmu Box </div>
        </div>
      }
    </div>
  );
};

export default DanmakuList;
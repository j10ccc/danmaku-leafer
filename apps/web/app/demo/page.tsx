import DanmakuList from "../../components/DanmakuList";
import Operation from "../../components/Operation";
import Video from "../../components/Video";

const DemoPage = () => {

  return (
    <div style={{ height: "calc(100vh - 64px)" }}>
      <div className="flex h-full">
        <div className="flex flex-auto">
          <Video />
        </div>
        <div className="flex-none flex flex-col w-72">
          <div className="flex-auto of-y-auto">
            <DanmakuList />
          </div>
          <div className="flex-none">
            <Operation />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
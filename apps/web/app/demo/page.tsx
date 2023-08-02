import Video from "../../components/Video";
import Operation from "../../components/Operation";
import DanmakuList from "../../components/DanmakuList";

const DemoPage = () => {

  return (
    <div style={{ height: "calc(100vh - 64px)" }}>
      <div className="flex h-full">
        <div className="flex flex-auto">
          <Video />
        </div>
        <div className="flex-none flex flex-col w-72 pt-4">
          <div className="flex-auto">
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
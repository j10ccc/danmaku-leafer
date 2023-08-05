/**
 * Thanks @weizhenye for providing parser code and web apis
 *
 * Code reference: https://github.com/weizhenye/Danmaku
 */

import { useState } from "react";
import type { Danmu } from "./useDanmakuApp";

const API_BASE = "https://danmaku.vercel.app/api/bilibili";

const parser = (raw: string): Omit<Danmu, "id">[] => {
  const $xml = new DOMParser().parseFromString(raw, "text/xml");
  // @ts-ignore
  return [...$xml.getElementsByTagName("d")].map(($d) => {
    const p = $d.getAttribute("p");
    if (p === null || $d.childNodes[0] === undefined) return null;
    const values = p.split(",");
    const mode = ({ 6: "normal", 1: "normal", 5: "top", 4: "bottom" })[values[1]];
    if (!mode) return null;
    const fontSize = Number(values[2]) || 25;
    const color = "#" + `000000${Number(values[3]).toString(16)}`.slice(-6);

    return {
      text: $d.childNodes[0].nodeValue,
      mode,
      ctime: values[0] * 1000,
      color,
      sender: "Others"
    };
  }).filter((x) => x !== null);
};

const useBiliDanmaku = () => {
  const [loading, setLoading] = useState(false);

  const fetchImpl = async (props: { aid?: string, bvid?: string }) => {
    const { aid = "", bvid = "" } = props;
    setLoading(true);
    const { data, code, message } = await fetch(`${API_BASE}/video?aid=${aid}&bvid=${bvid}`)
      .then((res) => res.json());
    if (code) {
      throw new Error(message);
    }
    const comments = await fetch(`${API_BASE}/danmaku?cid=${data.cid}`)
      .then((res) => res.text())
      .then(parser);

    setLoading(false);
    return comments;
  };

  return {
    loading,
    fetch: fetchImpl,
  };

};

export default useBiliDanmaku;
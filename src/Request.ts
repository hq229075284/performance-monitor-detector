import communication from "./Communication";
import { AJAX_KEY } from "./constant";

interface IRecord {
  url: string;
  body: any;
  startTime: number;
  endTime: number;
  duration: number;
}

// 监控xhr请求
class NewXHR extends XMLHttpRequest {
  static XMLHttpRequest = window.XMLHttpRequest;
  constructor() {
    super();
  }
  send(body: Parameters<XMLHttpRequest["send"]>[0]) {
    super.send(body);
    body = body instanceof Blob ? "blob" : body;
    const now = Date.now();
    const record: IRecord = {
      body,
      startTime: now,
    } as IRecord;

    const onLoad = (e: ProgressEvent) => {
      const currentXhr = e.currentTarget as XMLHttpRequest;
      record.url = currentXhr.responseURL;
      record.endTime = Date.now();
      record.duration = record.endTime - record.startTime;
      if (typeof window.performance.getEntriesByName === "function") {
        // 精确采集（仅计算接口请求时间）
        const resource = window.performance.getEntriesByName(record.url).pop() as PerformanceResourceTiming;
        record.startTime = resource.startTime;
        record.endTime = resource.responseEnd;
        record.duration = resource.duration;
      }
      communication.sendMessage(AJAX_KEY, record);
    };
    this.addEventListener("load", onLoad);
  }
}

window.XMLHttpRequest = NewXHR;

// 监控fetch请求
if (typeof window.fetch === "function") {
  const _fetch = window.fetch;
  function newFetch(...rest: Parameters<typeof _fetch>) {
    const record: IRecord = {
      url: typeof rest[0] === "string" ? rest[0] : rest[0].url,
      body: rest[1]?.body,
      startTime: Date.now(),
    } as IRecord;
    return _fetch(...rest).then((res) => {
      record.endTime = Date.now();
      record.duration = record.endTime - record.startTime;
      communication.sendMessage(AJAX_KEY, record);
      return res;
    });
  }
  window.fetch = newFetch;
} else {
  if (process.env.NODE_ENV === "development") {
    console.log(`fetch不兼容，故不监控fetch请求`);
  }
}

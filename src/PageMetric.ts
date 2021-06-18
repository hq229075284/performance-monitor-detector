import communication from "./Communication";
import { ENTRY_KEY, PAGE_STAY_TIME_KEY, SOURCE_LOADED_KEY } from "./constant";

// interface extractFnType {
//   <TSource, TKey extends keyof TSource>(source: TSource, extractKeys: TKey[]): Pick<TSource, TKey>;
// }
function extract<TSource, TKey extends keyof TSource>(source: TSource, extractKeys: TKey[]) {
  return extractKeys.reduce((prev, key) => {
    prev[key] = source[key];
    return prev;
  }, {} as Pick<TSource, TKey>);
}

class PageMetric {
  startTime: number = 0;
  endTime: number = 0;
  constructor() {
    this.getStartTime();
    this.listenEndTime();

    this.getEntry();

    this.getStaticSourceLoadingTime();
  }

  // 页面停留时间
  private getStartTime() {
    window.addEventListener("pageshow", () => {
      if (this.startTime) return;
      this.startTime = Date.now();
    });
  }
  private listenEndTime() {
    window.addEventListener("beforeunload", () => {
      this.endTime = Date.now();
      communication.sendMessage(PAGE_STAY_TIME_KEY, this.endTime - this.startTime);
    });
  }
  setStartTime(timestamp: number) {
    this.startTime = timestamp;
  }
  setEndTime(timestamp: number) {
    this.endTime = timestamp;
    communication.sendMessage(PAGE_STAY_TIME_KEY, this.endTime - this.startTime);
    this.startTime = this.endTime;
  }

  // 访问入口
  private getEntry() {
    const matched = window.location.href.match(/entryUrl=([^&]+)/i);
    if (matched && matched[1]) {
      const entryUrl = matched[1];
      communication.sendMessage(ENTRY_KEY, entryUrl);
    }
  }

  // 静态资源加载数据
  private getStaticSourceLoadingTime() {
    window.addEventListener("load", () => {
      const staticSourceList = window.performance.getEntriesByType("source") as PerformanceResourceTiming[];
      type keyEnum = "initiatorType" | "duration" | "name";
      const staticSourceMap = new Map<
        string,
        Pick<PerformanceResourceTiming, keyEnum>[] /* ReturnType中不能给泛型指定参数类型的值，所以直接定义最终要存储的值的类型 */
      >();
      staticSourceList.forEach((staticSourceTiming) => {
        if (!staticSourceMap.has(staticSourceTiming.initiatorType)) {
          staticSourceMap.set(staticSourceTiming.initiatorType, []);
        }
        const sourceInfos = staticSourceMap.get(staticSourceTiming.initiatorType)!;
        sourceInfos.push(extract(staticSourceTiming, ["initiatorType", "duration", "name"]));
        staticSourceMap.set(staticSourceTiming.initiatorType, sourceInfos);
      });

      communication.sendMessage(SOURCE_LOADED_KEY, Object.fromEntries(staticSourceMap));
    });
  }
}

export default new PageMetric();

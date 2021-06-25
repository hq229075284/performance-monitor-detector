import communication from "./Communication";
import { ENTRY_KEY, FIRST_INTERACTIVE_KEY, FIRST_PAINT_KEY, PAGE_STAY_TIME_KEY, SOURCE_LOADED_KEY } from "./constant";
import User from "./User";
import { extract } from "./tool";

// interface extractFnType {
//   <TSource, TKey extends keyof TSource>(source: TSource, extractKeys: TKey[]): Pick<TSource, TKey>;
// }

class PageMetric extends User {
  startTime: number = 0;
  endTime: number = 0;
  constructor() {
    super();
    this.getStartTime();
    this.listenEndTime();

    this.getEntry();

    this.getStaticSourceLoadingTime();

    this.firstInteractiveTime();

    this.firstPaintTime();
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
      communication.sendMessage(ENTRY_KEY, { url: window.location.href, entryUrl });
    }
  }

  // 静态资源加载数据
  private getStaticSourceLoadingTime() {
    window.addEventListener(
      "load",
      () => {
        if (!window.performance.getEntriesByType) {
          console.log("不支持`getEntriesByType`api");
          return;
        }
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
      },
      { once: true }
    );
  }

  // 页面第一次可交互时间
  private firstInteractiveTime() {
    /* const p = new Promise<void>((resolve) => {
      let timer: number;
      let sign = {
        timestamp: 0,
      };
      let onClick: any;
      function getClickHandler(startTime: number) {
        return function () {
          const isNewest = sign.timestamp === startTime;
          if (isNewest && Date.now() - startTime <= 50) {
            clearTimeout(timer);
            document.documentElement.removeEventListener("click", onClick);
            window.removeEventListener("DOMContentLoaded", loop);
            console.log("可交互");
            resolve();
          }
        };
      }
      function simularClick(timestamp: number) {
        sign.timestamp = timestamp;
        document.documentElement.click();
      }
      function loop() {
        let now = Date.now();
        onClick = getClickHandler(now);
        document.documentElement.addEventListener("click", onClick);
        simularClick(now);

        timer = window.setTimeout(() => {
          document.documentElement.removeEventListener("click", onClick);
          loop();
        }, 50);
      }
      document.addEventListener("DOMContentLoaded", loop);
    }); */
    function onDOMContentLoaded() {
      if (!window.performance.getEntriesByType) {
        console.log("不支持`getEntriesByType`api");
        return;
      }
      const { domComplete, fetchStart } = window.performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      communication.sendMessage(FIRST_INTERACTIVE_KEY, domComplete - fetchStart);
      window.removeEventListener("DOMContentLoaded", onDOMContentLoaded);
    }
    window.addEventListener("DOMContentLoaded", onDOMContentLoaded, { once: true });
  }

  // 第一次页面渲染的时间
  private firstPaintTime() {
    function onDOMContentLoaded() {
      if (!window.performance.getEntriesByType) {
        console.log("不支持`getEntriesByType`api");
        return;
      }
      const { domContentLoadedEventEnd, fetchStart } = window.performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      communication.sendMessage(FIRST_PAINT_KEY, domContentLoadedEventEnd - fetchStart);
      window.removeEventListener("DOMContentLoaded", onDOMContentLoaded);
    }
    window.addEventListener("DOMContentLoaded", onDOMContentLoaded, { once: true });
  }
}

export default new PageMetric();

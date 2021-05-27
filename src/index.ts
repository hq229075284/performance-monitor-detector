function getNavigationMonitor() {
  const split_line = "----------------------";
  const navigationTimelineData = window.performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
  const keys = [
    "name",
    "fetchStart",
    ["domainLookupStart", "domainLookupEnd"],
    ["connectStart", "secureConnectionStart", "connectEnd"],
    ["requestStart", "responseStart", "responseEnd"],
    "domInteractive",
    ["domContentLoadedEventStart", "domContentLoadedEventEnd"],
    "domComplete",
    ["loadEventStart", "loadEventEnd"],
    "duration",
  ] as (keyof PerformanceNavigationTiming)[];
  keys.forEach((key: keyof PerformanceNavigationTiming | (keyof PerformanceNavigationTiming)[]) => {
    if (Array.isArray(key)) {
      for (let i = 0; i < key.length; i++) {
        const v = navigationTimelineData[key[i]];
        console.log(`${key[i]}${v ? (typeof v === "string" ? ":" + v : "时间点:" + v + " ms") : "no-data"}`);
        if (!v) continue; // 过滤未捕获的监测数据
        let j = i + 1;
        // 寻找下一个有效的监测数据
        while ((!key[j] || !navigationTimelineData[key[j]]) && j < key.length) {
          j++;
        }
        if (j === key.length) continue; // 未找到下一个，不计算时间差
        console.warn(
          `${key[i]}到${key[j]}耗時:${(navigationTimelineData[key[j]] as number) - (navigationTimelineData[key[i]] as number)} ms`
        );
      }
      console.log(split_line);
    } else {
      const v = navigationTimelineData[key];
      console.log(`${key}${v ? (typeof v === "string" ? ":" + v : "时间点:" + v + " ms") : "no-data"}`);
      console.log(split_line);
    }
  });
  return navigationTimelineData;
}

function sendMonitorData(data: any) {
  const img = new Image();
  img.src = "http://192.168.2.130:9004?" + JSON.stringify(data);
  img.onload = function () {
    console.log("monitor data send success");
  };
}

class autoMonitor {
  constructor() {
    if (!window.performance) {
      console.error(`window.performance unsupported`);
      return;
    }
    window.onload = () => {
      setTimeout(() => {
        const navigationTimelineData = getNavigationMonitor();
        sendMonitorData(navigationTimelineData);
      }, 0);
    };
  }
}

class manualMonitor {}

new autoMonitor();

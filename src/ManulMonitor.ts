import BaseMonitor from "./BaseMonitor";

// 手动监测上报
export default class ManulMonitor extends BaseMonitor {
  constructor() {
    super();
    if (!this) return;
  }
  report() {}
}

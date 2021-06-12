export default class BaseMonitor {
  constructor() {
    if (!window.performance) {
      console.error(`window.performance unsupported`);
      return;
    }
  }
}

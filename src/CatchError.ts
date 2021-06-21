import communication from "./Communication";

class CatchError {
  constructor() {
    this.listenGlobalError();
  }
  // 参考：https://www.cnblogs.com/karthuslorin/p/13601538.html
  listenGlobalError() {
    window.addEventListener(
      "error",
      (e) => {
        communication.sendMessage("error", e.message);
      },
      true
    );
    window.addEventListener(
      "unhandledrejection",
      (e) => {
        communication.sendMessage("error", e.reason);
      },
      true
    );
    // @ts-ignore
    if (!!window.Vue) {
      // @ts-ignore
      window.Vue.config.errorHandler = function (err, vm, info) {
        communication.sendMessage("error", { err, info });
      };
    }
  }
}

export default new CatchError();

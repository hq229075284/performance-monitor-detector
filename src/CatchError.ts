import communication from "./Communication";

class CatchError {
  constructor() {
    this.listenGlobalError();
  }
  listenGlobalError() {
    window.addEventListener("error", (e) => {
      communication.sendMessage("error", e.message);
    });
  }
}

export default new CatchError();

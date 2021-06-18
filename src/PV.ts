import communication from "./Communication";
import { PV_KEY } from "./constant";

class PV {
  constructor() {
    this.auto();
  }
  private auto() {
    window.addEventListener("pageshow", this.onPageShow);
  }
  report() {
    communication.sendMessage(PV_KEY, window.location.href);
  }
  private onPageShow() {
    communication.sendMessage(PV_KEY, window.location.href);
  }
}

export default new PV();

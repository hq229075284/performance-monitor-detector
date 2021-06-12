import AutoMonitor from "./AutoMonitor";
import ManulMonitor from "./ManulMonitor";

declare global {
  interface Window {
    autoMonitor: AutoMonitor;
    manulMonitor: ManulMonitor;
  }
}

window.autoMonitor = new AutoMonitor();
window.manulMonitor = new ManulMonitor();

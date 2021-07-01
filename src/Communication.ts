import User from "./User";
import { extract } from "./tool";

const navigatorInfo = extract(window.navigator, ["userAgent", "language", "platform", "product"]);
let device;
let version;
if (/(iphone|ipad|ipod).*? os (\d+_\d+_\d+)/i.test(navigatorInfo.userAgent)) {
  device = RegExp.$1;
  version = `${RegExp.$2.replaceAll("_", ".")}`;
}
if (/(android) (\d+)/i.test(navigatorInfo.userAgent)) {
  device = RegExp.$1;
  version = `${RegExp.$2}`;
}
if (/(windows) nt (\d+)/i.test(navigatorInfo.userAgent)) {
  device = RegExp.$1;
  version = `${RegExp.$2}`;
}
if (/(mac os x) (\d+_\d+_\d+)/i.test(navigatorInfo.userAgent)) {
  device = RegExp.$1;
  version = `${RegExp.$2.replaceAll("_", ".")}`;
}
const clientInfo = { ...navigatorInfo, device, version };

class Communication extends User {
  appKey: string = "";
  setAppKey(key: string) {
    this.appKey = key;
  }
  sendMessage(key: string, payload: any) {
    if (window.process?.env?.NODE_ENV === "production" && this.appKey) {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src =
          "http://127.0.0.1:3000/message?" +
          encodeURIComponent(JSON.stringify({ key, appKey: this.appKey, clientInfo, payload, userInfo: this.userInfo }));
        img.onload = function () {
          console.log("monitor data send success");
          resolve();
        };
      });
    }
  }
}

export default new Communication();

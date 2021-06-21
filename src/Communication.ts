import User from "./User";
import { extract } from "./tool";

const navigatorInfo = extract(window.navigator, ["userAgent", "language", "platform", "product"]);
let device;
let version;
if (/(iphone|ipad|ipod).*? os (\d+_\d+_\d+)/i.test(navigatorInfo.userAgent)) {
  device = RegExp.$1;
  version = `${RegExp.$2.replace("_", ".")}`;
}
if (/(android) (\d+)/i.test(navigatorInfo.userAgent)) {
  device = RegExp.$1;
  version = `${RegExp.$2}`;
}
if (/(windows) nt (\d+)/i.test(navigatorInfo.userAgent)) {
  device = RegExp.$1;
  version = `${RegExp.$2}`;
}
const clientInfo = { ...navigatorInfo, device, version };

class Communication extends User {
  sendMessage(key: string, payload: any) {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.src = "http://192.168.2.130:9004?" + JSON.stringify({ key, clientInfo, payload });
      img.onload = function () {
        console.log("monitor data send success");
        resolve();
      };
    });
  }
}

export default new Communication();

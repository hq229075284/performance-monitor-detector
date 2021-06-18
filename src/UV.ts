import communication from "./Communication";
import { UV_KEY } from "./constant";

class UV {
  setUser(userInfo: any) {
    this.tryReport(userInfo);
  }
  getPrevLoginTime() {
    return new Promise<number>((resolve) => {});
  }
  getDate(timestamp: number) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}/${month}/${day}`;
  }
  protected async tryReport(userInfo: any) {
    const now = Date.now();
    const prevTime = await this.getPrevLoginTime();
    if (this.getDate(now) === this.getDate(prevTime)) {
      return;
    }
    communication.sendMessage(UV_KEY, { timestamp: now, userInfo });
  }
}

export default new UV();

import communication from "./Communication";
import { UV_KEY } from "./constant";
import User from "./User";
class UV extends User {
  constructor() {
    super();
    super.subscribe(this.onUserInfoChange.bind(this));
  }
  onUserInfoChange() {
    this.tryReport(this.userInfo);
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
    // const now = Date.now();
    // const prevTime = await this.getPrevLoginTime();
    // if (this.getDate(now) === this.getDate(prevTime)) {
    //   return;
    // }
    communication.sendMessage(UV_KEY, { url: window.location.href });
  }
}

export default new UV();

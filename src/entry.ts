import pv from "./PV";
import uv from "./UV";
import pageMetric from "./PageMetric";

// alert(window.navigator.userAgent);

export default {
  pv,
  uv,
  pageMetric,
};

// UV采集测试用例
uv.setUser({ usercode: 1, username: "hanq" });

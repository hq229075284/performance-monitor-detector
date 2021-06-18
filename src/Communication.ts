class Communication {
  sendMessage(key: string, payload: any) {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.src = "http://192.168.2.130:9004?" + JSON.stringify({ key, payload });
      img.onload = function () {
        console.log("monitor data send success");
        resolve();
      };
    });
  }
}

export default new Communication();

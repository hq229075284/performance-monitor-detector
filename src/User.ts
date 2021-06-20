class User {
  static _userInfo = null;
  static listeners: Function[] = [];
  get userInfo() {
    return User._userInfo;
  }
  set userInfo(v) {
    User._userInfo = v;
  }
  setUser(userInfo: any) {
    this.userInfo = userInfo;
  }
  subscribe(fn: Function) {
    User.listeners.push(fn);
  }
  unsubscribe(fn: Function) {
    User.listeners.splice(User.listeners.indexOf(fn), 1);
  }
}

export default User;

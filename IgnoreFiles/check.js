class student {
  constructor() {}

  home(type) {
    let data = this.getInfo(type, 1);
    return data + 5;
  }

  getInfo(type, status) {
    return 10;
  }
  userId() {
    return 5;
  }

  finalmarks(type) {
    let internal = this.internal(type);
    let external = this.external(type);
    let finalmark = internal + external;
  }
}
module.exports = student;

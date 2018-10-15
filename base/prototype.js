var Cal = function (x, y) {
  this.x = x
  this.y = y
}

Cal.prototype = {
  add: function (x, y) {
    return x + y
  },
  sub: function (x, y) {
    return x - y
  }
}

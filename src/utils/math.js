const operatorHandler = function (a, op, b) {
  switch (op) {
    case "<=":
      if (a <= b) {
        return -1;
      } else {
        return 1;
      }
      break;
    case ">=":
      if (a >= b) {
        return -1;
      } else {
        return 1;
      }
      break;
    case "<":
      if (a < b) {
        return -1;
      } else if (a == b) {
        return 0;
      } else {
        return 1;
      }
      break;
    case ">":
      if (a > b) {
        return -1;
      } else if (a == b) {
        return 0;
      } else {
        return 1;
      }
      break;
  }
};

module.exports = {
  operatorHandler,
};

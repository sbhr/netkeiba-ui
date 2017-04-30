class Util {

  static deleteNewLine(str) {
    return str.replace('\n', '');
  }

  static setSaturday(dateObj) {
    if (dateObj.getDay() !== 6) {
      if (dateObj.getDay() > 0) {
        dateObj.setDate(dateObj.getDate() + 1);
      } else {
        dateObj.setDate(dateObj.getDate() - 1);
      }
      Util.setSaturday(dateObj);
    }
  }

  static getSatAndSun(dateObj) {
    Util.setSaturday(dateObj);
    const firstDay = dateObj.toLocaleDateString();
    dateObj.setDate(dateObj.getDate() + 1);
    const secondDay = dateObj.toLocaleDateString();
    return [firstDay, secondDay];
  }

  static getSatAndSunForUrl(dateObj) {
    Util.setSaturday(dateObj);
    const mm = `0${(dateObj.getMonth() + 1)}`.slice(-2);
    const dd1 = `0${dateObj.getDate()}`.slice(-2);
    dateObj.setDate(dateObj.getDate() + 1);
    const dd2 = `0${dateObj.getDate()}`.slice(-2);
    return [mm + dd1, mm + dd2];
  }

  static convertIntoJST(str) {
    const date = new Date(str);
    return date.toLocaleDateString();
  }

  static convertIntoUTC(str) {
    const date = new Date(str);
    return date.toUTCString();
  }

  static convertIntoISODate(str) {
    const date = new Date(str);
    return date.toISOString();
  }
}

module.exports = Util;

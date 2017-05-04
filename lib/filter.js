class Filter {
  constructor(filters, raceDatas) {
    this.filters = filters;
    this.raceDatas = raceDatas;
  }

  set raceData(raceDatas) {
    this._raceDatas = raceDatas;
  }

  get raceData() {
    return this._raceData;
  }

  applyFileter() {
    this.raceDatas.forEach(raceData => {
      this.filters.forEach(filter => {
        this.addResult(raceData.data[0], filter);
      });
    });
  }

  addResult(raceData, filter) {
    if (filter.place && raceData.place !== filter.place) return;
    if (filter.type && raceData.type !== filter.type) return;
    if (filter.distance && !this.isInDistance(filter.distance, raceData.distance)) return;

    raceData.horses.forEach((horse) => {
      if (this.hasBlood(filter.blood, horse.blood)) {
        horse.filtered = filter;
      }
    });
  }

  isInDistance(indicator, origin) {
    let flg = true;
    indicator.split(',').forEach((dist) => {
      if (flg) {
        const num = dist.slice(-4);
        const operator = dist.slice(0,dist.indexOf(num));
        switch (operator) {
          case '<':
            flg = Number(origin) < Number(num);
            break;
          case '<=':
            flg = Number(origin) <= Number(num);
            break;
          case '>':
            flg = Number(origin) > Number(num);
            break;
          case '>=':
            flg = Number(origin) >= Number(num);
            break;
          case '=':
            flg = Number(origin) == Number(num);
            break;
        }
      }
    });
    return flg;
  }

  hasBlood(indicator, origin) {
    return (indicator === origin.father || indicator === origin.mother || origin.detail.some(x => x === indicator));
  }
}

module.exports = Filter;

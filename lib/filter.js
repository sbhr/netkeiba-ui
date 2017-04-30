class Filter {
  constructor(filters, raceDatas) {
    const temp = [
      {
        blood: 'ディープインパクト',
        distance: '',
        place: '中山',
        type: ''
      },
      {
        blood: 'サウスヴィグラス',
        distance: '<=1400',
        place: '',
        type: 'ダ'
      }
    ];
    this.filters = temp;
    this.raceDatas = raceDatas;
  }

  set raceData(raceDatas) {
    this._raceDatas = raceDatas;
  }

  get raceData() {
    return this._raceData;
  }

  applyFileter(racaData, filter) {
    if (filter.place && raceData.place !== filter.place) return;
    if (filte.type && raceData.type !== filter.type) return;
    if (filter.distance && !isInDistance(filter.distance, raceData.distance)) return;

    raceData.horses.forEach((horse) => {
      if (hasBlood(filter.blood, horse)) {
        horse.filterd = filter;
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
    return (indicator.father === origin || indicator.mother === origin || indicator.detail.some(x => x === origin));
  }
}

module.exports = Filter;

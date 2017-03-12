const client = require('cheerio-httpcli');
const fs = require('fs');
const db = require('./db');
const logger = require('./logger');

const raceData = {};
let outputFile = '';

const delNL = str => str.replace('\n', '');

const setRaceDate = (objToday) => {
  if (objToday.getDay() !== 6) {
    if (objToday.getDay() > 0) {
      objToday.setDate(objToday.getDate() + 1);
    } else {
      objToday.setDate(objToday.getDate() - 1);
    }
    setRaceDate(objToday);
  }
};

const getRaceDate = (objDate) => {
  setRaceDate(objDate);
  const firstDay = objDate.toLocaleDateString();
  objDate.setDate(objDate.getDate() + 1);
  const secondDay = objDate.toLocaleDateString();
  return [firstDay, secondDay];
};

const getRaceDateForUrl = (objDate) => {
  setRaceDate(objDate);
  const mm = `0${(objDate.getMonth() + 1)}`.slice(-2);
  const dd1 = `0${objDate.getDate()}`.slice(-2);
  objDate.setDate(objDate.getDate() + 1);
  const dd2 = `0${objDate.getDate()}`.slice(-2);
  outputFile = `raceData_${mm}${dd1}_${mm}${dd2}.json`;
  return [mm + dd1, mm + dd2];
};

const makeBloodUrl = (horseUrl) => {
  const index = horseUrl.lastIndexOf('/', horseUrl.lastIndexOf('/') - 1) + 1;
  return `${horseUrl.slice(0, index)}ped/${horseUrl.slice(index + Math.abs(0))}`;
};

const makeShutubaUrl = (raceUrlPath) => {
  let shutubaUrl = `http://race.netkeiba.com${raceUrlPath.replace('_old', '')}`;
  const idx = shutubaUrl.indexOf('&mode');
  if (idx > 0) {
    shutubaUrl = shutubaUrl.substring(0, shutubaUrl.indexOf('&mode'));
  }
  return `${shutubaUrl}&mode=shutuba`;
};

const getShutubaUrl = (raceUrl) => {
  const retArray = [];
  const ret = client.fetchSync(raceUrl);
  logger.scrape.info('fetchSync getShutubaUrl');
  ret.$('#race_list_body .race_top_hold_list .racename a').each((idx, elem) => {
    retArray.push(makeShutubaUrl(elem.attribs.href).replace('top', 'shutuba'));
  });
  return retArray;
};

const scrapeShutubaTable = (shutubaUrl, idxOfDay) => {
  const shutubaData = client.fetchSync(shutubaUrl);

  logger.scrape.info(`fetch scrapeShutubaTable ${shutubaUrl}`);
  const racePlace = shutubaData.$('.race_place .active').text();
  raceData[racePlace] = Object.prototype.hasOwnProperty.call(raceData, racePlace) ? raceData[racePlace] : [];
  const race = {};
  race.num = delNL(delNL(shutubaData.$('.racedata dt').text())).replace('R', '');
  race.name = shutubaData.$('.racedata dd h1').text();
  const status = shutubaData.$('.racedata dd p span').text();
  race.type = status.slice(0, status.indexOf('m')).slice(0, 1);
  race.distance = status.slice(0, status.indexOf('m')).slice(1);
  race.horses = [];
  for (let i = 0; i < shutubaData.$('.shutuba_table tr').length - 1; i += 1) {
    race.horses.push({});
  }
  shutubaData.$('.shutuba_table tr').each((idx, elem) => {
    if (idx > 0) {
      race.horses[idx - 1].waku = elem.firstChild.next.attribs.class.replace('waku', '');
    }
  });
  shutubaData.$('.shutuba_table tr .umaban').each((idx, elem) => {
    race.horses[idx].umaban = elem.firstChild.data;
  });
  shutubaData.$('.shutuba_table tr .txt_smaller').each((idx, elem) => {
    race.horses[idx].blood = {
      father: delNL(elem.firstChild.data),
      mother: delNL(elem.firstChild.next.next.data),
      detail: [],
    };
  });
  shutubaData.$('.shutuba_table tr .h_name a').each((idx, elem) => {
    race.horses[idx].name = elem.firstChild.data;
    const bloodUrl = makeBloodUrl(elem.attribs.href);
    const ret = client.fetchSync(bloodUrl);
    logger.scrape.info(`fetchSync blood ${bloodUrl}`);
    ret.$('.blood_table td a').each((i, element) => {
      try {
        const horseName = element.children[0].data;
        if (horseName !== '産駒' && horseName !== '血統' && horseName !== undefined) {
          race.horses[idx].blood.detail.push(delNL(delNL(horseName)));
        }
      } catch (e) {
        logger.error.error(e);
      }
    });
  });
  const raceDatesStr = getRaceDate(new Date());
  try {
    db.insert({
      date: raceDatesStr[idxOfDay],
      place: racePlace,
      num: race.num,
      data: race,
    });
  } catch (e) {
    logger.error.error(e);
  }
  raceData[racePlace].push(race);
  fs.writeFile(outputFile, JSON.stringify(raceData, null, 2));
};

const raceDates = getRaceDateForUrl(new Date());
for (let i = 0; i < raceDates.length; i += 1) {
  const shutubaUrls = getShutubaUrl(`http://race.netkeiba.com/?pid=race_list&id=c${raceDates[i]}`);
  for (let j = 0; j < shutubaUrls.length; j += 1) {
    scrapeShutubaTable(shutubaUrls[j], i);
  }
}

const client = require('cheerio-httpcli');
const Logger = require('../lib/logger');
const MongoClient = require('../lib/mongo-client');
const Util = require('../lib/util');

const raceArray = [];

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
  Logger.scrapeLog('info', 'fetchSync getShutubaUrl');
  ret.$('#race_list_body .race_top_hold_list .racename a').each((idx, elem) => {
    retArray.push(makeShutubaUrl(elem.attribs.href).replace('top', 'shutuba'));
  });
  return retArray;
};

const scrapeShutubaTable = (shutubaUrl, idxOfDay) => {
  const shutubaData = client.fetchSync(shutubaUrl);

  Logger.scrapeLog('info', `fetch scrapeShutubaTable ${shutubaUrl}`);
  const racePlace = shutubaData.$('.race_place .active').text();
  const race = {};
  race.place = racePlace;
  race.num = Util.deleteNewLine(Util.deleteNewLine(shutubaData.$('.racedata dt').text())).replace('R', '');
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
      father: Util.deleteNewLine(elem.firstChild.data),
      mother: Util.deleteNewLine(elem.firstChild.next.next.data),
      detail: [],
    };
  });
  shutubaData.$('.shutuba_table tr .h_name a').each((idx, elem) => {
    race.horses[idx].name = elem.firstChild.data;
    const bloodUrl = makeBloodUrl(elem.attribs.href);
    const ret = client.fetchSync(bloodUrl);
    Logger.scrapeLog('info', `fetchSync blood ${bloodUrl}`);
    ret.$('.blood_table td a').each((i, element) => {
      try {
        const horseName = element.children[0].data;
        if (horseName !== '産駒' && horseName !== '血統' && horseName !== undefined) {
          race.horses[idx].blood.detail.push(Util.deleteNewLine(Util.deleteNewLine(horseName)));
        }
      } catch (e) {
        Logger.errorLog('error', e.message);
      }
    });
  });
  const raceDatesStr = Util.getSatAndSun(new Date());
  const insObj = {
    date: raceDatesStr[idxOfDay],
    place: racePlace,
    num: race.num,
    data: race,
  };
  raceArray.push(insObj);
};

const raceDates = Util.getSatAndSunForUrl(new Date());
for (let i = 0; i < raceDates.length; i += 1) {
  const shutubaUrls = getShutubaUrl(`http://race.netkeiba.com/?pid=race_list&id=c${raceDates[i]}`);
  for (let j = 0; j < shutubaUrls.length; j += 1) {
    scrapeShutubaTable(shutubaUrls[j], i);
  }
}
const mongoClient = new MongoClient();
mongoClient.insertRaceDatas(raceArray);

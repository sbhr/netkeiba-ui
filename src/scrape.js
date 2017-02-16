const client = require('cheerio-httpcli');
const fs = require('fs');

const url = 'http://race.netkeiba.com/?pid=race&id=p201705010611&mode=shutuba';
const raceData = {};

const delNL = str => str.replace('\n', '');
const makeBloodUrl = (horseUrl) => {
  const index = horseUrl.lastIndexOf('/', horseUrl.lastIndexOf('/') - 1) + 1;
  return `${horseUrl.slice(0, index)}ped/${horseUrl.slice(index + Math.abs(0))}`;
};

const scrapeShutubaTable = (url) => {
  client.fetch(url, (err, $) => {
    const place = $('.race_place .active').text();
    raceData[place] = raceData.hasOwnProperty(place) ? raceData[place] : [];
    const race = {};
    race.index = delNL(delNL($('.racedata dt').text())).replace('R','');
    race.name = $('.racedata dd h1').text();
    const status = $('.racedata dd p span').text();
    race.type = status.slice(0, status.indexOf('m')).slice(0, 1);
    race.distance = status.slice(0, status.indexOf('m')).slice(1);
    race.horses = [];
    for (let i = 0; i < $('.shutuba_table tr').length - 1; i += 1) {
      race.horses.push({});
    }
    $('.shutuba_table tr').each((index, elem) => {
      if (index > 0) {
        race.horses[index - 1].waku = elem.firstChild.next.attribs.class.replace('waku', '');
      }
    });
    $('.shutuba_table tr .umaban').each((index, elem) => {
      race.horses[index].umaban = elem.firstChild.data;
    });
    $('.shutuba_table tr .txt_smaller').each((index, elem) => {
      race.horses[index].blood = {
        father: delNL(elem.firstChild.data),
        mother: delNL(elem.firstChild.next.next.data),
        detail: [],
      };
    });
    $('.shutuba_table tr .h_name a').each((index, elem) => {
      race.horses[index].name = elem.firstChild.data;
      const bloodUrl = makeBloodUrl(elem.attribs.href);
      const ret = client.fetchSync(bloodUrl);
      ret.$('.blood_table td a').each((i, element) => {
        const horseName = element.children[0].data;
        if (horseName !== '産駒' && horseName !== '血統' && horseName !== undefined) {
          race.horses[index].blood.detail.push(delNL(delNL(horseName)));
        }
      });
    });
    raceData[place].push(race);
    fs.writeFile('data.json', JSON.stringify(raceData, null, 2));
  });
};

scrapeShutubaTable(url);

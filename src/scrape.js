const client = require('cheerio-httpcli');
const fs = require('fs');

const url = 'http://race.netkeiba.com/?pid=race&id=p201705010611&mode=shutuba';
const raceData = {};

const delNL = str => str.replace('\n', '');
String.prototype.splice = function(idx, rem, s) {
      return (this.slice(0, idx) + s + this.slice(idx + Math.abs(rem)));
};
const makeBloodUrl = url => url.splice(url.lastIndexOf('/', url.lastIndexOf('/')-1)+1, 0, 'ped/');

client.fetch(url, (err, $) => {
  raceData.index = delNL(delNL($('.racedata dt').text()));
  raceData.name = $('.racedata dd h1').text();
  raceData.config = $('.racedata dd p span').text();
  raceData.horses = [];
  for (let i = 0; i < $('.shutuba_table tr').length - 1; i += 1) {
    raceData.horses.push({});
  }
  $('.shutuba_table tr').each((index, elem) => {
    if (index > 0) {
      raceData.horses[index-1].waku = elem.firstChild.next.attribs.class.replace('waku','');
    }
  });
  $('.shutuba_table tr .umaban').each((index, elem) => {
    raceData.horses[index].umaban = elem.firstChild.data;
  });
  $('.shutuba_table tr .txt_smaller').each((index, elem) => {
    raceData.horses[index].blood = {
      father: delNL(elem.firstChild.data),
      mother: delNL(elem.firstChild.next.next.data),
      detail: [],
    };
  });
  $('.shutuba_table tr .h_name a').each((index, elem) => {
    raceData.horses[index].name = elem.firstChild.data;
    const blood_url = makeBloodUrl(elem.attribs.href);
    const ret = client.fetchSync(blood_url);
    ret.$('.blood_table td a').each((i, elem) => {
      const horse_name = elem.children[0].data;
      if (horse_name !== '産駒' && horse_name !== '血統' && horse_name !== undefined) {
        raceData.horses[index].blood.detail.push(delNL(delNL(horse_name)));
      }
    });
  });
  fs.writeFile('data.json', JSON.stringify(raceData, null, 2));
});


const client = require('cheerio-httpcli');
const fs = require('fs');

const url = 'http://race.netkeiba.com/?pid=race&id=p201705010611&mode=shutuba';
const raceData = {};

const delNL = str => str.replace('\n', '');
const makeBloodUrl = (horseUrl) => {
  const index = horseUrl.lastIndexOf('/', horseUrl.lastIndexOf('/') - 1) + 1;
  return `${horseUrl.slice(0, index)}ped/${horseUrl.slice(index + Math.abs(0))}`;
};

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
      raceData.horses[index - 1].waku = elem.firstChild.next.attribs.class.replace('waku', '');
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
    const bloodUrl = makeBloodUrl(elem.attribs.href);
    const ret = client.fetchSync(bloodUrl);
    ret.$('.blood_table td a').each((i, element) => {
      const horseName = element.children[0].data;
      if (horseName !== '産駒' && horseName !== '血統' && horseName !== undefined) {
        raceData.horses[index].blood.detail.push(delNL(delNL(horseName)));
      }
    });
  });
  fs.writeFile('data.json', JSON.stringify(raceData, null, 2));
});


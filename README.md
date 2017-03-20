# netkeiba-scrape

## how to
```
$ npm install
$ npm run scrape
```

## Race data
```
{
    "_id" : ObjectId("58cf7ca016d7917a91e8e932"),
    "date" : ISODate("2017-03-24T15:00:00Z"),
    "place" : "阪神",
    "num" : 1,
    "data" : [
        {
            "horses" : [
                {
                    "name" : "ファミーユボヌール",
                    "blood" : {
                        "detail" : [
                            "マンハッタンカフェ",
                            "サンデーサイレンス",
                            "Halo",
                            "Turn-to",
                            "Nothirdchance",
                            "Cosmah",
                            "Cosmic Bomb",
                            "Almahmoud",
                            "Wishing Well",
                            "Understanding",
                            "Promised Land",
                            "Pretty Ways",
                            "Mountain Flower",
                            "Montparnasse",
                            "Edelweiss",
                            "サトルチェンジ",
                            "Law Society",
                            "Alleged",
                            "Hoist the Flag",
                            "Princess Pout",
                            "Bold Bikini",
                            "Boldnesian",
                            "Ran-Tan",
                            "Santa Luciana",
                            "Luciano",
                            "Henry the Seventh",
                            "Light Arctic",
                            "Suleika",
                            "Ticino",
                            "Schwarzblaurot",
                            "レッドルンバ",
                            "Red Ransom",
                            "Roberto",
                            "Turn-to",
                            "Nothirdchance",
                            "Bramalea",
                            "Nashua",
                            "Rarelea",
                            "アラビアII",
                            "Damascus",
                            "Sword Dancer",
                            "Kerala",
                            "Christmas Wind",
                            "Bally Free",
                            "Rumba Azul",
                            "Fabulous Dancer",
                            "Northern Dancer",
                            "Natalma",
                            "Last of the Line",
                            "The Axe",
                            "Bryonia",
                            "Rare Sound",
                            "Rarity",
                            "Hethersett",
                            "Who Can Tell",
                            "Haunting",
                            "Lord Gayle",
                            "Grey Fleck"
                        ],
                        "mother" : "レッドルンバ",
                        "father" : "マンハッタンカフェ"
                    },
                    "umaban" : "1",
                    "waku" : "1"
                },
                ︙
            ],
            "distance" : "1400",
            "type" : "ダ",
            "name" : "３歳未勝利",
            "num" : "1"
        }
    ]
}
```

## database config.yaml
```
db:
  host: <IP_ADDRRESS>
  port: <PORT>
  name: <DATABASE_NAME>
  user: <USER_NAME>
  password: <PASSWORD>
```

## collection model
```
const RaceSchema = new mongoose.Schema({
  date: Date,
  place: String,
  num: Number,
  data: Array,
});
```

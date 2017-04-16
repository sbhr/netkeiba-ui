<race-data>
  <h5 show={ !dateSlected } class="h5">日付を選択してください</h5>
  <div show={ dateSlected } class="tabs is-centered">
    <ul>
      <li each={ place,i in places } class={ is-active: parent.selectedId === place}><a onclick={ highlight }>{ place }</a></li>
    </ul>
  </div>
  <table class="table" show={ placeSelected }>
    <thead>
      <tr>
        <th>#</th>
        <th>Type</th>
        <th>Distance</th>
        <th>Name</th>
      </tr>
    </thead>
    <tbody>
      <tr each={ raceData, i in raceDatas }>
        <td>{ raceData.num }</td>
        <td>{ raceData.type }</td>
        <td>{ raceData.distance }</td>
        <td>{ raceData.name }</td>
      </tr>
    </tbody>
  </table>
  <script type="es6">
    this.dateSlected = false;
    this.placeSelected = false;
    const self = this;
    obs.on('setRaceData', function(result) {
      self.dateSlected = true;
      self.places = Array.from(new Set(result.map(x => x.place)));
      self.datas = result;
      self.update();
    });
  </script>
  <script>
    highlight(e) {
      self.placeSelected = true;
      self.selectedId = e.item.place;
      self.raceDatas = self.datas.filter(x => x.place === self.selectedId).map(x => x.data[0]);
      self.raceDatas.sort((a, b) => a.num - b.num);
      console.log(self.raceDatas);
      self.update();
    }
  </script>
</race-data>

<race-data>
  <h5 show={ !dateSlected } class="h5">日付を選択してください</h5>
  <div show={ dateSlected } class="tabs is-centered">
    <ul>
      <li each={ place,i in places } class={ is-active: parent.selectedId === place}><a onclick={ setPlaceData.bind(this) }>{ place }</a></li>
    </ul>
  </div>
  <table class="table" show={ placeSelected }>
    <thead>
      <tr>
        <th>#</th>
        <th>Type</th>
        <th>Distance</th>
        <th>Name</th>
        <th>Data</th>
      </tr>
    </thead>
    <tfoot>
      <tr>
        <th>#</th>
        <th>Type</th>
        <th>Distance</th>
        <th>Name</th>
        <th>Data</th>
      </tr>
    </tfoot>
    <tbody>
      <tr each={ raceData, i in raceDatas } class={ is-selected: parent.raceSelectedId === raceData.num } onclick={ setHorseData.bind(this) }>
        <td>{ raceData.num }</td>
        <td>{ raceData.type }</td>
        <td>{ raceData.distance }</td>
        <td>{ raceData.name }</td>
        <td>
          <div show={ parent.raceSelectedId === raceData.num }>
            <ul>
              <li each={ horse, i in raceData.horses}>{ horse.waku }枠{ horse.umaban }番: { horse.name }</li>
            <ul>
          </div>
        </td>
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
    setPlaceData(e) {
      self.placeSelected = true;
      self.selectedId = e.item.place;
      self.raceDatas = self.datas.filter(x => x.place === self.selectedId).map(x => x.data[0]);
      self.raceDatas.sort((a, b) => a.num - b.num);
      self.update();
    }

    setHorseData(e) {
      self.raceSelectedId = self.raceSelectedId === e.item.raceData.num ? null : e.item.raceData.num;
      self.update();
    }
  </script>
</race-data>

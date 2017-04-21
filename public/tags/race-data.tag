<race-data>
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
      <tr each={ raceData, i in raceDatas } class={ is-selected: parent.raceSelectedId === raceData.num } onclick={ setHorseData }>
        <th>{ raceData.num }</th>
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
    this.placeSelected = false;
    const self = this;
    obs.on('setPlaceData', function(e, datas) {
      self.datas = datas;
      self.selectedId = e.item.place;
      self.raceDatas = self.datas.filter(x => x.place === self.selectedId).map(x => x.data[0]);
      self.raceDatas.sort((a, b) => a.num - b.num);
      self.update();
    });
    obs.on('setPlaceSelected', function() {
      self.placeSelected = true;
      self.update();
    });
    obs.on('unsetPlaceSelected', function() {
      self.placeSelected = false;
      self.update();
    });
  </script>
  <script>
    setHorseData(e) {
      self.raceSelectedId = self.raceSelectedId === e.item.raceData.num ? null : e.item.raceData.num;
      self.update();
    }
  </script>
</race-data>

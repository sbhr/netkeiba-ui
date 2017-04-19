<place-tab>
  <h5 show={ !dateSlected } class="h5">日付を選択してください</h5>
  <div show={ dateSlected } class="tabs is-centered">
    <ul>
      <li each={ place,i in places } class={ is-active: parent.selectedId === place}><a onclick={ setPlaceData }>{ place }</a></li>
    </ul>
  </div>
  <script type="es6">
    this.dateSlected = false;
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
      obs.trigger('setPlaceData', e, self.datas);
    }
  </script>
</place-tab>

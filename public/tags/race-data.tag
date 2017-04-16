<race-data>
  <h5 show={ !chosen } class="h5">日付を選択してください</h5>
  <div show={ chosen } class="tabs is-centered">
    <ul>
      <li each={ place,i in places }><a>{ place }</a></li>
    </ul>
  </div>
  <script type="es6">
    this.chosen = false;
    const self = this;
    obs.on('setRaceData', function(result) {
      self.chosen = true;
      self.places = Array.from(new Set(result.map(x => x.place)));
      console.log(result);
      self.update();
    });
  </script>
</race-data>

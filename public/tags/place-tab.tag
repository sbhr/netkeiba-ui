<place-tab>
  <div show={ dateSlected } class="tabs is-centered">
    <ul>
      <li each={ place, i in places } class={ is-active: parent.selectedPlace === place }><a onclick={ setPlaceData.bind(this, place) }>{ place }</a></li>
    </ul>
  </div>
  <script type="es6">
    this.dateSlected = false;
    const self = this;
    obs.on('setDateSelected', function() {
      self.dateSlected = true;
      self.update();
    });
    obs.on('unsetDateSelected', function() {
      self.dateSlected = false;
      self.update();
    });
    obs.on('setPlaceTab', function(result) {
      self.places = Array.from(new Set(result.map(x => x.place)));
      self.update();
    });
    obs.on('unsetSelectedPlace', function() {
      self.selectedPlace = false;
      self.update();
    });
  </script>
  <script>
    setPlaceData(place, e) {
      self.selectedPlace = place;
      obs.trigger('setPlaceData', e);
      obs.trigger('setPlaceSelected');
    }
  </script>
</place-tab>

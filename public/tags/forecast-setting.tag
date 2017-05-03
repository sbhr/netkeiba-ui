<forecast-setting>
  <div class="field" show={ settingSelected }>
    <label class="label">Forecast</label>
    <p class="control">
      <textarea class={ textarea: true, is-danger: !isParseable } placeholder="Textarea" ref="forecast"></textarea>
    </p>
    <p class="help is-danger" show={ !isParseable }>This forecast is invalid</p>
  </div>
  <div class="field" show={ settingSelected }>
    <p class="control">
      <button class="button is-primary" onclick={ submitForecast } type="button">Submit</button>
    </p>
  </div>
  <script type="es6">
    this.settingSelected = false;
    this.isParseable = true;
    const self = this;
    obs.on('setSettingSelected', function() {
      self.settingSelected = true;
      self.update();
    });
    obs.on('unsetSettingSelected', function() {
      self.settingSelected = false;
      self.update();
    });
  </script>
  <script>
    submitForecast() {
      try {
        self.forecast = JSON.parse(self.refs.forecast.value);
        self.isParseable = true;
        obs.trigger('setForecast', self.forecast);
      } catch (e) {
        self.isParseable = false;
      }
    }
  </script>
</forecast-setting>

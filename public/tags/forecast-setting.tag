<forecast-setting>
  <div class="field" show={ settingSelected }>
    <label class="label">Forecast</label>
    <p class="control">
      <textarea class={ textarea: true, is-danger: !isParseable } placeholder="Textarea" ref="forecast"></textarea>
    </p>
    <p class="help is-danger" show={ !isParseable }>This forecast is invalid</p>
    <p class="help is-success" show={ isSubmitSuccess }>Submit!</p>
  </div>
  <div class="field" show={ settingSelected }>
    <p class="control">
      <button class="button is-primary" onclick={ submitForecast } type="button">Submit</button>
    </p>
  </div>
  <script type="es6">
    this.settingSelected = false;
    this.isParseable = true;
    this.isSubmitSuccess = false;
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
        parent.forecast = JSON.parse(self.refs.forecast.value);
        self.isParseable = true;
        this.isSubmitSuccess =true;
      } catch (e) {
        self.isParseable = false;
        this.isSubmitSuccess = false;
      }
    }
  </script>
</forecast-setting>

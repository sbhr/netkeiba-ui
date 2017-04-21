<forecast-setting>
  <div class="field" show={ settingSelected }>
    <label class="label">Forecast</label>
    <p class="control">
      <textarea class="textarea" placeholder="Textarea"></textarea>
    </p>
  </div>
  <script type="es6">
    this.settingSelected = false;
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
</forecast-setting>

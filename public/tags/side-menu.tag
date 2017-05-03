<side-menu>
  <aside class="menu">
    <p class="menu-label">Setting</p>
    <ul class="menu-list">
      <li><a onclick={ changeSettingMode }>Forecast</a></li>
    </ul>
    <p class="menu-label">Race Date</p>
    <ul class="menu-list">
      <li each={ date, i in raceDates }>
        <a class={ is-active: parent.selectedMenu === date } onclick={ getRaceDatas }>{ date }</a>
      </li>
    </ul>
  </aside>
  <script type="es6">
    this.raceDates = opts.raceDates.split(',');
    const self = this;
  </script>
  <script>
    getRaceDatas(e) {
      self.resetMenu();
      const path = `/data/${e.item.date}`;
      this.selectedMenu = e.item.date;
      $.ajax({
        url: path,
        method: "GET",
        success: function(result, textStatus, xhr) {
          obs.trigger('unsetSettingSelected');
          obs.trigger('setDateSelected');
          obs.trigger('setPlaceTab', result);
          parent.raceDatas = result;
          console.log("ok");
          self.filterRaceDatas();
        },
        error: function(xhr, textStatus, error) {
          console.log("error");
        }
      });
    }
    filterRaceDatas() {
      const path = "/filter";
      const forecast = parent.forecast;
      const postData = parent.raceDatas;
      if (forecast) {
        $.ajax({
          url: path,
          method: "POST",
          data: {
            forecast,
            postData
          },
          success: function(result, textStatus, xhr) {
            console.log("filterok");
            parent.raceDatas = result;
          },
          error: function(xhr, textStatus, error) {
            console.log("error");
          }
        });
      }
    }
    resetMenu() {
      obs.trigger('unsetDateSelected');
      obs.trigger('unsetPlaceSelected');
      obs.trigger('unsetSelectedPlace');
    }
    changeSettingMode(e) {
      self.resetMenu();
      obs.trigger('setSettingSelected');
    }
  </script>
</side-menu>

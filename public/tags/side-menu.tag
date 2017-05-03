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
        },
        error: function(xhr, textStatus, error) {
          console.log("error");
        }
      });
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

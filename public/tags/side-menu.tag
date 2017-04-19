<side-menu>
  <aside class="menu">
    <p class="menu-label">Race Date</p>
    <ul class="menu-list">
      <li each={ date, i in raceDates }>
        <a class={ is-active: parent.selectedMenu === date } onclick={ getRaceDatas }>{ date }</a>
      </li>
    </ul>
  </aside>
  <script type="es6">
    this.raceDates = opts.raceDates.split(',');
  </script>
  <script>
    getRaceDatas(e) {
      var path = "/data/" + e.item.date;
      this.selectedMenu = e.item.date;
      $.ajax({
        url: path,
        method: "GET",
        success: function(result, textStatus, xhr) {
          obs.trigger('setRaceData', result);
          console.log("ok");
        },
        error: function(xhr, textStatus, error) {
          console.log("error");
        }
      });
    }
  </script>
</side-menu>

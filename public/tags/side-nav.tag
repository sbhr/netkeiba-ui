<side-nav>
  <nav class="panel">
    <p class="panel-heading">Race Date</p>
    <a each={ date, i in raceDates } class="panel-block" onclick={ getRaceData }>{ date }</a>
  </nav>
  <script type="es6">
    this.raceDates = opts.raceDates.split(',');
  </script>
  <script>
    getRaceData(e) {
      var path = "/data/" + e.item.date;
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
</side-nav>

<side-nav>
  <nav class="panel">
    <p class="panel-heading">Race Date</p>
    <a each={ date, i in raceDates } class="panel-block" href="#">{ date }</a>
  </nav>
  <script type="es6">
    this.raceDates = opts.raceDates.split(',');
  </script>
</side-nav>

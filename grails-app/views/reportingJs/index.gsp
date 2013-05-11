<html>
<head>
	<title>Grails Reporting JS</title>
	<meta name="layout" content="moon" />
	<link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-combined.min.css" rel="stylesheet">
	<link rel="stylesheet" href="http://pivotal.github.io/jasmine/lib/jasmine-1.3.1/jasmine.css"/>
	<link rel="stylesheet" href="http://ajax.aspnetcdn.com/ajax/jquery.dataTables/1.9.4/css/jquery.dataTables.css"/>
	<link rel="stylesheet" href="http://ajax.aspnetcdn.com/ajax/jquery.dataTables/1.9.4/css/jquery.dataTables_themeroller.css"/>
	

	<script type="text/javascript">
		var config = {
			contextPath: '${request.contextPath}'
		}
	</script>
	<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
	<script src="http://pivotal.github.io/jasmine/lib/jasmine-1.3.1/jasmine.js"></script>
	<script src="http://pivotal.github.io/jasmine/lib/jasmine-1.3.1/jasmine-html.js"></script>
	<script src="http://raw.github.com/fabiooshiro/jasmine-step/master/jasmine-step.js"></script>
	<script src="http://ajax.aspnetcdn.com/ajax/jquery.dataTables/1.9.4/jquery.dataTables.min.js"></script>
	<r:require module="reporting-js" />

	<script type="text/javascript" id="srcTest">
	$(function(){

		describe("criteria js", function(){

			var reportingJs;

			function initReporting(){
				step("init reporting", function(done){
					$('#userInterface').empty();
					reportingJs = new ReportingJs({
						domainName: 'Sale',
						outputTable: $('#table'),
						userInputUI: $('#userInterface'),
						onInit: function(){
							done();
						}
					});
				});
			}

			it("should list domains from server", function(){
				step("call server", function(done){
					ReportingJs.listDomains(function(domains){
						expect(domains.length).toEqual(4);
						done();
					});
				});
			});

			it("should create an domain target", function(){
				initReporting();
				step("verify userInterface", function(){
					expect($('ul.domain-properties li').length).toEqual(11);
				});
			});

			it("should sum amount, group by year", function(){
				initReporting();
				step("configure sum", function(){
					$('[name="Sale.amount.visible"]').prop('checked', true);
					$('[name="Sale.amount.projections"]').val('sum');
				})
				step("configure group by year", function(){
					$('[name="Sale.year.visible"]').prop('checked', true);
					$('[name="Sale.year.projections"]').val('groupProperty');
				});
				step("load report", function(done){
					reportingJs.loadReport();
					done(function(){
						return $('#table tbody tr td').length == 4
					})
				});
				step("check results", function(){
					//$('#table').dataTable();
					var results = [];
					$('#table tbody tr td').each(function(item, c){
						results.push($(c).text());
					});
					expect(results.sort()).toEqual(["2012", "2013", "22954.2", "62695.8"]);
				});
			});

			it("should accept custom render method", function(){
				initReporting();
				step("configure sum", function(){
					$('[name="Sale.amount.visible"]').prop('checked', true);
					$('[name="Sale.amount.projections"]').val('sum');
				})
				step("configure group by year", function(){
					$('[name="Sale.year.visible"]').prop('checked', true);
					$('[name="Sale.year.projections"]').val('groupProperty');
				});
				step("create renderer", function(done){
					reportingJs.addCellRenderer({
						column: 'amount',
						render: function(value){
							return $('<td>').text("$ " + value).css('text-align', 'right');
						}
					});
					reportingJs.addCellRenderer({
						column: 'year',
						render: function(value){
							return $('<td>').text(value).css('text-align', 'center');
						}
					});
					reportingJs.addCellRenderer({
						column: 'quantity',
						render: function(value){
							return $('<td>').text(value).css('text-align', 'right');
						}
					});
					reportingJs.loadReport();
					done(function(){
						return $('#table tbody tr td').length == 4
					})
				});
			});

			it("should list music as column (x axis) and year/quarter as Y axis", function(){
				initReporting();
				step("create renderer", function(){
					reportingJs.addCellRenderer({
						column: 'amount',
						render: function(value){
							return $('<td>').text("$ " + value).css('text-align', 'right');
						}
					});
					reportingJs.addCellRenderer({
						column: 'year',
						render: function(value){
							return $('<td>').text(value).css('text-align', 'center');
						}
					});
					reportingJs.addCellRenderer({
						column: 'quantity',
						render: function(value){
							return $('<td>').text(value).css('text-align', 'right');
						}
					});
				});
				step("add axis configurations", function(){
					$('[name="Sale.music.visible"]').prop('checked', true);
					$('[name="Sale.music.projections"]').val('groupProperty');
					$('[name="Sale.quarter.visible"]').prop('checked', true);
					$('[name="Sale.quarter.projections"]').val('groupProperty');
					$('[name="Sale.year.visible"]').prop('checked', true);
					$('[name="Sale.year.projections"]').val('groupProperty');
					$('[name="Sale.quantity.visible"]').prop('checked', true);
					$('[name="Sale.quantity.projections"]').val('sum');
					$('[name="Sale.amount.visible"]').prop('checked', true);
					$('[name="Sale.amount.projections"]').val('sum');
					reportingJs.setXaxis([
						{prop: 'music'}
					]);
					reportingJs.setYaxis([
						{prop: 'year'},
						{prop: 'quarter'}
					]);
					reportingJs.setCellValues([
						{prop: 'amount', projections: 'sum'},
						{prop: 'quantity', projections: 'sum'}
					]);
					reportingJs.setOrderBy([
						{sort: 'year', order: 'asc'},
						{sort: 'quarter', order: 'asc'},
						{sort: 'quantity', order: 'desc'}
					]);
				});
				step("load report", function(){
					reportingJs.loadReport();
				});
			});

		});
	});
	</script>
</head>
<body>
	<div class="row-fluid">
		<div class="span3">
			<div id="userInterface">
			</div>
		</div>
		<div class="span9">
			<table id="table" class="table table-striped table-bordered table-hover table-condensed">
				<thead>
				</thead>
				<tbody>
				</tbody>
			</table>
		</div>
	</div>
	<div class="row-fluid">
		<pre id="sourcecode" style="clear: both">
		</pre>
	</div>
<script type="text/javascript">
$(function(){
	$('#sourcecode').text($('#srcTest').html());
});

(function() {
  var jasmineEnv = jasmine.getEnv();
  jasmineEnv.updateInterval = 250;

  /**
   Create the `HTMLReporter`, which Jasmine calls to provide results of each spec and each suite. The Reporter is responsible for presenting results to the user.
   */
  var htmlReporter = new jasmine.HtmlReporter();
  jasmineEnv.addReporter(htmlReporter);

  /**
   Delegate filtering of specs to the reporter. Allows for clicking on single suites or specs in the results to only run a subset of the suite.
   */
  jasmineEnv.specFilter = function(spec) {
    return htmlReporter.specFilter(spec);
  };

  /**
   Run all of the tests when the page finishes loading - and make sure to run any previous `onload` handler

   ### Test Results

   Scroll down to see the results of all of these specs.
   */
  var currentWindowOnload = window.onload;
  window.onload = function() {
    if (currentWindowOnload) {
      currentWindowOnload();
    }

    //document.querySelector('.version').innerHTML = jasmineEnv.versionString();
    execJasmine();
  };

  function execJasmine() {
    jasmineEnv.execute();
  }
})();
</script>
</body>
</html>
		
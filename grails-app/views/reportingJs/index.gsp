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
	<script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.0.6/angular.min.js"></script>
	
	<r:require module="reporting-js" />

	<script type="text/javascript" id="srcTest">
	$(function(){

		describe("criteria js", function(){

			var reportingJs;

			function initReporting(){
				step("init reporting", function(done){
					reportingJs = new ReportingJs({
						domainName: 'Sale',
						outputTable: $('#table'),
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

			xit("should create an domain target", function(){
				initReporting();
				step("verify userInterface", function(){
					expect($('.domain-property').length).toEqual(11);
				});
			});

			xit("should sum amount, group by year", function(){
				initReporting();
				step("configure sum", function(){
					$('[name="Sale.amount.projections"]').val('sum');
				})
				step("configure group by year", function(){
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

			xit("should accept custom render method", function(){
				initReporting();
				step("configure sum", function(){
					$('[name="Sale.amount.projections"]').val('sum');
				})
				step("configure group by year", function(){
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
					reportingJs.setXaxis([
						{prop: 'music', projections: 'groupProperty'}
					]);
					reportingJs.setYaxis([
						{prop: 'year', projections: 'groupProperty'},
						{prop: 'quarter', projections: 'groupProperty'}
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
	<div ng-app="reportAngular">
		<div class="row-fluid" ng-controller="ReportCtrl">
			<div class="span3">
				<form class="form-horizontal">
					<div id="userInterface">
						<table>
							<tr ng-repeat="prop in domain.props">
								<th style="text-align: right">
									{{prop.name}}:
								</th>
								<td>
									<input type="button" value="Y index" ng-click="addY(prop)"/>
									<input type="button" value="X index" ng-click="addX(prop)"/>
									<input type="button" value="Value" ng-click="addValue(prop)"/>
									<input type="button" value="Sort" ng-click="addOrder(prop)"/>
								</td>
							</tr>
						</table>

						<div>
							Y:
							<span ng-repeat="prop in conf.yAxis">
								{{prop.prop}} 
								<a href="javascript: void(0);" ng-click="removeY(prop)">[x]</a>; 
							</span>
						</div>
						<div>
							X:
							<span ng-repeat="prop in conf.xAxis">
								{{prop.prop}}
								<a href="javascript: void(0);" ng-click="removeX(prop)">[x]</a>; 
							</span>
						</div>
						<div>
							V:
							<div ng-repeat="prop in conf.cellValues">
								{{prop.prop}}
								<select ng-model="prop.format" ng-options="c.name for c in prop.formats" class="input-small" style="display: inline">
									<option value="">Format</option>
								</select>
								<select ng-model="prop.projections" class="input-small" style="display: inline">
									<option value="groupProperty">group</option>
									<option value="sum">sum</option>
									<option value="avg">avg</option>
									<option value="min">min</option>
									<option value="max">max</option>
								</select>
								<a href="javascript: void(0);" ng-click="removeV(prop)">[x]</a>; 
							</div>
						</div>
						<div>
							S:
							<span ng-repeat="prop in conf.orderBy">
								{{prop.sort}}
								<select ng-model="prop.order" class="input-small" style="display: inline">
									<option value="asc">asc</option>
									<option value="desc">desc</option>
								</select>
								<a href="javascript: void(0);" ng-click="removeS(prop)">[x]</a>; 
							</span>
						</div>
						<input type="button" value="Report!" ng-click="makeReport()"/>
					</div>
				</form>
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
		
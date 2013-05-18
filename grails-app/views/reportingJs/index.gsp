<html>
<head>
	<title>Grails Reporting JS</title>
	<meta name="layout" content="moon" />
	<link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-combined.min.css" rel="stylesheet">
	<link type="text/css" href="${createLinkTo(dir:'css',file:'jasmine.css')}" />
	<link rel="stylesheet" href="http://ajax.aspnetcdn.com/ajax/jquery.dataTables/1.9.4/css/jquery.dataTables.css"/>
	<link rel="stylesheet" href="http://ajax.aspnetcdn.com/ajax/jquery.dataTables/1.9.4/css/jquery.dataTables_themeroller.css"/>
	<link rel="stylesheet" href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css"/>
	

	<script type="text/javascript">
		var config = {
			contextPath: '${request.contextPath}'
		}
	</script>
	<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
	<script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
	
	<g:javascript src="jasmine.js" />
	<g:javascript src="jasmine-html.js" />
	<g:javascript src="jasmine-step.js" />

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
				step("load report", function(done){
					reportingJs.loadReport();
					done(function(){
						return $('#table tbody tr').length > 0;
					});
				});
			});

			it("should filter results", function(){
				initReporting();
				step("simple table", function(){
					reportingJs.setCellValues([
						{prop: 'music', projections: 'groupProperty'},
						{prop: 'year', projections: 'groupProperty'},
						{prop: 'quarter', projections: 'groupProperty'},
						{prop: 'amount', projections: 'sum'},
						{prop: 'quantity', projections: 'sum'}
					]);
					reportingJs.setOrderBy([
						{sort: 'year', order: 'asc'},
						{sort: 'quarter', order: 'asc'},
						{sort: 'quantity', order: 'desc'}
					]);
					reportingJs.setFilter([
						{prop: 'year', method: 'eq', val: 2013}
					]);
				});
				step("load report", function(done){
					reportingJs.loadReport();
					done(function(){
						return $('#table tbody tr').length == 10;
					});
				});
			});

			it("should format Y", function(){
				initReporting();
				step("set up", function(){
					reportingJs.setYaxis([
						{prop: 'date', projections: 'groupProperty'},
					]);
					reportingJs.setCellValues([
						{prop: 'music', projections: 'groupProperty'},
						{prop: 'year', projections: 'groupProperty'},
						{prop: 'quarter', projections: 'groupProperty'},
						{prop: 'amount', projections: 'sum'},
						{prop: 'quantity', projections: 'sum'}
					]);
					reportingJs.setOrderBy([
						{sort: 'year', order: 'asc'},
						{sort: 'quarter', order: 'asc'},
						{sort: 'quantity', order: 'desc'}
					]);
					reportingJs.setFilter([
						{prop: 'date', method: 'ge', val: '2013-01-01'},
						{prop: 'date', method: 'le', val: '2013-01-10'},
					]);
				});
				step("load report", function(done){
					reportingJs.loadReport();
					done(function(){
						return $('#table tbody tr').length == 10;
					});
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
									<input type="button" value="Row" ng-click="addY(prop)"/>
									<input type="button" value="Col" ng-click="addX(prop)"/>
									<input type="button" value="Val" ng-click="addValue(prop)"/>
									<input type="button" value="Sort" ng-click="addOrder(prop)"/>
									<input type="button" value="Filter" ng-click="addFilter(prop)"/>
								</td>
							</tr>
						</table>

						<div>
							Y:
							<span ng-repeat="prop in conf.yAxis">
								{{prop.prop}} 
								<select ng-model="prop.format" ng-options="c.name for c in prop.formats" class="input-small" style="display: inline">
									<option value="">Format</option>
								</select>
								<a href="javascript: void(0);" ng-click="removeY(prop)">[x]</a>; 
							</span>
						</div>
						<div>
							X:
							<span ng-repeat="prop in conf.xAxis">
								{{prop.prop}}
								<select ng-model="prop.format" ng-options="c.name for c in prop.formats" class="input-small" style="display: inline">
									<option value="">Format</option>
								</select>
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
						<div>
							F:
							<div ng-repeat="prop in conf.filter">
								{{prop.prop}}
								<select ng-model="prop.method" ng-options="c for c in prop.methods" class="input-small" style="display: inline">
									<option value="">Comparator</option>
								</select>
								<input type="text" model="prop" filter-val class="input-small"/>
								<a href="javascript: void(0);" ng-click="removeF(prop)">[x]</a>; 
							</div>
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
		
<div ng-app="reportAngular">
	<div class="row-fluid" ng-controller="ReportCtrl" ng-init="domainName='${modelName}';tableSelector='#table'">
		<div class="span3">
			<form class="form-horizontal">
				<div id="userInterface">
					<table>
						<tr ng-repeat="prop in domain.props">
							<th style="text-align: right">
								{{prop.name}}:
							</th>
							<td>
								<input type="button" value="Row" ng-click="addY(prop)" class="btn btn-small"/>
								<input type="button" value="Col" ng-click="addX(prop)" class="btn btn-small"/>
								<input type="button" value="Val" ng-click="addValue(prop)" class="btn btn-small"/>
								<input type="button" value="Sort" ng-click="addOrder(prop)" class="btn btn-small"/>
								<input type="button" value="Filter" ng-click="addFilter(prop)" class="btn btn-small"/>
							</td>
						</tr>
					</table>

					<div>
						<strong>Rows:</strong>
						<table>
							<tr ng-repeat="prop in conf.yAxis">
								<td>{{prop.prop}}</td>
								<td>
									<select ng-model="prop.format" ng-options="c.name for c in prop.formats" class="input-small" style="display: inline">
										<option value="">Format</option>
									</select>
								</td>
								<td>
									<a href="javascript: void(0);" ng-click="removeY(prop)" class="btn btn-mini"><i class="icon-trash"><span class="hide">remove</span></i></a> 
								</td>
							</tr>
						</table>
					</div>
					<div>
						<strong>Cols:</strong>
						<table>
							<tr ng-repeat="prop in conf.xAxis">
								<td>{{prop.prop}}</td>
								<td>
									<select ng-model="prop.format" ng-options="c.name for c in prop.formats" class="input-small" style="display: inline">
									<option value="">Format</option>
									</select>
								</td>
								<td>
									<a href="javascript: void(0);" ng-click="removeX(prop)" class="btn btn-mini"><i class="icon-trash"><span class="hide">remove</span></i></a> 
								</td>
							</tr>
						</table>
					</div>
					<div>
						<strong>Values:</strong>
						<table>
							<tr ng-repeat="prop in conf.cellValues">
								<td>{{prop.prop}}</td>
								<td>
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
								</td>
								<td>
									<a href="javascript: void(0);" ng-click="removeV(prop)" class="btn btn-mini"><i class="icon-trash"><span class="hide">remove</span></i></a> 
								</td>
							</tr>
						</table>
					</div>
					<div>
						<strong>Sort:</strong>
						<div ng-repeat="prop in conf.orderBy">
							{{prop.sort}}
							<select ng-model="prop.order" class="input-small" style="display: inline">
								<option value="asc">asc</option>
								<option value="desc">desc</option>
							</select>
							<a href="javascript: void(0);" ng-click="removeS(prop)">[x]</a>; 
						</div>
					</div>
					<div>
						<strong>Filter:</strong>
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
</div>
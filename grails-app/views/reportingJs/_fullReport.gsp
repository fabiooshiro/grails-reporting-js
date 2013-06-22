
<div ng-app="reportAngular">
	<div class="row-fluid" ng-controller="ReportCtrl" ng-init="domainName='${modelName}';tableSelector='#table';contextPath='${request.contextPath}';criteriaAppenderFunctionName='${criteriaAppender}';thRendererFunctionName='${thRenderer}'">
		<div class="span3">
			<form class="form-horizontal">
				<div id="userInterface">
					<table>
						<tr ng-repeat="report in reports">
							<td>
								<a href="#reportName" ng-click="loadReport(report)">{{report.name}}</a>
							</td>
							<td>
								<a href="javascript: void(0);" class="btn btn-mini" ng-click="deleteReport(report)"><i class="icon-trash"><span class="hide">remove</span></i></a> 
							</td>
						</tr>
					</table>
					<input type="button" value="New report" ng-click="newReport()" class="btn"/>
					<div ng-show="report">
						<div><input type="text" ng-model="report.name" placeholder="Report name" /></div>
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
							<table>
								<tr ng-repeat="prop in conf.orderBy">
									<td>{{prop.sort}}</td>
									<td>
										<select ng-model="prop.order" class="input-small" style="display: inline">
											<option value="asc">asc</option>
											<option value="desc">desc</option>
										</select>
									</td>
									<td>
										<a href="javascript: void(0);" ng-click="removeS(prop)" class="btn btn-mini"><i class="icon-trash"><span class="hide">remove</span></i></a> 
									</td>
								</tr>
							</table>
						</div>
						<div>
							<strong>Filter:</strong>
							<table>
								<tr ng-repeat="prop in conf.filter">
									<td>{{prop.prop}}</td>
									<td>
										<select ng-model="prop.method" ng-options="c for c in prop.methods" class="input-small" style="display: inline">
											<option value="">Comparator</option>
										</select>
										<input type="text" model="prop" value="{{prop.val.value}}" filter-val class="input-small"/>
									</td>
									<td>
										<a href="javascript: void(0);" ng-click="removeF(prop)" class="btn btn-mini"><i class="icon-trash"><span class="hide">remove</span></i></a> 
									</td>
								</tr>
							</table>
						</div>
						<input type="button" value="Report!" ng-click="makeReport()" class="btn" />
						<input type="button" value="Save" ng-click="saveReport()" class="btn" />
						<input type="button" value="Save As..." ng-click="saveReportAs()" class="btn" ng-hide="report.id==null" />
						<a href="#closeReport" ng-click="report=null">Close</a>
					</div>
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
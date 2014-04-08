/**
 * User Interface
 */
var module = angular.module('reportAngular', ['tableUI']);

module.directive('filterVal', function($parse) {
	return function(scope, element, attrs) {
		var ngModel = scope[attrs.model];
		if(ngModel.type == 'java.util.Date'){
			var ngModelVal = $parse(attrs.model + '.val');
			element.datepicker({
				dateFormat: "yy-mm-dd",
				constrainInput: true,   
				showWeeks: true,
				onSelect : function(dateText, elem){
					scope.$apply(function(scope){
						ngModelVal.assign(scope, dateText);
					});
				}
			});
		}else if(ngModel.type == 'java.math.BigDecimal'){
			var ngModelVal = $parse(attrs.model + '.val');
			element.change(function(){
				scope.$apply(function(scope){
					ngModelVal.assign(scope, new BigDecimal(element.val()));
				});
			});
		}else if(ngModel.type == 'java.lang.Integer'){
			var ngModelVal = $parse(attrs.model + '.val');
			element.change(function(){
				scope.$apply(function(scope){
					ngModelVal.assign(scope, {class: 'java.lang.Integer', value: element.val()});
				});
			});
		}else if(ngModel.type == 'java.lang.Long'){
			var ngModelVal = $parse(attrs.model + '.val');
			element.change(function(){
				scope.$apply(function(scope){
					ngModelVal.assign(scope, {class: 'java.lang.Long', value: element.val()});
				});
			});
		}else{
			var ngModelVal = $parse(attrs.model + '.val');
			element.change(function(){
				scope.$apply(function(scope){
					ngModelVal.assign(scope, element.val());
				});
			});
		}
	}
});

function ReportCtrl($scope, $filter, $http, cellRenderer){

	var reportingJs;

	$scope.colors = [
		{name: 'a', id: 1},
		{name: 'b', id: 2}
	];

	$scope.domainProperties = [];

	$scope.conf = {
		yAxis: [],
		xAxis: [],
		cellValues: [],
		orderBy: [],
		filter: []
	};

	function loadReports(){
		$http.get($scope.contextPath + '/reportingJs/list', {params: {domainName: $scope.domainName}}).success(function(data){
			$scope.reports = data;
		});
	}

	$(function(){
		ReportingJs.setContextPath($scope.contextPath);
		reportingJs = new ReportingJs({
			domainName: $scope.domainName,
			outputTable: $($scope.tableSelector),
			onInit: function(domain){
				$scope.domain = domain;
				if ($scope.userInterceptor) {
					$scope.domainProperties = eval($scope.userInterceptor).createDomainProperties(domain);
				} else {
					$scope.domainProperties = domain.props;
				}
				loadReports();
				$scope.$digest();
			}
		});
	});
	
	function remove(arr, item){
		var index = arr.indexOf(item);
		if(index != -1){
			arr.splice(index, 1);
		}else{
			console.log("not found!");
		}
	}

	$scope.removeY = function(prop){
		remove($scope.conf.yAxis, prop);
	};

	$scope.removeX = function(prop){
		remove($scope.conf.xAxis, prop);
	};

	$scope.removeV = function(prop){
		remove($scope.conf.cellValues, prop);
	};

	$scope.removeS = function(prop){
		remove($scope.conf.orderBy, prop);
	};

	$scope.removeF = function(prop){
		remove($scope.conf.filter, prop);
	};

	var centerRenderer = {
		render: function(value){
			return $('<td>').text(value).css('text-align', 'center');
		}
	}

	function createPropRenderer(propertyName, prop){
		return {
			name: propertyName,
			key: prop.type + '.' + propertyName,
			render: function(value){
				return $('<td>').text(value ? value[propertyName] : '').css('text-align', 'center');
			}
		}
	};

	function guessProjections(obj, prop){
		if(prop.type == 'java.util.Date'){
			obj.projections = 'groupProperty';
		}else if(reportingJs.isDomain(prop.type)){
			obj.projections = 'groupProperty';
		}
	}

	function bindFormats(obj, prop){
		obj.formats = cellRenderer.findAllByType(prop.type);
		guessProjections(obj, prop);
		if(reportingJs.isDomain(prop.type)){
			obj.projections = 'groupProperty';
			obj.formats = [];
			reportingJs.getDomain(prop.type, function(domain){
				for(var propertyName in domain.props){
					var renderer = createPropRenderer(propertyName, prop);
					obj.formats.push(renderer);
					cellRenderer.register(renderer);
				}
			});
		}
	};

	$scope.addY = function(prop) {
		var obj = {prop: prop.name, label: prop.label || prop.name, projections: 'groupProperty'};
		bindFormats(obj, prop);
		$scope.conf.yAxis.push(obj);
		return obj;
	};

	$scope.addX = function(prop){
		var obj = {prop: prop.name, label: prop.label || prop.name, projections: 'groupProperty'};
		bindFormats(obj, prop);
		$scope.conf.xAxis.push(obj);
		return obj;
	};

	$scope.addValue = function(prop){
		var obj = {prop: prop.name, label: prop.label || prop.name, projections: 'sum'};
		bindFormats(obj, prop);
		$scope.conf.cellValues.push(obj);
		return obj;
	};

	$scope.addOrder = function(prop){
		var obj = {sort: prop.name, label: prop.label || prop.name, order: 'asc'}
		$scope.conf.orderBy.push(obj);
		return obj;
	};

	$scope.addFilter = function(prop){
		var methods = ['eq', 'le', 'ge', 'lt', 'gt'];
		var obj = {prop: prop.name, method: 'eq', val: '', type: prop.type, methods: methods};
		$scope.conf.filter.push(obj);
		return obj;
	};

	function insertAllRenderer(arr){
		for (var i = 0; i < arr.length; i++) {
			if(arr[i].format){
				var cellValue = arr[i];
				var obj = $.extend({column: cellValue.prop}, cellRenderer.findByKey(cellValue.format.key));
				reportingJs.addCellRenderer(obj);
			}
		};
	};

	function setFormat(obj, prop){
		if(!prop.format) return false;
		for (var i = 0; i < obj.formats.length; i++) {
			if(obj.formats[i].key == prop.format.key){
				obj.format = obj.formats[i];
				return true;
			}
		};
	}

	function loadPropUI(arr, fAdd){
		for (var i = 0; i < arr.length; i++) {
			var prop = $scope.domain.props[arr[i].prop];
			var obj = fAdd(prop);
			setFormat(obj, arr[i]);
			obj.projections = arr[i].projections;
		};
	};

	$scope.deleteReport = function(report){
		if(confirm("Are you sure?")){
			$http({method: 'DELETE', url: $scope.contextPath + '/reportingJs/delete', params: {id: report.id}}).success(function(data){
				var i = $scope.reports.indexOf(report);
				if(i != -1){
					$scope.reports.splice(i, 1);
				}
			});
		}
	};

	$scope.loadReport = function(report){
		var conf = $.parseJSON(report.jsonString);
		$scope.newReport();
		$scope.report = report;
		reportingJs.setId(report.id);
		reportingJs.setName(report.name);
		loadPropUI(conf.cellValues, $scope.addValue);
		loadPropUI(conf.xAxis, $scope.addX);
		loadPropUI(conf.yAxis, $scope.addY);
		$scope.conf.orderBy = conf.orderBy;
		for (var i = 0; i < conf.filter.length; i++) {
			var saved = conf.filter[i];
			var prop = $scope.domain.props[saved.prop];
			var obj = $scope.addFilter(prop);
			obj.val = saved.val;
			obj.method = saved.method;
		};
		configReport();
		reportingJs.loadReport();
	};

	function configReport(){
		reportingJs.setXaxis($scope.conf.xAxis);
		reportingJs.setYaxis($scope.conf.yAxis);
		reportingJs.setCellValues($scope.conf.cellValues);
		reportingJs.setOrderBy($scope.conf.orderBy);
		reportingJs.setFilter($scope.conf.filter);
		if($scope.criteriaAppenderFunctionName){
			reportingJs.setCriteriaAppender(eval($scope.criteriaAppenderFunctionName));
		}
		if($scope.thRendererFunctionName){
			reportingJs.setThRenderer(eval($scope.thRendererFunctionName));
		}
		reportingJs.clearColumnRenderer();
		insertAllRenderer($scope.conf.yAxis);
		insertAllRenderer($scope.conf.xAxis);
		insertAllRenderer($scope.conf.cellValues);
	}

	$scope.newReport = function(){
		reportingJs.setId(null);
		$scope.report = {};
		$scope.conf.cellValues.length = 0;
		$scope.conf.xAxis.length = 0;
		$scope.conf.yAxis.length = 0;
		$scope.conf.filter.length = 0;
		$scope.conf.orderBy.length = 0;
	};

	$scope.saveReport = function(){
		var reportName = ($scope.report && $scope.report.name);
		if(!reportingJs.getId()){
			reportName = reportName || prompt("Report name");
			if(!reportName) return;
		}
		reportingJs.setName(reportName);
		reportingJs.save(function(obj){
			$scope.report = {id: obj.id, name: reportName};
			loadReports();
		});
	};

	$scope.saveReportAs = function(){
		reportingJs.setId(null);
		$scope.saveReport();
	};

	$scope.makeReport = function(){
		configReport();
		reportingJs.loadReport();
	};
}

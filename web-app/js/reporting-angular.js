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

	$scope.conf = {
		yAxis: [],
		xAxis: [],
		cellValues: [],
		orderBy: [],
		filter: []
	};

	function loadReports(){
		$http.get($scope.contextPath + '/reportingJs/list').success(function(data){
			$scope.reports = data;
		})
	}

	$(function(){
		ReportingJs.setContextPath($scope.contextPath);
		reportingJs = new ReportingJs({
			domainName: $scope.domainName,
			outputTable: $($scope.tableSelector),
			onInit: function(domain){
				$scope.domain = domain;
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
				return $('<td>').text(value[propertyName]).css('text-align', 'center');
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
					obj.formats.push(createPropRenderer(propertyName, prop));
				}
			});
		}
	};

	$scope.addY = function(prop){
		var obj = {prop: prop.name, projections: 'groupProperty'};
		bindFormats(obj, prop);
		$scope.conf.yAxis.push(obj);
	};

	$scope.addX = function(prop){
		var obj = {prop: prop.name, projections: 'groupProperty'};
		bindFormats(obj, prop);
		$scope.conf.xAxis.push(obj);
	};

	$scope.addValue = function(prop){
		var obj = {prop: prop.name, projections: 'sum'};
		bindFormats(obj, prop);
		$scope.conf.cellValues.push(obj);
		return obj;
	};

	$scope.addOrder = function(prop){
		$scope.conf.orderBy.push({sort: prop.name, order: 'asc'});
	};

	$scope.addFilter = function(prop){
		var methods = ['eq', 'le', 'ge', 'lt', 'gt'];
		$scope.conf.filter.push({prop: prop.name, method: 'eq', val: '', type: prop.type, methods: methods});
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

	$scope.loadReport = function(report){
		var conf = $.parseJSON(report.jsonString);
		reportingJs.setId(report.id);
		reportingJs.setName(report.name);
		$scope.conf.cellValues.length = 0;
		loadPropUI(conf.cellValues, $scope.addValue);
	};

	$scope.saveReport = function(){
		reportingJs.save(function(obj){
			loadReports();
		});
	};

	$scope.makeReport = function(){
		reportingJs.setXaxis($scope.conf.xAxis);
		reportingJs.setYaxis($scope.conf.yAxis);
		reportingJs.setCellValues($scope.conf.cellValues);
		reportingJs.setOrderBy($scope.conf.orderBy);
		reportingJs.setFilter($scope.conf.filter);
		insertAllRenderer($scope.conf.yAxis);
		insertAllRenderer($scope.conf.xAxis);
		insertAllRenderer($scope.conf.cellValues);
		reportingJs.loadReport();
	};
}

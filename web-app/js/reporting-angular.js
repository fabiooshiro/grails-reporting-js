
var module = angular.module('reportAngular', []);

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

function ReportCtrl($scope, $filter){
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

	$(function(){
		reportingJs = new ReportingJs({
			domainName: 'Sale',
			outputTable: $('#table'),
			onInit: function(domain){
				$scope.domain = domain;
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

	$scope.addY = function(prop){
		$scope.conf.yAxis.push({prop: prop.name, projections: 'groupProperty'});
	};

	$scope.addX = function(prop){
		$scope.conf.xAxis.push({prop: prop.name, projections: 'groupProperty'});
	};

	var currencyRenderer = {
		render: function(value){
			var formatted = $filter('currency')(value);
			return $('<td>').text(formatted).css('text-align', 'right');
		}
	};

	var centerRenderer = {
		render: function(value){
			return $('<td>').text(value).css('text-align', 'center');
		}
	}

	function createDateRenderer(format){
		return {
			render: function(value){
				var formatted = $filter('date')(value, format);
				return $('<td>').text(formatted).css('text-align', 'center');
			}
		};
	};

	function createNumberRenderer(fractionSize){
		return {
			render: function(value){
				var formatted = $filter('number')(value, fractionSize);
				return $('<td>').text(formatted).css('text-align', 'right');
			}
		};
	}

	function createPropRenderer(prop){
		return {
			render: function(value){
				return $('<td>').text(value[prop]).css('text-align', 'center');
			}
		}
	};

	$scope.addValue = function(prop){
		var obj = {prop: prop.name, projections: 'sum'};

		if(prop.type == 'java.math.BigDecimal'){
			obj.formats = [
				{name: '$ #,##0.00', renderer: currencyRenderer},
				{name: '#,##0.000000', renderer: createNumberRenderer(6)},
				{name: '#,##0.00000000', renderer: createNumberRenderer(8)},
				{name: 'center', renderer: centerRenderer}
			];
		}else if(prop.type == 'java.lang.Long' || prop.type == 'java.lang.Integer'){
			obj.formats = [
				{name: 'center', renderer: centerRenderer},
				{name: '#,##0', renderer: createNumberRenderer(0)}
			];
		}else if(prop.type == 'java.util.Date'){
			obj.projections = 'groupProperty';
			obj.formats = [
				{name: 'yyyy-MM-dd', renderer: createDateRenderer('yyyy-MM-dd')},
				{name: 'dd/MM/yyyy', renderer: createDateRenderer('dd/MM/yyyy')},
				{name: 'dd/MM/yyyy HH:mm:ss', renderer: createDateRenderer('dd/MM/yyyy HH:mm:ss')},
			];
		}else{
			obj.projections = 'groupProperty';
			obj.formats = [];
			reportingJs.getDomain(prop.type, function(domain){
				for(var prop in domain.props){
					obj.formats.push({name: prop, renderer: createPropRenderer(prop)});
				}
			});
		}

		$scope.conf.cellValues.push(obj);
	};

	$scope.addOrder = function(prop){
		$scope.conf.orderBy.push({sort: prop.name, order: 'asc'});
	};

	$scope.addFilter = function(prop){
		var methods = ['eq', 'le', 'ge', 'lt', 'gt'];
		$scope.conf.filter.push({prop: prop.name, method: 'eq', val: '', type: prop.type, methods: methods});
	};

	$scope.makeReport = function(){
		reportingJs.setXaxis($scope.conf.xAxis);
		reportingJs.setYaxis($scope.conf.yAxis);
		reportingJs.setCellValues($scope.conf.cellValues);
		reportingJs.setOrderBy($scope.conf.orderBy);
		reportingJs.setFilter($scope.conf.filter);

		for (var i = 0; i < $scope.conf.cellValues.length; i++) {
			if($scope.conf.cellValues[i].format){
				var cellValue = $scope.conf.cellValues[i];
				var obj = $.extend({column: cellValue.prop}, cellValue.format.renderer);
				reportingJs.addCellRenderer(obj);
			}
		};
		
		reportingJs.loadReport();
	};
}

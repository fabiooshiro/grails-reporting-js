
var module = angular.module('reportAngular', []);

function ReportCtrl($scope){
	var reportingJs;

	$scope.colors = ['asc', 'desc'];

	$scope.conf = {
		yAxis: [],
		xAxis: [],
		cellValues: [],
		orderBy: []
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
	
	$scope.removeY = function(prop){
		var index = $scope.conf.yAxis.indexOf(prop);
		if(index != -1){
			$scope.conf.yAxis.splice(index, 1);
		}else{
			console.log("not found!");
		}
	};

	$scope.removeX = function(prop){
		var index = $scope.conf.xAxis.indexOf(prop);
		if(index != -1){
			$scope.conf.xAxis.splice(index, 1);
		}else{
			console.log("not found!");
		}
	};

	$scope.removeV = function(prop){
		var index = $scope.conf.cellValues.indexOf(prop);
		if(index != -1){
			$scope.conf.cellValues.splice(index, 1);
		}else{
			console.log("not found!");
		}
	};

	$scope.removeS = function(prop){
		var index = $scope.conf.orderBy.indexOf(prop);
		if(index != -1){
			$scope.conf.orderBy.splice(index, 1);
		}else{
			console.log("not found!");
		}
	};

	$scope.addY = function(prop){
		$scope.conf.yAxis.push({prop: prop.name, projections: 'groupProperty'});
	};

	$scope.addX = function(prop){
		$scope.conf.xAxis.push({prop: prop.name, projections: 'groupProperty'});
	};

	$scope.addValue = function(prop){
		$scope.conf.cellValues.push({prop: prop.name, projections: 'sum'});
	};

	$scope.addOrder = function(prop){
		$scope.conf.orderBy.push({sort: prop.name, order: 'asc'});
	};

	$scope.makeReport = function(){
		reportingJs.setXaxis($scope.conf.xAxis);
		reportingJs.setYaxis($scope.conf.yAxis);
		reportingJs.setCellValues($scope.conf.cellValues);
		reportingJs.setOrderBy($scope.conf.orderBy);
		reportingJs.loadReport();
	};
}

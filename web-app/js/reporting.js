var ReportingJs = (function(){

	var domainListCached;

	function clearTable(table){
		table.find('thead').empty();
		table.find('tbody').empty();
	};

	function makeObjects(data, headers){
		var objects = [];
		for (var i = 0; i < data.length; i++) {
			var obj = {};
			for (var j = 0; j < data[i].length; j++) {
				var prop = headers[j];
				obj[prop] = data[i][j];
			}
			objects.push(obj);
		}
		return objects;
	};

	function getKey(obj){
		if(typeof(obj) == 'object'){
			return obj.id;
		}
		return obj;
	}

	function contains(arr, value){
		var v = getKey(value);
		if(arr.indexOf(v) == -1){
			arr.push(v)
			return false;
		}else{
			return true;
		}
	}

	function makeAxis(objectList, confAxis){
		var yAxis = [];
		var uniques = [];
		for (var i = 0; i < objectList.length; i++) {
			for (var j = 0; j < confAxis.length; j++) {
				var yValue = objectList[i][confAxis[j].prop];
				if(!contains(uniques, yValue)){
					yAxis.push(yValue);
				}
			};
		};
		return yAxis;
	};

	function makeTableKey(obj, axis){
		var keySep = '-|-';
		var key = [];
		for (var j = 0; j < axis.length; j++) {
			key.push(getKey(obj[axis[j].prop]));
		}
		return {key: key.join(keySep), obj: obj};
	}

	function createAxisTable(data, headers, conf){
		var objectList = makeObjects(data, headers);
		var distinctX = makeAxis(objectList, conf.xAxis);

		var outputTable = conf.outputTable;
		var thead = outputTable.find('thead');
		var tr = $('<tr>');
		for (var i = 0; i < conf.yAxis.length; i++) {
			var th = $('<th>').append(conf.yAxis[i].prop).attr('rowspan', 2);
			tr.append(th);
		};
		for (var i = 0; i < distinctX.length; i++) {
			var th = $('<th>').append(createItemLabel(distinctX[i])).attr('colspan', conf.cellValues.length);
			tr.append(th);
		};
		thead.append(tr);

		tr = $('<tr>');
		for (var j = 0; j < distinctX.length; j++) {
			for (var i = 0; i < conf.cellValues.length; i++) {
				var th = $('<th>').append(conf.cellValues[i].prop);
				tr.append(th);	
			};
		};
		thead.append(tr);
		
		var dataMap = {};
		var yAxisObj = [];
		var yAxis = [];

		var xAxis = [];

		for (var i = 0; i < objectList.length; i++) {
			var keyY = makeTableKey(objectList[i], conf.yAxis);
			if(yAxis.indexOf(keyY.key) == -1){
				yAxis.push(keyY.key);
				yAxisObj.push(keyY);
			}
			var indexX = dataMap[keyY.key] || (dataMap[keyY.key] = {});
			var keyX = makeTableKey(objectList[i], conf.xAxis);
			if(xAxis.indexOf(keyX.key) == -1) xAxis.push(keyX.key);
			indexX[keyX.key] = objectList[i];
		};

		var tbody = outputTable.find('tbody');
		tbody.empty();

		for (var i = 0; i < yAxis.length; i++) {
			var tr = $('<tr>');
			for (var j = 0; j < conf.yAxis.length; j++) {
				var td = $('<td>').append(createItemLabel(yAxisObj[i].obj[conf.yAxis[j].prop]));
				tr.append(td);
			}
			for (var j = 0; j < xAxis.length; j++) {
				var cellValue = dataMap[yAxis[i]][xAxis[j]];
				for (var k = 0; k < conf.cellValues.length; k++) {
					var prop = conf.cellValues[k].prop;
					var td;

					if(conf.columnRenderer[prop]){
						td = conf.columnRenderer[prop].render(cellValue[prop], cellValue);
					}else{
						td = $('<td>').append(createItemLabel(cellValue[prop]));
					}

					tr.append(td);
				};
			};
			tbody.append(tr);
		};
	};

	function createSimpleTable(data, headers, conf){
		var outputTable = conf.outputTable;
		var thead = outputTable.find('thead');
		var tr = $('<tr>');

		for (var i = 0; i < headers.length; i++) {
			var th = $('<th>').append(headers[i]);
			tr.append(th);
		};
		thead.append(tr);

		var dataTable;// = outputTable.dataTable();
		if(dataTable){
			dataTable.fnClearTable();
			dataTable.fnAddData(data);
		}else{
			var tbody = outputTable.find('tbody');
			tbody.empty();

			for (var i = 0; i < data.length; i++) {
				var tr = $('<tr>');
				for (var j = 0; j < data[i].length; j++) {
					var td, prop = headers[j];
					if(conf.columnRenderer[prop]){
						td = conf.columnRenderer[prop].render(data[i][j], data[i], data);
					}else{
						td = $('<td>').append(createItemLabel(data[i][j]));
					}
					tr.append(td);
				};
				tbody.append(tr);
				data[i];
			};
		}
	};

	function addProjections(arr, projections, headers){
		for (var i = 0; i < arr.length; i++) {
			var method = arr[i].projections;
			var p = arr[i].prop;
			headers.push(p);
			if(method == 'sum' || method == 'min' || method == 'max'){
				projections[method](p, p);	
			}else{
				projections[method](p);
			}
		};
	}

	function callServer(domain, conf){
		var outputTable = conf.outputTable;
		clearTable(outputTable);
		var headers = [];
		var criteria = new Criteria(domain.simpleName);
		criteria.projections(function(projections){
			addProjections(conf.yAxis, projections, headers);
			addProjections(conf.xAxis, projections, headers);
			addProjections(conf.cellValues, projections, headers);
		});
		for (var i = 0; i < conf.orderBy.length; i++) {
			var order = conf.orderBy[i];
			if(headers.indexOf(order.sort) != -1){
				criteria.order(order.sort, order.order);
			}
		};
		for (var i = 0; i < conf.filter.length; i++) {
			var filter = conf.filter[i];
			console.log(filter.val);
			criteria[filter.method](filter.prop, filter.val);
		};
		criteria.list(function(data){
			if(conf.xAxis.length > 0){
				createAxisTable(data, headers, conf);
			}else{
				createSimpleTable(data, headers, conf);
			}
		});
	}

	function createItemLabel(item){
		if(item && typeof(item) == 'object'){
			return item['name'];
		}
		return item;
	}

	function listDomains(cb){
		if(domainListCached != null){
			cb(domainListCached);
		}else{
			$.ajax(config.contextPath + '/reportingJs/domains', {
				contentType : 'application/json',
				type : 'POST',
				success: function(data){
					domainListCached = data;
					cb(data);
				}
			});
		}
	};

	var Moon = function(userConfig){
		var self = this;
		var domain;
		var conf = $.extend({
			onInit: function(){},
			columnRenderer: {},
			xAxis: [],
			yAxis: [],
			cellValues: [],
			orderBy: [],
			filter: []
		}, userConfig);

		listDomains(function(domains){
			for (var i = 0; i < domains.length; i++) {
				if(domains[i].simpleName == conf.domainName){
					domain = domains[i];
					break;
				}
			};
			conf.onInit(domain);
		});

		this.loadReport = function(){
			callServer(domain, conf);
		};

		this.addCellRenderer = function(renderer){
			conf.columnRenderer[renderer.column] = renderer;
		};

		this.setYaxis = function(arr){
			conf.yAxis = arr;
		};

		this.setXaxis = function(arr){
			conf.xAxis = arr;
		};

		this.setCellValues = function(arr){
			conf.cellValues = arr;
		};

		this.setOrderBy = function(arr){
			conf.orderBy = arr;
		};

		this.getDomain = function(fullName, callback){
			var domain;
			listDomains(function(domains){
				for (var i = 0; i < domains.length; i++) {
					if(domains[i].fullName == fullName){
						domain = domains[i];
						break;
					}
				};
			});
			callback(domain);
		};

		this.setFilter = function(filter){
			conf.filter = filter;
		};
	};

	Moon.listDomains = listDomains;

	return Moon;
})();



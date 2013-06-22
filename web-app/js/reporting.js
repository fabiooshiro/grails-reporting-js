var ReportingJs = (function(){

	var domainListCached;
	var contextPath;

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

	function makeTableKey(obj, axis){
		var keySep = '-|-';
		var key = [];
		for (var j = 0; j < axis.length; j++) {
			key.push(getKey(obj[axis[j].prop]));
		}
		return {key: key.join(keySep), obj: obj};
	}

	function createDataMap(conf, objectList){
		var dataMap = {};
		var yAxisObj = [];
		var yAxis = [];

		var xAxis = [];
		var xAxisObj = [];

		for (var i = 0; i < objectList.length; i++) {
			var keyY = makeTableKey(objectList[i], conf.yAxis);
			if(yAxis.indexOf(keyY.key) == -1){
				yAxis.push(keyY.key);
				yAxisObj.push(keyY);
			}
			var indexX = dataMap[keyY.key] || (dataMap[keyY.key] = {});
			var keyX = makeTableKey(objectList[i], conf.xAxis);
			if(xAxis.indexOf(keyX.key) == -1){
				xAxis.push(keyX.key);
				xAxisObj.push(keyX);
			}
			indexX[keyX.key] = objectList[i];
		};
		return {data: dataMap, yAxis: yAxisObj, xAxis: xAxisObj};
	}

	function createTd(conf, obj, prop){
		var td;
		if(conf.columnRenderer[prop]){
			td = conf.columnRenderer[prop].render(obj && obj[prop], obj);
		}else{
			td = $('<td>').append(createItemLabel(obj && obj[prop]));
		}
		return td;
	}

	function getThText(conf, text){
		if(conf.thRenderer){
			return conf.thRenderer(text);
		}
		return text;
	}

	function createAxisTable(data, headers, conf){
		var objectList = makeObjects(data, headers);
		var reportData = createDataMap(conf, objectList);

		var outputTable = conf.outputTable;
		var thead = outputTable.find('thead');
		var tr = $('<tr>');
		for (var i = 0; i < conf.yAxis.length; i++) {
			var thText = getThText(conf, conf.yAxis[i].prop);
			var th = $('<th>').append(thText).attr('rowspan', conf.xAxis.length + 1);
			tr.append(th);
		};
		for (var i = 0; i < conf.xAxis.length; i++) {
			var lastTextContent = null, lastTh, colspan = 1;
			for (var j = 0; j < reportData.xAxis.length; j++) {
				var prop = conf.xAxis[i].prop;
				var td = createTd(conf, reportData.xAxis[j].obj, prop);
				if(td.text() != lastTextContent){
					var thText = getThText(conf, td.html());
					var th = $('<th>').append(thText);
					colspan = 1;
					th.attr('colspan', conf.cellValues.length);
					tr.append(th);
					lastTextContent = td.text();
					lastTh = th;
				}else{
					lastTh.attr('colspan', ++colspan * conf.cellValues.length);
				}
			};
			thead.append(tr);
			tr = $('<tr>');
		};
		for (var j = 0; j < reportData.xAxis.length; j++) {
			for (var i = 0; i < conf.cellValues.length; i++) {
				var thText = getThText(conf, conf.cellValues[i].prop);
				var th = $('<th>').append(thText);
				tr.append(th);	
			};
		};
		thead.append(tr);

		var tbody = outputTable.find('tbody');
		tbody.empty();

		for (var i = 0; i < reportData.yAxis.length; i++) {
			var tr = $('<tr>');
			for (var j = 0; j < conf.yAxis.length; j++) {
				var prop = conf.yAxis[j].prop;
				var td = createTd(conf, reportData.yAxis[i].obj, prop);
				tr.append(td);
			}
			for (var j = 0; j < reportData.xAxis.length; j++) {
				var cellValue = reportData.data[reportData.yAxis[i].key][reportData.xAxis[j].key];
				for (var k = 0; k < conf.cellValues.length; k++) {
					var prop = conf.cellValues[k].prop;
					var td = createTd(conf, cellValue, prop);
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

		var dataTable;
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
			if(headers.indexOf(p) == -1){
				headers.push(p);
				if(method == 'sum' || method == 'min' || method == 'max'){
					projections[method](p, p);	
				}else{
					projections[method](p);
				}
			}
		};
	}

	function callServer(domain, conf){
		var outputTable = conf.outputTable;
		clearTable(outputTable);
		var headers = [];
		var criteria = new Criteria(domain.simpleName);
		if(conf.criteriaAppender){
			conf.criteriaAppender(criteria);
		}
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
			$.ajax(contextPath + '/reportingJs/domains', {
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
			filter: [],
			name: ('Report ' + new Date())
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

		this.loadReport = function(callback){
			callServer(domain, conf);
			if(callback) callback();
		};

		this.clearColumnRenderer = function(){
			conf.columnRenderer = {};
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

		this.isDomain = function(fullName){
			for (var i = 0; i < domainListCached.length; i++) {
				if(domainListCached[i].fullName == fullName){
					return true;
				}
			};
			return false;
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

		this.setId = function(id){
			conf.id = id;
		};

		this.getId = function(){
			return conf.id;
		};

		this.setName = function(name){
			conf.name = name;
		};

		this.save = function(callback){
			var obj = $.extend({}, conf, {
				onInit: '', 
				columnRenderer: {}, 
				outputTable: ''
			});
			var jsonString = JSON.stringify(obj);
			$.ajax(contextPath + '/reportingJs/save', {
				contentType : 'application/json',
				type : 'POST',
				data: JSON.stringify({jsonString: jsonString, name: obj.name, id: obj.id, domainName: obj.domainName}),
				success: function(data){
					conf.id = data.id;
					callback(data);
				}
			});
		};

		this.setCriteriaAppender = function(fn){
			conf.criteriaAppender = fn;
		};

		this.setThRenderer = function(fn){
			conf.thRenderer = fn;
		};
	};

	Moon.setContextPath = function(cp){
		contextPath = cp;
	};

	Moon.listDomains = listDomains;

	return Moon;
})();



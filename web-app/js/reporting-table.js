/**
 * html table td
 */
var CellRenderer = (function(){
	var indexKey = {};
	var indexType = {};

	function addType(type, cellRenderer){
		var indexT = indexType[type] || (indexType[type] = []);
		indexT.push(cellRenderer);
	}

	function register(cellRenderer){
		indexKey[cellRenderer.key] = cellRenderer;
		if(cellRenderer.types){
			for (var i = 0; i < cellRenderer.types.length; i++) {
				addType(cellRenderer.types[i], cellRenderer);
			}
		}else{
			addType(cellRenderer.type, cellRenderer);
		}
	};

	function findAllByType(type){
		return indexType[type];
	};

	function findByKey(key){
		return indexKey[key];
	};

	return {
		register: register,
		findAllByType: findAllByType,
		findByKey: findByKey
	}
})();

(function(){

	angular.module('tableUI', [], function($provide) {

		$provide.factory('cellRenderer', ['$filter', function($filter) {

			function createNumberRenderer(name, key, fractionSize){
				return {
					name: name,
					types: ['java.math.BigDecimal', 'java.lang.Long', 'java.lang.Integer', 'java.lang.Double'],
					key: key,
					render: function(value){
						var formatted = $filter('number')(value, fractionSize);
						return $('<td>').text(formatted).css('text-align', 'right');
					}
				};
			};

			function createDateRenderer(format){
				return {
					name: format,
					type: 'java.util.Date',
					key: format,
					render: function(value){
						var formatted = $filter('date')(value, format);
						return $('<td>').text(formatted).css('text-align', 'center');
					}
				};
			};

			var usdRenderer = {
				name: '$ #,##0.00',
				type: 'java.math.BigDecimal',
				key: 'usd',
				render: function(value){
					var formatted = $filter('currency')(value);
					return $('<td>').text(formatted).css('text-align', 'right');
				}
			};

			CellRenderer.register(usdRenderer);
			CellRenderer.register(createNumberRenderer('#,##0', 'scale 0',  0));
			CellRenderer.register(createNumberRenderer('#,##0.00', 'scale 2',  2));
			CellRenderer.register(createNumberRenderer('3,331.1234', 'scale 4',  4));
			CellRenderer.register(createNumberRenderer('3,331.123456', 'scale 6',  6));
			CellRenderer.register(createNumberRenderer('3,331.12345678', 'scale 8',  8));
			CellRenderer.register(createNumberRenderer('3,331.1234567890', 'scale 10', 10));

			CellRenderer.register(createDateRenderer('yyyy-MM-dd'));
			CellRenderer.register(createDateRenderer('MM/dd/yyyy'));
			CellRenderer.register(createDateRenderer('dd/MM/yyyy'));
			CellRenderer.register(createDateRenderer('dd/MM/yyyy HH:mm:ss'));
			CellRenderer.register(createDateRenderer('yyyy-MM-dd HH:mm:ss'));

			return CellRenderer;
		}]);
	});

})();

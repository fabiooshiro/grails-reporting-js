modules = {

	'reporting-core'{
		dependsOn 'jquery, criteria-js'
		resource url: 'js/reporting.js', disposition: 'head'
	}
	'reporting-table'{
		resource url: 'js/reporting-table.js', disposition: 'head'	
	}
	'reporting-js'{
		dependsOn 'reporting-core, reporting-table'
		resource url: 'js/reporting-angular.js', disposition: 'head'
	}

	'reporting-bootstrap'{
		dependsOn 'reporting-js'
		resource url: 'js/bootstrap.js', disposition: 'head'
	}
}

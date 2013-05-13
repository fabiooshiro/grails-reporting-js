modules = {

	'reporting-core'{
		dependsOn 'jquery, criteria-js'
		resource url: 'js/reporting.js', disposition: 'head'
	}
	'reporting-js'{
		dependsOn 'reporting-core'
		resource url: 'js/reporting-angular.js', disposition: 'head'
	}
}

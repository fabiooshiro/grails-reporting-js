package grails.reporting.js

class ReportJsTagLib {

	def reportJs = { attrs ->
		out << render(template: "/reportingJs/fullReport", plugin: 'grailsReportingJs', model: attrs)
	}
}

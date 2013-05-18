package grails.reporting.js

class ReportJsTagLib {

	def reportJs = { attrs, body ->
		out << render(template: "/reportingJs/fullReport", plugin: 'grailsReportingJs', model: attrs)
	}
}

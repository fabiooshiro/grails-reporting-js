package grails.reporting.js

import grails.converters.JSON

class ReportingJsController {

	def grailsApplication

	def index() {}

	def save(){
		def json = request.JSON
		def report = json.id ? ReportJs.get(json.id) : new ReportJs()
		report.name = json.name
		report.jsonString = json.jsonString
		report.save(failOnError: true)
		render([msg: 'saved', id: report.id] as JSON)
	}

	def list(){
		render (ReportJs.list() as JSON)
	}

	def domains(){
		def models = []
		grailsApplication.domainClasses.each{ gDomainClass ->
			def model = [:]
			model.simpleName = gDomainClass.clazz.simpleName
			model.fullName = gDomainClass.clazz.name
			model.props = [:]
			gDomainClass.getProperties().each{
				model.props.put(it.name, [type: it.type.name, name: it.name])
			}
			model.association = gDomainClass.getAssociationMap()
			models.add(model)
		}
		render models as JSON
	}

}

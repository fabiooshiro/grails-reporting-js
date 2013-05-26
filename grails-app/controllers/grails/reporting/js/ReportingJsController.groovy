package grails.reporting.js

import grails.converters.JSON

class ReportingJsController {

	def grailsApplication

	def index() {}

	def delete(){
		def report = ReportJs.get(params.id)
		if(report){
			report.delete(failOnError: true, flush: true)
		}
		render([msg: 'deleted', id: report.id] as JSON)
	}

	def save(){
		def json = request.JSON
		def report = json.id ? ReportJs.get(json.id) : new ReportJs()
		report.name = json.name
		report.domainName = json.domainName ?: "Noname (${new Date().format('yyyy-MM-dd HH:mm:ss')})"
		report.jsonString = json.jsonString
		report.save(failOnError: true)
		render([msg: 'saved', id: report.id] as JSON)
	}

	def list(){
		def ls = ReportJs.findAllByDomainName(params.domainName)
		render (ls as JSON)
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

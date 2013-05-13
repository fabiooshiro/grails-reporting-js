package grails.reporting.js

import grails.converters.JSON

class ReportingJsController {

	def grailsApplication

	def index() {

	}

	def domains(){
		def models = []
		grailsApplication.domainClasses.each{ gDomainClass ->
			def model = [:]
			model.simpleName = gDomainClass.clazz.simpleName
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

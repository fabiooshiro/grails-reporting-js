package grails.reporting.js

class ReportJs {

	String name

	String domainName

	String jsonString

	String toString(){
		name
	}

	static mapping = {
		jsonString type: 'text'
	}
}

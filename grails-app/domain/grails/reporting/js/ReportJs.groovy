package grails.reporting.js

class ReportJs {

	String name

	String jsonString

	String toString(){
		name
	}

    static constraints = {
    }

    static mapping = {
    	jsonString type: 'text'
    }
}

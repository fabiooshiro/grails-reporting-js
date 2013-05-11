package grails.reporting.js

class Music {

	String name

	Album album

	BigDecimal time

    static constraints = {
    	name nullable: true
    }
}

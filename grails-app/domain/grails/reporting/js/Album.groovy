package grails.reporting.js

class Album {

	static belongsTo = [artist: Artist]

	static hasMany = [musics: Music]

	Integer year

	String toString(){
		"Album ${id}"
	}

    static constraints = {
    	year nullable: true
    }
}
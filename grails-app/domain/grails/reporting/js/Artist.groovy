package grails.reporting.js

class Artist {

	String name

	static hasMany = [albuns: Album]
}

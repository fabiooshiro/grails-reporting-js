class GrailsReportingJsGrailsPlugin {
    def version = "0.1"
    def grailsVersion = "2.0 > *"
    def pluginExcludes = [
        "grails-app/domain/grails/reporting/js/Album.groovy",
        "grails-app/domain/grails/reporting/js/Artist.groovy",
        "grails-app/domain/grails/reporting/js/Music.groovy",
        "grails-app/domain/grails/reporting/js/Sale.groovy",
    ]

    def title = "Grails Reporting Js Plugin"
    def author = "Fabio Issamu Oshiro"
    def authorEmail = ""
    def description = 'Grails Report Tool'

    def documentation = "https://github.com/fabiooshiro/grails-reporting-js"

    def license = "APACHE"

    def organization = [ name: "Investtools", url: "http://www.investtools.com.br/" ]

    def scm = [ url: "https://github.com/fabiooshiro/grails-reporting-js" ]
}

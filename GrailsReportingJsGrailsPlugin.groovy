class GrailsReportingJsGrailsPlugin {
    def version = "0.2"
    def grailsVersion = "2.1 > *"
    def dependsOn = [:]
    def pluginExcludes = [
        "grails-app/views/error.gsp",
        "grails-app/domain/grails/reporting/js/Album.groovy",
        "grails-app/domain/grails/reporting/js/Artist.groovy",
        "grails-app/domain/grails/reporting/js/Music.groovy",
        "grails-app/domain/grails/reporting/js/Sale.groovy",
    ]

    def title = "Grails Reporting Js Plugin" // Headline display name of the plugin
    def author = "Fabio Issamu Oshiro"
    def authorEmail = ""
    def description = 'Grails Report Tool'

    def documentation = "https://github.com/fabiooshiro/grails-reporting-js"

    def license = "APACHE"

    def organization = [ name: "Investtools", url: "http://www.investtools.com.br/" ]

//    def developers = [ [ name: "Joe Bloggs", email: "joe@bloggs.net" ]]

//    def issueManagement = [ system: "JIRA", url: "http://jira.grails.org/browse/GPMYPLUGIN" ]

    def scm = [ url: "https://github.com/fabiooshiro/grails-reporting-js" ]

    def doWithWebDescriptor = { xml ->
    }

    def doWithSpring = {
    }

    def doWithDynamicMethods = { ctx ->
    }

    def doWithApplicationContext = { applicationContext ->
    }

    def onChange = { event ->
    }

    def onConfigChange = { event ->
    }

    def onShutdown = { event ->
    }
}

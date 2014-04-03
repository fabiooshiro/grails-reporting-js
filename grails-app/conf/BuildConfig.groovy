grails.project.work.dir = 'target'

grails.project.dependency.resolution = {

    inherits 'global'
    log 'warn'

    repositories {
        grailsCentral()
    }

    plugins {
        runtime(":hibernate:$grailsVersion") {
            export = false
        }

        runtime ":jquery:1.8.2"
        runtime ":resources:1.1.6"
        compile ":criteria-js:0.5.1"
        build ':release:2.2.1', ':rest-client-builder:1.0.3', {
            export = false
        }
    }
}

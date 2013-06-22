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

        runtime ":jquery:1.10.0"
        runtime ":resources:1.2"
        compile ":criteria-js:0.3"

        build ':release:2.2.1', ':rest-client-builder:1.0.3', {
            export = false
        }
    }
}

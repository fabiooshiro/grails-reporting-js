import grails.reporting.js.*

class BootStrap {

	def init = { servletContext ->

		def belaBartok = new Artist(name: 'Béla Bartók').save(failOnError: true)
		def album = new Album(artist: belaBartok).save(failOnError: true)
		new Music(album: album, time: 100.0, name: 'Quartet No. 3 / Quartet No. 4').save(failOnError: true)
		new Music(album: album, time:  20.0, name: 'Quartet No. 5').save(failOnError: true)
		new Music(album: album, time:   3.0, name: 'Sonata No. 1 For Violin And Piano').save(failOnError: true)

		def radioHead = new Artist(name: 'Radio Head').save(failOnError: true)
		def album2 = new Album(artist: radioHead, year: 2000).save(failOnError: true)
		new Music(album: album2, time: 2.2, name: 'Idioteque').save(failOnError: true)
		new Music(album: album2, time: 5.4, name: 'OK Computer').save(failOnError: true)

		def musics = Music.list()
		def date = new Date('2012/01/01')
		500.times{ dx ->
			musics.eachWithIndex{ music, i->
				new Sale(music: music, price: i+1.11, quantity: (i+1) * 2, date: date + dx).save(failOnError: true)
				new Sale(music: music, price: i+1.2, quantity: (i+1), date: date + dx).save(failOnError: true)
			}
		}
	}
}

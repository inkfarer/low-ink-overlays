const nowPlaying = nodecg.Replicant('nowPlaying', DASHBOARD_BUNDLE_NAME);
const mainArtistElem = document.getElementById('main-artist');
const mainSongElem = document.getElementById('main-song');
const mainMusicTl = gsap.timeline();

nowPlaying.on('change', newValue => {
	mainMusicTl.add(
		gsap.fromTo([mainArtistElem, mainSongElem], {x: 0}, {
			x: 25,
			opacity: 0,
			duration: 0.5,
			ease: 'power2.in',
			onComplete: function() {
				mainArtistElem.setAttribute('text', newValue.artist);
				mainSongElem.setAttribute('text', newValue.song);
			}
		})
	);

	mainMusicTl.add(
		gsap.fromTo([mainArtistElem, mainSongElem], {x: -25}, {
			x: 0,
			opacity: 1,
			duration: 0.5,
			ease: 'power2.out'
		})
	);
});
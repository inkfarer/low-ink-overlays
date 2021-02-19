const nowPlaying = nodecg.Replicant('nowPlaying', DASHBOARD_BUNDLE_NAME);
const musicShown = nodecg.Replicant('musicShown', DASHBOARD_BUNDLE_NAME);

const mainMusicElem = document.querySelector('.scene.main-scene > .scene-content > .main-container > .music');
const mainArtistElem = document.getElementById('main-artist');
const mainSongElem = document.getElementById('main-song');
const mainMusicTl = gsap.timeline();
const mainMusicDisplayTl = gsap.timeline();
const topBarMusicTl = gsap.timeline();
const topBarMusicElem = document.getElementById('info-row-music-text');

nowPlaying.on('change', newValue => {
	mainMusicTl.add(
		gsap.fromTo([mainArtistElem, mainSongElem], {x: 0}, {
			x: 25,
			opacity: 0,
			duration: 0.5,
			ease: Power2.easeIn,
			onComplete: function () {
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
			ease: Power2.easeOut
		})
	);

	topBarMusicTl.add(gsap.to([topBarMusicElem, '#info-row-music-icon'], {
		opacity: 0, duration: 0.3, onComplete: function () {
			topBarMusicElem.setAttribute('text', `${newValue.artist} - ${newValue.song}`);
		}
	}));

	topBarMusicTl.add(gsap.to([topBarMusicElem, '#info-row-music-icon'], {
		opacity: 1, duration: 0.3
	}));
});

musicShown.on('change', newValue => {
	const opacity = newValue ? 1 : 0;
	const posX = newValue ? 0 : 25;
	const posXFrom = newValue ? -25 : 0;
	const ease = newValue ? Power2.easeOut : Power2.easeIn;
	const height = newValue ? 110 : 0;
	const marginBottom = newValue ? 20 : 0;

	if (newValue) {
		mainMusicDisplayTl.add(gsap.to(mainMusicElem, {height: height, marginBottom: marginBottom, duration: 0.5, ease: Power2.easeInOut}));
		mainMusicDisplayTl.add(gsap.fromTo([mainMusicElem], {x: posXFrom}, {
			ease: ease,
			x: posX,
			opacity: opacity,
			duration: 0.5
		}));
	} else {
		mainMusicDisplayTl.add(gsap.fromTo([mainMusicElem], {x: posXFrom}, {
			ease: ease,
			x: posX,
			opacity: opacity,
			duration: 0.5
		}));
		mainMusicDisplayTl.add(gsap.to(mainMusicElem, {height: height, marginBottom: marginBottom, duration: 0.5, ease: Power2.easeInOut}));
	}
});

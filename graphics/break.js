const bigTextValue = nodecg.Replicant('bigTextValue', { defaultValue: 'Be right back!' });
const casterNames = nodecg.Replicant('casterNames', { defaultValue: "" });
const nowPlaying = nodecg.Replicant('nowPlaying');
const nowPlayingManual = nodecg.Replicant('nowPlayingManual', {defaultValue: {
	artist: undefined,
	song: undefined
}});
const mSongEnabled = nodecg.Replicant('mSongEnabled', {defaultValue: false});
const musicShown = nodecg.Replicant('musicShown', {defaultValue: true});

//replicant changes
bigTextValue.on('change', newValue => {
	changeBreakMainText('breakFlavorText', newValue, "breakFlavorTextBG");
	topBarText.innerText = newValue;
});
casterNames.on('change', newValue => {
	changeBreakMainText('breakCasterNames', newValue, 'breakCasterNamesBG');
});
nowPlaying.on('change', newValue => {
	if (!nowPlayingManual.value) {
		if (newValue.artist === undefined && newValue.song === undefined) {
			changeBreakMainText('breakSongText', 'No song is currently playing.', 'breakSongTextBG');
		} else {
			const songName = newValue.artist + " - " + newValue.song;
			changeBreakMainText('breakSongText', songName, 'breakSongTextBG');
		}		
	}
})
mSongEnabled.on('change', newValue => {
	var value;
	if (newValue) { value = nowPlayingManual.value; }
	 else { value = nowPlaying.value; }

	if (value.artist === undefined && value.song === undefined) {
		changeBreakMainText('breakSongText', 'No song is currently playing.', 'breakSongTextBG');
	} else {
		const songName = value.artist + " - " + value.song;
		changeBreakMainText('breakSongText', songName, 'breakSongTextBG');
	}		
});
nowPlayingManual.on('change', newValue => {
	if (nowPlayingManual.value) {
		if (newValue.artist === undefined && newValue.song === undefined) {
			changeBreakMainText('breakSongText', 'No song is currently playing.', 'breakSongTextBG');
		} else {
			const songName = newValue.artist + " - " + newValue.song;
			changeBreakMainText('breakSongText', songName, 'breakSongTextBG');
		}		
	}
});
musicShown.on('change', newValue => {
	const musicElem = document.getElementById('musicWrapper')
	if (newValue) {
		gsap.to('#musicWrapper', 0.5, {opacity: 1});
	} else {
		gsap.to('#musicWrapper', 0.5, {opacity: 0});
	}
});

//looping background
var arrowTl = gsap.timeline({repeat: -1});
arrowTl.to('#squidarrows', 20, {ease: Power0.easeNone, left: -600});

//surrort texts

const socialTexts = ["Twitter: @LowInkSplatoon",
"Discord: discord.gg/F7RaNUR",
"Patreon: patreon.com/lowink"];

const socialIcons = ["logoTwitter.png",
"logoDiscord.png",
"logoPatreon.png"];

function startSocialSlides() {
    for(i = 0; i < socialIcons.length; i++) {
        addSocialAnim(i);
    }
}

const socialTL = gsap.timeline();
function addSocialAnim(number) {
    var calcWidth;
    calcWidth = measureText(socialTexts[number], "'Montserrat', sans-serif", "2.5em") + 20;
    socialTL.add(gsap.to("#breakSupport", 0.5, {opacity: 0, ease: Power2.easeIn, onComplete: function() {
        breakSupport.text = socialTexts[number];
    }}))
    .add(gsap.to("#socialIcon", 0.5, {delay: -0.5, opacity: 0, ease: Power2.easeIn, onComplete: function() {
        socialIcon.src = socialIcons[number];
    }}))
    .add(gsap.to("#breakSupportBG", 0.5, {ease: Expo.easeInOut, width: calcWidth}))
    .add(gsap.to("#breakSupport", 0.5, {ease: Expo.easeInOut, opacity: 1}))
    .add(gsap.to("#socialIcon", 0.5, {ease: Expo.easeInOut, opacity: 1, delay: -0.5}))
    .add(gsap.to({}, 10, {}));
    if (number == socialIcons.length - 1) {
        socialTL.to({}, 0.01, {delay: -0.01, onComplete: function() {startSocialSlides()}});
    }
}

window.onload = function() {
    startSocialSlides();
}

//misc functions

function measureText(text, font, fontSize) {
    const measurer2 = document.createElement("div");
    measurer2.classList.add("measurer");
    measurer2.style.fontFamily = font;
    measurer2.style.fontSize = fontSize;
    measurer2.innerText = text;
    document.body.appendChild(measurer2);
    var width = measurer2.getBoundingClientRect().width;
    measurer2.parentNode.removeChild(measurer2);
    return width;
}

function changeBreakMainText(id, text, BGelement) {
	var calcWidth;
    if (text == "") {
        calcWidth = 0;
    } else {
        calcWidth = measureText(text, "'Montserrat', sans-serif", "2.5em") + 20;
	}
	const maxWidth = parseInt(document.getElementById(id).getAttribute("max-width"));
    if (calcWidth > maxWidth) {
        calcWidth = maxWidth + 20;
	}
	const roundWidth = Math.round(calcWidth);
    const songTimeline = gsap.timeline();
	songTimeline.add(gsap.to('#' + id, 0.5, {opacity: 0, ease:'Power2.in', onComplete: function() {
		document.getElementById(id).text = text;
	}}))
	.add(gsap.to('#' + BGelement, 0.5, {ease: 'expo.out', width: roundWidth}))
	.add(gsap.to('#' + id, 0.5, {opacity: 1}));
}

function hideMainScene() {
	gsap.to("#mainScene", 1.5, {ease: 'power3.in',  top: 1080});
}

function showMainScene() {
	gsap.fromTo("#mainScene", {top: -1080}, {top: 0, duration: 2, ease: 'power3.out'});
}

function showTopBar() {
	gsap.to("#topBar", 0.5, {ease: 'power3.out', top: 0});
}

function hideTopBar() {
	gsap.to("#topBar", 0.5, {ease: 'power3.in', top: -80});
}
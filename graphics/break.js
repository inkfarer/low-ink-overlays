const emptyTeamInfo = {
    name: "",
    logoUrl: "",
    players: [
        {
            name: "",
            username: ""
        }
    ]
};

const bigTextValue = nodecg.Replicant('bigTextValue', { defaultValue: 'Be right back!' });
const casterNames = nodecg.Replicant('casterNames', { defaultValue: "" });
const nowPlaying = nodecg.Replicant('nowPlaying');
const nowPlayingManual = nodecg.Replicant('nowPlayingManual', {defaultValue: {
	artist: undefined,
	song: undefined
}});
const mSongEnabled = nodecg.Replicant('mSongEnabled', {defaultValue: false});
const musicShown = nodecg.Replicant('musicShown', {defaultValue: true});
const currentBreakScene = nodecg.Replicant('currenBreakScene', { defaultValue: 'mainScene' });
const nextTeamAInfo = nodecg.Replicant('nextTeamAInfo', {defaultValue: emptyTeamInfo});
const nextTeamBInfo = nodecg.Replicant('nextTeamBINfo', {defaultValue: emptyTeamInfo});

//replicant changes
bigTextValue.on('change', newValue => {
	changeBreakMainText('breakFlavorText', newValue, "breakFlavorTextBG");
	topBarText.text = newValue;
});
casterNames.on('change', newValue => {
	changeBreakMainText('breakCasterNames', newValue, 'breakCasterNamesBG');
});
nowPlaying.on('change', newValue => {
	if (!mSongEnabled.value) {
		if (newValue.artist == undefined && newValue.song == undefined) {
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
	if (mSongEnabled.value) {
		if (newValue.artist == undefined && newValue.song == undefined) {
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
currentBreakScene.on('change', newValue => {
	if (newValue === "mainScene") {
		hideNextUp();
		hideTopBar();
		showMainScene(0);
	} else if (newValue === "nextUp") {
		showTopBar(1.25);
		hideMainScene();
		showNextUp();
	} else if (newValue === "maps") {
		showTopBar(1.25);
		hideMainScene();
	}
});

nextTeamAInfo.on('change', newValue => {
	console.log(newValue);
	teamAImage.src = newValue.logoUrl;
	teamAName.text = newValue.name;
	addTeamPlayers('A', newValue.players);
});
nextTeamBInfo.on('change', newValue => {
	console.log(newValue);
	teamBImage.src = newValue.logoUrl;
	teamBName.text = newValue.name;
	addTeamPlayers('B', newValue.players);
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
	startTopBarTextLoop();
}

//top bar looping text

function startTopBarTextLoop() {
	for (let i = 0; i < 2; i++) {
		addTopBarAnim(i);
	}
}

const topBarInfoTL = gsap.timeline();
function addTopBarAnim(i) {
	topBarInfoTL.add(gsap.to('#topBarInfoText, #topBarInfoIcon', 0.5, {opacity: 0, onComplete: function() {
		if (i === 0) {
			topBarInfoText.text = casterNames.value;
			topBarInfoIcon.src = 'microphone.svg';
		} else if (i === 1) {
			if (mSongEnabled.value) {
				topBarInfoText.text = nowPlayingManual.value.artist + ' - ' + nowPlayingManual.value.song;
			} else {
				if (nowPlaying.value.artist === undefined && nowPlaying.value.song === undefined) {
					topBarInfoText.text = 'Nothing is playing at the moment.';
				} else {
					topBarInfoText.text = nowPlaying.value.artist + ' - ' + nowPlaying.value.song;
				}
			}
			topBarInfoIcon.src = 'music.svg';
		}
	}}))
	.add(gsap.to('#topBarInfoText, #topBarInfoIcon', 0.5, {opacity: 1, delay: 0.5}))
	.add(gsap.to({}, 5, {}));
	if (i == 1) {
		topBarInfoTL.to({}, 0.01, {delay: -0.01, onComplete: function() {startTopBarTextLoop()}});
	}
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

function addTeamPlayers(teamNo, players) {
	//clear existing
	var selector;
	if (teamNo === 'A') {
		selector = 'sc-fitted-text.teamPlayer.teamPlayerA';
	} else if (teamNo === 'B') {
		selector = 'sc-fitted-text.teamPlayer.teamPlayerB';
	}
	const existing = document.querySelectorAll(selector);
	for (let i = 0; i < existing.length; i++) {
		const element = existing[i];
		element.parentNode.removeChild(element);
	}

	for (let i = 0; i < players.length; i++) {
		const element = players[i];
		const playerText = document.createElement('sc-fitted-text');
		playerText.text = element.name;
		playerText.maxWidth = "430"
		playerText.classList.add('teamPlayer');
		if (teamNo === 'A') {
			playerText.align = "right";
			playerText.classList.add('teamPlayerA');
			teamAInfo.appendChild(playerText);
		} else if (teamNo === 'B') {
			playerText.align = "left";
			playerText.classList.add('teamPlayerB')
			teamBInfo.appendChild(playerText);
		}
	}
}


function hideMainScene() {
	gsap.to("#mainScene", 1.5, {ease: 'power3.inOut',  top: 1080});
}

function showMainScene(delay) {
	gsap.fromTo("#mainScene", {top: -1080}, {top: 0, duration: 1.5, ease: 'power3.inOut', delay: delay});
}

function showTopBar(delay) {
	gsap.to("#topBar", 0.5, {ease: 'power3.out', top: 0, delay: delay});
}

function hideTopBar() {
	gsap.to("#topBar", 0.5, {ease: 'power3.inOut', top: -80});
}

function showNextUp(delay) {
	gsap.fromTo("#nextUp", {top: -1080}, {top: 0, duration: 1.5, ease: 'power3.inOut', delay: delay});

	const namesA = document.querySelectorAll('sc-fitted-text.teamPlayer.teamPlayerA');
	const namesB = document.querySelectorAll('sc-fitted-text.teamPlayer.teamPlayerB');

	for (let i = 0; i < namesA.length; i++) { namesA[i].style.opacity = "0"; }
	for (let i = 0; i < namesB.length; i++) { namesB[i].style.opacity = "0"; }

	setTimeout(function() {
		
		for (let i = 0; i < namesA.length; i++) {
			const element = namesA[i];
			gsap.fromTo(element, {marginRight: 60, opacity: 0}, {duration: 0.3, marginRight: 35, opacity: 1, delay: i*0.1});
		}

		for (let i = 0; i < namesB.length; i++) {
			const element = namesB[i];
			gsap.fromTo(element, {marginLeft: 60, opacity: 0}, {duration: 0.3, marginLeft: 35, opacity: 1, delay: i*0.1});
		}
	}, 1100);
}

function hideNextUp() {
	gsap.to("#nextUp", 1.5, {ease: 'power3.inOut',  top: 1080});
}
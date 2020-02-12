const mapNameToImagePath = {"Ancho-V Games": "stages/S2_Stage_Ancho-V_Games.png",
"Arowana Mall":"stages/S2_Stage_Arowana_Mall.png",
"Blackbelly Skatepark":"stages/S2_Stage_Blackbelly_Skatepark.png",
"Camp Triggerfish":"stages/S2_Stage_Camp_Triggerfish.png",
"Goby Arena":"stages/S2_Stage_Goby_Arena.png",
"Humpback Pump Track":"stages/S2_Stage_Humpback_Pump_Track.png",
"Inkblot Art Academy":"stages/S2_Stage_Inkblot_Art_Academy.png",
"Kelp Dome":"stages/S2_Stage_Kelp_Dome.png",
"MakoMart":"stages/S2_Stage_MakoMart.png",
"Manta Maria":"stages/S2_Stage_Manta_Maria.png",
"Moray Towers":"stages/S2_Stage_Moray_Towers.png",
"Musselforge Fitness":"stages/S2_Stage_Musselforge_Fitness.png",
"New Albacore Hotel":"stages/S2_Stage_New_Albacore_Hotel.png",
"Piranha Pit":"stages/S2_Stage_Piranha_Pit.png",
"Port Mackerel":"stages/S2_Stage_Port_Mackerel.png",
"Shellendorf Institute":"stages/S2_Stage_Shellendorf_Institute.png",
"Shifty Station":"stages/S2_Stage_Shifty_Station.png",
"Snapper Canal":"stages/S2_Stage_Snapper_Canal.png",
"Starfish Mainstage":"stages/S2_Stage_Starfish_Mainstage.png",
"Sturgeon Shipyard":"stages/S2_Stage_Sturgeon_Shipyard.png",
"The Reef":"stages/S2_Stage_The_Reef.png",
"Wahoo World":"stages/S2_Stage_Wahoo_World.png",
"Walleye Warehouse":"stages/S2_Stage_Walleye_Warehouse.png",
"Skipper Pavilion":"stages/S2_Stage_Skipper_Pavilion.png"};

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
const currentMaplist = nodecg.Replicant('currentMaplist', {
    defaultValue: [
        { id: 0, name: 'Default map list' },
        { map: 'Ancho-V Games', mode: 'Clam Blitz' },
        { map: 'Ancho-V Games', mode: 'Tower Control' },
        { map: 'Wahoo World', mode: 'Rainmaker' }
    ]
});
const mapWinners = nodecg.Replicant('mapWinners', { defaultValue: [0, 0, 0, 0, 0, 0, 0] });
const teamAInfo = nodecg.Replicant('teamAInfo', { defaultValue: emptyTeamInfo });
const teamBInfo = nodecg.Replicant('teamBInfo', { defaultValue: emptyTeamInfo });

//replicant changes
currentMaplist.on('change', newValue => {
	gsap.to('#upcomingStagesGrid', {duration: 0.5, opacity: 0, onComplete: function() {
		clearUpcomingStages();
		setMapCount(newValue.length - 1);
		for (let i = 1; i < newValue.length; i++) {
			addUpcomingStage(newValue[i], newValue.length - 1, i - 1);
		}
	}});
	gsap.to('#upcomingStagesGrid', {duration: 0.5, opacity: 1, delay: 0.5});
});

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
});

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
		hideMaps();
		showMainScene(0);
	} else if (newValue === "nextUp") {
		showTopBar(1.25);
		hideMainScene();
		hideMaps();
		showNextUp();
	} else if (newValue === "maps") {
		showTopBar(1.25);
		hideMainScene();
		hideNextUp();
		showMaps();
	}
});

nextTeamAInfo.on('change', newValue => {
	teamAImage.src = newValue.logoUrl;
	teamAName.text = newValue.name;
	addTeamPlayers('A', newValue.players);
});
nextTeamBInfo.on('change', newValue => {
	teamBImage.src = newValue.logoUrl;
	teamBName.text = newValue.name;
	addTeamPlayers('B', newValue.players);
});

mapWinners.on('change', (newValue, oldValue) => {
	if (!oldValue) {
		//assume we're on first load
		for (let i = 0; i < newValue.length; i++) {
			const element = newValue[i];
			if (element != 0) {
				addWinner(i, element);
			}
		}
	} else {
		for (let i = 0; i < newValue.length; i++) {
			const element = newValue[i];
			const oldElement = oldValue[i];
			if (element != oldElement) {
				if (element == 0) {
					removeWinner(i);
				} else if (oldElement == 0) {
					addWinner(i, element);
				} else {
					updateWinner(i, element);
				}
			}
		}
	}
});

teamAInfo.on('change', newValue => {
	for (let i = 0; i < currentMaplist.value.length - 1; i++) {
		if (mapWinners.value[i] != 0) {
			updateWinner(i, mapWinners.value[i]);
		}
	}
});

teamBInfo.on('change', newValue => {
	for (let i = 0; i < currentMaplist.value.length - 1; i++) {
		if (mapWinners.value[i] != 0) {
			updateWinner(i, mapWinners.value[i]);
		}
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
	.add(gsap.to({}, 10, {}));
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
			document.getElementById('teamAInfo').appendChild(playerText);
		} else if (teamNo === 'B') {
			playerText.align = "left";
			playerText.classList.add('teamPlayerB')
			document.getElementById('teamBInfo').appendChild(playerText);
		}
	}
}

function setMapCount(count) {
	/*grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;*/
	var styleVal = '';
	for (let i = 0; i < count; i++) {
		styleVal += '1fr ';
	}
	upcomingStagesGrid.style.gridTemplateColumns = styleVal;
	upcomingStagesGrid.style.width = '1700px';
	if (count == 3) {
		upcomingStagesGrid.style.width = '1400px';
	}
}

function addUpcomingStage(stageInfo, count, id) {
	/*<div class="stageBox">
			<img src="stages/S2_Stage_MakoMart.png" class="mapsStagePic">
			<div class="mapsModeName">Clam Blitz</div>
			<div class="mapsStageName">MakoMart</div>
			<div class="mapsNameGradient"></div>
			<div class="mapsWinnerName">Crustacean Crusaders</div>
			<div class="winnerGradient"></div>
		</div>*/

	const stageBox = document.createElement('div');
	stageBox.classList.add('stageBox');
	stageBox.id = 'stageBox_' + id;

	const stageName = document.createElement('div');
	stageName.innerText = stageInfo.map;
	stageName.classList.add('mapsStageName');
	stageBox.appendChild(stageName);

	const modeName = document.createElement('div');
	modeName.innerText = stageInfo.mode;
	modeName.classList.add('mapsModeName');
	stageBox.appendChild(modeName);

	const mapGradient = document.createElement('div');
	mapGradient.classList.add('mapsNameGradient');
	stageBox.appendChild(mapGradient);

	const stageImage = document.createElement('img');
	if (count == 3) {
		stageImage.classList.add('mapsStagePic3Maps');
	}
	stageImage.classList.add('mapsStagePic');
	stageImage.src = mapNameToImagePath[stageInfo.map];
	stageBox.appendChild(stageImage);

	document.getElementById('upcomingStagesGrid').appendChild(stageBox);
	if (mapWinners.value[id] != 0) {
		addWinner(id, mapWinners.value[id]);
	}
}

function addWinner(index, value) {
	const mapElem = document.querySelector('div#stageBox_' + index);
	if (!mapElem) {
		//we're in trouble
		return;
	}

	const name = mapElem.querySelector('.mapsWinnerName');
	const gradient = mapElem.querySelector('.winnerGradient');

	if (name == null && gradient == null) {
		const winnerName = document.createElement('div');
		winnerName.classList.add('mapsWinnerName');
		if (value == 1)  {
			winnerName.innerText = teamAInfo.value.name;
		} else if (value == 2) {
			winnerName.innerText = teamBInfo.value.name;
		}
		mapElem.appendChild(winnerName);

		const winnerGradient = document.createElement('div');
		winnerGradient.classList.add('winnerGradient');
		mapElem.appendChild(winnerGradient);

		gsap.fromTo(winnerName, {opacity: 0}, {duration: 0.3, opacity: 1});
		gsap.fromTo(winnerGradient, {opacity: 0}, {duration: 0.3, opacity: 1});
	}
}

function updateWinner(index, newValue) {
	const mapElem = document.querySelector('div#stageBox_' + index);
	if (!mapElem) {
		return;
	}

	const name = mapElem.querySelector('.mapsWinnerName');
	
	if (newValue == 1) {
		name.innerText = teamAInfo.value.name;
	} else if (newValue == 2) {
		name.innerText = teamBInfo.value.name;
	}
}

function removeWinner(index) {
	const mapElem = document.querySelector('div#stageBox_' + index);
	if (!mapElem) {
		return;
	}

	const name = mapElem.querySelector('.mapsWinnerName');
	const gradient = mapElem.querySelector('.winnerGradient');
	
	gsap.to(name, {duration: 0.3, opacity: 0});
	gsap.to(gradient, {duration: 0.3, opacity: 0, onComplete: function() {
		name.parentElement.removeChild(name);
		gradient.parentElement.removeChild(gradient);
	}});
}

function clearUpcomingStages() {
	document.getElementById('upcomingStagesGrid').innerHTML = '';
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

function showMaps() {
	gsap.fromTo("#nextMaps", {top: -1080}, {top: 0, duration: 1.5, ease: 'power3.inOut'});
}

function hideMaps() {
	gsap.to("#nextMaps", 1.5, {ease: 'power3.inOut',  top: 1080});
}
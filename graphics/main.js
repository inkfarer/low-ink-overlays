const emptyTeamInfo = {
    name: "",
    logoUrl: "",
    players: [{
        name: "",
        username: ""
    }]
};

const SBData = nodecg.Replicant('SBData', {defaultValue: {
	flavorText: 'Flavor Text',
	teamAInfo: {
		name: "Placeholder Team 1",
		players: [
			{name:"You should fix this before going live."}
		]
	},
	teamAColor: 'Green',
	teamBInfo: {
		name: "Placeholder Team 2",
		players: [
			{name:"You should fix this before going live."}
		]
	},
	teamBcolor: 'Purple'
}});
const teamScores = nodecg.Replicant('teamScores', {defaultValue: {
    teamA: 0,
    teamB: 0
}});
const SBShown = nodecg.Replicant('SBShown', {defaultValue: true});
const RGBMode = nodecg.Replicant('RGBMode', {defaultValue: false});

const colorNameToHex = {
	"Dark Blue": "#3535D2",
	"Green": "#6BD921",
	"Blue Green": "#16DD81",
	"Purple": "#B51CCE",
	"Yellow": "#FEF232",
	"Light Blue": "#2ED2FE",
	"Violet": "#8941FF",
	"Pink": "#EF26BD",
	"Turquoise": "#39EAB1",
	"Orange": "#FB7B08"
}

//replicant changes

SBData.on('change', newValue => {
	flavorTextDisplay.text = newValue.flavorText;
	teamAnameDisplay.text = newValue.teamAInfo.name;
	teamBnameDisplay.text = newValue.teamBInfo.name;
	gsap.to("#teamAcolorDisplay", { duration: 0.5, backgroundColor: colorNameToHex[newValue.teamAColor]});
	gsap.to("#teamBcolorDisplay", { duration: 0.5, backgroundColor: colorNameToHex[newValue.teamBcolor]});
});

teamScores.on('change', newValue => {
    teamAScoreDisplay.text = newValue.teamA;
    teamBScoreDisplay.text = newValue.teamB;
});

SBShown.on('change', newValue => {
    if (newValue) {
        //show scoreboard
        gsap.to(".scLine", { duration: 0.5, height: 106, top: 0, ease: "power2.out" });
        gsap.to("#scContents", { duration: 0.75, left: 0, ease: "power2.out", delay: 0.4 });
    } else {
        gsap.to("#scContents", 0.75, { duration: 0.75, left: -430, ease: "power2.in" });
        gsap.to(".scLine", { duration: 0.5, height: 0, top: 53, ease: "power2.in", delay: 0.7 });
    }
});

RGBMode.on('change', newValue => {
	if (newValue) {
		enableRGBMode();
	} else {
		disableRGBMode();
	}
});

var RGBTimeline = gsap.timeline({repeat: -1});
function enableRGBMode() {
	RGBTimeline = gsap.timeline({repeat: -1});
	const rainbowColors = ['#F37002', '#FFFF00', '#00FF00', '#0000FF', '#2E2B5F', '#8B00FF', '#FF0000', '#F37002'];
	for (let i = 0; i < rainbowColors.length; i++) {
		const element = rainbowColors[i];
		var duration = 1;
		if (i == 0) { duration = 0;}
		RGBTimeline.add(gsap.to(':root', {'--lowInkOrange':element, duration: duration, ease: 'none'}));
	}
}

function disableRGBMode() {
	RGBTimeline.kill();
	gsap.to(':root', {'--lowInkOrange':'#F37002', duration: 1, ease: 'none'});
}
const emptyTeamInfo = {
    name: "",
    logoUrl: "",
    players: [{
        name: "",
        username: ""
    }]
};

const SBData = nodecg.Replicant('SBData', 'ipl-overlay-controls');
const teamScores = nodecg.Replicant('teamScores', 'ipl-overlay-controls');
const SBShown = nodecg.Replicant('SBShown', 'ipl-overlay-controls');
const RGBMode = nodecg.Replicant('RGBMode', {defaultValue: false});

//replicant changes

SBData.on('change', newValue => {
	flavorTextDisplay.setAttribute('text', newValue.flavorText);
	teamAnameDisplay.setAttribute('text', newValue.teamAInfo.name);
	teamBnameDisplay.setAttribute('text', newValue.teamBInfo.name);
	gsap.to("#teamAcolorDisplay", { duration: 0.5, backgroundColor: (newValue.swapColorOrder) ? newValue.colorInfo.clrB : newValue.colorInfo.clrA});
	gsap.to("#teamBcolorDisplay", { duration: 0.5, backgroundColor: (newValue.swapColorOrder) ? newValue.colorInfo.clrA : newValue.colorInfo.clrB});
});

teamScores.on('change', newValue => {
    teamAScoreDisplay.setAttribute('text', newValue.teamA);
    teamBScoreDisplay.setAttribute('text', newValue.teamB);
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
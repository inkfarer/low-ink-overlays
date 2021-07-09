teamScores.on('change', newValue => {
	document.getElementById('team-a-score').setAttribute('text', newValue.teamA);
	document.getElementById('team-b-score').setAttribute('text', newValue.teamB);
});

scoreboardData.on('change', (newValue, oldValue) => {
	if (!oldValue) {
		textOpacitySwap(newValue.teamAInfo.name, document.getElementById('team-a-name'));
		textOpacitySwap(newValue.teamBInfo.name, document.getElementById('team-b-name'));
		textOpacitySwap(newValue.flavorText, document.getElementById('scoreboard-flavor-text'));
	} else {
		if (newValue.teamAInfo.name !== oldValue.teamAInfo.name) {
			textOpacitySwap(newValue.teamAInfo.name, document.getElementById('team-a-name'));
		}

		if (newValue.teamBInfo.name !== oldValue.teamBInfo.name) {
			textOpacitySwap(newValue.teamBInfo.name, document.getElementById('team-b-name'));
		}

		if (newValue.flavorText !== oldValue.flavorText) {
			textOpacitySwap(newValue.flavorText, document.getElementById('scoreboard-flavor-text'));
		}
	}

	gsap.to('#team-a-color', {
		backgroundColor: newValue.colorInfo.clrA,
		duration: 0.35
	});

	gsap.to('#team-b-color', {
		backgroundColor: newValue.colorInfo.clrB,
		duration: 0.35
	});
});

function textOpacitySwap(newText, elem) {
	gsap.to(elem, {
		opacity: 0, duration: 0.35, onComplete: () => {
			elem.setAttribute('text', newText);
		}
	});

	gsap.to(elem, {opacity: 1, duration: 0.35, delay: 0.35});
}

const sbShowTl = new gsap.timeline();

scoreboardShown.on('change', newValue => {
	if (newValue) {
		sbShowTl.add(gsap.to('.scoreboard-wrapper > .accent', {
			width: 375,
			duration: 0.75,
			ease: Power3.easeOut
		}));
		sbShowTl.add(gsap.to('.scoreboard-wrapper > .background', {
			width: 375,
			duration: 0.75,
			ease: Power3.easeOut
		}), '-=0.7');
	} else {
		sbShowTl.add(gsap.to('.scoreboard-wrapper > .background', {
			width: 0,
			duration: 0.75,
			ease: Power3.easeIn
		}));
		sbShowTl.add(gsap.to('.scoreboard-wrapper > .accent', {
			width: 0,
			duration: 0.75,
			ease: Power3.easeIn
		}), '-=0.7');
	}
});

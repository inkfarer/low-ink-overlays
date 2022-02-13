activeRound.on('change', (newValue, oldValue) => {
	doOnDifference(newValue, oldValue, 'teamA.score',
		value => document.getElementById('team-a-score').setAttribute('text', value));
	doOnDifference(newValue, oldValue, 'teamB.score',
		value => document.getElementById('team-b-score').setAttribute('text', value));

	doOnDifference(newValue, oldValue, 'teamA.name',
		value => textOpacitySwap(addDots(value, 32), document.getElementById('team-a-name')));
	doOnDifference(newValue, oldValue, 'teamB.name',
		value => textOpacitySwap(addDots(value, 32), document.getElementById('team-b-name')));

	gsap.to('#team-a-color', {
		backgroundColor: newValue.teamA.color,
		duration: 0.35
	});

	gsap.to('#team-b-color', {
		backgroundColor: newValue.teamB.color,
		duration: 0.35
	});
});

const sbShowTl = new gsap.timeline();

scoreboardData.on('change', (newValue, oldValue) => {
	doOnDifference(newValue, oldValue, 'flavorText',
		value => textOpacitySwap(value, document.getElementById('scoreboard-flavor-text')));

	if (newValue.isVisible) {
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
			ease: Power2.easeIn
		}));
		sbShowTl.add(gsap.to('.scoreboard-wrapper > .accent', {
			width: 0,
			duration: 0.75,
			ease: Power2.easeIn
		}), '-=0.7');
	}
});

function textOpacitySwap(newText, elem) {
	gsap.to(elem, {
		opacity: 0, duration: 0.35, onComplete: () => {
			elem.setAttribute('text', newText);
		}
	});
	gsap.to(elem, {opacity: 1, duration: 0.35, delay: 0.35});
}

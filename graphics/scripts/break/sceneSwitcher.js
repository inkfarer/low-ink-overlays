const activeBreakScene = nodecg.Replicant('activeBreakScene', DASHBOARD_BUNDLE_NAME);
const sceneTl = gsap.timeline();

activeBreakScene.on('change', (newValue, oldValue) => {
	if (!oldValue) {
		if (newValue !== 'main') {
			hideMainScene();
			hideTeams();
		}
	} else {
		switch (oldValue) {
			case 'main':
				hideMainScene();
				break;
			case 'teams':
				hideTeams();
				hideInfoBar('-=0.6')
				break;
			case 'stages':

				break;
			default:

		}
	}

	switch (newValue) {
		case 'main':
			setInfoSwitchAnim();
			showMainScene();
			break;
		case 'teams':
			showInfoBar();
			showTeams();
			break;
		case 'stages':

			break;
		default:

	}
});

function showMainScene() {
	toggleExpandBackground(false);
	sceneTl.add(gsap.to('.scene.main-scene > .scene-content', {
		x: 0,
		opacity: 1,
		ease: Power2.easeOut,
		duration: 0.5
	}), '-=0.15');
	sceneTl.add(gsap.to('.side-logo > .brand', {x: 0, opacity: 1, duration: 0.5, ease: Power2.easeOut}), '-=0.5');
}

function hideMainScene() {
	sceneTl.add(gsap.to('.scene.main-scene > .scene-content', {x: 50, opacity: 0, ease: Power2.easeIn, duration: 0.5}));
	sceneTl.add(gsap.to('.side-logo > .brand', {x: -50, opacity: 0, duration: 0.5, ease: Power2.easeIn}), '-=0.5');

	toggleExpandBackground(true);
}

function toggleExpandBackground(expand) {
	const bgWidth = expand ? 1920 : 800;

	sceneTl.add(gsap.to('.arrows-background', {duration: 1, width: bgWidth, ease: Power2.easeInOut}), '-=0.1');
}

function showInfoBar() {
	const width = 1400;

	sceneTl.add(gsap.to('.top-info-bar-accent', {width: width, ease: Power3.easeOut, duration: 0.75}));
	sceneTl.add(gsap.to(['.top-info-bar-background', '.top-info-bar'], {
		width: width,
		ease: Power3.easeOut,
		duration: 0.75
	}), '-=0.7');
}

function hideInfoBar(position = '-=0.0') {
	const width = 0;

	sceneTl.add(gsap.to(['.top-info-bar-background', '.top-info-bar'], {
		width: width,
		ease: Power3.easeIn,
		duration: 0.75
	}), position);
	sceneTl.add(gsap.to('.top-info-bar-accent', {width: width, ease: Power3.easeIn, duration: 0.75}), '-=0.75');
}

function showTeams() {
	const height = 650;

	sceneTl.add(gsap.to('.team > .accent', {height: height, duration: 0.75, ease: Power3.easeOut}), '-=0.6');
	sceneTl.add(gsap.to(['.team > .background', '.team > .content-wrapper'], {
		height: height,
		duration: 0.75,
		ease: Power3.easeOut
	}), '-=0.7');
	sceneTl.add(gsap.to('.scene.teams-scene > .scene-content > .versus', {opacity: 1, duration: 0.75}), '-=0.75');
}

function hideTeams() {
	const height = 0;

	sceneTl.add(gsap.to(['.team > .background', '.team > .content-wrapper'], {
		height: height,
		duration: 0.75,
		ease: Power3.easeIn
	}));
	sceneTl.add(gsap.to('.team > .accent', {height: height, duration: 0.75, ease: Power3.easeIn}), '-=0.75');
	sceneTl.add(gsap.to('.scene.teams-scene > .scene-content > .versus', {opacity: 0, duration: 0.75}), '-=0.75');
}

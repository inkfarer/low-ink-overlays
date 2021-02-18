const activeBreakScene = nodecg.Replicant('activeBreakScene', DASHBOARD_BUNDLE_NAME);
const sceneTl = gsap.timeline();

activeBreakScene.on('change', (newValue, oldValue) => {
	if (!oldValue) {
		if (newValue !== 'main') {
			hideMainScene();

		}
	} else {
		switch (oldValue) {
			case 'main':
				hideMainScene();

				break;
			case 'break':

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
		case 'break':

			break;
		case 'stages':

			break;
		default:

	}
});

function showMainScene() {
	hideInfoBar();
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
	showInfoBar();
}

function toggleExpandBackground(expand) {
	const bgWidth = expand ? 1920 : 800;

	sceneTl.add(gsap.to('.arrows-background', {duration: 1, width: bgWidth, ease: Power2.easeInOut}), '-=0.1');
}

function showInfoBar() {
	const width = 1400;

	sceneTl.add(gsap.to('.top-info-bar-accent', {width: width, ease: Power3.easeOut, duration: 0.5}));
	sceneTl.add(gsap.to(['.top-info-bar-background', '.top-info-bar'], {width: width, ease: Power3.easeOut, duration: 0.5}), '-=0.45');
}

function hideInfoBar() {
	const width = 0;

	sceneTl.add(gsap.to(['.top-info-bar-background', '.top-info-bar'], {width: width, ease: Power3.easeIn, duration: 0.5}));
	sceneTl.add(gsap.to('.top-info-bar-accent', {width: width, ease: Power3.easeIn, duration: 0.5}), '-=0.5');
}

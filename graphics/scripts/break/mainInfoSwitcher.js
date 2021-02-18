const infoContainers = document.querySelectorAll('.scene.main-scene > .scene-content > .main-container');
let infoTl;

function setInfoSwitchAnim() {
	if (infoTl) {
		infoTl.kill();
	}
	infoTl = gsap.timeline({repeat: -1});

	for (let i = 0; i < infoContainers.length; i++) {
		const elem = infoContainers[i];

		infoTl.add(gsap.fromTo(elem, {opacity: 0, x: -25}, {opacity: 1, x: 0, duration: 0.5, ease: Power2.easeOut, force3D: false}));
		infoTl.add(gsap.to({}, {duration: 20}));
		infoTl.add(gsap.to(elem, {opacity: 0, x: 25, duration: 0.5, ease: Power2.easeIn, force3D: false}));
	}
}

document.addEventListener('DOMContentLoaded', () => {
	setInfoSwitchAnim();
});

const infoContainers = document.querySelectorAll('.scene.main-scene > .scene-content > .main-container');
const infoTl = gsap.timeline({repeat: -1});

function createSwitchAnim() {
	for (let i = 0; i < infoContainers.length; i++) {
		const elem = infoContainers[i];

		infoTl.add(gsap.fromTo(elem, {opacity: 0, x: -25}, {opacity: 1, x: 0, duration: 0.5, ease: 'power2.out'}));
		infoTl.add(gsap.to({}, {duration: 20}));
		infoTl.add(gsap.to(elem, {opacity: 0, x: 25, duration: 0.5, ease: 'power2.in'}));
	}
}

document.addEventListener('DOMContentLoaded', () => {
	createSwitchAnim();
});

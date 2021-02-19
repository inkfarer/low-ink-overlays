const flavorTextElem = document.getElementById('main-flavor-text');
const flavorTextTl = gsap.timeline();

mainFlavorText.on('change', newValue => {
	flavorTextTl.add(
		gsap.fromTo(flavorTextElem, {x: 0}, {
			x: 50,
			opacity: 0,
			duration: 0.5,
			ease: Power2.easeIn,
			onComplete: function() {
				flavorTextElem.setAttribute('text', newValue);
			}
		})
	);

	flavorTextTl.add(
		gsap.fromTo(flavorTextElem, {x: -50}, {
			x: 0,
			opacity: 1,
			duration: 0.5,
			ease: Power2.easeOut
		})
	);
});

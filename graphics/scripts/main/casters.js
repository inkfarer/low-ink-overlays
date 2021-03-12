const castersElem = document.querySelector('div.casters-wrapper > .background > .casters-content > .casters');
const castersShowTl = gsap.timeline();

casters.on('change', newValue => {
	let elemHtml = '';
	const castersHeight = 50 + Object.keys(newValue).length * 40;
	gsap.set('div.casters-wrapper > .background', {height: castersHeight});

	Object.keys(newValue).forEach((item, index, arr) => {
		const element = newValue[item];

		elemHtml += `
		<div class="caster">
			<div class="caster-name">
				<fitted-text text="${element.name} <span class=&quot;pronoun&quot;>${element.pronouns}</span>" useInnerHTML max-width="350"></fitted-text>
			</div>
			<div class="caster-twitter">
				<fitted-text text="${element.twitter} <span class=&quot;pronoun&quot;>${element.pronouns}</span>" useInnerHTML max-width="350"></fitted-text>
			</div>
		</div>`
	});

	castersElem.innerHTML = elemHtml;
});

document.addEventListener('DOMContentLoaded', () => {
	gsap.set(['div.casters-wrapper > .accent', 'div.casters-wrapper > .background'], {width: 0});
});

nodecg.listenFor('mainShowCasters', DASHBOARD_BUNDLE_NAME, () => {
	const duration = 20;
	gsap.set('.caster > .caster-twitter', {opacity: 0});
	gsap.set('.caster > .caster-name', {opacity: 1});

	castersShowTl.add(gsap.to('.casters-wrapper > .accent', {
		width: 375,
		duration: 0.75,
		ease: Power3.easeOut
	}))
	.add(gsap.to('.casters-wrapper > .background', {
		width: 375,
		duration: 0.75,
		ease: Power3.easeOut
	}), '-=0.7')
	.add(gsap.to({}, {duration: duration}))
	.add(gsap.to('.caster > .caster-twitter', {opacity: 1, duration: 0.35}), `-=${duration / 2}`)
	.add(gsap.to('.caster > .caster-name', {opacity: 0, duration: 0.35}), `-=${duration / 2}`)
	.add(gsap.to('.casters-wrapper > .background', {
		width: 0,
		duration: 0.75,
		ease: Power3.easeIn
	}))
	.add(gsap.to('.casters-wrapper > .accent', {
		width: 0,
		duration: 0.75,
		ease: Power3.easeIn
	}), '-=0.7');
});

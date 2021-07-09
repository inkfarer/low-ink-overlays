const topBarCasterElem = document.getElementById('info-row-casters-text');
const topBarTwitterElem = document.getElementById('info-row-casters-twitter-text');
const topBarCastersTl = gsap.timeline();

casters.on('change', (newValue, oldValue) => {
	let castersText = '';
	let twittersText = '';

	let updateTwitters = (oldValue === undefined);
	let updateNames = (oldValue === undefined);

	Object.keys(newValue).forEach((item, index, arr) => {
		const element = newValue[item];

		if (oldValue && (!updateTwitters || !updateNames)) {
			const oldElement = oldValue[item];

			Object.keys(oldValue).forEach((item, index, arr) => {
				if (!newValue[item]) {
					updateTwitters = true;
					updateNames = true;
				}
			});

			if (!oldElement || element.pronouns !== oldElement.pronouns) {
				updateNames = true;
				updateTwitters = true;
			} else {
				if (element.twitter !== oldElement.twitter) {
					updateTwitters = true;
				}
				if (element.name !== oldElement.name) {
					updateNames = true;
				}
			}
		}

		castersText += `${element.name} <span class="pronoun">${element.pronouns}</span>`;
		twittersText += `${element.twitter} <span class="pronoun">${element.pronouns}</span>`;

		if (arr[index + 2]) {
			castersText += ', ';
			twittersText += ', ';
		} else if (arr[index + 1]) {
			castersText += ' & ';
			twittersText += ' & ';
		}
	});

	if (updateNames) {
		topBarCastersTl.add(gsap.to([topBarCasterElem, getIcon(topBarCasterElem)], {
			opacity: 0,
			duration: 0.3,
			onComplete: () => {
				topBarCasterElem.setAttribute('text', castersText);
			}
		}));

		topBarCastersTl.add(gsap.to([topBarCasterElem, getIcon(topBarCasterElem)], {
			opacity: 1,
			duration: 0.3
		}));
	}

	if (updateTwitters) {
		topBarCastersTl.add(gsap.to([topBarTwitterElem, getIcon(topBarTwitterElem)], {
			opacity: 0,
			duration: 0.3,
			onComplete: () => {
				topBarTwitterElem.setAttribute('text', twittersText);
			}
		}));

		topBarCastersTl.add(gsap.to([topBarTwitterElem, getIcon(topBarTwitterElem)], {
			opacity: 1,
			duration: 0.3
		}));
	}
});

function getIcon(elem) {
	return elem.parentNode.querySelector('i');
}

const casters = nodecg.Replicant('casters', DASHBOARD_BUNDLE_NAME);
const topBarCasterElem = document.getElementById('info-row-casters-text');
const topBarTwitterElem = document.getElementById('info-row-casters-twitter-text');

casters.on('change', newValue => {
	let castersText = '';
	let twittersText = '';

	Object.keys(newValue).forEach((item, index, arr) => {
		const element = casters.value[item];
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

	topBarCasterElem.setAttribute('text', castersText);
	topBarTwitterElem.setAttribute('text', twittersText);
});

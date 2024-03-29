const nextRoundTimeElem = document.getElementById('next-round-minutes');
let nextStageDate;
let lastDiff;

nextRoundTime.on('change', newValue => {
	const elemHeight = newValue.isVisible ? 252 : 0;
	const elemOpacity = newValue.isVisible ? 1 : 0;
	gsap.to('.next-round-timer', {duration: 0.5, height: elemHeight, opacity: elemOpacity, ease: Power2.easeInOut});

	const time = luxon.DateTime.fromISO(newValue.startTime);
	nextStageDate = time;

	const roundTimes = {
		"est": time.setZone('America/New_York'),
		"utc": time.setZone('Etc/GMT').setLocale('en-GB')
	};

	for (const [key, value] of Object.entries(roundTimes)) {
		document.getElementById(`next-round-time-${key}`).innerText = value.toFormat('t ZZZZ');
	}
});

NodeCG.waitForReplicants(runtimeConfig).then(() => {
	setInterval(() => {
		const diff = Math.ceil(nextStageDate.diffNow(['minutes']).toObject().minutes);
		if (lastDiff !== diff) {
			lastDiff = diff;
			let newText;

			switch (runtimeConfig.value.locale) {
				case 'EU_FR': {
					if (diff < 1) {
						newText = '<span class="count-minutes">[FR] Soon!</span>';
					} else if (diff === 1) {
						newText = `[FR] in <span class="count-minutes">~${diff}</span> minute`;
					} else {
						newText = `[FR] in <span class="count-minutes">~${diff}</span> minutes`;
					}
					break;
				}
				default: {
					if (diff < 1) {
						newText = '<span class="count-minutes">Soon!</span>';
					} else if (diff === 1) {
						newText = `in <span class="count-minutes">~${diff}</span> minute`;
					} else {
						newText = `in <span class="count-minutes">~${diff}</span> minutes`;
					}
				}
			}

			nextRoundTimeElem.innerHTML = newText;
		}
	}, 1000);
});

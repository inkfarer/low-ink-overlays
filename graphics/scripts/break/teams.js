const teamsTls = {
	'a': gsap.timeline(),
	'b': gsap.timeline()
}

nextTeams.on('change', (newValue, oldValue) => {
	if (!oldValue) {
		setTeams(newValue.teamAInfo, 'a');
		setTeams(newValue.teamBInfo, 'b');
		return;
	}

	if (newValue.teamAInfo.id !== oldValue.teamAInfo.id) {
		setTeams(newValue.teamAInfo, 'a');
	}

	if (newValue.teamBInfo.id !== oldValue.teamBInfo.id) {
		setTeams(newValue.teamBInfo, 'b');
	}
});

function setTeams(data, team) {
	const tl = teamsTls[team];

	const teamNameElem = document.getElementById(`team-${team}-name`);
	tl.add(gsap.to(teamNameElem, {
		opacity: 0, duration: 0.3, onComplete: function () {
			teamNameElem.setAttribute('text', data.name);
		}
	}));
	tl.add(gsap.to(teamNameElem, {opacity: 1, duration: 0.3}));

	const teamImageElem = document.getElementById(`team-${team}-image`);

	tl.add(gsap.to(teamImageElem, {
		opacity: 0, duration: 0.3, onComplete: () => {
			if (data.logoUrl === '' || data.logoUrl === undefined || data.logoUrl === null) {
				teamImageElem.style.backgroundImage = 'unset';
			} else {
				loadImage(data.logoUrl, () => {
					teamImageElem.style.backgroundImage = `url("${data.logoUrl}")`;
					if ((team === 'a' && teamImageShown.value.teamA === true) || (team === 'b' && teamImageShown.value.teamB === true)) {
						tl.add(gsap.to(teamImageElem, {opacity: 0.2, duration: 0.3}));
					}
				});
			}
		}
	}), '-=0.6');

	const teamPlayersElem = document.getElementById(`team-${team}-players`);
	tl.add(gsap.to(teamPlayersElem, {
		opacity: 0, duration: 0.3, onComplete: function () {
			teamPlayersElem.innerHTML = '';
			for (let i = 0; i < data.players.length; i++) {
				const player = data.players[i];

				const playerNameElem = document.createElement('fitted-text');
				playerNameElem.classList.add('team-player');
				playerNameElem.setAttribute('text', player.name);
				playerNameElem.setAttribute('max-width', '445');

				teamPlayersElem.appendChild(playerNameElem);
			}
		}
	}), '-=0.6');
	tl.add(gsap.to(teamPlayersElem, {opacity: 1, duration: 0.3}), '-=0.3');
}

function loadImage(imageUrl, callback) {
	const imageLoaderElem = document.createElement("img");
	imageLoaderElem.src = imageUrl;

	imageLoaderElem.addEventListener('load', e => {
		callback();
	});
}

teamImageShown.on('change', newValue => {
	gsap.to('#team-a-image', {opacity: newValue.teamA ? 0.2 : 0, duration: 0.35});
	gsap.to('#team-b-image', {opacity: newValue.teamB ? 0.2 : 0, duration: 0.35});
});

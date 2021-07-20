const teamsTls = {
	'a': gsap.timeline(),
	'b': gsap.timeline()
}

activeRound.on('change', (newValue, oldValue) => {
	doOnDifference(newValue, oldValue, 'teamA.id',
		() => setTeams(newValue.teamA, 'a'));
	doOnDifference(newValue, oldValue, 'teamB.id',
		() => setTeams(newValue.teamB, 'b'));

	updateTeamImageHidden(newValue, oldValue, 'a');
	updateTeamImageHidden(newValue, oldValue, 'b');
});

function updateTeamImageHidden(newValue, oldValue, team) {
	const teamData = team === 'a' ? newValue.teamA : newValue.teamB;

	if (!teamData.showLogo) {
		gsap.to(`#team-${team}-image`, {opacity: 0, duration: 0.35})
	} else {
		doOnNoDifference(newValue, oldValue, `team${team.toUpperCase()}.id`,
			() => gsap.to(`#team-${team}-image`, {opacity: 0.2, duration: 0.35}));
	}
}

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
					if (data.showLogo) {
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

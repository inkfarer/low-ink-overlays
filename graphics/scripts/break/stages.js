const stagesElem = document.getElementById('stages-grid');
const winnerTls = {
	0: gsap.timeline(),
	1: gsap.timeline(),
	2: gsap.timeline(),
	3: gsap.timeline(),
	4: gsap.timeline(),
	5: gsap.timeline(),
	6: gsap.timeline(),
};
const stagesTl = gsap.timeline();
const sbTls = {
	'a': gsap.timeline(),
	'b': gsap.timeline()
};

function getStageImagePath(stageName) {
	const path = assetPaths.value.stageImages[stageName];
	return path == null ? 'img/low-ink-unknown-map.png' : path;
}

NodeCG.waitForReplicants(activeRound, activeBreakScene, assetPaths, localeInfo, runtimeConfig).then(() => {
	runtimeConfig.on('change', (newValue, oldValue) => {
		if (oldValue) {
			doOnDifference(newValue, oldValue, 'locale', () => updateStages(activeRound.value));
		}
	});

	activeRound.on('change', (newValue, oldValue) => {
		doOnDifference(newValue, oldValue, 'match.id', () => updateStages(newValue));

		doOnNoDifference(newValue, oldValue, 'match.id', () => {
			newValue.games.forEach((game, index) => {
				doOnDifference(newValue, oldValue, `games[${index}].winner`,
					(newWinner, oldWinner) => setGameWinner(index, newWinner, oldWinner));

				if (oldValue) {
					doOnOneOrMoreDifference(newValue, oldValue, [`games[${index}].stage`, `games[${index}].mode`],
						() => updateSingleStage(index, game));
				}
			});
		});

		doOnDifference(newValue, oldValue, 'teamA.name',
			value => {
				updateScoreboardName('a', value);
				newValue.games.forEach((game, index) => {
					if (game.winner === 'alpha') {
						setWinnerName(index, value);
					}
				});
			});
		doOnDifference(newValue, oldValue, 'teamB.name',
			value => {
				updateScoreboardName('b', value);
				newValue.games.forEach((game, index) => {
					if (game.winner === 'bravo') {
						setWinnerName(index, value);
					}
				});
			});

		document.getElementById('team-a-score-scoreboard').setAttribute('text', newValue.teamA.score);
		document.getElementById('team-b-score-scoreboard').setAttribute('text', newValue.teamB.score);
	});
});

function updateScoreboardName(team, newName) {
	const teamNameElem = document.getElementById(`team-${team}-name-scoreboard`);

	sbTls[team].add(gsap.to(teamNameElem, {
		opacity: 0, duration: 0.35, onComplete: function() {
			teamNameElem.setAttribute('text', addDots(newName));
		}
	}))
		.add(gsap.to(teamNameElem, {opacity: 1, duration: 0.35}));
}

async function updateSingleStage(index, game) {
	const stageImagePath = getStageImagePath(game.stage);
	await loadImagePromise(stageImagePath);
	const stageElem = document.getElementById(`stage_${index}`);
	const imageElem = stageElem.querySelector('.stage-content > .stage-image');
	const modeTextElem = stageElem.querySelector('.stage-content > .stage-text > .stage-info > fitted-text.stage-mode');
	const stageNameElem = stageElem.querySelector('.stage-content > .stage-text > .stage-info > div.stage-name');

	winnerTls[index].add(gsap.to(`#stage_${index} > .stage-content`, {
		height: 0,
		duration: 0.75,
		ease: Power3.easeIn
	}))
	.add(gsap.to(`#stage_${index} > .accent`, {
		height: 0,
		duration: 0.75,
		ease: Power3.easeIn,
		onComplete: () => {
			imageElem.style.backgroundImage = `url('${stageImagePath}')`;
			modeTextElem.setAttribute('text', localeInfo.value.modes[game.mode]);
			stageNameElem.innerText = localeInfo.value.stages[game.stage];
		}
	}), '-=0.55');

	winnerTls[index].add(gsap.to(`#stage_${index} > .accent`, {
		height: 700,
		duration: 0.75,
		ease: Power3.easeOut,
	}), '+=0.25')
	.add(gsap.to(`#stage_${index} > .stage-content`, {
		height: 700,
		duration: 0.75,
		ease: Power3.easeOut,
	}), '-=0.55');
}

let isFirstStageUpdate = true;

async function updateStages(roundObject) {
	let stagesWidth = 0;
	let stagesGap = 0;
	let stageModeMaxWidth = 0;
	let stageNameFontSize = 0;
	let stageModeFontSize = 0;
	switch (roundObject.games.length) {
		case 3:
			stagesWidth = 1200;
			stagesGap = 50;
			stageModeMaxWidth = 345;
			stageNameFontSize = 40;
			stageModeFontSize = 37;
			break;
		case 5:
			stagesWidth = 1500;
			stagesGap = 35;
			stageModeMaxWidth = 245;
			stageNameFontSize = 38;
			stageModeFontSize = 35;
			break;
		case 7:
			stagesWidth = 1700;
			stagesGap = 20;
			stageModeMaxWidth = 200;
			stageNameFontSize = 34;
			stageModeFontSize = 31;
	}

	const imageLoadPromises = [];
	let roundsHTML = '';
	for (let i = 0; i < roundObject.games.length; i++) {
		const game = roundObject.games[i];
		const stageImagePath = getStageImagePath(game.stage);
		imageLoadPromises.push(loadImagePromise(stageImagePath))

		const winnerValue = game.winner;
		let winnerName = '';
		if (winnerValue === 'alpha') {
			winnerName = addDots(activeRound.value.teamA.name);
		} else if (winnerValue === 'bravo') {
			winnerName = addDots(activeRound.value.teamB.name);
		}

		// noinspection CssUnknownTarget,CssInvalidPropertyValue
		roundsHTML += `
			<div class="stage flex-align-center" id="stage_${i}">
				<div class="accent"></div>
				<div class="stage-content flex-align-center">
					<div class="stage-image"
						style="background-image: url('${stageImagePath}'); filter: saturate(1)">
					</div>
					<div class="stage-text">
						<div class="stage-winner-wrapper flex-align-center" style="opacity: ${winnerValue === 'none' ? 0 : 1}">
							<div class="stage-winner" style="font-size: ${stageModeFontSize}px">${winnerName}</div>
						</div>
						<div class="stage-info">
							<fitted-text
								class="stage-mode"
								style="font-size: ${stageModeFontSize}px"
								text="${localeInfo.value.modes[game.mode]}"
								max-width="${stageModeMaxWidth}">
							</fitted-text>
							<div class="stage-name" style="font-size: ${stageNameFontSize}px">${localeInfo.value.stages[game.stage]}</div>
						</div>
					</div>
				</div>
			</div>`
	}

	await Promise.all(imageLoadPromises);

	if (activeBreakScene.value === 'stages' && !isFirstStageUpdate) {
		hideStageElems(stagesTl, () => {
			gsap.set(stagesElem, {
				gridTemplateColumns: `repeat(${roundObject.games.length}, 1fr)`,
				width: stagesWidth,
				gap: stagesGap
			});
			stagesElem.innerHTML = roundsHTML;
			showStageElems(stagesTl);
		});
	} else {
		isFirstStageUpdate = false;
		gsap.set(stagesElem, {
			gridTemplateColumns: `repeat(${roundObject.games.length}, 1fr)`,
			width: stagesWidth,
			gap: stagesGap
		});
		stagesElem.innerHTML = roundsHTML;
	}
}

function setGameWinner(index, winner, oldWinner) {
	const stageElems = document.querySelectorAll('.scene.stages-scene > .stages-grid > .stage');
	if (!stageElems[index]) return;

	const elem = stageElems[index];
	const image = elem.querySelector('.stage-content > .stage-image');
	const winnerElem = elem.querySelector('.stage-content > .stage-text > .stage-winner-wrapper');
	const winnerTextElem = elem.querySelector('.stage-content > .stage-text > .stage-winner-wrapper > .stage-winner');

	const tl = winnerTls[index];

	const winnerOpacity = winner === 'none' ? 0 : 1;
	const winnerSaturation = winner === 'none' ? 1 : 0.15;
	let winnerName;
	if (winner === 'alpha') {
		winnerName = addDots(activeRound.value.teamA.name)
	} else if (winner === 'bravo') {
		winnerName = addDots(activeRound.value.teamB.name);
	}

	if (winner !== 'none') {
		if (oldWinner === 'none') {
			winnerTextElem.innerText = winnerName;
		} else {
			setWinnerName(index, winnerName);
		}
	}

	tl.add(gsap.to(image, {duration: 0.35, filter: `saturate(${winnerSaturation})`}))
		.add(gsap.to(winnerElem, {duration: 0.35, opacity: winnerOpacity}), '-=0.35');
}

function setWinnerName(index, name) {
	const stageElems = document.querySelectorAll('.scene.stages-scene > .stages-grid > .stage');
	if (!stageElems[index]) return;

	const elem = stageElems[index];
	const winnerTextElem = elem.querySelector('.stage-content > .stage-text > .stage-winner-wrapper > .stage-winner');

	const tl = winnerTls[index];

	tl.add(gsap.to(winnerTextElem, {
		opacity: 0, duration: 0.35, onComplete: function () {
			winnerTextElem.innerText = addDots(name);
		}
	}))
		.add(gsap.to(winnerTextElem, {opacity: 1, duration: 0.35}));
}

const rounds = nodecg.Replicant('rounds', DASHBOARD_BUNDLE_NAME);
const activeRound = nodecg.Replicant('activeRoundId', DASHBOARD_BUNDLE_NAME);
const gameWinners = nodecg.Replicant('gameWinners', DASHBOARD_BUNDLE_NAME);
const scoreboardData = nodecg.Replicant('scoreboardData', DASHBOARD_BUNDLE_NAME);
const teamScores = nodecg.Replicant('teamScores', DASHBOARD_BUNDLE_NAME);

const stagesElem = document.getElementById('stages-grid');
const mapNameToImagePath = {
	"Ancho-V Games": "S2_Stage_Ancho-V_Games.png",
	"Arowana Mall": "S2_Stage_Arowana_Mall.png",
	"Blackbelly Skatepark": "S2_Stage_Blackbelly_Skatepark.png",
	"Camp Triggerfish": "S2_Stage_Camp_Triggerfish.png",
	"Goby Arena": "S2_Stage_Goby_Arena.png",
	"Humpback Pump Track": "S2_Stage_Humpback_Pump_Track.png",
	"Inkblot Art Academy": "S2_Stage_Inkblot_Art_Academy.png",
	"Kelp Dome": "S2_Stage_Kelp_Dome.png",
	"MakoMart": "S2_Stage_MakoMart.png",
	"Manta Maria": "S2_Stage_Manta_Maria.png",
	"Moray Towers": "S2_Stage_Moray_Towers.png",
	"Musselforge Fitness": "S2_Stage_Musselforge_Fitness.png",
	"New Albacore Hotel": "S2_Stage_New_Albacore_Hotel.png",
	"Piranha Pit": "S2_Stage_Piranha_Pit.png",
	"Port Mackerel": "S2_Stage_Port_Mackerel.png",
	"Shellendorf Institute": "S2_Stage_Shellendorf_Institute.png",
	"Shifty Station": "S2_Stage_Shifty_Station.png",
	"Snapper Canal": "S2_Stage_Snapper_Canal.png",
	"Starfish Mainstage": "S2_Stage_Starfish_Mainstage.png",
	"Sturgeon Shipyard": "S2_Stage_Sturgeon_Shipyard.png",
	"The Reef": "S2_Stage_The_Reef.png",
	"Wahoo World": "S2_Stage_Wahoo_World.png",
	"Walleye Warehouse": "S2_Stage_Walleye_Warehouse.png",
	"Skipper Pavilion": "S2_Stage_Skipper_Pavilion.png",
	"Unknown Map": "low-ink-unknown-map.png"
};
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

NodeCG.waitForReplicants(rounds, activeRound, gameWinners, scoreboardData).then(() => {
	activeRound.on('change', newValue => {
		const roundObject = rounds.value[newValue];
		updateStages(roundObject);
	});

	rounds.on('change', (newValue, oldValue) => {
		const currentRound = newValue[activeRound.value];

		if (oldValue && !stageGamesMatch(currentRound, oldValue[activeRound.value])) {
			updateStages(currentRound);
		}
	});

	gameWinners.on('change', (newValue, oldValue) => {
		if (!oldValue) {
			for (let i = 0; i < newValue.length; i++) {
				setGameWinner(i, newValue[i], 0);
			}
		} else {
			for (let i = 0; i < newValue.length; i++) {
				if (newValue[i] !== oldValue[i]) {
					setGameWinner(i, newValue[i], oldValue[i]);
				}
			}
		}
	});

	scoreboardData.on('change', (newValue, oldValue) => {
		for (let i = 0; i < gameWinners.value.length; i++) {
			const elem = gameWinners.value[i];

			if (elem === 1) {
				if (oldValue && oldValue.teamAInfo.name === newValue.teamAInfo.name) continue;
				setWinnerName(i, newValue.teamAInfo.name);
			} else if (elem === 2) {
				if (oldValue && oldValue.teamBInfo.name === newValue.teamBInfo.name) continue;
				setWinnerName(i, newValue.teamBInfo.name);
			}
		}

		if (!oldValue) {
			updateScoreboardName('a', newValue.teamAInfo.name);
			updateScoreboardName('b', newValue.teamBInfo.name);
		} else {
			if (oldValue.teamAInfo.name !== newValue.teamAInfo.name) {
				updateScoreboardName('a', newValue.teamAInfo.name);
			}

			if (oldValue.teamBInfo.name !== newValue.teamBInfo.name) {
				updateScoreboardName('b', newValue.teamBInfo.name);
			}
		}
	});
});

teamScores.on('change', newValue => {
	document.getElementById('team-a-score-scoreboard').setAttribute('text', newValue.teamA);
	document.getElementById('team-b-score-scoreboard').setAttribute('text', newValue.teamB);
});

function updateScoreboardName(team, newName) {
	const teamNameElem = document.getElementById(`team-${team}-name-scoreboard`);

	sbTls[team].add(gsap.to(teamNameElem, {
		opacity: 0, duration: 0.35, onComplete: function() {
			teamNameElem.innerText = newName;
		}
	}))
		.add(gsap.to(teamNameElem, {opacity: 1, duration: 0.35}));
}

function updateStages(roundObject) {
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

	let roundsHTML = '';
	for (let i = 0; i < roundObject.games.length; i++) {
		const game = roundObject.games[i];

		const winnerValue = gameWinners.value[i];
		let winnerName = '';
		if (winnerValue === 1) {
			winnerName = scoreboardData.value.teamAInfo.name;
		} else if (winnerValue === 2) {
			winnerName = scoreboardData.value.teamBInfo.name;
		}

		// noinspection CssUnknownTarget,CssInvalidPropertyValue
		roundsHTML += `
			<div class="stage flex-align-center">
				<div class="accent"></div>
				<div class="stage-content flex-align-center">
					<div class="stage-image"
						style="background-image: url('img/stages/${mapNameToImagePath[game.stage]}'); filter: saturate(1)">
					</div>
					<div class="stage-text">
						<div class="stage-winner-wrapper flex-align-center" style="opacity: ${winnerValue === 0 ? 0 : 1}">
							<div class="stage-winner" style="font-size: ${stageModeFontSize}px">${winnerName}</div>
						</div>
						<div class="stage-info">
							<fitted-text
								class="stage-mode"
								style="font-size: ${stageModeFontSize}px"
								text="${game.mode}"
								max-width="${stageModeMaxWidth}">
							</fitted-text>
							<div class="stage-line"></div>
							<div class="stage-name" style="font-size: ${stageNameFontSize}px">${game.stage}</div>
						</div>
					</div>
				</div>
			</div>`
	}



	hideStageElems(stagesTl, () => {
		gsap.set(stagesElem, {
			gridTemplateColumns: `repeat(${roundObject.games.length}, 1fr)`,
			width: stagesWidth,
			gap: stagesGap
		});
		stagesElem.innerHTML = roundsHTML;
		showStageElems(stagesTl);
	});

}

function stageGamesMatch(elem1, elem2) {
	if (elem1.games.length !== elem2.games.length) return false;

	for (let i = 0; i < elem1.games.length; i++) {
		const elem1Game = elem1.games[i];
		const elem2Game = elem2.games[i];

		if (elem1Game.stage !== elem2Game.stage) return false;
		if (elem1Game.mode !== elem2Game.mode) return false;
	}

	return true;
}

function setGameWinner(index, winner, oldWinner) {
	const stageElems = document.querySelectorAll('.scene.stages-scene > .stages-grid > .stage');
	if (!stageElems[index]) return;

	const elem = stageElems[index];
	const image = elem.querySelector('.stage-content > .stage-image');
	const winnerElem = elem.querySelector('.stage-content > .stage-text > .stage-winner-wrapper');
	const winnerTextElem = elem.querySelector('.stage-content > .stage-text > .stage-winner-wrapper > .stage-winner');

	const tl = winnerTls[index];

	const winnerOpacity = winner === 0 ? 0 : 1;
	const winnerSaturation = winner === 0 ? 1 : 0.15;
	let winnerName;
	if (winner === 1) {
		winnerName = scoreboardData.value.teamAInfo.name;
	} else if (winner === 2) {
		winnerName = scoreboardData.value.teamBInfo.name;
	}

	if (winner !== 0) {
		if (oldWinner === 0) {
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
			winnerTextElem.innerText = name;
		}
	}))
		.add(gsap.to(winnerTextElem, {opacity: 1, duration: 0.35}));


}

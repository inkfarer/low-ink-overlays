// Handle team score edits

const teamScores = nodecg.Replicant('teamScores', {defaultValue: {
    teamA: 0,
    teamB: 0
}});

teamScores.on('change', newValue => {
	teamAScoreInput.value = newValue.teamA;
	teamBScoreInput.value = newValue.teamB;
});

teamAPlus.onclick = () => { teamScores.value.teamA++; }
teamAMinus.onclick = () => { teamScores.value.teamA--; }
teamBPlus.onclick = () => { teamScores.value.teamB++; }
teamBMinus.onclick = () => { teamScores.value.teamB--; }

teamAScoreInput.oninput = event => { teamScores.value.teamA = event.target.value; }
teamBScoreInput.oninput = event => { teamScores.value.teamB = event.target.value; }

// Handle team data edits

const tourneyData = nodecg.Replicant('tourneyData', {
	defaultValue: [
		{tourneySlug: "none", tourneyName: 'none'},
		{
			name: "Placeholder Team 1",
			players: [
				{name:"You should fix this before going live."}
			]
		},
		{
			name: "Placeholder Team 2",
			players: [
				{name:"You should fix this before going live."}
			]
		}
	]
});

tourneyData.on('change', newValue => {
	clearSelectors('teamSelector');
    for (let i = 1; i < newValue.length; i++) {
        const element = newValue[i];
        addSelector(element.name, 'teamSelector');
    }
});

// Fill out color selectors

const colors = [
	"Dark Blue",
	"Green",
	"Blue Green",
	"Purple",
	"Yellow",
	"Light Blue",
	"Violet",
	"Pink",
	"Turquoise",
	"Orange"
];

for (let i = 0; i < colors.length; i++) {
	addSelector(colors[i], 'colorSelector');
}

// Scoreboard data

const SBData = nodecg.Replicant('SBData', {defaultValue: {
	flavorText: 'Flavor Text',
	teamAInfo: {
		name: "Placeholder Team 1",
		players: [
			{name:"You should fix this before going live."}
		]
	},
	teamAColor: 'Green',
	teamBInfo: {
		name: "Placeholder Team 2",
		players: [
			{name:"You should fix this before going live."}
		]
	},
	teamBcolor: 'Purple'
}});

const SBShown = nodecg.Replicant('SBShown', {defaultValue: true});

SBData.on('change', newValue => {
	flavorTextInput.value = newValue.flavorText;
	
	teamAColorSelect.value = newValue.teamAColor;
	teamBColorSelect.value = newValue.teamBcolor;

	teamASelect.value = newValue.teamAInfo.name;
	teamBSelect.value = newValue.teamBInfo.name;
});

SBShown.on('change', newValue => {
	setToggleButtonDisabled(SBShow, SBHide, newValue);
});

SBUpdateBtn.onclick = () => {
	let teamAInfo = tourneyData.value.filter(team => team.name === teamASelect.value)[0];
	let teamBInfo = tourneyData.value.filter(team => team.name === teamBSelect.value)[0];

	let dataValue = {
		flavorText: flavorTextInput.value,
		teamAInfo: teamAInfo,
		teamAColor: teamAColorSelect.value,
		teamBInfo: teamBInfo,
		teamBcolor: teamBColorSelect.value
	}

	SBData.value = dataValue;
};

SBShow.onclick = () => { SBShown.value = true; }
SBHide.onclick = () => { SBShown.value = false; }

// Next Teams

const nextTeams = nodecg.Replicant('nextTeams', {defaultValue: {
	teamAInfo: {
		name: "Placeholder Team 1",
		players: [
			{name:"You should fix this before going live."}
		]
	},
	teamBInfo: {
		name: "Placeholder Team 2",
		players: [
			{name:"You should fix this before going live."}
		]
	}
}});

nextTeams.on('change', newValue => {
	nextTeamASelect.value = newValue.teamAInfo.name;
	nextTeamBSelect.value = newValue.teamBInfo.name;
});

nextTeamUpdateBtn.onclick = () => {
	let teamAInfo = tourneyData.value.filter(team => team.name === nextTeamASelect.value)[0];
	let teamBInfo = tourneyData.value.filter(team => team.name === nextTeamBSelect.value)[0];

	nextTeams.value.teamAInfo = teamAInfo;
	nextTeams.value.teamBInfo = teamBInfo;
};

beginNextMatchBtn.onclick = () => {
	SBData.value.teamAInfo = nextTeams.value.teamAInfo;
	SBData.value.teamBInfo = nextTeams.value.teamBInfo;

	teamScores.value.teamA = 0;
	teamScores.value.teamB = 0;
};

// Add reminders to update info

addSelectChangeReminder(['teamASelect', 'teamBSelect', 'teamAColorSelect', 'teamBColorSelect'], SBUpdateBtn);
addInputChangeReminder(['flavorTextInput'], SBUpdateBtn);

addSelectChangeReminder(['nextTeamASelect', 'nextTeamBSelect'], nextTeamUpdateBtn);

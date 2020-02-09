const emptyTeamInfo = {
    name: "",
    logoUrl: "",
    players: [{
        name: "",
        username: ""
    }]
};

const flavorText = nodecg.Replicant('flavorText', { defaultValue: "Low Ink" });
const teamAInfo = nodecg.Replicant('teamAInfo', { defaultValue: emptyTeamInfo });
const teamBInfo = nodecg.Replicant('teamBInfo', { defaultValue: emptyTeamInfo });
const teamAColor = nodecg.Replicant('teamAColor', { defaultValue: "Default pink" });
const teamBColor = nodecg.Replicant('teamBColor', { defaultValue: "Default green" });
const teamAScore = nodecg.Replicant('teamAScore', { defaultValue: 0 });
const teamBScore = nodecg.Replicant('teamBScore', { defaultValue: 0 });

const colorNameToHex = {
    "Light Blue": "#0199B8",
    "Purple": "#9208B2",
    "Yellow": "#BBC905",
    "Pink": "#CB0856",
    "Orange": "#FB5C03",
    "Turquoise": "#0CAE6E",
    "Sky Blue": "#007EDC",
    "Mustard": "#CE8003",
    "Default pink": "#f02d7d",
    "Default green": "#19D719",
    "Big blue": "#0006FF"
}

//replicant changes
flavorText.on('change', newValue => { flavorTextDisplay.text = newValue; });
teamAInfo.on('change', newValue => { teamAnameDisplay.text = newValue.name; });
teamBInfo.on('change', newValue => { teamBnameDisplay.text = newValue.name; });
// TODO: animate these
teamAColor.on('change', newValue => { teamAcolorDisplay.style.backgroundColor = colorNameToHex[newValue]; });
teamBColor.on('change', newValue => { teamBcolorDisplay.style.backgroundColor = colorNameToHex[newValue]; });
teamAScore.on('change', newValue => { teamAScoreDisplay.text = newValue; });
teamBScore.on('change', newValue => { teamBScoreDisplay.text = newValue; });
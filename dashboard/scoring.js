const teamAScore = nodecg.Replicant('teamAScore', {defaultValue: 0});
const teamBScore = nodecg.Replicant('teamBScore', {defaultValue: 0});
const teamAName = nodecg.Replicant('teamAName', {defaultValue: ""});
const teamBName = nodecg.Replicant('teamBName', {defaultValue: ""});
const flavorText = nodecg.Replicant('flavorText', {defaultValue: ""});
const nextTeamAName = nodecg.Replicant('nextTeamAName', {defaultValue: ""});
const nextTeamBName = nodecg.Replicant('nextTeamBName', {defaultValue: ""});
const clrRed = "#C9513E";
const clrBlue = "#3F51B5";

//onchange, onclick, etc. goes gere

//plus and minus buttons... could be done more gracefully but it's just 4 buttons
teamAPlusB.onclick = () => { teamAScore.value++; };
teamAMinusB.onclick = () => { teamAScore.value--; };
teamBPlusB.onclick = () => { teamBScore.value++; };
teamBMinusB.onclick = () => { teamBScore.value--; };

//changing scores by their inputs
teamADisplay.addEventListener('change', (event) => { teamAScore.value = Number(event.target.value); });
teamBDisplay.addEventListener('change', (event) => { teamBScore.value = Number(event.target.value); });

//when text boxes get typed in, remind user to update
const toAddListeners = ["teamANameInput", "teamBNameInput", "flavorInput"];
toAddListeners.forEach(element => { document.getElementById(element).addEventListener('input', () => { changeButtonColor(clrRed, "updateNames"); })});
const toAddListenersNext = ["teamANextNameInput", "teamBNextNameInput"];
toAddListenersNext.forEach(element => { document.getElementById(element).addEventListener('input', () => {changeButtonColor(clrRed, "updateNextNames"); })});

//handle replicant changes
teamAScore.on('change', (newValue) => { document.getElementById("teamADisplay").value = newValue; });
teamBScore.on('change', (newValue) => { document.getElementById("teamBDisplay").value = newValue; });
teamAName.on('change', (newValue) => { teamANameInput.value = newValue; });
teamBName.on('change', (newValue) => { teamBNameInput.value = newValue; });
nextTeamAName.on('change', (newValue) => { teamANextNameInput.value = newValue; });
nextTeamBName.on('change', (newValue) => { teamBNextNameInput.value = newValue; });
flavorText.on('change', (newValue) => { flavorInput.value = newValue; });

//buttons
updateNames.onclick = () => {
    teamAName.value = teamANameInput.value;
    teamBName.value = teamBNameInput.value;
    flavorText.value = flavorInput.value;
    changeButtonColor(clrBlue, "updateNames");
};

beginNext.onclick = () => {
    teamAScore.value = 0; teamBScore.value = 0;
    teamAName.value = teamANextNameInput.value;
    teamBName.value = teamBNextNameInput.value;
    teamANextNameInput.value = ""; teamBNextNameInput.value = "";
}

updateNextNames.onclick = () => {
    nextTeamAName.value = teamANextNameInput.value;
    nextTeamBName.value = teamBNextNameInput.value;
    changeButtonColor(clrBlue, "updateNextNames");
}

//everything else

function changeButtonColor(color, id) {
    document.getElementById(id).style.backgroundColor = color;
}
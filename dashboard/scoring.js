const teamAScore = nodecg.Replicant('teamAScore', {defaultValue: 0});
const teamBScore = nodecg.Replicant('teamBScore', {defaultValue: 0});
const teamAName = nodecg.Replicant('teamAName', {defaultValue: ""});
const teamBName = nodecg.Replicant('teamBName', {defaultValue: ""});
const flavorText = nodecg.Replicant('flavorText', {defaultValue: ""});
const nextTeamAName = nodecg.Replicant('nextTeamAName', {defaultValue: ""});
const nextTeamBName = nodecg.Replicant('nextTeamBName', {defaultValue: ""});
const clrRed = "#C9513E";
const clrBlue = "#3F51B5";
const battlefyData = nodecg.Replicant('battlefyData');

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
document.getElementById("flavorInput").addEventListener('input', () => { changeButtonColor(clrRed, "updateNames"); });
const toAddChangeListeners = ["teamASelect", "teamBSelect"];
toAddChangeListeners.forEach(element => {document.getElementById(element).addEventListener('change', () => {changeButtonColor(clrRed, "updateNames"); })})
const toAddListenersNext = ["teamANextSelect", "teamBNextSelect"];
toAddListenersNext.forEach(element => {document.getElementById(element).addEventListener('change', () => {changeButtonColor(clrRed, "updateNextNames")})})

//handle replicant changes
teamAScore.on('change', newValue => { document.getElementById("teamADisplay").value = newValue; });
teamBScore.on('change', newValue => { document.getElementById("teamBDisplay").value = newValue; });
teamAName.on('change', newValue => { teamASelect.value = newValue; });
teamBName.on('change', newValue => { teamBSelect.value = newValue; });
nextTeamAName.on('change', newValue => { teamANextSelect.value = newValue; });
nextTeamBName.on('change', newValue => { teamBNextSelect.value = newValue; });
flavorText.on('change', newValue => { flavorInput.value = newValue; });
battlefyData.on('change', newValue => {
    clearTeamSelectors();
    for (let i = 1; i < newValue.length; i++) {
        const element = newValue[i];
        addTeamSelector(element.name);
    }
})

//buttons
updateNames.onclick = () => {
    teamAName.value = teamASelect.value;
    teamBName.value = teamBSelect.value;
    flavorText.value = flavorInput.value;
    changeButtonColor(clrBlue, "updateNames");
};

beginNext.onclick = () => {
    teamAScore.value = 0; teamBScore.value = 0;
    teamAName.value = teamANextSelect.value;
    teamBName.value = teamBNextSelect.value;
}

updateNextNames.onclick = () => {
    nextTeamAName.value = teamANextSelect.value;
    nextTeamBName.value = teamBNextSelect.value;
    changeButtonColor(clrBlue, "updateNextNames");
}

//everything else

function changeButtonColor(color, id) {
    document.getElementById(id).style.backgroundColor = color;
}

function clearTeamSelectors() {
    let selectors = document.getElementsByClassName("teamSelector");
    for (let i = 0; i < selectors.length; i++) {
        const element = selectors[i];
        element.innerHTML = "";
    }
}

function addTeamSelector(name) {
    var elements = document.querySelectorAll(".teamSelector");
    Array.from(elements).forEach(function(item) {
        var opt = document.createElement("option");
        opt.value = name;
        opt.text = name;
        item.appendChild(opt);
    });
}
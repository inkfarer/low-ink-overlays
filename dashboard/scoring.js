const emptyTeamInfo = {
    name: "",
    logoUrl: "",
    players: [
        {
            name: "",
            username: ""
        }
    ]
};

const teamAScore = nodecg.Replicant('teamAScore', {defaultValue: 0});
const teamBScore = nodecg.Replicant('teamBScore', {defaultValue: 0});
const teamAInfo = nodecg.Replicant('teamAInfo', {defaultValue: emptyTeamInfo});
const teamBInfo = nodecg.Replicant('teamBInfo', {defaultValue: emptyTeamInfo});
const flavorText = nodecg.Replicant('flavorText', {defaultValue: "Low Ink"});
const nextTeamAInfo = nodecg.Replicant('nextTeamAInfo', {defaultValue: emptyTeamInfo});
const nextTeamBInfo = nodecg.Replicant('nextTeamBINfo', {defaultValue: emptyTeamInfo});
const clrRed = "#C9513E";
const clrBlue = "#3F51B5";
const colors = ["Default pink",
"Default green",
"Light Blue",
"Purple",
"Yellow",
"Pink",
"Orange",
"Turquoise",
"Sky Blue",
"Mustard",
"Big blue"];
const battlefyData = nodecg.Replicant('battlefyData');
const manualTeamNameInput = nodecg.Replicant('manualTeamNameInput');
const scoreboardShown = nodecg.Replicant('scoreboardShown', {defaultValue: true});
const teamAColor = nodecg.Replicant('teamAColor', {defaultValue: "Default pink"});
const teamBColor = nodecg.Replicant('teamBColor', {defaultValue: "Default green"});

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
const toAddChangeListeners = ["teamASelect", "teamBSelect", "teamAColorSelect", "teamBColorSelect"];
toAddChangeListeners.forEach(element => {document.getElementById(element).addEventListener('change', () => {changeButtonColor(clrRed, "updateNames"); })})
const toAddListenersNext = ["teamANextSelect", "teamBNextSelect"];
toAddListenersNext.forEach(element => {document.getElementById(element).addEventListener('change', () => {changeButtonColor(clrRed, "updateNextNames")})})
const toAddListenersManual = ["teamANameInput", "teamBNameInput"];
toAddListenersManual.forEach(element => {document.getElementById(element).addEventListener('input', () => {changeButtonColor(clrRed, "updateManual")})});

//handle replicant changes
teamAScore.on('change', newValue => { document.getElementById("teamADisplay").value = newValue; });
teamBScore.on('change', newValue => { document.getElementById("teamBDisplay").value = newValue; });
teamAInfo.on('change', newValue => { teamASelect.value = newValue.name; });
teamBInfo.on('change', newValue => { teamBSelect.value = newValue.name; });
nextTeamAInfo.on('change', newValue => { teamANextSelect.value = newValue.name; });
nextTeamBInfo.on('change', newValue => { teamBNextSelect.value = newValue.name; });
flavorText.on('change', newValue => { flavorInput.value = newValue; });
battlefyData.on('change', newValue => {
    console.log(newValue);
    clearTeamSelectors();
    for (let i = 1; i < newValue.length; i++) {
        const element = newValue[i];
        addTeamSelector(element.name);
    }
})
manualTeamNameInput.on('change', newValue => {
    if (newValue) {
        teamAInfo.value.name = teamANameInput.value;
        teamBInfo.value.name = teamBNameInput.value;
    } else {
        teamAInfo.value = battlefyData.value[findTeamObjectByName(teamASelect.value)];
        teamBInfo.value = battlefyData.value[findTeamObjectByName(teamBSelect.value)];
    }
});
scoreboardShown.on('change', newValue => {
    disableShowHideButtons(newValue);
});
teamAColor.on('change', newValue => {
    teamAColorSelect.value = newValue;
});
teamBColor.on('change', newValue => {
    teamBColorSelect.value = newValue;
})

//buttons
updateNames.onclick = () => {
    teamAInfo.value = battlefyData.value[findTeamObjectByName(teamASelect.value)];
    teamBInfo.value = battlefyData.value[findTeamObjectByName(teamBSelect.value)];
    flavorText.value = flavorInput.value;
    teamAColor.value = teamAColorSelect.value;
    teamBColor.value = teamBColorSelect.value;
    changeButtonColor(clrBlue, "updateNames");
};

beginNext.onclick = () => {
    teamAScore.value = 0; teamBScore.value = 0;
    teamAInfo.value = battlefyData.value[findTeamObjectByName(teamANextSelect.value)];
    teamBInfo.value = battlefyData.value[findTeamObjectByName(teamBNextSelect.value)];
};

updateNextNames.onclick = () => {
    nextTeamAInfo.value = battlefyData.value[findTeamObjectByName(teamANextSelect.value)];
    nextTeamBInfo.value = battlefyData.value[findTeamObjectByName(teamBNextSelect.value)];
    changeButtonColor(clrBlue, "updateNextNames");
};

updateManual.onclick = () => {
    if (manualTeamNameInput.value) {
        teamAInfo.value.name = teamANameInput.value;
        teamBInfo.value.name = teamBNameInput.value;
    }
    changeButtonColor(clrBlue, "updateManual");
};

showScoreboard.onclick = () => {
    scoreboardShown.value = true;
    disableShowHideButtons(true);
}

hideScoreboard.onclick = () => {
    scoreboardShown.value = false;
    disableShowHideButtons(false);
}

//everything else

function disableShowHideButtons(bool) {
    showScoreboard.disabled = false;
    hideScoreboard.disabled = false;
    if (bool) {
        showScoreboard.disabled = true;
    } else {
        hideScoreboard.disabled = true;
    }
}

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

function addColorSelectors() {
    colors.forEach(element => {
        const elements = document.querySelectorAll('.colorSelect');
        Array.from(elements).forEach(function(item) {
            var opt = document.createElement('option');
            opt.value = element;
            opt.text = element;
            item.appendChild(opt);
        });
    });
}

addColorSelectors();

function findTeamObjectByName(name) {
    for (let i = 1; i < battlefyData.value.length; i++) {
        const element = battlefyData.value[i];
        if (element.name == name) {
            return i;
        }
    }
    return null;
}
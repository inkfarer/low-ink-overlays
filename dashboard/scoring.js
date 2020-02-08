const teamAScore = nodecg.Replicant('teamAScore', {defaultValue: 0});
const teamBScore = nodecg.Replicant('teamBScore', {defaultValue: 0});
const teamAName = nodecg.Replicant('teamAName', {defaultValue: ""});
const teamBName = nodecg.Replicant('teamBName', {defaultValue: ""});
const flavorText = nodecg.Replicant('flavorText', {defaultValue: ""});
const nextTeamAName = nodecg.Replicant('nextTeamAName', {defaultValue: ""});
const nextTeamBName = nodecg.Replicant('nextTeamBName', {defaultValue: ""});
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
manualTeamNameInput.on('change', newValue => {
    if (newValue) {
        teamAName.value = teamANameInput.value;
        teamBName.value = teamBNameInput.value;
    } else {
        teamAName.value = teamASelect.value;
        teamBName.value = teamBSelect.value;
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
    teamAName.value = teamASelect.value;
    teamBName.value = teamBSelect.value;
    flavorText.value = flavorInput.value;
    teamAColor.value = teamAColorSelect.value;
    teamBColor.value = teamBColorSelect.value;
    changeButtonColor(clrBlue, "updateNames");
};

beginNext.onclick = () => {
    teamAScore.value = 0; teamBScore.value = 0;
    teamAName.value = teamANextSelect.value;
    teamBName.value = teamBNextSelect.value;
};

updateNextNames.onclick = () => {
    nextTeamAName.value = teamANextSelect.value;
    nextTeamBName.value = teamBNextSelect.value;
    changeButtonColor(clrBlue, "updateNextNames");
};

updateManual.onclick = () => {
    if (manualTeamNameInput.value) {
        teamAName.value = teamANameInput.value;
        teamBName.value = teamBNameInput.value;
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

/*var colorNameToHex = {
    "Light Blue":"#0199B8",
    "Purple":"#9208B2",
    "Yellow":"#BBC905",
    "Pink":"#CB0856",
    "Orange":"#FB5C03",
    "Turquoise":"#0CAE6E",
    "Sky Blue":"#007EDC",
    "Mustard":"#CE8003",
    "Default pink":"#f02d7d",
    "Default green":"#19D719",
    "Big blue": "#0006FF"
}*/
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

const clrRed = '#C9513E';
const clrBlue = '#3F51B5';
const nextTeamAInfo = nodecg.Replicant('nextTeamAInfo', {defaultValue: emptyTeamInfo});
const nextTeamBInfo = nodecg.Replicant('nextTeamBINfo', {defaultValue: emptyTeamInfo});
const bigTextValue = nodecg.Replicant('bigTextValue', { defaultValue: 'Be right back!' });
const battlefyData = nodecg.Replicant('battlefyData', {
	defaultValue: [
		{tourneyId: "none"},
		{
			name: "Placeholder Team 1",
			logoUrl: "",
			players: [
				{name:"You should fix this before going live.", username: "You should fix this before going live."}
			]
		},
		{
			name: "Placeholder Team 2",
			logoUrl: "",
			players: [
				{name:"You should fix this before going live.", username: "You should fix this before going live."}
			]
		}
	]
});
const maplists = nodecg.Replicant('maplists', {
    defaultValue: [
        [
            { id: 0, name: 'Default map list' },
            { map: 'Ancho-V Games', mode: 'Clam Blitz' },
            { map: 'Ancho-V Games', mode: 'Tower Control' },
            { map: 'Wahoo World', mode: 'Rainmaker' }
        ]
    ]
});
const currentMaplist = nodecg.Replicant('currentMaplist', {
    defaultValue: [
        [
            { id: 0, name: 'Default map list' },
            { map: 'Ancho-V Games', mode: 'Clam Blitz' },
            { map: 'Ancho-V Games', mode: 'Tower Control' },
            { map: 'Wahoo World', mode: 'Rainmaker' }
        ]
    ]
});
const currentBreakScene = nodecg.Replicant('currenBreakScene', { defaultValue: 'mainScene' });
const casterNames = nodecg.Replicant('casterNames', { defaultValue: "" });

const nextStageTime = nodecg.Replicant('nextStageTime', {defaultValue: {
    hour: 0,
    minute: 0,
    day: 1,
    month: 0
}});

// Replicant changes
bigTextValue.on('change', newValue => { breakFlavorInput.value = newValue; });
battlefyData.on('change', newValue => {
    clearTeamSelectors();
    for (let i = 1; i < newValue.length; i++) {
        const element = newValue[i];
        addTeamSelector(element.name);
    }
});
nextTeamAInfo.on('change', newValue => { teamANextSelect.value = newValue.name; });
nextTeamBInfo.on('change', newValue => { teamBNextSelect.value = newValue.name; });
maplists.on('change', newValue => {
    clearMapListSelector();
    for (let i = 0; i < newValue.length; i++) {
        const element = newValue[i];
        addMapList(element[0].name);
    }
});
currentMaplist.on('change', newValue => {
    if (newValue) {
        mapListSelect.value = newValue[0].name;
    }
});
currentBreakScene.on('change', newValue => {
    disableButtons(newValue);
});
casterNames.on('change', newValue => {
    casterInput.value = newValue;
})
nextStageTime.on('change', newValue => {
    document.querySelector('.minInput').value = newValue.minute;
    document.querySelector('.hourInput').value = newValue.hour;
});

//button onclicks
updateMainScene.onclick = () => {
    bigTextValue.value = breakFlavorInput.value;
    casterNames.value = casterInput.value;
    updateStageTime();
    changeButtonColor(clrBlue, "updateMainScene");
};
updateNextNames.onclick = () => {
    nextTeamAInfo.value = battlefyData.value[findTeamObjectByName(teamANextSelect.value)];
    nextTeamBInfo.value = battlefyData.value[findTeamObjectByName(teamBNextSelect.value)];
    changeButtonColor(clrBlue, "updateNextNames");
};
updateMaps.onclick = () => {
    const index = findMapListByName(mapListSelect.value);
    if (index !== null) {
        currentMaplist.value = maplists.value[index];
        changeButtonColor(clrBlue, "updateMaps");
    }
}
showMain.onclick = () => { currentBreakScene.value = "mainScene"; }
showNextUp.onclick = () => { currentBreakScene.value = "nextUp"; }
showMaps.onclick = () => { currentBreakScene.value = "maps"; }

//remind to update
const mainSceneItems = ["casterInput", "breakFlavorInput", "hourInput", "minInput"];
mainSceneItems.forEach(element => { document.getElementById(element).addEventListener('input', () => { changeButtonColor(clrRed, "updateMainScene"); }); });
document.querySelector('.daySelect').addEventListener('change', () => { changeButtonColor(clrRed, "updateMainScene"); })
const nextTeamsItems = ["teamANextSelect", "teamBNextSelect"];
nextTeamsItems.forEach(element => { document.getElementById(element).addEventListener('change', () => { changeButtonColor(clrRed, "updateNextNames"); }); });
mapListSelect.addEventListener('change', () => { changeButtonColor(clrRed, "updateMaps"); })

//misc functions

function changeButtonColor(color, id) {
    document.getElementById(id).style.backgroundColor = color;
}

function clearTeamSelectors() {
    let selectors = document.getElementsByClassName("teamSelector");
    for (let i = 0; i < selectors.length; i++) {
        const element = selectors[i];
        element.innerHTML = '';
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

function clearMapListSelector() {
    document.getElementById("mapListSelect").innerHTML = "";
}

function addMapList(name) {
    const opt = document.createElement("option");
    opt.value = name;
    opt.text = name;
    document.getElementById("mapListSelect").appendChild(opt);
}

function findMapListByName(name) {
    for (let i = 0; i < maplists.value.length; i++) {
        const element = maplists.value[i];
        if (element[0].name == name) {
            return i;
        }
    }
    return null;
}

function disableButtons(currentScene) {
    const elements = ["showMain", "showNextUp", "showMaps"];
    elements.forEach(element => { document.getElementById(element).disabled = false; });
    if (currentScene === "mainScene") {
        showMain.disabled = true;
    } else if (currentScene === "nextUp") {
        showNextUp.disabled = true;
    } else if (currentScene === "maps") {
        showMaps.disabled = true;
    }
}

function findTeamObjectByName(name) {
    for (let i = 1; i < battlefyData.value.length; i++) {
        const element = battlefyData.value[i];
        if (element.name == name) {
            return i;
        }
    }
    return null;
}

function updateDaySelector() {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const daySelect = document.querySelector('.daySelect');

    const todayElem = getDayElem(today);
    daySelect.appendChild(todayElem);

    const tomorElem = getDayElem(tomorrow);
    daySelect.appendChild(tomorElem);
}

function getDayElem(date) {
    const dayElem = document.createElement('option');
    dayElem.innerText = `${date.getDate()}/${date.getMonth() + 1}`;
    dayElem.dataset.day = date.getDate();
    dayElem.dataset.month = date.getMonth();
    return dayElem;
}

function updateStageTime() {
    const min = parseInt(document.querySelector('.minInput').value);
    const hour = parseInt(document.querySelector('.hourInput').value);
    const daySelect = document.querySelector('.daySelect');
    const selText = daySelect.options[daySelect.selectedIndex];
    if (selText) {
        const day = selText.dataset.day;
        const month = selText.dataset.month;

        if (min <= 59 && min >= 0 && hour <= 23 && hour >= 0) {
            nextStageTime.value = {
                hour: hour,
                minute: min,
                day: day,
                month: month
            };
        }
    }
}

updateDaySelector();
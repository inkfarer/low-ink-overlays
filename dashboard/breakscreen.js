const clrRed = '#C9513E';
const clrBlue = '#3F51B5';
const nextTeamAName = nodecg.Replicant('nextTeamAName', { defaultValue: '' });
const nextTeamBName = nodecg.Replicant('nextTeamBName', { defaultValue: '' });
const bigTextValue = nodecg.Replicant('bigTextValue', { defaultValue: 'Be right back!' });
const battlefyData = nodecg.Replicant('battlefyData');
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

// Replicant changes
bigTextValue.on('change', newValue => { breakFlavorInput.value = newValue; });
battlefyData.on('change', newValue => {
    clearTeamSelectors();
    for (let i = 1; i < newValue.length; i++) {
        const element = newValue[i];
        addTeamSelector(element.name);
    }
});
nextTeamAName.on('change', newValue => { teamANextSelect.value = newValue; });
nextTeamBName.on('change', newValue => { teamBNextSelect.value = newValue; });
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

//button onclicks
updateMainScene.onclick = () => {
    bigTextValue.value = breakFlavorInput.value;
    casterNames.value = casterInput.value;
    changeButtonColor(clrBlue, "updateMainScene");
};
updateNextNames.onclick = () => {
    nextTeamAName.value = teamANextSelect.value;
    nextTeamBName.value = teamBNextSelect.value;
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
const mainSceneItems = ["casterInput", "breakFlavorInput"];
mainSceneItems.forEach(element => { document.getElementById(element).addEventListener('input', () => { changeButtonColor(clrRed, "updateMainScene"); }); });
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
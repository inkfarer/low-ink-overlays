// map winners: 0 = no win, 1 = team a win, 2 = team b win
const mapWinners = nodecg.Replicant('mapWinners', { defaultValue: [0, 0, 0, 0, 0, 0, 0] });
const currentMaplist = nodecg.Replicant('currentMaplist', {
    defaultValue:
        [
            { id: 0, name: 'Default map list' },
            { map: 'Ancho-V Games', mode: 'Clam Blitz' },
            { map: 'Ancho-V Games', mode: 'Tower Control' },
            { map: 'Wahoo World', mode: 'Rainmaker' }
        ]
});

NodeCG.waitForReplicants(mapWinners).then(() => {
    currentMaplist.on('change', (newValue, oldValue) => {
        document.getElementById('maplistName').innerText = newValue[0].name;
        removeToggles();
        for (let i = 1; i < newValue.length; i++) {
            if (oldValue) {
                mapWinners.value[i - 1] = 0;
            }

            const element = newValue[i];
            addToggle(element, i - 1);
        }
    });
});

mapWinners.on('change', newValue => {
    for (let i = 0; i < newValue.length; i++) {
        const element = newValue[i];
        const buttons = getButtons(i);
        if (buttons[0] != null) {
            disableWinButtons(buttons[0], buttons[1], buttons[2], element);
        }
    }
})

function addToggle(maplistElement, mapIndex) {
    const toggleDiv = document.createElement('div');
    toggleDiv.classList.add('toggleDiv');
    const mapModeDisplay = document.createElement('div');
    //i hate how this has to be a variable
    const mapIndexPlusOne = Number(mapIndex) + 1;
    mapModeDisplay.innerHTML = '<span class="center">' + mapIndexPlusOne + '</span>' + maplistElement.map + '<br>' + maplistElement.mode;
    toggleDiv.appendChild(mapModeDisplay);

    const noWinButton = document.createElement('paper-button');
    noWinButton.classList.add('noWinButton');
    noWinButton.raised = true;
    noWinButton.id = "noWin_" + mapIndex;
    noWinButton.innerText = "NO WIN";
    toggleDiv.appendChild(noWinButton);

    const AWinButton = document.createElement('paper-button');
    AWinButton.classList.add('AWinButton');
    AWinButton.raised = true;
    AWinButton.id = "AWin_" + mapIndex;
    AWinButton.innerText = "A WIN";

    const BWinButton = document.createElement('paper-button');
    BWinButton.classList.add('BWinButton');
    BWinButton.raised = true;
    BWinButton.id = "BWin_" + mapIndex;
    BWinButton.innerText = "B WIN";

    noWinButton.onclick = (event) => {
        const mapIndex = event.target.id.split('_')[1];
        mapWinners.value[mapIndex] = 0;
        const buttons = getButtons(mapIndex);
        disableWinButtons(buttons[0], buttons[1], buttons[2], 0);
    }
    AWinButton.onclick = (event) => {
        const mapIndex = event.target.id.split('_')[1];
        mapWinners.value[mapIndex] = 1;
        const buttons = getButtons(mapIndex);
        disableWinButtons(buttons[0], buttons[1], buttons[2], 1);
    }
    BWinButton.onclick = (event) => {
        const mapIndex = event.target.id.split('_')[1];
        mapWinners.value[mapIndex] = 2;
        const buttons = getButtons(mapIndex);
        disableWinButtons(buttons[0], buttons[1], buttons[2], 2);
    }

    const winButtonContainer = document.createElement('div');
    winButtonContainer.classList.add('wbContainer');
    winButtonContainer.appendChild(AWinButton);
    winButtonContainer.appendChild(BWinButton);
    toggleDiv.appendChild(winButtonContainer);

    disableWinButtons(noWinButton, AWinButton, BWinButton, mapWinners.value[mapIndex]);

    document.getElementById('toggles').appendChild(toggleDiv);
}

document.getElementById('reset').onclick = () => {
    resetToggles();
}

function getButtons(id) {
    const noWinButton = document.querySelector('paper-button#noWin_' + id);
    const AWinButton = document.querySelector('paper-button#AWin_' + id);
    const BWinButton = document.querySelector('paper-button#BWin_' + id);
    return [noWinButton, AWinButton, BWinButton];
}

function disableWinButtons(noWinButton, AWinButton, BWinButton, winner) {
    noWinButton.disabled = false;
    AWinButton.disabled = false;
    BWinButton.disabled = false;
    if (winner === 0) {
        noWinButton.disabled = true;
    } else if (winner === 1) {
        AWinButton.disabled = true;
    } else if (winner === 2) {
        BWinButton.disabled = true;
    }
}

function resetToggles() {
    for (let i = 0; i < currentMaplist.value.length - 1; i++) {
        mapWinners.value[i] = 0;
        const buttons = getButtons(i);
        //disableWinButtons(buttons[0], buttons[1], buttons[2], 0);
    }
};

function removeToggles() {
    document.getElementById('toggles').innerHTML = "";
}
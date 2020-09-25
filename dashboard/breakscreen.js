// Main Scene

const mainFlavorText = nodecg.Replicant('mainFlavorText', { defaultValue: 'Be right back!' });
const casterNames = nodecg.Replicant('casterNames', { defaultValue: "We don't know." });

mainFlavorText.on('change', newValue => { breakFlavorInput.value = newValue; });
casterNames.on('change', newValue => { casterInput.value = newValue; });

updateMainScene.onclick = () => {
    mainFlavorText.value = breakFlavorInput.value;
    casterNames.value = casterInput.value;
    updateStageTime();
};

// Show Timer

const NSTimerShown = nodecg.Replicant('NSTimerShown', {defaultValue: false});

NSTimerShown.on('change', newValue => {
    document.querySelector('#checkShowTimer').checked = newValue;
});

// Next Stage Timer

const nextStageTime = nodecg.Replicant('nextStageTime', {defaultValue: {
    hour: 0,
    minute: 0,
    day: 1,
    month: 0
}});

nextStageTime.on('change', newValue => {
    document.querySelector('#nsMinInput').value = newValue.minute;
	document.querySelector('#nsHourInput').value = newValue.hour;
	document.querySelector('#nsDaySelect').value = `${newValue.day}/${parseInt(newValue.month) + 1}`;
});

function updateDaySelector(id) {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const daySelect = document.querySelector(`#${id}`);

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

updateDaySelector('nsDaySelect');

addSelectChangeReminder(['nsDaySelect'], updateMainScene);
addInputChangeReminder(['breakFlavorInput', 'casterInput', 'nsHourInput', 'nsMinInput'], updateMainScene);

// Next Teams

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

addSelectChangeReminder(['nextTeamASelect', 'nextTeamBSelect'], nextTeamUpdateBtn);

// Maps

const maplists = nodecg.Replicant('maplists', {
    defaultValue: [
        [
            { id: 0, name: "Default map list" },
            { map: "Ancho-V Games", mode: "Clam Blitz" },
            { map: "Ancho-V Games", mode: "Tower Control" },
            { map: "Wahoo World", mode: "Rainmaker" }
        ]
    ]
});

const currentMaplistID = nodecg.Replicant('currentMaplistID', { defaultValue: '0' });

maplists.on('change', newValue => {
	clearSelectors('mapSelector');
	for (let i = 0; i < newValue.length; i++) {
		let opt = document.createElement("option");
        opt.value = newValue[i][0].id;
        opt.text = newValue[i][0].name;
        mapListSelect.appendChild(opt);
	}
});

currentMaplistID.on('change', newValue => {
	let maplistID = maplists.value.filter(list => list[0].id == newValue)[0][0].id;
	mapListSelect.value = maplistID;
});

updateMaps.onclick = () => {
	currentMaplistID.value = mapListSelect.value;
};

addSelectChangeReminder(['mapListSelect'], updateMaps);

// Current scene

const currentBreakScene = nodecg.Replicant('currenBreakScene', { defaultValue: 'mainScene' });

showMain.onclick = () => { currentBreakScene.value = "mainScene"; }
showNextUp.onclick = () => { currentBreakScene.value = "nextUp"; }
showMaps.onclick = () => { currentBreakScene.value = "maps"; }
showSchedule.onclick = () => { currentBreakScene.value = 'schedule'; }

currentBreakScene.on('change', newValue => {
    disableSceneButtons(newValue);
});

function disableSceneButtons(currentScene) {
    const elements = ["showMain", "showNextUp", "showMaps", 'showSchedule'];
    elements.forEach(element => { document.getElementById(element).disabled = false; });
    if (currentScene === "mainScene") {
        showMain.disabled = true;
    } else if (currentScene === "nextUp") {
        showNextUp.disabled = true;
    } else if (currentScene === "maps") {
        showMaps.disabled = true;
    } else if (currentScene === 'schedule') {
        showSchedule.disabled = true;
    }
}

// Schedule

const dayList = ['Day 1', 'Day 2'];
const roundList = [
    [
        {
            name: 'Swiss Round 1',
            length: 35
        },
        {
            name: 'Swiss Round 2',
            length: 35
        },
        {
            name: 'Swiss Round 3',
            length: 35
        },
        {
            name: 'Swiss Round 4',
            length: 35
        },
        {
            name: 'Swiss Round 5',
            length: 35
        },
        {
            name: 'Swiss Round 6',
            length: 35
        }
    ],
    [
        {
            name: 'Winners Round 1',
            length: 45
        },
        {
            name: 'Winners Round 2',
            length: 45
        },
        {
            name: 'Winners Round 3',
            length: 45
        },
        {
            name: 'Winners Round 4',
            length: 45
        },
        {
            name: 'Losers Round 6',
            length: 45
        },
        {
            name: 'Grand Finals',
            length: 55
        },
    ]
];
// Round names minus round length
const roundNames = roundList.map(a => a.map(b => b.name));

// -1 = "unset"
// Contains currently selected day and what hour and minute every round is set to end on for both days
const scheduleInfo = nodecg.Replicant('scheduleInfo', {defaultValue: {
    day: 0,
    endTimes: [
        [
            {
                hour: -1,
                minute: -1
            },
            {
                hour: -1,
                minute: -1
            },
            {
                hour: -1,
                minute: -1
            },
            {
                hour: -1,
                minute: -1
            },
            {
                hour: -1,
                minute: -1
            },
            {
                hour: -1,
                minute: -1
            }
        ],
        [
            {
                hour: -1,
                minute: -1
            },
            {
                hour: -1,
                minute: -1
            },
            {
                hour: -1,
                minute: -1
            },
            {
                hour: -1,
                minute: -1
            },
            {
                hour: -1,
                minute: -1
            },
            {
                hour: -1,
                minute: -1
            }
        ]
    ]
}});

// I couldn't figure out what these are called - this is the closest I could find:
// https://ux.stackexchange.com/questions/121768/what-is-this-ui-element-called-a-horizontal-scrolling-menu

// Creates event listeners for moving left and right in scroll tab
function registerScrollTabs(data, plusBtn, minusBtn, dataDisplay, index) {
    dataDisplay.innerText = data[index.index];

    plusBtn.addEventListener('click', plusBtn.fn = function onScrollTabPlus() {
        if (index.index !== data.length - 1) {
            index.index++;
        } else {
            index.index = 0;
        }
    }, false);

    minusBtn.addEventListener('click', minusBtn.fn = function onScrollTabMinus() {
        if (index.index !== 0) {
            index.index--;
        } else {
            index.index = data.length - 1;
        }
    }, false);
}

// Update event listeners set by registerScrollTabs(), used for when data changes
function updateScrollTabs(data, plusBtn, minusBtn, dataDisplay, index) {
    dataDisplay.innerText = data[index.index];

    plusBtn.fn = function onScrollTabPlus() {
        if (index.index !== data.length - 1) {
            index.index++;
        } else {
            index.index = 0;
        }
    };

    minusBtn.fn = function onScrollTabMinus() {
        if (index.index !== 0) {
            index.index--;
        } else {
            index.index = data.length - 1;
        }
    };
}

// silly workaround to force js to pass by reference
var dayIndex = {index: 0};
var roundIndex = {index: 0};

// Create event listeners for round names
registerScrollTabs(roundNames[0], scRoundPlus, scRoundMinus, scRoundDisplay, roundIndex);

NodeCG.waitForReplicants(scheduleInfo).then(() => {

    scheduleInfo.on('change', (newValue, oldValue) => {
        scDayDisplay.innerText = dayList[newValue.day];
        dayIndex.index = newValue.day;
        if (oldValue && oldValue.day !== newValue.day) {
            roundIndex.index = 0;
        }
        // If selected day changes, update event listeners for round selection
        updateScrollTabs(roundNames[newValue.day], scRoundPlus, scRoundMinus, scRoundDisplay, roundIndex);
        // Update time input with new values
        updateRoundEndTimeInput(newValue.endTimes[newValue.day][roundIndex.index]);
    });

    let roundSwitchElems = [scRoundMinus, scRoundPlus];
    roundSwitchElems.forEach(elem => {elem.addEventListener('click', () => {
        scRoundDisplay.innerText = roundNames[dayIndex.index][roundIndex.index];

        updateRoundEndTimeInput(scheduleInfo.value.endTimes[dayIndex.index][roundIndex.index]);
    })});
});

registerScrollTabs(dayList, scDayPlus, scDayMinus, scDayDisplay, dayIndex);

// Event listener to switch round select to the selected day's rounds
let daySwitchElems = [scDayPlus, scDayMinus];
daySwitchElems.forEach(elem => {elem.addEventListener('click', () => {
    roundIndex.index = 0;
    scheduleInfo.value.day = dayIndex.index;
    updateRoundEndTimeInput(scheduleInfo.value.endTimes[dayIndex.index][roundIndex.index]);
})});

// Set time input to currently selected value
/* roundEndTime example:
{
    minute: 25,
    hour: 23
}*/
function updateRoundEndTimeInput(roundEndTime) {
    document.querySelector('#scMinInput').value = roundEndTime.minute == -1 ? '0' : roundEndTime.minute;
    document.querySelector('#scHourInput').value = roundEndTime.hour == -1 ? '0' : roundEndTime.hour;
}

// Update schedule
scUpdate.onclick = () => {
    const min = parseInt(document.querySelector('#scMinInput').value);
    const hour = parseInt(document.querySelector('#scHourInput').value);
    if (min <= 59 && min >= 0 && hour <= 23 && hour >= 0) {
        scheduleInfo.value.endTimes[dayIndex.index][roundIndex.index] = {
            hour: hour,
            minute: min
        };
    }
};

// Reset currently selected round
scResetCurrent.onclick = () => {
    scheduleInfo.value.endTimes[dayIndex.index][roundIndex.index] = {
        hour: -1,
        minute: -1
    };
};

// Reset all rounds
scResetAll.onclick = () => {
    let schedule = scheduleInfo.value.endTimes;

    for (let i = 0; i < schedule.length; i++) {
        for (let j = 0; j < schedule[i].length; j++) {
            schedule[i][j] = {
                hour: -1,
                minute: -1
            };
        }
        
    }
};

// RGB Mode
const RGBMode = nodecg.Replicant('RGBMode', {defaultValue: false});

RGBMode.on('change', newValue => {
    document.querySelector('#checkSetRGB').checked = newValue;
});

// Showing / Hiding team icons on break

const showAImg = nodecg.Replicant('teamAImgShown', {defaultValue: true});
const showBImg = nodecg.Replicant('teamBImgShown', {defaultValue: true});

showAImg.on('change', newValue => {
    document.querySelector('#checkSetTeamAImg').checked = newValue;
});

showBImg.on('change', newValue => {
    document.querySelector('#checkSetTeamBImg').checked = newValue;
});
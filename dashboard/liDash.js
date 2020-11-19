

// Current scene

const currentBreakScene = nodecg.Replicant('currentBreakScene', 'ipl-overlay-controls');

showSchedule.onclick = () => { currentBreakScene.value = 'schedule'; }

currentBreakScene.on('change', newValue => {
    disableSceneButtons(newValue);
});

function disableSceneButtons(currentScene) {
    const elements = ['showSchedule'];
    elements.forEach(element => { document.getElementById(element).disabled = false; });
    if (currentScene === 'schedule') {
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

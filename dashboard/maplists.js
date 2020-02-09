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

const currentMaplist = nodecg.Replicant('currentMaplist', {
    defaultValue: [
        { id: 0, name: 'Default map list' },
        { map: 'Ancho-V Games', mode: 'Clam Blitz' },
        { map: 'Ancho-V Games', mode: 'Tower Control' },
        { map: 'Wahoo World', mode: 'Rainmaker' }
    ]
});

const splatMaps = ["Ancho-V Games",
    "Arowana Mall",
    "Blackbelly Skatepark",
    "Camp Triggerfish",
    "Goby Arena",
    "Humpback Pump Track",
    "Inkblot Art Academy",
    "Kelp Dome",
    "MakoMart",
    "Manta Maria",
    "Moray Towers",
    "Musselforge Fitness",
    "New Albacore Hotel",
    "Piranha Pit",
    "Port Mackerel",
    "Shellendorf Institute",
    "Shifty Station",
    "Snapper Canal",
    "Starfish Mainstage",
    "Sturgeon Shipyard",
    "The Reef",
    "Wahoo World",
    "Walleye Warehouse",
    "Skipper Pavilion"
];
splatMaps.sort();

const splatModes = ["Clam Blitz",
    "Tower Control",
    "Rainmaker",
    "Splat Zones",
    "Turf War"
];
splatModes.sort();

const blue = "#3F51B5";
const red = "#C9513E";

var firstLoad = true;

//perhaps a little overcomplicated but it will do
function generateId() {
    return '' + Math.random().toString(36).substr(2, 9);
}

create3Map.onclick = () => {
    createMapList(3, generateId());
}

create5Map.onclick = () => {
    createMapList(5, generateId());
}

create7Map.onclick = () => {
    createMapList(7, generateId());
}

removeAll.onclick = () => {
    var mapListElems = document.getElementsByClassName("mapListDiv");
    while (mapListElems[0]) {
        mapListElems[0].parentNode.removeChild(mapListElems[0]);
    }
    maplists.value = [
        [
            { id: 0, name: "Default map list" },
            { map: "Ancho-V Games", mode: "Clam Blitz" },
            { map: "Ancho-V Games", mode: "Tower Control" },
            { map: "Wahoo World", mode: "Rainmaker" }
        ]
    ];
}

function createMapList(numberOfMaps, id) {
    //support up to 7 maps for the time being
    //if you want me dead, host a tournament with 9 maps in the finals
    if (typeof numberOfMaps !== "number" || numberOfMaps >= 8 || numberOfMaps <= 0) {
        throw "this should not happen, ever";
    }
    var mapListDiv = document.createElement("div");
    mapListDiv.classList.add("space");
    mapListDiv.classList.add("mapListDiv");
    mapListDiv.id = "mapListSpace_" + id;
    let nameInput = document.createElement("paper-input");
    let updateButton = document.createElement("paper-button");
    nameInput.id = "nameInput_" + id;
    nameInput.label = "Map list name";
    nameInput.addEventListener('input', () => {
        updateButton.style.backgroundColor = red;
    })
    mapListDiv.appendChild(nameInput);
    for (let i = 0; i < numberOfMaps; i++) {
        //separator
        let separator = document.createElement("div");
        separator.classList.add("separator");
        let separatorSpan = document.createElement("span");
        separatorSpan.innerText = i + 1;
        separator.appendChild(separatorSpan);
        mapListDiv.appendChild(separator);
        //map select
        let mapSelect = document.createElement("select");
        mapSelect.id = "mapSelect_" + id + "_" + i;
        mapSelect.classList.add("mapSelect");
        fillMapList(mapSelect);
        mapListDiv.appendChild(mapSelect);
        //mode select
        let modeSelect = document.createElement("select");
        modeSelect.id = "modeSelect_" + id + "_" + i;
        modeSelect.classList.add("modeSelect");
        fillModeList(modeSelect);
        mapListDiv.appendChild(modeSelect);
        mapSelect.addEventListener('change', () => {
            updateButton.style.backgroundColor = red;
        })
        modeSelect.addEventListener('change', () => {
            updateButton.style.backgroundColor = red;
        })
    }
    updateButton.raised = true;
    updateButton.innerText = "update"
        //do i even have to do this?
    updateButton.id = numberOfMaps + "&" + id;
    if (!firstLoad) {
        updateButton.style.backgroundColor = red;
    }
    updateButton.onclick = (event) => {
        let splitId = event.target.id.split("&");
        const buttonNumberOfMaps = splitId[0];
        const buttonId = splitId[1];
        let nameInput = document.querySelector("paper-input#nameInput_" + buttonId);
        var selectedMaps = [{ id: buttonId, name: nameInput.value }];
        for (let i = 0; i < buttonNumberOfMaps; i++) {
            let currentMap = {
                map: "",
                mode: ""
            };
            let id = buttonId + "_" + i;
            let mapId = "select#mapSelect_" + id;
            let mapSelector = document.querySelector(mapId);
            currentMap.map = mapSelector.value;

            let modeId = "select#modeSelect_" + id;
            let modeSelector = document.querySelector(modeId);
            currentMap.mode = modeSelector.value;
            selectedMaps.push(currentMap);
        }
        const mapListIndex = findMapList(buttonId);
        if (mapListIndex == null) {
            maplists.value.push(selectedMaps);
        } else {
            maplists.value[mapListIndex] = selectedMaps;
        }
        event.target.style.backgroundColor = blue;
    }
    mapListDiv.appendChild(updateButton);
    let removeButton = document.createElement("paper-button");
    removeButton.style.backgroundColor = red;
    removeButton.raised = true;
    removeButton.id = "removeButton_" + id;
    removeButton.innerText = "REMOVE"
    removeButton.onclick = (event) => {
        const buttonId = event.target.id.split("_")[1];
        let mapListSpace = document.querySelector("div#mapListSpace_" + buttonId);
        let mapIndex = findMapList(buttonId);
        if (mapIndex !== null) {
            maplists.value.splice(mapIndex, 1);
        }
        mapListSpace.parentNode.removeChild(mapListSpace);
    }
    mapListDiv.appendChild(removeButton);

    mapsGrid.prepend(mapListDiv);
}

function findMapList(id) {
    for (let i = 0; i < maplists.value.length; i++) {
        const element = maplists.value[i];
        if (element[0].id == id) {
            return i;
        }
    }
    return null;
}

function setMapListValues(id, values) {
    let listNameItem = document.querySelector("paper-input#nameInput_" + id);
    listNameItem.value = values[0].name;
    for (let i = 1; i < values.length; i++) {
        let selectorId = id + "_";
        selectorId += i - 1;
        let mapSelectElem = document.querySelector("select#mapSelect_" + selectorId);
        let modeSelectElem = document.querySelector("select#modeSelect_" + selectorId);
        mapSelectElem.value = values[i].map;
        modeSelectElem.value = values[i].mode;
    }
}

function fillMapList(mapList) {
    for (i = 0; i < splatMaps.length; i++) {
        var opt = document.createElement("option");
        opt.value = splatMaps[i];
        opt.text = splatMaps[i];
        mapList.add(opt);
    }
}

function fillModeList(modeList) {
    for (i = 0; i < splatModes.length; i++) {
        var opt = document.createElement("option");
        opt.value = splatModes[i];
        opt.text = splatModes[i];
        modeList.add(opt);
    }
}

function mapListElemExists(id) {
    const mapListElem = document.querySelector("div#mapListSpace_" + id);
    if (mapListElem === null) {
        return false;
    } else { return true; }
}

maplists.on('change', (newValue, oldValue) => {
    for (let i = 0; i < newValue.length; i++) {
        const element = newValue[i];
        if (!mapListElemExists(element[0].id)) {
            createMapList(element.length - 1, element[0].id);
        }
        setMapListValues(element[0].id, element);
    }
    firstLoad = false;
    if (oldValue) {
        for (let i = 0; i < oldValue.length; i++) {
            const element = oldValue[i];
            const current = JSON.parse(JSON.stringify(currentMaplist.value));
            if (checkMapObjectEqual(current, element)) {
                currentMaplist.value = newValue[i];
            }
        }
    }
});

function checkMapObjectEqual(obj1, obj2) {
    if (obj1.length !== obj2.length) { return false; }
    for (let i = 0; i < obj1.length; i++) {
        const element = obj1[i];
        const element2 = obj2[i];
        if (i === 0) {
            if (element.id != element2.id || element.name !== element2.name) { return false; }
        } else {
            if (element.map !== element2.map || element.mode !== element2.mode) { return false; }
        }
    }
    return true;
};
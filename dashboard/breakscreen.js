const clrRed = "#C9513E";
const clrBlue = "#3F51B5";

class BreakScreenHandler {
	constructor() {
		this.nextNameA = nodecg.Replicant('nextNameA', {defaultValue: ""});
		this.nextNameB = nodecg.Replicant('nextNameB', {defaultValue: ""});
		this.nextUpShown = nodecg.Replicant('nextUpShown', {defaultValue: true});
		this.bigTextValue = nodecg.Replicant('bigTextValue', {defaultValue: "Be right back!"});
	}

	changeButtonColor(color, id) {
		document.getElementById(id).style.backgroundColor = color;
	}

	disableShowHideButtons(value) {
		if (value) {
			document.getElementById('hideNextUp').disabled = false;
			document.getElementById('showNextUp').disabled = true;
		} else {
			document.getElementById('showNextUp').disabled = false;
			document.getElementById('hideNextUp').disabled = true;
		}
	}

	listen() {
		this.nextNameA.on('change', newValue => { p1NextNameInput.value = newValue; });
		this.nextNameB.on('change', newValue => { p2NextNameInput.value = newValue; });
		this.bigTextValue.on('change', newValue => { breakFlavorInput.value = newValue; });

		updateNextNames.onclick = () => {
			this.nextNameA.value = p1NextNameInput.value;
			this.nextNameB.value = p2NextNameInput.value;
			this.bigTextValue.value = breakFlavorInput.value;
			this.changeButtonColor(clrBlue, "updateNextNames");
		}

		const toAddListenersNext = ['p1NextNameInput', 'p2NextNameInput', 'breakFlavorInput'];
		toAddListenersNext.forEach(element => { document.getElementById(element).addEventListener('input', () => {this.changeButtonColor(clrRed, "updateNextNames"); })});

		showNextUp.onclick = () => {
			this.nextUpShown.value = true;
		}

		hideNextUp.onclick = () => {
			this.nextUpShown.value = false;
		}

		this.nextUpShown.on('change', newValue => { this.disableShowHideButtons(newValue); });
	}
}

const BSHandler = new BreakScreenHandler().listen();
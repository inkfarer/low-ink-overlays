const RGBModeEnabled = nodecg.Replicant('RGBModeEnabled', {defaultValue: false});
const RGBModeToggle = document.getElementById('rgb-mode-toggle');

RGBModeToggle.addEventListener('change', e => {
	RGBModeEnabled.value = e.target.checked;
});

RGBModeEnabled.on('change', newValue => {
	RGBModeToggle.checked = newValue;
});

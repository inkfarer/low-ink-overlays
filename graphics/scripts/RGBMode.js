RGBModeEnabled.on('change', newValue => {
	if (newValue) {
		enableRGBMode();
	} else {
		disableRGBMode();
	}
});

var RGBTimeline = gsap.timeline({repeat: -1});

function enableRGBMode() {
	RGBTimeline = gsap.timeline({repeat: -1});
	//const rainbowColors = ['#F37002', '#FFFF00', '#00FF00', '#0000FF', '#8B00FF', '#FF0000', '#F37002'];
	const rainbowColors = [
		{
			r: 243,
			g: 112,
			b: 2
		},
		{
			r: 255,
			g: 255,
			b: 0
		},
		{
			r: 0,
			g: 255,
			b: 0
		},
		{
			r: 0,
			g: 0,
			b: 255
		},
		{
			r: 139,
			g: 0,
			b: 255
		},
		{
			r: 255,
			g: 0,
			b: 0
		},
		{
			r: 243,
			g: 112,
			b: 2
		}
	];
	for (let i = 0; i < rainbowColors.length; i++) {
		const element = rainbowColors[i];
		let duration = 1;
		if (i === 0) {
			duration = 0;
		}
		RGBTimeline.add(gsap.to(':root', {
			'--accent': `rgb(${element.r}, ${element.g}, ${element.b})`,
			'--accent-alpha-15': `rgba(${element.r}, ${element.g}, ${element.b}, 0.15)`,
			duration: duration,
			ease: 'none'
		}));
	}
}

function disableRGBMode() {
	if (RGBTimeline) {
		RGBTimeline.kill();
	}
	gsap.to(':root', {
		'--accent': '#F37002',
		'--accent-alpha-15': 'rgba(243, 112, 2, 0.15)',
		duration: 1,
		ease: 'none'
	});
}

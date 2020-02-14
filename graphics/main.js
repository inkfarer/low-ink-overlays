const emptyTeamInfo = {
    name: "",
    logoUrl: "",
    players: [{
        name: "",
        username: ""
    }]
};

const flavorText = nodecg.Replicant('flavorText', { defaultValue: "Low Ink" });
const teamAInfo = nodecg.Replicant('teamAInfo', { defaultValue: emptyTeamInfo });
const teamBInfo = nodecg.Replicant('teamBInfo', { defaultValue: emptyTeamInfo });
const teamAColor = nodecg.Replicant('teamAColor', { defaultValue: "Default pink" });
const teamBColor = nodecg.Replicant('teamBColor', { defaultValue: "Default green" });
const teamAScore = nodecg.Replicant('teamAScore', { defaultValue: 0 });
const teamBScore = nodecg.Replicant('teamBScore', { defaultValue: 0 });
const scoreboardShown = nodecg.Replicant('scoreboardShown', { defaultValue: true });

const colorNameToHex = {
    "Light Blue": "#0199B8",
    "Purple": "#9208B2",
    "Yellow": "#BBC905",
    "Pink": "#CB0856",
    "Orange": "#FB5C03",
    "Turquoise": "#0CAE6E",
    "Sky Blue": "#007EDC",
    "Mustard": "#CE8003",
    "Default pink": "#f02d7d",
    "Default green": "#19D719",
    "Big blue": "#0006FF"
}

//replicant changes
flavorText.on('change', newValue => { flavorTextDisplay.text = newValue; });
teamAInfo.on('change', newValue => { teamAnameDisplay.text = newValue.name; });
teamBInfo.on('change', newValue => { teamBnameDisplay.text = newValue.name; });
teamAColor.on('change', newValue => { gsap.to("#teamAcolorDisplay", 0.5, { backgroundColor: colorNameToHex[newValue] }); });
teamBColor.on('change', newValue => { gsap.to("#teamBcolorDisplay", 0.5, { backgroundColor: colorNameToHex[newValue] }); });

teamAScore.on('change', newValue => { teamAScoreDisplay.text = newValue; });
teamBScore.on('change', newValue => { teamBScoreDisplay.text = newValue; });

scoreboardShown.on('change', newValue => {
    if (newValue) {
        //show scoreboard
        gsap.to(".scLine", 0.5, { height: 106, top: 0, ease: "power2.out" });
        gsap.to("#scContents", 0.75, { left: 0, ease: "power2.out", delay: 0.4 });
    } else {
        gsap.to("#scContents", 0.75, { left: -430, ease: "power2.in" });
        gsap.to(".scLine", 0.5, { height: 0, top: 53, ease: "power2.in", delay: 0.7 });
    }
});
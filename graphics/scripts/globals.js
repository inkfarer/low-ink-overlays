const DASHBOARD_BUNDLE_NAME = 'ipl-overlay-controls';

function addDots(string = "") {
    const maxNameLength = 48;
    const rolloff = '...';

    if (!string) return string;
    if (string.length > maxNameLength) return string.substring(0, (maxNameLength - rolloff.length)) + rolloff;
    else return string;
}

function loadImagePromise(imageUrl) {
    return new Promise((resolve) => {
        const imageLoaderElem = document.createElement("img");
        imageLoaderElem.src = imageUrl;

        imageLoaderElem.addEventListener('load', () => {
            resolve();
        });
    })
}

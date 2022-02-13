const DASHBOARD_BUNDLE_NAME = 'ipl-overlay-controls';

function doOnDifference(newValue, oldValue, path, callback) {
    const newObject = _.get(newValue, path);
    const oldObject = _.get(oldValue, path);

    if (newObject != null && (oldObject == null || !_.isEqual(newObject, oldObject))) {
        callback(newObject, oldObject);
    }
}

function doOnOneOrMoreDifference(newValue, oldValue, paths, callback) {
    const newPaths = _.at(newValue, paths);
    const oldPaths = _.at(oldValue, paths);

    const doesNotExist = value => value == null;

    if (!newPaths.every(doesNotExist) && (oldPaths.every(doesNotExist) || !_.isEqual(newPaths, oldPaths))) {
        callback(newPaths);
    }
}

function doOnNoDifference(newValue, oldValue, path, callback) {
    const newObject = _.get(newValue, path);
    const oldObject = _.get(oldValue, path);

    if (newObject != null && (oldObject == null || _.isEqual(newObject, oldObject))) {
        callback(newObject);
    }
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

function addDots(value, maxLength = 48) {
    const rolloff = '...';

    if (!value) return value;
    if (value.length > maxLength) {
        return value.substring(0, maxLength - rolloff.length) + rolloff;
    }

    return value;
}

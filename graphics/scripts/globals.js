const DASHBOARD_BUNDLE_NAME = 'ipl-overlay-controls';

function doOnDifference(newValue, oldValue, path, callback) {
    const newObject = _.get(newValue, path);
    const oldObject = _.get(oldValue, path);

    if (newObject != null && (oldObject == null || !_.isEqual(newObject, oldObject))) {
        callback(newObject);
    }
}

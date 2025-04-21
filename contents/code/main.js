/// Windows that should never be affected by this script.
///
/// Applications are specified by their class name, eg. `org.kde.yakuake`.
const alwaysExcludedApplications = [
    "krunner",
    "org.kde.yakuake",
];

/// User specified applications to exclude from being centered.
///
/// Applications are specified by their class name, eg. `org.kde.yakuake`.
const userExcludedApplications = readConfig("applications", "").toLowerCase().split("\n");

const config = {
    excludedApplications: alwaysExcludedApplications.concat(userExcludedApplications),
};

/**
 * Prints a message to the console.
 * 
 * Other print methods are not showing up, so we are using console.info.
 * 
 * We are including a prefix to make it easier to find the messages.
 * 
 * Monitor output with:
 * $ journalctl -b -f | grep -i "center-new-windows:"
 * 
 * @param {string} message The message to print.
 * @returns {void}
 */
function print(message) {
    console.info("center-new-windows: " + message);
}

/// Monitor all windows being added to the workspace.
workspace.windowAdded.connect(window => {
    let className = window.resourceClass.toLowerCase();
    let isNormalWindow = (window.windowType === 0);

    let isExcludedApplication = window.isFullScreen ||
        config.excludedApplications.includes(className);

    print("~~~~~");    
    print("Window added: " + "Caption: " + window.caption);
    print("resourceName " + window.resourceName);
    print("resourceClass " + window.resourceClass);

    if (!isNormalWindow || isExcludedApplication) {
        print("Ignoring window. className: " + className + ", Title: " + window.caption);
        return;
    }

    let geometry = window.frameGeometry; // QRectF
    let potentialFullScreenArea = workspace.clientArea(KWin.FullScreenArea, window);

    // If the windows is taking up the full screen, we don't want to move it.
    if (geometry === potentialFullScreenArea) {
        print("Ignoring window for " + className + ", it is borderless fullscreen.");
        return;
    }
    
    print("Window geometry: " + geometry);
    print("window properties: " + JSON.stringify(window));

    // Get the available client area for the window.
    let clientArea = workspace.clientArea(KWin.MaximizeArea, window);

    // Move the window to the center of the client area.
    let x = clientArea.x + (clientArea.width - geometry.width) / 2;
    let y = clientArea.y + (clientArea.height - geometry.height) / 2;

    window.frameGeometry = {
        x: x,
        y: y,
        width: geometry.width,
        height: geometry.height
    };

    print("Moved window to: " + window.frameGeometry);
});

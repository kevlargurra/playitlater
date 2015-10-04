var shows = [], url = document.URL, expDate, title, longDescr, thumbnailUrl, i;
var showId = url.split("/")[4];

/**
  Fetches metadata needed for the save action
*/
function fetchMetadata() {
    var scriptTags = document.getElementsByTagName("script"), json = "", i, metadata;
    for (i = 0; i < scriptTags.length; i += 1) {
        if (scriptTags[i].type === "application/ld+json") {
            json = scriptTags[i].innerText;
            break;
        }
    }
    metadata = JSON.parse(json);
    title = metadata.name;
    longDescr = metadata.description;
    expDate = metadata.expires;
    expDate = new Date(expDate.substring(0, 4),
                       parseInt(expDate.substring(5, 7), 10) - 1,
                       expDate.substring(8, 10), 23, 59, 59, 999);
    thumbnailUrl = "http:" + metadata.thumbnailUrl;
}

/**
  Saves this show
*/
function saveShow() {
    fetchMetadata();
    var showDataToSave,
        showData = {
            showId: showId,
            expDate: expDate.getTime(),
            link: url,
            title: title,
            longdescription: longDescr,
            thumbnailUrl: thumbnailUrl
        };
    shows.push(showData);
  
    showDataToSave = {"shows": shows};
    chrome.storage.sync.set(showDataToSave);
}

/**
  Unsaves this show
*/
function unsaveShow() {
    var showDataToSave = {};
    for (i = 0; i < shows.length; i += 1) {
        if (shows[i].showId === showId) {
            shows.splice(i, 1);
            break;
        }
    }
    showDataToSave = {"shows": shows};
    chrome.storage.sync.set(showDataToSave);
}

/**
  Sets save button state and adds listener
*/
function setSaveButton(showIsSaved) {
    var saveDiv = document.getElementsByClassName("play_video-area-aside__info")[0],
        tag = document.createElement("a"),
        saveButton,
        unsaveButton;
    tag.setAttribute("href", "#");
    tag.setAttribute("class", "play_video-area-aside__title-page-link");
    if (showIsSaved) {
        saveDiv.removeChild(saveDiv.firstChild);
        tag.setAttribute("id", "unsave");
        tag.innerText = "Sluta spara program";
        saveDiv.insertBefore(tag, saveDiv.children[0]);
        unsaveButton = document.getElementById("unsave");
        unsaveButton.addEventListener("click", function (event) {
            event.preventDefault();
            unsaveShow();
        }, false);
    } else {
        saveDiv.removeChild(saveDiv.firstChild);
        tag.setAttribute("id", "save");
        tag.innerText = "Spara program";
        saveDiv.insertBefore(tag, saveDiv.children[0]);
        saveButton = document.getElementById("save");
        saveButton.addEventListener("click", function (event) {
            event.preventDefault();
            saveShow();
        }, false);
    }
}

/**
  Checks save status for this show
*/
function checkIfThisShowIsSaved() {
    var thisShowIsSaved;
    chrome.storage.sync.get("shows", function (result) {
        if (result.shows !== undefined) {
            shows = result.shows;
        }
        thisShowIsSaved = false;
        for (i = 0; i < shows.length; i += 1) {
            if (shows[i].showId === showId) {
                thisShowIsSaved = true;
                break;
            }
        }
        setSaveButton(thisShowIsSaved);
    });
}

chrome.storage.onChanged.addListener(function (changes, areaName) {
    var i;
    shows = changes.shows.newValue;
    for (i = 0; i < changes.shows.newValue.length; i += 1) {
        if (showId === changes.shows.newValue[i].showId) {
            setSaveButton(true);
            return;
        }
    }
    setSaveButton(false);
});

checkIfThisShowIsSaved();


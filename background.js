var url = document.URL, i, show;
var showId = url.split("/")[4];

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
            show.unsave();
        }, false);
    } else {
        saveDiv.removeChild(saveDiv.firstChild);
        tag.setAttribute("id", "save");
        tag.innerText = "Spara program";
        saveDiv.insertBefore(tag, saveDiv.children[0]);
        saveButton = document.getElementById("save");
        saveButton.addEventListener("click", function (event) {
            event.preventDefault();
            show.save();
        }, false);
    }
}

/**
  Fetches metadata needed for the save action
*/
function fetchMetadata() {
    var scriptTags = document.getElementsByTagName("script"), json = "", i, metadata, title, longDescr, expDate, thumbnailUrl;
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
    show = new Show(showId, title, url, longDescr, expDate, thumbnailUrl);
    show.isShowSaved(setSaveButton);
}



chrome.storage.onChanged.addListener(function (changes, areaName) {
    if (changes[show.id] !== undefined) {
        if (changes[show.id].newValue !== undefined) {
            setSaveButton(true);
        } else {
            setSaveButton(false);
        }
    }
});

fetchMetadata();

var shows = [];
var url = document.URL;
console.log("URL: " + url);
var showId = url.split("/")[4];
console.log("Show id: " + showId);
var expDate;
var title;
var subtitle;
var longDescr;
var thumbnailUrl;

function getSavedShows() {
  chrome.storage.sync.get("shows", function (result) {
    if (chrome.runtime.error) {
      console.log("Runtime error when getting old data!");
    }
    if (result.shows !== undefined) {
      shows = result.shows;
    }
    var thisShowIsSaved = false;    
    for (i = 0;i < shows.length;i++) {
      if (shows[i].showId == showId) {
        thisShowIsSaved = true;
        break;
      }
    }
    setSaveButton(thisShowIsSaved);
  });
}

function saveShow() {
  fetchMetadata();
  var showData = {showId:showId, expDate:expDate.getTime(), link:url, title:title, subtitle:subtitle, longdescription:longDescr, thumbnailUrl:thumbnailUrl};
  console.log("ms: " + expDate.getTime());
  shows.push(showData);
  
  var showDataToSave = {};
  showDataToSave = {"shows":shows};
  chrome.storage.sync.set(showDataToSave, function() {
    if (chrome.runtime.error) {
      console.log("Runtime error when saving show!");
    }
    else {
      console.log("Show " + showId + " was saved");
    }
    //getSavedShows();
  });
}

function unsaveShow() {
  for (i = 0;i < shows.length; i++) {
    if (shows[i].showId === showId) {
      shows.splice(i, 1);
      break;
    }
  }
  var showDataToSave = {};
  showDataToSave = {"shows":shows};
  chrome.storage.sync.set(showDataToSave, function() {
    if (chrome.runtime.error) {
      console.log("Runtime error when saving show!");
    }
    else {
      console.log("Show " + showId + " was removed");
    }
    //getSavedShows();
  });
}

/**
  Fetches metadata needed for the save action
*/
function fetchMetadata() {
  
  var scriptTags = document.getElementsByTagName("script");
  var json = "";
  
  for (i = 0;i < scriptTags.length;i++) {
    if (scriptTags[i].type == "application/ld+json") {
      json = scriptTags[i].innerText;
      break;
    }
  }
  var metadata = JSON.parse(json);
  title = metadata.name;
  longDescr = metadata.description;
  
  console.log("Title: " + title);
  expDate = metadata.expires;
  console.log("hepp: " + expDate.substring(8, 10));
  expDate = new Date(expDate.substring(0, 4), parseInt(expDate.substring(5, 7)) - 1, expDate.substring(8, 10), 23, 59, 59, 999);
  
  console.log("Expiration date: " + expDate);
  
  subtitle = "";
  thumbnailUrl = "http:" + metadata.thumbnailUrl;
  console.log("Subtitle: " + subtitle);
  
  
}

/**
  Sets save button state and adds listener
*/
function setSaveButton(showIsSaved) {
  var regexp = "(<div class=\"play_video-area-aside__info\">\\s|<div class=\"play_video-area-aside__info\"><a href=\"#\" id=\"(save|unsave)\">(Spara program|Sluta spara program)</a>)";  
  var saveDiv = document.getElementsByClassName("play_video-area-aside__info")[0];
  console.log("Save div: " + saveDiv[0]);
  var tag = document.createElement("a");
    tag.setAttribute("href", "#");
  if (showIsSaved) {
    console.log("Show " + showId + " is already saved");
    saveDiv.removeChild(saveDiv.firstChild);
    tag.setAttribute("id", "unsave");
    tag.innerText = "Sluta spara program";
    saveDiv.insertBefore(tag, saveDiv.children[0]);
    var unsaveButton = document.getElementById("unsave");
    unsaveButton.addEventListener("click", function(event) {
        event.preventDefault();
        unsaveShow();
    }, false);
  }
  else {
    console.log("Show " + showId + " is not saved");
    saveDiv.removeChild(saveDiv.firstChild);
    tag.setAttribute("id", "save");
    tag.innerText = "Spara program";
    saveDiv.insertBefore(tag, saveDiv.children[0]);
    var saveButton = document.getElementById("save");
    saveButton.addEventListener("click", function(event) {
        event.preventDefault();
        saveShow();
    }, false);
  }
}

chrome.storage.onChanged.addListener(function (changes, areaName) {
    //debugger;
    for (var i = 0;i < changes["shows"].newValue.length;i++) {
      if (showId == changes["shows"].newValue[i].showId) {
        setSaveButton(true);
        return;
      }
    }
    setSaveButton(false);
    //console.log("Change in storage!: " + changes["shows"].newValue[0].showId);
});
//chrome.storage.sync.clear();
getSavedShows();


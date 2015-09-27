var shows, expDates = [];

var month_names = [];
month_names[month_names.length] = "jan";
month_names[month_names.length] = "feb";
month_names[month_names.length] = "mar";
month_names[month_names.length] = "apr";
month_names[month_names.length] = "maj";
month_names[month_names.length] = "jun";
month_names[month_names.length] = "jul";
month_names[month_names.length] = "aug";
month_names[month_names.length] = "sep";
month_names[month_names.length] = "okt";
month_names[month_names.length] = "nov";
month_names[month_names.length] = "dec";

function updatePopup() {
    var showItem,
        showId,
        lastDayToWatch,
        today = new Date(),
        daysLeftToWatch,
        deleteLink,
        listItem,
        unorderedList,
        showLink,
        showDataDiv,
        thumbnailElement,
        saveUnsaveLinkText,
        i;

    showDataDiv = document.getElementById("data");
    unorderedList = document.createElement("ul");
    showDataDiv.appendChild(unorderedList);
    if (shows === undefined || shows.length < 1) {
        listItem = document.createElement("li");
        listItem.appendChild(document.createTextNode("Inga sparade program kunde hittas"));
        showDataDiv.appendChild(listItem);
    } else {
        for (i = 0; i < shows.length; i += 1) {
            showItem = {};
            
            showId = shows[i].showId;
            // create "show" object with all data needed to re-save show + listener for save/unsave link
            showItem.showId = showId;
            showItem.expDate = shows[i].expDate;
            showItem.link = shows[i].link;
            showItem.title = shows[i].title;
            showItem.longdescription = shows[i].longdescription;
            showItem.thumbnailUrl = shows[i].thumbnailUrl;
            showItem.isSaved = true;
            
            // calculate last day to watch and days left to watch
            lastDayToWatch = new Date(shows[i].expDate);
            daysLeftToWatch = Math.floor((lastDayToWatch.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            
            // create and populate HTML elements
            listItem = document.createElement("li");
            
            thumbnailElement = document.createElement("img");
            thumbnailElement.setAttribute("src", shows[i].thumbnailUrl);
            thumbnailElement.setAttribute("width", 50);
            listItem.appendChild(thumbnailElement);
            
            listItem.appendChild(document.createElement("p"));
            showLink = document.createElement("a");
            showLink.setAttribute("href", shows[i].link);
            showLink.setAttribute("target", "_blank");
            showLink.setAttribute("title", shows[i].longdescription);
            showLink.innerHTML = shows[i].title; // innerHTML instead of textnode to preserve special characters
            listItem.appendChild(showLink);
            listItem.appendChild(document.createElement("br"));
            
            listItem.appendChild(document.createTextNode("Kan ses till " + lastDayToWatch.getDate() + " " + month_names[lastDayToWatch.getMonth()] +
                " (" + daysLeftToWatch + " dagar kvar)"));
            listItem.appendChild(document.createElement("br"));
            
            saveUnsaveLink = document.createElement("a");
            saveUnsaveLink.setAttribute("href", "#");
            saveUnsaveLinkText = document.createTextNode("Sluta spara");
            saveUnsaveLink.appendChild(saveUnsaveLinkText);
            
            // update object
            showItem.saveUnsaveLinkText = saveUnsaveLinkText;
            showItem.showId = showId;
            showItem.isSaved = true;
            fn = saveUnsaveLinkUpdater.bind(showItem);
            showItem.saveUnsaveLinkUpdaterFunction = fn;
            
            saveUnsaveLink.addEventListener("click", showItem.saveUnsaveLinkUpdaterFunction);
            
            listItem.appendChild(saveUnsaveLink);
            unorderedList.appendChild(listItem);

        }
    }
}

function saveShow(showItem) {
    var showDataToSave,
        showData = {
            showId: showItem.showId,
            expDate: showItem.expDate,
            link: showItem.link,
            title: showItem.title,
            longdescription: showItem.longdescription,
            thumbnailUrl: showItem.thumbnailUrl
        };
    shows.push(showData);
  
    showDataToSave = {"shows": shows};
    chrome.storage.sync.set(showDataToSave, function() {
      showItem.saveUnsaveLinkText.nodeValue = "Sluta spara";
      showItem.isSaved = true;
    });
}

function unsaveShow(showItem) {
    var showDataToSave = {};
    for (i = 0; i < shows.length; i += 1) {
        if (shows[i].showId === showItem.showId) {
            shows.splice(i, 1);
            break;
        }
    }
    showDataToSave = {"shows": shows};
    chrome.storage.sync.set(showDataToSave, function() {
      showItem.saveUnsaveLinkText.nodeValue = "Spara";  
      showItem.isSaved = false;
    });
}

var saveUnsaveLinkUpdater = function (event) {
  event.preventDefault();
  if (this.isSaved) {
    unsaveShow(this);
  }
  else {
    saveShow(this);
  }
};



function loadSavedShows() {
    var i;
    chrome.storage.sync.get("shows", function (result) {
        if (result.shows !== undefined) {
            shows = result.shows;
            shows.sort(function (show1, show2) {
                return show1.expDate > show2.expDate ? 1 : -1;
            });
        }
        updatePopup();
    });
}

document.addEventListener('DOMContentLoaded', function () {loadSavedShows(); });
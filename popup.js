var shows = [], expDates = [], show;

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

function saveShow(showAndLink) {
    showAndLink[0].save(function () {
        showAndLink[1].nodeValue = "Sluta spara";
    });
}

function unsaveShow(showAndLink) {
    showAndLink[0].unsave(function () {
        showAndLink[1].nodeValue = "Spara";
    });
}

var saveUnsaveLinkUpdater = function (event) {
    event.preventDefault();
    if (this[0].isSaved) {
        unsaveShow(this);
    } else {
        saveShow(this);
    }
};

function updatePopup() {
    var showId,
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
        saveUnsaveLink,
        expDate,
        thisShow,
        i;

    showDataDiv = document.getElementById("data");
    unorderedList = document.createElement("ul");
    showDataDiv.appendChild(unorderedList);
    if (shows === undefined || shows.length < 1) {
        listItem = document.createElement("li");
        listItem.appendChild(document.createTextNode("Inga sparade program kunde hittas"));
        showDataDiv.appendChild(listItem);
    } else {
        for (i = 0; i < shows.length; i++) {
            expDate = new Date(shows[i][1].expDate);
            thisShow = new Show(
                shows[i][0],
                shows[i][1].title,
                shows[i][1].link,
                shows[i][1].longdescription,
                expDate,
                shows[i][1].thumbnailUrl,
                true
            );

            // calculate last day to watch and days left to watch, delete unwatchable shows
            lastDayToWatch = new Date(thisShow.expirationDate);
            daysLeftToWatch = thisShow.getDaysLeft();
            if (daysLeftToWatch < 0) {
                thisShow.unsave();
                continue;
            }
            
            // create and populate HTML elements
            listItem = document.createElement("li");
            
            thumbnailElement = document.createElement("img");
            thumbnailElement.setAttribute("src", thisShow.thumbnailLink);
            thumbnailElement.setAttribute("width", 50);
            listItem.appendChild(thumbnailElement);
            
            listItem.appendChild(document.createElement("p"));
            showLink = document.createElement("a");
            showLink.setAttribute("href", thisShow.link);
            showLink.setAttribute("target", "_blank");
            showLink.setAttribute("title", thisShow.descr);
            showLink.innerHTML = thisShow.title; // innerHTML instead of textnode to preserve special characters
            listItem.appendChild(showLink);
            listItem.appendChild(document.createElement("br"));
            
            listItem.appendChild(document.createTextNode("Kan ses till " + lastDayToWatch.getDate() + " " + month_names[lastDayToWatch.getMonth()] +
                " (" + daysLeftToWatch + " dagar kvar)"));
            listItem.appendChild(document.createElement("br"));
            
            saveUnsaveLink = document.createElement("a");
            saveUnsaveLink.setAttribute("href", "#");
            saveUnsaveLinkText = document.createTextNode("Sluta spara");
            saveUnsaveLink.appendChild(saveUnsaveLinkText);
            
            saveUnsaveLink.addEventListener("click", saveUnsaveLinkUpdater.bind([thisShow, saveUnsaveLinkText]));
            
            listItem.appendChild(saveUnsaveLink);
            unorderedList.appendChild(listItem);

        }
    }
}

function loadSavedShows() {
    var i, allShows = [];
    chrome.storage.sync.get(null, function (items) {
        var allShowIds = Object.keys(items), key;
        if (Object.keys(items).length > 0) {
            for (key in items) {
                if (items.hasOwnProperty(key)) {
                    shows.push([key, items[key]]);
                }
            }
            shows.sort(function (show1, show2) {
                return show1[1].expDate > show2[1].expDate ? 1 : -1;
            });
        }
        updatePopup();
    });
}

document.addEventListener('DOMContentLoaded', function () {loadSavedShows(); });
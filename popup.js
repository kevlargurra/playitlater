var shows;

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
    var dataElement = document.getElementById("data"), htmlData = "<ul>", i, expDate, today = new Date(), diff;
    document.getElementById("data").innerHTML = "";
    if (shows === undefined || shows.length < 1) {
        htmlData = htmlData + "<li>Inga sparade program kunde hittas</li>";
    } else {
        for (i = 0; i < shows.length; i += 1) {
            console.log("Show " + i + ": " + shows[i].showId);
            expDate = new Date(shows[i].expDate);
            diff = Math.floor((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            htmlData = htmlData + "<li><p><img src=\"" + shows[i].thumbnailUrl + "\" width=50>" +
                "<a id=" + shows[i].showId + " href=\"" + shows[i].link + "\" + target=\"_blank\" title=\"" + shows[i].longdescription + "\">" +
                shows[i].title + "</a>, kan ses till " + expDate.getDate() + " " + month_names[expDate.getMonth()] + " (" + diff + " dagar kvar)</p></li>";
        }
    }
    htmlData = htmlData + "</ul>";
    document.getElementById("data").innerHTML = htmlData;
}

function loadSavedShows() {
    chrome.storage.sync.get("shows", function (result) {
        if (chrome.runtime.error) {
            console.log("Runtime error when getting old data!");
        }
        if (result.shows !== undefined) {
            shows = result.shows;
        }
        updatePopup();
    });
}

document.addEventListener('DOMContentLoaded', function () {loadSavedShows(); });
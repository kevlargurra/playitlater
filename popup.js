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
    var htmlData = "<ul>",
        lastDayToWatch,
        today = new Date(),
        daysLeftToWatch,
        i;
    if (shows === undefined || shows.length < 1) {
        htmlData = htmlData + "<li>Inga sparade program kunde hittas</li>";
    } else {
        for (i = 0; i < shows.length; i += 1) {
            lastDayToWatch = new Date(shows[i].expDate);
            daysLeftToWatch = Math.floor((lastDayToWatch.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            htmlData = htmlData + "<li><p><img src=\"" + shows[i].thumbnailUrl + "\" width=50>" +
                "<a id=" + shows[i].showId + " href=\"" + shows[i].link + "\" + target=\"_blank\" title=\"" +
                shows[i].longdescription + "\">" +
                shows[i].title + "</a>, kan ses till " + lastDayToWatch.getDate() + " " + month_names[lastDayToWatch.getMonth()] +
                " (" + daysLeftToWatch + " dagar kvar)</p></li>";
        }
    }
    htmlData = htmlData + "</ul>";
    document.getElementById("data").innerHTML = htmlData;
}

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
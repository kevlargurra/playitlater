var shows;

var month_names = new Array ( );
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

function loadSavedShows() {
  console.log("Getting saved shows...");  
  chrome.storage.sync.get("shows", function (result) {
    console.log("Got something!");    
    if (chrome.runtime.error) {
      console.log("Runtime error when getting old data!");
    }    
    if (result.shows !== undefined) {
      shows = result.shows;
    }
    updatePopup();
  });
}

function updatePopup() {
  var dataElement = document.getElementById("data");
  document.getElementById("data").innerHTML = "";
  var htmlData = "<ul>";
  if (shows === undefined || shows.length < 1) {
    htmlData = htmlData + "<li>Inga sparade program kunde hittas</li>";
  }
  else {
    for (i = 0; i < shows.length;i++) {
    console.log("Show " + i + ": " + shows[i].showId);
    var expDate = new Date(shows[i].expDate);
    var today = new Date();
    var diff = expDate.getTime() - today.getTime();
    diff = Math.floor(diff / (1000 * 60 * 60 * 24));
    htmlData = htmlData + "<li><p><img src=\"" + shows[i].thumbnailUrl + "\" width=50><a id=" + shows[i].showId + " href=\"" + shows[i].link + "\" + target=\"_blank\" title=\"" + shows[i].longdescription + "\">" + shows[i].title + "</a>, kan ses till " + expDate.getDate() + " " + month_names[expDate.getMonth()] + " (" + diff + " dagar kvar)</p></li>";
    }
  } 
  htmlData = htmlData + "</ul>";  
  document.getElementById("data").innerHTML = htmlData;  
}

document.addEventListener('DOMContentLoaded', function() {loadSavedShows();});





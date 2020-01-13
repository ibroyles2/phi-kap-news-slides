const dateObject = Date.now();
const currentDate = new Date(dateObject).toISOString();
const APIKey = "AIzaSyDHl44J_hE5kwLQwyP-IWtxl4zS2hgorwc";
const CalendarID = "296lgns27im7bgtotmjaac7uko@group.calendar.google.com";
const getURL = "https://www.googleapis.com/calendar/v3/calendars/" + CalendarID + "/events?key=" + APIKey + "&futureevents=true&timeMin=" + currentDate + "&singleEvents=true&orderBy=startTime";
var xhr = new XMLHttpRequest();

xhr.open('GET', getURL, true);
xhr.send();

xhr.onreadystatechange = processRequest;

function processRequest(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
        var response = JSON.parse(xhr.responseText);
        extractTopEvents(response);
    }
}

function extractTopEvents(response) {
    var events = response.items;
    var currentEvents = [];
    const eventNumber = 10;
    console.log(events);

    for (i = 0; i < eventNumber; i++) {
        let event = { title: "", start: "", end: "", location: "", description: "" };

        event.title = events[i].summary;
        event = getTimes(events[i].start, events[i].end, event);

        event.location = events[i].location;
        if (event.location === undefined) {
            event.location = "<i>No Location Provided</i>";
        }

        event.description = events[i].description;
        if (event.description === undefined) {
            event.description = "<i>No Description Provided</i>";
        }
        event.description = event.description.replace(new RegExp('\r?\n', 'g'), '<br />');
        currentEvents[i] = event;
    }
    sendToPage(currentEvents, 0);
    sendToPage(currentEvents, 1);
}

function getTimes(startObject, endObject, event) {
    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let start;
    let end;

    if (startObject.date != null) {
        start = startObject.date;
    } else {
        start = startObject.dateTime;
    }

    let startDateTime = new Date(start);
    event.start = monthNames[startDateTime.getMonth()];
    event.start = event.start + " " + startDateTime.getDate().toString();

    if (startObject.date === undefined) {
        event.start = event.start + ", " + startDateTime.toLocaleTimeString('en-US', { timeStyle: 'short' });
    }

    if (endObject.date != null) {
        end = endObject.date;
    } else {
        end = endObject.dateTime;
    }

    let endDateTime = new Date(end);
    event.end = monthNames[endDateTime.getMonth()];
    event.end = event.end + " " + endDateTime.getDate().toString();

    if (endObject.date === undefined) {
        event.end = event.end + ", " + endDateTime.toLocaleTimeString('en-US', { timeStyle: 'short' });
    }
    return event;
}

function sendToPage(eventList, set) {
    var htmlContent = "<div class=\"col\">";
    for (i = set * 5; i < (set * 5) + 5; i++) {
        htmlContent += "<div class=\"row row-striped\"><div class=\"col\"><h3 class=\"text-uppercase\"><strong>"; // opener
        htmlContent += eventList[i].title; // title
        htmlContent += "</strong></h3><ul class=\"list-inline\"><li class=\"list-inline-item\"><i class=\"fa fa-calendar-o\" aria-hidden=\"true\"></i>";
        htmlContent += " " + eventList[i].start + " - " + eventList[i].end;
        htmlContent += "</li><li class=\"list-inline-item\"><i class=\"fa fa-location-arrow\" aria-hidden=\"true\"></i>";
        htmlContent += " " + eventList[i].location;
        htmlContent += "</li></ul><p>" + eventList[i].description + "</p></div></div>"
    }
    htmlContent += "</div>"
    document.getElementById("card-calendar-" + set).innerHTML = htmlContent;
}
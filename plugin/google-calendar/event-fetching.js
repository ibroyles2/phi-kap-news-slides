const dateObject = Date.now();
const currentDate = new Date(dateObject).toISOString();
const APIKey = "AIzaSyDHl44J_hE5kwLQwyP-IWtxl4zS2hgorwc";
const CalendarID = "296lgns27im7bgtotmjaac7uko@group.calendar.google.com";
const getURL = "https://www.googleapis.com/calendar/v3/calendars/" + CalendarID + "/events?key=" + APIKey + "&futureevents=true&timeMin=" + currentDate + "&singleEvents=true&orderBy=startTime";
var calendarRequest = new XMLHttpRequest();

calendarRequest.open('GET', getURL, true);
calendarRequest.send();

calendarRequest.onreadystatechange = processRequest;

function processRequest(e) {
    if (calendarRequest.readyState == 4 && calendarRequest.status == 200) {
        var response = JSON.parse(calendarRequest.responseText);
        extractTopEvents(response);
    }
}

function extractTopEvents(response) {
    var events = response.items;
    console.log(events);
    var currentEvents = [];
    const eventNumber = 10;

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
    let dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let start;
    let end;

    if (startObject.date != null) {
        start = startObject.date;
        start += "T00:00:00-06:00";
    } else {
        start = startObject.dateTime;
    }

    console.log(start);

    let startDateTime = new Date(start);
    console.log(startDateTime);
    let startDay = startDateTime.getDay();
    let startMonth = startDateTime.getMonth();
    let startDate = startDateTime.getDate();
    event.start = dayNames[startDay] + ", " + monthNames[startMonth];
    event.start += " " + startDate.toString();

    if (startObject.date === undefined) {
        event.start = event.start + ", " + startDateTime.toLocaleTimeString('en-US', { timeStyle: 'short' });
    }

    if (endObject.date != null) {
        end = endObject.date;
    } else {
        end = endObject.dateTime;
    }

    let endDateTime = new Date(end);
    let endDay = endDateTime.getDay();
    let endMonth = endDateTime.getMonth();
    let endDate = endDateTime.getDate();
    event.end = "";
    if(endMonth != startMonth || endDate != startDate) {
        event.end += dayNames[endDay] + ", " + monthNames[endMonth] + " " + endDate.toString();
        if (endObject.date === undefined) {
            event.end += ", ";
        }
    }
    if (endObject.date === undefined) {
        event.end += endDateTime.toLocaleTimeString('en-US', { timeStyle: 'short' });
    }

    if(event.end == "") {
        event.time = event.start + " ";
    } else {
        event.time = event.start + " - " + event.end;
    }

    return event;
}

function sendToPage(eventList, set) {
    var htmlContent = "<div class=\"col\">";
    for (i = set * 5; i < (set * 5) + 5; i++) {
        htmlContent += "<div class=\"row row-striped\"><div class=\"col\"><h3 class=\"text-uppercase\"><strong>"; // opener
        htmlContent += eventList[i].title; // title
        htmlContent += "</strong></h3><ul class=\"list-inline\"><li class=\"list-inline-item\"><i class=\"fa fa-calendar-o\" aria-hidden=\"true\"></i>";
        htmlContent += " " + eventList[i].time;
        htmlContent += "</li><li class=\"list-inline-item\"><i class=\"fa fa-location-arrow\" aria-hidden=\"true\"></i>";
        htmlContent += " " + eventList[i].location;
        htmlContent += "</li></ul><p>" + eventList[i].description + "</p></div></div>"
    }
    htmlContent += "</div>"
    document.getElementById("card-calendar-" + set).innerHTML = htmlContent;
}
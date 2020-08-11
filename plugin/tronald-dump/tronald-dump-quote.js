const getUrlRandomQuote = "https://api.tronalddump.io/random/quote"
const twitterEmbedUrl = "https://publish.twitter.com/oembed?url="
var quoteRequest = new XMLHttpRequest();
var embeddRequest = new XMLHttpRequest();

quoteRequest.open('GET', getUrlRandomQuote, true);
quoteRequest.setRequestHeader("Accept", "application/hal+json")
quoteRequest.send();

quoteRequest.onreadystatechange = processQuoteRequest;

function processQuoteRequest(e) {
    if (quoteRequest.readyState == 4 && quoteRequest.status == 200) {
        var response = JSON.parse(quoteRequest.responseText);
        getTweetEmbedder(response);
    }
}

function getTweetEmbedder(response) {
    var tweetUrl = response._embedded.source[0].url;
    embeddRequest.open('GET', twitterEmbedUrl + tweetUrl, true);
    embeddRequest.send();

    embeddRequest.onreadystatechange = processTweetEmbedderRequest;
}

function processTweetEmbedderRequest(e) {
    if (embeddRequest.readyState == 4 && embeddRequest.status == 200) {
        var embeddedTweet = JSON.parse(embeddRequest.responseText);
        processResponse(embeddedTweet);
    }
}

function processResponse(embeddedTweet) {
    console.log(embeddedTweet);
}
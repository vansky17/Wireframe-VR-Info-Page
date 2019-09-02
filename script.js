const apiKey = 'f8bf2ba3981049d5b63a26340c970e25';

const searchURL = 'https://newsapi.org/v2/everything';

let searchTerm = 'VR Virtual Reality';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}
/* Press News start here */
function displayResults(responseJson, maxResults) {
  console.log(responseJson);
  $('#results-list').empty();
  for (let i = 0; i < responseJson.articles.length & i<maxResults ; i++){
    $('#results-list').append(
      `<li><h3><a href="${responseJson.articles[i].url}" target="_blank">${responseJson.articles[i].title} </a></h3>
      <p>${responseJson.articles[i].source.name}</p>
      <p>By ${responseJson.articles[i].author}</p>
      <p>Date: ${responseJson.articles[i].publishedAt}</p>
      <p>${responseJson.articles[i].description}</p>
      <img src='${responseJson.articles[i].urlToImage}'>
      </li>`
    )};  
};

function getNews(query, maxResults=10) {
  const params = {
    qInTitle: query,
    sortBy:'publishedAt',
    language: "en",
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;
  console.log(url);
  const options = {
    headers: new Headers({
      "X-Api-Key": apiKey})
  };
  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, maxResults))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

/* Youtube videos start here */
const apiKeyYoutube = 'AIzaSyCGrSh8nORJAZJVTb_ICGZbKONEgTQSelY'; 
const searchURLYoutube = 'https://www.googleapis.com/youtube/v3/search';

function displayVideos(responseJson) {
  console.log(responseJson);
  $('#results-list-youtube').empty();
  for (let i = 0; i < responseJson.items.length; i++){
    $('#results-list-youtube').append(
      `<li><h3>${responseJson.items[i].snippet.title}</h3>
      <p>Date: ${responseJson.items[i].snippet.publishedAt}</p>
      <p>${responseJson.items[i].snippet.description}</p>
      <img src='${responseJson.items[i].snippet.thumbnails.high.url}'>
      <a href="https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}" target="_blank">Watch video </a>
      </li>`
    )};
};

function getYouTubeVideos(query, maxResults=10) {
  const params = {
    key: apiKeyYoutube,
    q: query,
    part: 'snippet',
    order:'date',
    safeSearch: 'strict',
    maxResults,
    type: 'video'
  };
  const queryString = formatQueryParams(params)
  const url = searchURLYoutube + '?' + queryString;
  console.log(url);
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayVideos(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

/* Tweets start here */
const API_KEY = 'yk3wp5Rm2Xa90PFrgDy3fvYwz'
const API_SECRET_KEY = 'DOks3iDYXBZ3SLuStt9iTxpy84k8WmdEomsTAqv6cEV1L2ZYJV'
const API_BASE_SEARCH_URL = 'https://cors-anywhere.herokuapp.com/https://api.twitter.com/1.1/search/tweets.json?count=25&q='
const API_TOKEN_URL = 'https://cors-anywhere.herokuapp.com/https://api.twitter.com/oauth2/token'


const base64Encoded = 'TlVnN3dmTGVOYXhYSmRQV3BFcUJBVGJReTpnVUsxR1gzcmtLMTdBeFh3WFBmTTRTQ3IzdlVBUGNlWGZBRUVhUVBVaElUVmJaSVFtUg=='

async function getAuthToken() {
  const authResponse = await fetch(API_TOKEN_URL, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      'Authorization': 'Basic ' + base64Encoded,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  })

  const authJSON = await authResponse.json();
  return authJSON;
}

async function fetchTweets(param) {
  const authJSON = await(getAuthToken())
  console.log(authJSON)
  const tweetResponse = await fetch(API_BASE_SEARCH_URL+param, {
        headers: {
          'Authorization': 'Bearer ' + authJSON.access_token
        }
      })
  console.log(tweetResponse);    
  const tweetJSON = await tweetResponse.json()
  handleTweetData(tweetJSON.statuses)
}

function handleTweetData(tweets) {
  $('#tweets').empty(); 
  console.log(tweets)
  for (let i = 0; i < tweets.length; i++){
    $('#tweets').append(
      `<li class="tweet">
          <a class="link-to" href="https://twitter.com/${tweets[i].user.id}/status/${tweets[i].id_str}" target="_blank">
            <div class="tweet-header">
              <img class="avatar" src="${tweets[i].user.profile_image_url_https}" alt="avatar">
              <div class="">
                        <span class="">${tweets[i].user.name}</span>
                        </span>
                        <span class="">@${tweets[i].user.screen_name}</span>
                    </div>
                <div class=""></div>
            </div>
            <p class="tweet-text">${tweets[i].text}</p>
            <div class="">${tweets[i].created_at}</div>
        </a>
    </li>`
    );
  }
}
/* Handel change topic */
function showVrTopic() {
  $("#topic-AR").on('click', function(){
    searchTerm = 'AR Augmented Reality';
    getNews(searchTerm, 10);
    getYouTubeVideos(searchTerm + "Technology", 10);
    fetchTweets(searchTerm); 
  });
}
function showArTopic() {
  $("#topic-VR").on('click', function(){
    searchTerm = 'VR Virtual Reality';
    getNews(searchTerm, 10);
    getYouTubeVideos(searchTerm + "Technology", 10); 
    fetchTweets(searchTerm); 
  });
}

function initApp() {   
  showVrTopic();
  showArTopic();
  const maxResults = 10;
  getNews(searchTerm, maxResults);
  getYouTubeVideos(searchTerm + "Technology", maxResults);
  fetchTweets(searchTerm); 
  }

$(initApp);
var Twit = require("twit");
var config = require("./config");

function Bot(room,callback){
    console.log("the bot is starting");
    let tweetsArray = [];
 //   const repl = require("repl");

    
    var T = new Twit(config);
    var tweet;

    var params = { 
        from: 'JavaScriptDaily',
        count: 1
    }
        
    T.get('search/tweets', params, gotData);

    function gotData(err, data, response) {
        var tweets = data.statuses;
        console.log("hello");
        for (var i = 0; i<tweets.length; i++){
            tweetsArray.push(urlify(tweets[i].text));
        }
        function urlify(text) {
            var urlRegex = /(https?:\/\/[^\s]+)/g;
            return text.replace(urlRegex, function(url) {
                return '<a href="' + url + '"' + ' target="'+'_blank"'+'>' + url + '</a>';
            });
        }
     //   console.log(tweetsArray);
        tweet = tweetsArray[0];
        callback(tweet);
    };
 //   console.log("tweet from bot: " + tweet);
    
}

module.exports = Bot;
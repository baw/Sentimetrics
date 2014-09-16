var https  = require("https");
var fs     = require("fs");
var domain = require("domain");
var async  = require("async");

var getYoutubeComments = function (url, file, comments) {
  var func = (function () {
    var total = 0;
    return {
      finished: function () {
        total -= 1;
        
        console.log("file: " + file);
        
        fs.writeFile(file, JSON.stringify(comments));
        
        console.log(file + " : " + comments.comments.length);
      },
      start: function () {
        total += 1;
      }
    };
  })();
  
  var finished = func.finished;
  var start = func.start;

  var makeRequest = function (url) {
    start();
    try {
      https.get(url, function (res) {
          var json = "";

          res.on("data", function (chunk) {
              json += chunk;
          });

          res.on("end", function () {
              var data = JSON.parse(json);
              
              if (data.feed.entry) {
                for (var i = 0; i < data.feed.entry.length; i++) {
                  comments.comments[comments.comments.length] = {
                    "username": data.feed.entry[i].author[0].name.$t,
                    "comment": data.feed.entry[i].content.$t,
                    "length": data.feed.entry[i].content.$t.length.toString(),
                    "publishedTime": data.feed.entry[i].published.$t,
                    "context": "youtube"
                  };
                }
              }
              
              var d = domain.create();
              d.on("error", function () {
                console.log("------------------------------------------------------------------------------");
                console.log("error");
                console.log(e);
                console.log(data.feed.link[3].href);
                console.log("------------------------------------------------------------------------------");
                
                getYoutubeComments(data.feed.link[3].href, file, comments);
              });
              if (data.feed.link[3] !== undefined) {
                console.log("url: " + data.feed.link[3].href);
                d.run(function () {
                  getYoutubeComments(data.feed.link[3].href, file, comments);
                });
              }
              
              finished();
          });
      });
    } catch (e) {
      console.log("error");
      console.log(e);
      getYoutubeComments(url);
    }
  };
  
  makeRequest(url);
};

async.parallel([
  function () {
    var comments = {
      "comments": []
    };
    
    getYoutubeComments("https://gdata.youtube.com/feeds/api/videos/hLQl3WQQoQ0/comments?orderby=published&alt=json&max-results=50", "adele_someone_like_you.txt", comments);
  },
  function () {
    var comments = {
      "comments": []
    };
    
    getYoutubeComments("https://gdata.youtube.com/feeds/api/videos/08DjMT-qR9g/comments?orderby=published&alt=json&max-results=50", "adele_chasing_payments.txt", comments);
  }
], function () {
  console.log("finished");
});
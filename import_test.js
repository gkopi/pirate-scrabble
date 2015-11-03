var request = require("request");

request({
	uri: "http://www.oed.com/srupage?operation=searchRetrieve&query=cql.serverChoice+=+forest&maximumRecords=100&startRecord=1",
}, function(error, response, body) {
  console.log(body);
});

#apa-client - a node.js Amazon product advertising API client

[![](https://secure.travis-ci.org/lbdremy/apa-node-client.png)](http://travis-ci.org/#!/lbdremy/apa-node-client)

##Install

```
npm install apa-client
```

##Features
- All operations with `Client#execute()`
- Switch the locale with `Client#swithLocale()`
- Handle gracefully errors from the XMLParser, http request and specific APA API errors by always passing an `Error` has first argument in the callback.

##Usage

```js
// Load dependency
var apa = require('apa-client');

// Create a client
var client = apa.createClient({
	"awsAccessKeyId" : "", // your aws access key id here
	"awsSecretKey" : "", // your secret key here
	"associateTag" : "" // your associate tag here
});

// Switch locale (default endpoint is ecs.amazonaws.com)
client.switchLocale('fr'); // new endpoint is ecs.amazonaws.fr

// Execute 'ItemSearch' operation with few arguments
client.execute('ItemSearch',{
			    SearchIndex : 'All',
			    Keywords : 'TV Plasma',
			    ResponseGroup : 'OfferFull,Images,ItemAttributes,SalesRank,EditorialReview',
			    Availability : 'Available'
			},function(err,data){
				if(err)  return console.error(err);
				console.log(JSON.stringify(data));
			});
```

##Test
Before running the tests create a file `config-private.json` containing your own credentials to create the client.

```js
npm test
```

##Licence
(The MIT License)
Copyright 2012 HipSnip Limited
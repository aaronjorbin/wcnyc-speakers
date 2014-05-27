// web.js
if( process.env.NEWRELICSTATUS && process.env.NEWRELICSTATUS == false) {
	console.log( 'New Relic started' )
	require('newrelic')
} else {
	console.log( 'New Relic Disabled' )
}
var express = require('express')
  , logfmt = require('logfmt')
  , path = require('path')
  , Resource = require('express-resource')
  , app = express()
  , seedvotes = require('./seedvotes')


seedvotes.on( 'loaded', function(){
	app.use( logfmt.requestLogger() )
	app.use( function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*")
		res.header("Access-Control-Allow-Headers", "X-Requested-With")
		next()
	})
	app.use( express.json() )
	app.use( express.urlencoded() )
	app.use( express.methodOverride() )
	app.use( app.router )
	app.use( express.static( path.join( __dirname , '..', 'public' ) ) )
	app.use( express.errorHandler( { dumpExceptions: true, showStack: true } ) )

	app.resource( 'votes', require( './votes') )
	app.resource( 'talks', require( './talks') )

	// 404
	app.use(function(req, res, next){
		res.send(404, 'Sorry cant find that!')
	})

	var port = Number(process.env.PORT || 5000)
	app.listen(port, function() {
		console.log("Listening on " + port)
	})
})
// Seed the votes.  This will trigger the start of our app
seedvotes.seed()

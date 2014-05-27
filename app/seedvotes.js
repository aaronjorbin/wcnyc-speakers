var _ = require( 'underscore'),
	fs = require( 'fs' ),
	crypto = require('crypto'),
	db = require( './db' ),
	events = require('events'),
	EventEmitter = events.EventEmitter,
	obj = new EventEmitter(),
	votes = db.votes,
	tsv = require( 'tsv'),
	Parser = require('tsv').Parser,
	csv = new Parser(",", { header: true }),
	data = fs.readFileSync( './data/data.tsv', 'utf8' ),
	seedVotes = tsv.parse( data )



obj.talks = {}

obj.allTalks = function( ){

		if ( _.isEmpty( this.talks ) ) {
			this.talks = _.map( seedVotes, function( seed ){
				seed.GUID = crypto.createHash('md5').update( seed.Timestamp + seed.Name + seed['Proposed Session Title'] ).digest( 'base64' )
				return seed
			})
		}

		return this.talks 
};

obj.seed = function( ){
	this.allTalks()
	this.emit('loaded')
}



module.exports = obj

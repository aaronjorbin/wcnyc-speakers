var talks = require('./seedvotes').allTalks(),
	_ = require( 'underscore'),
	db = require( './db' )

function calcScore( v, field ) {
	return _.reduce( v[field], function(mem, vote) {
		return mem + parseInt( vote[1], 10 )
	}, 0) / v[field].length 

}

// GET     /                 ->  index
// get a listing of all votes
exports.index = function( req, res ){
	var response = [],
		v,
		s = {}
	db.votes.find( function(err, votes){
		response = _.map( talks, function( talk ){
			v = _.findWhere( votes, { 'talk' : talk.GUID })	
			if ( v == null )
				return null
			s = {}
			s = _.clone( talk )

			s.local = calcScore( v, 'local' )
			s.originality = calcScore( v, 'originality' )
			s.philosophy = calcScore( v, 'philosophy' )

			s.score = s.local + s.originality + s.philosophy
			s.score = s.score.toPrecision(3)
			return s
		})
		

		res.send( 
			response.sort( function(a,b){
				if ( parseFloat( a.score ) > parseFloat( b.score ) )
					return -1
				if ( parseFloat( a.score ) < parseFloat( b.score ) )
					return 1
				return 0

			})
		)
	})

}

// POST    /                 ->  create
// vote
exports.create = function( req, res ){
	var talk,
		talkGUID,
		user,
		userName
	
	if ( Boolean( req.body.userName) !== false){
		userName = req.body.userName
		db.users.findOne({'name' : userName }, function( err, user ) {
			if ( Boolean( req.body.talkGUID) !== false){
				talkGUID = req.body.talkGUID
				db.votes.findOne({'talk' : talkGUID}, function( err, talk) {
					if ( talk && -1 !== _.indexOf( user.talks , talk.GUID ) )
						res.send( 'a' )
					if (! talk ) { 
						talk = new db.votes({ 
							talk: talkGUID,  
						})
					}

					talk.local.push( [ userName,  req.body.local ] )				
					talk.originality.push( [ userName,  req.body.originality ] )				
					talk.philosophy.push( [ userName,  req.body.philosophy ] )				
					
					talk.save(function(err,t){
						user.talks.push( talkGUID )
						user.save( function(err,u){
							res.send( t )
						})
					})
					//user.talks.push( talkGUID )
				}) // end find talk
			} else {
				res.send( 'v' )
			}

		}) // end find user
	} else {
		res.send( 'r' )
	}
	// add talk GUID to users votes array
	// add local  
	// add unique
	// add philophy
	// add user to talk

	// save talk
	// save user
	
}


/* unused */

// GET     /new              ->  new
exports.new = function( req, res ){
    res.send( 'n/a' )
}

// GET     /:id              ->  show
exports.show = function( req, res ){
    res.send( 'n/a' )
}

// GET     /:id/edit         ->  edit
exports.edit = function( req, res ){
    res.send( 'n/a' )
}

// PUT     /:id              ->  update
exports.update = function( req, res ){
    res.send( 'n/a' )
}

// DELETE  /:id              ->  destroy
exports.destroy = function( req, res ){
    res.send( 'n/a' )
}

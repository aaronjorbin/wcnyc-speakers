var talks = require('./seedvotes').allTalks(),
	_ = require( 'underscore'),
	db = require( './db' )

exports.index = function( req, res ){
	var username,
		newUser

	if ( typeof( req.query) !== 'undefined' && typeof( req.query.name) !== 'undefined')
		username = req.query.name
	
	db.users.findOne({'name' : username }, function( err, user ) {
		if (! user ){
			newUser = new db.users({ name: username })
			newUser.save( function(){
				console.log( 'new User: ' + username )
				res.send( talks )
			})

		} else {
			res.send( _.filter(talks, function( talk ){
				if ( -1 === _.indexOf( user.talks , talk.GUID ) )
					return true
				else
					return false
			})  // end filter
			)  // end send
		}
	})

}

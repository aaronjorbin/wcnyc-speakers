var mongoose = require( 'mongoose' ),
	crypto = require('crypto'),
	voteScheme = mongoose.Schema({
		"talk" : String,
		"local" : Array,
		"originality" : Array,
		"philosophy" : Array
	})
	userScheme = mongoose.Schema({
		"name" : String,
		"talks" : Array
	})

mongoose.connect( process.env.MONGOHQ_URL || process.env.MONGODB  )

votes = mongoose.model( 'votes', voteScheme )
users = mongoose.model( 'users', userScheme )

module.exports = {

	votes : votes,
	users : users

}

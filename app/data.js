var fs = require( 'fs' ),
	tsv = require( 'tsv'),
	Parser = require('tsv').Parser,
	csv = new Parser(",", { header: true }),
	data = fs.readFileSync( './data.tsv', 'utf8' ),
	votes = tsv.parse( data )

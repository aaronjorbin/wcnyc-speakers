var app = {
	people : ['Aaron', 'Andy', 'Dana', 'Eric', 'Kevin', 'Krista', 'Mikel', 'Rindy', 'Sonja', 'Steve'],
	selectTemplate : _.template( $('#selectTemplate').html() ),
	talkTemplate : _.template( $('#talkTemplate').html() ),
	rankingTemplate: _.template( $('#rankingTemplate').html() ),
	buildSelect : function(){
		var html = this.selectTemplate( { peeps: this.people });
		$('#main').html( html );
	},
	buildRanking : function(e){
		e.preventDefault();
		$.get('/votes', function(data){
			$('#main').html('');
			_.each( data, function(talk){
				console.log( talk );
				$('#main').append( app.rankingTemplate( { t: talk } ) )
			});
		});
	},
	buildTalks : function(name){
		var t = this.talkTemplate;
		if ( typeof( name ) === 'undefined' )
			name = $('#nameSelect').val()

		$('#main').on('click', '.talkSubmit', function(e){
			var form = $(this).parent(),
				guid = form.data('guid'),
				local = form.find('.local').val(),
				originality = form.find('.originiality').val(),
				philosophy = form.find('.philosophy').val(),
				data = {}

			data.userName = name;
			data.talkGUID = guid;
			data.local = local;
			data.originality = originality;
			data.philosophy = philosophy;

			$.post('/votes', data, function(a){
				console.log( a, data );
				form.parent().parent().css('display', 'none');
			});

			e.preventDefault();
		})
		$.get( '/talks?name=' + name, function(talks){
			$('#main').html('');
			_.each( _.shuffle( talks ), function( talk ){
				var html = t({ a: talk });
				$('#main').append( html );
			})
		})
	}


}
function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}
var n = getQueryVariable( 'name') ;
if (n  === false  )
	app.buildSelect();
else
	app.buildTalks( n );

$('#buildRanking').on('click', app.buildRanking);

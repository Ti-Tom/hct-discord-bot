const request = require("request");
var logger = require('winston');

const url = 'https://statsapi.web.nhl.com/api/v1/';

var main = function(command, options, fct) {
	logger.info(command+" - "+options)
	var query = '';
	switch(command) {
		case 'teams':
			query = 'teams';
			if(options !== ''){
				query += '/'+options;
			}
			break;
		case 'roster':
			query = 'teams/'+options+'/roster';
			break;
		case 'player':
		case 'people':
			query = 'people/'+options;
			break;
		default:
		case 'help':
			return;
			break;
	}

	if(query !== ''){
		var res =  request.get(url+query, (error, response, body) => {
			var results = [];
			let json = JSON.parse(body);
			switch(command) {
				case 'teams':
					if(options !== ''){
						query += '/'+options;
					}else{
						for(var t in json.teams) {
							results.push("- "+json.teams[t].teamName+' ('+json.teams[t].id+') at '+json.teams[t].locationName);
							if(options !== ''){
								// more options
							}
						}
					}
					break;
				case 'roster':
					for(var t in json.roster) {
						results.push("- "+json.roster[t].person.fullName+' ('+json.roster[t].person.id+') at '+json.roster[t].position.name+' / '+json.roster[t].position.type);
					}
					break;
				case 'player':
				case 'people':
					for(var t in json.people) {
						results.push(json.people[t].fullName+' ('+json.people[t].id+')');
						results.push('Birth: '+json.people[t].birthDate+' at '+json.people[t].birthCity);
						results.push('Nationality: '+json.people[t].nationality);
						results.push('Height: '+json.people[t].height+' / Weight: '+json.people[t].weight);
						results.push('Current team: '+json.people[t].currentTeam.name+' ('+json.people[t].currentTeam.id+')');
						results.push('Captain: '+(json.people[t].captain ? 'yes' : 'no')+' / Assist: '+(json.people[t].alternateCaptain ? 'yes' : 'no')+' / Rookie: '+(json.people[t].rookie ? 'yes' : 'no'));
						results.push('Primary Position: '+json.people[t].primaryPosition.name+' / '+json.people[t].primaryPosition.type);
					}
					break;
			}
			fct(results);
		});
	}
	return;
}

module.exports = main
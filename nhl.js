const request = require("request");

const url = 'https://statsapi.web.nhl.com/api/v1/';

var main = function(command, options, fct) {
	var results = [];
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
		case 'schedule':
			query = 'schedule';
			break;
		default:
		case 'help':
			results = [
				'!nhl <command>',
				' - teams: list all teams',
				' - teams <id team>: team informations',
				' - roster <id team>: team roster',
				' - people <id player>: people info (alias player)',
				' - schedule: list games of the day',
				' - help: display this message'
			];
			break;
	}

	if(query !== ''){
		var res =  request.get(url+query, (error, response, body) => {
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
				case 'schedule':
					if (json.totalGames) {
						for (var d in json.dates) {
							results.push('Game '+json.dates[d].date+':');
							for (var t in json.dates[d].games) {
								results.push('- '+json.dates[d].games[t].teams.home.team.name+' ('+json.dates[d].games[t].teams.home.team.id+') vs '+json.dates[d].games[t].teams.away.team.name+' ('+json.dates[d].games[t].teams.away.team.id+') at '+json.dates[d].games[t].venue.name+' - '+json.dates[d].games[t].gamePk);
							}
						}
					}else{
						results.push('No game today');
					}
					break;
				// https://statsapi.web.nhl.com/api/v1/game/2017030231/feed/live
			}
		});
	}
	fct(results);
	return;
}

module.exports = main

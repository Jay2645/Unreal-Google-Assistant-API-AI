var request = require('request');
var pubsub = require('@google-cloud/pubsub');
var ApiAiAssistant = require('actions-on-google').ApiAiAssistant;

var pubsubClient = pubsub({ projectId: 'compact-moment-166306' });
var topicName = 'unreal_google_assistant';

exports.webhook = function(req, res) {

  var respData = {
	'speech': 'This is default speech.',
	'displayText': 'This is default display text.',
	'data': {},
	'contextOut': [],
	'source': ''
  };

  var intent = req.body.result.metadata.intentName;
  console.log('intent = ' + intent);

  switch (intent) {
	/*case 'prime_pump_start':

	  var whichPump = req.body.result.parameters.which_pump;
	  console.log('whichPump = ' + whichPump);

	  createTopic(function(topic) {
		var pubData = { 'intent': 'prime_pump_start', 'which_pump': whichPump };
		publishMessage(topic, JSON.stringify(pubData), function() {
		  var s = 'Priming pump ' + whichPump + '.';
		  respData.speech = s;
		  respData.displayText = s;
		  res.json(respData);
		});
	  });

	  break;

	case 'prime_pump_end':

	  createTopic(function(topic) {

		var pubData = { 'intent': 'prime_pump_end' };

		publishMessage(topic, JSON.stringify(pubData), function() {

		  var s = 'Stopped priming pump.';
		  respData.speech = s;
		  respData.displayText = s;
		  res.json(respData);
		});
	  });

	  break;

	case 'make_drink':
	  var drink = req.body.result.parameters.drink;
	  console.log('drink = ' + drink);

	  createTopic(function(topic) {
		var pubData = { 'intent': 'make_drink', 'drink': drink };
		publishMessage(topic, JSON.stringify(pubData), function() {
		  var s = 'Coming right up. While I make your drink, would you like to hear the weather or your fortune?';
		  respData.speech = s;
		  respData.displayText = s;
		  res.json(respData);
		});
	  });
	  break;*/
	  
	case 'move_character':
		var moveDirection = req.body.result.parameters.move.direction;
		var moveSteps = req.body.result.parameters.move.steps;
		console.log('Moving '+moveSteps+' in the '+moveDirection + ' direction.');
		
		createTopic(function(topic) {
			var pubData = { 'intent': 'move_character', 'moveDirection':moveDirection, 'moveSteps':moveSteps};
			publishMessage(topic, JSON.stringify(pubData), function() {
				var s = 'Moving ' + moveSteps + ' steps ' + moveDirection + '!';
				respData.speech = s;
				respData.displayText = s;
				res.json(respData);
			});
		});
	
	default:
	  console.log('switch-case in default');
	  res.json(respData);
	  break;
  }
};

function createTopic(callback) {

  if (!callback) {
	console.log('no callback');
	return;
  }

  pubsubClient.createTopic(topicName, function(error, topic) {

	// topic already exists
	if (error && error.code === 409) {

	  console.log('topic created');

	  // callback(topic);
	  callback(pubsubClient.topic(topicName));
	  return;
	}

	if (error) {
	  console.log(error);
	  return;
	}

	callback(pubsubClient.topic(topicName));
  });
}

function publishMessage(topic, message, callback) {

  topic.publish(message, function(error) {

	if (error) {
	  console.log('Publish error:');
	  console.log(error);
	  return;
	}

	console.log('publish successful');

	if (callback) {
	  callback();
	}
  });
}
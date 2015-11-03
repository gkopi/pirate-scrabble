var Word = require("./Word.js");
var word = Word.word;

var LetterBag = require("./LetterBag.js");
var letter_bag = LetterBag.initialized_letter_bag;

var words = [];
var users = [];

var user = function (spec) {
	var that = {};

	that.get_name = function () {
		return spec.name;
	}

	return that;
}

var letter_bag_user = user({name: 'letter_bag'});

function flip_tile() {
	var new_tile = letter_bag.pop();
	var new_tile_word = word({value: new_tile, owner: letter_bag_user});
	words.push(new_tile_word);
	return new_tile;
}

function has_tiles() {
	return letter_bag.length > 0;
}

function get_words_by_username(username) {
	var users_words = [];
	for(var i = 0; i < words.length; i++) {
		if(words[i].get_owner().get_name() == username) {
			users_words.push(words[i].get_value());
		}
	}
	return users_words;
}

function get_open_letters() {
	return get_words_by_username('letter_bag');
}

function get_subwords(word, other_words) {
	var subwords = [];

	for (var i = 0; i < other_words.length; i++) {
		if(word.contains(other_words[i])) {
			subwords.push(other_words[i]);	
		}
	}

	return subwords;
}

function is_creatable(word_to_create) {
	//the only criterion for stealing a word so far is if it can be made out of other words.
	
	//initially we will manually construct a list of words shorter than it that it contains.
	var subwords = [];
	var word_to_create_value = word_to_create.get_value();
	for(var i = 0; i < words.length; i++) {
		var other_word = words[i];
		if(word_to_create_value.length > other_word.get_value().length) {
			if(word_to_create.contains(other_word)) {
				subwords.push(other_word);
			}
		}
	}

	if(subwords.length > 0) {
		var parts = [];
		//call recursive function
		if(find_parts(word_to_create, subwords, parts)) {
	/*		for(var i = 0; i < parts.length; i++) {
				console.log("part " + i + ": " + parts[i].get_value());
			}
	*/
			return parts;
		}
	}
	return false;
}

function is_word(word) {
	return true;
}

function steal_word(word) {
	if(is_word()) {
		var parts = is_creatable(word);
		if(parts) {
			remove_parts(parts);
			words.push(word);
			return "success";
		}
	}
	return false;
}

function remove_parts(parts) {
	function is_not_removed(word) {
		for(var i = 0; i < parts.length; i++) {
			if(word.is_equal(parts[i])) {
				parts.splice(i,1);
				return false;
			}
		}
		return true;
	}
	
	var filtered = words.filter(is_not_removed);
	words = filtered;
}

function find_parts(word, other_words, parts) {
	var subwords = get_subwords(word, other_words);
	for(var i = 0; i < subwords.length; i++) {
		var remainder = word.difference(subwords[i]);
		if(remainder.get_value().length == 0) {
			parts.push(subwords[i]);
			return true;
		}
		var new_other_words = subwords.slice(0);
		new_other_words.splice(i,1);
		if(find_parts(remainder,new_other_words, parts)) {
			parts.push(subwords[i]);
			return true;
		}
	}
	return false;
}


var test = function() {
	var u = user({name: 'gabe'});
	var u2 = user({name: 'ebag'});
	var w = word({value: 'hello', owner: u});
	var w2 = word({value: 'world', owner: u2});
	var w3 = word({value: 'word', owner: u});
	var w4 = word({value: 'w', owner: u2});
	var w5 = word({value: 'worlds', owner: u2});
	var w6 = word({value: 's', owner: u});
	var w7 = word({value: 'gabe', owner: u});
	var to_create = word({value:'hellogabeworlds'});
	//console.log("equality test: " + w2.is_equal(w3));

	words.push(w);
	words.push(w2);
	words.push(w3);
	words.push(w4);
	words.push(w6);
	words.push(w7);
	console.log("Current Words:***");
	for(var i = 0; i < words.length; i++) {
		console.log(words[i].get_value());
	}
	console.log(":***");

	console.log(to_create.get_value() + " is stealable: " + steal_word(to_create));
	console.log("Current Words:***");
	for(var i = 0; i < words.length; i++) {
		console.log(words[i].get_value());
	}
	console.log(":***");
}

module.exports = {
	create_user: function(username) {
		var u = user({name: username});
		users.push(u);
		return u;
	},
	steal_word: function(value, user) {
		var w = word({value: value, owner: user});
		if(steal_word(w)) {
			return true;
		}
		return false;
	},
	flip_tile: flip_tile,
	get_words_by_username: get_words_by_username,
	get_open_letters: get_open_letters,
	has_tiles: has_tiles

};

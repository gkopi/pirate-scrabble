var word = function (spec) { 
	var that = {};

	that.is_equal = function (other_word) {
		if(spec.value == other_word.get_value() && spec.owner.get_name() == other_word.get_owner().get_name()) {
			return true;
		}
		return false;
	}

	that.get_value = function () {
		return spec.value;
	}

	that.get_owner = function () {
		return spec.owner;
	}

	that.contains = function (other_word) {
		if(other_word.length >= spec.value.length) {
			return false;
		} else {
			var other_letter_collection = other_word.get_letter_collection();
			for (letter in other_letter_collection) {
				if(!spec.letter_collection[letter] || !(spec.letter_collection[letter] >= other_letter_collection[letter])) {
					return false;
				}
			}
			return true;	
		}
	}

	that.difference = function (other_word) {
		var diff = "";
		var other_letter_collection = other_word.get_letter_collection();
		for(letter in spec.letter_collection) {
			var num_diff;
			if(other_letter_collection[letter]) {
				num_diff = spec.letter_collection[letter] - other_letter_collection[letter];
			} else {
				num_diff = spec.letter_collection[letter];
			}
			for(var i = 0; i < num_diff; i++) {
				diff += letter;
			}
		}
		var remainder = word({value : diff})
		return remainder;
	}

	function generate_letter_collection (string) {
		var that = {};

		for(index in string) {
			var letter = string[index];
			if(that[letter]) {
				that[letter]++;
			} else {
				that[letter] = 1;
			}
		}

		return that;
	}

	spec.letter_collection = generate_letter_collection(spec.value);

	that.get_letter_collection = function () {
		return spec.letter_collection;
	}

	return that;		
}

module.exports = {
	word: word
};

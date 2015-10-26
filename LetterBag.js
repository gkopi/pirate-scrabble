function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

//helper functions
var letterBag = [];
function initializeLetterBag() {
	var letterDistribution = {"a" : 13, "b" : 3, "c" : 3, "d" : 6, "e" : 18, "f" : 3, "g" : 4, "h" : 3, "i" : 12, "j" : 2, "k" : 2, "l" : 5, "m" : 3, "n" : 8, "o" : 11, "p" : 3, "q" : 2, "r" : 9, "s" : 6, "t" : 9, "u" : 6, "v" : 3, "w" : 3, "x" : 2, "y" : 3, "z" : 2 };
	for(var letter in letterDistribution) {
		for(var i = 0; i < letterDistribution[letter]; i++) {
			letterBag.push(letter);
		}
	}
	shuffle(letterBag);
}

initializeLetterBag();

module.exports = {
	initialized_letter_bag: letterBag
};

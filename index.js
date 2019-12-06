const { breedFetcher, rl } = require('./breedFetcher.js');

rl.question("Enter name of cat to download info for: ", (catName) => {
  breedFetcher('https://api.thecatapi.com/v1/breeds/search?q=' + catName, './' + catName + '.json');
});

module.exports = rl;
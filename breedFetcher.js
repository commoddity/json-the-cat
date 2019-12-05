const request = require('request');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const pageFetcher = (url, dest) => {
  request(url, (error, response, body) => {
    if (error) {
      rl.close();
      console.log(error);
    }
    const parsed = JSON.parse(body);
    if (parsed[0] === undefined) {
      rl.close();
      console.log('Breed not found! Please enter a valid breed.');
      return;
    }
    console.log('Breed name: ' + parsed[0].name);
    console.log('Breed Description: ' + parsed[0].description);
    console.log('Status Code: ', response && response.statusCode);
    fs.access(dest, fs.F_OK, (err) => {
      if (err) {
        fs.writeFile(dest, JSON.stringify(parsed), (err) => {
          if (err) throw err;
          console.log(`Downloaded and saved to ${dest}`);
        });
        rl.close();
      } else if (!err) {
        rl.question(`${dest} already exists. Overwrite file? [Y/N] `, (answer) => {
          rl.close();
          if (answer === 'y' || answer.toLowerCase() === 'y') {
            fs.writeFile(dest, JSON.stringify(parsed), (err) => {
              if (err) throw err;
              console.log(`Downloaded and saved to ${dest}`);
            });
          } else  if (answer === 'n' || answer.toLowerCase() === 'n') {
            console.log("Data not saved to file.");
            rl.close();
          } else {
            console.log("Invalid input. Input must be [Y/N]");
          }
        });
      } else {
        rl.close();
      }
    });
  });
};

rl.question("Enter name of cat to download info for: ", (catName) => {
  pageFetcher('https://api.thecatapi.com/v1/breeds/search?q=' + catName, './' + catName + '.json');
});
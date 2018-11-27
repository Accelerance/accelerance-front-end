var request = require('request');
var fs = require('fs');
var colors = require('colors');
var prompts = require('prompts');

var init = async function() {
  let files = [
    { 
      title: 'Bare Minimum', 
      value: {
        id: '6487193955',
        source: 'bare-minimum.css'
      }
    },
    { 
      title: 'Master', 
      value: {
        id: '4724625226',
        source: 'master.css'
      }
    }
  ];

  let file = await prompts(
    {
      type: 'select',
      name: 'value',
      message: 'Pick a file',
      choices: files,
      initial: 0
    }
  );

  await fs.readFile('/Users/grantfoster/Documents/sites/accelerance/' + file.value.source, 'utf-8', function read(err, data) {
    if (err) {
      throw err;
    }
    let source = data;
    let options = {
      url: 'http://api.hubapi.com/content/api/v2/templates/' + file.value.id,
      qs: {
        "hapikey": "46d02796-2406-40e6-8ac0-7d4027ab09ae"
      },
      headers: {
        'User-Agent': 'request',
      },
      json: true,
      body: {
        "source": source,
      }
    };
    request.put(options, function (error, response, body) {
      if (error) {
        console.log('error:', error);
      }
      console.log((response && response.statusCode).toString().green);
      let date = new Date(body.updated);
      // Hours part from the timestamp
      let hours = date.getHours();
      let minutes = "0" + date.getMinutes();
      let seconds = "0" + date.getSeconds();
      let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
      console.log(colors.italic('Updated:' + formattedTime.toString()));
    });
  });
};

init();
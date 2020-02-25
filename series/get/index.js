const { google } = require(`googleapis`);

// constants
const credentials = require(`./credentials.json`);
const key = require(`./key.json`);
const sheetId = `1-qc9YqO7ZJ8dFxHQK6CacmntchjnvwlNuMLvcow6UEQ`;

exports.seriesGet = (req, res) => {
  // allow CORS
  res.set(`Access-Control-Allow-Origin`, `*`);
  res.set(`Access-Control-Allow-Methods`, `GET`);
  // create auth client
  const jwt = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    [`https://www.googleapis.com/auth/spreadsheets`]
  );

  // instanciate spreadsheet client
  const sheetService = google.sheets({ version: `v4` });
  // read sheet columns
  sheetService.spreadsheets.values
    .get({
      spreadsheetId: sheetId,
      range: `raw!A3:F100`,
      auth: jwt,
      key: key.apiKey
    })
    // handle response
    .then(response => {
      // parse objects
      const players = response.data.values.map(value => ({
        player: value[0],
        total: parseInt(value[1], 10),
        wins: parseInt(value[2], 10),
        ties: parseInt(value[3], 10),
        looses: parseInt(value[4], 10),
        win_rate: parseInt(value[5], 10)
      }));
      // send JSON object array
      return res.send(players);
    })
    // catch errors
    .catch(res.send);
};

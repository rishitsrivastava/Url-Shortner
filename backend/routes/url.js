const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const shortid = require('shortid');
const { URL } = require("../db");
const { authMiddleware } = require("../middleware")

const app = express();
const Port = 3001;
app.use(cors());

app.use(bodyParser.json());

app.use(authMiddleware);

const urlDatabase = {};

app.post('/shorten', async (req, res) => {
  console.log(req.user);
  try {
    const { longurl } = req.body;

    if (!longurl) {
      return res.status(400).json({ error: 'Long URL is required' });
    }
  
    const prev = await URL.find({
      longurl: longurl,
      userId: req.user.userId
    })
    console.log(prev);

    if(prev.length !== 0) {
      return res.json({ shorturl: prev[0].shorturl });
    }

    const shortId = shortid.generate();

    urlDatabase[shortId] = longurl;

    const shorturl = `http://localhost:${Port}/${shortId}`;

    const object = {
      longurl: longurl,
      shorturl:  shorturl,
      shortID: shortId,
      numberOfClicks: 0,
      userId: req.user.userId
    }

    const user = await URL.create(object)

    res.json({ shorturl });
  }

  catch(error) {
    console.log(error)
    res.status(500).json({
      error: "Internal Server Error"
    })
  }
});


app.get('/:shortId', async (req, res) => {
  const { shortId } = req.params;
  const longUrl = urlDatabase[shortId];

  if (!longUrl) {
    return res.status(404).json({ error: 'Short URL not found' });
  }

  const url = await URL.findOne({shortID: shortId})

  await URL.findOneAndUpdate(
    {shortID: shortId}, {numberOfClicks: url.numberOfClicks + 1}
  )

  res.redirect(longUrl);
});


// Start the server
app.listen(Port, () => {
  console.log(`Server is running on http://localhost:${Port}`);
});

module.exports = app;

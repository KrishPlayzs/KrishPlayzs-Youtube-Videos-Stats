require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// basic health check
app.get('/', (req, res) => {
  res.send('YouTube Stats Backend Running');
});

// OAuth login URL
app.get('/auth', (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/yt-analytics.readonly'
    ]
  });

  res.redirect(url);
});

// OAuth callback
app.get('/auth/callback', async (req, res) => {
  const code = req.query.code;

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  res.json({ message: 'Login successful', tokens });
});

// placeholder stats route
app.get('/video-stats', async (req, res) => {
  res.json({
    message: 'Stats endpoint ready',
    note: 'Next step: connect YouTube Data + Analytics API'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
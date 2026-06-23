require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

let oauthTokens = null;

const youtube = google.youtube({ version: 'v3', auth: process.env.YOUTUBE_API_KEY });

function getAuthClient() {
  if (oauthTokens) {
    oauth2Client.setCredentials(oauthTokens);
  }
  return oauth2Client;
}

app.get('/', (req, res) => {
  res.send('YouTube Stats Backend Running');
});

// Public video stats
app.get('/api/video', async (req, res) => {
  try {
    const videoId = req.query.id;
    if (!videoId) return res.status(400).json({ error: 'Missing video id' });

    const response = await youtube.videos.list({
      part: 'snippet,statistics,contentDetails',
      id: videoId
    });

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// OAuth start
app.get('/auth', (req, res) => {
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
  try {
    const code = req.query.code;
    const { tokens } = await oauth2Client.getToken(code);

    oauthTokens = tokens;
    oauth2Client.setCredentials(tokens);

    res.json({ success: true, message: 'Logged in successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// FULL analytics endpoint
app.get('/api/analytics', async (req, res) => {
  try {
    const auth = getAuthClient();

    if (!oauthTokens) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const youtubeAnalytics = google.youtubeAnalytics({
      version: 'v2',
      auth
    });

    const response = await youtubeAnalytics.reports.query({
      ids: 'channel==MINE',
      startDate: '2024-01-01',
      endDate: '2026-12-31',
      metrics: 'views,estimatedMinutesWatched,averageViewDuration,likes,comments,shares,subscribersGained,subscribersLost'
    });

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/dashboard', async (req, res) => {
  res.json({
    status: 'fully upgraded',
    message: 'Analytics + video stats ready'
  });
});

app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
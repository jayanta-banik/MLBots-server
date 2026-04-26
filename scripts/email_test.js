import dotenv from 'dotenv';
import express from 'express';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';

dotenv.config({ path: '../node_backend/.env' });

const app = express();
app.use(express.json());

const PORT = process.env.NODE_PORT || 4006;

const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);

// Temporary in-memory storage for demo.
// In production, store refresh_token in DB or encrypted secret storage.
let savedTokens = null;

// Step 1: start Google OAuth
app.get('/auth/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // needed for refresh token
    prompt: 'consent', // helps ensure refresh token on first run
    scope: ['https://mail.google.com/'],
  });

  res.redirect(url);
});

// Step 2: Google redirects back here
app.get('/auth/google/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) return res.status(400).send('Missing authorization code');

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  savedTokens = tokens;

  res.send(`
      <h2>Google OAuth success</h2>
      <pre>${JSON.stringify(tokens, null, 2)}</pre>
      <p>You can now POST to /send-email</p>
    `);
});

// Send email to yourself
app.post('/send-email', async (req, res) => {
  if (!savedTokens?.refresh_token && !savedTokens?.access_token) {
    return res.status(401).json({
      ok: false,
      error: 'Authorize first at /auth/google',
    });
  }

  oauth2Client.setCredentials(savedTokens);

  const accessTokenResponse = await oauth2Client.getAccessToken();
  const accessToken = accessTokenResponse?.token;

  if (!accessToken) {
    return res.status(500).json({
      ok: false,
      error: 'Could not get access token',
    });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.GMAIL_USER,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: savedTokens.refresh_token,
      accessToken,
    },
  });

  const info = await transporter.sendMail({
    from: `"My Express App" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    subject: 'OAuth2 test email',
    text: 'Hello from Express ESM with Gmail OAuth2.',
    html: '<p>Hello from <b>Express ESM</b> with Gmail OAuth2.</p>',
  });

  res.json({
    ok: true,
    messageId: info.messageId,
    response: info.response,
  });
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
  console.log(`Open http://localhost:${PORT}/auth/google`);
});

console.log('before listen');

const server = app.listen(4000, '0.0.0.0', () => {
  console.log('Listening on http://0.0.0.0:4000');
});

console.log('after listen, server.listening =', server.listening);

server.on('error', (err) => {
  console.error('server error:', err);
});

server.on('close', () => {
  console.log('server closed');
});

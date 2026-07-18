require('dotenv').config();
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

async function test() {
  try {
    const { token } = await oauth2Client.getAccessToken();
    console.log("Success! Token:", token);
  } catch (e) {
    console.error("Error:", e.response?.data || e.message);
  }
}

test();

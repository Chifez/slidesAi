import { google } from 'googleapis';
import { getToken } from 'next-auth/jwt';

export async function GET(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log('token1', token);
  if (!token) {
    console.log('token2', token);
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }
  console.log('here1');
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: token.accessToken });
  console.log('here2');
  const gmail = google.gmail({ version: 'v1', auth });
  const response = await gmail.users.messages.list({
    userId: 'me',
    maxResults: req.nextUrl.searchParams.get('maxResults') || 10,
  });
  console.log('here3', response);
  const messages = await Promise.all(
    response.data.messages.map(async (message) => {
      const msg = await gmail.users.messages.get({
        userId: 'me',
        id: message.id,
      });

      const title =
        msg.data.payload.headers.find((header) => header.name === 'Subject')
          ?.value || 'No title';
      let body = 'No body';
      if (msg.data.payload.parts) {
        const part = msg.data.payload.parts.find(
          (part) => part.mimeType === 'text/plain'
        );
        body = part
          ? Buffer.from(part.body.data, 'base64').toString()
          : 'No body';
      } else {
        body = msg.data.payload.body.data
          ? Buffer.from(msg.data.payload.body.data, 'base64').toString()
          : 'No body';
      }
      const labels = msg.data.labelIds || [];

      return {
        title,
        body,
        labels,
      };
    })
  );

  return new Response(JSON.stringify(messages), { status: 200 });
}

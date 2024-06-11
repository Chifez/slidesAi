import { OpenAI } from 'openai';

export async function POST(req) {
  try {
    const { openAIKey, emails } = await req.json();

    if (!openAIKey || !emails || !Array.isArray(emails)) {
      return new Response(JSON.stringify({ error: 'Invalid input data' }), {
        status: 400,
      });
    }

    const openai = new OpenAI({ apiKey: openAIKey });

    // Create a prompt that includes all emails
    const prompt = `Classify the following emails into one of the categories: Important, Social, Promotional, Spam. 
    You are to return an array of objects in this form:
    [
      {
        "title": "email title",
        "body": "email body",
        "class": "category"
      }
    ]

    Emails:
    ${emails
      .map((email) => `Title: ${email.title}\nBody: ${email.body}`)
      .join('\n\n')}
    
    Return the classifications in the specified JSON format.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      prompt: prompt,
      max_tokens: 1500,
    });

    const classifications = JSON.parse(response.data.choices[0].text.trim());

    return new Response(JSON.stringify(classifications), { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

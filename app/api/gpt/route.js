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

    const messages = [
      {
        role: 'system',
        content:
          'You are a helpful assistant that classifies emails into categories: Important, Social, Promotional, Spam.',
      },
      {
        role: 'user',
        content: `Classify the following email titles into one of the categories: Important, Social, Promotional, Spam. 
        Return an array of objects in this form:
        [
          {
            "title": "email title",
            "class": "category"
          }
        ]

        Emails:
        ${emails.map((email) => `Title: ${email.title}`).join('\n')}
        
        Return the classifications in the specified JSON format.`,
      },
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 1500,
    });

    if (!response || !response.choices || !response.choices.length) {
      console.log('response', response);
      throw new Error('Invalid response from OpenAI');
    }

    const classifications = JSON.parse(
      response.choices[0].message.content
        .replace('```json', '')
        .replace('```', '')
        .trim()
    );
    console.log('response', classifications);
    // Add the email body to each classified email
    const result = classifications.map((classifiedEmail) => {
      const email = emails.find((e) => e.title === classifiedEmail.title);
      return {
        title: classifiedEmail.title,
        body: email.body,
        classification: classifiedEmail.class,
      };
    });

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

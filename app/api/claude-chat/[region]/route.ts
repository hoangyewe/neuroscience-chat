
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY 
});

export async function POST(req: Request) {
  const { messages, difficulty } = await req.json();
  const systemMessage = `You are tasked with responding to a ${difficulty} level query.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemMessage },
        ...messages
      ],
      temperature: 0.7,
    });

    // Handle the API response
    const completion = response.choices[0].message.content;

    return new Response(JSON.stringify({ completion }), { status: 200 });
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate completion' }), { status: 500 });
  }
}

import openai from '@/openai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { todos } = await request.json();
  console.log(todos);

  //    OpenAi GPT communication
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    temperature: 0.8,
    // n= 1 respone back
    n: 1,
    stream: false,
    messages: [
      {
        role: 'system',
        content: `When responding, welcome the user alway as Mr.Ala !
        Limit the response to 200 characters`,
      },
      {
        role: 'user',
        content: `Hi there, provide a summary of the following todos, Count how many todos are in each category such as To do, in progress and done, then tell the user to have a productive day! Here's the data ${JSON.stringify(
          todos
        )}`,
      },
    ],
  });

  // const { data } = response;

  // console.log('DATA IS: ', data);
  // console.log(data.choices[0].message);
  // return NextResponse.json(data.choices[0].messages);

  console.log('response', response);

  // console.log(chatCompletion.choices[0].message);
}

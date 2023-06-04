// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai';

interface Idea {
  name: string,
  description: string,
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// OpenAI APIを利用してアプリアイディアを生成
const generateAppIdea = async (message: string) => {
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: message }
      ]
    });

    // 応答を取得
    const res = completion.data.choices[0].message?.content;

    // 応答がundefinedの場合はエラーをスロー
    if(typeof res === 'undefined') {
      throw new Error('No content received')
    }

    return res;
  } catch (error: any) {
    throw new Error(`Error generating app idea: ${error.message}`)
  }
}

// 送信するメッセージを生成
const generateMessage = (keywords: string[]): string => {
  return `
    The output should be a markdown code snippet formatted in the following schema in Japanese:
    \`\`\`json
    [
      {
        name: string, // name of the app idea.
        description: string // description of the app idea.
      },
      {
        name: string, // name of the app idea.
        description: string // description of the app idea.
      },
    ]
    \`\`\`
    NOTES:
    * Do not include app ideas that do not exist.Do not include an existing app name.
    * Please do not include anything other than JSON in your answer.
    
    次のキーワードをいくつか組み合わせたアプリのアイディアを5つ考えてください。${keywords.join(', ')}
  `
}

// 応答をパースしてアイディアの配列を返す
const parseGPTResponse = (gptResponse: string): Idea[] => {
  const regex = /```json([\s\S]*?)```/gm
  const match = regex.exec(gptResponse)

  if (match === null || match?.[1] === null) {
    throw new Error("JSON content not found in the string")
  }

  try {
    const jsonData: Idea[] = JSON.parse(match[1])
    return jsonData;
  } catch (error: any) {
    throw new Error(`Error parsing JSON: ${error.message}`);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const { keywords } = req.body;

  if(keywords.length <= 0) {
    res.status(400).json({ error: "キーワードを指定してください。" });
    return;
  }

  try {
    const result = await generateAppIdea(generateMessage(keywords));
    res.status(200).json(parseGPTResponse(result));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

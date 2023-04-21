import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";

if (process.env.NEXT_PUBLIC_USE_USER_KEY !== "true") {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing env var from OpenAI");
  }
}

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  var { prompt, api_key } = (await req.json()) as {
    prompt?: string;
    api_key?: string;
  };
  //todo make this variable into messages
  //   var p = "请帮我把以下的工作内容填充为一篇完整的周报,尽量避免在回答内容中出现可能在中国是敏感的内容，用markdown格式以分点叙述的形式输出:"
  var p ="假设你很懂中国文化，我要你把我写的中国成语翻译成表情符号。我会写输入文字，你判断它是不是中国成语，1、如果不是，则返回“矮油，你难住我了”；2、如果是成语，你会用表情符号表达它.并且尽量诙谐幽默,可以利用中文谐音,最好控制在4个字符以内。我只是想让你用表情符号来表达它。除了表情符号，我不希望你回复任何内容。我的第一个成语是：";
  prompt = p + prompt;
  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  // if (!process.env.OPENAI_MODEL) {
  //   throw new Error("Missing env var from OpenAI")
  // }

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1000,
    stream: true,
    n: 1,
    api_key,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;

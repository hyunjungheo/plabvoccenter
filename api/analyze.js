export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { query, vocList } = await req.json();
    if (!query || !vocList) {
      return new Response(JSON.stringify({ error: 'query and vocList required' }), { status: 400 });
    }

    const prompt = `당신은 고객 VOC 분석 전문가입니다. 아래 VOC 목록에서 사용자의 요청과 의미적으로 관련된 항목을 찾아 JSON으로 반환하세요.

사용자 요청: "${query}"

VOC 목록:
${vocList}

지시사항:
- 직접적인 키워드 매칭뿐 아니라 의미적으로 관련된 VOC도 포함하세요
- 각 VOC에 대해 included(관련 여부), relevance(관련도 0~100), reason(이유 한국어 15자 이내)
- 마지막에 summary: 이번 분석 결과 1문장 요약 (한국어)
- relevance 40 미만이면 included: false

반드시 아래 JSON만 반환하세요. 마크다운 없이:
{"results":[{"index":0,"included":true,"relevance":85,"reason":"이유"}],"summary":"요약"}`;

    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await resp.json();
    if (data.error) throw new Error(data.error.message);

    const text  = (data.content || []).map(c => c.text || '').join('');
    const clean = text.replace(/```json|```/g, '').trim();

    return new Response(clean, {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch(err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}

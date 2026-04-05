export const config = { runtime: 'edge' };

export default async function handler(req) {
  const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: CORS });
  }

  try {
    const SHEET_ID   = process.env.SHEET_ID;
    const SHEET_NAME = process.env.SHEET_NAME || 'Sheet1';
    const SA_EMAIL   = process.env.GCP_SA_EMAIL;
    // 환경변수 줄바꿈 복원: \\n 리터럴, \n 리터럴, 실제 줄바꿈 모두 처리
    const SA_KEY = process.env.GCP_SA_KEY
      .replace(/\\\\n/g, '\n')
      .replace(/\\n/g, '\n')
      .trim();

    // 1. 서비스 계정으로 Google OAuth 토큰 발급 (JWT → access_token)
    const now   = Math.floor(Date.now() / 1000);
    const claim = {
      iss: SA_EMAIL,
      scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    };

    // JWT 서명 (RS256) — Web Crypto API 사용
    const header  = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
    const payload = btoa(JSON.stringify(claim)).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
    const toSign  = `${header}.${payload}`;

    // PEM → CryptoKey (헤더/푸터/공백 모두 제거)
    const pemBody = SA_KEY
      .replace(/-----BEGIN PRIVATE KEY-----/g, '')
      .replace(/-----END PRIVATE KEY-----/g, '')
      .replace(/\s+/g, '');  // 모든 공백·줄바꿈 제거
    const derBuf  = Uint8Array.from(atob(pemBody), c => c.charCodeAt(0));
    const cryptoKey = await crypto.subtle.importKey(
      'pkcs8', derBuf,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false, ['sign']
    );
    const sigBuf  = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, new TextEncoder().encode(toSign));
    const sig     = btoa(String.fromCharCode(...new Uint8Array(sigBuf))).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
    const jwt     = `${toSign}.${sig}`;

    // 2. access_token 교환
    const tokenRes  = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error('토큰 발급 실패: ' + JSON.stringify(tokenData));

    // 3. Sheets API로 데이터 읽기
    const range    = encodeURIComponent(SHEET_NAME);
    const sheetsRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}`,
      { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
    );
    const sheetsData = await sheetsRes.json();
    if (sheetsData.error) throw new Error(sheetsData.error.message);

    const rows = (sheetsData.values || []).slice(1); // 헤더 제외

    return new Response(JSON.stringify({ rows }), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });

  } catch(err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
}

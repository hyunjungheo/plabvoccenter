export const config = { runtime: 'edge' };

export default function handler(req) {
  const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

  // Firebase Config를 환경변수에서 읽어 프론트에 전달
  // (Firebase API Key는 공개 식별자이므로 프론트 전달 자체는 안전)
  const cfg = {
    apiKey:            process.env.FIREBASE_API_KEY,
    authDomain:        process.env.FIREBASE_AUTH_DOMAIN,
    projectId:         process.env.FIREBASE_PROJECT_ID,
    storageBucket:     process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId:             process.env.FIREBASE_APP_ID,
  };

  const missing = Object.entries(cfg).filter(([,v]) => !v).map(([k]) => k);
  if (missing.length) {
    return new Response(
      JSON.stringify({ error: `환경변수 누락: ${missing.join(', ')}` }),
      { status: 500, headers: CORS }
    );
  }

  return new Response(JSON.stringify(cfg), { headers: CORS });
}

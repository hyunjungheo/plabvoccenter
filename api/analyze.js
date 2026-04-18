export const config = { runtime: 'edge' };

// ════════════════════════════════════════════════════
// 티켓별 키워드 매핑 (Apps Script TICKET_KEYWORDS 이식)
// ════════════════════════════════════════════════════
const TICKET_KEYWORDS = {
  '121': { name: 'AI리포트 오류', keywords: ['ai리포트','ai 리포트','리포트 구매','하이라이트 구매','404','리포트 오류','리포트가 안','리포트 안열','리포트 열리','분석 지연','분석중이라고','다른사람이 나','다른 사람이 나','리포트에 오류','리포트 재생','리포트 다운'] },
  '168': { name: '카카오 로그인 불가', keywords: ['카카오 로그인','카카오로 로그인','카카오톡 로그인','client-side exception','client side exception','application error','카카오 계정 로그인','카카오로 회원가입','카카오 계정으로 로그인','로그인이 안됩니다','로그인이 안돼요','로그인이 안되요','로그인 오류','로그인 에러','로그인 안됨'] },
  '187': { name: '지각 알리기 불가', keywords: ['지각 알리기','지각알리기','지각 알리미','지각알리미','지각 알리기가 안','지각 알림 버튼','지각 버튼'] },
  '126': { name: '밸런스 문제', keywords: ['밸런스','팀밸런스','팀 밸런스','레벨 차이','실력 차이','2단계','일방적','팀원들 태도','몸 안 풀','열심히 안 뛰','열심히 뛰지 않','수비 안하','개인플레이','안 뛰는','걸으면서','걷고 있'] },
  '130': { name: '지각/불참', keywords: ['지각','늦','불참','무단','안왔','안 왔','안옴','단체지각','늦게 오','오지 않','분이 없어','인원 부족','30분 늦','40분 늦','분 늦'] },
  '129': { name: '비매너 유저', keywords: ['비매너','욕설','반말','거칠','위험하게','난폭','폭력','싸우','시비','몸싸움','과열','다치','발밟','밀고','욕하','욕을','큰소리','눈살','분위기 망치','비신사','매너가 없'] },
  '124': { name: '단체 참가자', keywords: ['지인들끼리','친구들끼리','같이 온','함께 온','작당','한 팀이 다 같이'] },
  '108': { name: '매니저 교육', keywords: ['매니저님때문에','매니저가 문제','매니저 때문','최악의 매니저','매니저 실망','매니저 짜증','매니저 무관심','매니저 불친절','매니저 없어서','매니저 통화','매니저 흡연','매니저 카톡'] },
  '110': { name: '매니저 역할 미수행', keywords: ['매니저 서있','매니저 안뛰','매니저 대충','매니저 가만','매니저 열심히 안','매니저 물','뛰지도 않고 서있','어슬렁','대충대충 경기','가만히 서있'] },
  '218': { name: 'POM 선정', keywords: ['pom','POM','피오엠'] },
  '132': { name: 'AI 팀 배정', keywords: ['평균등급','ai 팀','AI 팀','등급 낮','등급을 낮','등급이 아마'] },
  '125': { name: '매너 시스템 개선', keywords: ['옐로카드 철회','옐로카드 이의','옐로카드 억울','레드카드 억울','신고 부당','신고가 이상','신고를 잘못','부당한 신고','매너카드 취소','매너포인트 이의','옐로카드 받았는데','억울하게 신고','신고 남용'] },
  '127': { name: '스카우터 시스템 개선', keywords: ['스카우터','레벨을 내리','레벨 떨어뜨리','등급을 내리','등급 떨어뜨','마음대로 레벨','부당하게 레벨','레벨을 떨어','등급을 떨어'] },
  '196': { name: '레벨 업데이트 미진행', keywords: ['레벨 업데이트가 안','레벨 변화없','등급 변화없','레벨이 안 바뀌','등급이 안 바뀌','레벨 업데이트 안됨','경기해도 레벨','몇달째 레벨'] },
  '35':  { name: '카드/기타 결제 수단', keywords: ['카드결제','카드 결제','신용카드','신용 카드','카드로 결제','카드로 충전','카드 충전','다른 결제','결제수단'] },
  '105': { name: '슈퍼서브 오결제', keywords: ['슈퍼서브인줄','슈퍼서브 인줄','슈퍼서브로 신청했는데 포인트','슈퍼서브 결제','슈퍼서브 캐시','슈퍼서브인데 돈','슈퍼서브 페이지에서 결제'] },
  '134': { name: '환불 수수료 오표기', keywords: ['수수료가 다르','수수료 표기','무료취소인데 차감','무료취소라고 했는데','환불 규정이 다르','환불 수수료 이상'] },
  '31':  { name: '매치 변경 요청', keywords: ['매치 변경','시간대 변경','매치를 바꾸','경기를 바꾸','다른 매치로 이동','같은 구장 다른 시간','매치 이동','신청한 매치 변경'] },
  '73':  { name: '슈퍼서브 확대', keywords: ['슈퍼서브 언제','슈퍼서브가 없','슈퍼서브 안 뜨','슈퍼서브 확대','슈퍼서브 많이'] },
  '248': { name: '현장 취소 추가 보상', keywords: ['현장 취소','구장에 갔는데 취소','가서 취소','도착했는데 취소','가봤더니 취소','헛걸음'] },
  '193': { name: '매니저 앱 오류', keywords: ['매니저앱이','매니저 앱이','매니저어플이','매니저 어플이','앱이 안열','어플이 안열','화면이 안떠','화면이 안 떠','출발체크 오류','팀배정이 안','팀 배정이 안','진행하기 누르','매치 진행하기','앱 먹통','어플 먹통'] },
  '265': { name: '매니저 프리 미반영', keywords: ['매니저프리 신청','매니저 프리 신청','매니저프리로 신청','프리 신청이 안','프리가 신청이 안','프리 미반영','매니저프리 명단','프리 명단에','매니저러브 신청','매니저 프리가 안','프리로 신청했는데 명단'] },
  '188': { name: '매니저 지원 과정 오류', keywords: ['전자계약서','계약서 서명','계약서 작성','지원서 작성','매니저 지원 후','매니저 시험 합격','채용이 안','계약서가 안','지원 버튼','다음 절차','계약서 불러오기','온라인 실습'] },
  '155': { name: '매니저 계정 연동 불가', keywords: ['매니저 계정 연동','매니저계정 연동','플랩 계정 연동','연동이 안됩니','연동이 안되','연동 실패','플랩 아이디 연동','아이디가 달라','계정이 달라'] },
  '264': { name: 'AI 팀 배정 오류', keywords: ['ai 팀배정이 안','ai팀배정이 안','ai팀배정 오류','ai 배정이 안','자동 ai팀 배정','팀배정자체가 안','ai 팀 배정이 안','팀배정이 안되','배정이 안되어있'] },
  '203': { name: '매니저 평점/리뷰 시스템', keywords: ['매니저 리뷰','매니저 평점','리뷰 삭제','리뷰 수정','허위 리뷰','억울한 리뷰','아쉬워요 삭제','리뷰 철회','부당한 리뷰','리뷰가 잘못','악의적인 리뷰','평점 시스템','평점이 변화','리뷰 정정'] },
  '209': { name: '취소 보상 조건 완화', keywords: ['취소 보상','취소보상','양도 보상','매니저 취소 보상','보상 조건','취소됐는데 보상','취소 쿠폰','취소 캐시 보상'] },
  '164': { name: '앱 오류 일반', keywords: ['앱 오류로 인해','앱 오류 때문','어플 오류로 인해','시스템 오류로','앱 자체 오류','앱에서 오류'] },
  '15':  { name: '매니저 활동명 사용', keywords: ['매니저 닉네임','활동명 변경','닉네임 변경','실명 대신','활동명으로','매니저 이름 변경'] },
  '266': { name: '양도 종류 확대', keywords: ['양도 종류','긴급양도 확대','빠른양도','양도 선택지','양도 제도','양도 방식 개선'] },
  '267': { name: '양도 매치 표시', keywords: ['양도 목록','양도 매치 표시','양도 구장 필터','특정 구장 양도','양도 표시 방식'] },
  '263': { name: '구장 직접 취소 관리', keywords: ['구장에서 취소','구장주가 취소','대관 취소','소셜매치 타임에 대관','구장 직접 취소','구장측 취소'] },
  '424': { name: '용품 관리', keywords: ['fyf','런드리','조끼가 없','조끼가 부족','조끼 상태','조끼 분실','조끼 훼손','공이 없','공 상태가','공이 낡','공이 찢','매치공','장비가 없','장비 분실','장비 훼손','장비 상태'] },
  '523': { name: '구장/시설 문제', keywords: ['잔디','인조잔디','천연잔디','조명','불빛','어둡','배수','물빠짐','물고임','침수','샤워실','탈의실','락커룸','라커룸','화장실','골대','골망','펜스','주차','주차장','바닥 상태','라인','마킹'] },
};

// 우선순위 (앞이 높음 — Apps Script priority 배열 이식)
const PRIORITY = [
  '218','121','264','187','168','193','265','188','155','203','209',
  '110','130','124','126','132','108','129','105','134','35','125',
  '127','196','31','73','248','15','266','267','263','164','424','523'
];

// 앱 오류 컨텍스트 키워드 (있으면 130/424 스킵)
const APP_ERROR_CONTEXT = [
  '매니저앱','매니저 앱','매니저어플','매니저 어플',
  '앱 오류','앱오류','어플 오류','어플오류',
  '앱이 안','앱 안','어플이 안','어플 안',
  '화면이 안','화면 전환','로그인이 안','접속이 안',
  '렉이','먹통','안 들어가','안들어가',
  '매치리포트 작성','리포트 작성이 안','레벨 입력이 안',
  '매니저 시험','전자계약서','지원 과정','지원서',
  '계정 연동','연동이 안','연동이 되지','연동 불가',
  '플랩 계정과','플랩풋볼 계정'
];

// 시설 키워드 (523 사전 분류용 — 용품 키워드 있으면 무시)
const EQUIPMENT_KEYWORDS = ['fyf','런드리','조끼 없','공이 없','공 상태','매치공','볼이','비브스','유니폼'];
const FACILITY_KEYWORDS  = ['잔디','인조잔디','천연잔디','조명','불빛','어둡','배수','물빠짐','물고임','침수','샤워실','탈의실','락커룸','라커룸','화장실','골대','골망','펜스','주차','주차장','바닥 상태','라인','마킹'];

// ── 헬퍼
function hasAppErrorCtx(msg) {
  const lo = msg.toLowerCase();
  return APP_ERROR_CONTEXT.some(k => lo.includes(k));
}
function hasFacility(msg) {
  const lo = msg.toLowerCase();
  if (EQUIPMENT_KEYWORDS.some(k => lo.includes(k))) return false;
  return FACILITY_KEYWORDS.some(k => lo.includes(k));
}
function isMatchReviewPath(path) {
  return (path || '').includes('매치 리뷰');
}

// ── 키워드 사전 분류 (1단계)
function classifyByKeywords(message, inboundedPath) {
  const lo     = message.toLowerCase();
  const appCtx = hasAppErrorCtx(message);
  const skipInApp = new Set(['130','424']);

  for (const ticketId of PRIORITY) {
    if (appCtx && skipInApp.has(ticketId)) continue;
    const ticket = TICKET_KEYWORDS[ticketId];
    if (!ticket) continue;
    for (const kw of ticket.keywords) {
      if (lo.includes(kw.toLowerCase())) {
        return { ticket_id: ticketId, name: ticket.name, confidence: 0.90, reason: `keyword: ${kw}` };
      }
    }
  }
  return null;
}

// ── few-shot examples (Apps Script FEW_SHOT_EXAMPLES 이식)
const FEW_SHOT = `<examples>
<example>message:"비매너 인원으로 인해 매치가 좋지 못했습니다. 환불 부탁드립니다." path:"매치 리뷰" → ticket_id:"129"(비매너 유저, 원인이 비매너이므로)</example>
<example>message:"블루팀 단체지각으로 인해 매치 진행이 상당히 지연되었습니다." path:"매치 리뷰" → ticket_id:"130"(지각/불참)</example>
<example>message:"팀 밸런스가 좀 아쉽긴했지만 그래도 재밌게 찼습니다." path:"매치 리뷰" → ticket_id:"126"(밸런스)</example>
<example>message:"너무 과열됐고 다치는 사람들도 있었습니다." path:"매치 리뷰" → ticket_id:"129"(비매너/과열)</example>
<example>message:"잔디가 너무 미끄럽습니다" path:"" → ticket_id:"523"(시설)</example>
<example>message:"매니저 칭찬 많이 많이 해주세요" path:"매치 리뷰" → ticket_id:""(긍정 리뷰, 이슈 없음)</example>
<example>message:"매니저앱이 전반적으로 먹통이네요. 공과조끼모두 회수했습니다" path:"" → ticket_id:"193"(매니저앱 오류, 조끼 언급은 부수적)</example>
<example>message:"AI리포트 구매했는데 404 에러가 뜨면서 안 들어가요" path:"참가자 문의" → ticket_id:"121"(AI리포트 오류)</example>
<example>message:"카카오 로그인하면 Application error 뜨면서 로그인이 안돼요" path:"참가자 문의" → ticket_id:"168"(카카오 로그인)</example>
<example>message:"지인들끼리 온 것 같은데 상대팀에게 무례하고 비매너로 게임하네요." path:"매치 리뷰" → ticket_id:"124"(단체 참가자, 비매너의 원인)</example>
<example>message:"스카우터라는 사람들이 자기 마음에 안들면 레벨을 떨어뜨려요" path:"참가자 문의" → ticket_id:"127"(스카우터)</example>
<example>message:"슈퍼서브로 신청했는데 포인트가 빠져나갔어요" path:"참가자 문의" → ticket_id:"105"(슈퍼서브 오결제)</example>
</examples>`;

const DOMAIN = `[플랩풋볼 용어]
- 슈퍼서브/매니저프리: 무료로 빈자리 참여 혜택
- 매니저: 매치 운영자
- 플래버: 서비스 이용자
- POM: Plaber of the Match (매너 좋은 플래버 선정)
- 옐로/레드카드: 비매너 누적 카드
- 런드리/FYF: 구장 비치 조끼·공
- 스카우터: 타 참가자 레벨 입력 권한 보유자`;

// ════════════════════════════════════════════════════
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
    const body = await req.json();

    // ── 모드: 티켓명 관련도 분석 (새 방식)
    if (body.mode === 'ticket') {
      const { query, ticketList } = body;

      const prompt = `당신은 플랩풋볼 VOC 담당자입니다.

${DOMAIN}

${FEW_SHOT}

사용자 검색어: "${query}"

아래 티켓 목록에서 검색어와 의미적으로 관련 있는 항목을 판단하세요.
티켓명 옆 괄호는 해당 티켓이 다루는 내용 설명입니다.

티켓 목록:
${ticketList}

[판단 규칙]
- relevance 0~100
- 95~100: 검색어 키워드·핵심 의미가 티켓명·설명에 직접 포함
- 80~94: 같은 기능·주제 영역으로 명확히 관련
- 60~79: 간접적 관련 가능성
- 60 미만: 무관 → included: false
- reason: 10자 이내 한국어

[반드시 지켜야 할 구분 규칙]
1. 기능 요청 vs 오류 신고를 명확히 구분:
   - 검색어가 "X 방법", "X 기능", "X 추가", "X 탐색"이면 → 기능 요청 티켓만 선택
   - 검색어가 "오류", "안됨", "튕김", "버그"이면 → 오류 티켓만 선택
   - 예: "지도 기반 매치 확인 방법" → 지도/위치 기능 요청 티켓 ✓, 앱 오류 티켓 ✗
2. 단어 일부만 겹쳐도 주제가 다르면 반드시 false:
   - "매치 확인" ≠ "매치 신청 오류" (기능 사용 vs 기술 오류)
   - "지도 기반" ≠ "앱 오류" (위치 기능 vs 앱 기술 문제)
3. 검색어의 핵심 주제를 먼저 파악한 후 티켓 선택

JSON만 반환:
{"tickets":[{"index":0,"included":true,"relevance":95,"reason":"직접 언급"}]}`;

      const resp = await callClaude(prompt, 2000);
      return new Response(resp, {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // ── 모드: VOC message 직접 분석 (기존 fallback)
    const { query, vocList } = body;
    if (!query || !vocList) {
      return new Response(JSON.stringify({ error: 'query and vocList required' }), { status: 400 });
    }

    // ── 1단계: 키워드 사전 분류 (API 호출 전)
    const lines   = vocList.split('\n').filter(l => l.trim());
    const results = [];
    const needAI  = [];

    for (const line of lines) {
      // "[idx] ticket_id:xxx | date:... | path:... | message:..." 파싱
      const idxMatch  = line.match(/^\[(\d+)\]/);
      const pathMatch = line.match(/path:([^|]*)/);
      const msgMatch  = line.match(/message:(.*)/s);
      if (!idxMatch || !msgMatch) continue;

      const idx     = parseInt(idxMatch[1]);
      const path    = (pathMatch?.[1] || '').trim();
      const message = msgMatch[1].trim();

      // 키워드 분류 시도
      const kwResult = classifyByKeywords(message, path);
      if (kwResult) {
        // 검색어와 키워드 분류 티켓이 관련 있는지 확인
        // (검색어가 해당 티켓 카테고리를 찾는 것인지)
        results.push({ index: idx, included: true, relevance: 88, reason: kwResult.reason.replace('keyword: ','') });
      } else if (hasFacility(message) && !isMatchReviewPath(path)) {
        results.push({ index: idx, included: true, relevance: 85, reason: '시설 키워드' });
      } else {
        needAI.push({ idx, line });
      }
    }

    // ── 2단계: 키워드 미매칭 항목만 AI로 분류
    let aiSummary = '';
    if (needAI.length > 0) {
      const aiVocList = needAI.map(n => n.line).join('\n');

      const prompt = `당신은 플랩풋볼 VOC 분류 담당자입니다.

${DOMAIN}

${FEW_SHOT}

사용자 요청: "${query}"

VOC 목록:
${aiVocList}

[판단 규칙]
1. VOC 본문을 직접 읽고 판단. 추측 금지.
2. relevance 기준:
   - 95~100: 요청 키워드가 VOC 본문에 직접 등장
   - 75~94: 요청 주제와 명확히 관련된 상황 묘사
   - 50~74: 간접 관련 가능성
   - 50 미만: 무관
3. relevance >= 60 → included: true, 미만 → false
4. 본문에 관련 내용 전혀 없으면 relevance 10 이하, included: false
5. reason: VOC 본문 근거로 15자 이내. included:false면 "무관"만.
6. 매치 리뷰 경로의 이슈: 비매너→129, 지각→130, 밸런스→126, 매니저불만→108
7. summary: included:true 건수와 핵심 1문장. 0건이면 "없음"

JSON만 반환:
{"results":[{"index":0,"included":true,"relevance":92,"reason":"이유"}],"summary":"요약"}`;

      const raw = await callClaude(prompt, 2000);
      try {
        const parsed = JSON.parse(raw);
        if (parsed.summary) aiSummary = parsed.summary;
        for (const item of (parsed.results || [])) {
          if (item.included && item.relevance >= 60) {
            results.push({ index: item.index, included: true, relevance: item.relevance, reason: item.reason });
          }
        }
      } catch(e) { /* 파싱 실패 시 스킵 */ }
    }

    const output = JSON.stringify({ results, summary: aiSummary });
    return new Response(output, {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });

  } catch(err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}

async function callClaude(prompt, maxTokens) {
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await resp.json();
  if (data.error) throw new Error(data.error.message);
  return (data.content||[]).map(c=>c.text||'').join('').replace(/```json|```/g,'').trim();
}

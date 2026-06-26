import { useState, useRef, useEffect } from "react";

const P = {
  pri: "#6C5CE7", priL: "#EEEDFE", red: "#E24B4A", redL: "#FCEBEB",
  grn: "#1D9E75", grnL: "#E1F5EE", ylw: "#EF9F27", ylwL: "#FAEEDA",
  blu: "#378ADD", bluL: "#E6F1FB", pnk: "#D4537E", pnkL: "#FBEAF0",
  crl: "#D85A30", pur: "#7F77DD",
  g1: "#F8F8F8", g2: "#EEE", g3: "#DDD", g4: "#999", g5: "#666", g6: "#444", g7: "#222", bdr: "#E8E8E8"
};

function Av({ n, s = 32, c = P.pri, on }) {
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div style={{ width: s, height: s, borderRadius: "50%", background: c + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: s * 0.32, fontWeight: 600, color: c }}>{n?.slice(0, 2)}</div>
      {on !== undefined && <div style={{ position: "absolute", bottom: 0, right: 0, width: s * 0.26, height: s * 0.26, borderRadius: "50%", background: on ? P.grn : P.g3, border: "2px solid #fff" }} />}
    </div>
  );
}

function Bg({ t, c, bg }) {
  return <span style={{ display: "inline-block", fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 5, background: bg, color: c, marginRight: 3 }}>{t}</span>;
}

function BarFill({ v, c = P.pri, h = 5 }) {
  return (
    <div style={{ height: h, background: P.g2, borderRadius: h / 2, overflow: "hidden", flex: 1 }}>
      <div style={{ height: "100%", width: Math.min(v, 100) + "%", background: c, borderRadius: h / 2 }} />
    </div>
  );
}

function Lk() {
  return <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="7" rx="1.5" fill={P.grn} /><path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke={P.grn} strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>;
}

function VoteArrow({ dir, active, onClick }) {
  const color = active ? (dir === "up" ? P.red : P.blu) : P.g4;
  return (
    <button onClick={onClick} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, fontSize: 16, color, lineHeight: 1 }}>
      {dir === "up" ? "▲" : "▼"}
    </button>
  );
}

const BOARDS = [
  { id: 1, name: "롯데자이언츠", fan: "KBO", league: "챌린저", rank: 4, bv: 986, coin: 2.87, cd: 8.2, dau: 8900, best: 17, mem: 32100, color: P.blu, live: true, liveN: 127, sub: true, recent: true, type: "official" },
  { id: 2, name: "ARMY", fan: "BTS", league: "챌린저", rank: 1, bv: 1342, coin: 3.42, cd: 12.3, dau: 12340, best: 23, mem: 45200, color: P.pur, live: true, liveN: 89, sub: true, recent: true, type: "official" },
  { id: 3, name: "BLINK", fan: "BLACKPINK", league: "마스터", rank: 8, bv: 612, coin: 1.83, cd: -18.4, dau: 4210, best: 6, mem: 28100, color: P.pnk, live: false, liveN: 0, sub: false, recent: false, type: "official" },
  { id: 4, name: "귀멸의 칼날", fan: "애니", league: "다이아", rank: 22, bv: 487, coin: 1.52, cd: 8.1, dau: 6200, best: 14, mem: 22300, color: P.red, live: true, liveN: 234, sub: true, recent: true, type: "official" },
  { id: 5, name: "원피스", fan: "애니", league: "다이아", rank: 25, bv: 445, coin: 1.41, cd: 3.2, dau: 5800, best: 12, mem: 19800, color: P.crl, live: false, liveN: 0, sub: false, recent: true, type: "official" },
  { id: 6, name: "STAY", fan: "Stray Kids", league: "챌린저", rank: 3, bv: 1105, coin: 2.98, cd: 5.7, dau: 9800, best: 19, mem: 38500, color: P.crl, live: false, liveN: 0, sub: false, recent: false, type: "official" },
  { id: 7, name: "크리에이터 J", fan: "크리에이터", league: "다이아", rank: 18, bv: 523, coin: 1.61, cd: 15.4, dau: 3200, best: 8, mem: 8900, color: P.ylw, live: true, liveN: 45, sub: true, recent: true, type: "satellite" },
  { id: 8, name: "KT Wiz", fan: "KBO", league: "챌린저", rank: 5, bv: 934, coin: 2.74, cd: -2.1, dau: 7800, best: 15, mem: 28700, color: "#E3000F", live: false, liveN: 0, sub: false, recent: false, type: "official" },
  { id: 9, name: "크리에이터 K", fan: "크리에이터", league: "다이아", rank: 21, bv: 498, coin: 1.55, cd: 22.8, dau: 2800, best: 6, mem: 6200, color: P.pnk, live: true, liveN: 38, sub: true, recent: true, type: "satellite" },
];

const ALL_POSTS = [
  { id: 1, board: "롯데자이언츠", boardColor: P.blu, author: "직관러_사직", lv: 34, title: "전의리 역전 3점 홈런!! 사직 들끓는다", body: "5회말 전의리 풀카운트에서 좌중간 3점 홈런. 사직 관중 미쳤다...", likes: 456, cmt: 89, time: "방금", best: true, type: "highlight", voted: 0 },
  { id: 50, board: "롯데자이언츠", boardColor: P.blu, author: "📰 KBO뉴스봇", isBot: true, botType: "rss", title: "[속보] 전의리, 5회말 역전 3점 홈런... 시즌 12호", body: "스포츠조선 · 12분 전", likes: 34, cmt: 8, time: "12분 전", rssSource: "스포츠조선", trending: "전의리 역전 3점 홈런" },
  { id: 51, board: "롯데자이언츠", boardColor: P.blu, author: "📊 스코어봇", isBot: true, botType: "score", title: "🔴 실시간 스코어 | 롯데 5 - 3 삼성 (7회초)", body: "전의리 5이닝 7K 1실점 · 나주환 불펜 대기", likes: 67, cmt: 23, time: "LIVE", rssSource: "KBO 공식" },
  { id: 52, board: "ARMY", boardColor: P.pur, author: "📰 K-pop뉴스봇", isBot: true, botType: "rss", title: "BTS 신보 트랙리스트 공개... 타이틀곡 힌트", body: "빌보드코리아 · 1시간 전", likes: 89, cmt: 12, time: "1시간 전", rssSource: "빌보드코리아", trending: "BTS 컴백 D-7" },
  { id: 53, board: "원피스", boardColor: P.crl, author: "📰 애니뉴스봇", isBot: true, botType: "rss", title: "ufotable 무한성 편, 극장판 수준 작화 화제", body: "애니타임즈 · 2시간 전", likes: 45, cmt: 15, time: "2시간 전", rssSource: "애니타임즈", trending: "귀멸의 칼날 무한성 편" },
  { id: 2, board: "ARMY", boardColor: P.pur, author: "bangtan_scholar", lv: 62, title: "Running Wild 브릿지 분석 - Butter와의 유사성", body: "프리코러스에서 사용된 신스 패드가 Butter의 브릿지와 같은 Cmaj7 보이싱을 공유합니다", likes: 312, cmt: 67, time: "2시간", best: true, type: "normal", voted: 0 },
  { id: 3, board: "귀멸의 칼날", boardColor: P.red, author: "귀멸_마스터", lv: 44, title: "4기 무한성 편 작화 역대급 분석", body: "ufotable의 이번 시즌 작화 퀄리티가 극장판 수준을 넘었다는 근거 5가지", likes: 287, cmt: 56, time: "3시간", best: true, type: "normal", voted: 0 },
  { id: 4, board: "롯데자이언츠", boardColor: P.blu, author: "부산갈매기_01", lv: 28, title: "[투표] 오늘 승리 예상 스코어는?", body: "", likes: 45, cmt: 112, time: "2시간", best: false, type: "poll", opts: ["5:3 롯데승", "3:2 롯데승", "삼성승"], votes: [234, 189, 87], voted: 0 },
  { id: 5, board: "ARMY", boardColor: P.pur, author: "purple_rain_07", lv: 28, title: "오늘 팬사인회 후기 (사진多)", body: "코엑스 팬사인회 다녀왔습니다 지민이 진짜 실물 미쳤어요...", likes: 234, cmt: 67, time: "32분", best: true, type: "normal", voted: 0 },
  { id: 6, board: "롯데자이언츠", boardColor: P.blu, author: "사직의별", lv: 51, title: "나주환 시즌 구종 분석 - 슬라이더 피안타율 .187", body: "올시즌 나주환의 슬라이더는 작년 대비 회전수가 200rpm 증가했고...", likes: 189, cmt: 45, time: "5시간", best: true, type: "normal", voted: 0 },
  { id: 7, board: "원피스", boardColor: P.crl, author: "해적왕_루피", lv: 37, title: "1120화 떡밥 정리 - 이무의 정체", body: "이무가 보여준 능력이 오페오페 열매의 상위호환이라는 근거가...", likes: 167, cmt: 78, time: "4시간", best: false, type: "normal", voted: 0 },
  { id: 8, board: "크리에이터 J", boardColor: P.ylw, author: "크리에이터J", lv: 42, title: "오늘의 직캠 편집 비하인드 🎬", body: "이번 직캠은 4K 3대 멀티앵글로 찍었는데 편집이 진짜 힘들었다...", likes: 312, cmt: 56, time: "1시간", best: true, type: "normal", voted: 0 },
  { id: 9, board: "크리에이터 J", boardColor: P.ylw, author: "크리에이터J", lv: 42, title: "[구독자 한정] 다음 주 콘텐츠 미리보기", body: "다음 주에 준비 중인 특별 콘텐츠를 구독자 여러분께 먼저 공유합니다", likes: 189, cmt: 34, time: "3시간", best: false, type: "normal", voted: 0 },
  { id: 10, board: "크리에이터 K", boardColor: P.pnk, author: "크리에이터K", lv: 38, title: "오늘의 일러스트 타임랩스 🎨", body: "3시간 작업을 2분으로 압축! 디지털 일러스트 풀과정 공개합니다", likes: 278, cmt: 42, time: "2시간", best: true, type: "normal", voted: 0 },
  { id: 11, board: "크리에이터 K", boardColor: P.pnk, author: "크리에이터K", lv: 38, title: "크리에이터 J와 콜라보 후기 💕", body: "J님과 콜라보 캐스트 너무 재밌었어요! 다음엔 팬미팅도 같이 할 예정", likes: 345, cmt: 67, time: "1시간", best: true, type: "normal", voted: 0 },
  { id: 12, board: "크리에이터 K", boardColor: P.pnk, author: "K_팬아트러", lv: 22, title: "크리에이터K 팬아트 그려봤습니다", body: "아이패드로 3시간 작업... 마음에 드실지 모르겠네요", likes: 156, cmt: 28, time: "5시간", best: false, type: "normal", voted: 0 },
];

const THOUGHTS = [
  { id: 1, text: "나주환 ERA 2.31 기대", tags: ["KBO", "롯데"], pub: true, likes: 12, src: "mine" },
  { id: 10, text: "나주환 슬라이더 분석", tags: ["KBO", "투수분석"], pub: false, likes: 0, src: "insight", insightType: "대화", participants: ["안드로메다성운의 세타"], summary: "슬라이더 회전수 증가가 좌타자 상대 피안타율 .187 개선과 연결" },
  { id: 2, text: "전의리 역전 3점 홈런!!", tags: ["KBO", "롯데"], pub: true, likes: 89, src: "mine" },
  { id: 3, text: "BTS Running Wild 브릿지 좋다", tags: ["K-pop", "BTS"], pub: true, likes: 28, src: "mine" },
  { id: 4, text: "나주환 슬라이더 회전수 200rpm 증가 분석", tags: ["KBO", "투수분석"], pub: true, likes: 189, src: "community", from: "사직의별", board: "롯데자이언츠" },
  { id: 5, text: "ufotable 3D 카메라워크 극장판 수준 분석", tags: ["애니", "작화분석"], pub: true, likes: 156, src: "thought", from: "귀멸_마스터" },
  { id: 6, text: "입중계 하이라이트 - 전의리 역전 홈런 클립", tags: ["KBO", "롯데"], pub: true, likes: 456, src: "broadcast", from: "직관러_사직", viewers: 314 },
  { id: 7, text: "Running Wild 안무 2절이 ON과 거울상", tags: ["K-pop", "안무"], pub: true, likes: 203, src: "thought", from: "댄스커버_유나" },
  { id: 8, text: "오늘 직관 치킨이 맛있었다 ㅋㅋ", tags: ["일상"], pub: false, likes: 0, src: "mine" },
];

const SUB_FEED = [
  { id: 101, kind: "thought", author: "사직의별", lv: 51, av: "사직", ac: P.blu, text: "나주환 올시즌 슬라이더 회전수가 작년 대비 200rpm 증가. 좌타자 상대 피안타율 .187로 리그 최고 수준.", tags: ["KBO", "투수분석"], likes: 89, cmt: 23, time: "12분 전" },
  { id: 102, kind: "planet", board: "ARMY", bc: P.pur, author: "purple_rain_07", lv: 28, title: "오늘 팬사인회 후기 - 지민이 실물 미쳤어요", body: "코엑스 팬사인회 다녀왔습니다. 대기줄 2시간...", likes: 234, cmt: 67, time: "32분 전" },
  { id: 103, kind: "thought", author: "귀멸_마스터", lv: 44, av: "귀멸", ac: P.red, text: "무한성 편 작화 분석 3탄. ufotable이 이번에 사용한 3D 카메라워크가 극장판 수준을 넘었다.", tags: ["애니", "작화분석"], likes: 156, cmt: 34, time: "1시간 전" },
  { id: 104, kind: "planet", board: "롯데자이언츠", bc: P.blu, author: "부산갈매기_01", lv: 28, title: "[투표] 올시즌 MVP 예상은?", body: "", likes: 67, cmt: 145, time: "2시간 전" },
  { id: 105, kind: "thought", author: "댄스커버_유나", lv: 31, av: "유나", ac: P.pnk, text: "Running Wild 안무 2절 포인트 동작이 ON 안무랑 거울상이라는 거 발견!", tags: ["K-pop", "안무"], likes: 203, cmt: 45, time: "2시간 전" },
  { id: 106, kind: "planet", board: "귀멸의 칼날", bc: P.red, author: "탄지로_fan", lv: 19, title: "무한성 편 OST 리스트 정리 (스포 주의)", body: "1화 전투씬 BGM이 극장판 무한열차 편의 리믹스 버전인데...", likes: 134, cmt: 56, time: "3시간 전" },
  { id: 107, kind: "highlight", author: "직관러_사직", lv: 34, av: "직관", ac: P.blu, board: "롯데자이언츠", bc: P.blu, title: "입중계 하이라이트 - 전의리 역전 3점 홈런", body: "시청자 314명 · 도네이션 127큐빗", likes: 456, cmt: 89, time: "방금", viewers: 314 },
  { id: 108, kind: "thought", author: "롯데매니아", lv: 19, av: "롯데", ac: P.blu, text: "오늘 직관 비 맞으면서 봤는데 롯데 이겨서 기분 최고 ㅋㅋ 치킨 맛있었다", tags: ["KBO", "일상"], likes: 45, cmt: 12, time: "3시간 전" },
  { id: 109, kind: "planet", board: "ARMY", bc: P.pur, author: "아미_뉴비", lv: 5, title: "[퀴즈] 이 뮤비 몇 초 장면일까요?", body: "힌트: Dynamite 뮤비에서 나온 장면입니다", likes: 45, cmt: 88, time: "4시간 전" },
  { id: 110, kind: "thought", author: "해적왕_루피", lv: 37, av: "루피", ac: P.crl, text: "원피스 1120화 이무의 능력이 오페오페 열매 상위호환이라는 근거 정리.", tags: ["애니", "원피스"], likes: 167, cmt: 78, time: "4시간 전", thread: 3 },
  { id: 111, kind: "planet", board: "크리에이터 J", bc: P.ylw, author: "크리에이터J", lv: 42, title: "오늘의 직캠 편집 비하인드 🎬", body: "4K 3대 멀티앵글 편집기... 구독자분들 기대해주세요!", likes: 312, cmt: 56, time: "1시간 전", isSatellite: true },
  { id: 112, kind: "highlight", author: "크리에이터J", lv: 42, av: "CrJ", ac: P.ylw, board: "크리에이터 J", bc: P.ylw, title: "크리에이터 J 캐스트 하이라이트", body: "시청자 45명 · 도네이션 89큐빗", likes: 234, cmt: 45, time: "2시간 전", viewers: 45 },
  { id: 113, kind: "planet", board: "크리에이터 K", bc: P.pnk, author: "크리에이터K", lv: 38, title: "오늘의 일러스트 타임랩스 🎨", body: "3시간 작업을 2분으로! 디지털 일러스트 풀과정", likes: 278, cmt: 42, time: "2시간 전", isSatellite: true },
  { id: 114, kind: "highlight", author: "크리에이터K", lv: 38, av: "CrK", ac: P.pnk, board: "크리에이터 K", bc: P.pnk, title: "J×K 콜라보 콜라보 캐스트 하이라이트 🔥", body: "시청자 83명 · 역대 최고 동접!", likes: 456, cmt: 89, time: "방금", viewers: 83 },
  { id: 116, kind: "remind_chain", author: "부산갈매기_01", lv: 28, av: "부산", ac: P.blu, comment: "이거 진짜 대박... 전의리 올시즌 최고", chain: [{ name: "사직의별", text: "이 분석 진짜 정확하다" }, { name: "직관러_사직", text: "나주환 시즌 구종 분석" }], origBoard: "롯데자이언츠", origBc: P.blu, likes: 34, cmt: 5, time: "1시간 전" },
  { id: 115, kind: "remind", author: "사직의별", lv: 51, av: "사직", ac: P.blu, comment: "이 분석 진짜 정확하다. 나주환 슬라이더 올시즌 최고.", origAuthor: "직관러_사직", origText: "나주환 시즌 구종 분석 - 슬라이더 피안타율 .187", origBoard: "롯데자이언츠", origBc: P.blu, likes: 89, cmt: 12, time: "30분 전" },
];

const CHATS = [
  { id: 1, name: "직관러_단톡방", av: "직관", c: P.blu, last: "야 치킨 사왔다", time: "방금", unread: 3, on: true, isGroup: true, mem: 4, isPublic: false },
  { id: 2, name: "롯데 응원방 🔴", av: "롯데", c: P.red, last: "나주환 삼진 ㅋㅋ", time: "LIVE", unread: 47, on: null, isGroup: true, mem: 127, isPublic: true },
  { id: 3, name: "직관러의 입중계", av: "입중", c: P.ylw, last: "6시 20분 캐스트!", time: "12분", unread: 8, on: null, isGroup: true, mem: 89, isPublic: true, isMyCom: true },
  { id: 4, name: "방탄소년단_forever", av: "방탄", c: P.pur, last: "내일 팬사인회 갈래?", time: "1시간", unread: 0, on: true, isGroup: false, mem: 0, isPublic: false },
];

const LIVES = [
  { id: 6, user: "크리에이터J", title: "J × K 콜라보 라이브 🎬🎨", viewers: 83, coins: 156, tags: ["콜라보", "직캠", "일러스트"], emo: "🎬", c1: P.ylw, c2: P.pnk, reason: "구독 크리에이터 콜라보", boardId: 7, collab: { user: "크리에이터K", emo: "🎨", boardId: 9 } },
  { id: 7, user: "크리에이터K", title: "일러스트 타임랩스 라이브 🎨", viewers: 38, coins: 67, tags: ["크리에이터", "일러스트", "드로잉"], emo: "🎨", c1: P.pnk, c2: P.pur, reason: "구독 크리에이터 새틀릿", boardId: 9 },
  { id: 1, user: "직관러_사직", title: "롯데 vs 삼성 사직 입중계", viewers: 314, coins: 127, tags: ["KBO", "롯데"], emo: "😆", c1: P.blu, c2: P.pnk, reason: "KBO 마인드맵 기반 추천", boardId: 1 },
  { id: 2, user: "댄스커버_유나", title: "BTS 'Running Wild' 커버 댄스", viewers: 89, coins: 34, tags: ["BTS", "댄스"], emo: "💃", c1: P.pur, c2: P.pri, reason: "K-pop 관심사 기반 추천", boardId: 2 },
  { id: 3, user: "귀멸해설러", title: "귀멸의 칼날 4기 8화 리뷰", viewers: 234, coins: 78, tags: ["애니", "귀멸"], emo: "🔥", c1: P.red, c2: P.crl, reason: "애니 카테고리 매칭", boardId: 4 },
  { id: 4, user: "사직응원단장", title: "롯데 7회 응원 떼창 현장", viewers: 187, coins: 56, tags: ["KBO", "응원"], emo: "📣", c1: P.blu, c2: P.grn, reason: "롯데 팬덤 활동 기반", boardId: 1 },
  { id: 5, user: "키보드워리어", title: "LCK 결승 실시간 해설", viewers: 456, coins: 210, tags: ["e스포츠", "LCK"], emo: "🎮", c1: P.ylw, c2: P.crl, reason: "트렌딩 키워드 연동", boardId: null },
];

const ROOM_MSGS = [
  { who: "부산갈매기_01", text: "오늘 선발 누구?" },
  { who: "사직의별", text: "나주환!! 기대된다" },
  { who: "직관러_사직", text: "사직 도착! 분위기 미쳤다 🔥" },
  { who: "갈매기응원단", text: "부산갈매기 벌써 나온다" },
  { who: "나주환최고", text: "삼진 잡았다!!!" },
];

// ========== HOME ==========
function Home({ nav, setBoard }) {
  const [writeText, setWriteText] = useState("");
  const [writeFocus, setWriteFocus] = useState(false);
  const [showPostScope, setShowPostScope] = useState(false);
  const [remindModal, setRemindModal] = useState(null);
  const [playModal, setPlayModal] = useState(null);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [newsOpen, setNewsOpen] = useState(null);
  const [homeNotif, setHomeNotif] = useState(false);
  const [homeMsgNotif, setHomeMsgNotif] = useState(false);

  var trendingNews = [
    { keyword: "전의리 역전 3점 홈런 🔥", count: "2,340", boardName: "롯데자이언츠", articles: [
      { title: "전의리, 5회말 역전 3점 홈런... 시즌 12호", source: "스포츠조선", time: "12분 전", icon: "⚾" },
      { title: "롯데, 전의리 활약에 3연승 질주", source: "OSEN", time: "18분 전", icon: "📰" },
      { title: "[영상] 전의리 홈런 볼 궤적 분석", source: "야구공작소", time: "25분 전", icon: "📊" },
    ]},
    { keyword: "BTS 컴백 D-7 카운트다운", count: "▲1,890", boardName: "ARMY", articles: [
      { title: "BTS 신보 트랙리스트 공개... 타이틀곡은?", source: "빌보드코리아", time: "1시간 전", icon: "🎵" },
      { title: "하이브, BTS 컴백 글로벌 프로모션 계획 발표", source: "한국경제", time: "2시간 전", icon: "📰" },
      { title: "ARMY 선주문 200만장 돌파", source: "스타뉴스", time: "3시간 전", icon: "💜" },
    ]},
    { keyword: "귀멸의 칼날 무한성 편 작화 논란", count: "▲1,234", boardName: "원피스", articles: [
      { title: "ufotable 무한성 편, 극장판 수준 작화 화제", source: "애니타임즈", time: "2시간 전", icon: "🎌" },
      { title: "귀멸의 칼날 시즌4, 역대급 전투신 반응", source: "인사이트", time: "3시간 전", icon: "📺" },
    ]},
    { keyword: "크리에이터 J×K 콜라보 역대 최고 동접", count: "▲987", boardName: "크리에이터 J", articles: [
      { title: "J×K 콜라보 캐스트, 동시접속 1,247명 기록", source: "OrBit 뉴스", time: "방금", icon: "🛰" },
    ]},
    { keyword: "KT Wiz 대형 트레이드 루머", count: "▲756", boardName: "KT Wiz", articles: [
      { title: "KT, 외국인 투수 영입 협상 중... 상대팀은?", source: "스포탈코리아", time: "30분 전", icon: "⚾" },
      { title: "[단독] KT 프런트, FA 시장 대어 접촉", source: "일간스포츠", time: "1시간 전", icon: "📰" },
    ]},
  ];
  const tc = { "KBO": P.blu, "롯데": P.blu, "K-pop": P.pur, "BTS": P.pur, "애니": P.red, "투수분석": P.grn, "작화분석": P.red, "안무": P.pnk, "원피스": P.crl, "일상": P.grn };

  function renderFeedItem(item) {
    if (item.kind === "thought") {
      return (
        <div key={item.id} style={{ padding: "12px 0", borderBottom: "1px solid " + P.bdr }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <Av n={item.av} s={28} c={item.ac} />
            <div><div style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ fontSize: 12, fontWeight: 600, color: P.g7 }}>{item.author}</span><span style={{ fontSize: 8, color: P.pri, background: P.priL, padding: "1px 4px", borderRadius: 3 }}>Lv.{item.lv}</span></div><div style={{ fontSize: 9, color: P.g4 }}>{item.time}</div></div>
            <Bg t="생각" c={P.pri} bg={P.priL} />
          </div>
          <div style={{ fontSize: 13, color: P.g7, lineHeight: 1.6, marginBottom: 6 }}>{item.text}</div>
          {item.thread && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", background: P.priL, borderRadius: 6, marginBottom: 6, cursor: "pointer" }}>
              <span style={{ fontSize: 10, color: P.pri }}>🔗</span>
              <span style={{ fontSize: 9, color: P.pri, fontWeight: 500 }}>연결된 생각 {item.thread}개 · 쓰레드 보기</span>
            </div>
          )}
          <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>{item.tags.map(function (tg) { return <span key={tg} style={{ fontSize: 9, padding: "2px 7px", borderRadius: 10, background: (tc[tg] || P.g4) + "15", color: tc[tg] || P.g4 }}>{tg}</span>; })}</div>
          <div style={{ display: "flex", gap: 10, fontSize: 11, color: P.g4, alignItems: "center" }}><span>▲ {item.likes}</span><span>💬 {item.cmt}</span><span style={{ cursor: "pointer" }}>😆😢🔥👏</span></div>
          <button onClick={function () { setRemindModal({ author: item.author, text: item.text, board: item.tags ? item.tags[0] : "" }); }} style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6, padding: "6px 12px", borderRadius: 8, background: P.ylw + "15", border: "1px solid " + P.ylw + "44", cursor: "pointer", width: "100%" }}>
            <span style={{ fontSize: 14 }}>⭐</span><span style={{ fontSize: 10, fontWeight: 600, color: P.ylw }}>리마인드 · 마인드맵에 저장</span>
          </button>
        </div>
      );
    }
    if (item.kind === "planet") {
      return (
        <div key={item.id} style={{ padding: "12px 0", borderBottom: "1px solid " + P.bdr }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <Av n={item.board} s={28} c={item.bc} />
            <div><div style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ fontSize: 11, fontWeight: 600, color: item.bc }}>{item.board}</span>{item.isSatellite && <span style={{ fontSize: 7, color: P.ylw }}>⭐</span>}<span style={{ fontSize: 9, color: P.g4 }}>· {item.author}</span></div><div style={{ fontSize: 9, color: P.g4 }}>{item.time}</div></div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 3 }}>
              {item.likes >= 300 && <Bg t="🏆 베스트" c={P.red} bg={P.redL} />}
              {item.likes >= 150 && item.likes < 300 && <Bg t="🔥 곧 베스트" c={P.ylw} bg={P.ylwL} />}
            </div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, color: P.g7, marginBottom: 3 }}>{item.title}</div>
          {item.body && <div style={{ fontSize: 11, color: P.g5, lineHeight: 1.5, marginBottom: 4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{item.body}</div>}
          <div style={{ display: "flex", gap: 10, fontSize: 11, color: P.g4, alignItems: "center" }}><span>▲ {item.likes}</span><span>💬 {item.cmt}</span><span style={{ cursor: "pointer" }}>😆😢🔥👏</span></div>
          <button onClick={function () { setRemindModal({ author: item.author, text: item.title, board: item.board }); }} style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6, padding: "6px 12px", borderRadius: 8, background: P.ylw + "15", border: "1px solid " + P.ylw + "44", cursor: "pointer", width: "100%" }}>
            <span style={{ fontSize: 14 }}>⭐</span><span style={{ fontSize: 10, fontWeight: 600, color: P.ylw }}>리마인드 · 마인드맵에 저장</span>
          </button>
        </div>
      );
    }
    if (item.kind === "highlight") {
      return (
        <div key={item.id} style={{ padding: "12px 0", borderBottom: "1px solid " + P.bdr }}>
          <div style={{ background: P.g7, borderRadius: 10, padding: 14, marginBottom: 8, position: "relative", minHeight: 80 }}>
            <div style={{ position: "absolute", top: 8, left: 8, display: "flex", gap: 4 }}><span style={{ background: P.red, color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 3 }}>하이라이트</span><span style={{ background: "rgba(0,0,0,0.5)", color: "#fff", fontSize: 9, padding: "2px 6px", borderRadius: 3 }}>👁 {item.viewers}</span></div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 50, fontSize: 28 }}>📺</div>
            <div style={{ color: "#fff", fontSize: 12, fontWeight: 600, textAlign: "center" }}>{item.title}</div>
            <div style={{ color: P.g4, fontSize: 9, textAlign: "center", marginTop: 2 }}>{item.body}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <Av n={item.av} s={24} c={item.ac} />
            <span style={{ fontSize: 11, fontWeight: 600, color: P.g7 }}>{item.author}</span>
            <span style={{ fontSize: 10, color: item.bc }}>{item.board}</span>
            <span style={{ fontSize: 9, color: P.g4, marginLeft: "auto" }}>{item.time}</span>
          </div>
          <div style={{ display: "flex", gap: 14, fontSize: 11, color: P.g4 }}><span>▲ {item.likes}</span><span>💬 {item.cmt}</span><span>↗ 공유</span></div>
        </div>
      );
    }
    if (item.kind === "remind_chain") {
      return (
        <div key={item.id} style={{ padding: "12px 0", borderBottom: "1px solid " + P.bdr }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: P.pri }}>⭐</span>
            <Av n={item.av} s={20} c={item.ac} />
            <span style={{ fontSize: 10, fontWeight: 600, color: P.g7 }}>{item.author}</span>
            <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 4, background: P.pri + "22", color: P.pri, fontWeight: 600 }}>{item.chain.length + 1}차 리마인드</span>
            <span style={{ fontSize: 9, color: P.g4, marginLeft: "auto" }}>{item.time}</span>
          </div>
          <div style={{ fontSize: 11, color: P.g7, marginBottom: 6 }}>{item.comment}</div>
          <div style={{ borderLeft: "3px solid " + item.origBc, paddingLeft: 8, marginBottom: 4 }}>
            {item.chain.map(function (ch, ci) {
              return <div key={ci} style={{ fontSize: 9, color: P.g5, padding: "2px 0", borderBottom: ci < item.chain.length - 1 ? "1px dashed " + P.bdr : "none" }}><span style={{ fontWeight: 600, color: P.pri }}>{ch.name}</span> {ch.text}</div>;
            })}
            <div style={{ fontSize: 8, color: item.origBc, marginTop: 2 }}>원본 · {item.origBoard}</div>
          </div>
          <div style={{ display: "flex", gap: 10, fontSize: 11, color: P.g4, marginTop: 4 }}><span>▲ {item.likes}</span><span>💬 {item.cmt}</span><span style={{ cursor: "pointer" }}>😆😢🔥👏</span></div>
        </div>
      );
    }
    if (item.kind === "remind") {
      return (
        <div key={item.id} style={{ padding: "12px 0", borderBottom: "1px solid " + P.bdr }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: P.pri }}>↗</span>
            <Av n={item.av} s={20} c={item.ac} />
            <span style={{ fontSize: 10, fontWeight: 600, color: P.g7 }}>{item.author}</span>
            <span style={{ fontSize: 9, color: P.pri }}>리마인드</span>
            <span style={{ fontSize: 9, color: P.g4, marginLeft: "auto" }}>{item.time}</span>
          </div>
          <div style={{ fontSize: 11, color: P.g7, marginBottom: 6, lineHeight: 1.5 }}>{item.comment}</div>
          <div style={{ borderLeft: "3px solid " + item.origBc, paddingLeft: 10, background: P.g1, borderRadius: "0 8px 8px 0", padding: "8px 10px 8px 12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
              <span style={{ fontSize: 9, fontWeight: 600, color: item.origBc }}>{item.origBoard}</span>
              <span style={{ fontSize: 9, color: P.g5 }}>· {item.origAuthor}</span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 500, color: P.g7 }}>{item.origText}</div>
          </div>
          <div style={{ display: "flex", gap: 14, fontSize: 11, color: P.g4, marginTop: 6 }}><span>▲ {item.likes}</span><span>💬 {item.cmt}</span><span>⭐ 리마인드</span></div>
        </div>
      );
    }
    return null;
  }

  const [openBubble, setOpenBubble] = useState(null);
  const [showNft, setShowNft] = useState(false);
  const [nftDetail, setNftDetail] = useState(null);
  const [showShop, setShowShop] = useState(false);

  var nftPortfolio = [
    { board: "롯데자이언츠", color: P.blu, amount: 300, bv: 986, rate: 99, change: 8.2 },
    { board: "ARMY", color: P.pur, amount: 150, bv: 1342, rate: 134, change: 12.3 },
    { board: "귀멸의 칼날", color: P.red, amount: 32, bv: 487, rate: 49, change: -3.1 },
  ];
  var totalNftValue = nftPortfolio.reduce(function (s, n) { return s + n.amount * n.rate; }, 0);
  var totalNftAmount = nftPortfolio.reduce(function (s, n) { return s + n.amount; }, 0);

  var recentBlogs = [
    { name: "사직의별", lv: 51, av: "사직", ac: P.blu, views: 23, tags: ["KBO", "투수분석"], subbed: false },
    { name: "귀멸_마스터", lv: 44, av: "귀멸", ac: P.red, views: 18, tags: ["애니", "작화분석"], subbed: true },
    { name: "댄스커버_유나", lv: 31, av: "유나", ac: P.pnk, views: 14, tags: ["K-pop", "안무"], subbed: false },
    { name: "해적왕_루피", lv: 37, av: "루피", ac: P.crl, views: 11, tags: ["애니", "원피스"], subbed: false },
  ];

  var mindmapClusters = {};
  THOUGHTS.forEach(function (t) { var c = t.tags[0] || "기타"; if (!mindmapClusters[c]) mindmapClusters[c] = []; mindmapClusters[c].push(t); });
  var bubbles = Object.entries(mindmapClusters).map(function (entry) { return { cat: entry[0], items: entry[1], count: entry[1].length }; });

  var srcIcon = { mine: "✏️", community: "▤", blog: "📝", broadcast: "📺" };

  return (
    <div>

      {/* 큐빗 포트폴리오 */}
      {showNft && (
        <div style={{ background: "#fff", border: "2px solid " + P.pri, borderRadius: 12, padding: 12, marginBottom: 12, boxShadow: "0 4px 20px rgba(108,92,231,0.15)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: P.g7 }}>내 큐빗 포트폴리오</span>
            <span onClick={function () { setShowNft(false); setNftDetail(null); }} style={{ marginLeft: "auto", fontSize: 14, color: P.g4, cursor: "pointer" }}>✕</span>
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 10, padding: "8px 10px", background: P.priL, borderRadius: 8 }}>
            <div style={{ flex: 1 }}><div style={{ fontSize: 9, color: P.g4 }}>총 보유</div><div style={{ fontSize: 16, fontWeight: 700, color: P.pri }}>{totalNftAmount}Q</div></div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 9, color: P.g4 }}>환산 가치</div><div style={{ fontSize: 16, fontWeight: 700, color: P.g7 }}>₩{totalNftValue.toLocaleString()}</div></div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 9, color: P.g4 }}>할인 등급</div><div style={{ fontSize: 14, fontWeight: 700, color: P.ylw }}>🥇 골드</div></div>
          </div>
          {!nftDetail ? (
            <div>
              {nftPortfolio.map(function (n) {
                var val = n.amount * n.rate;
                return (
                  <div key={n.board} onClick={function () { setNftDetail(n); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 6px", borderBottom: "1px solid " + P.bdr, cursor: "pointer" }}>
                    <Av n={n.board} s={28} c={n.color} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: P.g7 }}>{n.board}</div>
                      <div style={{ fontSize: 9, color: P.g4 }}>BV {n.bv} · 1Q = {n.rate}캐시</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{n.amount}Q</div>
                      <div style={{ fontSize: 9, color: n.change >= 0 ? P.grn : P.red }}>{n.change >= 0 ? "▲" : "▼"} {Math.abs(n.change)}%</div>
                    </div>
                    <span style={{ fontSize: 10, color: P.g4 }}>→</span>
                  </div>
                );
              })}
              <button onClick={function () { setShowNft(false); setShowShop(true); }} style={{ width: "100%", marginTop: 8, padding: "10px 0", borderRadius: 8, background: P.pri, color: "#fff", border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>🛒 큐빗 마켓에서 아이템 구매</button>
            </div>
          ) : (
            <div>
              <div onClick={function () { setNftDetail(null); }} style={{ fontSize: 10, color: P.g4, cursor: "pointer", marginBottom: 6 }}>← 목록으로</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <Av n={nftDetail.board} s={32} c={nftDetail.color} />
                <div><div style={{ fontSize: 13, fontWeight: 700, color: P.g7 }}>{nftDetail.board}</div><div style={{ fontSize: 9, color: P.g4 }}>BV {nftDetail.bv} · {nftDetail.amount}Q 보유</div></div>
                <div style={{ marginLeft: "auto", textAlign: "right" }}><div style={{ fontSize: 14, fontWeight: 700, color: nftDetail.change >= 0 ? P.grn : P.red }}>{nftDetail.change >= 0 ? "+" : ""}{nftDetail.change}%</div></div>
              </div>
              <div style={{ height: 100, borderRadius: 8, background: P.g1, marginBottom: 8, position: "relative", overflow: "hidden" }}>
                <svg width="100%" height="100" viewBox="0 0 300 100" preserveAspectRatio="none"><path d="M0,80 C30,75 60,60 90,55 C120,50 150,40 180,35 C210,30 240,45 270,25 L300,20" stroke={nftDetail.change >= 0 ? P.grn : P.red} strokeWidth="2" fill="none"/><path d="M0,80 C30,75 60,60 90,55 C120,50 150,40 180,35 C210,30 240,45 270,25 L300,20 L300,100 L0,100Z" fill={nftDetail.change >= 0 ? P.grn + "15" : P.red + "15"}/></svg>
                <div style={{ position: "absolute", top: 4, right: 6, fontSize: 8, color: P.g4 }}>30일 시세</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 4, marginBottom: 8 }}>
                <div style={{ padding: 6, borderRadius: 6, background: P.g1, textAlign: "center" }}><div style={{ fontSize: 7, color: P.g4 }}>현재 시세</div><div style={{ fontSize: 11, fontWeight: 600, color: P.g7 }}>1Q = {nftDetail.rate}캐시</div></div>
                <div style={{ padding: 6, borderRadius: 6, background: P.g1, textAlign: "center" }}><div style={{ fontSize: 7, color: P.g4 }}>7일 변동</div><div style={{ fontSize: 11, fontWeight: 600, color: P.grn }}>+{(nftDetail.change * 0.4).toFixed(1)}%</div></div>
                <div style={{ padding: 6, borderRadius: 6, background: P.g1, textAlign: "center" }}><div style={{ fontSize: 7, color: P.g4 }}>DAU</div><div style={{ fontSize: 11, fontWeight: 600, color: P.g7 }}>{nftDetail.dau || "8.9K"}</div></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Shop Overlay */}
      {showShop && (
        <div style={{ background: "#fff", border: "2px solid " + P.ylw, borderRadius: 12, padding: 12, marginBottom: 12, boxShadow: "0 4px 20px rgba(239,159,39,0.15)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: P.g7 }}>🛒 큐빗 마켓</span>
            <span style={{ fontSize: 9, color: P.ylw, fontWeight: 600 }}>482Q 보유</span>
            <span onClick={function () { setShowShop(false); }} style={{ marginLeft: "auto", fontSize: 14, color: P.g4, cursor: "pointer" }}>✕</span>
          </div>
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid " + P.bdr, marginBottom: 8 }}>
            {["큐빗 사용", "캐시 사용", "정기구독"].map(function (t, i) {
              return <button key={t} style={{ padding: "6px 0", fontSize: 10, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? P.pri : P.g4, background: "none", border: "none", borderBottom: i === 0 ? "2px solid " + P.pri : "none", cursor: "pointer", flex: 1 }}>{t}</button>;
            })}
          </div>
          <div style={{ fontSize: 9, fontWeight: 600, color: P.pri, marginBottom: 4 }}>🪙 큐빗으로 구매 (482Q 보유)</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 4, marginBottom: 8 }}>
            {[
              { icon: "🎨", label: "캐스트 배경", cost: "50~200Q", c: P.red },
              { icon: "📸", label: "AR 필터", cost: "100~500Q", c: P.pri },
              { icon: "🥽", label: "VR 아바타 아이템", cost: "200~1KQ", c: P.pnk },
              { icon: "🖼", label: "마인드맵 배경", cost: "30~100Q", c: P.blu },
              { icon: "🪴", label: "마인드맵 소품", cost: "10~50Q", c: P.grn },
              { icon: "🔤", label: "폰트 구매", cost: "20~80Q", c: P.g5 },
              { icon: "😀", label: "이모티콘 팩", cost: "30~100Q", c: P.ylw },
              { icon: "🏛", label: "플래닛 이모티콘 등록", cost: "50Q", c: P.blu },
              { icon: "🔒", label: "VPN (1일)", cost: "5Q/일", c: P.g5 },
              { icon: "👑", label: "홈마스터 출마", cost: "1,000Q", c: P.ylw },
            ].map(function (u) {
              return <div key={u.label} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 6px", borderRadius: 6, background: u.c + "08", cursor: "pointer" }}><span style={{ fontSize: 12 }}>{u.icon}</span><div><div style={{ fontSize: 8, fontWeight: 500, color: P.g7 }}>{u.label}</div><div style={{ fontSize: 7, color: u.c, fontWeight: 600 }}>{u.cost}</div></div></div>;
            })}
          </div>
          <div style={{ borderTop: "1px solid " + P.bdr, paddingTop: 8, marginBottom: 8 }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: P.ylw, marginBottom: 4 }}>💰 캐시로 구매 (₩24,500 보유)</div>
            <div style={{ display: "flex", gap: 4, overflow: "hidden", marginBottom: 4 }}>
              {[{ name: "스타벅스", price: "3,825", icon: "☕" }, { name: "BBQ", price: "15,300", icon: "🍗" }, { name: "CGV", price: "10,200", icon: "🎬" }, { name: "배민", price: "8,500", icon: "🛵" }].map(function (g) {
                return <div key={g.name} style={{ flex: 1, padding: "5px 3px", borderRadius: 6, background: P.g1, textAlign: "center", cursor: "pointer" }}><div style={{ fontSize: 14 }}>{g.icon}</div><div style={{ fontSize: 7, color: P.g7 }}>{g.name}</div><div style={{ fontSize: 8, fontWeight: 600, color: P.ylw }}>₩{g.price}</div></div>;
              })}
            </div>
          </div>
          <div style={{ borderTop: "1px solid " + P.bdr, paddingTop: 8, marginBottom: 8 }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: P.red, marginBottom: 4 }}>📺 정기구독 (캐시 결제)</div>
            {[
              { name: "크리에이터 J 새틀릿", type: "월정액", price: "₩4,900/월", perk: "구독자전용 캐스트 + 비하인드", icon: "⭐", c: P.ylw },
              { name: "롯데자이언츠 VIP", type: "월정액", price: "₩9,900/월", perk: "VIP전용 캐스트 + 경기 분석 리포트", icon: "👑", c: P.blu },
            ].map(function (s) {
              return <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", borderRadius: 8, background: s.c + "08", marginBottom: 4, border: "1px solid " + s.c + "22" }}><span style={{ fontSize: 14 }}>{s.icon}</span><div style={{ flex: 1 }}><div style={{ fontSize: 10, fontWeight: 600, color: P.g7 }}>{s.name}</div><div style={{ fontSize: 7, color: P.g4 }}>{s.perk}</div></div><div style={{ textAlign: "right" }}><div style={{ fontSize: 9, fontWeight: 600, color: s.c }}>{s.price}</div><span style={{ fontSize: 7, padding: "1px 4px", borderRadius: 3, background: P.grn + "22", color: P.grn }}>구독중</span></div></div>;
            })}
          </div>
          <button onClick={function () { setShowShop(false); setShowRecharge(true); }} style={{ width: "100%", padding: "10px 0", borderRadius: 8, background: P.ylw, color: "#fff", border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>💰 캐시 충전하기</button>
        </div>
      )}

      {/* Home Top Bar - unified */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <svg width="18" height="18" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="12" stroke="#1B2838" strokeWidth="3" fill="none"/><ellipse cx="20" cy="20" rx="18" ry="7" stroke="#1B2838" strokeWidth="1.5" fill="none" transform="rotate(-25 20 20)"/></svg>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#1B2838" }}>rBit</span>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
          <div onClick={function () { setShowNft(!showNft); setShowShop(false); setHomeNotif(false); setHomeMsgNotif(false); }} style={{ cursor: "pointer", padding: "3px 7px", borderRadius: 5, background: showNft ? P.priL : P.g1 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: P.pri }}>482Q</span>
          </div>
          <div onClick={function () { setShowShop(!showShop); setShowNft(false); setHomeNotif(false); setHomeMsgNotif(false); }} style={{ width: 26, height: 26, borderRadius: 6, background: showShop ? P.ylwL : P.g1, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 12 }}>🛒</div>
          <button onClick={function () { setHomeMsgNotif(!homeMsgNotif); setHomeNotif(false); setShowNft(false); setShowShop(false); }} style={{ width: 26, height: 26, borderRadius: "50%", background: homeMsgNotif ? P.pri : P.g1, border: "none", cursor: "pointer", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 11, color: homeMsgNotif ? "#fff" : P.g5 }}>✉</span>
            <span style={{ position: "absolute", top: -2, right: -2, width: 7, height: 7, borderRadius: "50%", background: P.red, border: "1px solid #fff" }} />
          </button>
          <button onClick={function () { setHomeNotif(!homeNotif); setHomeMsgNotif(false); setShowNft(false); setShowShop(false); }} style={{ width: 26, height: 26, borderRadius: "50%", background: homeNotif ? P.pri : P.g1, border: "none", cursor: "pointer", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 11, color: homeNotif ? "#fff" : P.g5 }}>🔔</span>
            <span style={{ position: "absolute", top: -2, right: -2, width: 7, height: 7, borderRadius: "50%", background: P.red, border: "1px solid #fff" }} />
          </button>
        </div>
      </div>
      {/* Header Row 2: Stats Strip */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, padding: "4px 0", marginBottom: 10, borderBottom: "1px solid " + P.bdr, fontSize: 10 }}>
        <span style={{ color: P.pri, fontWeight: 600 }}>482Q</span>
        <span style={{ color: P.grn, marginLeft: 3, fontSize: 9 }}>▲8.2%</span>
        <span style={{ color: P.g3, margin: "0 6px" }}>|</span>
        <span style={{ color: P.ylw, fontWeight: 600 }}>★4위</span>
        <span style={{ color: P.g3, margin: "0 6px" }}>|</span>
        <span style={{ color: P.g7, fontWeight: 600 }}>구독 1,200</span>
        <span style={{ color: P.g3, margin: "0 6px" }}>|</span>
        <span style={{ color: P.g5 }}>골드 15%↓</span>
      </div>

      {/* Message Notification Dropdown */}
      {homeMsgNotif && (
        <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.12)", border: "1px solid " + P.bdr, marginBottom: 8, overflow: "hidden" }}>
          <div style={{ padding: "8px 10px", borderBottom: "1px solid " + P.bdr, display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: P.g7 }}>📡 시그널</span>
            <span onClick={function () { nav("msg"); }} style={{ marginLeft: "auto", fontSize: 8, color: P.pri, cursor: "pointer" }}>전체 보기 →</span>
          </div>
          {[
            { name: "사직의별", text: "나주환 슬라이더 데이터 봤어?", time: "3분 전", read: false },
            { name: "직관 단톡방", text: "오늘 사직 6시 30분 집합!", time: "15분 전", read: false },
            { name: "롯데 응원방", text: "📢 전의리 홈런 축하합니다!", time: "1시간 전", read: true },
          ].map(function (m) {
            return <div key={m.name} onClick={function () { setHomeMsgNotif(false); nav("msg"); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: m.read ? "#fff" : P.priL, borderBottom: "1px solid " + P.g1, cursor: "pointer" }}>
              <Av n={m.name} s={28} c={P.pri} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 3 }}><span style={{ fontSize: 10, fontWeight: m.read ? 400 : 600, color: P.g7 }}>{m.name}</span><span style={{ fontSize: 8, color: P.g4 }}>{m.time}</span></div>
                <div style={{ fontSize: 9, color: m.read ? P.g4 : P.g7, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.text}</div>
              </div>
              {!m.read && <span style={{ width: 6, height: 6, borderRadius: "50%", background: P.pri }} />}
            </div>;
          })}
        </div>
      )}
      {/* Notification Dropdown */}
      {homeNotif && (
        <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.12)", border: "1px solid " + P.bdr, marginBottom: 8, overflow: "hidden" }}>
          <div style={{ padding: "8px 10px", borderBottom: "1px solid " + P.bdr, display: "flex", alignItems: "center" }}><span style={{ fontSize: 11, fontWeight: 600, color: P.g7 }}>알림</span><span style={{ marginLeft: "auto", fontSize: 8, color: P.pri, cursor: "pointer" }}>모두 읽음</span></div>
          {[
            { icon: "💬", text: "사직의별님이 내 글에 댓글을 남겼습니다", time: "3분 전", read: false },
            { icon: "⭐", text: "부산갈매기_01님이 내 생각을 리마인드했습니다", time: "15분 전", read: false },
            { icon: "🧠", text: "새 플래닛 추천: 두산베어스 (87% 매칭)", time: "1시간 전", read: false },
            { icon: "🛰", text: "크리에이터 J 캐스트 시작!", time: "2시간 전", read: true },
            { icon: "🗳️", text: "롯데자이언츠 홈마스터 선거 D-30", time: "오늘", read: true },
          ].map(function (n, i) {
            return <div key={i} style={{ display: "flex", gap: 6, padding: "7px 10px", background: n.read ? "#fff" : P.priL, borderBottom: "1px solid " + P.g1, cursor: "pointer" }}><span style={{ fontSize: 12 }}>{n.icon}</span><div style={{ flex: 1 }}><div style={{ fontSize: 9, color: n.read ? P.g5 : P.g7, fontWeight: n.read ? 400 : 500, lineHeight: 1.4 }}>{n.text}</div><div style={{ fontSize: 7, color: P.g4 }}>{n.time}</div></div>{!n.read && <span style={{ width: 6, height: 6, borderRadius: "50%", background: P.pri, marginTop: 4 }} />}</div>;
          })}
        </div>
      )}

      {/* Mindmap Room + Bubbles Combined */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: P.g7 }}>내 마인드맵</span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {Object.entries({ mine: { i: "✏️", c: P.pri }, community: { i: "▤", c: P.pnk }, blog: { i: "📝", c: P.blu }, broadcast: { i: "📺", c: P.red } }).map(function (e) { return <span key={e[0]} style={{ fontSize: 8, width: 16, height: 16, borderRadius: 4, background: e[1].c + "22", display: "flex", alignItems: "center", justifyContent: "center" }}>{e[1].i}</span>; })}
            <span onClick={function () { nav("map"); }} style={{ fontSize: 10, color: P.pri, cursor: "pointer" }}>전체 보기 →</span>
          </div>
        </div>

        {/* Mini Room with floating bubbles */}
        <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", background: "linear-gradient(180deg, #D4E6F1 0%, #EBF5FB 40%, #FDEBD0 70%, #F6DDCC 100%)", border: "1px solid " + P.bdr, minHeight: openBubble ? 280 : 190 }}>
          <style>{"\n            @keyframes cloudFloat0 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }\n            @keyframes cloudFloat1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }\n            @keyframes cloudFloat2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)} }\n          "}</style>
          {/* Room decorations */}
          <div style={{ position: "absolute", top: 8, left: 12, width: 36, height: 28, borderRadius: 4, background: "#AED6F1", border: "2px solid #F5F5DC" }}>
            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1.5, background: "#F5F5DC" }} />
            <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1.5, background: "#F5F5DC" }} />
          </div>
          <div style={{ position: "absolute", top: 6, right: 12, display: "flex", gap: 4, fontSize: 14 }}>🏆⚾🎵</div>
          <div style={{ position: "absolute", bottom: 45, left: 0, right: 0, height: 1, background: "#D5B89544" }} />
          <div style={{ position: "absolute", bottom: 20, left: 14, fontSize: 16 }}>🎵</div>
          <div style={{ position: "absolute", bottom: 18, right: 14, fontSize: 14 }}>🎸</div>
          <div style={{ position: "absolute", bottom: 48, right: 18, fontSize: 12 }}>🧸</div>
          {/* Visitor avatar (Problem 14) */}
          <div onClick={function () { nav("map"); }} style={{ position: "absolute", bottom: 16, left: 45, textAlign: "center", cursor: "pointer", zIndex: 3 }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: P.blu + "33", border: "1.5px solid " + P.blu, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>😊</div>
              <div style={{ position: "absolute", top: -14, left: -6, background: "#fff", borderRadius: 5, padding: "1px 4px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", whiteSpace: "nowrap" }}>
                <span style={{ fontSize: 6, color: P.blu, fontWeight: 600 }}>87% 일치</span>
              </div>
            </div>
            <div style={{ fontSize: 6, color: P.g5, marginTop: 1 }}>사직의별</div>
          </div>


          {/* SD Avatar */}
          <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", textAlign: "center", zIndex: 1 }}>
            {/* 생각 구름 */}
            <div style={{ position: "relative", marginBottom: 4 }}>
              <div style={{ background: "#fff", borderRadius: 12, padding: "4px 10px", boxShadow: "0 1px 6px rgba(0,0,0,0.08)", whiteSpace: "nowrap", animation: "cloudFloat0 3s ease-in-out infinite", position: "relative", overflow: "hidden", height: 16 }}>
                <style>{"@keyframes bubbleSwap { 0%,45% { transform: translateY(0); opacity: 1; } 48%,52% { opacity: 0; } 55%,100% { transform: translateY(-16px); opacity: 1; } }"}</style>
                <div style={{ animation: "bubbleSwap 6s ease-in-out infinite alternate" }}>
                  <div style={{ height: 16, display: "flex", alignItems: "center" }}><span style={{ fontSize: 8, color: P.pri, fontWeight: 500 }}>내 생각을 정리해줍니다 🧠</span></div>
                  <div style={{ height: 16, display: "flex", alignItems: "center" }}><span style={{ fontSize: 7, color: P.ylw, fontWeight: 500 }}>오늘의 3줄: 롯데, 롤, BTS ⭐</span></div>
                </div>
              </div>
              <div style={{ position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%)", width: 8, height: 8, background: "#fff", borderRadius: "50%", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }} />
              <div style={{ position: "absolute", bottom: -7, left: "50%", transform: "translateX(2px)", width: 5, height: 5, background: "#fff", borderRadius: "50%", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }} />
            </div>
            <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg, " + P.pri + ", " + P.pnk + ")", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>😊</div>
            </div>
            <div style={{ fontSize: 9, fontWeight: 600, color: P.g7, marginTop: 2, background: "rgba(255,255,255,0.85)", padding: "1px 6px", borderRadius: 6 }}>직관러_사직</div>
            <div style={{ fontSize: 7, color: P.g4 }}>Lv.34 · 🔥34</div>
          </div>
        </div>
      </div>

      {/* Compose with AI Planet Suggestion */}
      <div style={{ borderBottom: "1px solid " + P.bdr, paddingBottom: 12, marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <Av n="직관" s={36} c={P.blu} />
          <div style={{ flex: 1 }}>
            <textarea value={writeText} onChange={function (e) { setWriteText(e.target.value); }} onFocus={function () { setWriteFocus(true); }} placeholder="무슨 생각이든 던져보세요..." style={{ width: "100%", padding: "8px 0", border: "none", borderBottom: writeFocus ? "2px solid " + P.pri : "1px solid " + P.bdr, fontSize: 14, outline: "none", resize: "none", fontFamily: "inherit", boxSizing: "border-box", minHeight: writeFocus ? 60 : 36, transition: "min-height 0.2s", background: "transparent" }} />
            {writeFocus && (
              <div style={{ position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                  <div style={{ display: "flex", gap: 8, fontSize: 16, color: P.pri }}><span style={{ cursor: "pointer" }}>🖼</span><span style={{ cursor: "pointer" }}>📊</span><span style={{ cursor: "pointer" }}>📍</span><span onClick={function () { setPlayModal("select"); }} style={{ cursor: "pointer" }}>🎮</span></div>
                  <button onClick={function () { if (writeText.trim()) setShowPostScope(true); }} style={{ marginLeft: "auto", padding: "5px 16px", borderRadius: 18, background: writeText.trim() ? P.pri : P.g3, color: "#fff", border: "none", fontSize: 11, fontWeight: 600, cursor: writeText.trim() ? "pointer" : "default" }}>던지기</button>
                </div>
                {showPostScope === true && (
                  <div style={{ position: "absolute", right: 0, top: 36, background: "#fff", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", border: "1px solid " + P.bdr, padding: 6, zIndex: 10, width: 220 }}>
                    <div style={{ fontSize: 10, color: P.g4, padding: "4px 8px", marginBottom: 2 }}>공개 범위를 선택하세요</div>
                    {[
                      { icon: "🔒", label: "나만보기", desc: "마인드맵에만 저장", c: P.g5 },
                      { icon: "🤝", label: "친구보기", desc: "맞팔 친구에게만 표시", c: P.grn },
                    ].map(function (opt) {
                      return (
                        <div key={opt.label} onClick={function () { setShowPostScope(false); setWriteText(""); setWriteFocus(false); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 8, cursor: "pointer", marginBottom: 1 }}>
                          <span style={{ fontSize: 14 }}>{opt.icon}</span>
                          <div><div style={{ fontSize: 11, fontWeight: 600, color: opt.c }}>{opt.label}</div><div style={{ fontSize: 8, color: P.g4 }}>{opt.desc}</div></div>
                        </div>
                      );
                    })}
                    <div style={{ borderTop: "1px solid " + P.bdr, marginTop: 4, paddingTop: 4 }}>
                      <div onClick={function () { setShowPostScope(false); setWriteText(""); setWriteFocus(false); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 8, cursor: "pointer", marginBottom: 1 }}>
                        <span style={{ fontSize: 14 }}>🌐</span>
                        <div><div style={{ fontSize: 11, fontWeight: 600, color: P.blu }}>전체 공개</div><div style={{ fontSize: 8, color: P.g4 }}>모든 유저에게 표시 + 마인드맵 저장</div></div>
                      </div>
                      <div onClick={function () { setShowPostScope("planet"); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 8, cursor: "pointer" }}>
                        <span style={{ fontSize: 14 }}>🏛</span>
                        <div style={{ flex: 1 }}><div style={{ fontSize: 11, fontWeight: 600, color: P.pnk }}>플래닛보기</div><div style={{ fontSize: 8, color: P.g4 }}>AI 추천 + 마인드맵에도 저장</div></div>
                        <span style={{ fontSize: 10, color: P.g4 }}>→</span>
                      </div>
                    </div>
                  </div>
                )}
                {showPostScope === "planet" && (
                  <div style={{ position: "absolute", right: 0, top: 36, background: "#fff", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", border: "1px solid " + P.bdr, padding: 8, zIndex: 10, width: 250 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                      <span style={{ fontSize: 12 }}>🤖</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: P.pri }}>AI 플래닛 추천</span>
                      <span onClick={function () { setShowPostScope(true); }} style={{ marginLeft: "auto", fontSize: 10, color: P.g4, cursor: "pointer" }}>← 뒤로</span>
                    </div>
                    <div style={{ fontSize: 9, color: P.g4, marginBottom: 4 }}>내용 분석 기반 · 복수 선택으로 크로스포스트</div>
                    {[
                      { name: "롯데자이언츠", match: 92, c: P.blu, icon: "🏛", checked: true },
                      { name: "ARMY", match: 45, c: P.pur, icon: "🏛", checked: false },
                      { name: "크리에이터 J", match: 38, c: P.ylw, icon: "⭐", checked: false },
                    ].map(function (s) {
                      return (
                        <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", marginBottom: 2, borderRadius: 8, background: s.checked ? s.c + "11" : P.g1, cursor: "pointer", border: s.checked ? "1px solid " + s.c + "44" : "1px solid transparent" }}>
                          <div style={{ width: 14, height: 14, borderRadius: 3, border: s.checked ? "2px solid " + s.c : "2px solid " + P.g3, background: s.checked ? s.c : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#fff" }}>{s.checked ? "✓" : ""}</div>
                          <span style={{ fontSize: 12 }}>{s.icon}</span>
                          <span style={{ fontSize: 11, fontWeight: 500, color: s.c, flex: 1 }}>{s.name}</span>
                          <span style={{ fontSize: 10, fontWeight: 600, color: s.match > 80 ? P.grn : P.g4 }}>{s.match}%</span>
                        </div>
                      );
                    })}
                    <div style={{ borderTop: "1px solid " + P.bdr, marginTop: 6, paddingTop: 6, display: "flex", alignItems: "center", gap: 6, padding: "5px 8px", borderRadius: 6, background: P.g1, cursor: "pointer", marginBottom: 6 }}>
                      <span style={{ fontSize: 12 }}>☄️</span>
                      <span style={{ fontSize: 10, color: P.g5 }}>혜성(익명)으로 게시</span>
                      <div style={{ marginLeft: "auto", width: 14, height: 14, borderRadius: 3, border: "2px solid " + P.g4 }} />
                    </div>
                    <div style={{ fontSize: 8, color: P.pri, textAlign: "center", marginBottom: 6 }}>🧠 플래닛 게시물도 내 마인드맵에 자동 저장됩니다</div>
                    <div style={{ padding: "6px 8px", borderRadius: 8, background: "linear-gradient(135deg, " + P.pri + "11, " + P.pnk + "11)", border: "1px solid " + P.pri + "33", marginBottom: 6 }}>
                      <div style={{ fontSize: 9, color: P.pri, fontWeight: 600 }}>🧠 AI 플래닛 추천</div>
                      <div style={{ fontSize: 10, color: P.g7, marginTop: 2 }}>당신과 성향이 <span style={{ fontWeight: 700, color: P.pri }}>87%</span> 일치하는 <span style={{ fontWeight: 700 }}>ARMY 플래닛</span>을 발견했습니다</div>
                      <div style={{ display: "flex", gap: 4, marginTop: 4 }}><span style={{ fontSize: 8, padding: "2px 8px", borderRadius: 10, background: P.pri, color: "#fff", cursor: "pointer" }}>놀러 가볼까요? →</span><span style={{ fontSize: 8, padding: "2px 8px", borderRadius: 10, background: P.g1, color: P.g4, cursor: "pointer" }}>다음에</span></div>
                    </div>
                    <button onClick={function () { setShowPostScope(false); setWriteText(""); setWriteFocus(false); }} style={{ width: "100%", padding: "10px 0", borderRadius: 10, background: P.pri, color: "#fff", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>던지기</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 실시간 급상승 이슈 Ticker */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: P.g7 }}>🔥 실시간 급상승 이슈</span>
          <span style={{ fontSize: 9, color: P.red }}>LIVE</span>
          {newsOpen !== null && <span onClick={function () { setNewsOpen(null); }} style={{ marginLeft: "auto", fontSize: 10, color: P.g4, cursor: "pointer" }}>✕ 닫기</span>}
        </div>
        {newsOpen === null && (
          <div style={{ overflow: "hidden", height: 28, position: "relative", background: P.g1, borderRadius: 8, border: "1px solid " + P.bdr }}>
            <style>{"@keyframes tickerScroll { 0% { transform: translateY(0); } 10% { transform: translateY(0); } 20% { transform: translateY(-28px); } 30% { transform: translateY(-28px); } 40% { transform: translateY(-56px); } 50% { transform: translateY(-56px); } 60% { transform: translateY(-84px); } 70% { transform: translateY(-84px); } 80% { transform: translateY(-112px); } 90% { transform: translateY(-112px); } 100% { transform: translateY(0); } }"}</style>
            <div style={{ animation: "tickerScroll 15s ease-in-out infinite" }}>
              {trendingNews.map(function (t, i) {
                return <div key={i} onClick={function () { setNewsOpen(i); }} style={{ height: 28, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 11, color: i === 0 ? P.red : P.g7, fontWeight: i === 0 ? 600 : 400, cursor: "pointer" }}>{i + 1}. {t.keyword} <span style={{ marginLeft: "auto", fontSize: 9, color: P.g4 }}>{t.count}</span></div>;
              })}
            </div>
          </div>
        )}
        {newsOpen !== null && (
          <div style={{ borderRadius: 10, border: "1px solid " + P.bdr, overflow: "hidden" }}>
            <div style={{ padding: "8px 10px", background: trendingNews[newsOpen] ? P.red + "08" : P.g1, borderBottom: "1px solid " + P.bdr }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: P.red }}>{trendingNews[newsOpen].keyword}</div>
              <div style={{ fontSize: 8, color: P.g4 }}>관련 뉴스 · RSS 자동 수집</div>
            </div>
            {(trendingNews[newsOpen].articles || []).map(function (a, i) {
              return (
                <div key={i} onClick={function () { var bn = trendingNews[newsOpen].boardName; var found = BOARDS.find(function (b) { return b.name === bn; }); if (found) { setBoard(found); nav("boardDetail"); setNewsOpen(null); } }} style={{ display: "flex", gap: 8, padding: "8px 10px", borderBottom: "1px solid " + P.g1, cursor: "pointer" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 6, background: [P.blu, P.red, P.pri][i % 3] + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{a.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: P.g7, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ fontSize: 8, color: P.g4 }}>{a.source} · {a.time}</span>
                      <span style={{ fontSize: 7, padding: "1px 4px", borderRadius: 3, background: P.blu + "15", color: P.blu }}>🏛 {trendingNews[newsOpen].boardName}에서 보기 →</span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div style={{ display: "flex", gap: 4, padding: "6px 10px" }}>
              <button onClick={function () { var bn = trendingNews[newsOpen].boardName; var found = BOARDS.find(function (b) { return b.name === bn; }); if (found) { setBoard(found); nav("boardDetail"); setNewsOpen(null); } }} style={{ flex: 1, padding: "6px 0", borderRadius: 6, background: P.pri, color: "#fff", border: "none", fontSize: 9, fontWeight: 600, cursor: "pointer" }}>🏛 {trendingNews[newsOpen].boardName} 플래닛 이동</button>
              <button onClick={function () { setNewsOpen(null); }} style={{ flex: 1, padding: "6px 0", borderRadius: 6, background: P.g1, color: P.g5, border: "none", fontSize: 9, cursor: "pointer" }}>접기</button>
            </div>
          </div>
        )}
      </div>

      {/* Play Modal - 놀이 */}
      {playModal && (
        <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, height: "100vh", background: "rgba(0,0,0,0.5)", zIndex: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "88%", background: "#fff", borderRadius: 16, padding: 16, maxHeight: "80vh", overflowY: "auto" }}>
            {playModal === "select" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                  <span style={{ fontSize: 18 }}>🎮</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: P.g7 }}>놀이 첨부</span>
                  <span onClick={function () { setPlayModal(null); }} style={{ marginLeft: "auto", fontSize: 16, color: P.g4, cursor: "pointer" }}>✕</span>
                </div>
                <div style={{ fontSize: 10, color: P.g4, marginBottom: 10 }}>미니게임을 생각에 첨부하여 친구들과 공유하세요</div>
                {[
                  { id: "ai_type", icon: "🤖", title: "나의 AI 사용유형은?", desc: "MBI 기반 AI 유형 분류 테스트", tag: "CUTI", c: P.pri },
                  { id: "worldcup", icon: "💘", title: "이상형 월드컵", desc: "16강 토너먼트로 최애 결정", tag: "인기", c: P.pnk },
                  { id: "ladder", icon: "🪜", title: "사다리타기", desc: "랜덤 결과로 운명을 결정!", tag: "파티", c: P.ylw },
                  { id: "ox", icon: "⭕", title: "OX 퀴즈", desc: "팬덤 지식 테스트", tag: "퀴즈", c: P.blu },
                  { id: "roulette", icon: "🎡", title: "돌림판", desc: "랜덤 선택이 필요할 때", tag: "랜덤", c: P.grn },
                ].map(function (g) {
                  return (
                    <div key={g.id} onClick={function () { setPlayModal(g.id); setQuizStep(0); setQuizAnswers([]); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", borderRadius: 10, cursor: "pointer", marginBottom: 4, border: "1px solid " + P.bdr }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: g.c + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{g.icon}</div>
                      <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 600, color: P.g7 }}>{g.title}</div><div style={{ fontSize: 9, color: P.g4 }}>{g.desc}</div></div>
                      <span style={{ fontSize: 7, padding: "2px 6px", borderRadius: 4, background: g.c + "22", color: g.c, fontWeight: 600 }}>{g.tag}</span>
                    </div>
                  );
                })}
              </div>
            )}
            {playModal === "ai_type" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}>
                  <span onClick={function () { setPlayModal("select"); }} style={{ fontSize: 10, color: P.g4, cursor: "pointer" }}>← 뒤로</span>
                  <span style={{ marginLeft: "auto", fontSize: 9, color: P.g4 }}>{quizStep + 1}/4</span>
                </div>
                {quizStep < 4 ? (
                  <div>
                    <div style={{ textAlign: "center", marginBottom: 12 }}>
                      <span style={{ fontSize: 28 }}>🤖</span>
                      <div style={{ fontSize: 14, fontWeight: 700, color: P.pri, marginTop: 4 }}>나의 AI 사용유형은?</div>
                      <div style={{ fontSize: 10, color: P.g4 }}>CUTI (Claude User Type Indicator)</div>
                    </div>
                    <div style={{ height: 4, borderRadius: 2, background: P.g2, marginBottom: 14 }}><div style={{ height: 4, borderRadius: 2, background: P.pri, width: ((quizStep + 1) / 4 * 100) + "%" }} /></div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: P.g7, textAlign: "center", marginBottom: 12 }}>
                      {["AI에게 주로 어떤 요청을 하나요?", "대화 스타일은?", "결과물을 어떻게 활용하나요?", "AI와의 관계를 어떻게 느끼나요?"][quizStep]}
                    </div>
                    {[
                      [["📊 분석/리서치", "B"], ["🎨 창작/아이디어", "S"], ["🔧 실무/자동화", "M"], ["💬 대화/상담", "A"]],
                      [["📋 구조적으로 지시", "S"], ["💭 자유롭게 대화", "A"], ["🔄 반복 수정 요청", "M"], ["🤔 질문으로 탐색", "B"]],
                      [["📄 바로 사용", "M"], ["🔀 재가공/편집", "S"], ["📚 학습 자료로", "B"], ["🤝 의견 참고로", "A"]],
                      [["🛠 도구로 활용", "M"], ["🧠 브레인 파트너", "S"], ["📖 선생님처럼", "B"], ["💬 대화 상대로", "A"]]
                    ][quizStep].map(function (opt) {
                      return (
                        <div key={opt[0]} onClick={function () { setQuizAnswers(function (p) { return p.concat([opt[1]]); }); setQuizStep(quizStep + 1); }} style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid " + P.bdr, marginBottom: 6, cursor: "pointer", fontSize: 12, color: P.g7 }}>{opt[0]}</div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 40, marginBottom: 6 }}>🧠</div>
                    <div style={{ fontSize: 10, color: P.g4, marginBottom: 4 }}>당신의 CUTI 유형은</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: P.pri, marginBottom: 2 }}>BSMA</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: P.g7, marginBottom: 8 }}>"시스템 아키텍트"</div>
                    <div style={{ padding: "10px 14px", borderRadius: 10, background: P.priL, marginBottom: 12, textAlign: "left" }}>
                      <div style={{ fontSize: 10, color: P.g5, lineHeight: 1.7 }}>분석적 프레임워크를 설계하고 AI에게 실행을 위임하는 디렉터형. 큰 그림을 그리고 체계를 만드는 데 강점이 있습니다.</div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={function () { setPlayModal(null); }} style={{ flex: 1, padding: "10px 0", borderRadius: 10, background: P.g1, color: P.g5, border: "none", fontSize: 11, cursor: "pointer" }}>닫기</button>
                      <button onClick={function () { setPlayModal(null); }} style={{ flex: 1, padding: "10px 0", borderRadius: 10, background: P.pri, color: "#fff", border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>🧠 마인드맵 저장</button>
                      <button onClick={function () { setPlayModal(null); }} style={{ flex: 1, padding: "10px 0", borderRadius: 10, background: P.blu, color: "#fff", border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>📡 공유</button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {(playModal === "worldcup" || playModal === "ladder" || playModal === "ox" || playModal === "roulette") && (
              <div style={{ textAlign: "center" }}>
                <span onClick={function () { setPlayModal("select"); }} style={{ fontSize: 10, color: P.g4, cursor: "pointer", display: "block", textAlign: "left", marginBottom: 8 }}>← 뒤로</span>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{playModal === "worldcup" ? "💘" : playModal === "ladder" ? "🪜" : playModal === "ox" ? "⭕" : "🎡"}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: P.g7, marginBottom: 4 }}>{playModal === "worldcup" ? "이상형 월드컵" : playModal === "ladder" ? "사다리타기" : playModal === "ox" ? "OX 퀴즈" : "돌림판"}</div>
                <div style={{ fontSize: 11, color: P.g4, marginBottom: 14 }}>제목과 항목을 입력하세요</div>
                <input placeholder="게임 제목 (예: 최애 선수 월드컵)" style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid " + P.bdr, fontSize: 12, outline: "none", boxSizing: "border-box", marginBottom: 8 }} />
                <textarea placeholder={"항목을 줄바꿈으로 입력\n" + (playModal === "worldcup" ? "예: 전의리\\n나주환\\n한동희\\n..." : playModal === "ladder" ? "예: 치킨\\n피자\\n떡볶이\\n..." : "예: 질문1\\n질문2\\n...")} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid " + P.bdr, fontSize: 11, outline: "none", resize: "none", minHeight: 80, fontFamily: "inherit", boxSizing: "border-box", marginBottom: 10 }} />
                <button onClick={function () { setPlayModal(null); }} style={{ width: "100%", padding: "12px 0", borderRadius: 10, background: P.pri, color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>🎮 생각에 첨부하기</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Inline Remind Panel - shown below feed items */}
      {remindModal && (
        <div style={{ margin: "-8px 0 8px", padding: "10px 12px", borderRadius: "0 0 10px 10px", background: P.ylwL, border: "1px solid " + P.ylw + "33", borderTop: "none" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: P.g7, marginBottom: 6 }}>⭐ 이 생각을 내 마인드맵에 연결하기</div>
          <div style={{ borderLeft: "3px solid " + P.pri, paddingLeft: 8, marginBottom: 8, fontSize: 9, color: P.g5 }}>
            <span style={{ fontWeight: 600, color: P.pri }}>{remindModal.author}</span> {remindModal.text}
          </div>
          <div style={{ fontSize: 8, color: P.g4, marginBottom: 4 }}>클러스터 선택</div>
          <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 6 }}>
            {["KBO", "투수분석", "롯데", "K-pop", "애니", "+ 새 클러스터"].map(function (cl) {
              return <span key={cl} style={{ padding: "3px 8px", borderRadius: 10, fontSize: 8, background: cl === "KBO" ? P.blu + "22" : cl === "+ 새 클러스터" ? P.pri + "11" : P.g1, color: cl === "KBO" ? P.blu : cl === "+ 새 클러스터" ? P.pri : P.g5, cursor: "pointer", border: cl === "KBO" ? "1px solid " + P.blu + "44" : "1px solid " + P.bdr }}>{cl}</span>;
            })}
          </div>
          <input placeholder="한 줄 메모 (선택)" style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid " + P.bdr, fontSize: 9, outline: "none", boxSizing: "border-box", marginBottom: 6 }} />
          <div style={{ display: "flex", gap: 4 }}>
            <button onClick={function () { setRemindModal(null); }} style={{ flex: 1, padding: "8px 0", borderRadius: 8, background: P.g1, color: P.g5, border: "none", fontSize: 9, cursor: "pointer" }}>취소</button>
            <button onClick={function () { setRemindModal(null); }} style={{ flex: 2, padding: "8px 0", borderRadius: 8, background: P.ylw, color: "#fff", border: "none", fontSize: 10, fontWeight: 600, cursor: "pointer" }}>⭐ 마인드맵에 저장</button>
          </div>
          <div style={{ marginTop: 6, fontSize: 8, color: P.g4 }}>저장 후 리마인드 체인:</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3, overflowX: "auto" }}>
            <div style={{ padding: "3px 8px", borderRadius: 6, background: P.blu + "15", fontSize: 7, color: P.blu, whiteSpace: "nowrap" }}>원본 · {remindModal.author}</div>
            <span style={{ fontSize: 10, color: P.g3 }}>→</span>
            <div style={{ padding: "3px 8px", borderRadius: 6, background: P.pri + "15", fontSize: 7, color: P.pri, whiteSpace: "nowrap" }}>내 리마인드</div>
            <span style={{ fontSize: 7, color: P.g4, cursor: "pointer" }}>전체 체인 보기 →</span>
          </div>
        </div>
      )}

      {/* Divider: Subscription Feed */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div style={{ height: 1, flex: 1, background: P.bdr }} />
        <span style={{ fontSize: 11, color: P.g4, fontWeight: 500 }}>내 구독 피드</span>
        <div style={{ height: 1, flex: 1, background: P.bdr }} />
      </div>

      {/* Infinite subscription feed */}
      {SUB_FEED.map(function (item) { return renderFeedItem(item); })}

      <div style={{ textAlign: "center", padding: "20px 0", color: P.g4, fontSize: 11 }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: 3, background: P.pri, animation: "pulse 1s infinite" }} />
          <div style={{ width: 6, height: 6, borderRadius: 3, background: P.pri, animation: "pulse 1s infinite 0.2s" }} />
          <div style={{ width: 6, height: 6, borderRadius: 3, background: P.pri, animation: "pulse 1s infinite 0.4s" }} />
        </div>
        OrBit 마인드맵 기반 맞춤 추천 · 마인드맵 기반 통합 피드
      </div>

    </div>
  );
}

// ========== BOARD TAB (Reddit Style) ==========
function BoardTab({ nav, setBoard, setCurBoard }) {
  const [tab, setTab] = useState("최근");
  const [sortBy, setSortBy] = useState("인기");
  const [votes, setVotes] = useState({});
  const [pollVotes, setPollVotes] = useState({});
  const [catFilter, setCatFilter] = useState("전체");
  const [feedMode, setFeedMode] = useState("피드");

  var categories = [
    { id: "전체", icon: "🌐" },
    { id: "KBO", icon: "⚾" },
    { id: "K-pop", icon: "🎵" },
    { id: "애니", icon: "🎌" },
    { id: "e스포츠", icon: "🎮" },
    { id: "크리에이터", icon: "⭐" },
  ];

  var tabList = ["최근", "구독"];
  var tabLabels = { "최근": "최근 방문", "구독": "내 구독" };
  var allBoards = catFilter === "전체" ? BOARDS : BOARDS.filter(function (b) { return b.fan === catFilter || (catFilter === "크리에이터" && b.type === "satellite"); });
  var boardList = tab === "최근" ? allBoards.filter(function (b) { return b.recent; }) : tab === "구독" ? allBoards.filter(function (b) { return b.sub; }) : allBoards.slice(0, 6);
  var filteredPosts = feedMode === "내글" ? ALL_POSTS.filter(function (p) { return p.author === "직관러_사직"; }) : feedMode === "내댓글" ? [] : ALL_POSTS.filter(function (p) { return boardList.some(function (bl) { return bl.name === p.board; }); }).sort(function (a, b) { return sortBy === "인기" ? b.likes - a.likes : 0; });

  var myComments = [
    { id: 1, text: "전의리 진짜 클러치 히터다 ㅋㅋ", post: "전의리 역전 3점 홈런!!", board: "롯데자이언츠", time: "5분 전", likes: 12, replies: 3, bc: P.blu },
    { id: 2, text: "나주환 슬라이더 회전수 데이터 공유합니다", post: "나주환 시즌 구종 분석", board: "롯데자이언츠", time: "1시간 전", likes: 8, replies: 1, bc: P.blu },
    { id: 3, text: "이번 안무 진짜 미쳤다 🔥", post: "Running Wild 2절 안무 분석", board: "ARMY", time: "3시간 전", likes: 23, replies: 5, bc: P.pur },
    { id: 4, text: "작화 퀄리티 역대급 인정", post: "무한성 편 작화 분석 3탄", board: "원피스", time: "어제", likes: 7, replies: 0, bc: P.crl },
  ];

  function handleVote(pid, dir) {
    setVotes(function (prev) {
      var cur = prev[pid] || 0;
      var next = {};
      var keys = Object.keys(prev);
      for (var i = 0; i < keys.length; i++) { next[keys[i]] = prev[keys[i]]; }
      next[pid] = cur === dir ? 0 : dir;
      return next;
    });
  }

  return (
    <div>
      {/* Season Banner */}
      <div style={{ background: "linear-gradient(90deg, #1B2838, #2C3E50)", borderRadius: 8, padding: "7px 12px", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 12 }}>🏆</span>
        <span style={{ fontSize: 10, color: "#fff", fontWeight: 500 }}>챌린저 시즌 3</span>
        <span style={{ fontSize: 9, color: P.ylw }}>12일 남음</span>
        <span style={{ marginLeft: "auto", fontSize: 9, color: "rgba(255,255,255,0.6)", cursor: "pointer" }}>순위표 →</span>
      </div>

      {/* Category Filter - 2 rows */}
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
        {categories.map(function (c) {
          var isActive = catFilter === c.id;
          return (
            <button key={c.id} onClick={function () { setCatFilter(c.id); }} style={{ display: "flex", alignItems: "center", gap: 3, padding: "5px 11px", borderRadius: 16, fontSize: 10, fontWeight: isActive ? 600 : 400, background: isActive ? P.pri : P.g1, color: isActive ? "#fff" : P.g5, border: isActive ? "none" : "1px solid " + P.bdr, cursor: "pointer", whiteSpace: "nowrap" }}>
              <span>{c.icon}</span>{c.id}
            </button>
          );
        })}
      </div>

      {/* 🔥 실시간 급상승 플래닛 Ticker */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: P.red }}>🔥</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: P.g7 }}>실시간 급상승 플래닛</span>
          <span style={{ fontSize: 7, padding: "1px 4px", borderRadius: 3, background: P.redL, color: P.red, fontWeight: 600 }}>LIVE</span>
        </div>
        <div style={{ overflow: "hidden", height: 26, position: "relative", background: P.g1, borderRadius: 6, border: "1px solid " + P.bdr }}>
          <style>{"@keyframes planetTicker { 0% { transform: translateY(0); } 10% { transform: translateY(0); } 20% { transform: translateY(-26px); } 30% { transform: translateY(-26px); } 40% { transform: translateY(-52px); } 50% { transform: translateY(-52px); } 60% { transform: translateY(-78px); } 70% { transform: translateY(-78px); } 80% { transform: translateY(-104px); } 90% { transform: translateY(-104px); } 100% { transform: translateY(0); } }"}</style>
          <div style={{ animation: "planetTicker 15s ease-in-out infinite" }}>
            {allBoards.sort(function (a, b) { return a.rank - b.rank; }).slice(0, 5).map(function (b, i) {
              return <div key={b.id} onClick={function () { setCurBoard(b); nav("boardDetail"); }} style={{ height: 26, display: "flex", alignItems: "center", padding: "0 10px", fontSize: 11, cursor: "pointer", gap: 6 }}>
                <span style={{ fontWeight: 700, color: i === 0 ? P.red : P.g4, width: 16, textAlign: "center" }}>{i + 1}</span>
                <span style={{ fontWeight: i === 0 ? 600 : 400, color: i === 0 ? P.red : P.g7 }}>{b.name}</span>
                <span style={{ fontSize: 9, color: P.grn, marginLeft: "auto" }}>▲ BV {b.bv}</span>
              </div>;
            })}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid " + P.bdr, marginBottom: 10 }}>
        {tabList.map(function (t) {
          return (
            <button key={t} onClick={function () { setTab(t); }} style={{ padding: "8px 12px", fontSize: 12, fontWeight: tab === t ? 600 : 400, color: tab === t ? P.pri : P.g4, background: "none", border: "none", borderBottom: tab === t ? "2px solid " + P.pri : "2px solid transparent", cursor: "pointer" }}>{tabLabels[t]}</button>
          );
        })}
      </div>

      {/* 🏆 베스트 플래닛 */}
      {/* Tab-dependent: 최근방문 / 내구독 - hashtag buttons */}
      {(tab === "최근" || tab === "구독") && boardList.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
          {boardList.map(function (b) {
            return (
              <span key={b.id} onClick={function () { setCurBoard(b); nav("boardDetail"); }} style={{ fontSize: 10, padding: "4px 10px", borderRadius: 14, background: b.color + "12", color: b.color, cursor: "pointer", border: "1px solid " + b.color + "33", fontWeight: 500 }}>
                {b.type === "satellite" ? "⭐" : "🏛"} {b.name}
                {b.live && <span style={{ color: P.red, marginLeft: 3, fontSize: 8 }}>●</span>}
              </span>
            );
          })}
        </div>
      )}

      {/* 🏆 베스트 플래닛 - always visible */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
          <span style={{ fontSize: 12 }}>🏆</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: P.g7 }}>베스트 플래닛</span>
          <span style={{ fontSize: 8, color: P.g4 }}>BV 순위</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 2 }}>
            <span style={{ width: 20, height: 20, borderRadius: "50%", background: P.g1, border: "1px solid " + P.bdr, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: P.g4, cursor: "pointer" }}>◀</span>
            <span style={{ width: 20, height: 20, borderRadius: "50%", background: P.g1, border: "1px solid " + P.bdr, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: P.g4, cursor: "pointer" }}>▶</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, overflow: "hidden" }}>
          {allBoards.sort(function (a, b) { return a.rank - b.rank; }).slice(0, 6).map(function (b, i) {
            return (
              <div key={b.id} onClick={function () { setCurBoard(b); nav("boardDetail"); }} style={{ minWidth: 100, padding: "8px 10px", borderRadius: 10, background: i === 0 ? P.ylw + "11" : P.g1, cursor: "pointer", textAlign: "center", border: "1px solid " + (i < 3 ? P.ylw + "44" : P.bdr), position: "relative" }}>
                <div style={{ position: "absolute", top: 4, left: 6, fontSize: 8, fontWeight: 700, color: i < 3 ? P.ylw : P.g4 }}>{["🥇","🥈","🥉","4","5","6"][i]}</div>
                <Av n={b.name} s={30} c={b.color} />
                <div style={{ fontSize: 10, fontWeight: 600, color: P.g7, marginTop: 3 }}>{b.name}</div>
                <div style={{ fontSize: 8, color: P.grn, fontWeight: 500 }}>BV {b.bv}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feed header with 피드/내글 toggle */}
      <div style={{ display: "flex", gap: 6, marginBottom: 10, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 0 }}>
          {["피드", "내글", "내댓글"].map(function (m) {
            return <button key={m} onClick={function () { setFeedMode(m); }} style={{ padding: "5px 12px", fontSize: 11, fontWeight: feedMode === m ? 600 : 400, color: feedMode === m ? P.pri : P.g4, background: "none", border: "none", borderBottom: feedMode === m ? "2px solid " + P.pri : "2px solid transparent", cursor: "pointer" }}>{m === "내글" ? "내 글" : m === "내댓글" ? "내 댓글" : "피드"}</button>;
          })}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          {["인기", "최신"].map(function (s) {
            return <button key={s} onClick={function () { setSortBy(s); }} style={{ padding: "3px 10px", fontSize: 10, borderRadius: 5, background: sortBy === s ? P.pri : P.g1, color: sortBy === s ? "#fff" : P.g5, border: "none", cursor: "pointer" }}>{s}</button>;
          })}
        </div>
      </div>

      {feedMode === "내댓글" && (
        <div>
          {myComments.map(function (mc) {
            return (
              <div key={mc.id} style={{ padding: "8px 0", borderBottom: "1px solid " + P.g1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
                  <span style={{ fontSize: 8, color: mc.bc }}>🏛 {mc.board}</span>
                  <span style={{ fontSize: 8, color: P.g4 }}>· {mc.time}</span>
                </div>
                <div style={{ fontSize: 11, color: P.g7, marginBottom: 3 }}>{mc.text}</div>
                <div style={{ fontSize: 9, color: P.g4, padding: "3px 8px", background: P.g1, borderRadius: 4, borderLeft: "2px solid " + mc.bc }}>
                  <span style={{ color: P.g5 }}>원글: {mc.post}</span>
                </div>
                <div style={{ display: "flex", gap: 8, fontSize: 9, color: P.g4, marginTop: 4 }}>
                  <span>👍 {mc.likes}</span>
                  <span>💬 답글 {mc.replies}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {filteredPosts.map(function (post) {
        var v = votes[post.id] || 0;
        var score = post.likes + v;
        return (
          <div key={post.id} style={{ padding: "10px 0", borderBottom: "1px solid " + P.bdr }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
              <Av n={post.board} s={16} c={post.boardColor} />
              <span style={{ fontSize: 10, fontWeight: 600, color: post.boardColor }}>{post.board}</span>
              <span style={{ fontSize: 9, color: post.isBot ? P.blu : P.g4 }}>· {post.author}</span>
              {post.isBot && <span style={{ fontSize: 7, padding: "1px 4px", borderRadius: 3, background: P.blu + "22", color: P.blu, fontWeight: 600 }}>🤖 {post.botType === "rss" ? "RSS" : post.botType === "score" ? "LIVE" : "봇"}</span>}
              {post.trending && <span style={{ fontSize: 7, padding: "1px 4px", borderRadius: 3, background: P.red + "15", color: P.red }}>🔥 트렌딩</span>}
              <span style={{ fontSize: 8, color: P.pri, background: P.priL, padding: "0px 4px", borderRadius: 3 }}>Lv.{post.lv}</span>
              <span style={{ fontSize: 9, color: P.g4, marginLeft: "auto" }}>{post.time}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 2 }}>
              {post.best && <Bg t="🏆 베스트 +5Q" c={P.red} bg={P.redL} />}
              {!post.best && post.likes >= 150 && <Bg t="🔥 곧 베스트" c={P.ylw} bg={P.ylwL} />}
              {post.type === "poll" && <Bg t="투표" c={P.blu} bg={P.bluL} />}
              {post.type === "highlight" && <Bg t="하이라이트" c={P.ylw} bg={P.ylwL} />}
            </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: P.g7, marginBottom: 2 }}>{post.title}</div>
              {post.body && <div style={{ fontSize: 11, color: P.g5, lineHeight: 1.5, marginBottom: 4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{post.body}</div>}
              {post.type === "poll" && post.opts && (
                <div style={{ margin: "5px 0", padding: 7, background: P.g1, borderRadius: 7 }}>
                  {post.opts.map(function (o, i) {
                    var tot = post.votes.reduce(function (a, b) { return a + b; }, 0);
                    var pc = Math.round(post.votes[i] / tot * 100);
                    var vd = pollVotes[post.id] === i;
                    return (
                      <div key={i} onClick={function () { setPollVotes(function (x) { var n = {}; for (var k in x) n[k] = x[k]; n[post.id] = i; return n; }); }} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 7px", marginBottom: 2, borderRadius: 5, background: vd ? P.priL : "#fff", border: "1px solid " + (vd ? P.pri : P.bdr), cursor: "pointer" }}>
                        <span style={{ flex: 1, fontSize: 10, fontWeight: vd ? 600 : 400 }}>{o}</span>
                        {pollVotes[post.id] !== undefined && (
                          <>
                            <BarFill v={pc} c={vd ? P.pri : P.g3} h={3} />
                            <span style={{ fontSize: 9, color: vd ? P.pri : P.g4, minWidth: 24, textAlign: "right" }}>{pc}%</span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              <div style={{ display: "flex", gap: 4, marginTop: 6, alignItems: "center" }}>
                <button onClick={function () { handleVote(post.id, 1); }} style={{ padding: "3px 10px", borderRadius: 12, fontSize: 10, fontWeight: v === 1 ? 600 : 400, background: v === 1 ? P.grn + "22" : P.g1, color: v === 1 ? P.grn : P.g5, border: v === 1 ? "1px solid " + P.grn : "1px solid " + P.bdr, cursor: "pointer" }}>👍 찬성</button>
                <button onClick={function () { handleVote(post.id, 0); }} style={{ padding: "3px 10px", borderRadius: 12, fontSize: 10, fontWeight: v === 2 ? 600 : 400, background: v === 2 ? P.g4 + "22" : P.g1, color: P.g5, border: "1px solid " + P.bdr, cursor: "pointer" }}>😐 중립</button>
                <button onClick={function () { handleVote(post.id, -1); }} style={{ padding: "3px 10px", borderRadius: 12, fontSize: 10, fontWeight: v === -1 ? 600 : 400, background: v === -1 ? P.red + "22" : P.g1, color: v === -1 ? P.red : P.g5, border: v === -1 ? "1px solid " + P.red : "1px solid " + P.bdr, cursor: "pointer" }}>👎 반대</button>
                <span style={{ fontSize: 11, fontWeight: 600, color: v === 1 ? P.grn : v === -1 ? P.red : P.g7, marginLeft: 4 }}>{score}</span>
                <span style={{ fontSize: 10, color: P.g4, marginLeft: "auto" }}>💬 {post.cmt}</span>
                <span style={{ fontSize: 10, color: P.g4 }}>😆😢🔥👏</span>
              </div>
              <button style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6, padding: "6px 12px", borderRadius: 8, background: P.ylw + "15", border: "1px solid " + P.ylw + "44", cursor: "pointer", width: "100%" }}>
                <span style={{ fontSize: 13 }}>⭐</span><span style={{ fontSize: 10, fontWeight: 600, color: P.ylw }}>리마인드 · 마인드맵에 저장</span>
              </button>
          </div>
        );
      })}
    </div>
  );
}

// ========== BOARD DETAIL ==========
function BoardDetail({ board, nav }) {
  const [joined, setJoined] = useState(true);
  const [checked, setChecked] = useState(false);
  const [hashTag, setHashTag] = useState("전체");
  const [election, setElection] = useState(false);
  const [vsOpen, setVsOpen] = useState(false);
  var isOfficial = board.type === "official";

  var boardHashtags = ["소개", "미디어"].concat(
    board.fan === "KBO" ? ["전체", "베스트", "공지", "#전의리", "#나주환", "#한동희", "투표", "2차창작", "직관"] :
    board.fan === "BTS" ? ["전체", "베스트", "공지", "#지민", "#RM", "#정국", "투표", "팬아트", "커버댄스"] :
    board.fan === "애니" ? ["전체", "베스트", "공지", "투표", "팬아트", "리뷰", "스포", "굿즈"] :
    board.type === "satellite" ? ["전체", "베스트", "공지", "캐스트", "비하인드", "Q&A", "구독자전용"] :
    ["전체", "베스트", "공지", "투표", "자유", "팬아트"]
  );
  var managers = {
    1: { master: "부산갈매기_대장", sub: "사직의별" },
    2: { master: "bangtan_scholar", sub: "purple_rain_07" },
    3: { master: "BLINK_queen", sub: "리사러버" },
    4: { master: "귀멸_마스터", sub: "탄지로_fan" },
    5: { master: "해적왕_루피", sub: "나미_항해사" },
    7: { master: "크리에이터J", sub: "J_매니저" },
    9: { master: "크리에이터K", sub: "K_서포터" },
  };
  var mgr = managers[board.id] || { master: "매니저", sub: "부매니저" };

  return (
    <div>
      {/* Community type badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        {isOfficial ? (
          <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 8, background: P.bluL, border: "1px solid " + P.blu + "44" }}>
            <span style={{ fontSize: 12 }}>🏛</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: P.blu }}>공식 플래닛</span>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 8, background: P.ylwL, border: "1px solid " + P.ylw + "44" }}>
            <span style={{ fontSize: 12 }}>⭐</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: P.ylw }}>캐스터 새틀릿</span>
          </div>
        )}
        <Bg t={board.league} c={board.league === "챌린저" ? P.red : P.ylw} bg={board.league === "챌린저" ? P.redL : P.ylwL} />
      </div>

      {/* Board header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div style={{ position: "relative" }}>
          <Av n={board.name} s={42} c={board.color} />
          <div style={{ position: "absolute", bottom: -2, right: -2, width: 16, height: 16, borderRadius: "50%", background: isOfficial ? P.blu : P.ylw, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, border: "2px solid #fff" }}>{isOfficial ? "🏛" : "⭐"}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: P.g7 }}>{board.name}</div>
          <div style={{ fontSize: 10, color: P.g4 }}>{board.mem.toLocaleString()}명 · {board.coin}T · BV {board.bv}</div>
        </div>
      </div>

      {/* Election Banner (official planets) */}
      {isOfficial && board.id === 2 && (
        <div style={{ background: "linear-gradient(90deg, " + P.pri + "15, " + P.pnk + "15)", borderRadius: 8, padding: "8px 12px", marginBottom: 8, display: "flex", alignItems: "center", gap: 6, border: "1px solid " + P.pri + "33" }}>
          <span style={{ fontSize: 14 }}>🗳️</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: P.pri }}>홈마스터 선거가 30일 남았습니다</div>
            <button onClick={function () { setElection(true); }} style={{ padding: "4px 10px", borderRadius: 6, background: P.pri, color: "#fff", border: "none", fontSize: 9, cursor: "pointer" }}>상세</button>
            <div style={{ fontSize: 9, color: P.g4 }}>후보 등록: 16일 후 시작 · 현 홈마스터: {mgr.master}</div>
          </div>
          <span style={{ fontSize: 10, color: P.pri, cursor: "pointer", fontWeight: 500 }}>상세 →</span>
        </div>
      )}

      {/* Manager info */}
      <div style={{ background: P.g1, borderRadius: 8, padding: "8px 10px", marginBottom: 8 }}>
        <div style={{ display: "flex", gap: 12, fontSize: 10 }}>
          <div><span style={{ color: P.g4 }}>{isOfficial ? "홈마스터" : "매니저"}: </span><span style={{ fontWeight: 600, color: isOfficial ? P.blu : P.ylw }}>{mgr.master}</span></div>
          <div><span style={{ color: P.g4 }}>부마스터: </span><span style={{ fontWeight: 600, color: P.g7 }}>{mgr.sub}</span></div>
        </div>
      </div>

      {/* 🔴 플래닛 캐스트 시작 - 홈마/부마 전용 */}
      {isOfficial && mgr && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", marginBottom: 8, borderRadius: 8, background: P.red + "11", border: "1px solid " + P.red + "33", cursor: "pointer" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: P.red, boxShadow: "0 0 6px rgba(255,0,0,0.5)" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: P.red }}>이 플래닛에서 캐스트 시작</div>
            <div style={{ fontSize: 8, color: P.g4 }}>👑 홈마스터 · 🛡 부마스터 전용</div>
          </div>
          <span style={{ fontSize: 9, color: P.red, fontWeight: 600 }}>🔴 시작 →</span>
        </div>
      )}

      {/* Join + Attendance */}
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        {joined ? (
          <div style={{ flex: 1, padding: "8px 0", borderRadius: 8, background: P.g1, textAlign: "center", fontSize: 10, color: P.grn, fontWeight: 500 }}>✓ 가입됨 · 정회원</div>
        ) : (
          <button onClick={function () { setJoined(true); }} style={{ flex: 1, padding: "8px 0", borderRadius: 8, background: isOfficial ? P.blu : P.ylw, color: "#fff", border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>플래닛 가입하기</button>
        )}
        <button onClick={function () { if (!checked) setChecked(true); }} style={{ padding: "8px 16px", borderRadius: 8, background: checked ? P.grnL : P.pri, color: checked ? P.grn : "#fff", border: checked ? "1px solid " + P.grn : "none", fontSize: 10, fontWeight: 600, cursor: checked ? "default" : "pointer" }}>
          {checked ? "✓ 출석완료 +1Q" : "🔥 출석체크"}
        </button>
        <button style={{ padding: "8px 10px", borderRadius: 8, background: P.g1, border: "none", fontSize: 10, color: P.g5, cursor: "pointer" }}>대시보드</button>
      </div>

      {/* VS Battle - Category Specific */}
      {isOfficial && (function () {
        var rivals = { "KBO": { name: "KT Wiz", bv: 934, c: "#E3000F" }, "BTS": { name: "BLINK", bv: 612, c: P.pnk }, "BLACKPINK": { name: "STAY", bv: 1105, c: P.crl }, "Stray Kids": { name: "ARMY", bv: 1342, c: P.pur }, "애니": { name: "원피스", bv: 445, c: P.crl } };
        var rival = rivals[board.fan] || rivals["KBO"];
        if (board.name === "원피스") rival = { name: "귀멸의 칼날", bv: 487, c: P.red };
        if (board.name === "KT Wiz") rival = { name: "롯데자이언츠", bv: 986, c: P.blu };
        if (board.name === "BLINK") rival = { name: "ARMY", bv: 1342, c: P.pur };
        var totalBv = board.bv + rival.bv;
        return (
          <>
          <div style={{ background: "linear-gradient(135deg, #1B2838, #2C3E50)", borderRadius: 10, padding: "8px 12px", marginBottom: 10, color: "#fff" }}>
            <div onClick={function () { setVsOpen(!vsOpen); }} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.6)" }}>🏆 {board.fan} 챌린지 · VS 대결</span>
              <span style={{ fontSize: 9, color: P.ylw, marginLeft: "auto" }}>{vsOpen ? "접기 ▲" : "펼치기 ▼"}</span>
            </div>
            {vsOpen && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ flex: 1, textAlign: "center" }}><Av n={board.name} s={28} c={board.color} /><div style={{ fontSize: 9, fontWeight: 600, marginTop: 2 }}>{board.name}</div><div style={{ fontSize: 12, fontWeight: 700, color: P.ylw }}>{board.bv}</div></div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: P.red }}>VS</div>
                  <div style={{ flex: 1, textAlign: "center" }}><Av n={rival.name} s={28} c={rival.c} /><div style={{ fontSize: 9, fontWeight: 600, marginTop: 2 }}>{rival.name}</div><div style={{ fontSize: 12, fontWeight: 700, color: P.ylw }}>{rival.bv}</div></div>
                </div>
                <div style={{ height: 5, borderRadius: 3, background: "rgba(255,255,255,0.15)", overflow: "hidden", display: "flex" }}><div style={{ width: Math.round(board.bv / totalBv * 100) + "%", background: board.color, borderRadius: 3 }} /></div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3, fontSize: 7, color: "rgba(255,255,255,0.5)" }}><span>{Math.round(board.bv / totalBv * 100)}%</span><span>승리 시 +3Q · 남은 시간 2일 14시간</span><span>{Math.round(rival.bv / totalBv * 100)}%</span></div>
              </div>
            )}
          </div>

          {/* 큐빗 가치 추이 + 원장 */}
          <div style={{ borderRadius: 10, border: "1px solid " + P.bdr, padding: "8px 10px", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: P.g7 }}>📈 {board.name} 큐빗 시세</span>
              <span style={{ fontSize: 8, color: P.grn }}>1Q = 2.87캐시 (+2.3%)</span>
            </div>
            <div style={{ height: 50, borderRadius: 6, background: P.g1, marginBottom: 6, position: "relative", overflow: "hidden" }}>
              <svg width="100%" height="50" viewBox="0 0 200 50" preserveAspectRatio="none"><path d="M0,40 C20,38 40,30 60,28 C80,26 100,20 120,18 C140,16 160,22 180,12 L200,10" stroke={P.grn} strokeWidth="1.5" fill="none"/><path d="M0,40 C20,38 40,30 60,28 C80,26 100,20 120,18 C140,16 160,22 180,12 L200,10 L200,50 L0,50Z" fill={P.grn + "15"}/></svg>
            </div>
            <div style={{ fontSize: 8, fontWeight: 600, color: P.g7, marginBottom: 3 }}>📋 큐빗 원장 (최근)</div>
            {[
              { who: "사직의별", act: "+5Q 베스트 보상", time: "10분 전", c: P.grn },
              { who: "직관러_사직", act: "+1Q 출석체크", time: "1시간 전", c: P.grn },
              { who: "부산갈매기_01", act: "-50Q 이모티콘 등록", time: "3시간 전", c: P.red },
              { who: "시스템", act: "-200Q 새틀릿 개설 소각", time: "어제", c: P.red },
            ].map(function (l, i) {
              return <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, padding: "2px 0", fontSize: 8 }}><span style={{ color: P.g4, width: 50 }}>{l.who}</span><span style={{ color: l.c, flex: 1 }}>{l.act}</span><span style={{ color: P.g4 }}>{l.time}</span></div>;
            })}
          </div>
          </>
        );
      })()}

      {/* Live chatroom */}
      {board.live && (
        <div onClick={function () { nav("pubchat"); }} style={{ background: P.redL, borderRadius: 8, padding: "8px 10px", marginBottom: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: P.red }}>🔴 LIVE</span>
          <span style={{ fontSize: 11, color: P.g7 }}>응원방 ({board.liveN}명)</span>
          <span style={{ marginLeft: "auto", fontSize: 10, color: P.red, fontWeight: 600 }}>참여 →</span>
        </div>
      )}

      {/* Recent Broadcasts (satellite only) */}
      {!isOfficial && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: P.g7, marginBottom: 6 }}>최근 캐스트</div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6 }}>
            {[
              { title: "직캠 편집 라이브 🎬", viewers: 45, time: "1시간 전", coins: 89, live: true },
              { title: "구독자 Q&A 시간", viewers: 123, time: "어제", coins: 234, live: false },
              { title: "콘텐츠 기획 브레인스토밍", viewers: 67, time: "3일 전", coins: 56, live: false },
              { title: "팬미팅 비하인드", viewers: 189, time: "5일 전", coins: 312, live: false },
            ].map(function (b, i) {
              return (
                <div key={i} onClick={function () { nav("live"); }} style={{ minWidth: 160, borderRadius: 10, overflow: "hidden", background: P.g7, cursor: "pointer", flexShrink: 0 }}>
                  <div style={{ height: 80, background: "linear-gradient(135deg, " + board.color + ", " + P.pri + ")", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <span style={{ fontSize: 28 }}>📺</span>
                    {b.live && <span style={{ position: "absolute", top: 6, left: 6, background: P.red, color: "#fff", fontSize: 8, fontWeight: 700, padding: "2px 6px", borderRadius: 3 }}>LIVE</span>}
                    <span style={{ position: "absolute", bottom: 4, right: 6, background: "rgba(0,0,0,0.5)", color: "#fff", fontSize: 8, padding: "1px 5px", borderRadius: 3 }}>👁 {b.viewers}</span>
                  </div>
                  <div style={{ padding: "6px 8px" }}>
                    <div style={{ fontSize: 10, fontWeight: 500, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.title}</div>
                    <div style={{ fontSize: 8, color: P.g4, marginTop: 2 }}>{b.time} · {b.coins}큐빗</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Hashtag Tabs */}
      <div style={{ display: "flex", gap: 0, overflowX: "auto", borderBottom: "1px solid " + P.bdr, marginBottom: 8 }}>
        {boardHashtags.map(function (h) {
          var isActive = hashTag === h;
          return (
            <button key={h} onClick={function () { setHashTag(h); }} style={{ padding: "6px 10px", fontSize: 10, fontWeight: isActive ? 600 : 400, color: isActive ? (h === "베스트" ? P.red : P.pri) : P.g4, background: "none", border: "none", borderBottom: isActive ? "2px solid " + (h === "베스트" ? P.red : P.pri) : "2px solid transparent", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>{h}</button>
          );
        })}
      </div>

      {/* Inline Compose */}
      {hashTag !== "소개" && hashTag !== "미디어" && (
        <div style={{ background: P.g1, borderRadius: 10, padding: "8px 10px", marginBottom: 10 }}>
          <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
            <Av n="직관" s={28} c={P.blu} />
            <div style={{ flex: 1 }}>
              <input placeholder={"💭 " + board.name + "에 생각 던지기..."} style={{ width: "100%", padding: "6px 0", border: "none", borderBottom: "1px solid " + P.bdr, fontSize: 12, outline: "none", background: "transparent", boxSizing: "border-box" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                <div style={{ display: "flex", gap: 6, fontSize: 13, color: P.g4 }}><span style={{ cursor: "pointer" }}>🖼</span><span style={{ cursor: "pointer" }}>📊</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 9, color: P.g4, cursor: "pointer" }}><span>☄️</span><span>혜성</span><div style={{ width: 12, height: 12, borderRadius: 3, border: "1.5px solid " + P.g3 }} /></div>
                  <button onClick={function () { nav("planetwrite"); }} style={{ padding: "4px 12px", borderRadius: 14, background: P.pri, color: "#fff", border: "none", fontSize: 10, fontWeight: 600, cursor: "pointer" }}>던지기</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Election Detail Modal */}
      {election && (
        <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, height: "100vh", background: "rgba(0,0,0,0.5)", zIndex: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "88%", background: "#fff", borderRadius: 16, padding: 16, maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <span style={{ fontSize: 16 }}>🗳️</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: P.g7 }}>{board.name} 홈마스터 선거</span>
              <span onClick={function () { setElection(false); }} style={{ marginLeft: "auto", fontSize: 16, color: P.g4, cursor: "pointer" }}>✕</span>
            </div>
            <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
              <div style={{ flex: 1, padding: "6px 0", borderRadius: 6, background: P.priL, textAlign: "center" }}><div style={{ fontSize: 16, fontWeight: 700, color: P.pri }}>30일</div><div style={{ fontSize: 8, color: P.g4 }}>남은 기간</div></div>
              <div style={{ flex: 1, padding: "6px 0", borderRadius: 6, background: P.g1, textAlign: "center" }}><div style={{ fontSize: 16, fontWeight: 700, color: P.g7 }}>3명</div><div style={{ fontSize: 8, color: P.g4 }}>후보자</div></div>
              <div style={{ flex: 1, padding: "6px 0", borderRadius: 6, background: P.g1, textAlign: "center" }}><div style={{ fontSize: 16, fontWeight: 700, color: P.g7 }}>1,247</div><div style={{ fontSize: 8, color: P.g4 }}>유권자</div></div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: P.g7, marginBottom: 6 }}>현재 후보자</div>
            {[
              { name: "부산갈매기_대장", pledges: ["직관 인증 이벤트 월 1회", "VS 대결 활성화", "신규 팬 환영 프로그램"], votes: 456, c: P.blu },
              { name: "사직의별", pledges: ["투수 분석 콘텐츠 주 3회", "경기 실시간 채팅방 운영", "BV 1000 달성 목표"], votes: 312, c: P.pri },
              { name: "응원단장_01", pledges: ["응원가 아카이브 구축", "원정 직관 모임", "홈경기 라이브 캐스트"], votes: 198, c: P.grn },
            ].map(function (c) {
              return (
                <div key={c.name} style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid " + P.bdr, marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <Av n={c.name} s={24} c={c.c} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: P.g7 }}>{c.name}</span>
                    <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 600, color: P.pri }}>{c.votes}표</span>
                  </div>
                  {c.pledges.map(function (p, i) {
                    return <div key={i} style={{ fontSize: 9, color: P.g5, paddingLeft: 8, marginBottom: 1 }}>📌 {p}</div>;
                  })}
                </div>
              );
            })}
            <div style={{ borderTop: "1px solid " + P.bdr, marginTop: 8, paddingTop: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: P.g7, marginBottom: 8 }}>출마하기</div>
              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                <div style={{ flex: 1, padding: 10, borderRadius: 10, background: P.priL, border: "1px solid " + P.pri + "33", textAlign: "center", cursor: "pointer" }}>
                  <div style={{ fontSize: 12 }}>👑</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: P.pri }}>홈마스터 지원</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: P.ylw, marginTop: 2 }}>1,000Q 사용</div>
                </div>
                <div style={{ flex: 1, padding: 10, borderRadius: 10, background: P.ylwL, border: "1px solid " + P.ylw + "33", textAlign: "center", cursor: "pointer" }}>
                  <div style={{ fontSize: 12 }}>🛡️</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: P.ylw }}>부마스터 지원</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: P.ylw, marginTop: 2 }}>600Q 사용</div>
                </div>
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: P.g7, marginBottom: 4 }}>주요 공약 (3개 작성)</div>
              {[1, 2, 3].map(function (n) {
                return <input key={n} placeholder={"공약 " + n + "을 입력하세요"} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid " + P.bdr, fontSize: 11, outline: "none", boxSizing: "border-box", marginBottom: 4 }} />;
              })}
              <button style={{ width: "100%", marginTop: 6, padding: "12px 0", borderRadius: 10, background: P.pri, color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>🗳️ 출마 등록하기</button>
            </div>
          </div>
        </div>
      )}

      {/* Voice Lounge */}
      {isOfficial && hashTag !== "소개" && hashTag !== "미디어" && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", marginBottom: 8, borderRadius: 8, background: P.grnL, border: "1px solid " + P.grn + "33", cursor: "pointer" }}>
          <span style={{ fontSize: 12 }}>🎙</span>
          <span style={{ fontSize: 10, fontWeight: 500, color: P.grn }}>음성 라운지</span>
          <span style={{ fontSize: 9, color: P.g4 }}>3명 대화 중</span>
          <span style={{ marginLeft: "auto", fontSize: 9, color: P.grn, fontWeight: 600 }}>참여 →</span>
        </div>
      )}

      {/* 소개 Tab */}
      {hashTag === "소개" && (
        <div style={{ padding: "8px 0" }}>
          <div style={{ background: P.g1, borderRadius: 10, padding: 12, marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: P.g7, marginBottom: 6 }}>📋 {board.name} 소개</div>
            <div style={{ fontSize: 11, color: P.g5, lineHeight: 1.7 }}>{board.fan === "KBO" ? "부산을 대표하는 KBO 프로야구 팬덤입니다. 사직구장을 중심으로 활동하며, 경기 분석·직관 후기·선수 응원이 주요 콘텐츠입니다." : board.type === "satellite" ? "캐스터가 직접 운영하는 크리에이터 새틀릿입니다. 캐스트, 비하인드, 팬 교류가 주요 활동입니다." : "팬들이 직접 만들어가는 공식 플래닛입니다."}</div>
          </div>
          <div style={{ background: P.g1, borderRadius: 10, padding: 12, marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: P.g7, marginBottom: 6 }}>📌 플래닛 규칙</div>
            {["스포일러는 제목에 [스포] 태그 필수", "타 팬덤 비하 금지 · 위반 시 경고", "2차창작 출처 명시 필수", "혜성(익명) 글도 규칙 적용"].map(function (r, i) {
              return <div key={i} style={{ fontSize: 10, color: P.g5, padding: "3px 0", lineHeight: 1.5 }}>{i + 1}. {r}</div>;
            })}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
            {[{ l: "회원", v: board.mem.toLocaleString() }, { l: "BV", v: board.bv }, { l: "베스트", v: board.best + "개" }].map(function (s) {
              return <div key={s.l} style={{ background: P.g1, borderRadius: 8, padding: 8, textAlign: "center" }}><div style={{ fontSize: 8, color: P.g4 }}>{s.l}</div><div style={{ fontSize: 13, fontWeight: 600, color: P.g7 }}>{s.v}</div></div>;
            })}
          </div>
          <div style={{ background: P.g1, borderRadius: 10, padding: 12, marginTop: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: P.g7, marginBottom: 6 }}>🤖 활성 봇</div>
            {[
              { name: "📰 " + (board.fan === "KBO" ? "KBO뉴스봇" : board.fan === "BTS" ? "K-pop뉴스봇" : "뉴스봇"), type: "RSS 자동 수집", status: "활성", sources: board.fan === "KBO" ? "스포츠조선, OSEN, 야구공작소" : board.fan === "BTS" ? "빌보드코리아, 스타뉴스" : "관련 매체", c: P.blu },
              { name: "📊 스코어봇", type: board.fan === "KBO" ? "KBO 실시간 스코어" : "실시간 데이터", status: board.fan === "KBO" ? "경기 중 활성" : "대기", sources: board.fan === "KBO" ? "KBO 공식" : "공식 API", c: P.grn },
              { name: "🔥 트렌딩봇", type: "실시간 이슈 연동", status: "활성", sources: "OrBit 트렌딩 엔진", c: P.red },
            ].map(function (b) {
              return (
                <div key={b.name} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 0", borderBottom: "1px solid " + P.bdr + "44" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, fontWeight: 500, color: P.g7 }}>{b.name}</div>
                    <div style={{ fontSize: 7, color: P.g4 }}>{b.type} · {b.sources}</div>
                  </div>
                  <span style={{ fontSize: 7, padding: "2px 6px", borderRadius: 4, background: b.status === "활성" || b.status === "경기 중 활성" ? P.grn + "22" : P.g2, color: b.status === "활성" || b.status === "경기 중 활성" ? P.grn : P.g4 }}>{b.status}</span>
                </div>
              );
            })}
            <div style={{ fontSize: 7, color: P.g4, marginTop: 4 }}>홈마스터만 봇을 추가/제거할 수 있습니다</div>
          </div>
          <div style={{ background: P.g1, borderRadius: 10, padding: 12, marginTop: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: P.g7, marginBottom: 6 }}>🛡 매니저 대시보드</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 4, marginBottom: 8 }}>
              {[{ l: "커뮤니티 건강도", v: "92점", c: P.grn }, { l: "활성도 (DAU)", v: "8,900", c: P.pri }, { l: "신고율 (7일)", v: "0.3%", c: P.grn }, { l: "신규 유지율", v: "78%", c: P.blu }].map(function (s) {
                return <div key={s.l} style={{ padding: 6, borderRadius: 6, background: "#fff", textAlign: "center" }}><div style={{ fontSize: 7, color: P.g4 }}>{s.l}</div><div style={{ fontSize: 12, fontWeight: 600, color: s.c }}>{s.v}</div></div>;
              })}
            </div>
            <div style={{ fontSize: 9, fontWeight: 600, color: P.g7, marginBottom: 4 }}>📋 신고 큐 (3건 대기)</div>
            {[
              { title: "스포일러 포함 게시물", reason: "스포일러", reporter: 4, c: P.ylw },
              { title: "광고성 댓글 반복 게시", reason: "스팸", reporter: 2, c: P.red },
              { title: "혐오 표현 포함", reason: "혐오", reporter: 6, c: P.red },
            ].map(function (r) {
              return <div key={r.title} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 6px", marginBottom: 2, borderRadius: 4, background: "#fff", fontSize: 8 }}>
                <span style={{ padding: "1px 4px", borderRadius: 3, background: r.c + "22", color: r.c, fontSize: 7 }}>{r.reason}</span>
                <span style={{ flex: 1, color: P.g7 }}>{r.title}</span>
                <span style={{ color: P.g4 }}>{r.reporter}명</span>
                <span style={{ color: P.grn, cursor: "pointer" }}>✓</span>
                <span style={{ color: P.red, cursor: "pointer" }}>✗</span>
              </div>;
            })}
            <div style={{ fontSize: 7, color: P.g4, marginTop: 4 }}>👑 홈마스터 · 🛡 부마스터만 접근 가능</div>
          </div>
        </div>
      )}

      {/* 미디어 Tab */}
      {hashTag === "미디어" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: P.g7 }}>📷 미디어 갤러리</span>
            <span style={{ fontSize: 9, color: P.g4 }}>24개</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 3 }}>
            {[P.blu, P.pur, P.red, P.ylw, P.pnk, P.grn, P.crl, P.pri, P.blu].map(function (c, i) {
              return <div key={i} style={{ aspectRatio: "1", borderRadius: 6, background: "linear-gradient(135deg, " + c + "33, " + c + "11)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, cursor: "pointer" }}>{["📸", "🎬", "🎨", "📺", "🖼", "🎵", "⚾", "🎭", "📷"][i]}</div>;
            })}
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: P.g7, marginTop: 12, marginBottom: 6 }}>📺 캐스트 다시보기</div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
            {["직관 입중계 하이라이트", "전의리 홈런 직캠", "응원가 떼창"].map(function (t, i) {
              return <div key={i} style={{ minWidth: 130, borderRadius: 10, overflow: "hidden", background: "#111", flexShrink: 0, cursor: "pointer" }}>
                <div style={{ height: 180, background: "linear-gradient(180deg, " + board.color + "44, #111)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <span style={{ fontSize: 28, opacity: 0.5 }}>▶</span>
                  <span style={{ position: "absolute", bottom: 4, right: 6, fontSize: 7, color: "#fff", background: "rgba(0,0,0,0.5)", padding: "1px 4px", borderRadius: 3 }}>{["3:24", "1:47", "5:12"][i]}</span>
                </div>
                <div style={{ padding: "5px 6px" }}><div style={{ fontSize: 9, color: "#fff", fontWeight: 500 }}>{t}</div><div style={{ fontSize: 7, color: "#888", marginTop: 2 }}>{["2일 전", "5일 전", "1주 전"][i]}</div></div>
              </div>;
            })}
          </div>
        </div>
      )}

      {/* Best Posts (when 베스트 tab selected) */}
      {hashTag === "베스트" && (
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: P.red, marginBottom: 6 }}>🏆 {board.name} 베스트</div>
          {ALL_POSTS.filter(function (p) { return p.board === board.name && p.best; }).map(function (p) {
            return (
              <div key={p.id} style={{ padding: "8px 10px", marginBottom: 4, borderRadius: 8, background: P.redL, border: "1px solid " + P.red + "33" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                  <Bg t="BEST +5T" c={P.red} bg="#fff" />
                  <span style={{ fontSize: 10, fontWeight: 600, color: P.g7 }}>{p.author}</span>
                  <span style={{ fontSize: 9, color: P.g4, marginLeft: "auto" }}>{p.time}</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: P.g7 }}>{p.title}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 3, fontSize: 10, color: P.g5 }}><span>▲ {p.likes}</span><span>💬 {p.cmt}</span></div>
              </div>
            );
          })}
          {ALL_POSTS.filter(function (p) { return p.board === board.name && p.best; }).length === 0 && (
            <div style={{ textAlign: "center", padding: "20px 0", color: P.g4, fontSize: 11 }}>아직 베스트 게시물이 없습니다</div>
          )}
        </div>
      )}

      {/* Posts */}
      {hashTag !== "베스트" && ALL_POSTS.filter(function (p) { return p.board === board.name; }).sort(function (a, b) { return (b.isBot && b.trending ? 2 : b.isBot ? 1 : 0) - (a.isBot && a.trending ? 2 : a.isBot ? 1 : 0); }).map(function (p) {
        return (
        <div key={p.id} style={{ padding: "9px 8px", marginBottom: 4, borderRadius: p.isBot ? 8 : 0, background: p.isBot && p.trending ? P.red + "06" : p.isBot ? P.blu + "06" : "transparent", border: p.isBot ? "1px solid " + (p.trending ? P.red : P.blu) + "22" : "none", borderBottom: p.isBot ? "none" : "1px solid " + P.bdr }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
            {p.author === "익명의 팬" ? <span style={{ fontSize: 10, color: P.g4 }}>☄️ 혜성</span> : <span style={{ fontSize: 10, fontWeight: 600, color: p.isBot ? P.blu : P.g7 }}>{p.author}</span>}
            {p.isBot && <span style={{ fontSize: 7, padding: "1px 4px", borderRadius: 3, background: P.blu + "22", color: P.blu, fontWeight: 600 }}>🤖 {p.botType === "rss" ? "RSS" : p.botType === "score" ? "LIVE" : "봇"}</span>}
            {p.trending && <span style={{ fontSize: 7, padding: "1px 4px", borderRadius: 3, background: P.red + "15", color: P.red }}>🔥 트렌딩</span>}
            {p.isBot && p.rssSource && <span style={{ fontSize: 7, color: P.g4 }}>· {p.rssSource}</span>}
            {p.author !== "익명의 팬" && !p.isBot && <span style={{ fontSize: 8, color: P.pri, background: P.priL, padding: "1px 4px", borderRadius: 3 }}>Lv.{p.lv}</span>}
            <span style={{ fontSize: 9, color: P.g4, marginLeft: "auto" }}>{p.time}</span>
          </div>
          {p.best && <Bg t="플래닛 BEST +1T" c={P.ylw} bg={P.ylwL} />}
          <div style={{ fontSize: 12, fontWeight: 500, color: P.g7 }}>{p.title}</div>
          {p.body && <div style={{ fontSize: 10, color: P.g5, marginTop: 2, lineHeight: 1.5 }}>{p.body}</div>}
          <div style={{ display: "flex", gap: 8, marginTop: 4, fontSize: 10, color: P.g4, alignItems: "center" }}>
            <span>👍 {p.likes}</span>
            <span>💬 {p.cmt}</span>
            <span style={{ cursor: "pointer" }}>⭐ 리마인드</span>
            <span style={{ marginLeft: "auto", color: P.blu, cursor: "pointer" }}>🌐</span>
          </div>
          {/* Comments with 3-level tree + roles */}
          {p.cmt > 0 && (
            <div style={{ marginTop: 6, padding: "6px 8px", background: P.g1, borderRadius: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
                <span style={{ fontSize: 9, flex: 1 }}><span style={{ fontWeight: 600, color: P.g7 }}>사직의별</span> <span style={{ fontSize: 7, padding: "0 3px", borderRadius: 3, background: P.ylw + "22", color: P.ylw }}>부마스터</span> <span style={{ color: P.g5 }}>진짜 명장면이다 ㅋㅋ</span></span>
                <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                  <span style={{ fontSize: 7, padding: "1px 4px", borderRadius: 6, background: P.grn + "22", color: P.grn, cursor: "pointer" }}>👍12</span>
                  <span style={{ fontSize: 7, padding: "1px 4px", borderRadius: 6, background: P.g1, color: P.g4, cursor: "pointer" }}>😐</span>
                  <span style={{ fontSize: 7, padding: "1px 4px", borderRadius: 6, background: P.g1, color: P.g4, cursor: "pointer" }}>👎</span>
                </div>
              </div>
              <div style={{ marginLeft: 12, padding: "3px 0 3px 8px", borderLeft: "1.5px solid " + P.pri + "44", marginBottom: 3 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                  <span style={{ fontSize: 8, flex: 1 }}><span style={{ fontWeight: 600, color: P.pri }}>부산갈매기_01</span> <span style={{ color: P.g5 }}>ㄹㅇ 소름돋았다</span></span>
                  <div style={{ display: "flex", gap: 2 }}><span style={{ fontSize: 6, padding: "1px 3px", borderRadius: 4, background: P.grn + "22", color: P.grn }}>👍5</span></div>
                </div>
                <div style={{ marginLeft: 10, padding: "2px 0 2px 6px", borderLeft: "1px solid " + P.g3, marginBottom: 2 }}>
                  <div style={{ fontSize: 7 }}><span style={{ fontWeight: 600, color: P.g7 }}>직관러_사직</span> <span style={{ color: P.g5 }}>현장 분위기 미쳤음 🔥</span></div>
                  <div style={{ fontSize: 7 }}><span style={{ fontWeight: 600, color: P.g7 }}>야구매니아</span> <span style={{ color: P.g5 }}>ㅋㅋ 부럽다</span></div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 3, padding: "3px 0", marginBottom: 3, borderTop: "1px dashed " + P.bdr + "88", paddingTop: 4 }}>
                <span style={{ fontSize: 7, padding: "1px 4px", borderRadius: 4, background: P.blu + "22", color: P.blu }}>🤖 봇</span>
                <span style={{ fontSize: 8, color: P.g5 }}>스코어봇: 롯데 5 - 3 삼성 (7회초)</span>
              </div>
              <div style={{ fontSize: 9, color: P.pri, cursor: "pointer", marginBottom: 4 }}>댓글 {p.cmt}개 모두 보기</div>
              <div style={{ display: "flex", gap: 4 }}>
                <input placeholder="댓글 달기..." style={{ flex: 1, padding: "5px 8px", borderRadius: 12, border: "1px solid " + P.bdr, fontSize: 9, outline: "none", background: "#fff", boxSizing: "border-box" }} />
                <button style={{ padding: "4px 10px", borderRadius: 12, background: P.pri, color: "#fff", border: "none", fontSize: 8, fontWeight: 600, cursor: "pointer" }}>등록</button>
              </div>
            </div>
          )}
        </div>
        );
      })}
    </div>
  );
}

// ========== BROADCAST FEED (TikTok style) ==========
function BroadcastFeed({ nav, setBoard }) {
  const [idx, setIdx] = useState(0);
  const [donateShow, setDonateShow] = useState(false);
  const [coins, setCoins] = useState({});
  const [donations, setDonations] = useState([]);
  const [bTab, setBTab] = useState("공개");
  const [showCastCreate, setShowCastCreate] = useState(false);
  const [castMode, setCastMode] = useState(null);
  const [castReady, setCastReady] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadStep, setUploadStep] = useState(0);
  var castUrl = "orbit.app/cast/Lv3xQw8k";
  const live = LIVES[idx];

  function doDonate(type, amt) {
    setCoins(function (c) { var n = {}; for (var k in c) n[k] = c[k]; n[idx] = (c[idx] || 0) + amt; return n; });
    setDonations(function (d) { return [{ type: type, amt: amt, t: Date.now(), user: ["팬A", "팬B", "팬C"][Math.floor(Math.random() * 3)] }].concat(d).slice(0, 3); });
    setTimeout(function () { setDonations(function (d) { return d.slice(0, -1); }); }, 3000);
  }

  function handleScroll(e) {
    var el = e.target;
    var snapIdx = Math.round(el.scrollTop / el.clientHeight);
    if (snapIdx !== idx && snapIdx >= 0 && snapIdx < LIVES.length) {
      setIdx(snapIdx);
      setDonateShow(false);
      setDonations([]);
    }
  }

  return (
    <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, height: "100vh", zIndex: 30, background: "#000" }}>
      {/* Broadcast Header Tabs */}
      <div style={{ display: "flex", alignItems: "center", padding: "10px 14px 6px", background: "rgba(0,0,0,0.6)", position: "relative", zIndex: 10 }}>
        {["공개", "친구", "팔로우"].map(function (t) {
          return <button key={t} onClick={function () { setBTab(t); }} style={{ padding: "4px 16px", fontSize: 13, fontWeight: bTab === t ? 700 : 400, color: bTab === t ? "#fff" : "rgba(255,255,255,0.5)", background: "none", border: "none", borderBottom: bTab === t ? "2px solid #fff" : "2px solid transparent", cursor: "pointer" }}>{t}</button>;
        })}
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          <button onClick={function () { setShowCastCreate(true); setCastMode(null); setCastReady(false); }} style={{ display: "flex", alignItems: "center", gap: 3, padding: "4px 10px", borderRadius: 8, background: "rgba(255,0,0,0.3)", border: "1px solid rgba(255,0,0,0.4)", cursor: "pointer" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff3b3b", display: "inline-block", boxShadow: "0 0 6px rgba(255,0,0,0.6)" }} />
            <span style={{ fontSize: 10, color: "#fff", fontWeight: 700 }}>LIVE</span>
          </button>
          <button onClick={function () { setShowUpload(true); setUploadStep(0); }} style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M10 16V4M10 4L5 9M10 4L15 9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
      {/* Feed subtitle */}
      <div style={{ padding: "0 14px 4px", background: "rgba(0,0,0,0.4)" }}>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>{bTab === "공개" ? "🧠 마인드맵 AI 추천 알고리즘" : bTab === "친구" ? "친구의 실시간 · 최근 캐스트" : "팔로우 중인 크리에이터"}</span>
      </div>

      {/* Upload Flow Overlay */}
      {showUpload && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.92)", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "85%", maxWidth: 340 }}>
            {uploadStep === 0 && (
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: 36 }}>📤</span>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginTop: 8, marginBottom: 4 }}>영상 업로드</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>갤러리에서 영상을 선택하세요</div>
                <div style={{ height: 120, borderRadius: 12, border: "2px dashed rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, cursor: "pointer" }}>
                  <div style={{ textAlign: "center" }}><div style={{ fontSize: 24, marginBottom: 4 }}>📁</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>탭하여 영상 선택</div></div>
                </div>
                <button onClick={function () { setUploadStep(1); }} style={{ width: "100%", padding: "14px 0", borderRadius: 12, background: P.pri, color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>다음 →</button>
                <div onClick={function () { setShowUpload(false); }} style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>취소</div>
              </div>
            )}
            {uploadStep === 1 && (
              <div>
                <div style={{ textAlign: "center", marginBottom: 14 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>편집</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>필터 · 스티커 · 음악을 추가하세요</div>
                </div>
                <div style={{ height: 140, borderRadius: 12, background: "linear-gradient(135deg, " + P.pri + "44, " + P.pnk + "44)", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 36, opacity: 0.5 }}>🎬</span>
                </div>
                <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                  {[{ icon: "🎨", label: "필터", active: true }, { icon: "😀", label: "스티커", active: false }, { icon: "🎵", label: "음악", active: false }].map(function (e) {
                    return <div key={e.label} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: e.active ? "2px solid " + P.pri : "1px solid rgba(255,255,255,0.15)", background: e.active ? P.pri + "22" : "rgba(255,255,255,0.05)", textAlign: "center", cursor: "pointer" }}>
                      <div style={{ fontSize: 20, marginBottom: 2 }}>{e.icon}</div>
                      <div style={{ fontSize: 9, color: e.active ? P.pri : "rgba(255,255,255,0.5)" }}>{e.label}</div>
                    </div>;
                  })}
                </div>
                <div style={{ display: "flex", gap: 4, marginBottom: 14, overflowX: "auto" }}>
                  {["원본", "빈티지", "따뜻한", "차가운", "흑백", "네온"].map(function (f, i) {
                    return <div key={f} style={{ minWidth: 50, height: 50, borderRadius: 8, background: [P.g4, P.ylw, P.red, P.blu, P.g7, P.pnk][i] + "33", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#fff", cursor: "pointer", border: i === 0 ? "2px solid " + P.pri : "none", flexShrink: 0 }}>{f}</div>;
                  })}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>😀 스티커</span>
                    <div style={{ marginLeft: "auto", display: "flex", gap: 2 }}>
                      <span style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>◀</span>
                      <span style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>▶</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 3, overflow: "hidden" }}>
                    {["😆 웃김", "🔥 핫", "💖 하트", "⭐ 별", "🎉 축하", "😎 멋짐", "🏆 우승", "⚾ 야구"].map(function (s, i) {
                      return <span key={i} style={{ padding: "4px 8px", borderRadius: 8, background: "rgba(255,255,255,0.08)", fontSize: 9, color: "rgba(255,255,255,0.6)", whiteSpace: "nowrap", cursor: "pointer", flexShrink: 0 }}>{s}</span>;
                    })}
                  </div>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>🎵 음악</span>
                    <div style={{ marginLeft: "auto", display: "flex", gap: 2 }}>
                      <span style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>◀</span>
                      <span style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>▶</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 3, overflow: "hidden" }}>
                    {["🎵 Energetic Pop", "🎸 Acoustic", "🎹 Lo-fi", "🥁 Hype Beat", "🎻 Cinematic"].map(function (m, i) {
                      return <span key={i} style={{ padding: "4px 8px", borderRadius: 8, background: "rgba(255,255,255,0.08)", fontSize: 9, color: "rgba(255,255,255,0.6)", whiteSpace: "nowrap", cursor: "pointer", flexShrink: 0 }}>{m}</span>;
                    })}
                  </div>
                </div>
                <button onClick={function () { setUploadStep(2); }} style={{ width: "100%", padding: "14px 0", borderRadius: 12, background: P.pri, color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>다음 →</button>
              </div>
            )}
            {uploadStep === 2 && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 4 }}>업로드 완료!</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 14 }}>캐스트가 성공적으로 업로드되었습니다</div>
                <input placeholder="제목을 입력하세요" style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 10 }} />
                <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                  {["전체공개", "구독자전용", "VIP전용"].map(function (t, i) {
                    return <div key={t} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: i === 0 ? "1.5px solid " + P.pri : "1px solid rgba(255,255,255,0.15)", textAlign: "center", fontSize: 10, color: i === 0 ? P.pri : "rgba(255,255,255,0.5)", cursor: "pointer" }}>{t}</div>;
                  })}
                </div>
                <button onClick={function () { setShowUpload(false); }} style={{ width: "100%", padding: "14px 0", borderRadius: 12, background: P.grn, color: "#fff", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>🛰 게시하기</button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Cast Creation Overlay */}
      {showCastCreate && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.92)", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "85%", maxWidth: 340 }}>
            {!castReady ? (
              <div>
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <span style={{ fontSize: 36 }}>🛰</span>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginTop: 8 }}>캐스트 시작</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>캐스트 모드를 선택하세요</div>
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                  {[
                    { id: "ar", icon: "📸", label: "AR 필터", desc: "실시간 얼굴 필터 적용", c: P.grn },
                    { id: "2d", icon: "🎭", label: "2D 아바타", desc: "Live2D 캐릭터로 캐스트", c: P.pri },
                    { id: "3d", icon: "🥽", label: "3D VR", desc: "VR 아바타 풀바디 모션", c: P.pnk },
                  ].map(function (m) {
                    var isSel = castMode === m.id;
                    return (
                      <div key={m.id} onClick={function () { setCastMode(m.id); }} style={{ flex: 1, padding: "14px 6px", borderRadius: 12, border: isSel ? "2px solid " + m.c : "1px solid rgba(255,255,255,0.15)", background: isSel ? m.c + "22" : "rgba(255,255,255,0.05)", textAlign: "center", cursor: "pointer" }}>
                        <div style={{ fontSize: 28, marginBottom: 6 }}>{m.icon}</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: isSel ? m.c : "rgba(255,255,255,0.7)" }}>{m.label}</div>
                        <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>{m.desc}</div>
                      </div>
                    );
                  })}
                </div>
                <input placeholder="캐스트 제목을 입력하세요" style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 12 }} />
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                  {["전체공개", "구독자전용", "VIP전용"].map(function (t, i) {
                    return <div key={t} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: i === 0 ? "1.5px solid " + P.ylw : "1px solid rgba(255,255,255,0.15)", textAlign: "center", fontSize: 10, color: i === 0 ? P.ylw : "rgba(255,255,255,0.5)", cursor: "pointer" }}>{t}</div>;
                  })}
                </div>
                <button onClick={function () { if (castMode) setCastReady(true); }} style={{ width: "100%", padding: "14px 0", borderRadius: 12, background: castMode ? P.red : "rgba(255,255,255,0.1)", color: "#fff", border: "none", fontSize: 15, fontWeight: 700, cursor: castMode ? "pointer" : "default", letterSpacing: 1 }}>
                  {castMode ? "🔴 ON AIR" : "모드를 선택하세요"}
                </button>
                <div onClick={function () { setShowCastCreate(false); }} style={{ textAlign: "center", marginTop: 12, fontSize: 11, color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>취소</div>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🔴</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 4 }}>캐스트 준비 완료!</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>{castMode === "ar" ? "📸 AR 필터" : castMode === "2d" ? "🎭 2D 아바타" : "🥽 3D VR"} 모드</div>
                <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: 14, marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>캐스트 링크</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: P.ylw, marginBottom: 10, wordBreak: "break-all" }}>{castUrl}</div>
                  <button style={{ width: "100%", padding: "10px 0", borderRadius: 8, background: P.pri, color: "#fff", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>링크 복사하기</button>
                </div>
                <button onClick={function () { setShowCastCreate(false); }} style={{ width: "100%", padding: "14px 0", borderRadius: 12, background: P.red, color: "#fff", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>🛰 캐스트 시작</button>
              </div>
            )}
          </div>
        </div>
      )}
      <div onScroll={handleScroll} style={{ height: "calc(100vh - 56px - 72px)", overflowY: "scroll", scrollSnapType: "y mandatory" }}>
        {LIVES.map(function (l, i) {
          return (
            <div key={l.id} style={{ height: "calc(100vh - 56px - 72px)", scrollSnapAlign: "start", position: "relative", background: "linear-gradient(135deg, " + l.c1 + ", " + l.c2 + ")", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 8, zIndex: 2 }}>
                <Av n={l.user} s={36} c="#fff" on={true} />
                {l.collab && <Av n={l.collab.user} s={28} c={P.pnk} on={true} />}
                <div><div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{l.user}{l.collab ? " × " + l.collab.user : ""}</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>{l.collab ? "콜라보 캐스트 · " : ""}구독자 {[1200, 340, 890, 560, 1800, 8900, 6200][i]}명</div></div>
                <button style={{ marginLeft: "auto", padding: "5px 14px", borderRadius: 6, background: "rgba(255,255,255,0.2)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>+ 구독</button>
              </div>
              {/* Access tier badge */}
              {i === 1 && <div style={{ padding: "0 14px", zIndex: 2 }}><span style={{ fontSize: 8, padding: "2px 8px", borderRadius: 4, background: "rgba(239,159,39,0.8)", color: "#fff", fontWeight: 600 }}>🔑 구독자 전용</span></div>}
              {i === 3 && <div style={{ padding: "0 14px", zIndex: 2 }}><span style={{ fontSize: 8, padding: "2px 8px", borderRadius: 4, background: "rgba(226,75,74,0.8)", color: "#fff", fontWeight: 600 }}>👑 VIP 전용</span></div>}
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                {l.collab ? (
                  <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    <div style={{ width: 70, height: 70, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, border: "2px solid rgba(255,255,255,0.3)" }}>{l.emo}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>×</div>
                    <div style={{ width: 70, height: 70, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, border: "2px solid " + P.pnk + "66" }}>{l.collab.emo}</div>
                    <div style={{ position: "absolute", top: -10, background: "rgba(0,0,0,0.5)", padding: "3px 10px", borderRadius: 6 }}><span style={{ fontSize: 9, color: P.ylw, fontWeight: 600 }}>👥 {l.user} × {l.collab.user} 콜라보</span></div>
                  </div>
                ) : (
                  <div style={{ width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>{l.emo}</div>
                )}
              </div>
              <div style={{ position: "absolute", bottom: 80, left: 14, right: 70, zIndex: 2 }}>
                {i === idx && donations.map(function (d) {
                  return (
                    <div key={d.t} style={{ background: d.type === "음성" ? "rgba(226,75,74,0.85)" : "rgba(0,0,0,0.5)", borderRadius: 8, padding: "5px 10px", marginBottom: 4, fontSize: 11, color: "#fff" }}>
                      {d.user}: {d.type} 도네! <span style={{ color: P.ylw, fontWeight: 600 }}>+{d.amt}T</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ padding: "0 14px", zIndex: 2, position: "absolute", bottom: 180, left: 0, right: 60 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 4, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>{l.title}</div>
                <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>{l.tags.map(function (tg) { return <span key={tg} style={{ fontSize: 9, padding: "2px 7px", borderRadius: 10, background: "rgba(255,255,255,0.2)", color: "#fff" }}>#{tg}</span>; })}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 9, color: "rgba(255,255,255,0.5)" }}><span style={{ width: 5, height: 5, borderRadius: 3, background: P.pri }} />{l.reason}</div>
              </div>
              {/* 실시간 채팅 오버레이 */}
              <div style={{ position: "absolute", bottom: 50, left: 10, right: 60, zIndex: 2, maxHeight: 120, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <style>{"@keyframes chatFade { 0% { opacity: 0; transform: translateY(10px); } 10% { opacity: 1; transform: translateY(0); } 90% { opacity: 1; } 100% { opacity: 0.3; } }"}</style>
                {[
                  { user: "사직의별", text: "전의리 오늘 폼 미쳤다 🔥", delay: 0 },
                  { user: "부산갈매기_01", text: "사직 분위기 역대급!!", delay: 1 },
                  { user: "야구매니아", text: "슬라이더 회전수 체감된다", delay: 2 },
                  { user: "직관러_부산", text: "치킨 먹으면서 보는 중 ㅋㅋ", delay: 3 },
                  { user: "롯데사랑", text: "전의리 시즌 12호!!!", delay: 4 },
                  { user: "📡 시그널 연동", text: "직관 단톡방에서 실시간 중계 중", delay: 5 },
                ].map(function (ch, ci) {
                  return <div key={ci} style={{ padding: "3px 8px", marginBottom: 2, borderRadius: 8, background: ch.user === "📡 시그널 연동" ? "rgba(108,92,231,0.3)" : "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)", animation: "chatFade 8s " + (ch.delay * 1.5) + "s infinite", fontSize: 10, color: "#fff" }}><span style={{ fontWeight: 600, color: ch.user === "📡 시그널 연동" ? P.pri : P.ylw, marginRight: 4, fontSize: 9 }}>{ch.user}</span>{ch.text}</div>;
                })}
              </div>
              <div style={{ position: "absolute", right: 10, bottom: 100, display: "flex", flexDirection: "column", gap: 10, alignItems: "center", zIndex: 2 }}>
                {/* Planet shortcut */}
                <div style={{ textAlign: "center" }}><div onClick={function () { var bid = l.boardId; if (bid) { var found = BOARDS.filter(function (b) { return b.id === bid; }); if (found.length > 0) { setBoard(found[0]); nav("boardDetail"); } } }} style={{ width: 36, height: 36, borderRadius: "50%", background: l.boardId ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, cursor: l.boardId ? "pointer" : "default", border: l.boardId ? "1.5px solid rgba(255,255,255,0.4)" : "none" }}>{l.boardId && BOARDS.filter(function (b) { return b.id === l.boardId; })[0] && BOARDS.filter(function (b) { return b.id === l.boardId; })[0].type === "satellite" ? "⭐" : "🏛"}</div><div style={{ fontSize: 7, color: "#fff", marginTop: 1 }}>플래닛</div></div>
                {/* Collab */}
                <div style={{ textAlign: "center" }}><div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, cursor: "pointer" }}>👥</div><div style={{ fontSize: 7, color: "#fff", marginTop: 1 }}>콜라보</div></div>
                {/* Like */}
                <div style={{ textAlign: "center" }}><div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>♥</div><div style={{ fontSize: 8, color: "#fff", marginTop: 1 }}>{l.viewers}</div></div>
                {/* Chat */}
                <div style={{ textAlign: "center" }}><div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>💬</div><div style={{ fontSize: 8, color: "#fff", marginTop: 1 }}>{Math.floor(l.viewers * 2.3)}</div></div>
                {/* Donate */}
                <div style={{ textAlign: "center" }}><div onClick={function () { setDonateShow(!donateShow); }} style={{ width: 36, height: 36, borderRadius: "50%", background: P.ylw, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, cursor: "pointer" }}>💰</div><div style={{ fontSize: 8, color: "#fff", marginTop: 1 }}>{(coins[idx] || 0) + l.coins}Q</div></div>
                {/* Pin */}
                <div style={{ textAlign: "center" }}><div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, cursor: "pointer" }}>📌</div><div style={{ fontSize: 7, color: "#fff", marginTop: 1 }}>핀</div></div>
                {/* Remind Save */}
                <div style={{ textAlign: "center" }}><div style={{ width: 36, height: 36, borderRadius: "50%", background: P.ylw, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>⭐</div><div style={{ fontSize: 7, color: "#fff", marginTop: 1 }}>리마인드</div></div>
              </div>
              <div style={{ position: "absolute", top: 60, left: 14, display: "flex", gap: 6, zIndex: 2 }}>
                <span style={{ background: P.red, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4 }}>LIVE</span>
                <span style={{ background: "rgba(0,0,0,0.4)", color: "#fff", fontSize: 10, padding: "3px 8px", borderRadius: 4 }}>👁 {l.viewers}</span>
              </div>
              {donateShow && i === idx && (
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.8)", borderRadius: "16px 16px 0 0", padding: "12px 14px 16px", zIndex: 5, backdropFilter: "blur(8px)" }}>
                  <div style={{ display: "flex", gap: 0, marginBottom: 8 }}>
                    <button onClick={function () { }} style={{ flex: 1, padding: "5px 0", fontSize: 11, fontWeight: 600, color: "#fff", background: "none", border: "none", borderBottom: "2px solid #fff", cursor: "pointer" }}>코인 도네이션</button>
                    <button onClick={function () { }} style={{ flex: 1, padding: "5px 0", fontSize: 11, color: "rgba(255,255,255,0.5)", background: "none", border: "none", borderBottom: "2px solid transparent", cursor: "pointer" }}>🎁 기프트콘</button>
                  </div>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                    {[{ i: "💬", n: "텍스트", a: 5, c: P.blu }, { i: "🎤", n: "음성", a: 10, c: P.red }, { i: "💃", n: "모션", a: 3, c: P.pri }, { i: "🎁", n: "선물", a: 5, c: P.pnk }, { i: "⭐", n: "구독", a: 10, c: P.ylw }].map(function (d) {
                      return (
                        <button key={d.n} onClick={function () { doDonate(d.n, d.a); }} style={{ width: 56, padding: "10px 0", borderRadius: 10, background: d.c + "22", border: "1px solid " + d.c + "44", cursor: "pointer", textAlign: "center" }}>
                          <div style={{ fontSize: 18 }}>{d.i}</div>
                          <div style={{ fontSize: 9, fontWeight: 600, color: d.c, marginTop: 2 }}>{d.n}</div>
                          <div style={{ fontSize: 8, color: P.g4 }}>{d.a}T</div>
                        </button>
                      );
                    })}
                  </div>
                  <button onClick={function () { setDonateShow(false); }} style={{ width: "100%", marginTop: 10, padding: "8px 0", borderRadius: 8, background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", fontSize: 11, cursor: "pointer" }}>닫기</button>
                </div>
              )}
              {/* 💭 생각 던지기 미니 입력란 */}
              <div style={{ position: "absolute", bottom: 8, left: 14, right: 60, zIndex: 2 }}>
                <div style={{ display: "flex", gap: 4, alignItems: "center", background: "rgba(0,0,0,0.5)", borderRadius: 20, padding: "4px 6px", backdropFilter: "blur(4px)" }}>
                  <span style={{ fontSize: 10 }}>💭</span>
                  <input placeholder="지금 떠오른 생각을 던지세요..." style={{ flex: 1, padding: "4px 6px", borderRadius: 12, border: "none", fontSize: 9, outline: "none", background: "rgba(255,255,255,0.15)", color: "#fff", boxSizing: "border-box" }} />
                  <button style={{ padding: "3px 8px", borderRadius: 10, background: P.pri, color: "#fff", border: "none", fontSize: 8, fontWeight: 600, cursor: "pointer" }}>🧠</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ height: 56, background: "#111", display: "flex", borderTop: "1px solid #333" }}>
        {[{ id: "home", l: "홈", ic: "⌂" }, { id: "board", l: "플래닛", ic: "🪐" }, { id: "live", l: "캐스트", ic: "🛰", active: true }, { id: "msg", l: "시그널", ic: "📡" }, { id: "me", l: "프로필", ic: "●" }].map(function (n) {
          return (
            <button key={n.id} onClick={function () { if (n.id !== "live") nav(n.id); }} style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1 }}>
              <span style={{ fontSize: 16, color: n.active ? "#fff" : "#666" }}>{n.ic}</span>
              <span style={{ fontSize: 9, color: n.active ? "#fff" : "#666", fontWeight: n.active ? 600 : 400 }}>{n.l}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ========== PUBLIC CHAT ==========
function PubChat({ nav }) {
  const [msgs, setMsgs] = useState(ROOM_MSGS);
  const [inp, setInp] = useState("");
  const ref = useRef(null);
  useEffect(function () { if (ref.current) ref.current.scrollIntoView({ behavior: "smooth" }); }, [msgs]);
  function send() { if (!inp.trim()) return; setMsgs(function (p) { return [...p, { who: "직관러_사직", text: inp }]; }); setInp(""); setTimeout(function () { setMsgs(function (p) { return [...p, { who: ["부산갈매기_01", "사직의별", "롯데매니아"][Math.floor(Math.random() * 3)], text: ["ㅋㅋㅋ", "대박!", "화이팅!"][Math.floor(Math.random() * 3)] }]; }); }, 500); }
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)", marginTop: -12 }}>
      <div style={{ padding: "8px 0", borderBottom: "1px solid " + P.bdr, display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: P.redL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🏟️</div>
        <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 600, color: P.g7 }}>롯데 vs 삼성 응원방 <span style={{ color: P.red }}>●</span></div><div style={{ display: "flex", alignItems: "center", gap: 3 }}><span style={{ fontSize: 9, color: P.g4 }}>127명</span><Lk /><span style={{ fontSize: 9, color: P.grn }}>E2EE</span></div></div>
        <button onClick={function () { nav("live"); }} style={{ padding: "3px 7px", borderRadius: 5, background: P.red, color: "#fff", border: "none", fontSize: 9, fontWeight: 600, cursor: "pointer" }}>🛰 캐스트</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "6px 0" }}>
        <div style={{ textAlign: "center", margin: "4px 0 6px" }}><span style={{ display: "inline-flex", alignItems: "center", gap: 3, background: P.grnL, padding: "2px 8px", borderRadius: 8, fontSize: 8, color: P.grn }}><Lk />E2EE 암호화</span></div>
        {msgs.map(function (m, i) { return <div key={i} style={{ padding: "3px 6px" }}><span style={{ fontSize: 10, fontWeight: 600, color: m.who === "직관러_사직" ? P.pri : P.blu, marginRight: 4 }}>{m.who}</span><span style={{ fontSize: 11, color: P.g7 }}>{m.text}</span></div>; })}
        <div ref={ref} />
      </div>
      <div style={{ display: "flex", gap: 5, padding: "6px 0", borderTop: "1px solid " + P.bdr, flexShrink: 0 }}>
        <input value={inp} onChange={function (e) { setInp(e.target.value); }} onKeyDown={function (e) { if (e.key === "Enter") { e.preventDefault(); send(); } }} placeholder="응원 메시지..." style={{ flex: 1, padding: "7px 11px", borderRadius: 16, border: "1px solid " + P.bdr, fontSize: 11, outline: "none", background: P.g1, boxSizing: "border-box" }} />
        <button onClick={send} style={{ width: 30, height: 30, borderRadius: "50%", background: inp.trim() ? P.pri : P.g2, border: "none", cursor: inp.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13" stroke="#fff" strokeWidth="2" strokeLinecap="round" /><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
      </div>
      {/* 💭 캐스트 중 생각 던지기 → 마인드맵 */}
      <div style={{ display: "flex", gap: 4, padding: "4px 0", borderTop: "1px dashed " + P.pri + "33" }}>
        <span style={{ fontSize: 12, lineHeight: "26px" }}>💭</span>
        <input placeholder="지금 떠오른 생각을 던지세요..." style={{ flex: 1, padding: "5px 10px", borderRadius: 14, border: "1px solid " + P.pri + "33", fontSize: 10, outline: "none", background: P.priL, boxSizing: "border-box", color: P.g7 }} />
        <button style={{ padding: "4px 10px", borderRadius: 14, background: P.pri, color: "#fff", border: "none", fontSize: 9, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>🧠 저장</button>
      </div>
    </div>
  );
}

// ========== MESSAGES ==========
function MsgList({ nav, setChat }) {
  const [tab, setTab] = useState("채널");
  const [collapsed, setCollapsed] = useState({});
  const [storyAlert, setStoryAlert] = useState(null);

  var channels = {
    dm: { label: "📬 다이렉트 시그널", items: CHATS.filter(function (c) { return !c.isGroup && !c.isPublic; }) },
    group: { label: "👥 그룹 시그널", items: CHATS.filter(function (c) { return c.isGroup && !c.isPublic; }) },
    planet: { label: "🏛 플래닛 채널", items: CHATS.filter(function (c) { return c.isPublic; }) },
  };

  var friendMinds = [
    { name: "사직의별", thought: "나주환 슬라이더 체크 중", emo: "🤔", ac: P.blu, time: "3분" },
    { name: "댄스유나", thought: "Running Wild 안무 발견!", emo: "😲", ac: P.pnk, time: "12분" },
    { name: "귀멸마스터", thought: "무한성 편 작화 미쳤다", emo: "🔥", ac: P.red, time: "1시간" },
    { name: "해적왕루피", thought: "이무 능력 정리 중...", emo: "📝", ac: P.crl, time: "2시간" },
  ];

  var friends = [
    { name: "사직의별", lv: 51, ac: P.blu, on: true, lastAct: "마인드맵 업데이트", time: "3분 전" },
    { name: "댄스커버_유나", lv: 31, ac: P.pnk, on: true, lastAct: "캐스트 중 🔴", time: "지금" },
    { name: "귀멸_마스터", lv: 44, ac: P.red, on: false, lastAct: "플래닛 활동", time: "1시간 전" },
    { name: "부산갈매기_01", lv: 28, ac: P.blu, on: true, lastAct: "응원방 참여 중", time: "지금" },
    { name: "purple_rain_07", lv: 28, ac: P.pur, on: false, lastAct: "오프라인", time: "어제" },
  ];

  function toggleCollapse(key) { setCollapsed(function (p) { var n = {}; for (var k in p) n[k] = p[k]; n[key] = !p[key]; return n; }); }

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 0 }}>
        {["채널", "친구"].map(function (t) {
          return <button key={t} onClick={function () { setTab(t); }} style={{ padding: "6px 0", fontSize: 13, fontWeight: tab === t ? 600 : 400, color: tab === t ? P.g7 : P.g4, background: "none", border: "none", borderBottom: tab === t ? "2px solid " + P.g7 : "2px solid transparent", cursor: "pointer", marginRight: 14 }}>{t}</button>;
        })}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 3, background: P.grnL, padding: "2px 6px", borderRadius: 5 }}><Lk /><span style={{ fontSize: 9, fontWeight: 600, color: P.grn }}>E2EE</span></div>
      </div>

      {tab === "채널" && (
        <div>
          {/* Story-style Mindmap Clouds */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "10px 0", borderBottom: "1px solid " + P.bdr, marginBottom: 6 }}>
            {/* My story add */}
            <div onClick={function () { setStoryAlert({ name: "나", thought: "오늘 사직 직관! 전의리 화이팅 🔥", hours: 20, ac: P.pri, isMine: true }); }} style={{ textAlign: "center", flexShrink: 0, width: 56, cursor: "pointer" }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", border: "2px solid " + P.pri, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: P.pri, background: P.priL, position: "relative" }}>
                💭
                <div style={{ position: "absolute", bottom: -2, right: -2, width: 14, height: 14, borderRadius: "50%", background: P.pri, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#fff", border: "2px solid #fff" }}>+</div>
              </div>
              <div style={{ fontSize: 7, color: P.pri, marginTop: 2, fontWeight: 600 }}>내 시그널</div>
            </div>
            {friendMinds.map(function (fm) {
              var hours = fm.time.includes("분") ? 23 : fm.time.includes("1시간") ? 22 : 20;
              return (
                <div key={fm.name} onClick={function () { setStoryAlert({ name: fm.name, thought: fm.thought, hours: hours, ac: fm.ac, isMine: false }); }} style={{ textAlign: "center", flexShrink: 0, width: 56, cursor: "pointer" }}>
                  <div style={{ position: "relative" }}>
                    <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg, " + fm.ac + ", " + fm.ac + "88)", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "#fff", padding: 2, boxSizing: "border-box" }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: fm.ac + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: fm.ac, fontWeight: 700 }}>{fm.name.slice(0, 2)}</div>
                    </div>
                    <div style={{ position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)", background: "#fff", borderRadius: 10, padding: "2px 6px", boxShadow: "0 1px 4px rgba(0,0,0,0.12)", border: "1px solid " + fm.ac + "33", maxWidth: 72, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      <span style={{ fontSize: 7, color: fm.ac, fontWeight: 500 }}>💭 {fm.thought.slice(0, 8)}...</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 7, color: P.g7, marginTop: 2, fontWeight: 500 }}>{fm.name}</div>
                  <div style={{ fontSize: 6, color: P.g4 }}>{fm.time}</div>
                </div>
              );
            })}
          </div>

          {/* Story Alert Modal */}
          {storyAlert && (
            <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, height: "100vh", background: "rgba(0,0,0,0.5)", zIndex: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "80%", background: "#fff", borderRadius: 16, padding: 20, textAlign: "center" }}>
                <div style={{ width: 50, height: 50, borderRadius: "50%", background: storyAlert.ac + "22", margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>💭</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: P.g7, marginBottom: 4 }}>{storyAlert.name}의 시그널</div>
                <div style={{ fontSize: 12, color: P.g5, lineHeight: 1.6, marginBottom: 10, padding: "8px 12px", background: P.g1, borderRadius: 8 }}>"{storyAlert.thought}"</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 14 }}>
                  <span style={{ fontSize: 12, color: P.ylw }}>⏳</span>
                  <span style={{ fontSize: 11, color: P.ylw, fontWeight: 600 }}>{storyAlert.hours}시간 남았습니다</span>
                </div>
                {storyAlert.isMine ? (
                  <div>
                    <div style={{ fontSize: 10, color: P.g4, marginBottom: 10 }}>내 시그널을 마인드맵에 저장할까요?</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={function () { setStoryAlert(null); }} style={{ flex: 1, padding: "10px 0", borderRadius: 10, background: P.g1, color: P.g5, border: "none", fontSize: 12, cursor: "pointer" }}>닫기</button>
                      <button onClick={function () { setStoryAlert(null); }} style={{ flex: 1, padding: "10px 0", borderRadius: 10, background: P.pri, color: "#fff", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>🧠 마인드맵에 저장</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 10, color: P.g4, marginBottom: 10 }}>친구의 시그널은 열람만 가능합니다</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={function () { setStoryAlert(null); }} style={{ flex: 1, padding: "10px 0", borderRadius: 10, background: P.g1, color: P.g5, border: "none", fontSize: 12, cursor: "pointer" }}>닫기</button>
                      <button onClick={function () { setStoryAlert(null); }} style={{ flex: 1, padding: "10px 0", borderRadius: 10, background: P.pri, color: "#fff", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>💬 시그널 보내기</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Discord-style Channel List */}
          {["dm", "group", "planet"].map(function (key) {
            var cat = channels[key];
            var isOpen = !collapsed[key];
            return (
              <div key={key} style={{ marginBottom: 4 }}>
                <div onClick={function () { toggleCollapse(key); }} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 4px", cursor: "pointer" }}>
                  <span style={{ fontSize: 8, color: P.g4, transition: "transform 0.2s", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: P.g5, textTransform: "uppercase", letterSpacing: 0.5 }}>{cat.label}</span>
                  <span style={{ fontSize: 8, color: P.g4, marginLeft: "auto" }}>{cat.items.length}</span>
                </div>
                {isOpen && cat.items.map(function (ch) {
                  return (
                    <div key={ch.id} onClick={function () { setChat(ch); nav(ch.isPublic ? "pubchat" : "chat"); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 8px 7px 20px", cursor: "pointer", borderRadius: 6, background: ch.unread > 0 ? P.priL : "transparent", marginBottom: 1 }}>
                      <span style={{ fontSize: 11, color: key === "planet" ? P.red : P.g4 }}>{key === "dm" ? "💌" : key === "group" ? "💬" : "📢"}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                          <span style={{ fontSize: 11, fontWeight: ch.unread > 0 ? 700 : 400, color: ch.unread > 0 ? P.g7 : P.g5 }}>{ch.name}</span>
                          {ch.isPublic && ch.mem && <span style={{ fontSize: 7, color: P.g4 }}>{ch.mem}명</span>}
                        </div>
                        <div style={{ fontSize: 9, color: P.g4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ch.last}</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 8, color: ch.time === "LIVE" ? P.red : P.g4, fontWeight: ch.time === "LIVE" ? 700 : 400 }}>{ch.time}</div>
                        {ch.unread > 0 && <span style={{ display: "inline-block", background: P.pri, color: "#fff", fontSize: 7, fontWeight: 600, minWidth: 13, height: 13, lineHeight: "13px", textAlign: "center", borderRadius: 7, marginTop: 1 }}>{ch.unread}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {tab === "친구" && (
        <div>
          {/* Friend Level Ranking */}
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 0 6px" }}>
              <span style={{ fontSize: 12 }}>🏅</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: P.g7 }}>친구 랭킹</span>
              <span style={{ fontSize: 9, color: P.g4 }}>레벨 기준</span>
            </div>
            <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 6 }}>
              {[
                { rank: 1, name: "사직의별", lv: 51, ac: P.blu, medal: "🥇" },
                { rank: 2, name: "귀멸_마스터", lv: 44, ac: P.red, medal: "🥈" },
                { rank: 3, name: "크리에이터J", lv: 42, ac: P.ylw, medal: "🥉" },
                { rank: 4, name: "해적왕_루피", lv: 37, ac: P.crl, medal: "4" },
                { rank: 5, name: "직관러_사직", lv: 34, ac: P.blu, medal: "5" },
                { rank: 6, name: "댄스커버_유나", lv: 31, ac: P.pnk, medal: "6" },
                { rank: 7, name: "부산갈매기_01", lv: 28, ac: P.blu, medal: "7" },
              ].map(function (r) {
                var isMe = r.name === "직관러_사직";
                return (
                  <div key={r.rank} style={{ minWidth: 70, textAlign: "center", padding: "8px 6px", borderRadius: 10, background: isMe ? P.priL : r.rank <= 3 ? P.ylwL : P.g1, border: isMe ? "1.5px solid " + P.pri : "1px solid " + P.bdr, flexShrink: 0 }}>
                    <div style={{ fontSize: r.rank <= 3 ? 16 : 10, color: r.rank <= 3 ? "inherit" : P.g4, fontWeight: 700, marginBottom: 3 }}>{r.medal}</div>
                    <Av n={r.name} s={32} c={r.ac} />
                    <div style={{ fontSize: 8, fontWeight: isMe ? 700 : 500, color: isMe ? P.pri : P.g7, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: isMe ? P.pri : P.ylw }}>Lv.{r.lv}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ fontSize: 10, color: P.g4, padding: "0 0 6px" }}>온라인 {friends.filter(function (f) { return f.on; }).length}명 · 전체 {friends.length}명</div>

          {/* Similar Mindmap Friend Suggestions */}
          <div style={{ marginBottom: 10, padding: 8, borderRadius: 10, background: P.priL, border: "1px solid " + P.pri + "22" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
              <span style={{ fontSize: 11 }}>🧠</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: P.pri }}>비슷한 마인드맵 추천</span>
            </div>
            {[
              { name: "야구분석가_KBO", match: 91, tags: ["KBO", "투수분석"], ac: P.blu },
              { name: "댄스커버_서울", match: 73, tags: ["K-pop", "안무"], ac: P.pnk },
              { name: "작화덕후_2D", match: 65, tags: ["애니", "작화"], ac: P.red },
            ].map(function (u) {
              return (
                <div key={u.name} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 0", borderBottom: "1px solid " + P.pri + "11" }}>
                  <Av n={u.name} s={28} c={u.ac} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 10, fontWeight: 500, color: P.g7 }}>{u.name}</span>
                    <div style={{ display: "flex", gap: 2, marginTop: 1 }}>{u.tags.map(function (t) { return <span key={t} style={{ fontSize: 7, padding: "0 4px", borderRadius: 3, background: (tc[t] || P.g4) + "22", color: tc[t] || P.g4 }}>{t}</span>; })}</div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: P.pri }}>{u.match}%</span>
                  <button style={{ fontSize: 8, padding: "3px 8px", borderRadius: 8, background: P.pri, color: "#fff", border: "none", cursor: "pointer" }}>친구추가</button>
                </div>
              );
            })}
          </div>
          {friends.sort(function (a, b) { return (b.on ? 1 : 0) - (a.on ? 1 : 0); }).map(function (fr) {
            return (
              <div key={fr.name} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 4px", borderBottom: "1px solid " + P.g1 }}>
                <Av n={fr.name} s={36} c={fr.ac} on={fr.on} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: P.g7 }}>{fr.name}</span>
                    <span style={{ fontSize: 8, color: P.pri, background: P.priL, padding: "1px 4px", borderRadius: 3 }}>Lv.{fr.lv}</span>
                    {fr.on && fr.lastAct.includes("캐스트") && <Bg t="LIVE" c="#fff" bg={P.red} />}
                  </div>
                  <div style={{ fontSize: 9, color: fr.on ? P.g7 : P.g4, marginTop: 1 }}>{fr.lastAct}</div>
                </div>
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  {fr.on && <button onClick={function () { nav("chat"); }} style={{ padding: "4px 8px", borderRadius: 6, background: P.pri, color: "#fff", border: "none", fontSize: 9, cursor: "pointer" }}>시그널</button>}
                  {fr.on && fr.lastAct.includes("캐스트") && <button onClick={function () { nav("live"); }} style={{ padding: "4px 8px", borderRadius: 6, background: P.red, color: "#fff", border: "none", fontSize: 9, cursor: "pointer" }}>시청</button>}
                  <span style={{ fontSize: 8, color: P.g4 }}>{fr.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ========== PRIVATE CHAT ==========
function Chat({ target, nav }) {
  const [msgs, setMsgs] = useState([{ id: 1, who: "친구", text: "야 오늘 직관 가자", mine: false }, { id: 2, who: "me", text: "ㅇㅇ 사직 6시 30분", mine: true }, { id: 3, who: "친구", text: "치킨 사갈게 ㅋㅋ", mine: false }]);
  const [inp, setInp] = useState("");
  const [showSwitch, setShowSwitch] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [showHash, setShowHash] = useState(false);
  const [showInsight, setShowInsight] = useState(false);
  const [msgMenu, setMsgMenu] = useState(null);
  const ref = useRef(null);
  useEffect(function () { if (ref.current) ref.current.scrollIntoView({ behavior: "smooth" }); }, [msgs]);
  function send() {
    if (!inp.trim()) return;
    var newMsg = { id: Date.now(), who: "me", text: inp, mine: true };
    if (replyTo) newMsg.reply = replyTo;
    setMsgs(function (p) { return p.concat([newMsg]); });
    setInp(""); setReplyTo(null);
    setTimeout(function () { setMsgs(function (p) { return p.concat([{ id: Date.now() + 1, who: "친구", text: ["ㅋㅋ", "ㄱㄱ", "알겠어!"][Math.floor(Math.random() * 3)], mine: false }]); }); }, 700);
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)", marginTop: -12 }}>
      <div style={{ padding: "8px 0", borderBottom: "1px solid " + P.bdr, display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        <Av n={target?.av || "DM"} s={30} c={target?.c || P.pri} />
        <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 600, color: P.g7 }}>{target?.name || "대화"}</div><div style={{ display: "flex", alignItems: "center", gap: 3 }}><Lk /><span style={{ fontSize: 9, color: P.grn }}>E2EE</span></div></div>
        {target?.isGroup && <button onClick={function () { setShowSwitch(!showSwitch); }} style={{ padding: "4px 8px", borderRadius: 6, background: P.red, color: "#fff", border: "none", fontSize: 9, fontWeight: 600, cursor: "pointer" }}>🛰 캐스트 전환</button>}
        <button style={{ width: 28, height: 28, borderRadius: 6, background: P.g1, border: "none", cursor: "pointer", fontSize: 12 }}>📞</button>
        <button style={{ width: 28, height: 28, borderRadius: 6, background: P.g1, border: "none", cursor: "pointer", fontSize: 12 }}>📹</button>
      </div>
      {showSwitch && (
        <div style={{ background: P.ylwL, borderRadius: 7, padding: 8, margin: "5px 0", flexShrink: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: P.ylw, marginBottom: 5 }}>공개 범위 선택</div>
          <div style={{ display: "flex", gap: 5 }}>{[{ t: "🔒 비공개", c: P.bluL, tc: P.blu }, { t: "🔑 한정", c: P.ylwL, tc: P.ylw }, { t: "📡 전체공개", c: P.redL, tc: P.red }].map(function (o, i) { return <div key={i} onClick={function () { setShowSwitch(false); if (i >= 1) nav("live"); }} style={{ flex: 1, padding: "7px 4px", borderRadius: 6, background: o.c, textAlign: "center", cursor: "pointer" }}><div style={{ fontSize: 10, fontWeight: 600, color: o.tc }}>{o.t}</div></div>; })}</div>
        </div>
      )}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 0", display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ textAlign: "center", margin: "2px 0 6px" }}><span style={{ display: "inline-flex", alignItems: "center", gap: 3, background: P.grnL, padding: "2px 8px", borderRadius: 8, fontSize: 8, color: P.grn }}><Lk />종단간 암호화</span></div>
        {msgs.map(function (m) {
          return (
            <div key={m.id} onClick={function () { if (!m.mine) setReplyTo({ who: m.who, text: m.text }); }} onContextMenu={function (e) { e.preventDefault(); setMsgMenu(m); }} style={{ display: "flex", justifyContent: m.mine ? "flex-end" : "flex-start", padding: "0 4px", cursor: "pointer" }}>
              <div style={{ maxWidth: "75%" }}>
                {!m.mine && <div style={{ fontSize: 8, color: P.g4, marginBottom: 1, marginLeft: 4 }}>{m.who}</div>}
                {m.reply && <div style={{ fontSize: 8, color: P.g4, padding: "2px 6px", marginBottom: 2, borderLeft: "2px solid " + P.pri, marginLeft: m.mine ? "auto" : 4, marginRight: m.mine ? 4 : "auto", maxWidth: "90%" }}>↩ {m.reply.who}: {m.reply.text}</div>}
                <div style={{ padding: "7px 11px", borderRadius: m.mine ? "12px 12px 3px 12px" : "12px 12px 12px 3px", background: m.mine ? P.pri : P.g1, color: m.mine ? "#fff" : P.g7, fontSize: 12, lineHeight: 1.4 }}>{m.text}</div>
              </div>
            </div>
          );
        })}
        <div ref={ref} />
      </div>
      {/* Reply indicator */}
      {replyTo && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", background: P.priL, borderTop: "1px solid " + P.pri + "33", flexShrink: 0 }}>
          <span style={{ fontSize: 10, color: P.pri }}>↩ {replyTo.who}에게 답장</span>
          <span style={{ fontSize: 9, color: P.g4, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{replyTo.text}</span>
          <span onClick={function () { setReplyTo(null); }} style={{ fontSize: 12, color: P.g4, cursor: "pointer" }}>✕</span>
        </div>
      )}
      <div style={{ display: "flex", gap: 5, padding: "6px 0", borderTop: "1px solid " + P.bdr, flexShrink: 0 }}>
        <button onClick={function () { setShowHash(!showHash); }} style={{ width: 30, height: 30, borderRadius: "50%", background: showHash ? P.pri : P.g1, color: showHash ? "#fff" : P.g5, border: "none", fontSize: 14, cursor: "pointer", fontWeight: 700, flexShrink: 0 }}>#</button>
        <input value={inp} onChange={function (e) { setInp(e.target.value); }} onKeyDown={function (e) { if (e.key === "Enter") { e.preventDefault(); send(); } }} placeholder="메시지..." style={{ flex: 1, padding: "7px 11px", borderRadius: 16, border: "1px solid " + P.bdr, fontSize: 11, outline: "none", background: P.g1, boxSizing: "border-box" }} />
        <button onClick={send} style={{ width: 30, height: 30, borderRadius: "50%", background: inp.trim() ? P.pri : P.g2, border: "none", cursor: inp.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13" stroke="#fff" strokeWidth="2" strokeLinecap="round" /><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
      </div>
      {/* # 마인드맵 공유 패널 */}
      {showHash && (
        <div style={{ padding: "8px 10px", borderTop: "1px solid " + P.bdr }}>
          <div style={{ display: "flex", gap: 0, marginBottom: 6, borderBottom: "1px solid " + P.bdr }}>
            {["생각", "저장글", "캐스트", "놀이결과", "태그"].map(function (t, i) {
              return <button key={t} style={{ padding: "4px 0", fontSize: 9, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? P.pri : P.g4, background: "none", border: "none", borderBottom: i === 0 ? "2px solid " + P.pri : "none", cursor: "pointer", flex: 1 }}>{t}</button>;
            })}
          </div>
          {[
            { icon: "💭", title: "나주환 슬라이더 분석", time: "3분 전", scope: "공개" },
            { icon: "⭐", title: "전의리 홈런 리마인드", time: "1시간 전", scope: "공개" },
            { icon: "🔒", title: "오늘 컨디션 기록", time: "어제", scope: "나만보기" },
          ].map(function (m) {
            return <div key={m.title} onClick={function () { setShowHash(false); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 4px", cursor: "pointer", borderRadius: 6 }}><span style={{ fontSize: 12 }}>{m.icon}</span><div style={{ flex: 1 }}><div style={{ fontSize: 10, fontWeight: 500, color: P.g7 }}>{m.title}</div><div style={{ fontSize: 7, color: P.g4 }}>{m.time}</div></div><span style={{ fontSize: 7, padding: "1px 4px", borderRadius: 3, background: m.scope === "나만보기" ? P.g2 : P.grnL, color: m.scope === "나만보기" ? P.g4 : P.grn }}>{m.scope}</span></div>;
          })}
          <div style={{ fontSize: 7, color: P.g4, marginTop: 4, textAlign: "center" }}>🔒 비공개 항목은 공유용 스냅샷으로 전송됩니다</div>
        </div>
      )}
      {/* 메시지 롱프레스 메뉴 */}
      {msgMenu && (
        <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, height: "100vh", background: "rgba(0,0,0,0.3)", zIndex: 30, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={function () { setMsgMenu(null); }}>
          <div onClick={function (e) { e.stopPropagation(); }} style={{ background: "#fff", borderRadius: 12, padding: 6, width: 200, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
            {[
              { icon: "↩", label: "답장", act: function () { setReplyTo(msgMenu); setMsgMenu(null); } },
              { icon: "📋", label: "복사", act: function () { setMsgMenu(null); } },
              { icon: "😆", label: "리액션", act: function () { setMsgMenu(null); } },
              { icon: "🧠", label: "여기서부터 마인드맵 저장", act: function () { setMsgMenu(null); setShowInsight(true); } },
              { icon: "🚨", label: "신고", act: function () { setMsgMenu(null); } },
            ].map(function (a) {
              return <div key={a.label} onClick={a.act} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", cursor: "pointer", borderRadius: 6, fontSize: 11, color: a.label === "신고" ? P.red : a.label.includes("마인드맵") ? P.pri : P.g7 }}><span>{a.icon}</span> {a.label}</div>;
            })}
          </div>
        </div>
      )}
      {/* 대화 인사이트 생성 모달 */}
      {showInsight && (
        <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, height: "100vh", background: "rgba(0,0,0,0.5)", zIndex: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "88%", background: "#fff", borderRadius: 16, padding: 16, maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}><span style={{ fontSize: 16 }}>🧠</span><span style={{ fontSize: 14, fontWeight: 700, color: P.g7 }}>대화 인사이트 만들기</span><span onClick={function () { setShowInsight(false); }} style={{ marginLeft: "auto", fontSize: 16, color: P.g4, cursor: "pointer" }}>✕</span></div>
            <div style={{ padding: "6px 8px", background: P.g1, borderRadius: 8, marginBottom: 8 }}>
              <div style={{ fontSize: 9, color: P.g4, marginBottom: 2 }}>선택된 메시지 3개</div>
              <div style={{ display: "flex", gap: 4 }}><span style={{ fontSize: 8, padding: "2px 6px", borderRadius: 4, background: P.priL, color: P.pri, cursor: "pointer" }}>시작 변경</span><span style={{ fontSize: 8, padding: "2px 6px", borderRadius: 4, background: P.priL, color: P.pri, cursor: "pointer" }}>끝 변경</span></div>
            </div>
            <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
              <button style={{ flex: 1, padding: "6px 0", borderRadius: 6, background: P.pri, color: "#fff", border: "none", fontSize: 10, fontWeight: 600 }}>🤖 AI 요약</button>
              <button style={{ flex: 1, padding: "6px 0", borderRadius: 6, background: P.g1, color: P.g5, border: "none", fontSize: 10 }}>✏️ 직접 작성</button>
            </div>
            <input placeholder="제목" defaultValue="나주환 슬라이더 분석" style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid " + P.bdr, fontSize: 12, fontWeight: 600, outline: "none", boxSizing: "border-box", marginBottom: 6 }} />
            <textarea placeholder="AI 요약문" defaultValue="나주환의 슬라이더 회전수 증가가 좌타자 상대 피안타율 .187 개선과 연결될 수 있다는 대화." style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid " + P.bdr, fontSize: 11, outline: "none", resize: "none", minHeight: 40, fontFamily: "inherit", boxSizing: "border-box", marginBottom: 6, lineHeight: 1.5, color: P.g5 }} />
            <div style={{ display: "flex", gap: 3, marginBottom: 8 }}>{["#KBO", "#롯데", "#투수분석"].map(function (t) { return <span key={t} style={{ fontSize: 8, padding: "2px 6px", borderRadius: 4, background: P.blu + "15", color: P.blu }}>{t}</span>; })}</div>
            <div style={{ padding: "6px 8px", background: P.g1, borderRadius: 8, marginBottom: 8 }}>
              <div style={{ fontSize: 9, fontWeight: 600, color: P.g7, marginBottom: 3 }}>참여자 익명처리</div>
              <div style={{ fontSize: 9, color: P.g5 }}>나: <span style={{ color: P.pri }}>나</span></div>
              <div style={{ fontSize: 9, color: P.g5 }}>상대: <span style={{ color: P.ylw }}>안드로메다성운의 세타</span></div>
              <div style={{ fontSize: 7, color: P.g4, marginTop: 2 }}>비공개 화면에서는 @실제유저 링크 표시</div>
            </div>
            <div style={{ padding: "5px 8px", background: P.grnL, borderRadius: 6, marginBottom: 8, border: "1px solid " + P.grn + "33" }}>
              <div style={{ fontSize: 9, fontWeight: 600, color: P.grn }}>✅ 공개 위험도: 낮음</div>
              <div style={{ fontSize: 7, color: P.g5 }}>민감 정보 미감지 · 안전하게 공개 가능</div>
            </div>
            <div style={{ fontSize: 10, fontWeight: 600, color: P.g7, marginBottom: 4 }}>저장 범위</div>
            <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
              {[{ icon: "🔒", label: "나만보기", c: P.g5, on: true }, { icon: "🤝", label: "상대와 공유", c: P.grn, on: false }, { icon: "🌐", label: "공개 카드", c: P.blu, on: false }].map(function (s) {
                return <div key={s.label} style={{ flex: 1, padding: "6px 4px", borderRadius: 8, border: s.on ? "2px solid " + s.c : "1px solid " + P.bdr, textAlign: "center", cursor: "pointer", background: s.on ? s.c + "11" : "#fff" }}><div style={{ fontSize: 13 }}>{s.icon}</div><div style={{ fontSize: 8, fontWeight: 600, color: s.c }}>{s.label}</div></div>;
              })}
            </div>
            <button onClick={function () { setShowInsight(false); }} style={{ width: "100%", padding: "12px 0", borderRadius: 10, background: P.pri, color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>🧠 마인드맵에 저장</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ========== MINDMAP ==========
function MindMap() {
  const [ts, setTs] = useState(THOUGHTS);
  const [inp, setInp] = useState("");
  const [pub, setPub] = useState(true);
  const [filter, setFilter] = useState("전체");
  const [selBubble, setSelBubble] = useState(null);
  const [showSimilar, setShowSimilar] = useState(false);
  var tc = { "KBO": P.blu, "롯데": P.blu, "K-pop": P.pur, "BTS": P.pur, "일상": P.grn, "투수분석": P.grn, "작화분석": P.red, "안무": P.pnk, "원피스": P.crl };
  var isEmpty = ts.length === 0;
  var srcStyle = {
    mine: { label: "내 작성", color: P.pri, bg: P.priL, icon: "✏️" },
    community: { label: "플래닛", color: P.pnk, bg: P.pnkL, icon: "▤" },
    thought: { label: "생각", color: P.blu, bg: P.bluL, icon: "📝" },
    broadcast: { label: "캐스트", color: P.red, bg: P.redL, icon: "📺" },
    insight: { label: "대화 카드", color: P.ylw, bg: P.ylwL, icon: "🌌" }
  };

  function add() {
    if (!inp.trim()) return;
    setTs(function (p) {
      return [{ id: Date.now(), text: inp, tags: inp.includes("롯데") || inp.includes("야구") ? ["KBO", "롯데"] : inp.includes("BTS") || inp.includes("방탄") ? ["K-pop", "BTS"] : ["일상"], pub: pub, likes: 0, src: "mine" }, ...p];
    });
    setInp("");
  }

  var filtered = ts.filter(function (t) {
    if (filter === "내 작성") return t.src === "mine";
    if (filter === "저장됨") return t.src !== "mine";
    return true;
  });

  var cl = {};
  filtered.forEach(function (t) { var c = t.tags[0] || "기타"; if (!cl[c]) cl[c] = []; cl[c].push(t); });
  var mineCount = ts.filter(function (t) { return t.src === "mine"; }).length;
  var savedCount = ts.filter(function (t) { return t.src !== "mine"; }).length;

  var similarUsers = [
    { name: "사직의별", lv: 51, match: 87, tags: ["KBO", "투수분석"], av: "사직", ac: P.blu, thoughts: 142 },
    { name: "댄스커버_유나", lv: 31, match: 72, tags: ["K-pop", "안무"], av: "유나", ac: P.pnk, thoughts: 89 },
    { name: "귀멸_마스터", lv: 44, match: 68, tags: ["애니", "작화분석"], av: "귀멸", ac: P.red, thoughts: 234 },
    { name: "해적왕_루피", lv: 37, match: 61, tags: ["애니", "원피스"], av: "루피", ac: P.crl, thoughts: 167 },
  ];

  var bubblePositions = [
    { x: "15%", y: "8%", size: 0 },
    { x: "55%", y: "5%", size: 1 },
    { x: "82%", y: "12%", size: 2 },
    { x: "30%", y: "22%", size: 3 },
    { x: "68%", y: "25%", size: 4 },
  ];

  var bubbleEntries = Object.entries(cl);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <span style={{ fontSize: 17, fontWeight: 700, color: P.g7 }}>마인드맵</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          {Object.entries(srcStyle).map(function (entry) {
            return <span key={entry[0]} style={{ fontSize: 7, padding: "2px 5px", borderRadius: 3, background: entry[1].bg, color: entry[1].color, fontWeight: 600 }}>{entry[1].icon}</span>;
          })}
        </div>
      </div>

      {/* === CYWORLD ROOM === */}
      <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", marginBottom: 14, background: "linear-gradient(180deg, #D4E6F1 0%, #EBF5FB 40%, #FDEBD0 70%, #F6DDCC 100%)", border: "2px solid " + P.bdr, minHeight: 280 }}>
        {/* Window */}
        <div style={{ position: "absolute", top: 10, left: 15, width: 50, height: 40, borderRadius: 6, background: "#AED6F1", border: "3px solid #F5F5DC" }}>
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: "#F5F5DC" }} />
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 2, background: "#F5F5DC" }} />
        </div>
        {/* Shelf */}
        <div style={{ position: "absolute", top: 12, right: 15, width: 55, height: 6, borderRadius: 2, background: "#D5B895" }}>
          <div style={{ position: "absolute", top: -14, left: 5, fontSize: 12 }}>🏆</div>
          <div style={{ position: "absolute", top: -12, left: 25, fontSize: 10 }}>⚾</div>
          <div style={{ position: "absolute", top: -14, right: 5, fontSize: 12 }}>🎵</div>
        </div>
        {/* Floor line */}
        <div style={{ position: "absolute", bottom: 60, left: 0, right: 0, height: 2, background: "#D5B89555" }} />
        {/* Rug */}
        <div style={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", width: 100, height: 25, borderRadius: "50%", background: P.pri + "22", border: "1px dashed " + P.pri + "44" }} />
        {/* Poster */}
        <div style={{ position: "absolute", top: 15, left: "50%", transform: "translateX(-50%)", width: 40, height: 24, borderRadius: 3, background: P.blu + "33", border: "2px solid " + P.blu + "55", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: P.blu, fontWeight: 600 }}>LOTTE</div>

        {/* Thought bubbles floating */}
        {bubbleEntries.slice(0, 5).map(function (entry, i) {
          var cat = entry[0]; var items = entry[1];
          var pos = bubblePositions[i] || bubblePositions[0];
          var clr = tc[cat] || P.g5;
          var sz = Math.max(44, Math.min(64, items.length * 14));
          var isSelected = selBubble === cat;
          return (
            <div key={cat} onClick={function () { setSelBubble(isSelected ? null : cat); }} style={{ position: "absolute", left: pos.x, top: pos.y, transform: "translate(-50%,-50%)", cursor: "pointer", zIndex: isSelected ? 5 : 2, transition: "all 0.2s" }}>
              {/* Cloud shape */}
              <div style={{ width: sz, height: sz * 0.75, borderRadius: "50%", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", border: "2px solid " + clr + (isSelected ? "" : "66"), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: clr }}>{cat}</div>
                <div style={{ fontSize: 8, color: P.g4 }}>{items.length}개</div>
                {/* Source dots */}
                <div style={{ display: "flex", gap: 2, marginTop: 2 }}>
                  {items.slice(0, 4).map(function (it, j) {
                    var sc = srcStyle[it.src] || srcStyle.mine;
                    return <div key={j} style={{ width: 5, height: 5, borderRadius: 3, background: sc.color }} />;
                  })}
                </div>
                {/* Tail */}
                <div style={{ position: "absolute", bottom: -6, left: "40%", width: 8, height: 8, background: "#fff", borderRadius: "50%", border: "1px solid " + clr + "44" }} />
                <div style={{ position: "absolute", bottom: -10, left: "35%", width: 5, height: 5, background: "#fff", borderRadius: "50%", border: "1px solid " + clr + "44" }} />
              </div>
            </div>
          );
        })}

        {/* SD Avatar Character */}
        <div style={{ position: "absolute", bottom: 25, left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, " + P.pri + ", " + P.pnk + ")", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 10px rgba(0,0,0,0.15)" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>😊</div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: P.g7, marginTop: 4, background: "rgba(255,255,255,0.8)", padding: "2px 8px", borderRadius: 8 }}>직관러_사직</div>
          <div style={{ fontSize: 8, color: P.g4 }}>Lv.34 · 🔥34일</div>
        </div>

        {/* Room decoration items */}
        <div style={{ position: "absolute", bottom: 32, left: 20, fontSize: 20 }}>🪑</div>
        <div style={{ position: "absolute", bottom: 30, right: 20, fontSize: 18 }}>🎸</div>
        <div style={{ position: "absolute", bottom: 62, right: 25, fontSize: 14 }}>🧸</div>
      </div>

      {/* Selected bubble detail */}
      {selBubble && cl[selBubble] && (
        <div style={{ background: "#fff", border: "2px solid " + (tc[selBubble] || P.g4), borderRadius: 10, padding: 10, marginBottom: 14, marginTop: -8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 5, background: tc[selBubble] || P.g4 }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: tc[selBubble] || P.g7 }}>{selBubble}</span>
            <span style={{ fontSize: 9, color: P.g4 }}>{cl[selBubble].length}개</span>
            <span onClick={function () { setSelBubble(null); }} style={{ marginLeft: "auto", fontSize: 12, color: P.g4, cursor: "pointer" }}>✕</span>
          </div>
          {cl[selBubble].map(function (it) {
            var ss = srcStyle[it.src] || srcStyle.mine;
            return (
              <div key={it.id} style={{ padding: "6px 8px", marginBottom: 3, borderRadius: 6, background: it.src === "insight" ? P.ylw + "08" : P.g1, borderLeft: "3px solid " + (it.src === "insight" ? P.ylw : tc[selBubble] || P.g3) }}>
                <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 2 }}>
                  <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 3, background: ss.bg, color: ss.color, fontWeight: 600 }}>{ss.icon} {ss.label}</span>
                  {it.from && <span style={{ fontSize: 8, color: P.g4 }}>from {it.from}</span>}
                  {!it.pub && <span style={{ fontSize: 8 }}>🔒</span>}
                </div>
                <div style={{ fontSize: 10, color: P.g7, lineHeight: 1.4 }}>{it.text}</div>
                {it.src === "insight" && it.summary && (
                  <div style={{ fontSize: 8, color: P.g5, marginTop: 2, padding: "3px 6px", background: P.ylwL, borderRadius: 4, lineHeight: 1.4 }}>💬 {it.summary}</div>
                )}
                {it.src === "insight" && it.participants && (
                  <div style={{ display: "flex", gap: 3, marginTop: 2 }}>
                    {it.participants.map(function (p) { return <span key={p} style={{ fontSize: 7, padding: "1px 4px", borderRadius: 3, background: P.pri + "15", color: P.pri }}>🌌 {p}</span>; })}
                  </div>
                )}
                <div style={{ fontSize: 8, color: P.g4, marginTop: 2 }}>♥ {it.likes}{it.board ? " · " + it.board : ""}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Compose */}
      <div style={{ background: P.g1, borderRadius: 8, padding: 10, marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ fontSize: 20, marginTop: 4 }}>💭</div>
          <div style={{ flex: 1 }}>
            <textarea value={inp} onChange={function (e) { setInp(e.target.value); }} placeholder="새로운 생각 구름을 띄워보세요..." style={{ width: "100%", padding: 7, borderRadius: 6, border: "1px solid " + P.bdr, fontSize: 11, minHeight: 40, outline: "none", resize: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 5 }}>
              <div onClick={function () { setPub(!pub); }} style={{ display: "flex", alignItems: "center", gap: 3, cursor: "pointer" }}><div style={{ width: 28, height: 16, borderRadius: 8, background: pub ? P.pri : P.g3, position: "relative" }}><div style={{ width: 12, height: 12, borderRadius: 6, background: "#fff", position: "absolute", top: 2, left: pub ? 14 : 2, transition: "left .2s" }} /></div><span style={{ fontSize: 10, color: P.g5 }}>{pub ? "공개" : "비공개"}</span></div>
              <button onClick={add} style={{ marginLeft: "auto", padding: "5px 14px", borderRadius: 14, background: P.pri, color: "#fff", border: "none", fontSize: 10, fontWeight: 600, cursor: "pointer" }}>생각 띄우기 ☁️</button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid " + P.bdr, marginBottom: 10 }}>
        {[
          { key: "전체", label: "전체 (" + ts.length + ")" },
          { key: "내 작성", label: "✏️ 내 작성 (" + mineCount + ")" },
          { key: "저장됨", label: "⊕ 저장 (" + savedCount + ")" }
        ].map(function (f) {
          return <button key={f.key} onClick={function () { setFilter(f.key); }} style={{ padding: "7px 10px", fontSize: 10, fontWeight: filter === f.key ? 600 : 400, color: filter === f.key ? P.pri : P.g4, background: "none", border: "none", borderBottom: filter === f.key ? "2px solid " + P.pri : "2px solid transparent", cursor: "pointer" }}>{f.label}</button>;
        })}
      </div>

      {/* Feed */}
      {filtered.filter(function (t) { return t.pub; }).map(function (t) {
        var ss = srcStyle[t.src] || srcStyle.mine;
        return (
          <div key={t.id} style={{ padding: "8px 0", borderBottom: "1px solid " + P.bdr }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
              <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: ss.bg, color: ss.color, fontWeight: 600 }}>{ss.icon} {ss.label}</span>
              {t.from && <span style={{ fontSize: 9, color: P.g5 }}>{t.from}{t.board ? " · " + t.board : ""}</span>}
            </div>
            <div style={{ display: "flex", gap: 3, marginBottom: 3 }}>{t.tags.map(function (tg) { return <span key={tg} style={{ fontSize: 8, padding: "1px 5px", borderRadius: 3, background: (tc[tg] || P.g4) + "22", color: tc[tg] || P.g4 }}>{tg}</span>; })}</div>
            <div style={{ fontSize: 11, color: P.g7, lineHeight: 1.5 }}>{t.text}</div>
            <div style={{ display: "flex", gap: 10, fontSize: 9, color: P.g4, marginTop: 3 }}><span>♥ {t.likes}</span><span>↗ 공유</span>{t.src !== "mine" && <span style={{ color: P.pri }}>마인드맵 연결됨</span>}</div>
          </div>
        );
      })}

      {/* === SIMILAR MINDMAPS === */}
      <div style={{ marginTop: 16 }}>
        <div onClick={function () { setShowSimilar(!showSimilar); }} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: P.g7 }}>🧠 비슷한 마인드맵</span>
          <span style={{ fontSize: 9, color: P.pri, fontWeight: 500 }}>마인드맵 분석 기반</span>
          <span style={{ marginLeft: "auto", fontSize: 12, color: P.g4 }}>{showSimilar ? "△" : "▽"}</span>
        </div>

        {showSimilar && (
          <div>
            <div style={{ fontSize: 9, color: P.g4, marginBottom: 8 }}>내 마인드맵 카테고리 분포와 유사한 유저를 AI가 추천합니다</div>
            {similarUsers.map(function (u) {
              return (
                <div key={u.name} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 8px", marginBottom: 4, borderRadius: 10, background: P.g1, cursor: "pointer" }}>
                  {/* Mini room preview */}
                  <div style={{ width: 50, height: 50, borderRadius: 8, background: "linear-gradient(180deg, #D4E6F1 0%, #FDEBD0 100%)", position: "relative", flexShrink: 0, overflow: "hidden" }}>
                    <div style={{ position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)", width: 20, height: 20, borderRadius: "50%", background: u.ac + "44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>😊</div>
                    {u.tags.slice(0, 2).map(function (tg, j) {
                      return <div key={j} style={{ position: "absolute", top: 4 + j * 10, left: j === 0 ? 5 : 28, width: 16, height: 12, borderRadius: "50%", background: "#fff", border: "1px solid " + (tc[tg] || P.g4) + "66", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 5, color: tc[tg] || P.g4, fontWeight: 700 }}>{tg.slice(0, 2)}</div>;
                    })}
                  </div>
                  {/* User info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: P.g7 }}>{u.name}</span>
                      <span style={{ fontSize: 8, color: P.pri, background: P.priL, padding: "1px 4px", borderRadius: 3 }}>Lv.{u.lv}</span>
                    </div>
                    <div style={{ display: "flex", gap: 3, marginBottom: 3 }}>
                      {u.tags.map(function (tg) { return <span key={tg} style={{ fontSize: 7, padding: "1px 5px", borderRadius: 3, background: (tc[tg] || P.g4) + "22", color: tc[tg] || P.g4 }}>{tg}</span>; })}
                    </div>
                    <div style={{ fontSize: 9, color: P.g4 }}>생각 {u.thoughts}개</div>
                  </div>
                  {/* Match + Follow */}
                  <div style={{ textAlign: "center", flexShrink: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: u.match >= 80 ? P.pri : u.match >= 70 ? P.blu : P.g5 }}>{u.match}%</div>
                    <div style={{ fontSize: 7, color: P.g4, marginBottom: 3 }}>일치</div>
                    <button style={{ fontSize: 9, padding: "3px 10px", borderRadius: 10, background: P.pri, color: "#fff", border: "none", cursor: "pointer", fontWeight: 500 }}>따라가기</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ========== PROFILE ==========
function Profile() {
  const [tab, setTab] = useState("글");
  // settings moved to App level
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [showCatMgr, setShowCatMgr] = useState(false);
  const [newCat, setNewCat] = useState("");
  const [userCats, setUserCats] = useState(["직관후기", "먹방"]);
  var tc = { "KBO": P.blu, "롯데": P.blu, "K-pop": P.pur, "BTS": P.pur, "일상": P.grn, "투수분석": P.grn, "작화분석": P.red, "안무": P.pnk, "직관후기": P.ylw, "먹방": P.crl };
  var aiCats = ["KBO", "K-pop", "투수분석", "작화분석", "안무"];
  var allCats = aiCats.concat(userCats);

  var myPosts = [
    { id: 1, text: "전의리 역전 3점 홈런!! 사직 들끓는다", cats: ["KBO", "직관후기"], likes: 456, cmt: 89, time: "방금", best: "전체" },
    { id: 2, text: "나주환 ERA 2.31 기대된다", cats: ["KBO", "투수분석"], likes: 89, cmt: 23, time: "3시간", best: "커뮤" },
    { id: 3, text: "BTS Running Wild 브릿지 좋다", cats: ["K-pop"], likes: 28, cmt: 8, time: "어제", best: null },
    { id: 4, text: "오늘 직관 치킨이 맛있었다 ㅋㅋ", cats: ["일상", "먹방"], likes: 45, cmt: 12, time: "어제", best: null },
    { id: 5, text: "나주환 슬라이더 회전수 분석", cats: ["KBO", "투수분석"], likes: 189, cmt: 45, time: "3일 전", best: "커뮤" },
  ];

  var followers = [
    { name: "부산갈매기_01", lv: 28, ac: P.blu, mutual: true },
    { name: "사직의별", lv: 51, ac: P.blu, mutual: true },
    { name: "purple_rain_07", lv: 28, ac: P.pur, mutual: false },
    { name: "귀멸_마스터", lv: 44, ac: P.red, mutual: true },
    { name: "아미_뉴비", lv: 5, ac: P.pur, mutual: false },
  ];
  var following = [
    { name: "사직의별", lv: 51, ac: P.blu },
    { name: "댄스커버_유나", lv: 31, ac: P.pnk },
    { name: "귀멸_마스터", lv: 44, ac: P.red },
    { name: "해적왕_루피", lv: 37, ac: P.crl },
  ];

  var aiSuggestCats = ["경기분석", "응원문화", "선수프로필"];

  function addCat() {
    if (!newCat.trim() || userCats.includes(newCat.trim())) return;
    setUserCats(function (p) { return p.concat([newCat.trim()]); });
    setNewCat("");
  }

  return (
    <div>
      {/* Profile header */}
      <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg," + P.pri + "," + P.pnk + ")", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><div style={{ width: 56, height: 56, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>😊</div></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: P.g7 }}>직관러_사직</div>
          <div style={{ display: "flex", gap: 3, marginTop: 3 }}><Bg t="롯데" c={P.blu} bg={P.bluL} /><Bg t="ARMY" c={P.pur} bg={P.priL} /><Bg t="크리에이터" c={P.ylw} bg={P.ylwL} /></div>
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <div onClick={function () { setShowFollowers(!showFollowers); setShowFollowing(false); setShowFriends(false); }} style={{ cursor: "pointer" }}><span style={{ fontSize: 14, fontWeight: 700, color: P.g7 }}>847</span><span style={{ fontSize: 10, color: P.g4 }}> 팔로워</span></div>
            <div onClick={function () { setShowFollowing(!showFollowing); setShowFollowers(false); setShowFriends(false); }} style={{ cursor: "pointer" }}><span style={{ fontSize: 14, fontWeight: 700, color: P.g7 }}>124</span><span style={{ fontSize: 10, color: P.g4 }}> 팔로잉</span></div>
            <div onClick={function () { setShowFriends(!showFriends); setShowFollowers(false); setShowFollowing(false); }} style={{ cursor: "pointer" }}><span style={{ fontSize: 14, fontWeight: 700, color: P.grn }}>23</span><span style={{ fontSize: 10, color: P.g4 }}> 친구</span></div>
          </div>
        </div>
      </div>

      {/* Followers list */}
      {showFollowers && (
        <div style={{ background: P.g1, borderRadius: 10, padding: 10, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}><span style={{ fontSize: 12, fontWeight: 600, color: P.g7 }}>팔로워 847명</span><span onClick={function () { setShowFollowers(false); }} style={{ marginLeft: "auto", fontSize: 12, color: P.g4, cursor: "pointer" }}>✕</span></div>
          {followers.map(function (f) { return (
            <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 0", borderBottom: "1px solid " + P.bdr }}>
              <Av n={f.name} s={28} c={f.ac} />
              <div style={{ flex: 1 }}><span style={{ fontSize: 11, fontWeight: 500, color: P.g7 }}>{f.name}</span> <span style={{ fontSize: 8, color: P.pri }}>Lv.{f.lv}</span></div>
              {f.mutual ? <span style={{ fontSize: 9, color: P.grn, background: P.grnL, padding: "2px 8px", borderRadius: 10 }}>맞팔</span> : <button style={{ fontSize: 9, padding: "2px 8px", borderRadius: 10, background: P.pri, color: "#fff", border: "none", cursor: "pointer" }}>팔로우</button>}
            </div>
          ); })}
        </div>
      )}

      {/* Following list */}
      {showFollowing && (
        <div style={{ background: P.g1, borderRadius: 10, padding: 10, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}><span style={{ fontSize: 12, fontWeight: 600, color: P.g7 }}>팔로잉 124명</span><span onClick={function () { setShowFollowing(false); }} style={{ marginLeft: "auto", fontSize: 12, color: P.g4, cursor: "pointer" }}>✕</span></div>
          {following.map(function (f) { return (
            <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 0", borderBottom: "1px solid " + P.bdr }}>
              <Av n={f.name} s={28} c={f.ac} />
              <div style={{ flex: 1 }}><span style={{ fontSize: 11, fontWeight: 500, color: P.g7 }}>{f.name}</span> <span style={{ fontSize: 8, color: P.pri }}>Lv.{f.lv}</span></div>
              <span style={{ fontSize: 9, color: P.g4, background: P.g2, padding: "2px 8px", borderRadius: 10, cursor: "pointer" }}>팔로잉</span>
            </div>
          ); })}
        </div>
      )}

      {/* Friends list (맞팔 = 친구) */}
      {showFriends && (
        <div style={{ background: P.grnL, borderRadius: 10, padding: 10, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}><span style={{ fontSize: 12, fontWeight: 600, color: P.grn }}>친구 23명</span><span style={{ fontSize: 9, color: P.g4, marginLeft: 6 }}>맞팔로우 = 친구</span><span onClick={function () { setShowFriends(false); }} style={{ marginLeft: "auto", fontSize: 12, color: P.g4, cursor: "pointer" }}>✕</span></div>
          {[
            { name: "사직의별", lv: 51, ac: P.blu, lastAct: "마인드맵 업데이트 · 3분 전" },
            { name: "귀멸_마스터", lv: 44, ac: P.red, lastAct: "플래닛 활동 · 1시간 전" },
            { name: "부산갈매기_01", lv: 28, ac: P.blu, lastAct: "응원방 참여 중 🔴" },
          ].map(function (f) { return (
            <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 0", borderBottom: "1px solid " + P.bdr }}>
              <Av n={f.name} s={28} c={f.ac} on={true} />
              <div style={{ flex: 1 }}><span style={{ fontSize: 11, fontWeight: 500, color: P.g7 }}>{f.name}</span> <span style={{ fontSize: 8, color: P.pri }}>Lv.{f.lv}</span><div style={{ fontSize: 8, color: P.g4 }}>{f.lastAct}</div></div>
              <span style={{ fontSize: 9, color: P.grn, background: "#fff", padding: "2px 8px", borderRadius: 10, border: "1px solid " + P.grn }}>친구 ✓</span>
            </div>
          ); })}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 4, marginBottom: 8 }}>{[{ l: "레벨", v: "Lv.34" }, { l: "구독자", v: "1,200" }, { l: "큐빗", v: "482Q" }, { l: "출석", v: "34🔥" }].map(function (s) { return <div key={s.l} style={{ background: P.g1, borderRadius: 7, padding: "6px 4px", textAlign: "center" }}><div style={{ fontSize: 8, color: P.g4 }}>{s.l}</div><div style={{ fontSize: 12, fontWeight: 600, color: P.g7, marginTop: 1 }}>{s.v}</div></div>; })}</div>

      {/* Level Progress */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, padding: "0 4px" }}>
        <span style={{ fontSize: 9, color: P.pri, fontWeight: 600 }}>Lv.34</span>
        <div style={{ flex: 1, height: 5, borderRadius: 3, background: P.g2 }}><div style={{ height: 5, borderRadius: 3, background: "linear-gradient(90deg, " + P.pri + ", " + P.pnk + ")", width: "78%" }} /></div>
        <span style={{ fontSize: 9, color: P.g4 }}>Lv.35</span>
        <span style={{ fontSize: 8, color: P.g5 }}>78%</span>
      </div>

      {/* Weekly Missions */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
          <span style={{ fontSize: 12 }}>📋</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: P.g7 }}>이번 주 미션</span>
          <span style={{ fontSize: 8, color: P.g4 }}>3/5 완료</span>
        </div>
        {[
          { text: "생각 5개 던지기", prog: 3, max: 5, reward: 3, done: false },
          { text: "캐스트 3회 시청", prog: 1, max: 3, reward: 5, done: false },
          { text: "출석 7일 연속", prog: 5, max: 7, reward: 10, done: false },
          { text: "투표 참여", prog: 1, max: 1, reward: 2, done: true },
          { text: "친구 1명 초대", prog: 0, max: 1, reward: 10, done: false },
        ].map(function (m, i) {
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: i < 4 ? "1px solid " + P.g1 : "none" }}>
              <span style={{ fontSize: 12, width: 20, textAlign: "center" }}>{m.done ? "✅" : "⬜"}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: m.done ? 400 : 500, color: m.done ? P.g4 : P.g7, textDecoration: m.done ? "line-through" : "none" }}>{m.text}</div>
                <div style={{ height: 3, borderRadius: 2, background: P.g2, marginTop: 2 }}><div style={{ height: 3, borderRadius: 2, background: m.done ? P.grn : P.pri, width: (m.prog / m.max * 100) + "%" }} /></div>
              </div>
              <span style={{ fontSize: 9, color: P.ylw, fontWeight: 600 }}>+{m.reward}Q</span>
            </div>
          );
        })}
      </div>

      {/* Fan / Creator */}
      <div style={{ display: "flex", gap: 5, marginBottom: 12 }}>
        <div style={{ flex: 1, background: P.bluL, borderRadius: 8, padding: 8 }}><div style={{ fontSize: 10, fontWeight: 600, color: P.blu, marginBottom: 3 }}>팬 활동</div><div style={{ fontSize: 8, color: P.g5, lineHeight: 1.6 }}>팬덤 2개 · 베스트 28개<br />VS 승률 73%</div></div>
        <div style={{ flex: 1, background: P.ylwL, borderRadius: 8, padding: 8 }}><div style={{ fontSize: 10, fontWeight: 600, color: P.ylw, marginBottom: 3 }}>크리에이터</div><div style={{ fontSize: 8, color: P.g5, lineHeight: 1.6 }}>구독자 1,200명<br />캐스트 47회 · 도네 2,340큐빗</div></div>
      </div>

      {/* Tabs: Posts / Categories / Avatar */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid " + P.bdr, marginBottom: 10 }}>
        {["글", "카테고리", "아바타", "🎮놀이"].map(function (t) { return <button key={t} onClick={function () { setTab(t); }} style={{ padding: "7px 14px", fontSize: 11, fontWeight: tab === t ? 600 : 400, color: tab === t ? P.pri : P.g4, background: "none", border: "none", borderBottom: tab === t ? "2px solid " + P.pri : "2px solid transparent", cursor: "pointer" }}>{t}</button>; })}
      </div>

      {/* Posts tab */}
      {tab === "글" && (
        <div>
          <div style={{ fontSize: 10, color: P.g4, marginBottom: 8 }}>전체 {myPosts.length}개 · 커뮤 베스트 {myPosts.filter(function (p) { return p.best === "커뮤"; }).length}개 · 전체 베스트 {myPosts.filter(function (p) { return p.best === "전체"; }).length}개</div>
          {myPosts.map(function (p) { return (
            <div key={p.id} style={{ padding: "9px 0", borderBottom: "1px solid " + P.bdr }}>
              <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 4, flexWrap: "wrap" }}>
                {p.best === "전체" && <Bg t="전체 BEST +5T" c={P.red} bg={P.redL} />}
                {p.best === "커뮤" && <Bg t="플래닛 BEST +1T" c={P.ylw} bg={P.ylwL} />}
                {p.cats.map(function (c) { return <span key={c} style={{ fontSize: 8, padding: "1px 6px", borderRadius: 3, background: (tc[c] || P.g4) + "22", color: tc[c] || P.g4 }}>{aiCats.includes(c) ? "🤖" : "👤"} {c}</span>; })}
              </div>
              <div style={{ fontSize: 12, color: P.g7, lineHeight: 1.5, marginBottom: 3 }}>{p.text}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10, color: P.g4 }}>
                <span>▲ {p.likes}</span><span>💬 {p.cmt}</span><span>{p.time}</span>
                <span style={{ marginLeft: "auto", fontSize: 8, color: P.blu, cursor: "pointer" }}>🌐 번역보기</span>
              </div>
            </div>
          ); })}
        </div>
      )}

      {/* Categories tab */}
      {tab === "카테고리" && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: P.g7, marginBottom: 6 }}>🤖 AI 자동 생성 카테고리</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
            {aiCats.map(function (c) { return <span key={c} style={{ fontSize: 10, padding: "4px 10px", borderRadius: 14, background: (tc[c] || P.g4) + "22", color: tc[c] || P.g4, fontWeight: 500 }}>🤖 {c}</span>; })}
          </div>

          <div style={{ fontSize: 12, fontWeight: 600, color: P.g7, marginBottom: 6 }}>💡 AI 추천 카테고리</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
            {aiSuggestCats.map(function (c) { return (
              <span key={c} onClick={function () { if (!userCats.includes(c)) setUserCats(function (p) { return p.concat([c]); }); }} style={{ fontSize: 10, padding: "4px 10px", borderRadius: 14, background: P.g1, color: P.g5, border: "1px dashed " + P.g3, cursor: "pointer" }}>+ {c}</span>
            ); })}
          </div>

          <div style={{ fontSize: 12, fontWeight: 600, color: P.g7, marginBottom: 6 }}>👤 내가 만든 카테고리</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
            {userCats.map(function (c, i) { return (
              <span key={c} style={{ fontSize: 10, padding: "4px 10px", borderRadius: 14, background: (tc[c] || P.pri) + "22", color: tc[c] || P.pri, fontWeight: 500, display: "flex", alignItems: "center", gap: 3 }}>
                👤 {c}
                <span onClick={function () { setUserCats(function (p) { return p.filter(function (x) { return x !== c; }); }); }} style={{ cursor: "pointer", fontSize: 8, color: P.g4 }}>✕</span>
              </span>
            ); })}
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <input value={newCat} onChange={function (e) { setNewCat(e.target.value); }} onKeyDown={function (e) { if (e.key === "Enter") { e.preventDefault(); addCat(); } }} placeholder="새 카테고리명..." style={{ flex: 1, padding: "6px 10px", borderRadius: 7, border: "1px solid " + P.bdr, fontSize: 11, outline: "none", background: P.g1, boxSizing: "border-box" }} />
            <button onClick={addCat} style={{ padding: "6px 12px", borderRadius: 7, background: P.pri, color: "#fff", border: "none", fontSize: 10, fontWeight: 600, cursor: "pointer" }}>추가</button>
          </div>
        </div>
      )}

      {/* Avatar tab */}
      {tab === "아바타" && (
        <div>
          <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>{["AR필터", "2D", "3D"].map(function (m, i) { return <span key={m} style={{ fontSize: 10, padding: "4px 10px", borderRadius: 5, background: i === 0 ? P.pri : P.g1, color: i === 0 ? "#fff" : P.g5, cursor: "pointer" }}>{m}</span>; })}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 4 }}>{["롯데유니폼", "응원봉", "갈매기", "기본"].map(function (it, i) { return <div key={i} style={{ background: P.g1, borderRadius: 6, padding: 5, textAlign: "center", border: i === 0 ? "2px solid " + P.pri : "1px solid " + P.bdr, cursor: "pointer" }}><div style={{ width: "100%", height: 28, borderRadius: 4, background: [P.bluL, P.ylwL, P.priL, P.g2][i], marginBottom: 2 }} /><div style={{ fontSize: 8, color: P.g6 }}>{it}</div></div>; })}</div>
          <div style={{ marginTop: 12, fontSize: 12, fontWeight: 600, color: P.g7, marginBottom: 5 }}>마인드맵 미니룸</div>
          <div style={{ background: P.g1, borderRadius: 8, padding: 14, position: "relative", height: 80, overflow: "hidden" }}>
            {[{ x: "25%", y: "35%", s: 36, l: "KBO", c: P.blu }, { x: "60%", y: "25%", s: 28, l: "K-pop", c: P.pur }, { x: "45%", y: "70%", s: 20, l: "일상", c: P.grn }].map(function (n, i) { return <div key={i} style={{ position: "absolute", left: n.x, top: n.y, width: n.s, height: n.s, borderRadius: "50%", background: n.c + "33", border: "2px solid " + n.c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 600, color: n.c, transform: "translate(-50%,-50%)" }}>{n.l}</div>; })}
          </div>
        </div>
      )}

      {tab === "🎮놀이" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <span style={{ fontSize: 14 }}>🎮</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: P.g7 }}>나만의 미니게임</span>
          </div>
          <div style={{ padding: 12, borderRadius: 10, border: "2px dashed " + P.pri + "44", textAlign: "center", marginBottom: 10, cursor: "pointer" }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>➕</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: P.pri }}>새 미니게임 만들기</div>
            <div style={{ fontSize: 9, color: P.g4, marginTop: 2 }}>이상형월드컵 · OX퀴즈 · 사다리 · 돌림판</div>
          </div>
          <div style={{ fontSize: 10, color: P.g4, marginBottom: 6 }}>내가 만든 게임 (2개)</div>
          {[
            { title: "롯데 역대 최고 선수 월드컵", type: "이상형월드컵", plays: 342, icon: "💘", c: P.pnk },
            { title: "야구 규칙 OX 퀴즈", type: "OX 퀴즈", plays: 89, icon: "⭕", c: P.blu },
          ].map(function (g) {
            return (
              <div key={g.title} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px", borderRadius: 8, background: P.g1, marginBottom: 4 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: g.c + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{g.icon}</div>
                <div style={{ flex: 1 }}><div style={{ fontSize: 11, fontWeight: 600, color: P.g7 }}>{g.title}</div><div style={{ fontSize: 8, color: P.g4 }}>{g.type} · {g.plays}명 참여</div></div>
                <span style={{ fontSize: 8, color: P.pri }}>편집</span>
              </div>
            );
          })}
        </div>
      )}

            {/* Invite Friends */}
      <div style={{ marginTop: 14, padding: 10, borderRadius: 10, background: "linear-gradient(135deg, " + P.pri + "11, " + P.pnk + "11)", border: "1px solid " + P.pri + "33" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <span style={{ fontSize: 14 }}>🎉</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: P.g7 }}>친구 초대</span>
          <span style={{ fontSize: 9, color: P.pri }}>초대 3명 · 가입 1명 · 10Q 적립</span>
        </div>
        <div style={{ fontSize: 10, color: P.g5, marginBottom: 8 }}>초대한 친구가 가입하면 둘 다 +10큐빗!</div>
        <div style={{ display: "flex", gap: 6 }}>
          <button style={{ flex: 1, padding: "8px 0", borderRadius: 8, background: P.pri, color: "#fff", border: "none", fontSize: 10, fontWeight: 600, cursor: "pointer" }}>초대 링크 복사</button>
          <button style={{ padding: "8px 12px", borderRadius: 8, background: P.ylwL, color: P.ylw, border: "none", fontSize: 10, fontWeight: 600, cursor: "pointer" }}>카카오톡</button>
        </div>
      </div>

      {/* Language setting */}
      <div style={{ marginTop: 14, padding: "10px 0", borderTop: "1px solid " + P.bdr }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: P.g7 }}>🌐 자동 번역</span>
          <span style={{ marginLeft: "auto", fontSize: 10, color: P.grn, fontWeight: 500 }}>활성화됨</span>
        </div>
        <div style={{ fontSize: 9, color: P.g4, marginTop: 3 }}>모든 게시물과 채팅에 자동 번역이 적용됩니다. 원문/번역 전환 가능</div>
        <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
          {["한국어", "English", "日本語", "中文"].map(function (l, i) { return <span key={l} style={{ fontSize: 9, padding: "3px 8px", borderRadius: 5, background: i === 0 ? P.pri : P.g1, color: i === 0 ? "#fff" : P.g5, cursor: "pointer" }}>{l}</span>; })}
        </div>
      </div>
    </div>
  );
}

// ========== NEW CHAT FLOW ==========
function NewChatFlow({ nav }) {
  const [step, setStep] = useState(0);
  const [roomType, setRoomType] = useState(null);
  const [vpn, setVpn] = useState(false);
  const [copied, setCopied] = useState(false);
  var url = "orbit.app/chat/xK9m2Pw7";

  if (step === 0) {
    return (
      <div style={{ padding: "10px 0" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: P.g7, marginBottom: 4 }}>새 채팅방 만들기</div>
        <div style={{ fontSize: 10, color: P.g4, marginBottom: 16 }}>채팅방 유형을 선택하세요</div>

        <div onClick={function () { setRoomType("e2ee"); }} style={{ padding: 14, borderRadius: 12, border: roomType === "e2ee" ? "2px solid " + P.grn : "1px solid " + P.bdr, background: roomType === "e2ee" ? P.grnL : "#fff", marginBottom: 8, cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <span style={{ fontSize: 18 }}>🔒</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: P.g7 }}>E2EE 보안채팅방</span>
            {roomType === "e2ee" && <span style={{ marginLeft: "auto", fontSize: 14, color: P.grn }}>✓</span>}
          </div>
          <div style={{ fontSize: 11, color: P.g5, lineHeight: 1.6, marginBottom: 8 }}>종단간 암호화로 가장 안전한 대화</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", background: "#fff", borderRadius: 8, border: "1px solid " + P.bdr }}>
            <span style={{ fontSize: 11, color: P.grn, fontWeight: 600 }}>*서버에 대화내용이 남지않아요</span>
          </div>
          {roomType === "e2ee" && (
            <div onClick={function (e) { e.stopPropagation(); setVpn(!vpn); }} style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, padding: "8px 10px", background: P.priL, borderRadius: 8, cursor: "pointer" }}>
              <div style={{ width: 18, height: 18, borderRadius: 4, border: "2px solid " + P.pri, background: vpn ? P.pri : "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>{vpn && <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>✓</span>}</div>
              <div><div style={{ fontSize: 11, fontWeight: 600, color: P.pri }}>VPN 사용하기</div><div style={{ fontSize: 9, color: P.ylw, fontWeight: 500 }}>5Q/일 차감 · 추가 프라이버시 보호</div></div>
            </div>
          )}
        </div>

        <div onClick={function () { setRoomType("story"); }} style={{ padding: 14, borderRadius: 12, border: roomType === "story" ? "2px solid " + P.ylw : "1px solid " + P.bdr, background: roomType === "story" ? P.ylwL : "#fff", marginBottom: 16, cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <span style={{ fontSize: 18 }}>⏳</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: P.g7 }}>스토리채팅방</span>
            {roomType === "story" && <span style={{ marginLeft: "auto", fontSize: 14, color: P.ylw }}>✓</span>}
          </div>
          <div style={{ fontSize: 11, color: P.g5, lineHeight: 1.6, marginBottom: 8 }}>가벼운 대화를 위한 휘발성 채팅</div>
          <div style={{ padding: "8px 10px", background: "#fff", borderRadius: 8, border: "1px solid " + P.bdr }}>
            <div style={{ fontSize: 9, color: P.g4, marginBottom: 4 }}>⏳ 삭제 타이머 선택</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {["5분", "30분", "1시간", "6시간", "24시간"].map(function (t, i) {
                return <span key={t} style={{ padding: "4px 10px", borderRadius: 12, fontSize: 10, background: i === 2 ? P.ylw + "22" : P.g1, color: i === 2 ? P.ylw : P.g5, border: i === 2 ? "1px solid " + P.ylw : "1px solid " + P.bdr, cursor: "pointer", fontWeight: i === 2 ? 600 : 400 }}>{t}</span>;
              })}
            </div>
          </div>
        </div>

        <button onClick={function () { if (roomType) setStep(1); }} style={{ width: "100%", padding: "14px 0", borderRadius: 12, background: roomType ? P.pri : P.g3, color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: roomType ? "pointer" : "default" }}>채팅방 생성</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "10px 0", textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{roomType === "e2ee" ? "🔒" : "⏳"}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: P.g7, marginBottom: 4 }}>채팅방이 생성되었습니다!</div>
      <div style={{ fontSize: 11, color: P.g5, marginBottom: 16 }}>{roomType === "e2ee" ? "E2EE 보안채팅방" : "스토리채팅방"}{vpn ? " · VPN 활성" : ""}</div>

      <div style={{ background: P.g1, borderRadius: 10, padding: 14, marginBottom: 12 }}>
        <div style={{ fontSize: 10, color: P.g4, marginBottom: 4 }}>초대 URL</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: P.pri, marginBottom: 10, wordBreak: "break-all" }}>{url}</div>
        <button onClick={function () { setCopied(true); setTimeout(function () { setCopied(false); }, 2000); }} style={{ width: "100%", padding: "12px 0", borderRadius: 10, background: copied ? P.grn : P.pri, color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          {copied ? "✓ 복사됨!" : "초대 URL 복사하기"}
        </button>
      </div>

      <div style={{ fontSize: 9, color: P.g4, marginBottom: 16 }}>URL을 공유하면 누구나 채팅방에 참여할 수 있습니다</div>
      <button onClick={function () { nav("msg"); }} style={{ width: "100%", padding: "12px 0", borderRadius: 10, background: P.g1, color: P.g7, border: "none", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>채팅방으로 이동</button>
    </div>
  );
}

// ========== ADD FRIEND ==========
function AddFriend({ nav }) {
  const [searchVal, setSearchVal] = useState("");
  const [found, setFound] = useState(null);
  var results = [
    { name: "사직의별", lv: 51, ac: P.blu, email: "sa***@gmail.com", mutual: 3 },
    { name: "댄스커버_유나", lv: 31, ac: P.pnk, email: "yu***@naver.com", mutual: 1 },
  ];

  function doSearch() {
    if (searchVal.trim().length > 0) setFound(results);
  }

  return (
    <div style={{ padding: "10px 0" }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: P.g7, marginBottom: 4 }}>친구 추가</div>
      <div style={{ fontSize: 10, color: P.g4, marginBottom: 12 }}>아이디 또는 이메일로 검색</div>

      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        <input value={searchVal} onChange={function (e) { setSearchVal(e.target.value); }} onKeyDown={function (e) { if (e.key === "Enter") doSearch(); }} placeholder="아이디 또는 이메일 입력..." style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid " + P.bdr, fontSize: 13, outline: "none", background: P.g1, boxSizing: "border-box" }} />
        <button onClick={doSearch} style={{ padding: "10px 16px", borderRadius: 10, background: P.pri, color: "#fff", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>검색</button>
      </div>

      {found && found.map(function (u) {
        return (
          <div key={u.name} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 8px", marginBottom: 4, borderRadius: 10, background: P.g1 }}>
            <Av n={u.name} s={40} c={u.ac} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ fontSize: 12, fontWeight: 600, color: P.g7 }}>{u.name}</span><span style={{ fontSize: 8, color: P.pri, background: P.priL, padding: "1px 4px", borderRadius: 3 }}>Lv.{u.lv}</span></div>
              <div style={{ fontSize: 9, color: P.g4, marginTop: 1 }}>{u.email} · 함께 아는 친구 {u.mutual}명</div>
            </div>
            <button style={{ padding: "6px 14px", borderRadius: 8, background: P.pri, color: "#fff", border: "none", fontSize: 10, fontWeight: 600, cursor: "pointer" }}>친구 추가</button>
          </div>
        );
      })}

      {!found && (
        <div style={{ textAlign: "center", padding: "30px 0", color: P.g4 }}>
          <div style={{ fontSize: 30, marginBottom: 8 }}>👥</div>
          <div style={{ fontSize: 12 }}>아이디나 이메일로 친구를 찾아보세요</div>
        </div>
      )}

      {/* 연락처에서 친구 찾기 */}
      <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: P.g1 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: P.g7, marginBottom: 6 }}>📋 연락처에서 친구 찾기</div>
        <div style={{ fontSize: 9, color: P.g4, marginBottom: 8 }}>카카오톡 등 기존 연락처를 불러와 OrBit 가입 유저를 매칭합니다</div>
        <div style={{ display: "flex", gap: 6 }}>
          <button style={{ flex: 1, padding: "10px 0", borderRadius: 8, background: "#FEE500", color: "#3C1E1E", border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>💬 카카오톡 연락처</button>
          <button style={{ flex: 1, padding: "10px 0", borderRadius: 8, background: P.g2, color: P.g7, border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>📁 VCF / CSV 파일</button>
        </div>
        <div style={{ fontSize: 7, color: P.g4, marginTop: 6, lineHeight: 1.5 }}>• 이메일만 추출하여 OrBit 가입 여부를 확인합니다<br/>• 연락처 원본은 서버에 저장되지 않습니다<br/>• 매칭된 유저만 친구 추천 목록에 표시됩니다</div>
      </div>
    </div>
  );
}

// ========== PLANET WRITE ==========
function PlanetWrite({ nav, board }) {
  const [mode, setMode] = useState(null);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [selTag, setSelTag] = useState("자유");
  var cometNames = ["혜성 알파알파", "혜성 알파베타", "혜성 베타베타", "혜성 감마세타", "혜성 델타오메가", "혜성 제타카파", "혜성 시그마엡실론", "혜성 오미크론"];
  var myComet = cometNames[Math.floor(Math.random() * cometNames.length)];
  var tags = board && board.fan === "KBO" ? ["자유", "#전의리", "#나주환", "직관", "2차창작", "투표"] : board && board.fan === "BTS" ? ["자유", "#지민", "#RM", "팬아트", "커버댄스"] : ["자유", "리뷰", "팬아트", "투표", "Q&A"];

  if (!mode) {
    return (
      <div style={{ padding: "20px 0" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: P.g7, marginBottom: 4 }}>글쓰기</div>
        <div style={{ fontSize: 11, color: P.g4, marginBottom: 20 }}>{board ? board.name : "플래닛"}에 글을 작성합니다</div>
        <div style={{ display: "flex", gap: 8 }}>
          <div onClick={function () { setMode("public"); }} style={{ flex: 1, padding: 16, borderRadius: 12, border: "2px solid " + P.pri, background: P.priL, textAlign: "center", cursor: "pointer" }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>✏️</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: P.pri, marginBottom: 4 }}>공개 글쓰기</div>
            <div style={{ fontSize: 9, color: P.g5, lineHeight: 1.5 }}>닉네임과 레벨이 표시됩니다<br/>마인드맵에 연결됩니다</div>
          </div>
          <div onClick={function () { setMode("comet"); }} style={{ flex: 1, padding: 16, borderRadius: 12, border: "2px solid " + P.g4, background: P.g1, textAlign: "center", cursor: "pointer" }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>☄️</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: P.g5, marginBottom: 4 }}>혜성 글쓰기</div>
            <div style={{ fontSize: 9, color: P.g5, lineHeight: 1.5 }}>랜덤 익명 닉네임이 부여됩니다<br/>마인드맵에는 비공개 저장</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "10px 0" }}>
      {/* Mode indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
        {mode === "comet" ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, background: P.g1, border: "1px solid " + P.g3 }}>
            <span style={{ fontSize: 16 }}>☄️</span>
            <div><div style={{ fontSize: 12, fontWeight: 600, color: P.g5 }}>{myComet}</div><div style={{ fontSize: 8, color: P.g4 }}>익명으로 작성됩니다</div></div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, background: P.ylw + "15", border: "1px solid " + P.ylw + "44" }}>
            <Av n="직관" s={24} c={P.blu} />
            <div><div style={{ fontSize: 12, fontWeight: 600, color: P.g7 }}>직관러_사직</div><div style={{ fontSize: 8, color: P.pri }}>Lv.34 · 공개</div></div>
          </div>
        )}
        <button onClick={function () { setMode(null); }} style={{ marginLeft: "auto", fontSize: 10, color: P.g4, background: "none", border: "none", cursor: "pointer" }}>← 모드 변경</button>
      </div>

      {/* Hashtag selector */}
      <div style={{ display: "flex", gap: 4, marginBottom: 10, overflowX: "auto" }}>
        {tags.map(function (t) {
          return <button key={t} onClick={function () { setSelTag(t); }} style={{ padding: "4px 10px", borderRadius: 12, fontSize: 10, background: selTag === t ? P.pri : P.g1, color: selTag === t ? "#fff" : P.g5, border: "none", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>{t}</button>;
        })}
      </div>

      {/* Title */}
      <input value={title} onChange={function (e) { setTitle(e.target.value); }} placeholder="제목을 입력하세요" style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid " + P.bdr, fontSize: 14, fontWeight: 500, outline: "none", marginBottom: 8, boxSizing: "border-box" }} />

      {/* Content */}
      <textarea value={text} onChange={function (e) { setText(e.target.value); }} placeholder={mode === "comet" ? "혜성으로 자유롭게 작성하세요..." : "내용을 입력하세요..."} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid " + P.bdr, fontSize: 12, outline: "none", resize: "none", minHeight: 120, fontFamily: "inherit", boxSizing: "border-box", marginBottom: 10 }} />

      {/* Media buttons */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14, fontSize: 18, color: P.g4 }}>
        <span style={{ cursor: "pointer" }}>🖼</span>
        <span style={{ cursor: "pointer" }}>📊</span>
        <span style={{ cursor: "pointer" }}>📍</span>
        <span style={{ cursor: "pointer" }}>🔗</span>
      </div>

      {/* Preview */}
      {(title || text) && (
        <div style={{ background: P.g1, borderRadius: 8, padding: 10, marginBottom: 12 }}>
          <div style={{ fontSize: 9, color: P.g4, marginBottom: 4 }}>미리보기</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
            {mode === "comet" ? <span style={{ fontSize: 10, color: P.g4 }}>☄️ {myComet}</span> : <span style={{ fontSize: 10, fontWeight: 600, color: P.g7 }}>직관러_사직 <span style={{ fontSize: 8, color: P.pri }}>Lv.34</span></span>}
            <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 3, background: P.pri + "22", color: P.pri }}>{selTag}</span>
          </div>
          {title && <div style={{ fontSize: 12, fontWeight: 500, color: P.g7 }}>{title}</div>}
          {text && <div style={{ fontSize: 10, color: P.g5, marginTop: 2 }}>{text.slice(0, 50)}{text.length > 50 ? "..." : ""}</div>}
        </div>
      )}

      <button onClick={function () { nav("boardDetail"); }} style={{ width: "100%", padding: "14px 0", borderRadius: 12, background: (title && text) ? P.pri : P.g3, color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: (title && text) ? "pointer" : "default" }}>
        {mode === "comet" ? "☄️ 혜성으로 게시" : "게시하기"}
      </button>
    </div>
  );
}

// ========== CREATE COMMUNITY ==========
function CreateCommunity({ nav }) {
  const [createTab, setCreateTab] = useState(null);
  var conditions = [
    { label: "통합 구독자 300명 이상", met: false, current: "1,200명", icon: "👥" },
    { label: "계정 레벨 Lv.10 이상", met: true, current: "Lv.34", icon: "📊" },
    { label: "큐빗 200Q 소각 (개설 비용)", met: true, current: "482Q 보유", icon: "💰" },
    { label: "플래닛 활동 30일 이상", met: true, current: "127일", icon: "📅" },
    { label: "경고/제재 이력 없음", met: true, current: "클린", icon: "✅" },
  ];
  var allMet = conditions.every(function (c) { return c.met; });

  if (!createTab) {
    return (
      <div style={{ padding: "10px 0" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 30, marginBottom: 8 }}>🪐</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: P.g7 }}>플래닛 만들기</div>
          <div style={{ fontSize: 11, color: P.g5 }}>어떤 플래닛을 만들고 싶으세요?</div>
        </div>

        {/* 공식 플래닛 */}
        <div onClick={function () { setCreateTab("official"); }} style={{ padding: 14, borderRadius: 12, background: P.bluL, border: "1.5px solid " + P.blu + "44", marginBottom: 10, cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <span style={{ fontSize: 20 }}>🏛</span>
            <div><div style={{ fontSize: 14, fontWeight: 600, color: P.blu }}>공식 플래닛 신청</div><div style={{ fontSize: 9, color: P.g4 }}>투표 선출 매니저 · 정규 보상 · BV 연동</div></div>
            <span style={{ marginLeft: "auto", fontSize: 14, color: P.g4 }}>→</span>
          </div>
        </div>

        {/* 캐스터 새틀릿 */}
        <div onClick={function () { setCreateTab("satellite"); }} style={{ padding: 14, borderRadius: 12, background: P.ylwL, border: "1.5px solid " + P.ylw + "44", cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <span style={{ fontSize: 20 }}>⭐</span>
            <div><div style={{ fontSize: 14, fontWeight: 600, color: P.ylw }}>캐스터 새틀릿 만들기</div><div style={{ fontSize: 9, color: P.g4 }}>영구 매니저 · 구독 수익 70% · 기프트콘</div></div>
            <span style={{ marginLeft: "auto", fontSize: 14, color: P.g4 }}>→</span>
          </div>
        </div>
      </div>
    );
  }

  if (createTab === "official") {
    return (
      <div style={{ padding: "10px 0" }}>
        <div onClick={function () { setCreateTab(null); }} style={{ fontSize: 10, color: P.g4, cursor: "pointer", marginBottom: 10 }}>← 뒤로</div>
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 28 }}>🏛</span>
          <div style={{ fontSize: 16, fontWeight: 700, color: P.blu, marginTop: 4 }}>공식 플래닛 신청</div>
          <div style={{ fontSize: 11, color: P.g5, marginTop: 4 }}>어떤 플래닛이 필요한가요?</div>
        </div>
        <div style={{ overflow: "hidden", marginBottom: 14 }}>
          <style>{"@keyframes catScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }"}</style>
          <div style={{ display: "flex", gap: 6, animation: "catScroll 12s linear infinite", width: "200%" }}>
            {["⚾ KBO", "🎵 K-pop", "🎌 애니메이션", "🎮 e스포츠", "📺 드라마", "🎬 영화", "📚 도서", "🏀 NBA", "⚽ 축구", "🎸 밴드", "🎤 트로트", "🖥 IT/테크", "⚾ KBO", "🎵 K-pop", "🎌 애니메이션", "🎮 e스포츠", "📺 드라마", "🎬 영화"].map(function (t, i) {
              return <span key={i} style={{ padding: "6px 14px", borderRadius: 16, background: P.blu + "12", color: P.blu, fontSize: 11, fontWeight: 500, whiteSpace: "nowrap", cursor: "pointer", border: "1px solid " + P.blu + "33", flexShrink: 0 }}>{t}</span>;
            })}
          </div>
        </div>
        <input placeholder="플래닛 이름 (예: 두산베어스)" style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid " + P.bdr, fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 8 }} />
        <textarea placeholder="이 플래닛이 필요한 이유를 알려주세요" style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid " + P.bdr, fontSize: 12, outline: "none", resize: "none", minHeight: 60, fontFamily: "inherit", boxSizing: "border-box", marginBottom: 10 }} />
        <div style={{ padding: 8, borderRadius: 8, background: P.g1, marginBottom: 12 }}>
          <div style={{ fontSize: 9, color: P.g4, lineHeight: 1.6 }}>• 신청은 운영팀 검토 후 승인됩니다 (1~3일)<br/>• 승인 시 첫 홈마스터 선거가 자동 시작됩니다<br/>• 공식 플래닛은 생성 조건이 없습니다</div>
        </div>
        <button style={{ width: "100%", padding: "14px 0", borderRadius: 12, background: P.blu, color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>🏛 공식 플래닛 신청하기</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "10px 0" }}>
      <div onClick={function () { setCreateTab(null); }} style={{ fontSize: 10, color: P.g4, cursor: "pointer", marginBottom: 10 }}>← 뒤로</div>
      <div style={{ textAlign: "center", marginBottom: 14 }}>
        <span style={{ fontSize: 28 }}>⭐</span>
        <div style={{ fontSize: 16, fontWeight: 700, color: P.ylw, marginTop: 4 }}>캐스터 새틀릿 만들기</div>
        <div style={{ fontSize: 11, color: P.g5, marginTop: 4 }}>내가 매니저로 영구 운영하는 새틀릿</div>
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: P.g7, marginBottom: 6 }}>생성 조건</div>
      {conditions.map(function (c) {
        return (
          <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", marginBottom: 3, borderRadius: 8, background: c.met ? P.grnL : P.redL }}>
            <span style={{ fontSize: 14 }}>{c.icon}</span>
            <div style={{ flex: 1 }}><div style={{ fontSize: 10, fontWeight: 500, color: P.g7 }}>{c.label}</div><div style={{ fontSize: 8, color: c.met ? P.grn : P.red }}>{c.current}</div></div>
            <span style={{ fontSize: 12, color: c.met ? P.grn : P.red }}>{c.met ? "✓" : "✗"}</span>
          </div>
        );
      })}
      <div style={{ marginTop: 10, padding: 8, borderRadius: 8, background: P.priL, border: "1px dashed " + P.pri }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: P.pri, marginBottom: 3 }}>⚡ 패스트트랙</div>
        <div style={{ fontSize: 8, color: P.g5, lineHeight: 1.6 }}>외부 크리에이터(유튜브 1만+) 인증 시 구독자 50명 + Lv.5로 완화</div>
      </div>
      <div style={{ marginTop: 10, padding: 8, borderRadius: 8, background: P.g1 }}>
        <div style={{ fontSize: 9, fontWeight: 600, color: P.g7, marginBottom: 3 }}>🔒 오픈소스 보안 프로토콜</div>
        <div style={{ fontSize: 8, color: P.g4, lineHeight: 1.6 }}>OrBit Signal Protocol (OSP) · X25519 키교환<br/>AES-256-GCM 암호화 · 서버 메타데이터 미저장</div>
      </div>
      <button style={{ width: "100%", marginTop: 12, padding: "14px 0", borderRadius: 12, background: allMet ? P.ylw : P.g3, color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: allMet ? "pointer" : "default" }}>
        {allMet ? "⭐ 캐스터 새틀릿 개설 (200Q 소각)" : "조건을 모두 충족해야 합니다"}
      </button>
    </div>
  );
}

// ========== GLOBAL SEARCH ==========
function GlobalSearch({ nav, query }) {
  var trending = ["전의리 홈런", "BTS 컴백", "무한성 편", "크리에이터J", "KT 트레이드"];
  var results = [
    { type: "planet", icon: "🏛", name: "롯데자이언츠", sub: "전의리 관련 게시물 12개", c: P.blu },
    { type: "thought", icon: "💭", name: "사직의별", sub: "전의리 슬라이더 분석 중...", c: P.pri },
    { type: "cast", icon: "🛰", name: "직관러_사직", sub: "롯데 vs 삼성 입중계", c: P.red },
    { type: "user", icon: "👤", name: "전의리_팬", sub: "Lv.28 · 팔로워 342", c: P.grn },
  ];
  return (
    <div style={{ padding: "10px 0" }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        <input defaultValue={query || ""} placeholder="플래닛 · 생각 · 캐스트 · 사람 검색..." style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid " + P.bdr, fontSize: 13, outline: "none", background: P.g1, boxSizing: "border-box" }} />
      </div>
      {!query && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: P.g7, marginBottom: 6 }}>🔥 실시간 트렌딩</div>
          {trending.map(function (t, i) {
            return <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 6px", cursor: "pointer", borderRadius: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: i === 0 ? P.red : P.g4, width: 20, textAlign: "center" }}>{i + 1}</span>
              <span style={{ fontSize: 12, color: P.g7 }}>{t}</span>
              <span style={{ marginLeft: "auto", fontSize: 9, color: i === 0 ? P.red : P.g4 }}>{["▲2,340", "▲1,890", "▲1,234", "▲987", "▲756"][i]}</span>
            </div>;
          })}
        </div>
      )}
      {query && (
        <div>
          <div style={{ fontSize: 10, color: P.g4, marginBottom: 8 }}>"{query}" 검색 결과</div>
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            {["전체", "플래닛", "생각", "캐스트", "사람"].map(function (t, i) {
              return <button key={t} style={{ padding: "4px 12px", borderRadius: 14, fontSize: 10, background: i === 0 ? P.pri : P.g1, color: i === 0 ? "#fff" : P.g5, border: "none", cursor: "pointer" }}>{t}</button>;
            })}
          </div>
          {results.map(function (r) {
            return <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 6px", borderBottom: "1px solid " + P.g1, cursor: "pointer" }}>
              <span style={{ fontSize: 16 }}>{r.icon}</span>
              <div style={{ flex: 1 }}><div style={{ fontSize: 11, fontWeight: 600, color: r.c }}>{r.name}</div><div style={{ fontSize: 9, color: P.g4 }}>{r.sub}</div></div>
            </div>;
          })}
          <div style={{ marginTop: 12, fontSize: 10, color: P.g4, textAlign: "center" }}>전역 해시태그: #{query}로 모든 플래닛 검색</div>
        </div>
      )}
    </div>
  );
}

// ========== APP ==========
export default function App() {
  const [scr, setScr] = useState("onboarding");
  const [board, setBoard] = useState(BOARDS[0]);
  const [chatTarget, setChatTarget] = useState(null);
  const [showLive, setShowLive] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [showGiftBox, setShowGiftBox] = useState(false);
  const [showRecharge, setShowRecharge] = useState(false);
  const [onboardStep, setOnboardStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  function navTo(s) {
    if (s === "live") { setShowLive(true); }
    else { setShowLive(false); if (s) setScr(s); }
  }

  function renderScreen() {
    switch (scr) {
      case "onboarding": return (
        <div>
          {/* Onboarding Flow */}
          {onboardStep === 0 && (
            <div style={{ textAlign: "center", padding: "30px 10px" }}>
              <svg width="60" height="60" viewBox="0 0 40 40" fill="none" style={{ margin: "0 auto 12px" }}>
                <circle cx="20" cy="20" r="12" stroke="#1B2838" strokeWidth="3" fill="none"/>
                <ellipse cx="20" cy="20" rx="18" ry="7" stroke="#1B2838" strokeWidth="1.5" fill="none" transform="rotate(-25 20 20)"/>
              </svg>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#1B2838", marginBottom: 4 }}>OrBit</div>
              <div style={{ fontSize: 13, color: P.g5, lineHeight: 1.6, marginBottom: 24 }}>팬이 주인이 되는 플랫폼</div>
              <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 20, background: P.grnL, marginBottom: 16 }}><span style={{ fontSize: 12, color: P.grn, fontWeight: 600 }}>📧 이메일만 있으면 회원가입 끝!</span></div>
              <button onClick={function () { setOnboardStep(1); }} style={{ width: "100%", padding: "14px 0", borderRadius: 12, background: P.pri, color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>시작하기</button>
              <div style={{ fontSize: 10, color: P.g4, marginTop: 10 }}>이미 계정이 있나요? <span style={{ color: P.pri, cursor: "pointer" }}>로그인</span></div>
            </div>
          )}
          {onboardStep === 1 && (
            <div style={{ padding: "20px 0" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: P.g7, marginBottom: 4 }}>프로필 설정</div>
              <div style={{ fontSize: 11, color: P.g4, marginBottom: 16 }}>AR 필터로 30초 만에 시작!</div>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg," + P.pri + "," + P.pnk + ")", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 72, height: 72, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>😊</div></div>
                <div style={{ fontSize: 10, color: P.pri, marginTop: 6, cursor: "pointer" }}>AR 필터 선택 →</div>
              </div>
              <input placeholder="닉네임을 입력하세요" style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid " + P.bdr, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 8 }} />
              <input placeholder="이메일 (로그인용)" style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid " + P.bdr, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 10 }} />
              <div style={{ padding: 10, borderRadius: 10, background: P.g1, marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: P.g7, marginBottom: 6 }}>📦 기존 SNS 데이터 가져오기 (선택)</div>
                <div style={{ fontSize: 8, color: P.g4, marginBottom: 6 }}>기존 플랫폼의 데이터를 OrBit에 맞게 변환합니다</div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {[{ name: "X", icon: "𝕏", c: "#000" }, { name: "Threads", icon: "🧵", c: P.g7 }, { name: "Instagram", icon: "📸", c: P.pnk }, { name: "Facebook", icon: "📘", c: P.blu }].map(function (s) {
                    return <div key={s.name} style={{ flex: 1, padding: "6px 4px", borderRadius: 8, border: "1px dashed " + P.bdr, textAlign: "center", cursor: "pointer", minWidth: 60 }}><div style={{ fontSize: 14 }}>{s.icon}</div><div style={{ fontSize: 7, fontWeight: 500, color: s.c }}>{s.name}</div></div>;
                  })}
                </div>
                <div style={{ fontSize: 7, color: P.g4, marginTop: 4, textAlign: "center" }}>JSON · CSV · HTML · ZIP 지원</div>
              </div>
              <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
                {["AR필터", "2D아바타", "3D VR"].map(function (m, i) { return <span key={m} style={{ flex: 1, padding: "8px 0", borderRadius: 8, background: i === 0 ? P.pri : P.g1, color: i === 0 ? "#fff" : P.g5, fontSize: 11, textAlign: "center", cursor: "pointer" }}>{m}</span>; })}
              </div>
              <button onClick={function () { setOnboardStep(2); }} style={{ width: "100%", padding: "14px 0", borderRadius: 12, background: P.pri, color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>다음</button>
            </div>
          )}
          {onboardStep === 2 && (
            <div style={{ padding: "20px 0" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: P.g7, marginBottom: 4 }}>관심 팬덤 선택</div>
              <div style={{ fontSize: 11, color: P.g4, marginBottom: 16 }}>3개 이상 선택하면 맞춤 추천!</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[
                  { name: "KBO", c: P.blu }, { name: "K-pop", c: P.pur }, { name: "애니", c: P.red },
                  { name: "e스포츠", c: P.ylw }, { name: "영화", c: P.crl }, { name: "롯데", c: P.blu },
                  { name: "BTS", c: P.pur }, { name: "원피스", c: P.crl }, { name: "LCK", c: P.ylw },
                  { name: "BLACKPINK", c: P.pnk }, { name: "귀멸의 칼날", c: P.red }, { name: "축구", c: P.grn },
                ].map(function (f) { return (
                  <div key={f.name} style={{ padding: "10px 16px", borderRadius: 20, border: "2px solid " + f.c + "44", background: f.c + "11", cursor: "pointer", fontSize: 12, color: f.c, fontWeight: 500 }}>{f.name}</div>
                ); })}
              </div>
              <button onClick={function () { setOnboardStep(3); }} style={{ width: "100%", padding: "14px 0", borderRadius: 12, background: P.pri, color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: 20 }}>다음</button>
            </div>
          )}
          {onboardStep === 3 && (
            <div style={{ padding: "20px 0" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: P.g7, marginBottom: 4 }}>첫 플래닛 가입</div>
              <div style={{ fontSize: 11, color: P.g4, marginBottom: 16 }}>관심사에 맞는 추천 플래닛입니다</div>
              {BOARDS.slice(0, 4).map(function (b) { return (
                <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 8px", marginBottom: 4, borderRadius: 10, background: P.g1 }}>
                  <Av n={b.name} s={36} c={b.color} />
                  <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 600, color: P.g7 }}>{b.name}</div><div style={{ fontSize: 9, color: P.g4 }}>{b.mem.toLocaleString()}명 · {b.fan}</div></div>
                  <button style={{ padding: "6px 14px", borderRadius: 8, background: P.pri, color: "#fff", border: "none", fontSize: 10, fontWeight: 600, cursor: "pointer" }}>가입</button>
                </div>
              ); })}
              <button onClick={function () { setOnboardStep(4); }} style={{ width: "100%", padding: "14px 0", borderRadius: 12, background: P.pri, color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: 12 }}>다음</button>
            </div>
          )}
          {onboardStep === 4 && (
            <div style={{ padding: "20px 0", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: P.g7, marginBottom: 6 }}>환영합니다!</div>
              <div style={{ fontSize: 12, color: P.g5, lineHeight: 1.6, marginBottom: 8 }}>가입 보상으로 <span style={{ color: P.ylw, fontWeight: 700 }}>10Q</span> 큐빗을 받았습니다</div>
              <div style={{ background: P.g1, borderRadius: 12, padding: 14, marginBottom: 16, textAlign: "left" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: P.g7, marginBottom: 8 }}>OrBit에서 할 수 있는 것</div>
                {["🧠 내 생각을 기록하면 AI가 자동으로 분류해줍니다", "👥 진짜 친구를 찾아주고 안전하게 대화합니다", "🪐 함께 노는 공간, 플래닛에서 팬덤을 만납니다", "🛰 AR/VR 캐스트로 방송하고 도네이션 받기", "💰 활동할수록 큐빗이 쌓이고 기프트콘 교환"].map(function (t) { return <div key={t} style={{ fontSize: 10, color: P.g6, padding: "4px 0", lineHeight: 1.5 }}>{t}</div>; })}
              </div>
              <button onClick={function () { setScr("home"); }} style={{ width: "100%", padding: "14px 0", borderRadius: 12, background: P.pri, color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>OrBit 시작하기 🚀</button>
            </div>
          )}
          {/* Step indicator */}
          {onboardStep > 0 && onboardStep < 4 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 16 }}>
              {[1, 2, 3].map(function (s) { return <div key={s} style={{ width: s === onboardStep ? 20 : 6, height: 6, borderRadius: 3, background: s === onboardStep ? P.pri : P.g3, transition: "width 0.2s" }} />; })}
            </div>
          )}
        </div>
      );
      case "home": return <Home nav={navTo} setBoard={setBoard} />;
      case "board": return <BoardTab nav={navTo} setBoard={setBoard} setCurBoard={setBoard} />;
      case "boardDetail": return <BoardDetail board={board} nav={navTo} />;
      case "planetwrite": return <PlanetWrite nav={navTo} board={board} />;
      case "createcom": return <CreateCommunity nav={navTo} />;
      case "search": return <GlobalSearch nav={navTo} query={searchQuery} />;
      case "msg": return <MsgList nav={navTo} setChat={setChatTarget} />;
      case "newchat": return <NewChatFlow nav={navTo} />;
      case "addfriend": return <AddFriend nav={navTo} />;
      case "chat": return <Chat target={chatTarget} nav={navTo} />;
      case "pubchat": return <PubChat nav={navTo} />;
      case "map": return <MindMap />;
      case "me": return <Profile />;
      default: return <Home nav={navTo} setBoard={setBoard} />;
    }
  }

  const [showNotif, setShowNotif] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState("알림");

  var notifItems = [
    { icon: "💬", text: "사직의별님이 내 글에 댓글을 남겼습니다", time: "3분 전", read: false },
    { icon: "⭐", text: "부산갈매기_01님이 내 생각을 리마인드했습니다", time: "15분 전", read: false },
    { icon: "🧠", text: "새로운 플래닛 추천: 두산베어스 (87% 매칭)", time: "1시간 전", read: false },
    { icon: "🛰", text: "크리에이터 J 캐스트 시작! 지금 시청하세요", time: "2시간 전", read: true },
    { icon: "🗳️", text: "롯데자이언츠 홈마스터 선거 D-30", time: "오늘", read: true },
    { icon: "🔥", text: "출석체크 보상 +1Q 적립되었습니다", time: "오늘", read: true },
    { icon: "🏆", text: "VS 대결 종료! 롯데 승리 · +3Q 보상", time: "어제", read: true },
  ];

  function goBack() {
    if (scr === "chat" || scr === "pubchat" || scr === "newchat" || scr === "addfriend") setScr("msg");
    else if (scr === "boardDetail" || scr === "createcom" || scr === "planetwrite" || scr === "search") setScr("board");
    else setScr("home");
  }

  var showTop = scr !== "home" && scr !== "onboarding";

  if (showLive) return <BroadcastFeed nav={navTo} setBoard={setBoard} />;

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", background: "#fff", minHeight: "100vh", fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif', position: "relative", paddingBottom: scr === "onboarding" ? 0 : 60 }}>
      {showTop && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderBottom: "1px solid " + P.bdr, position: "sticky", top: 0, background: "#fff", zIndex: 10 }}>
          <button onClick={goBack} style={{ background: "none", border: "none", fontSize: 15, cursor: "pointer", padding: "0 3px", color: P.g5 }}>←</button>
          {scr === "board" && <span style={{ fontSize: 13, fontWeight: 600, color: P.g7 }}>플래닛</span>}
          {scr === "msg" && <span style={{ fontSize: 13, fontWeight: 600, color: P.g7 }}>시그널</span>}
          {scr === "me" && <span style={{ fontSize: 13, fontWeight: 600, color: P.g7 }}>프로필</span>}
          {scr === "boardDetail" && <span style={{ fontSize: 13, fontWeight: 600, color: P.g7 }}>{board.name}</span>}
          {scr === "chat" && chatTarget && <span style={{ fontSize: 13, fontWeight: 600, color: P.g7 }}>{chatTarget.name}</span>}
          {scr === "pubchat" && <span style={{ fontSize: 13, fontWeight: 600, color: P.g7 }}>응원방 <span style={{ color: P.red }}>●</span></span>}
          {scr === "map" && <span style={{ fontSize: 13, fontWeight: 600, color: P.g7 }}>마인드맵</span>}
          {scr === "newchat" && <span style={{ fontSize: 13, fontWeight: 600, color: P.g7 }}>새 채팅방</span>}
          {scr === "addfriend" && <span style={{ fontSize: 13, fontWeight: 600, color: P.g7 }}>친구 추가</span>}
          {scr === "createcom" && <span style={{ fontSize: 13, fontWeight: 600, color: P.g7 }}>새틀릿 만들기</span>}
          {scr === "search" && <span style={{ fontSize: 13, fontWeight: 600, color: P.g7 }}>검색</span>}
          {scr === "planetwrite" && <span style={{ fontSize: 13, fontWeight: 600, color: P.g7 }}>{board.name} 글쓰기</span>}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
            {scr === "board" && <input onClick={function () { navTo("search"); }} placeholder="🔍 검색..." readOnly style={{ cursor: "pointer", padding: "5px 10px", borderRadius: 7, border: "1px solid " + P.bdr, fontSize: 10, outline: "none", width: 90, background: P.g1, boxSizing: "border-box" }} />}
            {scr === "board" && (
              <button onClick={function () { setShowNotif(!showNotif); }} style={{ width: 26, height: 26, borderRadius: "50%", background: showNotif ? P.pri : P.g1, border: "none", cursor: "pointer", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 12, color: showNotif ? "#fff" : P.g5 }}>🔔</span>
                <span style={{ position: "absolute", top: -1, right: -1, width: 7, height: 7, borderRadius: "50%", background: P.red, border: "1px solid #fff" }} />
              </button>
            )}
            {scr === "msg" && (
              <button onClick={function () { setShowNotif(!showNotif); }} style={{ width: 26, height: 26, borderRadius: "50%", background: showNotif ? P.pri : P.g1, border: "none", cursor: "pointer", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 12, color: showNotif ? "#fff" : P.g5 }}>🔔</span>
                <span style={{ position: "absolute", top: -1, right: -1, width: 7, height: 7, borderRadius: "50%", background: P.red, border: "1px solid #fff" }} />
              </button>
            )}
            {scr === "msg" && <button onClick={function () { navTo("addfriend"); }} style={{ padding: "4px 8px", borderRadius: 6, background: P.g1, border: "none", fontSize: 9, color: P.g5, cursor: "pointer" }}>👤+ 친구추가</button>}
            {scr === "me" && <button onClick={function () { setShowSettings(true); }} style={{ padding: "4px 8px", borderRadius: 6, background: P.g1, border: "none", fontSize: 9, color: P.g5, cursor: "pointer" }}>⚙️ 설정</button>}
            {scr !== "me" && scr !== "board" && scr !== "msg" && (
              <button onClick={function () { setShowNotif(!showNotif); }} style={{ width: 26, height: 26, borderRadius: "50%", background: showNotif ? P.pri : P.g1, border: "none", cursor: "pointer", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 12, color: showNotif ? "#fff" : P.g5 }}>🔔</span>
                <span style={{ position: "absolute", top: -1, right: -1, width: 7, height: 7, borderRadius: "50%", background: P.red, border: "1px solid #fff" }} />
              </button>
            )}
          </div>
        </div>
      )}
      {showNotif && (
        <div style={{ position: "absolute", top: 42, right: 10, width: 260, background: "#fff", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", border: "1px solid " + P.bdr, zIndex: 15, maxHeight: 300, overflowY: "auto" }}>
          <div style={{ padding: "8px 10px", borderBottom: "1px solid " + P.bdr, display: "flex", alignItems: "center" }}><span style={{ fontSize: 11, fontWeight: 600, color: P.g7 }}>알림</span><span style={{ marginLeft: "auto", fontSize: 8, color: P.pri, cursor: "pointer" }}>모두 읽음</span></div>
          {notifItems.map(function (n, i) {
            return <div key={i} style={{ display: "flex", gap: 6, padding: "7px 10px", background: n.read ? "#fff" : P.priL, borderBottom: "1px solid " + P.g1, cursor: "pointer" }}><span style={{ fontSize: 12 }}>{n.icon}</span><div style={{ flex: 1 }}><div style={{ fontSize: 9, color: n.read ? P.g5 : P.g7, fontWeight: n.read ? 400 : 500, lineHeight: 1.4 }}>{n.text}</div><div style={{ fontSize: 7, color: P.g4 }}>{n.time}</div></div>{!n.read && <span style={{ width: 6, height: 6, borderRadius: "50%", background: P.pri, marginTop: 4 }} />}</div>;
          })}
          <div onClick={function () { setShowNotif(false); }} style={{ padding: "8px", textAlign: "center", fontSize: 9, color: P.pri, cursor: "pointer" }}>⚙️ 알림 설정</div>
        </div>
      )}
      <div style={{ padding: "12px 14px 0" }}>{renderScreen()}</div>

      {/* Settings Screen */}
      {showSettings && (
        <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, height: "100vh", background: "#fff", zIndex: 30, overflowY: "auto" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid " + P.bdr, display: "flex", alignItems: "center", gap: 8, position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
            <span onClick={function () { setShowSettings(false); }} style={{ fontSize: 14, cursor: "pointer", color: P.g5 }}>←</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: P.g7 }}>설정</span>
          </div>
          <div style={{ padding: "0 16px" }}>
            <div style={{ display: "flex", gap: 0, borderBottom: "1px solid " + P.bdr, marginBottom: 10, marginTop: 6 }}>
              {["알림", "개인정보", "콘텐츠", "안전", "기술", "계정"].map(function (t) {
                return <button key={t} onClick={function () { setSettingsTab(t); }} style={{ padding: "6px 0", fontSize: 9, fontWeight: settingsTab === t ? 600 : 400, color: settingsTab === t ? P.pri : P.g4, background: "none", border: "none", borderBottom: settingsTab === t ? "2px solid " + P.pri : "none", cursor: "pointer", flex: 1 }}>{t}</button>;
              })}
            </div>

            {settingsTab === "알림" && (
              <div>
                {[
                  { label: "내 글 반응 알림", on: true },
                  { label: "리마인드 체인 알림", on: true },
                  { label: "마인드맵 매칭 플래닛 추천", on: true },
                  { label: "구독 캐스터 방송 시작 알림", on: true },
                  { label: "홈마스터 선거 알림", on: true },
                  { label: "출석체크 리마인더", on: false },
                  { label: "VS 대결 종료/보상 알림", on: true },
                  { label: "DM 알림", on: true },
                  { label: "그룹 시그널 알림", on: true },
                  { label: "플래닛 채널 알림", on: false },
                  { label: "스포일러 키워드 제한", on: false },
                ].map(function (s) {
                  return <div key={s.label} style={{ display: "flex", alignItems: "center", padding: "8px 0", borderBottom: "1px solid " + P.g1 }}><span style={{ fontSize: 11, color: P.g7, flex: 1 }}>{s.label}</span><div style={{ width: 32, height: 18, borderRadius: 9, background: s.on ? P.pri : P.g3, padding: 2, cursor: "pointer" }}><div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", marginLeft: s.on ? 14 : 0, transition: "0.2s" }} /></div></div>;
                })}
              </div>
            )}

            {settingsTab === "개인정보" && (
              <div>
                {["개인정보 처리방침", "이용약관", "위치정보 이용약관", "📥 내 데이터 내려받기 (JSON)", "📤 기존 SNS 데이터 업로드 (X/인스타/페북)", "계정 삭제 요청", "마케팅 수신 동의"].map(function (t) {
                  return <div key={t} style={{ padding: "10px 0", borderBottom: "1px solid " + P.g1, fontSize: 11, color: P.g7, cursor: "pointer", display: "flex" }}><span style={{ flex: 1 }}>{t}</span><span style={{ color: P.g4 }}>→</span></div>;
                })}
              </div>
            )}

            {settingsTab === "콘텐츠" && (
              <div>
                {["저작권 신고/삭제 프로세스", "직캠·공연 영상 업로드 정책", "스포츠 경기 영상 권리 제한", "음원 사용 제한 (업로드 시)", "애니/드라마 캡처 허용 범위", "AI 추천 저작권 콘텐츠 필터", "크리에이터 콘텐츠 라이선스", "자동 번역 설정"].map(function (t) {
                  return <div key={t} style={{ padding: "10px 0", borderBottom: "1px solid " + P.g1, fontSize: 11, color: P.g7, cursor: "pointer", display: "flex" }}><span style={{ flex: 1 }}>{t}</span><span style={{ color: P.g4 }}>→</span></div>;
                })}
              </div>
            )}

            {settingsTab === "안전" && (
              <div>
                {[
                  { label: "신고 접수 내역", desc: "내가 접수한 신고 현황" },
                  { label: "차단/뮤트 관리", desc: "차단 3명 · 뮤트 1명" },
                  { label: "라이브 캐스트 안전 장치", desc: "부적절 콘텐츠 자동 감지" },
                  { label: "미성년자 보호 설정", desc: "연령 제한 콘텐츠 필터" },
                  { label: "스토킹/괴롭힘 방지", desc: "반복 접근 자동 차단" },
                  { label: "2단계 인증", desc: "활성화됨" },
                ].map(function (t) {
                  return <div key={t.label} style={{ padding: "10px 0", borderBottom: "1px solid " + P.g1, cursor: "pointer" }}><div style={{ fontSize: 11, color: P.g7 }}>{t.label}</div><div style={{ fontSize: 8, color: P.g4 }}>{t.desc}</div></div>;
                })}
              </div>
            )}

            {settingsTab === "기술" && (
              <div>
                {[
                  { label: "카메라·마이크 권한", desc: "캐스트 사용 시 필요" },
                  { label: "AR 얼굴 트래킹 설정", desc: "AR 필터 캐스트 시" },
                  { label: "VR 디바이스 연결", desc: "3D VR 캐스트 시" },
                  { label: "E2EE 프로토콜 정보", desc: "OrBit Signal Protocol (OSP)" },
                  { label: "데이터 사용량", desc: "이번 달 1.2GB" },
                  { label: "캐시 / 저장공간", desc: "423MB 사용 중" },
                  { label: "앱 버전", desc: "v0.1.0-beta" },
                ].map(function (t) {
                  return <div key={t.label} style={{ padding: "10px 0", borderBottom: "1px solid " + P.g1 }}><div style={{ fontSize: 11, color: P.g7 }}>{t.label}</div><div style={{ fontSize: 8, color: P.g4 }}>{t.desc}</div></div>;
                })}
              </div>
            )}

            {settingsTab === "계정" && (
              <div>
                <div style={{ padding: "10px 0", borderBottom: "1px solid " + P.g1, fontSize: 11, color: P.g7, cursor: "pointer" }}>계정 전환</div>
                <div style={{ padding: "10px 0", borderBottom: "1px solid " + P.g1, fontSize: 11, color: P.g7, cursor: "pointer" }}>자동 번역 언어 설정</div>
                <div style={{ padding: "10px 0", borderBottom: "1px solid " + P.g1, fontSize: 11, color: P.g7, cursor: "pointer" }}>연결된 소셜 계정</div>
                <button style={{ width: "100%", marginTop: 14, padding: "12px 0", borderRadius: 10, background: P.red, color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>로그아웃</button>
              </div>
            )}
          </div>
        </div>
      )}


      {/* Gift Box Overlay */}
      {showGiftBox && (
        <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, height: "100vh", background: "rgba(0,0,0,0.5)", zIndex: 25, display: "flex", alignItems: "flex-end" }}>
          <div style={{ width: "100%", background: "#fff", borderRadius: "16px 16px 0 0", padding: "16px 14px 80px", maxHeight: "70vh", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: P.g7 }}>🎁 선물함</span>
              <span style={{ fontSize: 10, color: P.g4, marginLeft: 6 }}>받은 기프트콘</span>
              <span onClick={function () { setShowGiftBox(false); }} style={{ marginLeft: "auto", fontSize: 16, color: P.g4, cursor: "pointer" }}>✕</span>
            </div>
            {[
              { icon: "☕", name: "스타벅스 아메리카노", from: "부산갈매기_01", date: "오늘", used: false, msg: "직관러형 오늘 입중계 고생!" },
              { icon: "🍗", name: "BBQ 황금올리브", from: "사직의별", date: "어제", used: false, msg: "홈런 기념 치킨 드세요!" },
              { icon: "🎬", name: "CGV 영화 관람권", from: "purple_rain_07", date: "3일 전", used: true, msg: "캐스트 100회 축하합니다!" },
              { icon: "☕", name: "스타벅스 카페라떼", from: "아미_뉴비", date: "5일 전", used: true, msg: "분석글 너무 좋아요" },
            ].map(function (g, i) {
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", marginBottom: 4, borderRadius: 10, background: g.used ? P.g1 : "#fff", border: "1px solid " + (g.used ? P.g2 : P.ylw + "44"), opacity: g.used ? 0.6 : 1 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: g.used ? P.g2 : P.ylwL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{g.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: g.used ? P.g4 : P.g7 }}>{g.name}</div>
                    <div style={{ fontSize: 9, color: P.g4 }}>from {g.from} · {g.date}</div>
                    <div style={{ fontSize: 10, color: P.g5, marginTop: 2, fontStyle: "italic" }}>"{g.msg}"</div>
                  </div>
                  {g.used ? (
                    <span style={{ fontSize: 9, color: P.g4, padding: "3px 8px", borderRadius: 6, background: P.g2, flexShrink: 0 }}>사용완료</span>
                  ) : (
                    <button style={{ fontSize: 9, padding: "5px 12px", borderRadius: 6, background: P.ylw, color: "#fff", border: "none", fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>사용하기</button>
                  )}
                </div>
              );
            })}
            <div style={{ textAlign: "center", padding: "12px 0", color: P.g4, fontSize: 10 }}>최근 30일 선물 내역</div>
          </div>
        </div>
      )}

      {/* Cash Recharge Overlay */}
      {showRecharge && (
        <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, height: "100vh", background: "rgba(0,0,0,0.5)", zIndex: 25, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "85%", background: "#fff", borderRadius: 16, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: P.g7 }}>캐시 충전</span>
              <span onClick={function () { setShowRecharge(false); }} style={{ marginLeft: "auto", fontSize: 16, color: P.g4, cursor: "pointer" }}>✕</span>
            </div>
            <div style={{ textAlign: "center", marginBottom: 14 }}><span style={{ fontSize: 10, color: P.g4 }}>현재 보유</span><div style={{ fontSize: 24, fontWeight: 700, color: P.ylw }}>₩24,500</div></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginBottom: 14 }}>
              {[1000, 5000, 10000, 30000, 50000, 100000].map(function (a) { return (
                <div key={a} style={{ padding: "12px 0", borderRadius: 8, border: "1px solid " + P.bdr, textAlign: "center", cursor: "pointer", background: P.g1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: P.g7 }}>₩{a.toLocaleString()}</div>
                </div>
              ); })}
            </div>
            <div style={{ fontSize: 10, fontWeight: 600, color: P.g7, marginBottom: 6 }}>결제 수단</div>
            <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
              {["카카오페이", "네이버페이", "카드"].map(function (m, i) { return <div key={m} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: i === 0 ? "2px solid " + P.ylw : "1px solid " + P.bdr, textAlign: "center", fontSize: 10, color: i === 0 ? P.ylw : P.g5, fontWeight: i === 0 ? 600 : 400, cursor: "pointer" }}>{m}</div>; })}
            </div>
            <button onClick={function () { setShowRecharge(false); }} style={{ width: "100%", padding: "14px 0", borderRadius: 12, background: P.ylw, color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>충전하기</button>
          </div>
        </div>
      )}

      {/* Floating Right Navigation - Tab Specific */}
      {scr !== "onboarding" && (
        <div style={{ position: "fixed", bottom: 70, right: "max(calc(50% - 230px), 10px)", zIndex: 22, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
          {fabOpen && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 6 }}>
              {(function () {
                var actions = {
                  home: [
                    { icon: "✏️", label: "글작성", action: function () { setFabOpen(false); } },
                    { icon: "🛒", label: "샵", action: function () { setFabOpen(false); } },
                    { icon: "🎁", label: "선물함", badge: 2, action: function () { setFabOpen(false); setShowGiftBox(true); } },
                  ],
                  board: [
                    { icon: "✏️", label: "글쓰기", action: function () { setFabOpen(false); } },
                    { icon: "📊", label: "투표만들기", action: function () { setFabOpen(false); } },
                    { icon: "⭐", label: "새틀릿 만들기", action: function () { setFabOpen(false); setScr("createcom"); } },
                  ],
                  boardDetail: [
                    { icon: "✏️", label: "글쓰기", action: function () { setFabOpen(false); setScr("planetwrite"); } },
                    { icon: "📊", label: "투표만들기", action: function () { setFabOpen(false); } },
                    { icon: "📢", label: "응원방", action: function () { setFabOpen(false); navTo("pubchat"); } },
                  ],
                  msg: [
                    { icon: "✏️", label: "새 대화", action: function () { setFabOpen(false); setScr("newchat"); } },
                    { icon: "👤", label: "친구추가", action: function () { setFabOpen(false); setScr("addfriend"); } },
                    { icon: "🎁", label: "선물함", badge: 2, action: function () { setFabOpen(false); setShowGiftBox(true); } },
                  ],
                  me: [
                    { icon: "✏️", label: "프로필 편집", action: function () { setFabOpen(false); } },
                    { icon: "👤", label: "아바타", action: function () { setFabOpen(false); } },
                    { icon: "⚙", label: "설정", action: function () { setFabOpen(false); } },
                  ],
                  map: [
                    { icon: "💭", label: "생각 던지기", action: function () { setFabOpen(false); } },
                    { icon: "🧠", label: "비슷한 마인드", action: function () { setFabOpen(false); } },
                    { icon: "🔗", label: "마인드맵 공유", action: function () { setFabOpen(false); } },
                  ],
                  chat: [
                    { icon: "📡", label: "캐스트 전환", action: function () { setFabOpen(false); navTo("live"); } },
                    { icon: "🎁", label: "기프트콘", action: function () { setFabOpen(false); setShowGiftBox(true); } },
                    { icon: "👥", label: "멤버 초대", action: function () { setFabOpen(false); } },
                  ],
                  pubchat: [
                    { icon: "📡", label: "캐스트 시작", action: function () { setFabOpen(false); navTo("live"); } },
                    { icon: "📊", label: "투표 만들기", action: function () { setFabOpen(false); } },
                    { icon: "🎁", label: "기프트콘", action: function () { setFabOpen(false); setShowGiftBox(true); } },
                  ],
                };
                return actions[scr] || actions.home;
              })().map(function (item, i) {
                return (
                  <div key={i} onClick={item.action} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                    <span style={{ fontSize: 9, color: "#fff", background: "rgba(0,0,0,0.6)", padding: "3px 8px", borderRadius: 5, fontWeight: 500 }}>{item.label}</span>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#fff", boxShadow: "0 2px 10px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, position: "relative" }}>
                      {item.icon}
                      {item.badge && <span style={{ position: "absolute", top: -2, right: -2, width: 14, height: 14, borderRadius: 7, background: P.red, color: "#fff", fontSize: 7, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.badge}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <div onClick={function () { setFabOpen(!fabOpen); }} style={{ width: 46, height: 46, borderRadius: "50%", background: fabOpen ? P.g7 : P.pri, boxShadow: "0 3px 12px rgba(108,92,231,0.35)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "transform 0.2s, background 0.2s", transform: fabOpen ? "rotate(45deg)" : "none" }}>
                <span style={{ fontSize: 20, color: "#fff", lineHeight: 1 }}>+</span>
              </div>
              {!fabOpen && <span style={{ position: "absolute", top: -2, right: -2, width: 14, height: 14, borderRadius: 7, background: P.red, color: "#fff", fontSize: 7, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>2</span>}
            </div>
            <div onClick={function () { window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ width: 34, height: 34, borderRadius: "50%", background: P.red, boxShadow: "0 2px 8px rgba(226,75,74,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <span style={{ fontSize: 8, color: "#fff", fontWeight: 800 }}>▲<br/>TOP</span>
            </div>
          </div>
        </div>
      )}
      {scr !== "onboarding" && <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "#fff", borderTop: "1px solid " + P.bdr, display: "flex", zIndex: 20 }}>
        {[{ id: "home", l: "홈", ic: "⌂" }, { id: "board", l: "플래닛", ic: "planet" }, { id: "live", l: "캐스트", ic: "🛰" }, { id: "msg", l: "시그널", ic: "signal", badge: 58 }, { id: "me", l: "프로필", ic: "●" }].map(function (n) {
          var isActive = (scr === n.id) || (n.id === "board" && (scr === "boardDetail" || scr === "createcom" || scr === "planetwrite")) || (n.id === "msg" && (scr === "chat" || scr === "pubchat" || scr === "newchat" || scr === "addfriend"));
          var iconColor = isActive ? P.pri : P.g4;
          return (
            <button key={n.id} onClick={function () { navTo(n.id); }} style={{ flex: 1, padding: "6px 0 4px", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 1, position: "relative" }}>
              {n.ic === "signal" ? (
                isActive ? (
                  <span style={{ fontSize: 16, lineHeight: "18px" }}>📡</span>
                ) : (
                  <span style={{ fontSize: 15, color: P.g4 }}>✉</span>
                )
              ) : n.ic === "planet" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="7" stroke={iconColor} strokeWidth="1.8" fill={isActive ? P.pri + "22" : "none"}/>
                  {isActive && <ellipse cx="12" cy="12" rx="11" ry="4" stroke={P.pri} strokeWidth="1.5" fill="none" transform="rotate(-20 12 12)"/>}
                </svg>
              ) : (
                <span style={{ fontSize: 15, color: iconColor }}>{n.ic}</span>
              )}
              <span style={{ fontSize: 9, fontWeight: isActive ? 600 : 400, color: iconColor }}>{n.l}</span>
              {n.badge && <span style={{ position: "absolute", top: 0, right: "calc(50% - 14px)", background: P.red, color: "#fff", fontSize: 7, fontWeight: 700, minWidth: 13, height: 13, lineHeight: "13px", textAlign: "center", borderRadius: 7 }}>{n.badge}</span>}
            </button>
          );
        })}
      </div>}
    </div>
  );
}

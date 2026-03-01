const fs = require('fs');
const fetch = global.fetch;

const BASE_URL = process.env.INTAKE_BASE_URL || 'http://127.0.0.1:4000';
const PROFILES_PATH = process.env.INTAKE_PROFILES_PATH || `${__dirname}/../evals/intake-profiles.md`;
const OUTPUT_PATH = process.env.INTAKE_OUTPUT_PATH || '/tmp/intake-profile-results.json';
const TIMEOUT_MS = Number(process.env.INTAKE_TIMEOUT_MS || 45000);
const MAX_TURNS = Number(process.env.INTAKE_MAX_TURNS || 7);
const LIMIT = Number(process.env.INTAKE_LIMIT || 0);

const OPENING_ASSISTANT = "Hi, I’m your Namazing naming consultant. To start, share your last name, whether you're naming for a boy, a girl, or keeping it open-ended, and one naming vibe you want (classic, literary, modern, or heritage-rich). You can answer directly or tap a starter below.";
const OPENING_CONVERSATION = {phase:'opening',readiness:8,nextQuestion:"Start by sharing your surname, whether you're naming for a boy, a girl, or keeping it open-ended, and one naming vibe you keep coming back to.",userAct:'opening',assistantAct:'opening_prompt',pendingTopic:'childGender',lastTopic:null,misunderstandingsInRow:0,missingRequired:[{id:'childGender'},{id:'surname'},{id:'desiredFeel'}],missingOptional:[{id:'nameExamples'},{id:'familyContext'},{id:'culturalContext'},{id:'practicalConstraints'},{id:'hopes'}],portraitSummary:null,briefSummary:null,guidance:"I'm opening the conversation and listening for the essentials.",catchAllAsked:false,catchAllAnswered:false,recentQuestionFamilies:[],topicAttemptCounts:[]};

function parseProfiles(path){
  const text = fs.readFileSync(path,'utf8');
  const sections = text.split(/^## /m).slice(1);
  return sections.map(sec=>{
    const lines = sec.trim().split('\n');
    const name = lines[0].trim().replace(/^\d+\.\s*/, '');
    const fields = { name };
    for(const line of lines.slice(1)){
      const m = line.match(/^- ([^:]+):\s*(.*)$/);
      if(m) fields[m[1].trim()] = m[2].trim();
    }
    return {
      name,
      surname: fields['Surname'],
      baby: fields['Baby'],
      background: fields['Background'],
      familyDynamic: fields['Family dynamic'],
      namingGoal: fields['Naming goal'],
      constraints: fields['Constraints'],
      namesConsidered: fields['Names considered'],
      namesRejected: fields['Names rejected'],
      hopes: fields['What they hope the name expresses'],
    };
  });
}

const openingMessage = (p) => `Our last name is ${p.surname}. We are naming for ${p.baby.toLowerCase()}, and we want something ${p.namingGoal.toLowerCase()}.`;
const nameExamplesResponse = (p) => (p.namesConsidered || '').toLowerCase().includes('no names considered')
  ? "We haven't really considered any names yet. We're starting from scratch."
  : `Names we've considered: ${p.namesConsidered}. Names that feel wrong: ${p.namesRejected}.`;
const familyResponse = (p) => {
  const daughter = /daughter named ([A-Za-z'’-]+)/i.exec(p.background || '');
  const son = /son named ([A-Za-z'’-]+)/i.exec(p.background || '');
  const sibling = daughter ? `We already have a daughter named ${daughter[1]}. ` : son ? `We already have a son named ${son[1]}. ` : '';
  return `${sibling}${p.familyDynamic}${p.background ? ` ${p.background}` : ''}`.trim();
};
const culturalResponse = (p) => `${p.background} ${p.constraints}`.trim();
const practicalResponse = (p) => p.constraints;
const hopesResponse = (p) => p.hopes;
const summaryResponse = (p) => `One more thing: ${p.familyDynamic}. ${p.hopes}.`;

function detectSlot(conversation, assistantText){
  const topic = conversation?.pendingTopic;
  if (topic) return topic;
  const text = `${conversation?.nextQuestion || ''} ${assistantText || ''}`.toLowerCase();
  if (text.includes('boy') || text.includes('girl') || text.includes('open-ended')) return 'childGender';
  if (text.includes('surname') || text.includes('last name')) return 'surname';
  if (text.includes('vibe') || text.includes('feeling') || text.includes('personality')) return 'desiredFeel';
  if (text.includes('names in orbit') || text.includes('examples') || text.includes('blank page')) return 'nameExamples';
  if (text.includes('siblings') || text.includes('traditions') || text.includes('honor')) return 'familyContext';
  if (text.includes('languages') || text.includes('heritage') || text.includes('communities') || text.includes('culture')) return 'culturalContext';
  if (text.includes('pronunciation') || text.includes('initials') || text.includes('popularity') || text.includes('practical')) return 'practicalConstraints';
  if (text.includes('hope') || text.includes('express')) return 'hopes';
  return 'summary';
}

function answerForSlot(p, slot){
  switch(slot){
    case 'childGender': return `We're naming for ${p.baby.toLowerCase()}.`;
    case 'surname': return `Our surname is ${p.surname}.`;
    case 'desiredFeel': return `We want something ${p.namingGoal.toLowerCase()}.`;
    case 'nameExamples': return nameExamplesResponse(p);
    case 'familyContext': return familyResponse(p);
    case 'culturalContext': return culturalResponse(p);
    case 'practicalConstraints': return practicalResponse(p);
    case 'hopes': return hopesResponse(p);
    case 'summary': return summaryResponse(p);
    default: return summaryResponse(p);
  }
}

async function chat(messages, profile, conversation){
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: messages.map(m => ({ role: m.role, content: m.content })), profile, conversation }),
      signal: controller.signal,
    });
    const text = await res.text();
    if (!res.ok) return { ok:false, status:res.status, text };
    let assistantText = '';
    let profileUpdate = {};
    let conversationState = null;
    for (const line of text.split('\n')) {
      if (!line.startsWith('data: ')) continue;
      const json = line.slice(6).trim();
      if (!json) continue;
      const event = JSON.parse(json);
      if (event.type === 'content') assistantText = event.text || assistantText;
      if (event.type === 'profile_update') profileUpdate = event.data || profileUpdate;
      if (event.type === 'conversation_state') conversationState = event.data || conversationState;
    }
    return { ok:true, assistantText, profileUpdate, conversationState };
  } catch (error) {
    return { ok:false, status:0, text:error.name === 'AbortError' ? `TIMEOUT ${TIMEOUT_MS}ms` : String(error) };
  } finally {
    clearTimeout(timeout);
  }
}

function mergeProfile(a,b){
  const merge = (x,y) => [...new Set([...(x||[]), ...(y||[])])];
  return {
    ...a,
    ...b,
    likedNames: merge(a.likedNames, b.likedNames),
    dislikedNames: merge(a.dislikedNames, b.dislikedNames),
    practicalConstraints: merge(a.practicalConstraints, b.practicalConstraints),
    portraitHighlights: merge(a.portraitHighlights, b.portraitHighlights),
  };
}

function isCatchAll(text){
  const t = (text || '').toLowerCase();
  return t.includes('anything else') || t.includes('before i lock the brief') || t.includes('before i lock this brief');
}

function summarySpecific(conversation){
  const portrait = (conversation?.portraitSummary || '').trim();
  const brief = (conversation?.briefSummary || '').trim();
  return portrait.length > 80 && brief.length > 80;
}

function scoreRun(run){
  let score = 10;
  if (!run.ready) score -= 3;
  if (run.error) score -= 4;
  if (run.repeatedQuestions > 0) score -= Math.min(3, run.repeatedQuestions);
  if (run.turns > 6) score -= 1;
  if (!run.finalCatchAll) score -= 1;
  if (!run.summarySpecific) score -= 1;
  return Math.max(1, score);
}

(async()=>{
  const profiles = parseProfiles(PROFILES_PATH);
  const selected = LIMIT > 0 ? profiles.slice(0, LIMIT) : profiles;
  const results = [];
  for (const p of selected) {
    let messages = [{ role:'assistant', content:OPENING_ASSISTANT }, { role:'user', content:openingMessage(p) }];
    let profile = {};
    let conversation = { ...OPENING_CONVERSATION };
    let turns = 0;
    let repeatedQuestions = 0;
    let finalCatchAll = false;
    let error = null;
    let previousQuestion = '';
    const transcript = [];
    while (turns < MAX_TURNS) {
      const out = await chat(messages, profile, conversation);
      if (!out.ok) { error = `${out.text}`; break; }
      const assistantText = out.assistantText;
      const nextConversation = out.conversationState || conversation;
      profile = mergeProfile(profile, out.profileUpdate || {});
      conversation = nextConversation;
      transcript.push({ user: messages[messages.length - 1].content, assistant: assistantText, conversation: nextConversation, profile });
      if (assistantText && previousQuestion && assistantText.trim() === previousQuestion.trim()) repeatedQuestions += 1;
      if (isCatchAll(assistantText)) finalCatchAll = true;
      previousQuestion = assistantText;
      messages.push({ role:'assistant', content:assistantText });
      if (nextConversation.phase === 'ready') break;
      const slot = detectSlot(nextConversation, assistantText);
      messages.push({ role:'user', content:answerForSlot(p, slot) });
      turns += 1;
    }
    const ready = conversation.phase === 'ready';
    results.push({
      name: p.name,
      ready,
      turns,
      repeatedQuestions,
      finalCatchAll,
      summarySpecific: summarySpecific(conversation),
      score: scoreRun({ ready, error, repeatedQuestions, turns, finalCatchAll, summarySpecific: summarySpecific(conversation) }),
      error,
      finalPhase: conversation.phase,
      readiness: conversation.readiness,
      pendingTopic: conversation.pendingTopic,
      portraitSummary: conversation.portraitSummary,
      briefSummary: conversation.briefSummary,
      lastAssistant: transcript[transcript.length - 1]?.assistant,
      transcript,
    });
    console.error(`done ${results.length}/${selected.length}: ${p.name}`);
  }
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2));
  console.log(OUTPUT_PATH);
})();

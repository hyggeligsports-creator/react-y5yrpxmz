import React from "react";import { useState, useRef, useEffect } from "react";

// ═══════════════════════════════════════════
// 定数・データ定義
// ═══════════════════════════════════════════

const FACILITY = "インクルーシブ療育";

const C = {
  bg:"#F0F4F8", white:"#FFFFFF", border:"#E2E8F0",
  text:"#1A2233", sub:"#4A5568", muted:"#8A96A8",
  navy:"#1F4E79", navyL:"#EBF4FF",
  green:"#276749", greenL:"#F0FFF4", greenB:"#9AE6B4",
  amber:"#D97706", amberL:"#FFFBEB", amberB:"#FCD34D",
  orange:"#C05621", orangeL:"#FFFAF0", orangeB:"#FBD38D",
  red:"#C53030", redL:"#FFF5F5", redB:"#FEB2B2",
  purple:"#6B46C1", purpleL:"#FAF5FF", purpleB:"#D6BCFA",
  teal:"#2E75B6", tealL:"#EBF8FF", tealB:"#BEE3F8",
};

const HC = {
  sensory:   {label:"感覚統合の未成熟",   icon:"🌀", color:"#2E75B6", bg:"#EBF4FF", border:"#BEE3F8"},
  executive: {label:"実行機能の発達途上", icon:"🧠", color:"#6B46C1", bg:"#FAF5FF", border:"#D6BCFA"},
  attachment:{label:"愛着・情緒調整",     icon:"💛", color:"#B7791F", bg:"#FFFFF0", border:"#FAF089"},
  biological:{label:"生理的要因",         icon:"💤", color:"#276749", bg:"#F0FFF4", border:"#9AE6B4"},
};

const FREQ = [
  {v:3, label:"自分から参加", color:"#276749", bg:"#F0FFF4", border:"#9AE6B4"},
  {v:2, label:"促せば参加",   color:"#2E7D32", bg:"#F7FFF7", border:"#C6F6D5"},
  {v:1, label:"部分的に参加", color:"#C05621", bg:"#FFFAF0", border:"#FBD38D"},
  {v:0, label:"参加が難しい", color:"#C53030", bg:"#FFF5F5", border:"#FEB2B2"},
];

const ENV = [
  {k:"support", label:"加配の先生がいれば", icon:"🤝"},
  {k:"quiet",   label:"静かな環境なら",     icon:"🤫"},
  {k:"familiar",label:"慣れた活動・場所なら",icon:"🏠"},
  {k:"health",  label:"体調が良い日なら",   icon:"💪"},
  {k:"small",   label:"少人数なら",         icon:"👥"},
];

const SECS = [
  {id:"morning", title:"登園・朝の時間", icon:"🌅", color:C.amber,
   scene:"登園〜朝の会・準備の場面", items:[
    {k:"mo1", label:"登園時の切り替え", hyps:[
      {cat:"attachment", r:"家庭という安全基地から離れる分離不安が強い",            ms:["「また迎えに来るよ」の一貫した言葉かけ","移行対象（お気に入りの物）の持参を許可","短時間登園から徐々に延長する段階化"]},
      {cat:"executive",  r:"「幼稚園モード」への切り替えに時間がかかる",            ms:["前日夜に翌日スケジュールを一緒に確認","登園直前の一定ルーティンを設ける","担任と到着時の迎え方を統一する"]},
      {cat:"sensory",    r:"通園時の感覚刺激（混雑・音・光）が過負荷になっている",  ms:["時間帯をずらした登園を検討","イヤーマフ・サングラス等のツール活用","到着後すぐ静かなスペースでクールダウン"]},
    ]},
    {k:"mo2", label:"朝の準備（荷物・着替え・名札）", hyps:[
      {cat:"executive",  r:"複数の手順を順序よく実行する作業記憶が発達途上",        ms:["荷物の順番を写真カードで視覚化","準備ボックスで場所を固定する","担任・加配と共通の声かけ手順を決める"]},
      {cat:"sensory",    r:"制服・名札の感覚（タグ・ボタン）が不快でパニックになる",ms:["タグ除去など感覚調整を保護者と相談","着替えの手順を動作ごとに分解して練習","療育室での毎日の着替え練習でルーティン化"]},
      {cat:"biological", r:"朝の体調・眠気・空腹が準備の取り組みに影響している",    ms:["保護者に朝食・起床時間を確認","登園後すぐに軽食タイムの設定を幼稚園と相談","体調不良時は優先順位を下げる柔軟な対応"]},
    ]},
    {k:"mo3", label:"朝の会への参加（着席・挨拶）", hyps:[
      {cat:"sensory",    r:"ざわついた教室の音・光・人の密集が感覚過負荷を引き起こす",ms:["朝の会前にセンサリーブレイク（5分）","イヤーマフ使用を担任と共有","出口に近い席など感覚的に安心できる位置を確保"]},
      {cat:"executive",  r:"集団の流れに注意を向けながら自分の行動を調整するのが難しい",ms:["「次は出欠だよ」と直前に個別予告","視覚スケジュールを本人の手元に置く","加配が隣で小さな声でサポート"]},
      {cat:"attachment", r:"大勢の前での発言（返事）に強い緊張・恐怖がある",        ms:["小さな声でもOKのルールを担任と共有","手を挙げる・カードを見せる方法の許可","療育室でのロールプレイを繰り返し練習"]},
    ]},
  ]},
  {id:"class", title:"クラスへの参加", icon:"🏫", color:"#2E7D32",
   scene:"設定保育・一斉活動・給食の場面", items:[
    {k:"cl1", label:"一斉指示の理解と行動", hyps:[
      {cat:"executive",  r:"集団への音声指示を聞きながら行動に移す処理速度が追いつかない",ms:["指示は短く・具体的に・1つずつに（担任と共有）","個別に復唱確認の機会を作る","指示と同時に視覚提示（黒板・ジェスチャー）を加える"]},
      {cat:"sensory",    r:"教室の雑音の中で先生の声を選択的に聴取することが難しい",ms:["静かになってから指示を出すよう担任に依頼","本人の近くで指示を出す位置どりの工夫","補聴器・FM補聴システムの専門家への相談"]},
      {cat:"attachment", r:"間違えることへの強い恐怖から指示を聞いていても動けない",ms:["「やってみよう」が言える安心感づくり","失敗しても大丈夫な体験を療育室で積む","担任へ「間違いOK文化」の共有・協力依頼"]},
    ]},
    {k:"cl2", label:"制作・工作活動", hyps:[
      {cat:"sensory",    r:"糊・粘土・絵の具などの感触が苦手で活動を回避する",      ms:["素材に慣らす脱感作プログラム（療育室で段階的に）","手袋・道具使用など代替手段の許可を担任と相談","「触らなくてもいい作業」から参加できる工夫"]},
      {cat:"executive",  r:"制作の手順・完成イメージを持ちながら作業を進めるのが難しい",ms:["完成見本写真と手順カードを机に置く","1工程ずつ確認しながら進める個別サポート","療育室で事前に同じ工作を練習（予習）"]},
      {cat:"biological", r:"手先の巧緻性の未発達で思い通りにできず意欲が低下する",  ms:["療育室でのビーズ・ちぎり絵などで巧緻性を底上げ","道具の持ち方を個別指導し担任と共有","「結果」よりも「過程の参加」を評価することを担任と確認"]},
    ]},
    {k:"cl3", label:"話し合い・読み聞かせ", hyps:[
      {cat:"sensory",    r:"静止して聴くことが身体感覚的に難しい（感覚追求）",      ms:["フィジェットツールの許可","立ち見・端での参加など姿勢の選択肢を増やす","療育室でのリスニング練習（短時間→徐々に延長）"]},
      {cat:"executive",  r:"意見を整理して発言するタイミングをつかむのが難しい",    ms:["発言カードの活用","療育室での小グループ話し合い練習","「パスできる」ルールの全体導入を担任に提案"]},
      {cat:"attachment", r:"発言を否定・笑われた経験から発言恐怖がある",            ms:["担任へ「どんな意見も受け止める」文化の共有","療育室で「正解のない話し合い」の楽しさを体験","まず1対1で発言できる場を積み重ねる"]},
    ]},
    {k:"cl4", label:"給食・お弁当の時間", hyps:[
      {cat:"sensory",    r:"食べ物の味・食感・においへの過敏で偏食・食べられないものが多い",ms:["給食の量を少なめに調整（担任・栄養士と連携）","嫌いな食材は無理強いせず食卓に置くだけの段階から","療育室での感覚脱感作（食感ゲームなど）"]},
      {cat:"executive",  r:"集団での食事ペース・マナーの維持が難しい",              ms:["「食事3箇条」を写真カードで机に置く","追加時間の配慮を担任と相談","療育室での模倣食事練習"]},
      {cat:"biological", r:"食欲不振・偏食が栄養状態や体調に影響しており医療的観点が必要",ms:["主治医・栄養士との連携を保護者に勧める","給食日誌で食べた量・様子を記録し共有","無理のない目標設定（1口チャレンジなど）"]},
    ]},
  ]},
  {id:"outdoor", title:"外遊び・体育", icon:"⛅", color:C.teal,
   scene:"自由遊び・体育・園庭の場面", items:[
    {k:"od1", label:"園庭での自由遊び（友だちとの関わり）", hyps:[
      {cat:"attachment", r:"遊びのルールや人との距離感がわからずかかわり方がわからない",ms:["遊びのシナリオを療育室でロールプレイ練習","「入れて」「一緒に」の言葉を練習し使える場を作る","加配の先生が橋渡し役になる関わりを依頼"]},
      {cat:"sensory",    r:"外遊びの予測できない動き・音・接触が不安で参加を回避する",ms:["端から見学→加配と一緒に参加の段階化","砂場・ブランコなど感覚的に安心できる遊びから","感覚刺激の強い場面（ドッジボール等）への配慮を担任と共有"]},
      {cat:"executive",  r:"複数の子が同時に動く状況で自分の行動を調整するのが難しい",ms:["ルールが単純な2〜3人の遊びから始める","「順番」「ルール」を視覚化したカードを活用","療育室での集団ゲーム練習で経験を積む"]},
    ]},
    {k:"od2", label:"体育・リズム運動・ダンス", hyps:[
      {cat:"sensory",    r:"音楽・動きのリズムに合わせることが感覚的に難しい",      ms:["療育室でのリズム体操・トランポリン練習","鏡の前での動き模倣練習","音楽のテンポをゆっくりにしたバージョンで練習"]},
      {cat:"executive",  r:"指示を聞きながら身体を動かす二重課題が難しい",          ms:["動作を1つずつ分解して教える","見本を見て真似する時間を十分に取る（担任に依頼）","療育室での事前練習（運動会演目など）"]},
      {cat:"attachment", r:"「うまくできない」恐怖から参加を拒否する",              ms:["「参加することが目標」を担任と共有","できなくてもOK・見ているだけもOKのルール","療育室での成功体験を積んでから本番に臨む"]},
    ]},
    {k:"od3", label:"遊具の使用・順番待ち", hyps:[
      {cat:"sensory",    r:"高さや不安定さへの恐怖（前庭覚の未成熟）で遊具を回避する",ms:["低い遊具から段階的にチャレンジ","加配の先生のサポートで身体的安心感を確保","療育室のバランス遊具で感覚入力を積む"]},
      {cat:"executive",  r:"遊具での順番待ち・譲り合いのルール理解が難しい",        ms:["「順番カード」の視覚的ルール提示","療育室での順番練習ゲーム","加配が隣で「次は〇〇くんの番」と実況サポート"]},
      {cat:"biological", r:"筋力・体幹の未発達で遊具を使いこなすのが難しく危険が生じる",ms:["療育室での体幹・握力トレーニング","「使っていい遊具リスト」を担任と決めておく","OT（作業療法士）への相談・紹介を保護者に提案"]},
    ]},
  ]},
  {id:"relation", title:"友だち・先生との関係", icon:"🤝", color:C.orange,
   scene:"対人関係・コミュニケーションの場面", items:[
    {k:"re1", label:"定型発達の友だちとの自然な関わり", hyps:[
      {cat:"attachment", r:"一方的な関わりになりやすく友だちが離れてしまう経験が繰り返されている",ms:["友だちとの「やりとり」を療育室で練習","「相手が嫌がるサイン」を絵カードで学ぶ","加配が友だちとの関わりを仲介・実況するサポート"]},
      {cat:"executive",  r:"相手の気持ちを想像しながら行動を調整する（心の理論）が難しい",ms:["感情絵本・ソーシャルストーリーを療育に取り入れる","「この時〇〇くんはどんな気持ち？」を日常的に問いかける","小集団療育でのロールプレイを継続"]},
      {cat:"sensory",    r:"友だちの声・動き・距離が感覚的に予測できず過剰反応してしまう",ms:["「パーソナルスペース」の概念を視覚化して教える","感覚的に安心できる距離感を担任・友だちと共有","静かな環境でのペア遊びから始める"]},
    ]},
    {k:"re2", label:"担任・加配の先生との関係", hyps:[
      {cat:"attachment", r:"大人への不信感からサポートを拒否したり過度に依存したりする",ms:["療育施設での信頼関係を基盤に幼稚園への橋渡し","担任・加配へ「安全な大人」としての関わり方を情報共有","一貫した対応（怒らない・否定しない）を幼稚園と確認"]},
      {cat:"executive",  r:"「助けて」と言葉で伝えるタイミング・方法がわからない",  ms:["「困ったカード」を机に置いて使える練習","「先生に見せる」行動を療育室で練習","困ったシグナルを担任と本人で事前に決めておく"]},
      {cat:"sensory",    r:"加配の先生の物理的サポート（触れること・近いこと）が感覚的に苦手",ms:["触れてOK・NGの場所を本人と確認し担任と共有","言葉のサポートを優先し触れる支援は許可を得てから","本人が安心できる距離感をアセスメントして伝える"]},
    ]},
    {k:"re3", label:"トラブル後の立て直し", hyps:[
      {cat:"executive",  r:"感情が高ぶった後に自己調整して再参加する力が発達途上",    ms:["「怒りの温度計」で自分の状態に気づく練習","クールダウンの場所・方法を本人・担任・療育で統一","「落ち着いたら戻っておいで」の安心できる言葉を決める"]},
      {cat:"attachment", r:"トラブルのたびに強い自己否定・パニックに陥り立て直しに時間がかかる",ms:["「失敗しても大丈夫」の体験を繰り返し積む","叱責ではなく「どうすればよかったか」の振り返りに切り替える","療育でのSST（ソーシャルスキルトレーニング）を継続"]},
      {cat:"biological", r:"体調・空腹・疲労時にトラブルが集中している",              ms:["トラブルの時間帯・状況を記録して傾向分析","保護者と生活リズム（睡眠・食事）を確認・調整","疲労のサインを幼稚園と共有し予防的対応"]},
    ]},
  ]},
  {id:"event", title:"行事・特別な活動", icon:"🎉", color:C.purple,
   scene:"運動会・発表会・遠足などの場面", items:[
    {k:"ev1", label:"行事前の見通し・準備", hyps:[
      {cat:"executive",  r:"いつもと違うことへの強い不安（変化への適応困難）",        ms:["行事の流れを絵・写真で「行事ブック」として作成","療育室で行事の動作・場面を事前にロールプレイ","「何が起きるか」を繰り返し説明して見通しを持てるようにする"]},
      {cat:"sensory",    r:"行事特有の感覚刺激（大きな音・人込み・衣装）への恐怖",  ms:["衣装を事前に持ち帰り家で慣らす","練習は少人数・静かな環境から段階的に本番環境へ","イヤーマフの本番使用可否を幼稚園と相談"]},
      {cat:"attachment", r:"「失敗したら恥ずかしい」という恐怖から練習段階で拒否が起きる",ms:["「参加できるところだけでOK」を本人に伝え続ける","小さな成功体験（部分参加）を積み重ねて自信をつける","療育施設でのリハーサルを本番前に設ける"]},
    ]},
    {k:"ev2", label:"運動会・体育発表", hyps:[
      {cat:"sensory",    r:"会場の大きな音・歓声・観客の多さが感覚過負荷を引き起こす",ms:["イヤーマフの当日使用を許可してもらう","本番前に会場下見を行い感覚的に慣らす","退避できる静かなスペースの確保を幼稚園に依頼"]},
      {cat:"executive",  r:"集団演技の順番・タイミングを覚えながら実行するのが難しい",ms:["自分のポジションをテープで床に明示","動作を番号カードと対応させて覚える","療育室で繰り返しリハーサル（動画も活用）"]},
      {cat:"attachment", r:"大勢の前で目立つことへの強い恐怖・羞恥心がある",          ms:["端の位置・目立たない役割の配慮を担任に相談","「参加すること自体が100点」のメッセージを繰り返す","応援してくれる保護者の顔が見える位置への配慮"]},
    ]},
    {k:"ev3", label:"遠足・校外活動", hyps:[
      {cat:"sensory",    r:"見知らぬ場所・乗り物・自然環境の感覚刺激が不安と過負荷を生む",ms:["行き先の写真・動画を事前に見て慣らす","感覚的に落ち着けるアイテムの持参を許可","移動中の感覚ケア（イヤーマフ・窓側座席等）を担任と確認"]},
      {cat:"executive",  r:"いつもと違うスケジュールの変化に適応するのが難しい",      ms:["遠足の一日の流れを絵本形式で事前に読み合わせ","「こんなときはこうする」ルールを事前に決めておく","加配が常に隣にいる安心感の確保"]},
      {cat:"biological", r:"長時間の活動・移動で体力的に疲弊しやすく体調を崩しやすい",ms:["水分・おやつタイムを多めに設定するよう相談","疲れたときに休める場所を確保","体調不良のサインを担任と共有し早めの対応を依頼"]},
    ]},
  ]},
];

const ALL_KEYS = SECS.flatMap(s => s.items.map(i => i.k));

const PRIO_OPTS = [
  {v:"morning",  label:"登園・朝の安定",       icon:"🌅", color:C.amber},
  {v:"class",    label:"クラス活動への参加",   icon:"🏫", color:"#2E7D32"},
  {v:"outdoor",  label:"外遊び・体育活動",     icon:"⛅", color:C.teal},
  {v:"relation", label:"友だち・先生との関係", icon:"🤝", color:C.orange},
  {v:"event",    label:"行事・特別活動",       icon:"🎉", color:C.purple},
  {v:"sensory",  label:"感覚調整・環境適応",   icon:"🌀", color:"#B7791F"},
];

const DIAGS = [
  {v:"ASD",   l:"自閉症スペクトラム障害（ASD）"},
  {v:"ADHD",  l:"注意欠如・多動性障害（ADHD）"},
  {v:"DCD",   l:"発達性協調運動障害（DCD）"},
  {v:"知的",  l:"知的発達障害"},
  {v:"LD",    l:"学習障害（LD）"},
  {v:"other", l:"その他・未診断"},
];

const AGES = ["2歳","3歳","4歳","5歳","6歳","7歳","8歳","9歳","10歳以上"];

const STEPS = ["基本情報", ...SECS.map(s => s.title), "重点領域"];
const STEP_ICONS = ["📋","🌅","🏫","⛅","🤝","🎉","🎯"];

// ═══════════════════════════════════════════
// ストレージ設定
// ★ GAS URLをここに貼り付けてください ★
// ═══════════════════════════════════════════

const GAS_URL = ""; // ← Google Apps ScriptのデプロイURLを貼る（空欄=ローカル保存モード）

const useGAS = () => GAS_URL && GAS_URL.length > 10;

async function gasCall(action, data = {}) {
  const res = await fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ action, data }),
  });
  return await res.json();
}

const LS = {
  get: (key) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; } },
  set: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
};

async function loadDB() {
  if (useGAS()) {
    try {
      const r = await gasCall("loadAll");
      if (r.success) return { children: r.children||[], hearings: r.hearings||[], plans: r.plans||[] };
    } catch (e) { console.warn("GAS読み込みエラー:", e); }
  }
  return {
    children: LS.get("children") || [],
    hearings: LS.get("hearings") || [],
    plans:    LS.get("plans")    || [],
  };
}

async function saveRecord(collection, record, fullArr) {
  if (useGAS()) {
    try { await gasCall("saveRecord", { collection, record }); return; }
    catch (e) { console.warn("GAS保存エラー:", e); }
  }
  LS.set(collection, fullArr);
}

async function sendEmailViaGAS(data) {
  if (!useGAS()) return { success: false, error: "GAS未設定" };
  return await gasCall("sendEmail", data);
}

// ═══════════════════════════════════════════
// 計画書生成
// ═══════════════════════════════════════════

function genPlan(ans) {
  const prio = ans.priority || [];
  const diag = ans.diagnosis || [];

  const allHyp = [], allMenus = [];
  SECS.forEach(sec => sec.items.forEach(item => {
    const v = ans[item.k];
    if (!v || v.freq === 3) return;
    (v.hyps || []).forEach(idx => {
      const h = item.hyps[idx];
      if (!h) return;
      allHyp.push({ item: item.label, sec: sec.title, cat: h.cat, reason: h.r });
      h.ms.forEach(m => allMenus.push({ cat: h.cat, menu: m }));
    });
  }));

  const catCount = {};
  allHyp.forEach(h => { catCount[h.cat] = (catCount[h.cat]||0)+1; });
  const topCats = Object.entries(catCount).sort((a,b) => b[1]-a[1]);

  function sc(keys) {
    let d=0, e=0;
    keys.forEach(k => {
      const v = ans[k];
      if (!v) return;
      d += (3 - (v.freq ?? 3));
      if (v.freq < 3 && (v.envs||[]).length > 0) e++;
    });
    return { d, e };
  }

  const scores = {
    morning:  sc(["mo1","mo2","mo3"]),
    classSc:  sc(["cl1","cl2","cl3","cl4"]),
    outdoor:  sc(["od1","od2","od3"]),
    relation: sc(["re1","re2","re3"]),
    event:    sc(["ev1","ev2","ev3"]),
  };

  const envCount = Object.fromEntries(ENV.map(e => [e.k, 0]));
  ALL_KEYS.forEach(k => { (ans[k]?.envs||[]).forEach(e => { if(envCount[e]!==undefined) envCount[e]++; }); });
  const topEnvs = Object.entries(envCount).sort((a,b)=>b[1]-a[1]).filter(([,c])=>c>0).slice(0,3);

  const menus=[], sg=[], lg=[], notes=[];

  if (scores.morning.d>=3 || prio.includes("morning")) {
    menus.push({cat:"登園・朝の時間の安定", items:["登園時の分離不安ルーティンの確立","視覚スケジュールによる1日の見通し","担任と連携した一貫した朝の迎え方"]});
    sg.push("毎日の登園ルーティンが定着し、泣かずに切り替えられることが増える");
    lg.push("担任・加配の先生との信頼関係が育ち、安心して朝の会に参加できるようになる");
  }
  if (scores.classSc.d>=3 || prio.includes("class")) {
    menus.push({cat:"クラス活動への参加支援", items:["一斉指示への対応スキル（視覚化・予告）","制作活動の事前練習（療育室で予習）","感覚に合わせた座席・用具の調整"]});
    sg.push("加配の補助を受けながら一斉活動の大半に参加できる");
    lg.push("補助の段階的フェードアウトにより自分で活動に参加できる場面が増える");
  }
  if (scores.outdoor.d>=2 || prio.includes("outdoor")) {
    menus.push({cat:"外遊び・体育活動への参加", items:["感覚的に安心できる遊びからの段階的な参加","友だちとの関わりを加配が仲介するサポート","集団ゲームのルール理解（療育室での練習）"]});
    sg.push("外遊びで特定の友だちと繰り返し遊べる場面が増える");
    lg.push("集団の外遊びに自分から声をかけて参加できるようになる");
  }
  if (scores.relation.d>=2 || prio.includes("relation")) {
    menus.push({cat:"対人関係・コミュニケーション支援", items:["ソーシャルストーリー・感情絵本の活用","「困ったカード」など自己表現ツールの練習","小集団SSTの継続（療育室）"]});
    sg.push("「入れて」「ありがとう」などの言葉を使った関わりが1日1回以上できる");
    lg.push("友だちとのトラブル後、自分で気持ちを立て直して戻ってこられるようになる");
  }
  if (scores.event.d>=2 || prio.includes("event")) {
    menus.push({cat:"行事・特別活動への参加", items:["「行事ブック」による事前の見通し作り","療育室でのリハーサル（演目・動作の練習）","当日の感覚ツール使用と退避スペースの確保"]});
    sg.push("事前練習を通じて行事の一部に参加できる");
    lg.push("行事全体を通じて参加でき、終わった後に達成感を感じられる");
  }
  if (menus.length === 0) {
    menus.push({cat:"インクルーシブ参加の基盤づくり", items:["安心できる大人との関係づくり","幼稚園と療育施設の情報共有の仕組み化","感覚ニーズに応じた環境調整"]});
    sg.push("幼稚園での活動に笑顔で参加できる場面が増える");
    lg.push("自分のペースで幼稚園生活に参加できるようになる");
  }

  if (diag.includes("ASD"))  notes.push("【ASD】環境変化の事前予告・視覚スケジュール・ルーティン化を幼稚園と徹底共有する。");
  if (diag.includes("ADHD")) notes.push("【ADHD】活動を短い単位に区切り、体を動かして発散できる機会を意図的に設ける。");
  if (diag.includes("DCD"))  notes.push("【DCD】動作の見本提示・スモールステップを幼稚園の先生と共有し、失敗を責めない支援を統一する。");
  if (diag.includes("知的")) notes.push("【知的発達障害】指示は視覚的・具体的に。幼稚園の先生に支援方法を丁寧に伝達する。");

  const envNM = {
    support: n=>`加配の先生がいると参加しやすい場面が多い（${n}項目）。加配配置の継続・強化を幼稚園と相談する。`,
    quiet:   n=>`騒がしい環境で参加が難しくなる場面が多い（${n}項目）。座席位置・活動前のクールダウンを検討する。`,
    familiar:n=>`初めての活動・場所への適応に課題がある（${n}項目）。事前の予習・下見を療育と幼稚園で連携して行う。`,
    health:  n=>`体調・疲労が参加に影響しやすい（${n}項目）。生活リズムの安定を保護者と共に支援する。`,
    small:   n=>`少人数なら参加しやすい場面が多い（${n}項目）。少人数→大集団への段階的移行を計画する。`,
  };
  const envNotes = topEnvs.map(([k,c]) => `【環境配慮】${envNM[k]?.(c)}`);

  return { menus, sg, lg, notes, envNotes, scores, topCats, allHyp, allMenus };
}

// ═══════════════════════════════════════════
// 小コンポーネント
// ═══════════════════════════════════════════

function Inp({ label, value, onChange, placeholder, type="text" }) {
  return (
    <div>
      <div style={{color:C.sub, fontSize:13, fontWeight:600, marginBottom:6}}>{label}</div>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||""}
        style={{width:"100%", background:"#FAFAFA", border:`1.5px solid ${C.border}`, borderRadius:8,
          padding:"10px 14px", color:C.text, fontSize:14, outline:"none", boxSizing:"border-box"}}/>
    </div>
  );
}

function Tex({ label, value, onChange, placeholder, rows=3 }) {
  return (
    <div>
      <div style={{color:C.sub, fontSize:13, fontWeight:600, marginBottom:6}}>{label}</div>
      <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||""} rows={rows}
        style={{width:"100%", background:"#FAFAFA", border:`1.5px solid ${C.border}`, borderRadius:8,
          padding:"10px 14px", color:C.text, fontSize:14, outline:"none", resize:"vertical", boxSizing:"border-box"}}/>
    </div>
  );
}

function Sel({ label, value, onChange, options }) {
  return (
    <div>
      <div style={{color:C.sub, fontSize:13, fontWeight:600, marginBottom:6}}>{label}</div>
      <select value={value} onChange={e=>onChange(e.target.value)}
        style={{width:"100%", background:"#FAFAFA", border:`1.5px solid ${C.border}`, borderRadius:8,
          padding:"10px 14px", color:C.text, fontSize:14, outline:"none"}}>
        <option value="">選択してください</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  const ok = toast.type !== "err";
  return (
    <div style={{position:"fixed", bottom:24, right:24, zIndex:9999,
      background: ok ? C.greenL : C.redL,
      border:`1px solid ${ok ? C.greenB : C.redB}`,
      color: ok ? C.green : C.red,
      borderRadius:10, padding:"12px 20px", fontSize:13, fontWeight:700,
      boxShadow:"0 4px 20px rgba(0,0,0,0.15)", maxWidth:340}}>
      {ok ? "✅" : "❌"} {toast.msg}
    </div>
  );
}

// ─── 2軸評価コンポーネント ───
function ItemCard({ ik, label, hyps, value, onChange, color }) {
  const freq = value?.freq ?? null;
  const envs = value?.envs ?? [];
  const selH = value?.hyps ?? [];
  const low  = freq !== null && freq < 3;

  const setF = f => onChange(ik, { freq:f, envs:f===3?[]:envs, hyps:f===3?[]:selH });
  const togE = k => {
    const n = envs.includes(k) ? envs.filter(x=>x!==k) : [...envs,k];
    onChange(ik, { freq, envs:n, hyps:selH });
  };
  const togH = i => {
    const n = selH.includes(i) ? selH.filter(x=>x!==i) : [...selH,i];
    onChange(ik, { freq, envs, hyps:n });
  };

  return (
    <div style={{background:"#fff", border:`1px solid ${low?color+"55":C.border}`,
      borderRadius:12, padding:16, marginBottom:10, boxShadow:"0 2px 6px rgba(0,0,0,0.06)"}}>
      <div style={{color:C.text, fontSize:14, fontWeight:700, marginBottom:12}}>{label}</div>

      {/* ① 頻度 */}
      <div style={{marginBottom: low?14:0}}>
        <div style={{color:C.muted, fontSize:11, fontWeight:600, marginBottom:7, letterSpacing:1}}>① 参加の状況</div>
        <div style={{display:"flex", gap:6}}>
          {FREQ.map(o => (
            <button key={o.v} onClick={()=>setF(o.v)}
              style={{flex:1, padding:"9px 4px", borderRadius:8, cursor:"pointer",
                border: freq===o.v ? `2px solid ${o.color}` : `1px solid ${C.border}`,
                background: freq===o.v ? o.bg : "#FAFAFA",
                color: freq===o.v ? o.color : C.muted,
                fontSize:11, fontWeight: freq===o.v?700:500, transition:"all .15s"}}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* ② 環境条件 */}
      {low && (
        <div style={{background:"#F8FAFC", border:`1px solid ${C.border}`, borderRadius:8, padding:12, marginBottom:12}}>
          <div style={{color:C.muted, fontSize:11, fontWeight:600, marginBottom:7, letterSpacing:1}}>② できやすい環境条件</div>
          <div style={{display:"flex", flexWrap:"wrap", gap:6}}>
            {ENV.map(e => {
              const sel = envs.includes(e.k);
              return (
                <button key={e.k} onClick={()=>togE(e.k)}
                  style={{padding:"5px 11px", borderRadius:20, cursor:"pointer", fontSize:12,
                    border: sel ? `1.5px solid ${color}` : `1px solid ${C.border}`,
                    background: sel ? color : "#fff",
                    color: sel ? "#fff" : C.sub,
                    fontWeight: sel?700:500, display:"flex", alignItems:"center", gap:4, transition:"all .15s"}}>
                  {e.icon} {e.label}
                </button>
              );
            })}
            <button onClick={()=>onChange(ik, {freq, envs:[], hyps:selH})}
              style={{padding:"5px 11px", borderRadius:20, cursor:"pointer", fontSize:12,
                border: envs.length===0 ? `1.5px solid ${C.red}` : `1px solid ${C.border}`,
                background: envs.length===0 ? C.redL : "#fff",
                color: envs.length===0 ? C.red : C.muted, transition:"all .15s"}}>
              ✗ 条件によらず難しい
            </button>
          </div>
        </div>
      )}

      {/* ③ 仮説 */}
      {low && (
        <div>
          <div style={{color:C.muted, fontSize:11, fontWeight:600, marginBottom:7, letterSpacing:1}}>③ なぜ難しいか？ 仮説を選択（複数可）</div>
          {hyps.map((h, i) => {
            const hc = HC[h.cat];
            const sel = selH.includes(i);
            return (
              <div key={i} onClick={()=>togH(i)}
                style={{cursor:"pointer", borderRadius:10, marginBottom:8,
                  border: sel ? `2px solid ${hc.color}` : `1px solid ${hc.border}`,
                  background: sel ? hc.bg : "#FAFCFF", padding:"10px 14px", transition:"all .15s"}}>
                <div style={{display:"flex", alignItems:"flex-start", gap:8}}>
                  <div style={{flexShrink:0, display:"flex", alignItems:"center", gap:4,
                    background:hc.bg, border:`1px solid ${hc.border}`, borderRadius:20, padding:"3px 10px", marginTop:1}}>
                    <span style={{fontSize:12}}>{hc.icon}</span>
                    <span style={{fontSize:11, color:hc.color, fontWeight:700, whiteSpace:"nowrap"}}>{hc.label}</span>
                  </div>
                  <span style={{fontSize:13, color:C.text, lineHeight:1.65, flex:1}}>{h.r}</span>
                  <div style={{flexShrink:0, width:20, height:20, borderRadius:4, marginTop:2,
                    border: sel?"none":`1.5px solid ${C.border}`,
                    background: sel?hc.color:"#fff",
                    display:"flex", alignItems:"center", justifyContent:"center"}}>
                    {sel && <span style={{color:"#fff", fontSize:13, fontWeight:700}}>✓</span>}
                  </div>
                </div>
                {sel && (
                  <div style={{marginTop:10, paddingTop:10, borderTop:`1px solid ${hc.border}`}}>
                    <div style={{fontSize:11, color:hc.color, fontWeight:700, marginBottom:6}}>💡 推奨対策メニュー</div>
                    {h.ms.map((m,j) => (
                      <div key={j} style={{display:"flex", gap:6, marginBottom:4}}>
                        <span style={{color:hc.color, fontSize:12, fontWeight:700, flexShrink:0}}>▶</span>
                        <span style={{fontSize:13, color:C.text, lineHeight:1.5}}>{m}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── 印刷ドキュメント ───
function PrintDoc({ child, ans, plan }) {
  const today = new Date().toLocaleDateString("ja-JP",{year:"numeric",month:"long",day:"numeric"});
  return (
    <div style={{fontFamily:"sans-serif", maxWidth:700, margin:"0 auto", padding:"32px 40px", background:"#fff", color:"#222", fontSize:13, lineHeight:1.8}}>
      <div style={{textAlign:"center", borderBottom:"3px solid #1F4E79", paddingBottom:12, marginBottom:16}}>
        <div style={{fontSize:10, color:"#888", marginBottom:2}}>{FACILITY}</div>
        <div style={{fontSize:22, fontWeight:700, color:"#1F4E79", letterSpacing:2}}>インクルーシブ療育　個別支援計画書</div>
        <div style={{fontSize:12, color:"#666", marginTop:4}}>作成日：{today}　担当：{ans.staffName||""}</div>
      </div>
      <table style={{width:"100%", borderCollapse:"collapse", marginBottom:14}}>
        <tbody>
          <tr>
            <td style={{background:"#D5E8F0",fontWeight:700,padding:"5px 10px",border:"1px solid #bbb",width:"20%"}}>名前</td>
            <td style={{padding:"5px 10px",border:"1px solid #bbb",width:"30%"}}>{ans.name||child?.name||""}</td>
            <td style={{background:"#D5E8F0",fontWeight:700,padding:"5px 10px",border:"1px solid #bbb",width:"15%"}}>年齢</td>
            <td style={{padding:"5px 10px",border:"1px solid #bbb"}}>{ans.age||child?.age||""}</td>
          </tr>
          <tr>
            <td style={{background:"#D5E8F0",fontWeight:700,padding:"5px 10px",border:"1px solid #bbb"}}>診断・特性</td>
            <td colSpan={3} style={{padding:"5px 10px",border:"1px solid #bbb"}}>{(ans.diagnosis||[]).join("、")||""}</td>
          </tr>
          <tr>
            <td style={{background:"#D5E8F0",fontWeight:700,padding:"5px 10px",border:"1px solid #bbb"}}>保護者名</td>
            <td style={{padding:"5px 10px",border:"1px solid #bbb"}}>{child?.parentName||""}</td>
            <td style={{background:"#D5E8F0",fontWeight:700,padding:"5px 10px",border:"1px solid #bbb"}}>連絡先</td>
            <td style={{padding:"5px 10px",border:"1px solid #bbb"}}>{child?.parentEmail||""}</td>
          </tr>
        </tbody>
      </table>
      {plan.allHyp.length>0&&<>
        <div style={{fontWeight:700,color:"#1F4E79",fontSize:14,borderBottom:"2px solid #1F4E79",marginBottom:8}}>困難の背景仮説</div>
        {plan.topCats.map(([cat,cnt])=>{const hc=HC[cat];return(
          <div key={cat} style={{background:hc.bg,border:`1px solid ${hc.border}`,borderLeft:`4px solid ${hc.color}`,borderRadius:4,padding:"8px 12px",marginBottom:8}}>
            <div style={{fontWeight:700,fontSize:12,color:hc.color,marginBottom:4}}>{hc.icon} {hc.label}（{cnt}項目）</div>
            {plan.allHyp.filter(h=>h.cat===cat).map((h,i)=><div key={i} style={{fontSize:11,color:"#444",marginBottom:2}}>・{h.item}：{h.reason}</div>)}
          </div>
        );})}
      </>}
      <div style={{fontWeight:700,color:"#1F4E79",fontSize:14,borderBottom:"2px solid #1F4E79",marginBottom:8,marginTop:14}}>目標設定</div>
      <div style={{fontWeight:700,fontSize:12,color:"#444",marginBottom:4}}>▶ 短期目標（3ヶ月）</div>
      <ul style={{marginBottom:10,paddingLeft:20}}>{plan.sg.map((g,i)=><li key={i} style={{marginBottom:2}}>{g}</li>)}</ul>
      <div style={{fontWeight:700,fontSize:12,color:"#444",marginBottom:4}}>▶ 長期目標（6ヶ月〜1年）</div>
      <ul style={{marginBottom:14,paddingLeft:20}}>{plan.lg.map((g,i)=><li key={i} style={{marginBottom:2}}>{g}</li>)}</ul>
      <div style={{fontWeight:700,color:"#1F4E79",fontSize:14,borderBottom:"2px solid #1F4E79",marginBottom:8}}>推奨支援メニュー</div>
      {plan.menus.map((m,i)=>(
        <div key={i} style={{marginBottom:10}}>
          <div style={{background:"#EBF4FF",fontWeight:700,padding:"3px 10px",borderLeft:"4px solid #1F4E79",marginBottom:4,fontSize:12}}>{m.cat}</div>
          <ul style={{paddingLeft:20,margin:0}}>{m.items.map((it,j)=><li key={j} style={{fontSize:12,marginBottom:2}}>{it}</li>)}</ul>
        </div>
      ))}
      {plan.allMenus.length>0&&<>
        <div style={{fontWeight:700,color:"#1F4E79",fontSize:14,borderBottom:"2px solid #1F4E79",marginBottom:8,marginTop:12}}>背景仮説に基づく対策メニュー</div>
        {Object.entries(plan.allMenus.reduce((a,m)=>{(a[m.cat]=a[m.cat]||[]).push(m);return a;},{})).map(([cat,ms])=>{const hc=HC[cat];return(
          <div key={cat} style={{marginBottom:10}}>
            <div style={{background:hc.bg,fontWeight:700,padding:"3px 10px",borderLeft:`4px solid ${hc.color}`,marginBottom:4,fontSize:12}}>{hc.icon} {hc.label}</div>
            <ul style={{paddingLeft:20,margin:0}}>{[...new Set(ms.map(m=>m.menu))].map((m,j)=><li key={j} style={{fontSize:12,marginBottom:2}}>{m}</li>)}</ul>
          </div>
        );})}
      </>}
      {[...plan.envNotes,...plan.notes].length>0&&<>
        <div style={{fontWeight:700,color:"#1F4E79",fontSize:14,borderBottom:"2px solid #1F4E79",marginBottom:8,marginTop:12}}>配慮事項</div>
        {[...plan.envNotes,...plan.notes].map((n,i)=><div key={i} style={{background:"#FFFFF0",border:"1px solid #FAF089",padding:"6px 10px",borderRadius:3,marginBottom:6,fontSize:12}}>{n}</div>)}
      </>}
      <div style={{marginTop:24,borderTop:"1px solid #ccc",paddingTop:12,display:"flex",justifyContent:"space-between",fontSize:12,color:"#777"}}>
        <div>職員署名：_______________</div><div>管理者確認：_______________</div><div>保護者確認：_______________</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// メインアプリ
// ═══════════════════════════════════════════

export default function App() {
  const [db, setDb]         = useState({children:[], hearings:[], plans:[]});
  const [page, setPage]     = useState("dashboard");
  const [child, setChild]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]   = useState(null);
  const [menu, setMenu]     = useState(false);
  const printRef = useRef();

  // アセスメント
  const [step, setStep]       = useState(0);
  const [ans, setAns]         = useState({});
  const [plan, setPlan]       = useState(null);
  const [done, setDone]       = useState(false);

  // フォーム
  const [cf, setCf] = useState({name:"",yomi:"",age:"",diagnosis:"",parentName:"",parentEmail:"",phone:"",staffName:"",note:""});
  const [hf, setHf] = useState({staffName:"",homeCondition:"",concerns:"",wishes:"",homeEnv:"",other:""});

  const [emailModal, setEmailModal] = useState(false);
  const [isMobile, setIsMobile]     = useState(window.innerWidth < 640);

  useEffect(()=>{
    loadDB().then(d=>{setDb(d); setLoading(false);});
    const h = ()=>setIsMobile(window.innerWidth<640);
    window.addEventListener("resize",h);
    return ()=>window.removeEventListener("resize",h);
  },[]);

  function toast_(msg, type="ok") {
    setToast({msg,type});
    setTimeout(()=>setToast(null), 3500);
  }

  async function saveDb(key, newItem) {
    const arr = [...(db[key]||[]), newItem];
    const next = {...db, [key]:arr};
    setDb(next);
    await saveRecord(key, newItem, arr);
  }

  function go(p) { setPage(p); setMenu(false); }

  // ── 児童登録 ──
  async function saveChild() {
    if (!cf.name.trim()) { toast_("名前を入力してください","err"); return; }
    setLoading(true);
    const rec = {...cf, id:"C"+Date.now(), createdAt:new Date().toLocaleDateString("ja-JP")};
    await saveDb("children", rec);
    setCf({name:"",yomi:"",age:"",diagnosis:"",parentName:"",parentEmail:"",phone:"",staffName:"",note:""});
    toast_(`${rec.name} さんを登録しました`);
    go("children");
    setLoading(false);
  }

  // ── ヒアリング保存 ──
  async function saveHearing() {
    if (!hf.staffName.trim()) { toast_("担当職員名を入力してください","err"); return; }
    setLoading(true);
    const rec = {...hf, id:"H"+Date.now(), childId:child?.id||"", childName:child?.name||"", createdAt:new Date().toLocaleDateString("ja-JP")};
    await saveDb("hearings", rec);
    setHf({staffName:"",homeCondition:"",concerns:"",wishes:"",homeEnv:"",other:""});
    toast_("ヒアリングシートを保存しました");
    go("dashboard");
    setLoading(false);
  }

  // ── アセスメント ──
  const curSec   = step>=1 && step<=5 ? SECS[step-1] : null;
  const accentC  = step===0 ? C.navy : step<=5 ? SECS[step-1].color : "#B7791F";

  function updAns(k,v) { setAns(p=>({...p,[k]:v})); }
  function togMulti(k,v) {
    setAns(p=>{
      const a = p[k]||[];
      return {...p, [k]: a.includes(v) ? a.filter(x=>x!==v) : [...a,v]};
    });
  }

  function canNext() {
    if (step===0) return ans.name?.trim() && ans.staffName?.trim();
    if (step>=1 && step<=5) return SECS[step-1].items.every(it => ans[it.k]?.freq !== undefined && ans[it.k]?.freq !== null);
    if (step===6) return (ans.priority||[]).length > 0;
    return true;
  }

  async function handleNext() {
    if (step < 6) { setStep(step+1); return; }
    const p = genPlan(ans);
    setPlan(p);
    setDone(true);
    const rec = {id:"P"+Date.now(), childId:child?.id||"", childName:ans.name, staffName:ans.staffName, ans, plan:p, createdAt:new Date().toLocaleDateString("ja-JP")};
    await saveDb("plans", rec);
    toast_("計画書を保存しました ✅");
  }

  function doPrint() {
    const win = window.open("","_blank");
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>個別支援計画書</title><style>body{margin:0;}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}</style></head><body>${printRef.current?.innerHTML||""}</body></html>`);
    win.document.close();
    setTimeout(()=>win.print(),600);
  }

  const [emailSending, setEmailSending] = useState(false);

  async function doEmail() {
    const target = child?.parentEmail || ans.parentEmail;
    if (!target) { toast_("保護者メールアドレスが登録されていません","err"); return; }

    // GAS設定済みなら直接送信
    if (useGAS()) {
      setEmailSending(true);
      const r = await sendEmailViaGAS({
        parentEmail: target,
        parentName:  child?.parentName || "保護者",
        childName:   ans.name || child?.name,
        staffName:   ans.staffName || "",
        facility:    FACILITY,
        shortGoals:  plan?.sg || [],
        longGoals:   plan?.lg || [],
      });
      setEmailSending(false);
      if (r.success) toast_(`${target} にメールを送信しました`);
      else toast_("送信失敗: " + (r.error||"不明なエラー"), "err");
    } else {
      // GAS未設定時はクリップボードにコピー
      const body = [
        `${child?.parentName||"保護者"}様`,
        "",
        `${ans.name||child?.name}さんの個別支援計画書をお送りします。`,
        "",
        "【短期目標（3ヶ月）】",
        ...(plan?.sg||[]).map(g=>"・"+g),
        "",
        "【長期目標（6ヶ月〜1年）】",
        ...(plan?.lg||[]).map(g=>"・"+g),
        "",
        `担当：${ans.staffName||""}`,
        FACILITY,
      ].join("\n");
      navigator.clipboard?.writeText(body).catch(()=>{});
      toast_(`メール本文をコピーしました（宛先：${target}）`);
    }
    setEmailModal(false);
  }

  function resetAssess() { setStep(0); setAns({}); setPlan(null); setDone(false); }

  // ─────────────────────────────────────────
  // NAV
  // ─────────────────────────────────────────
  const NAV = [
    {id:"dashboard", label:"ダッシュボード", icon:"🏠"},
    {id:"children",  label:"児童一覧",       icon:"👶"},
    {id:"register",  label:"新規登録",       icon:"➕"},
    {id:"assess",    label:"アセスメント",   icon:"📋"},
    {id:"hearing",   label:"ヒアリング",     icon:"💬"},
    {id:"history",   label:"記録一覧",       icon:"📂"},
  ];

  const TITLE = {dashboard:"ダッシュボード",children:"児童一覧",register:"新規児童登録",assess:"アセスメント・計画書",hearing:"保護者ヒアリング",history:"記録一覧"};

  // ─────────────────────────────────────────
  // ページコンポーネント
  // ─────────────────────────────────────────

  function Dashboard() {
    return (
      <div style={{padding:20}}>
        <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20}}>
          {[
            {l:"登録児童数",v:db.children.length,ic:"👶",c:C.navy,bg:C.navyL},
            {l:"計画書",    v:db.plans.length,   ic:"📋",c:C.green,bg:C.greenL},
            {l:"ヒアリング",v:db.hearings.length, ic:"💬",c:C.orange,bg:C.orangeL},
          ].map((s,i) => (
            <div key={i} style={{background:s.bg, border:`1px solid ${C.border}`, borderRadius:12, padding:"16px", boxShadow:"0 2px 6px rgba(0,0,0,0.06)"}}>
              <div style={{fontSize:24, marginBottom:6}}>{s.ic}</div>
              <div style={{fontSize:26, fontWeight:700, color:s.c}}>{s.v}</div>
              <div style={{fontSize:12, color:C.sub}}>{s.l}</div>
            </div>
          ))}
        </div>

        <div style={{background:"#fff", border:`1px solid ${C.border}`, borderRadius:12, padding:18, marginBottom:16, boxShadow:"0 2px 6px rgba(0,0,0,0.06)"}}>
          <div style={{fontWeight:700, color:C.text, fontSize:14, marginBottom:12}}>🚀 クイックアクション</div>
          <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
            {[
              {l:"新規登録",ic:"➕",p:"register",c:C.navy},
              {l:"アセスメント",ic:"📋",p:"assess",c:C.green},
              {l:"ヒアリング",ic:"💬",p:"hearing",c:C.orange},
              {l:"記録一覧",ic:"📂",p:"history",c:C.purple},
            ].map((a,i) => (
              <button key={i} onClick={()=>go(a.p)}
                style={{display:"flex", alignItems:"center", gap:6, padding:"9px 16px",
                  borderRadius:8, border:`1.5px solid ${a.c}`, background:"#fff",
                  color:a.c, fontSize:13, fontWeight:700, cursor:"pointer"}}>
                {a.ic} {a.l}
              </button>
            ))}
          </div>
        </div>

        {db.children.length > 0 && (
          <div style={{background:"#fff", border:`1px solid ${C.border}`, borderRadius:12, padding:18, boxShadow:"0 2px 6px rgba(0,0,0,0.06)"}}>
            <div style={{fontWeight:700, color:C.text, fontSize:14, marginBottom:12}}>👶 最近の登録児童</div>
            {[...db.children].reverse().slice(0,5).map((c,i) => (
              <div key={i} onClick={()=>{setChild(c);go("assess");resetAssess();}}
                style={{display:"flex", alignItems:"center", gap:10, padding:"10px 12px",
                  borderRadius:8, background:C.bg, border:`1px solid ${C.border}`,
                  cursor:"pointer", marginBottom:6}}>
                <div style={{width:34, height:34, borderRadius:"50%", background:C.navyL,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:16}}>👶</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700, color:C.text, fontSize:13}}>{c.name}</div>
                  <div style={{fontSize:12, color:C.muted}}>{c.age} ・ {c.diagnosis||"診断なし"}</div>
                </div>
                <span style={{color:C.muted, fontSize:12}}>評価 →</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  function Children() {
    if (db.children.length === 0) return (
      <div style={{textAlign:"center", padding:60, color:C.muted}}>
        <div style={{fontSize:48, marginBottom:12}}>👶</div>
        <div style={{fontSize:15, fontWeight:600, marginBottom:16}}>まだ登録された児童がいません</div>
        <button onClick={()=>go("register")} style={{padding:"10px 24px", background:C.navy, color:"#fff", border:"none", borderRadius:8, fontSize:14, fontWeight:700, cursor:"pointer"}}>新規登録する</button>
      </div>
    );
    return (
      <div style={{padding:20}}>
        {db.children.map((c,i) => (
          <div key={i} style={{background:"#fff", border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 18px", boxShadow:"0 2px 6px rgba(0,0,0,0.06)", display:"flex", alignItems:"center", gap:12, marginBottom:10, flexWrap:"wrap"}}>
            <div style={{width:42, height:42, borderRadius:"50%", background:C.navyL, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0}}>👶</div>
            <div style={{flex:1, minWidth:140}}>
              <div style={{fontWeight:700, color:C.text, fontSize:14}}>{c.name} <span style={{fontSize:12, color:C.muted, fontWeight:500}}>（{c.yomi}）</span></div>
              <div style={{fontSize:12, color:C.sub, marginTop:2}}>{c.age} ・ {c.diagnosis||"診断なし"} ・ 担当：{c.staffName||"未設定"}</div>
              {c.parentName && <div style={{fontSize:12, color:C.muted, marginTop:2}}>保護者：{c.parentName} {c.parentEmail&&`/ ${c.parentEmail}`}</div>}
            </div>
            <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
              <button onClick={()=>{setChild(c);resetAssess();go("assess");}} style={{padding:"6px 12px", background:C.navyL, color:C.navy, border:`1px solid ${C.tealB}`, borderRadius:7, fontSize:12, fontWeight:700, cursor:"pointer"}}>📋 評価</button>
              <button onClick={()=>{setChild(c);go("hearing");}} style={{padding:"6px 12px", background:C.orangeL, color:C.orange, border:`1px solid ${C.orangeB}`, borderRadius:7, fontSize:12, fontWeight:700, cursor:"pointer"}}>💬 ヒアリング</button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  function Register() {
    return (
      <div style={{padding:20, maxWidth:600}}>
        <div style={{background:"#fff", border:`1px solid ${C.border}`, borderRadius:12, padding:22, boxShadow:"0 2px 6px rgba(0,0,0,0.06)"}}>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14}}>
            <Inp label="名前 ＊" value={cf.name} onChange={v=>setCf(p=>({...p,name:v}))} placeholder="例：田中 たろう"/>
            <Inp label="よみがな" value={cf.yomi} onChange={v=>setCf(p=>({...p,yomi:v}))} placeholder="例：たなか たろう"/>
          </div>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14}}>
            <Sel label="年齢" value={cf.age} onChange={v=>setCf(p=>({...p,age:v}))} options={AGES}/>
            <Inp label="担当職員名 ＊" value={cf.staffName} onChange={v=>setCf(p=>({...p,staffName:v}))} placeholder="例：山田 花子"/>
          </div>
          <div style={{marginBottom:14}}>
            <Inp label="診断・特性" value={cf.diagnosis} onChange={v=>setCf(p=>({...p,diagnosis:v}))} placeholder="例：ASD、ADHD など"/>
          </div>
          <div style={{height:1, background:C.border, margin:"16px 0"}}/>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14}}>
            <Inp label="保護者名" value={cf.parentName} onChange={v=>setCf(p=>({...p,parentName:v}))} placeholder="例：田中 花子"/>
            <Inp label="保護者メール" value={cf.parentEmail} onChange={v=>setCf(p=>({...p,parentEmail:v}))} placeholder="hanako@example.com" type="email"/>
          </div>
          <div style={{marginBottom:14}}>
            <Inp label="電話番号" value={cf.phone} onChange={v=>setCf(p=>({...p,phone:v}))} placeholder="090-0000-0000"/>
          </div>
          <div style={{marginBottom:20}}>
            <Tex label="備考" value={cf.note} onChange={v=>setCf(p=>({...p,note:v}))} placeholder="特記事項など"/>
          </div>
          <button onClick={saveChild} disabled={loading||!cf.name.trim()}
            style={{width:"100%", padding:12, background:C.navy, color:"#fff", border:"none", borderRadius:8, fontSize:15, fontWeight:700,
              cursor:loading||!cf.name.trim()?"not-allowed":"pointer", opacity:loading||!cf.name.trim()?0.6:1}}>
            {loading?"保存中...":"✅ 登録する"}
          </button>
        </div>
      </div>
    );
  }

  function Hearing() {
    return (
      <div style={{padding:20, maxWidth:600}}>
        {child && <div style={{background:C.navyL, border:`1px solid ${C.tealB}`, borderRadius:8, padding:"8px 14px", marginBottom:14, fontSize:13, color:C.navy, fontWeight:600}}>対象：{child.name}（{child.age}）</div>}
        <div style={{background:"#fff", border:`1px solid ${C.border}`, borderRadius:12, padding:22, boxShadow:"0 2px 6px rgba(0,0,0,0.06)"}}>
          <div style={{display:"flex", flexDirection:"column", gap:14}}>
            <Inp label="担当職員名 ＊" value={hf.staffName} onChange={v=>setHf(p=>({...p,staffName:v}))} placeholder="例：山田 花子"/>
            <Tex label="家庭での様子（生活リズム・睡眠・食事など）" value={hf.homeCondition} onChange={v=>setHf(p=>({...p,homeCondition:v}))} placeholder="毎日の様子を教えてください" rows={4}/>
            <Tex label="困っていること・気になること" value={hf.concerns} onChange={v=>setHf(p=>({...p,concerns:v}))} placeholder="家庭でのお困りごとをご記入ください" rows={4}/>
            <Tex label="療育に対する希望・要望" value={hf.wishes} onChange={v=>setHf(p=>({...p,wishes:v}))} placeholder="どのような支援を希望されますか？" rows={3}/>
            <Tex label="家庭環境（兄弟・住環境など）" value={hf.homeEnv} onChange={v=>setHf(p=>({...p,homeEnv:v}))} placeholder="家族構成や住まいの環境など" rows={3}/>
            <Tex label="その他・自由記述" value={hf.other} onChange={v=>setHf(p=>({...p,other:v}))} placeholder="その他ご自由にお書きください" rows={3}/>
          </div>
          <button onClick={saveHearing} disabled={loading||!hf.staffName.trim()}
            style={{width:"100%", padding:12, marginTop:18, background:C.orange, color:"#fff", border:"none", borderRadius:8, fontSize:15, fontWeight:700, cursor:loading?"not-allowed":"pointer", opacity:loading?0.7:1}}>
            {loading?"保存中...":"💾 保存する"}
          </button>
        </div>
      </div>
    );
  }

  function History() {
    return (
      <div style={{padding:20}}>
        <div style={{display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:16}}>
          <div style={{background:"#fff", border:`1px solid ${C.border}`, borderRadius:12, padding:18, boxShadow:"0 2px 6px rgba(0,0,0,0.06)"}}>
            <div style={{fontWeight:700, fontSize:14, color:C.text, marginBottom:12}}>📋 計画書（{db.plans.length}件）</div>
            {db.plans.length===0 ? <div style={{color:C.muted, fontSize:13}}>まだ計画書がありません</div> :
              [...db.plans].reverse().map((p,i)=>(
                <div key={i} style={{padding:"9px 0", borderBottom:`1px solid ${C.border}`}}>
                  <div style={{fontWeight:700, color:C.text, fontSize:13}}>{p.childName}</div>
                  <div style={{fontSize:12, color:C.muted}}>{p.createdAt} ／ 担当：{p.staffName}</div>
                </div>
              ))}
          </div>
          <div style={{background:"#fff", border:`1px solid ${C.border}`, borderRadius:12, padding:18, boxShadow:"0 2px 6px rgba(0,0,0,0.06)"}}>
            <div style={{fontWeight:700, fontSize:14, color:C.text, marginBottom:12}}>💬 ヒアリング（{db.hearings.length}件）</div>
            {db.hearings.length===0 ? <div style={{color:C.muted, fontSize:13}}>まだヒアリング記録がありません</div> :
              [...db.hearings].reverse().map((h,i)=>(
                <div key={i} style={{padding:"9px 0", borderBottom:`1px solid ${C.border}`}}>
                  <div style={{fontWeight:700, color:C.text, fontSize:13}}>{h.childName||"（氏名なし）"}</div>
                  <div style={{fontSize:12, color:C.muted}}>{h.createdAt} ／ 担当：{h.staffName}</div>
                  {h.concerns && <div style={{fontSize:12, color:C.sub, marginTop:2, lineHeight:1.4}}>{h.concerns.slice(0,60)}{h.concerns.length>60&&"…"}</div>}
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  function Assess() {
    // 結果画面
    if (done && plan) {
      const bdg = (s,m) => {
        const p = s/m;
        return p>=0.5?{l:"重点支援",c:C.red,bg:C.redL,b:C.redB}
             : p>=0.25?{l:"継続支援",c:C.orange,bg:C.orangeL,b:C.orangeB}
             : {l:"良好",c:C.green,bg:C.greenL,b:C.greenB};
      };
      return (
        <div style={{padding:20}}>
          <div style={{background:C.greenL, border:`1px solid ${C.greenB}`, borderRadius:10, padding:"10px 16px", marginBottom:16, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8}}>
            <span style={{color:C.green, fontWeight:700, fontSize:13}}>✅ 計画書を生成・保存しました</span>
            <div style={{display:"flex", gap:8}}>
              <button onClick={doPrint} style={{padding:"7px 14px", background:C.navy, color:"#fff", border:"none", borderRadius:7, fontSize:12, fontWeight:700, cursor:"pointer"}}>🖨️ 印刷</button>
              <button onClick={()=>setEmailModal(true)} style={{padding:"7px 14px", background:C.green, color:"#fff", border:"none", borderRadius:7, fontSize:12, fontWeight:700, cursor:"pointer"}}>📧 メール</button>
              <button onClick={resetAssess} style={{padding:"7px 14px", background:"#fff", color:C.sub, border:`1px solid ${C.border}`, borderRadius:7, fontSize:12, cursor:"pointer"}}>🔄 再評価</button>
            </div>
          </div>

          {/* スコア */}
          <div style={{display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8, marginBottom:14}}>
            {[
              {l:"登園・朝",ic:"🌅",s:plan.scores.morning.d,m:9},
              {l:"クラス",  ic:"🏫",s:plan.scores.classSc.d,m:12},
              {l:"外遊び",  ic:"⛅",s:plan.scores.outdoor.d,m:9},
              {l:"対人",    ic:"🤝",s:plan.scores.relation.d,m:9},
              {l:"行事",    ic:"🎉",s:plan.scores.event.d,m:9},
            ].map((r,i) => {
              const b = bdg(r.s,r.m);
              return (
                <div key={i} style={{background:"#fff", border:`1px solid ${b.b}`, borderRadius:10, padding:"12px 6px", textAlign:"center", boxShadow:"0 2px 6px rgba(0,0,0,0.06)"}}>
                  <div style={{fontSize:18, marginBottom:3}}>{r.ic}</div>
                  <div style={{fontSize:11, color:C.sub, marginBottom:5}}>{r.l}</div>
                  <div style={{background:b.bg, color:b.c, fontSize:10, fontWeight:700, borderRadius:20, padding:"2px 6px", display:"inline-block", border:`1px solid ${b.b}`}}>{b.l}</div>
                </div>
              );
            })}
          </div>

          {/* 仮説 */}
          {plan.allHyp.length>0 && (
            <div style={{background:"#fff", border:`1px solid ${C.border}`, borderRadius:12, padding:16, marginBottom:14, boxShadow:"0 2px 6px rgba(0,0,0,0.06)"}}>
              <div style={{fontWeight:700, color:C.text, fontSize:14, marginBottom:12}}>🔍 困難の背景仮説</div>
              <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:10}}>
                {plan.topCats.map(([cat,cnt]) => {
                  const hc = HC[cat];
                  const its = plan.allHyp.filter(h=>h.cat===cat);
                  return (
                    <div key={cat} style={{background:hc.bg, border:`1px solid ${hc.border}`, borderRadius:10, padding:12}}>
                      <div style={{display:"flex", alignItems:"center", gap:6, marginBottom:8}}>
                        <span>{hc.icon}</span>
                        <span style={{color:hc.color, fontWeight:700, fontSize:12}}>{hc.label}</span>
                        <span style={{background:"#fff", color:hc.color, fontSize:10, fontWeight:700, borderRadius:20, padding:"1px 7px", marginLeft:"auto", border:`1px solid ${hc.border}`}}>{cnt}項目</span>
                      </div>
                      {its.map((h,i) => (
                        <div key={i} style={{marginBottom:6, paddingBottom:6, borderBottom:i<its.length-1?`1px solid ${hc.border}`:"none"}}>
                          <div style={{fontSize:11, color:hc.color, fontWeight:600, marginBottom:2}}>{h.item}</div>
                          <div style={{fontSize:12, color:C.text, lineHeight:1.5}}>{h.reason}</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 目標 */}
          <div style={{display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:12, marginBottom:14}}>
            {[
              {title:"🎯 短期目標（3ヶ月）",goals:plan.sg,c:C.green,bg:C.greenL,b:C.greenB},
              {title:"🌟 長期目標（6ヶ月〜1年）",goals:plan.lg,c:C.navy,bg:C.navyL,b:C.tealB},
            ].map((s,i) => (
              <div key={i} style={{background:s.bg, border:`1px solid ${s.b}`, borderRadius:12, padding:16, boxShadow:"0 2px 6px rgba(0,0,0,0.06)"}}>
                <div style={{color:s.c, fontWeight:700, fontSize:13, marginBottom:10}}>{s.title}</div>
                {s.goals.map((g,j) => (
                  <div key={j} style={{display:"flex", gap:7, marginBottom:7}}>
                    <span style={{color:s.c, fontWeight:700, flexShrink:0}}>▶</span>
                    <span style={{fontSize:12, color:C.text, lineHeight:1.6}}>{g}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* メニュー */}
          <div style={{background:"#fff", border:`1px solid ${C.border}`, borderRadius:12, padding:16, marginBottom:14, boxShadow:"0 2px 6px rgba(0,0,0,0.06)"}}>
            <div style={{fontWeight:700, color:C.text, fontSize:14, marginBottom:12}}>📋 推奨支援メニュー</div>
            <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:10}}>
              {plan.menus.map((m,i) => {
                const cols = [C.amber,"#2E7D32",C.teal,C.orange,C.purple,"#B7791F"];
                const cc = cols[i%cols.length];
                return (
                  <div key={i} style={{background:C.bg, border:`1px solid ${C.border}`, borderRadius:10, padding:12, borderLeft:`4px solid ${cc}`}}>
                    <div style={{color:cc, fontWeight:700, fontSize:12, marginBottom:7}}>{m.cat}</div>
                    {m.items.map((it,j) => (
                      <div key={j} style={{display:"flex", gap:5, marginBottom:4}}>
                        <span style={{width:5,height:5,borderRadius:"50%",background:cc,flexShrink:0,display:"inline-block",marginTop:6}}/>
                        <span style={{fontSize:12, color:C.text}}>{it}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 配慮事項 */}
          {[...plan.envNotes,...plan.notes].length>0 && (
            <div style={{background:"#FFFFF0", border:"1px solid #FAF089", borderRadius:12, padding:14, marginBottom:20}}>
              <div style={{color:"#B7791F", fontWeight:700, fontSize:13, marginBottom:8}}>⚠️ 配慮事項</div>
              {[...plan.envNotes,...plan.notes].map((n,i) => (
                <div key={i} style={{fontSize:12, color:C.text, lineHeight:1.7, marginBottom:5, paddingLeft:10, borderLeft:"3px solid #F6E05E"}}>{n}</div>
              ))}
            </div>
          )}

          <div style={{display:"none"}} ref={printRef}>
            <PrintDoc child={child} ans={ans} plan={plan}/>
          </div>
        </div>
      );
    }

    // アセスメントフロー（7ステップ：0〜6）
    const prog = (step/7)*100;
    return (
      <div style={{padding:20, maxWidth:700}}>
        {child && <div style={{background:C.navyL, border:`1px solid ${C.tealB}`, borderRadius:8, padding:"7px 14px", marginBottom:12, fontSize:13, color:C.navy, fontWeight:600}}>評価対象：{child.name}（{child.age}）</div>}

        <div style={{background:C.border, borderRadius:50, height:5, marginBottom:10, overflow:"hidden"}}>
          <div style={{height:"100%", width:`${prog}%`, background:`linear-gradient(90deg,${accentC},#48BB78)`, borderRadius:50, transition:"width .4s"}}/>
        </div>

        <div style={{display:"flex", gap:4, marginBottom:16, flexWrap:"wrap"}}>
          {STEPS.map((t,i) => (
            <div key={i} style={{display:"flex", alignItems:"center", gap:3, fontSize:11, fontWeight:i===step?700:500,
              background: i<step?"#EBF8F1":i===step?C.navyL:"#F7F8FA",
              border: i===step?`1.5px solid ${accentC}`:i<step?`1px solid ${C.greenB}`:`1px solid ${C.border}`,
              borderRadius:50, padding:"3px 9px",
              color: i<step?C.green:i===step?accentC:C.muted}}>
              {STEP_ICONS[i]} {i<step?"✓":t}
            </div>
          ))}
        </div>

        <div style={{background:"#fff", border:`1px solid ${C.border}`, borderRadius:14, padding:"20px 18px", boxShadow:"0 4px 16px rgba(0,0,0,0.08)"}}>
          <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:14}}>
            <div style={{width:40, height:40, borderRadius:10, background:C.navyL, border:`2px solid ${accentC}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20}}>
              {STEP_ICONS[step]}
            </div>
            <div>
              <div style={{fontSize:15, fontWeight:700, color:C.text}}>{STEPS[step]}</div>
              {curSec && <div style={{fontSize:11, color:C.orange, fontWeight:600, marginTop:1}}>{curSec.scene}</div>}
              {curSec && <div style={{fontSize:11, color:C.muted, marginTop:1}}>参加の状況を選択 → 難しい場合は環境条件・理由の仮説が表示されます</div>}
            </div>
          </div>
          <div style={{height:1, background:C.border, marginBottom:16}}/>

          {/* STEP 0: 基本情報 */}
          {step===0 && (
            <div style={{display:"flex", flexDirection:"column", gap:14}}>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
                <Inp label="お子さんの名前 ＊" value={ans.name||child?.name||""} onChange={v=>updAns("name",v)} placeholder="例：たろう"/>
                <Sel label="年齢" value={ans.age||child?.age||""} onChange={v=>updAns("age",v)} options={AGES}/>
              </div>
              <div>
                <div style={{color:C.sub, fontSize:13, fontWeight:600, marginBottom:8}}>診断・特性（複数可）</div>
                <div style={{display:"flex", flexDirection:"column", gap:6}}>
                  {DIAGS.map(d => {
                    const chk = (ans.diagnosis||[]).includes(d.v);
                    return (
                      <label key={d.v} onClick={()=>togMulti("diagnosis",d.v)}
                        style={{display:"flex", alignItems:"center", gap:10, cursor:"pointer",
                          background:chk?C.navyL:"#FAFAFA",
                          border:chk?`1.5px solid ${C.navy}`:`1px solid ${C.border}`,
                          borderRadius:8, padding:"8px 12px", transition:"all .15s"}}>
                        <div style={{width:17, height:17, borderRadius:4, border:chk?"none":`1.5px solid ${C.border}`, background:chk?C.navy:"#fff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
                          {chk && <span style={{color:"#fff", fontSize:11, fontWeight:700}}>✓</span>}
                        </div>
                        <span style={{color:C.text, fontSize:13}}>{d.l}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <Inp label="担当職員名 ＊" value={ans.staffName||""} onChange={v=>updAns("staffName",v)} placeholder="例：山田 花子"/>
            </div>
          )}

          {/* STEP 1-5: 各セクション */}
          {curSec && curSec.items.map(item => (
            <ItemCard key={item.k} ik={item.k} label={item.label} hyps={item.hyps}
              value={ans[item.k]} onChange={updAns} color={curSec.color}/>
          ))}

          {/* STEP 6: 重点領域 */}
          {step===6 && (
            <div>
              <div style={{color:C.muted, fontSize:13, marginBottom:12}}>今後3ヶ月で特に注力したい領域（複数可）</div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:9}}>
                {PRIO_OPTS.map(o => {
                  const sel = (ans.priority||[]).includes(o.v);
                  return (
                    <button key={o.v} onClick={()=>togMulti("priority",o.v)}
                      style={{background:sel?`${o.color}15`:"#FAFAFA",
                        border:sel?`2px solid ${o.color}`:`1px solid ${C.border}`,
                        borderRadius:10, padding:"13px 8px", cursor:"pointer", textAlign:"center", transition:"all .15s"}}>
                      <div style={{fontSize:20, marginBottom:4}}>{o.icon}</div>
                      <div style={{color:sel?o.color:C.sub, fontSize:12, fontWeight:sel?700:500}}>{o.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{marginTop:18, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            {step>0
              ? <button onClick={()=>setStep(step-1)} style={{padding:"9px 16px", background:"#fff", color:C.sub, border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, cursor:"pointer"}}>← 戻る</button>
              : <div/>
            }
            <button onClick={handleNext} disabled={!canNext()||loading}
              style={{padding:"11px 24px", background:canNext()&&!loading?accentC:C.border,
                color:canNext()&&!loading?"#fff":C.muted,
                border:"none", borderRadius:8, fontSize:14, fontWeight:700,
                cursor:canNext()&&!loading?"pointer":"not-allowed", transition:"all .2s",
                boxShadow:canNext()&&!loading?`0 2px 8px ${accentC}44`:"none"}}>
              {loading?"処理中...":step<6?"次のステップへ →":"✅ 計画書を生成する"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────
  // レイアウト
  // ─────────────────────────────────────────
  const pages = {dashboard:<Dashboard/>, children:<Children/>, register:<Register/>, assess:<Assess/>, hearing:<Hearing/>, history:<History/>};

  if (loading && db.children.length===0 && db.plans.length===0) {
    return (
      <div style={{display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:C.bg, flexDirection:"column", gap:12}}>
        <div style={{fontSize:36}}>🏥</div>
        <div style={{color:C.sub, fontSize:14}}>読み込み中...</div>
      </div>
    );
  }

  // サイドバー
  function Sidebar() {
    return (
      <div style={{width:190, flexShrink:0, background:C.navy, minHeight:"100vh", display:"flex", flexDirection:"column", padding:"18px 0"}}>
        <div style={{padding:"0 18px 16px", borderBottom:"1px solid rgba(255,255,255,0.15)"}}>
          <div style={{fontSize:12, fontWeight:700, color:"#fff", lineHeight:1.4}}>{FACILITY}</div>
          <div style={{fontSize:10, color:"rgba(255,255,255,0.5)", marginTop:2}}>児童発達支援システム</div>
        </div>
        <div style={{padding:"12px 0", flex:1}}>
          {NAV.map(n => (
            <button key={n.id} onClick={()=>go(n.id)}
              style={{width:"100%", display:"flex", alignItems:"center", gap:9, padding:"10px 18px",
                border:"none", cursor:"pointer", textAlign:"left",
                background:page===n.id?"rgba(255,255,255,0.15)":"transparent",
                color:page===n.id?"#fff":"rgba(255,255,255,0.62)",
                fontSize:13, fontWeight:page===n.id?700:500,
                borderLeft:page===n.id?"3px solid #fff":"3px solid transparent",
                transition:"all .15s"}}>
              <span>{n.icon}</span>{n.label}
            </button>
          ))}
        </div>
        <div style={{padding:"12px 18px", borderTop:"1px solid rgba(255,255,255,0.15)", fontSize:10, color:"rgba(255,255,255,0.4)"}}>
          児童：{db.children.length}名 ／ 計画：{db.plans.length}件
        </div>
      </div>
    );
  }

  return (
    <div style={{display:"flex", minHeight:"100vh", background:C.bg, fontFamily:"sans-serif"}}>

      {/* PC: サイドバー */}
      {!isMobile && <Sidebar/>}

      <div style={{flex:1, display:"flex", flexDirection:"column", minWidth:0}}>

        {/* モバイル: ヘッダー */}
        {isMobile && (
          <div style={{background:C.navy, padding:"11px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0}}>
            <div style={{color:"#fff", fontSize:13, fontWeight:700}}>{FACILITY}</div>
            <button onClick={()=>setMenu(!menu)} style={{background:"none", border:"none", color:"#fff", fontSize:22, cursor:"pointer", padding:4}}>☰</button>
          </div>
        )}

        {/* モバイル: ドロワーメニュー */}
        {isMobile && menu && (
          <div style={{position:"fixed", inset:0, zIndex:500}} onClick={()=>setMenu(false)}>
            <div style={{position:"absolute", top:0, left:0, width:210, height:"100%", background:C.navy, padding:"50px 0 0", boxShadow:"4px 0 20px rgba(0,0,0,0.3)"}} onClick={e=>e.stopPropagation()}>
              {NAV.map(n => (
                <button key={n.id} onClick={()=>go(n.id)}
                  style={{width:"100%", display:"flex", alignItems:"center", gap:10, padding:"12px 18px",
                    border:"none", cursor:"pointer", textAlign:"left",
                    background:page===n.id?"rgba(255,255,255,0.15)":"transparent",
                    color:page===n.id?"#fff":"rgba(255,255,255,0.7)",
                    fontSize:14, fontWeight:page===n.id?700:500}}>
                  {n.icon} {n.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ページヘッダー */}
        <div style={{background:"#fff", borderBottom:`1px solid ${C.border}`, padding:"12px 18px",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          boxShadow:"0 1px 4px rgba(0,0,0,0.05)", flexShrink:0}}>
          <div style={{fontSize:15, fontWeight:700, color:C.text}}>{TITLE[page]||""}</div>
          {child && (
            <div style={{display:"flex", alignItems:"center", gap:7, background:C.navyL, border:`1px solid ${C.tealB}`, borderRadius:8, padding:"4px 10px"}}>
              <span style={{fontSize:13}}>👶</span>
              <span style={{fontSize:12, fontWeight:700, color:C.navy}}>{child.name}</span>
              <button onClick={()=>setChild(null)} style={{background:"none", border:"none", cursor:"pointer", color:C.muted, fontSize:13, padding:"0 2px", lineHeight:1}}>✕</button>
            </div>
          )}
        </div>

        {/* コンテンツ */}
        <div style={{flex:1, overflowY:"auto"}}>
          {pages[page] || <Dashboard/>}
        </div>
      </div>

      {/* メールモーダル */}
      {emailModal && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000}}>
          <div style={{background:"#fff", borderRadius:14, padding:24, maxWidth:420, width:"90%", boxShadow:"0 4px 20px rgba(0,0,0,0.15)"}}>
            <div style={{fontWeight:700, fontSize:16, color:C.text, marginBottom:12}}>📧 保護者へ計画書を送信</div>
            <div style={{background:C.navyL, border:`1px solid ${C.tealB}`, borderRadius:8, padding:"10px 12px", marginBottom:12, fontSize:13, color:C.navy}}>
              宛先：{child?.parentEmail||ans.parentEmail||"（未登録）"}<br/>
              件名：【インクルーシブ療育】{ans.name||child?.name}さんの個別支援計画書
            </div>
            <div style={{background:C.orangeL, border:`1px solid ${C.orangeB}`, borderRadius:8, padding:"9px 12px", marginBottom:16, fontSize:12, color:C.orange}}>
              {useGAS() ? "📧 Google Apps Script 経由で保護者に直接メール送信します。" : "💡 「本文をコピーする」でメール内容をクリップボードにコピーします。メールアプリに貼り付けてご利用ください。"}
            </div>
            <div style={{display:"flex", gap:10}}>
              <button onClick={doEmail} disabled={emailSending}
                style={{flex:1, padding:11, background:C.green, color:"#fff", border:"none", borderRadius:8, fontSize:14, fontWeight:700, cursor:emailSending?"not-allowed":"pointer", opacity:emailSending?0.7:1}}>
                {emailSending ? "送信中..." : useGAS() ? "📧 メールを送信する" : "📋 本文をコピーする"}
              </button>
              <button onClick={()=>setEmailModal(false)} style={{padding:"11px 16px", background:"#fff", color:C.sub, border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, cursor:"pointer"}}>閉じる</button>
            </div>
          </div>
        </div>
      )}

      <Toast toast={toast}/>
    </div>
  );
}

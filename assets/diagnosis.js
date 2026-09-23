/* 症状から見立てを出す。すべてブラウザの中だけで動く。 */
(function () {
  'use strict';

  var INSTRUMENTS = {
    violin:    { label: 'ヴァイオリン',             family: 'violin', factor: 1 },
    viola:     { label: 'ヴィオラ',                 family: 'violin', factor: 1.1 },
    cello:     { label: 'チェロ',                   family: 'violin', factor: 1.6 },
    acoustic:  { label: 'アコースティックギター',   family: 'guitar', factor: 1 },
    classical: { label: 'クラシックギター',         family: 'guitar', factor: 1 },
    electric:  { label: 'エレキギター',             family: 'guitar', factor: 0.9 }
  };

  var SYMPTOMS = {
    violin: [
      { id: 'vol',   label: '音量が落ちた・こもる' },
      { id: 'bal',   label: '特定の弦だけ鳴りすぎる／鳴らない' },
      { id: 'high',  label: '弦が押さえづらい' },
      { id: 'buzz',  label: '弾くとビリつく・雑音が混じる' },
      { id: 'peg',   label: 'ペグが緩む／固くて回らない' },
      { id: 'crack', label: '割れ・接ぎの開きがある' },
      { id: 'bow',   label: '弓が滑る・毛が減った' }
    ],
    guitar: [
      { id: 'buzz',  label: '弦がビリつく' },
      { id: 'high',  label: '弦高が高くて押さえづらい' },
      { id: 'into',  label: '音程が合わない' },
      { id: 'neck',  label: 'ネックが反っている' },
      { id: 'brdg',  label: 'ブリッジが浮いている' },
      { id: 'noise', label: 'ノイズやガリが出る' },
      { id: 'crack', label: '割れ・打痕がある' }
    ]
  };

  var AGES = {
    a0: { label: '半年以内', note: '半年以内に見てもらっているなら、大きな狂いは考えにくいです。弦の劣化や、季節による湿度の変化のほうが先に疑われます。' },
    a1: { label: '1〜3年',   note: 'この期間だと、部品そのものより「弦を替えたときのズレ」が原因になっていることが多いです。' },
    a2: { label: '3〜10年',  note: '3年を超えると、駒の傾きやフレットの減りといった、毎日少しずつ進む変化が形になって出てきます。' },
    a3: { label: '10年以上・わからない', note: '長く調整していない楽器は、原因がひとつではないことがほとんどです。まとめて見直したほうが、結果的に安く早く終わります。' }
  };

  var CASES = {
    'violin/vol': {
      first:  { name: '魂柱の位置ずれ', text: '表板と裏板の間に立てただけの棒です。弦を全部外したり、ケースの中で強くぶつけたりすると動きます。0.5mmずれるだけで音量が変わります。' },
      second: { name: '駒の傾き', text: '駒が指板側に倒れていると、弦の振動が表板にうまく伝わりません。長く放っておくと反り返り、いずれ折れます。' },
      works: [['魂柱の位置調整', 'repair.html#violin'], ['駒の立て直し・足合わせ', 'repair.html#violin']],
      cost: [3300, 14300], days: '当日〜3日',
      can:  '駒を横から見て、テールピース側の面が表板と直角になっているか確かめてみてください。',
      cant: '中でカラカラと音がする場合は魂柱が倒れています。それ以上弾かずにお持ちください。'
    },
    'violin/bal': {
      first:  { name: '魂柱と駒足の位置関係', text: 'E線側が強すぎるときは魂柱が駒足より外に出ていることが多く、G線が鳴らないときは内側に寄りすぎていることが多いです。' },
      second: { name: '駒の厚みと弦溝', text: '駒の上部が厚いまま、あるいは弦の溝が深すぎると、その弦だけ反応が鈍くなります。' },
      works: [['魂柱の位置調整', 'repair.html#violin'], ['駒の新規製作', 'repair.html#violin']],
      cost: [3300, 25300], days: '当日〜2週間',
      can:  '弦の種類を替えた直後であれば、まず1週間ほど弾いて馴染ませてみてください。',
      cant: '弦の溝をご自分で削らないでください。深くしすぎると駒ごと作り直しになります。'
    },
    'violin/high': {
      first:  { name: '指板の摩耗', text: 'よく使う位置がへこむと、そこを避けるために駒を高いまま使っていることがあります。押さえづらさは指板側から始まっていることが多いです。' },
      second: { name: 'ネック角度の落ち', text: '古い楽器では、ネックの取り付け角度そのものが下がっていることがあります。この場合は大きな作業になります。' },
      works: [['指板削り', 'repair.html#violin'], ['駒の新規製作', 'repair.html#violin'], ['ネックの上げ直し', 'repair.html#violin']],
      cost: [11000, 88000], days: '1週間〜2か月',
      can:  '指板の端で、弦と指板の隙間がどれくらいあるか見てきてもらえると判断が早くなります。',
      cant: '駒だけを低く削るのは、原因を確かめてからにしてください。削ったものは戻せません。'
    },
    'violin/buzz': {
      first:  { name: '接ぎ目や指板の剥がれ', text: '膠が外れて数ミリ開いているだけで、弾くたびに鳴ります。指の腹で軽く叩くと、音が変わる場所があります。' },
      second: { name: '付属品のゆるみ', text: 'アジャスター、テールガット、顎当ての金具。楽器本体ではないことも同じくらい多いです。' },
      works: [['接ぎ目の剥がれ接着', 'repair.html#violin'], ['指板の剥がれ接着', 'repair.html#violin']],
      cost: [3300, 8800], days: '3日〜1週間',
      can:  '顎当てを一度外して弾いてみてください。それで消えるなら本体の問題ではありません。',
      cant: '開いた場所に接着剤を流し込まないでください。あとから正しく閉じられなくなります。'
    },
    'violin/peg': {
      first:  { name: 'ペグと穴の当たりの減り', text: '乾燥する季節に急に出ます。滑るのも固いのも、原因は同じ「当たりの変化」です。' },
      second: { name: 'ペグ穴の変形', text: '長年の使用で穴が真円でなくなると、すり合わせでは止まりません。埋めて開け直す作業になります。' },
      works: [['ペグのすり合わせ', 'repair.html#violin'], ['ペグ穴の埋め直し', 'repair.html#violin']],
      cost: [3300, 24200], days: '2日〜2週間',
      can:  '弦を巻くときは、ペグを軽く押し込みながら回してください。それだけで止まることもあります。',
      cant: '石鹸・鉛筆・潤滑剤を塗らないでください。作業前に落とす手間が増え、費用も上がります。'
    },
    'violin/crack': {
      first:  { name: '乾燥による接ぎの開き', text: '膠はわざと弱く作ってあります。開いたのは、木が割れる代わりに接着が先に負けてくれた結果です。' },
      second: { name: '圧力による割れ', text: '魂柱の位置、駒の脚、顎当ての締めすぎ。原因のほうを直さないと、同じ場所がまた割れます。' },
      works: [['接ぎ目の剥がれ接着', 'repair.html#violin'], ['割れの接着と補強', 'repair.html#violin']],
      cost: [3300, 44000], days: '3日〜3週間',
      can:  '弦を少し緩めて、それ以上開かない状態にしてからお持ちください。',
      cant: 'テープで留めないでください。剥がすときに塗装が持っていかれます。'
    },
    'violin/bow': {
      first:  { name: '毛の消耗', text: '松脂がのらなくなったら替えどきです。毎日弾く方で半年、週末だけなら1年が目安です。' },
      second: { name: '毛の量の偏り', text: '片側だけ減っていると弓が傾いて当たり、音が安定しません。切れた本数より、減り方の偏りを見ます。' },
      works: [['毛替え', 'repair.html#bow']],
      cost: [7150, 15400], days: '3〜5日',
      can:  '毛が数本切れている程度なら、まだ使えます。切れた毛は根元でハサミを入れてください。',
      cant: '毛を素手で触らないでください。脂がつくと、その部分だけ松脂がのらなくなります。'
    },

    'guitar/buzz': {
      first:  { name: 'ネックの反りとフレットの高さ', text: '順反りが足りないか、フレットが局所的に減っています。何フレットで鳴るかで、原因の場所がかなり絞れます。' },
      second: { name: 'ナット溝の深さ', text: '開放弦でだけ鳴る場合は、ほぼナットです。溝が下がりすぎると1フレットに当たります。' },
      works: [['基本調整', 'repair.html#guitar'], ['フレットすり合わせ', 'repair.html#guitar'], ['ナット製作・交換', 'repair.html#guitar']],
      cost: [7700, 27500], days: '3日〜1週間',
      can:  '何フレットを押さえたとき、どの弦で鳴るかをメモしてきてください。',
      cant: 'ロッドを一度に半回転以上回さないでください。折れると交換になり、費用が一桁変わります。'
    },
    'guitar/high': {
      first:  { name: 'ネックの順反り', text: '弦高が高いというご相談の多くは、実際には反りの話です。まずロッドで規定内に戻してから、高さを見ます。' },
      second: { name: 'サドルとナットの高さ', text: '反りが正常なら、サドル側で下げます。ただし下げすぎると今度はビリつくので、下限があります。' },
      works: [['基本調整', 'repair.html#guitar'], ['サドル製作・交換', 'repair.html#guitar'], ['ネック矯正', 'repair.html#guitar']],
      cost: [7700, 28600], days: '3日〜2週間',
      can:  '12フレットでの弦高（1弦と6弦）を測ってきてもらえると、話が早く進みます。',
      cant: 'サドルを削る前にご相談ください。削ったものは戻せません。'
    },
    'guitar/into': {
      first:  { name: 'オクターブ調整のずれ', text: '弦を替えた直後や、弦高を変えたあとには必ず起きます。弦のゲージを変えたなら、まずここです。' },
      second: { name: 'ナットの位置と溝の深さ', text: 'ローポジションだけシャープするなら、ナット側の問題です。溝が浅いと押さえたときに音程が上がります。' },
      works: [['基本調整', 'repair.html#guitar'], ['ナット製作・交換', 'repair.html#guitar']],
      cost: [7700, 19800], days: '3〜5日',
      can:  'どのポジションでどれくらいずれるか、チューナーの表示を控えてきてください。',
      cant: 'ペグ側で無理に合わせ込まないでください。別の場所が狂います。'
    },
    'guitar/neck': {
      first:  { name: '季節による反りの変化', text: '木は湿度で動きます。梅雨と冬で反りが変わるのは、故障ではなく正常な動きです。年に1〜2回の調整で追いつきます。' },
      second: { name: 'ロッドの効き幅の限界', text: '回しきっている場合は、熱とジグで木そのものを戻す作業になります。' },
      works: [['ロッド調整のみ', 'repair.html#guitar'], ['ネック矯正', 'repair.html#guitar']],
      cost: [2200, 22000], days: '当日〜2週間',
      can:  '1フレットと最終フレットを同時に押さえて、中間でどれくらい隙間があるか見てください。',
      cant: 'ロッドが固いときに力で回さないでください。折れます。'
    },
    'guitar/brdg': {
      first:  { name: '接着の剥離', text: '弦の張力は常時70kg前後かかっています。数ミリ浮いた状態は、そこで止まりません。' },
      second: { name: 'トップの膨らみ', text: 'ブリッジのまわりが盛り上がっているときは、内部のブレイシングの剥がれもあわせて見ます。' },
      works: [['ブリッジの貼り直し', 'repair.html#guitar'], ['トップ割れの修正', 'repair.html#guitar']],
      cost: [44000, 77000], days: '2〜4週間',
      can:  'すぐに弦を緩めてください。それだけで進行が止まります。',
      cant: 'そのまま弾き続けないでください。剥がれる範囲が広がるほど費用が上がります。'
    },
    'guitar/noise': {
      first:  { name: 'ポットとジャックの接触不良', text: '「ガリ」はポット、断続的に切れるノイズはジャックか配線であることが多いです。' },
      second: { name: 'アース不良', text: '弦に触れるとノイズが消える場合は、アースが外れているか、落ちきっていません。' },
      works: [['電装のノイズ・ガリ取り', 'repair.html#guitar']],
      cost: [5500, 16500], days: '3〜5日',
      can:  'どの操作で出るか（ボリュームを回したとき、ケーブルを動かしたとき）を控えてきてください。',
      cant: '接点復活剤をポットに大量に吹き込まないでください。かえって導電部を傷めます。'
    },
    'guitar/crack': {
      first:  { name: '乾燥によるトップ割れ', text: '冬の室内で起きます。木目に沿ってまっすぐ入るのが特徴で、放っておくと少しずつ伸びます。' },
      second: { name: '転倒によるヘッドまわりの破損', text: 'スタンドからの転倒は、ヘッドの付け根が折れる形になりやすいです。破片が残っていれば接着できます。' },
      works: [['トップ割れの修正', 'repair.html#guitar'], ['ネック折れの接着・補強', 'repair.html#guitar']],
      cost: [17600, 110000], days: '2〜4週間',
      can:  '弦を緩めて、乾燥した部屋から出してください。割れの進行が遅くなります。',
      cant: '割れの内側にボンドを流さないでください。あとから正しく閉じられなくなります。'
    }
  };

  var form = document.getElementById('dx');
  var symWrap = document.getElementById('dx-symptoms');
  var out = document.getElementById('dx-out');
  if (!form || !symWrap || !out) return;

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function yen(n) { return Math.round(n / 100) * 100; }
  function money(n) { return yen(n).toLocaleString('ja-JP'); }

  function currentInstrument() {
    var el = form.querySelector('input[name="inst"]:checked');
    return el ? el.value : 'violin';
  }

  function renderSymptoms() {
    var fam = INSTRUMENTS[currentInstrument()].family;
    var list = SYMPTOMS[fam];
    symWrap.innerHTML = list.map(function (s, i) {
      return '<label class="chip"><input type="radio" name="sym" value="' + s.id + '"' +
             (i === 0 ? ' checked' : '') + '><span>' + esc(s.label) + '</span></label>';
    }).join('');
  }

  var lastText = '';

  function render() {
    var instKey = currentInstrument();
    var inst = INSTRUMENTS[instKey];
    var symEl = form.querySelector('input[name="sym"]:checked');
    var ageEl = form.querySelector('input[name="age"]:checked');
    if (!symEl || !ageEl) return;

    var symId = symEl.value;
    var sym = SYMPTOMS[inst.family].filter(function (s) { return s.id === symId; })[0];
    var c = CASES[inst.family + '/' + symId];
    var age = AGES[ageEl.value];
    if (!c) return;

    var lo = money(c.cost[0] * inst.factor);
    var hi = money(c.cost[1] * inst.factor) + '円';

    var works = c.works.map(function (w) {
      return '<li><a href="' + w[1] + '">' + esc(w[0]) + '</a></li>';
    }).join('');

    out.innerHTML =
      '<article class="card" tabindex="-1">' +
        '<header class="card__head">' +
          '<h2>見立て</h2>' +
          '<p class="card__sub">' + esc(inst.label) + '／' + esc(sym.label) + '／前回の調整から' + esc(age.label) + '</p>' +
        '</header>' +

        '<div class="card__rows">' +
          '<section class="row">' +
            '<h3>最初に疑うこと</h3>' +
            '<p class="row__name">' + esc(c.first.name) + '</p>' +
            '<p>' + esc(c.first.text) + '</p>' +
          '</section>' +
          '<section class="row">' +
            '<h3>次に疑うこと</h3>' +
            '<p class="row__name">' + esc(c.second.name) + '</p>' +
            '<p>' + esc(c.second.text) + '</p>' +
          '</section>' +
          '<section class="row">' +
            '<h3>調整の間隔から</h3>' +
            '<p>' + esc(age.note) + '</p>' +
          '</section>' +
        '</div>' +

        '<div class="card__figures">' +
          '<div><span class="fig__k">想定される作業</span><ul class="plain fig__works">' + works + '</ul></div>' +
          '<div><span class="fig__k">費用の目安</span><p class="fig__v">' + lo + '〜' + hi + '</p></div>' +
          '<div><span class="fig__k">お預かり</span><p class="fig__v">' + esc(c.days) + '</p></div>' +
        '</div>' +

        '<div class="card__advice">' +
          '<p><span class="ok">持ち込む前にできること</span>' + esc(c.can) + '</p>' +
          '<p><span class="ng">しないでください</span>' + esc(c.cant) + '</p>' +
        '</div>' +

        '<footer class="card__foot">' +
          '<button class="act act--quiet" type="button" id="dx-copy">この見立てを控える</button>' +
          '<a class="act" href="contact.html">持ち込みを相談する</a>' +
          '<p class="card__note" id="dx-copy-msg"></p>' +
        '</footer>' +
      '</article>';

    lastText =
      '【木戸弦楽器工房 見立て】\n' +
      inst.label + '／' + sym.label + '／前回の調整から' + age.label + '\n\n' +
      '最初に疑うこと：' + c.first.name + '\n' + c.first.text + '\n\n' +
      '次に疑うこと：' + c.second.name + '\n' + c.second.text + '\n\n' +
      '想定される作業：' + c.works.map(function (w) { return w[0]; }).join('、') + '\n' +
      '費用の目安：' + lo + '〜' + hi + '\n' +
      'お預かり：' + c.days + '\n\n' +
      '持ち込む前にできること：' + c.can + '\n' +
      'しないでください：' + c.cant + '\n';

    var copy = document.getElementById('dx-copy');
    var msg = document.getElementById('dx-copy-msg');
    copy.addEventListener('click', function () {
      var done = function () { msg.textContent = '控えました。メモ帳などに貼り付けられます。'; };
      var fail = function () { msg.textContent = '控えられませんでした。画面をそのまま撮っておいてください。'; };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(lastText).then(done, fail);
      } else {
        fail();
      }
    });

    out.querySelector('.card').focus();
  }

  form.addEventListener('change', function (e) {
    if (e.target.name === 'inst') {
      renderSymptoms();
      out.innerHTML = '';
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    render();
  });

  renderSymptoms();
})();

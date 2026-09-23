/* トップの解剖図。印にふれると、その部位で起きやすいことを読み取り欄に出す。 */
(function () {
  var fig = document.getElementById('anatomy');
  var readout = document.getElementById('readout');
  if (!fig || !readout) return;

  var parts = {
    pegbox: {
      name: '糸巻（ペグ）',
      sign: '回してもすぐ緩む。逆に固くて動かない。合わせている途中で弦が切れる。',
      why: '糸巻と穴の当たりが減っている状態です。乾燥した季節に急に出ることが多く、無理に押し込むと箱側が割れます。',
      work: 'ペグのすり合わせ、穴の埋め直しと開け直し',
      href: 'repair.html#violin'
    },
    fingerboard: {
      name: '指板',
      sign: '特定の音だけビリつく。低い位置で押さえた指が次のフレット位置に当たる。',
      why: '黒檀は弾き込むと減ります。よく使う位置がへこみ、面がうねると弦が当たって雑音が出ます。',
      work: '指板削り（面直しと反りの修正）、剥がれの接着',
      href: 'repair.html#violin'
    },
    bridge: {
      name: '駒',
      sign: '弦が押さえづらい。音が細い。横から見ると駒が傾いている。',
      why: '駒は弦に引かれて少しずつ指板側へ倒れます。倒れたまま弾き続けると反り返り、いずれ折れます。',
      work: '駒の立て直し、足合わせ、新しい駒の削り出し',
      href: 'repair.html#violin'
    },
    fhole: {
      name: 'f字孔と魂柱',
      sign: '音量が落ちた。低音が出ない。E線だけ鳴りすぎる。',
      why: '魂柱は表板と裏板の間に立てただけの棒です。0.5mm動かすと音が変わります。倒れると表板を割ることがあります。',
      work: '魂柱の位置調整、立て直し、交換',
      href: 'repair.html#violin'
    },
    tailpiece: {
      name: 'テールピースとアジャスター',
      sign: '弦がすぐ切れる。弾いていないのに「ジー」という雑音が混じる。',
      why: 'テールガットの長さが変わると、駒からテールピースまでの距離（アフターレングス）がずれます。ここは音色に直接効きます。',
      work: 'テールガット長の調整、アジャスターの交換',
      href: 'repair.html#violin'
    },
    body: {
      name: '表板・接ぎと割れ',
      sign: '冬になると接着が外れる。細い線が入り、少しずつ伸びる。',
      why: '木は乾燥すると縮みます。接着に使う膠は、あとから外せるようにわざと弱くしてあります。外れたのは楽器を守った結果です。',
      work: '膠での接ぎ直し、割れの接着と内側からの補強',
      href: 'repair.html#violin'
    }
  };

  var spots = Array.prototype.slice.call(fig.querySelectorAll('.spot'));
  var inks = Array.prototype.slice.call(fig.querySelectorAll('.ink[data-part]'));
  var idle = readout.innerHTML;

  function show(key) {
    var p = parts[key];
    if (!p) return;
    fig.setAttribute('data-active', key);
    inks.forEach(function (g) { g.classList.toggle('is-lit', g.getAttribute('data-part') === key); });
    spots.forEach(function (s) { s.classList.toggle('is-on', s.getAttribute('data-part') === key); });
    readout.innerHTML =
      '<h3>' + p.name + '</h3>' +
      '<dl>' +
      '<dt>よくある訴え</dt><dd>' + p.sign + '</dd>' +
      '<dt>工房が最初に疑うこと</dt><dd>' + p.why + '</dd>' +
      '<dt>あてはまる作業</dt><dd><a href="' + p.href + '">' + p.work + '</a></dd>' +
      '</dl>';
  }

  function clear() {
    fig.removeAttribute('data-active');
    inks.forEach(function (g) { g.classList.remove('is-lit'); });
    spots.forEach(function (s) { s.classList.remove('is-on'); });
    readout.innerHTML = idle;
  }

  spots.forEach(function (s) {
    var key = s.getAttribute('data-part');
    s.addEventListener('mouseenter', function () { show(key); });
    s.addEventListener('focus', function () { show(key); });
    s.addEventListener('click', function () { show(key); });
  });

  fig.addEventListener('mouseleave', clear);
  fig.addEventListener('focusout', function (e) {
    if (!fig.contains(e.relatedTarget)) clear();
  });
})();

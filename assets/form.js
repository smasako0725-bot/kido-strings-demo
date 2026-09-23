/* 相談フォーム。制作デモのため、送信先はありません。 */
(function () {
  var form = document.getElementById('askform');
  var msg = document.getElementById('form-msg');
  if (!form || !msg) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var missing = [];
    if (!form.name.value.trim()) missing.push('お名前');
    if (!form.mail.value.trim()) missing.push('メールアドレス');
    if (!form.body.value.trim()) missing.push('困っていること');

    if (missing.length) {
      msg.className = 'form__msg is-bad';
      msg.textContent = missing.join('、') + 'が空のままです。入力してから送ってください。';
      return;
    }
    if (form.mail.value.indexOf('@') < 0) {
      msg.className = 'form__msg is-bad';
      msg.textContent = 'メールアドレスの形式を確認してください。';
      return;
    }

    msg.className = 'form__msg is-good';
    msg.textContent = 'このサイトは制作デモのため、実際には送信されません。実案件では、ここで工房宛のメールと自動返信が動きます。';
  });
})();

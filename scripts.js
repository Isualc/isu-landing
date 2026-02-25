(() => {
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  const range = document.getElementById('riskRange');
  const scoreEl = document.getElementById('riskScore');
  const badgeEl = document.getElementById('riskBadge');
  const adviceEl = document.getElementById('riskAdvice');
  const policiesEl = document.getElementById('riskPolicies');
  const findingsEl = document.getElementById('riskFindings');
  const timeEl = document.getElementById('riskTime');

  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  function bucket(score){
    if (score < 25) return {label: 'Low', cls: 'text-bg-success', advice: 'Looks safe. Keep an eye on drift and enforce baseline policies.'};
    if (score < 55) return {label: 'Medium', cls: 'text-bg-info', advice: 'Review network changes and ensure encryption defaults remain enabled.'};
    if (score < 80) return {label: 'High', cls: 'text-bg-warning', advice: 'Investigate exposure paths, tighten SG/NSG rules, and require approval.'};
    return {label: 'Critical', cls: 'text-bg-danger', advice: 'Possible privilege escalation or public exposure. Block merge until remediated.'};
  }

  function recompute(score){
    const s = clamp(Number(score || 0), 0, 100);
    const b = bucket(s);

    if (scoreEl) scoreEl.textContent = String(s);
    if (badgeEl){
      badgeEl.textContent = b.label;
      badgeEl.className = `badge rounded-pill ${b.cls}`;
    }
    if (adviceEl) adviceEl.textContent = b.advice;

    // Fake but plausible telemetry values.
    if (policiesEl) policiesEl.textContent = String(120 + Math.round(s * 0.6));
    if (findingsEl) findingsEl.textContent = String(Math.max(0, Math.round((s - 10) / 25)));
    if (timeEl) timeEl.textContent = (0.6 + s / 140).toFixed(1);
  }

  if (range){
    range.addEventListener('input', (e) => recompute(e.target.value));
    recompute(range.value);
  }

  document.querySelectorAll('[data-risk]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-risk');
      if (range) range.value = val;
      recompute(val);
    });
  });
})();

window.cwSubmitDemo = function (event) {
  event.preventDefault();
  const msg = document.getElementById('formMsg');
  const email = document.getElementById('email');
  if (!msg || !email) return false;

  // Demo-only: no network requests.
  msg.textContent = `Thanks! If this were live, we'd send a demo link to ${email.value}.`;
  return false;
};

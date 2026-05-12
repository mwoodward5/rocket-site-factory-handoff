/**
 * WSS Dream Forge — Embeddable Edit Widget
 * Woodward Software Systems
 *
 * Adds a floating "Edit with AI" button to any static site. Clicking it opens
 * a chat panel that streams natural-language site edits via the Dream Forge
 * factory API.
 *
 * Usage (paste before </body>):
 *   <script
 *     src="https://wss-dream-forge.vercel.app/widget/edit-widget.js"
 *     data-site-id="hill-country-plumbing"
 *     data-factory="https://wss-dream-forge.vercel.app"
 *     defer></script>
 */

(function () {
  'use strict';

  const script = document.currentScript;
  if (!script) return;

  const SITE_ID = script.getAttribute('data-site-id');
  const FACTORY = script.getAttribute('data-factory') || 'https://wss-dream-forge.vercel.app';

  if (!SITE_ID) {
    console.warn('[wss-edit-widget] missing data-site-id, widget will not load');
    return;
  }

  // ── styles ──────────────────────────────────────────────────────────────────
  const css = `
.wss-fab{position:fixed;right:20px;bottom:24px;width:62px;height:62px;border-radius:50%;
  background:linear-gradient(135deg,#22D3EE,#a78bfa);border:2px solid rgba(255,255,255,.45);cursor:pointer;
  box-shadow:0 10px 32px rgba(34,211,238,.55),0 0 0 6px rgba(10,18,40,.35);
  display:flex;align-items:center;justify-content:center;
  font-size:26px;color:#0a1228;font-weight:800;z-index:2147483647;transition:transform .15s ease;
  pointer-events:auto;}
.wss-fab:hover{transform:scale(1.08)}
.wss-fab[aria-pressed="true"]{transform:scale(.92)}
.wss-panel{position:fixed;right:18px;bottom:90px;width:360px;max-width:calc(100vw - 36px);height:520px;
  max-height:calc(100vh - 120px);background:#0b1326;color:#f1f5f9;border-radius:14px;
  border:1px solid rgba(255,255,255,.08);box-shadow:0 24px 64px rgba(0,0,0,.55);
  display:none;flex-direction:column;overflow:hidden;z-index:2147483647;
  font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif;font-size:13px;}
.wss-panel.open{display:flex}
.wss-head{padding:14px 16px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;gap:10px;}
.wss-dot{width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 8px #22c55e}
.wss-head-title{font-weight:700;font-size:14px}
.wss-head-sub{margin-left:auto;font-size:11px;color:#64748b;font-family:'JetBrains Mono',monospace}
.wss-log{flex:1;overflow-y:auto;padding:14px 14px 8px}
.wss-msg{margin-bottom:12px;line-height:1.45;}
.wss-msg.user{text-align:right}
.wss-msg .bubble{display:inline-block;max-width:90%;padding:9px 12px;border-radius:12px;
  background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);text-align:left;white-space:pre-wrap;word-wrap:break-word;}
.wss-msg.user .bubble{background:rgba(34,211,238,.12);border-color:rgba(34,211,238,.22)}
.wss-msg.sys{font-size:11px;color:#64748b;text-align:center;font-style:italic}
.wss-input-row{padding:10px;border-top:1px solid rgba(255,255,255,.07);display:flex;gap:8px;align-items:flex-end}
.wss-input{flex:1;background:rgba(255,255,255,.05);color:#f1f5f9;border:1px solid rgba(255,255,255,.08);
  border-radius:10px;padding:10px 12px;font:inherit;resize:none;min-height:38px;max-height:120px;outline:none}
.wss-input:focus{border-color:#22D3EE}
.wss-send{background:linear-gradient(135deg,#22D3EE,#a78bfa);color:#0a1228;border:none;border-radius:10px;
  padding:0 14px;height:38px;font-weight:700;cursor:pointer}
.wss-send:disabled{opacity:.5;cursor:not-allowed}
.wss-foot{padding:8px 12px;font-size:10px;color:#475569;text-align:center;border-top:1px solid rgba(255,255,255,.05)}
.wss-foot a{color:#94a3b8;text-decoration:none}
@media (prefers-reduced-motion: reduce){.wss-fab{transition:none}}
`;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── DOM ────────────────────────────────────────────────────────────────────
  const fab = document.createElement('button');
  fab.className = 'wss-fab';
  fab.setAttribute('aria-label', 'Edit site with AI');
  fab.setAttribute('aria-pressed', 'false');
  fab.innerHTML = '✎';

  const panel = document.createElement('div');
  panel.className = 'wss-panel';
  panel.innerHTML = `
    <div class="wss-head">
      <span class="wss-dot"></span>
      <span class="wss-head-title">Dream Studio Editor</span>
      <span class="wss-head-sub">${SITE_ID}</span>
    </div>
    <div class="wss-log" id="wss-log">
      <div class="wss-msg sys"><span class="bubble" style="background:none;border:none;color:#64748b">Type a change in plain English. Examples: "make the hero headline bolder" · "swap the gallery photo for a sunset shot" · "add a third service card for emergency calls".</span></div>
    </div>
    <div class="wss-input-row">
      <textarea class="wss-input" id="wss-input" placeholder="Describe a change…" rows="1"></textarea>
      <button class="wss-send" id="wss-send">Send</button>
    </div>
    <div class="wss-foot">Powered by <a href="${FACTORY}" target="_blank" rel="noopener">Dream Forge</a> · 5 credits per edit</div>
  `;
  document.body.appendChild(fab);
  document.body.appendChild(panel);

  const log = panel.querySelector('#wss-log');
  const input = panel.querySelector('#wss-input');
  const sendBtn = panel.querySelector('#wss-send');

  function toggle() {
    const open = panel.classList.toggle('open');
    fab.setAttribute('aria-pressed', open ? 'true' : 'false');
    if (open) input.focus();
  }
  fab.addEventListener('click', toggle);

  function addMsg(role, text) {
    const wrap = document.createElement('div');
    wrap.className = 'wss-msg ' + role;
    const bubble = document.createElement('span');
    bubble.className = 'bubble';
    bubble.textContent = text;
    wrap.appendChild(bubble);
    log.appendChild(wrap);
    log.scrollTop = log.scrollHeight;
    return bubble;
  }

  async function send() {
    const instruction = input.value.trim();
    if (!instruction) return;
    input.value = '';
    sendBtn.disabled = true;
    addMsg('user', instruction);
    const replyBubble = addMsg('assistant', '…');

    try {
      const res = await fetch(FACTORY + '/api/admin/edits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId: SITE_ID, instruction }),
      });

      if (res.status === 402) {
        replyBubble.textContent = 'You are out of credits. Top up at the Dream Studio dashboard to keep editing.';
        sendBtn.disabled = false;
        return;
      }
      if (!res.ok) {
        const msg = await res.text();
        replyBubble.textContent = `Edit service returned ${res.status}. ${msg.slice(0, 200)}`;
        sendBtn.disabled = false;
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      replyBubble.textContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        // Stream is OpenAI SSE proxied through factory: parse data: lines
        const lines = chunk.split('\n').filter((l) => l.startsWith('data: '));
        for (const line of lines) {
          const data = line.slice(6).trim();
          if (!data || data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              acc += delta;
              replyBubble.textContent = acc;
              log.scrollTop = log.scrollHeight;
            }
          } catch {
            // raw chunk path
            acc += data;
            replyBubble.textContent = acc;
          }
        }
      }
      if (!acc) replyBubble.textContent = '(edit acknowledged · no preview available)';
    } catch (err) {
      replyBubble.textContent = 'Network error: ' + (err && err.message ? err.message : err);
    } finally {
      sendBtn.disabled = false;
    }
  }
  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });
})();

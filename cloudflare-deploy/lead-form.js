/* Shared "Start your journey" lead-capture modal — used across the site + country pages */
(function(){
  // Paste your deployed Google Apps Script Web App URL here once set up (see google-apps-script-setup.txt)
  const SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxnGBYNvXKrQludIog9IXA4og7gEntSuiIbMK8KEfoAxYl4SVRyZr2gwrNEqgvzd3Zo/exec';
  const COUNTRY_LIST = ['France','Germany','Italy','Spain','Netherlands','Greece','Switzerland','Czechia','Austria','Portugal','Belgium','Denmark','Estonia','Finland','Hungary','Iceland','Latvia','Liechtenstein','Lithuania','Luxembourg','Malta','Norway','Poland','Bulgaria','Slovakia','Slovenia','Sweden','Croatia','Ireland'];

  const css = `
  .lf-overlay{position:fixed;inset:0;z-index:9999;background:rgba(4,11,24,.72);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:24px;opacity:0;pointer-events:none;transition:opacity .35s cubic-bezier(.19,1,.22,1);}
  .lf-overlay.lf-open{opacity:1;pointer-events:auto;}
  .lf-card{width:100%;max-width:460px;max-height:88vh;overflow-y:auto;background:linear-gradient(165deg,#0D2547,#0A1B38);border:1px solid rgba(143,192,238,.22);border-radius:20px;box-shadow:0 50px 120px rgba(0,0,0,.55);padding:32px 30px 30px;position:relative;transform:translateY(24px) scale(.96);opacity:0;transition:transform .4s cubic-bezier(.19,1,.22,1),opacity .4s cubic-bezier(.19,1,.22,1);font-family:'Sora',sans-serif;}
  .lf-overlay.lf-open .lf-card{transform:translateY(0) scale(1);opacity:1;}
  .lf-close{position:absolute;top:16px;right:16px;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);color:#EAF1FA;display:flex;align-items:center;justify-content:center;font-size:16px;cursor:pointer;transition:background .25s,transform .25s;}
  .lf-close:hover{background:rgba(255,255,255,.18);transform:rotate(90deg);}
  .lf-eyebrow{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#8FC0EE;margin-bottom:8px;}
  .lf-card h2{font-family:'Piazzolla',serif;font-size:24px;font-weight:500;color:#fff;margin-bottom:6px;line-height:1.15;}
  .lf-card p.lf-sub{font-size:13px;color:#fff;margin-bottom:22px;line-height:1.5;}
  .lf-field{margin-bottom:14px;}
  .lf-field label{display:block;font-size:11.5px;font-weight:600;color:#C9D6EA;margin-bottom:6px;}
  .lf-field input,.lf-field select{width:100%;padding:12px 14px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.16);border-radius:10px;color:#fff;font-family:'Sora',sans-serif;font-size:13.5px;transition:border-color .25s,background .25s;}
  .lf-field select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238FC0EE' stroke-width='1.6' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:34px;}
  .lf-field select option{background:#0D2547;color:#fff;}
  .lf-field input::placeholder{color:#6C7F9C;}
  .lf-field input:focus,.lf-field select:focus{outline:none;border-color:#4C93D9;background:rgba(76,147,217,.1);}
  .lf-row2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
  .lf-other-wrap{display:none;margin-top:10px;}
  .lf-other-wrap.lf-show{display:block;}
  .lf-submit{width:100%;margin-top:8px;padding:14px;border:none;border-radius:10px;background:linear-gradient(135deg,#4C93D9,#2CB5A0);color:#fff;font-weight:600;font-size:14px;cursor:pointer;transition:transform .3s cubic-bezier(.19,1,.22,1),box-shadow .3s;}
  .lf-submit:hover{transform:translateY(-2px);box-shadow:0 16px 34px rgba(76,147,217,.4);}
  .lf-micro{margin-top:12px;text-align:center;font-size:10.5px;color:#7E93B8;font-family:'JetBrains Mono',monospace;letter-spacing:.04em;}
  .lf-success{display:none;text-align:center;padding:12px 4px 4px;}
  .lf-success.lf-show{display:block;}
  .lf-success .lf-check{width:56px;height:56px;border-radius:50%;background:rgba(74,222,128,.14);border:1px solid rgba(74,222,128,.4);color:#4ADE80;font-size:26px;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;animation:lfPop .5s cubic-bezier(.19,1,.22,1);}
  @keyframes lfPop{from{transform:scale(.5);opacity:0;}to{transform:scale(1);opacity:1;}}
  .lf-success h2{margin-bottom:10px;}
  .lf-success p{font-size:13.5px;color:#C9D6EA;line-height:1.6;margin-bottom:22px;}
  .lf-wa{display:inline-flex;align-items:center;gap:8px;background:#25D366;color:#fff;font-weight:600;font-size:13px;padding:12px 22px;border-radius:10px;transition:transform .3s,box-shadow .3s;}
  .lf-wa:hover{transform:translateY(-2px);box-shadow:0 14px 30px rgba(37,211,102,.35);}
  .lf-error{display:none;font-size:11px;color:#FF6B6B;margin-top:6px;}
  .lf-error.lf-show{display:block;}
  .lf-field input.lf-invalid{border-color:#FF6B6B;background:rgba(255,107,107,.08);}
  .lf-form-body{display:block;}
  .lf-form-body.lf-hide{display:none;}
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  const optionsHtml = COUNTRY_LIST.map(c=>`<option value="${c}">${c}</option>`).join('');

  const overlay = document.createElement('div');
  overlay.className = 'lf-overlay';
  overlay.innerHTML = `
    <div class="lf-card" role="dialog" aria-modal="true" aria-labelledby="lfTitle">
      <div class="lf-close" id="lfClose">✕</div>
      <div class="lf-form-body" id="lfFormBody">
        <div class="lf-eyebrow" id="lfEyebrow">Start your journey</div>
        <h2 id="lfTitle">Your next stamp is waiting. Let's go get it.</h2>
        <p class="lf-sub" id="lfSub">Share a few details, and your specialist will reply on WhatsApp within the hour.</p>
        <form id="lfForm">
          <div class="lf-field"><label>Full name</label><input type="text" name="name" placeholder="Your name" required></div>
          <div class="lf-row2">
            <div class="lf-field"><label>Contact number</label><input type="tel" name="phone" placeholder="+44 7…" required></div>
            <div class="lf-field"><label>Email</label><input type="email" name="email" placeholder="you@email.com" required></div>
          </div>
          <div class="lf-row2">
            <div class="lf-field"><label>Tentative travel date</label><input type="date" name="date"></div>
            <div class="lf-field"><label>Destination</label><select name="destination" id="lfDestination"><option value="">Select country</option>${optionsHtml}</select></div>
          </div>
          <div class="lf-field" id="lfTravellersWrap"><label>Number of travellers <span id="lfTravellersHint" style="font-weight:400;color:#7E93B8;">(10+ for group bookings)</span></label><input type="number" name="travellers" id="lfTravellers" min="10" step="1" placeholder="e.g. 12"><div class="lf-error" id="lfTravellersErr">Group bookings need at least 10 travellers.</div></div>
          <label style="display:flex;align-items:flex-start;gap:9px;margin:6px 0 4px;font-size:12px;color:#7E93B8;line-height:1.5;cursor:pointer;"><input type="checkbox" id="lfConsent" required style="margin-top:2px;flex-shrink:0;width:15px;height:15px;">I agree to let the Schengen Mallu team contact me and send updates about my enquiry.<div class="lf-error" id="lfConsentErr" style="margin-top:2px;">Please confirm you're okay with us contacting you.</div></label>
          <button type="submit" class="lf-submit">Send my details →</button>
          <div class="lf-micro">No payment now · Reply within the hour · UK business hours</div>
        </form>
      </div>
      <div class="lf-success" id="lfSuccess">
        <div class="lf-check">✓</div>
        <h2>You're on the list<span id="lfSuccessName"></span>.</h2>
        <p>Thanks — we've got your details and a specialist will reach out on WhatsApp shortly. Want to get started right away?</p>
        <a href="https://wa.me/447352555500?text=Hi%20Schengen%20Mallu%2C%20I%27d%20like%20to%20know%20more%20about%20my%20visa." target="_blank" rel="noopener" class="lf-wa">Chat on WhatsApp now →</a>
      </div>
    </div>
  `;
  document.addEventListener('DOMContentLoaded', ()=>document.body.appendChild(overlay));
  // append immediately too in case DOMContentLoaded already fired
  if(document.readyState !== 'loading') document.body.appendChild(overlay);

  let lastFocus = null;
  function openLeadForm(prefillDestination, opts){
    opts = opts || {};
    if(!overlay.isConnected) document.body.appendChild(overlay);
    const formBody = overlay.querySelector('#lfFormBody');
    const success = overlay.querySelector('#lfSuccess');
    formBody.classList.remove('lf-hide');
    success.classList.remove('lf-show');
    const dest = overlay.querySelector('#lfDestination');
    if(prefillDestination && dest) dest.value = prefillDestination;
    const travellers = overlay.querySelector('#lfTravellers');
    const eyebrow = overlay.querySelector('#lfEyebrow');
    const title = overlay.querySelector('#lfTitle');
    const sub = overlay.querySelector('#lfSub');
    if(opts.group){
      eyebrow.textContent = 'Group booking';
      title.textContent = "Travelling as a group? Let's plan it together.";
      sub.textContent = 'Groups of 10 or more get dedicated handling and group rates. Tell us the headcount and we\'ll reply on WhatsApp within the hour.';
      if(travellers){ travellers.setAttribute('required',''); travellers.value = travellers.value || '10'; }
    } else {
      eyebrow.textContent = 'Start your journey';
      title.textContent = "Your next stamp is waiting. Let's go get it.";
      sub.textContent = 'Share a few details, and your specialist will reply on WhatsApp within the hour.';
      if(travellers){ travellers.removeAttribute('required'); }
    }
    if(travellers) travellers.classList.remove('lf-invalid');
    const err = overlay.querySelector('#lfTravellersErr'); if(err) err.classList.remove('lf-show');
    lastFocus = document.activeElement;
    document.body.style.overflow = 'hidden';
    overlay.classList.add('lf-open');
    setTimeout(()=>{ const first = opts.group ? travellers : overlay.querySelector('input[name="name"]'); if(first) first.focus(); }, 300);
  }
  function closeLeadForm(){
    overlay.classList.remove('lf-open');
    document.body.style.overflow = '';
    if(lastFocus && lastFocus.focus) lastFocus.focus();
  }
  window.openLeadForm = openLeadForm;
  window.closeLeadForm = closeLeadForm;

  document.addEventListener('click', function(e){
    const groupTrigger = e.target.closest('[data-lead-form-group]');
    if(groupTrigger){
      e.preventDefault();
      openLeadForm(undefined, {group:true});
      return;
    }
    const trigger = e.target.closest('[data-lead-form]');
    if(trigger){
      e.preventDefault();
      openLeadForm(trigger.getAttribute('data-lead-form') || undefined);
    }
    if(e.target === overlay) closeLeadForm();
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && overlay.classList.contains('lf-open')) closeLeadForm();
  });
  overlay.addEventListener('click', function(e){
    if(e.target.id === 'lfClose' || e.target.closest('#lfClose')) closeLeadForm();
  });
  overlay.addEventListener('input', function(e){
    if(e.target && e.target.id === 'lfTravellers'){
      const v = e.target.value;
      const err = overlay.querySelector('#lfTravellersErr');
      if(v !== '' && parseInt(v, 10) < 10){
        e.target.classList.add('lf-invalid');
        if(err) err.classList.add('lf-show');
      } else {
        e.target.classList.remove('lf-invalid');
        if(err) err.classList.remove('lf-show');
      }
    }
  });
  overlay.addEventListener('submit', function(e){
    if(e.target.id !== 'lfForm') return;
    e.preventDefault();
    const travellers = overlay.querySelector('#lfTravellers');
    const err = overlay.querySelector('#lfTravellersErr');
    if(travellers && travellers.value !== '' && parseInt(travellers.value, 10) < 10){
      travellers.classList.add('lf-invalid');
      if(err) err.classList.add('lf-show');
      travellers.focus();
      return;
    }
    if(travellers){ travellers.classList.remove('lf-invalid'); if(err) err.classList.remove('lf-show'); }
    const consent = overlay.querySelector('#lfConsent');
    const consentErr = overlay.querySelector('#lfConsentErr');
    if(consent && !consent.checked){
      if(consentErr) consentErr.classList.add('lf-show');
      consent.focus();
      return;
    }
    if(consentErr) consentErr.classList.remove('lf-show');
    const fd = new FormData(e.target);
    const name = (fd.get('name')||'').toString().trim();
    if(SHEET_ENDPOINT && SHEET_ENDPOINT.indexOf('PASTE_YOUR') !== 0){
      const params = new URLSearchParams();
      params.set('name', name);
      params.set('phone', (fd.get('phone')||'').toString().trim());
      params.set('email', (fd.get('email')||'').toString().trim());
      params.set('date', (fd.get('date')||'').toString().trim());
      params.set('destination', (fd.get('destination')||'').toString().trim());
      params.set('travellers', (fd.get('travellers')||'').toString().trim());
      params.set('groupBooking', overlay.querySelector('#lfEyebrow').textContent === 'Group booking' ? 'Yes' : 'No');
      params.set('sourcePage', window.location.pathname.split('/').pop() || 'home');
      fetch(SHEET_ENDPOINT, { method:'POST', mode:'no-cors', body: params })
        .catch(err => console.warn('Lead submission failed to reach the sheet:', err));
    } else {
      console.warn('Lead form: SHEET_ENDPOINT not configured yet, lead was not sent to Google Sheets. See google-apps-script-setup.txt');
    }
    overlay.querySelector('#lfFormBody').classList.add('lf-hide');
    const success = overlay.querySelector('#lfSuccess');
    overlay.querySelector('#lfSuccessName').textContent = name ? ', ' + name.split(' ')[0] : '';
    success.classList.add('lf-show');
  });
})();

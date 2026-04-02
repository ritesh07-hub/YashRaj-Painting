'use strict';

const RS = (() => {
  const K = {
    portfolio: 'rs_portfolio',
    inquiries: 'rs_inquiries',
    rates:     'rs_rates',
    session:   'rs_session',
    myids:     'rs_myinq_ids'
  };

  // Your personal contact info
  const CONTACT = {
    phone: '+91 8767506370',
    email: 'riteshgondhali77@gmail.com',
    location: 'Karad, Maharashtra'
  };

  const DEF_RATES = {
    'Interior':       12,
    'Exterior':       14,
    'Commercial':     16,
    'Texture Finish': 18,
    'Waterproofing':  22
  };

  const DEF_PORTFOLIO = [
    { id: _uid(), imageUrl: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg', title: 'Living Room Refresh',  description: 'Smooth even coats with clean edges and durable finish.' },
    { id: _uid(), imageUrl: 'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg', title: 'Bedroom Interior',     description: 'Soft neutral tones for a calm, restful atmosphere.' },
    { id: _uid(), imageUrl: 'https://images.pexels.com/photos/12291711/pexels-photo-12291711.jpeg', title: 'Exterior Facade',      description: 'Weather-ready exterior with neat wall lines.' },
    { id: _uid(), imageUrl: 'https://images.pexels.com/photos/5417293/pexels-photo-5417293.jpeg', title: 'Commercial Space',     description: 'Professional work with minimal disruption.' },
    { id: _uid(), imageUrl: 'https://images.pexels.com/photos/2440471/pexels-photo-2440471.jpeg', title: 'Texture Style',        description: 'Premium texture finish for a bold look.' },
    { id: _uid(), imageUrl: 'https://images.pexels.com/photos/4352247/pexels-photo-4352247.jpeg', title: 'Waterproofing Job',    description: 'Reliable surface prep and waterproofing approach.' }
  ];

  const DEF_INQ = [
    { id: _uid(), name:'Sagar Kulkarni', phone:'+91-90111 22334', email:'sagar@ex.com', workType:'Interior',  location:'Karad, Maharashtra',   areaSqft:950,  message:'Need interior painting for 2BHK.', createdAt: new Date(Date.now()-1000*60*60*26).toISOString(), status:'Pending'  },
    { id: _uid(), name:'Meera Patil',    phone:'+91-90222 33445', email:'meera@ex.com', workType:'Exterior',  location:'Karad, Maharashtra', areaSqft:1200, message:'Exterior painting for bungalow.',  createdAt: new Date(Date.now()-1000*60*60*8).toISOString(),  status:'Reviewed' }
  ];

  function _uid() {
    try { if (crypto.randomUUID) return crypto.randomUUID(); } catch(_) {}
    return 'id_' + Math.random().toString(16).slice(2) + '_' + Date.now().toString(16);
  }

  function load(k, fb) {
    try { const v = JSON.parse(localStorage.getItem(k)); return v ?? fb; } catch(_) { return fb; }
  }
  function save(k, v) { localStorage.setItem(k, JSON.stringify(v)); }

  function seed() {
    if (!localStorage.getItem(K.portfolio)) save(K.portfolio, DEF_PORTFOLIO);
    if (!localStorage.getItem(K.inquiries)) save(K.inquiries, DEF_INQ);
    if (!localStorage.getItem(K.rates))     save(K.rates, { ...DEF_RATES });
  }

  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  }
  function fmtDate(iso) {
    try { return new Date(iso).toLocaleString(undefined,{year:'numeric',month:'short',day:'2-digit',hour:'2-digit',minute:'2-digit'}); } catch(_) { return iso; }
  }
  function uid() { return _uid(); }
  function statusClass(s) { if(s==='Reviewed')return'reviewed';if(s==='Contacted')return'contacted';return'pending'; }

  function getSession()  { return load(K.session, null); }
  function setSession(v) { if(!v) localStorage.removeItem(K.session); else save(K.session, v); }
  function getPortfolio()  { return load(K.portfolio, []); }
  function setPortfolio(v) { save(K.portfolio, v); }
  function getInquiries()  { return load(K.inquiries, []); }
  function setInquiries(v) { save(K.inquiries, v); }
  function getRates()      { return load(K.rates, {...DEF_RATES}); }
  function setRates(v)     { save(K.rates, v); }
  function getMyIds()      { try { return JSON.parse(sessionStorage.getItem(K.myids)) || []; } catch(_) { return []; } }
  function pushMyId(id)    { const a=getMyIds(); if(!a.includes(id)){a.push(id);sessionStorage.setItem(K.myids,JSON.stringify(a));} }

  function addInquiry(p)   { const a=getInquiries(); a.push(p); setInquiries(a); }
  function validateInq(p)  {
    for (const k of ['name','phone','email','workType','location','message']) {
      if (!p[k] || !String(p[k]).trim()) return { ok:false, msg:'Please fill in: '+k };
    }
    return { ok: true };
  }

  function showNotice(el, type, title, msg) {
    el.classList.add('show');
    el.classList.remove('success','error');
    el.classList.add(type);
    const t = el.querySelector('.n-title'); if(t) t.textContent = title || '';
    const m = el.querySelector('.n-msg');   if(m) m.textContent = msg   || '';
  }
  function hideNotice(el) { el.classList.remove('show','success','error'); }

  function injectHeader(activePage) {
    const el = document.getElementById('site-header');
    if (!el) return;
    const s = getSession();
    const loginBtn  = s ? '' : `<button class="btn-ghost" onclick="RS.goLogin()">Login</button>`;
    const logoutBtn = s ? `<button class="btn-ghost" onclick="RS.logout()">Logout</button>` : '';
    el.innerHTML = `
      <div class="announce"><em>✨ Free site visit for projects above 500 sq ft</em> — Call ${CONTACT.phone}</div>
      <header class="site-header">
        <div class="header-inner">
          <a class="logo" href="index.html">
            <div class="logo-mark">
              <svg viewBox="0 0 24 24" fill="none"><path d="M7 14l10-10 3 3-10 10H7v-3z" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"/><path d="M4 20h16" stroke="#f0c040" stroke-width="2" stroke-linecap="round"/></svg>
            </div>
            <div class="logo-words"><h1>Yashraj Painting</h1><p>Painting Contractors</p></div>
          </a>
          <nav class="site-nav">
            <a href="index.html" ${activePage==='home'?'class="active"':''}>Home</a>
            <a href="index.html#sec-work" ${activePage==='work'?'class="active"':''}>Our Work</a>
            <a href="index.html#sec-services" ${activePage==='services'?'class="active"':''}>Services</a>
            <a href="index.html#sec-rates" ${activePage==='rates'?'class="active"':''}>Rates</a>
            <a href="index.html#sec-contact" ${activePage==='contact'?'class="active"':''}>Contact</a>
          </nav>
          <div class="nav-actions">
            ${loginBtn}${logoutBtn}
            <a class="btn-red" href="quote.html">Get a Quote</a>
          </div>
        </div>
      </header>`;
  }

  function injectFooter() {
    const el = document.getElementById('site-footer');
    if (!el) return;
    el.innerHTML = `
      <footer class="site-footer">
        <div class="footer-inner">
          <div class="footer-brand">Yashraj Painting Contractors</div>
          <div class="footer-links">
            <a href="index.html">Home</a>
            <a href="portfolio.html">Portfolio</a>
            <a href="quote.html">Get a Quote</a>
            <a href="login.html">Login</a>
          </div>
          <div class="footer-copy">© ${new Date().getFullYear()} Yashraj Painting. ${CONTACT.location}.</div>
        </div>
      </footer>`;
  }

  function goLogin()  { window.location.href = 'login.html'; }
  function logout()   {
    setSession(null);
    sessionStorage.removeItem(K.myids);
    window.location.href = 'index.html';
  }
  function requireAdmin() {
    const s = getSession();
    if (!s || s.role !== 'admin') { window.location.href = 'login.html'; return false; }
    return true;
  }
  function requireUser() {
    const s = getSession();
    if (!s || (s.role !== 'user' && s.role !== 'admin')) { window.location.href = 'login.html'; return false; }
    return true;
  }

  return { seed, esc, fmtDate, uid, statusClass, getSession, setSession, getPortfolio, setPortfolio, getInquiries, setInquiries, getRates, setRates, getMyIds, pushMyId, addInquiry, validateInq, showNotice, hideNotice, injectHeader, injectFooter, goLogin, logout, requireAdmin, requireUser, DEF_RATES, DEF_PORTFOLIO, CONTACT };
})();

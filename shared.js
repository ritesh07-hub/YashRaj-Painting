'use strict';

const RS = (() => {
  const K = {
    portfolio: 'rs_portfolio',
    inquiries: 'rs_inquiries',
    rates:     'rs_rates',
    session:   'rs_session',
    myids:     'rs_myinq_ids'
  };

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

  function _uid() {
    try { if (crypto.randomUUID) return crypto.randomUUID(); } catch(_) {}
    return 'id_' + Math.random().toString(16).slice(2) + '_' + Date.now().toString(16);
  }

  // ✅ ONLY YOUR 6 IMAGES
  const DEF_PORTFOLIO = [
    { id: _uid(), imageUrl: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg', title: 'Living Room Refresh', description: 'Smooth even coats with clean edges and durable finish.' },
    { id: _uid(), imageUrl: 'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg', title: 'Bedroom Interior', description: 'Soft neutral tones for a calm, restful atmosphere.' },
    { id: _uid(), imageUrl: 'https://images.pexels.com/photos/12291711/pexels-photo-12291711.jpeg', title: 'Exterior Facade', description: 'Weather-ready exterior with neat wall lines.' },
    { id: _uid(), imageUrl: 'https://images.pexels.com/photos/5417293/pexels-photo-5417293.jpeg', title: 'Commercial Space', description: 'Professional work with minimal disruption.' },
    { id: _uid(), imageUrl: 'https://images.pexels.com/photos/2440471/pexels-photo-2440471.jpeg', title: 'Texture Style', description: 'Premium texture finish for a bold look.' },
    { id: _uid(), imageUrl: 'https://images.pexels.com/photos/4352247/pexels-photo-4352247.jpeg', title: 'Waterproofing Job', description: 'Reliable surface prep and waterproofing approach.' }
  ];

  const DEF_INQ = [
    { id: _uid(), name:'Sagar Kulkarni', phone:'+91-90111 22334', email:'sagar@ex.com', workType:'Interior', location:'Karad, Maharashtra', areaSqft:950, message:'Need interior painting for 2BHK.', createdAt: new Date(Date.now()-1000*60*60*26).toISOString(), status:'Pending' },
    { id: _uid(), name:'Meera Patil', phone:'+91-90222 33445', email:'meera@ex.com', workType:'Exterior', location:'Karad, Maharashtra', areaSqft:1200, message:'Exterior painting for bungalow.', createdAt: new Date(Date.now()-1000*60*60*8).toISOString(), status:'Reviewed' }
  ];

  function load(k, fb) {
    try { const v = JSON.parse(localStorage.getItem(k)); return v ?? fb; } catch(_) { return fb; }
  }

  function save(k, v) {
    localStorage.setItem(k, JSON.stringify(v));
  }

  // 🔥 FIXED: Always overwrite old data
  function seed() {
    save(K.portfolio, DEF_PORTFOLIO);
    save(K.inquiries, DEF_INQ);
    save(K.rates, { ...DEF_RATES });
  }

  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  }

  function fmtDate(iso) {
    try {
      return new Date(iso).toLocaleString(undefined,{
        year:'numeric',month:'short',day:'2-digit',
        hour:'2-digit',minute:'2-digit'
      });
    } catch(_) { return iso; }
  }

  function uid() { return _uid(); }

  function statusClass(s) {
    if(s==='Reviewed') return 'reviewed';
    if(s==='Contacted') return 'contacted';
    return 'pending';
  }

  function getSession() { return load(K.session, null); }
  function setSession(v) { if(!v) localStorage.removeItem(K.session); else save(K.session, v); }

  function getPortfolio() { return load(K.portfolio, []); }
  function setPortfolio(v) { save(K.portfolio, v); }

  function getInquiries() { return load(K.inquiries, []); }
  function setInquiries(v) { save(K.inquiries, v); }

  function getRates() { return load(K.rates, {...DEF_RATES}); }
  function setRates(v) { save(K.rates, v); }

  function getMyIds() {
    try { return JSON.parse(sessionStorage.getItem(K.myids)) || []; }
    catch(_) { return []; }
  }

  function pushMyId(id) {
    const a = getMyIds();
    if(!a.includes(id)){
      a.push(id);
      sessionStorage.setItem(K.myids, JSON.stringify(a));
    }
  }

  function addInquiry(p) {
    const a = getInquiries();
    a.push(p);
    setInquiries(a);
  }

  function validateInq(p) {
    for (const k of ['name','phone','email','workType','location','message']) {
      if (!p[k] || !String(p[k]).trim()) {
        return { ok:false, msg:'Please fill in: '+k };
      }
    }
    return { ok:true };
  }

  function goLogin() { window.location.href = 'login.html'; }

  function logout() {
    setSession(null);
    sessionStorage.removeItem(K.myids);
    window.location.href = 'index.html';
  }

  function requireAdmin() {
    const s = getSession();
    if (!s || s.role !== 'admin') {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }

  function requireUser() {
    const s = getSession();
    if (!s || (s.role !== 'user' && s.role !== 'admin')) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }

  return {
    seed,
    esc,
    fmtDate,
    uid,
    statusClass,
    getSession,
    setSession,
    getPortfolio,
    setPortfolio,
    getInquiries,
    setInquiries,
    getRates,
    setRates,
    getMyIds,
    pushMyId,
    addInquiry,
    validateInq,
    goLogin,
    logout,
    requireAdmin,
    requireUser,
    DEF_RATES,
    DEF_PORTFOLIO,
    CONTACT
  };
})();

const B = document.body.dataset, ROOT = B.root || '', $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const store = (k, v) => { try { return v === undefined ? localStorage.getItem(k) : localStorage.setItem(k, v); } catch { return null; } };

const T = {
  es: { contact: 'Contacto', projects: 'Proyectos', all: 'Todos los proyectos', more: 'Más proyectos', github: 'Git Hub', link: 'Link',
        home: '← Inicio', other: 'English', phone: 'Teléfono', mail: 'Mail', cv: 'CV personal', empty: 'Todavía no hay proyectos.' },
  en: { contact: 'Contact', projects: 'Projects', all: 'All projects', more: 'More projects', github: 'Git Hub', link: 'Link',
        home: '← Home', other: 'Español', phone: 'Phone', mail: 'Email', cv: 'Personal CV', empty: 'No projects yet.' },
};
const ICON = {
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  whatsapp: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/><g transform="translate(7.2 6.9) scale(.4)" stroke-width="3.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></g>',
  github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
  mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  cv: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>',
  instagram: '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
};
let lang = B.lang || new URLSearchParams(location.search).get('lang') || store('lang') || (navigator.language.startsWith('es') ? 'es' : 'en');
if (!T[lang]) lang = 'es';
store('lang', lang);
document.documentElement.lang = lang;
const t = T[lang], other = lang === 'es' ? 'en' : 'es';
const loc = (v) => (v && typeof v === 'object' ? v[lang] || v.es || v.en || '' : v || '');
const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return ''; } };
const handle = (u) => { try { return '@' + new URL(u).pathname.split('/').filter(Boolean)[0]; } catch { return ''; } };
const setBtn = (sel, text, href) => { const a = $(sel); if (!a) return; a.firstElementChild.textContent = text; if (href) a.href = href; };

// botón hexagonal grande: título + subtítulo (o botón deshabilitado si no hay link)
const hexBtn = (href, label, sub, ext) => href
  ? `<a class="hex btn lg" href="${esc(href)}"${ext ? ' target="_blank" rel="noopener"' : ''}><span><b>${esc(label)}</b><small>${esc(sub)}</small></span></a>`
  : `<span class="hex btn lg" aria-disabled="true"><span><b>${esc(label)}</b><small>${esc(sub)}</small></span></span>`;

function card(p) {
  const title = loc(p.title);
  const media = p.image ? `<img src="${esc(ROOT + p.image)}" alt="${esc(title)}" loading="lazy">` : `<div>${esc(title)}</div>`;
  const page = p.page && (p.pageInternal ? ROOT + p.page : p.page);
  return `<li><article class="card chamf"><div class="cin"><div class="media chamf">${media}</div>
    <div class="acts">${hexBtn(page, t.link, p.pageInternal ? '' : host(p.page), !p.pageInternal)}${hexBtn(p.github, t.github, handle(p.github), true)}</div>
    <h3>${esc(title)}</h3><p class="info">${esc(loc(p.description))}</p></div></article></li>`;
}

function contact(c = {}) {
  const cvp = c.cv && (typeof c.cv === 'string' ? c.cv : c.cv[lang]);
  const cv = cvp && (/^https?:/.test(cvp) ? cvp : ROOT + cvp);
  const url = (v, base) => (/^https?:/.test(v) ? v : base + v);
  const items = [
    c.phone && ['phone', t.phone, 'tel:' + c.phone.replace(/[^\d+]/g, '')],
    c.whatsapp && ['whatsapp', 'WhatsApp', /^https?:/.test(c.whatsapp) ? c.whatsapp : 'https://wa.me/' + String(c.whatsapp).replace(/\D/g, '')],
    c.github && ['github', 'GitHub', c.github],
    c.email && ['mail', t.mail, 'mailto:' + c.email],
    cv && ['cv', t.cv, cv],
    c.instagram && ['instagram', 'Instagram', url(c.instagram.replace(/^@/, ''), 'https://instagram.com/')],
  ].filter(Boolean);
  return items.map(([k, l, u]) =>
    `<a class="hex ic" href="${esc(u)}" aria-label="${esc(l)}" title="${esc(l)}"><span><svg viewBox="0 0 24 24" aria-hidden="true">${ICON[k]}</svg></span></a>`).join('')
    + (c.github ? hexBtn(c.github, t.github, handle(c.github), true) : '');
}

(async () => {
  const [site, projects] = await Promise.all([
    fetch(ROOT + 'site.json').then((r) => r.json()).catch(() => ({})),
    fetch(ROOT + 'projects.json').then((r) => r.json()).catch(() => []),
  ]);
  const home = B.page === 'home';
  $('#word').textContent = site.name || '';
  document.title = site.name || 'Portfolio';
  setBtn('#switch', t.other, home ? `${ROOT}${other}/` : `?lang=${other}`);
  $('#projects-title').textContent = home ? t.projects : t.all;
  setBtn('#back', t.home, `${ROOT}${lang}/`);

  if (home) {
    $('#role').textContent = loc(site.role);
    $('#bio').textContent = loc(site.bio);
    $('#contact-title').textContent = t.contact;
    $('#contact').innerHTML = contact(site.contact);
    setBtn('#more', t.more, `${ROOT}proyects/?lang=${lang}`);
  }
  const shown = home ? projects.slice(0, 3) : projects; // ya vienen ordenados: más recientes primero
  $('#list').innerHTML = shown.map(card).join('');
  $('#empty').textContent = shown.length ? '' : t.empty;
})();

// Pulls all editable content from content.json and fills in both pages.
// Edit content.json directly, or through /admin (Decap CMS), to change
// text, prices, hours, and images — no HTML editing required.

async function loadContent() {
  const res = await fetch('content.json');
  return res.json();
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined) el.textContent = value;
}

function setHref(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined) el.setAttribute('href', value);
}

function portraitBlock(hero) {
  if (hero.portrait_image) {
    return `<img src="${hero.portrait_image}" alt="${hero.portrait_caption || ''}" style="width:100%;height:100%;object-fit:cover;">
      <div class="frame-label">${hero.portrait_caption || ''}</div>`;
  }
  return `<span class="initials">${hero.portrait_initials || ''}</span>
    <div class="frame-label">${hero.portrait_caption || ''}</div>`;
}

function galleryItem(item) {
  const bg = item.image
    ? `background-image:url('${item.image}');background-size:cover;background-position:center;`
    : '';
  return `
    <div class="gallery-item reveal in" data-cat="${item.cat}" style="${bg}">
      <div class="cap">${item.title}<small>${item.cat_label}</small></div>
    </div>`;
}

async function renderIndex() {
  const c = await loadContent();

  document.querySelectorAll('[data-book-link]').forEach(el => el.setAttribute('href', c.business.booking_url));
  document.querySelectorAll('[data-tel-link]').forEach(el => el.setAttribute('href', `tel:${c.business.phone_link}`));

  setText('js-eyebrow', c.hero.eyebrow);
  setText('js-heading1', c.hero.heading_line1);
  setText('js-heading2', c.hero.heading_line2);
  setText('js-subheading', c.hero.subheading);
  const portrait = document.getElementById('js-portrait');
  if (portrait) portrait.innerHTML = portraitBlock(c.hero);

  setText('js-about-quote', c.about.quote);
  setText('js-about-p1', c.about.paragraph1);
  setText('js-about-p2', c.about.paragraph2);
  const statRow = document.getElementById('js-stats');
  if (statRow) {
    statRow.innerHTML = c.about.stats.map(s =>
      `<div class="stat"><b>${s.number}</b><span>${s.label}</span></div>`
    ).join('');
  }

  const menu = document.getElementById('js-menu');
  if (menu) {
    menu.innerHTML = c.services.map(s => `
      <div class="menu-row reveal in">
        <div class="menu-row-main">
          <span class="menu-name">${s.name}</span>
          <span class="menu-desc">${s.desc}</span>
        </div>
        <span class="menu-fill"></span>
        <span class="menu-price">${s.price}</span>
      </div>`).join('');
  }

  setText('js-testimonial-quote', `"${c.testimonial.quote}"`);
  setText('js-testimonial-cite', c.testimonial.cite);

  setText('js-address1', c.business.address_line1);
  setText('js-address2', c.business.address_line2);
  setHref('js-phone-link', `tel:${c.business.phone_link}`);
  setText('js-phone-text', c.business.phone_display);
  setHref('js-whatsapp-link', `https://wa.me/${c.business.whatsapp_link}`);
  setText('js-whatsapp-text', `WhatsApp: ${c.business.phone_display}`);
  setHref('js-email-link', `mailto:${c.business.email}`);
  setText('js-email-text', c.business.email);

  const hours = document.getElementById('js-hours');
  if (hours) {
    hours.innerHTML = c.hours.map(h =>
      `<div class="hours-row"><span>${h.day}</span><span>${h.time}</span></div>`
    ).join('');
  }
}

async function renderWork() {
  const c = await loadContent();
  document.querySelectorAll('[data-book-link]').forEach(el => el.setAttribute('href', c.business.booking_url));

  const grid = document.getElementById('js-gallery');
  if (grid) grid.innerHTML = c.gallery.map(galleryItem).join('');

  // re-apply filter behavior to freshly rendered items
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      document.querySelectorAll('.gallery-item').forEach(item => {
        item.style.display = (f === 'all' || item.dataset.cat === f) ? '' : 'none';
      });
    });
  });
}

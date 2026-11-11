import './style.css'
import config from './config.json'

const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5"/></svg>'
const book = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 5v15M12 5C9 3 5 3 2 4v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1Z"/></svg>'
const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
const count = config.categories.reduce((total, category) => total + category.items.length, 0)
const number = (value) => String(value).padStart(2, '0')

// File paths are relative to public/download; encode each segment for spaces and Unicode.
function downloadUrl(file) {
  const parts = file.split('/')
  if (parts.some((part) => !part || part === '.' || part === '..' || part.includes('\\'))) {
    throw new Error(`Lokasi download tidak valid: ${file}`)
  }
  return `${import.meta.env.BASE_URL}download/${parts.map(encodeURIComponent).join('/')}`
}

function renderItem(item) {
  const metadata = [item.format, item.size, item.version].filter(Boolean)
  const url = item.url ? new URL(item.url) : null
  if (url && url.protocol !== 'https:') {
    throw new Error(`URL download harus menggunakan HTTPS: ${item.url}`)
  }
  const href = url ? url.href : downloadUrl(item.file)
  const linkLabel = item.linkLabel || 'Unduh'
  return `<li class="download-row">
    <div class="file-info"><h3>${escape(item.name)}</h3><p>${escape(item.description || '')}</p>
    ${metadata.length ? `<div class="file-meta">${metadata.map(escape).join('<span aria-hidden="true"> / </span>')}</div>` : ''}</div>
    <a class="download-link" href="${escape(href)}"${url ? '' : ' download'} aria-label="${escape(linkLabel)} ${escape(item.name)}">${escape(linkLabel)} ${arrow}</a>
  </li>`
}

document.title = config.title
document.querySelector('meta[name="description"]').content = config.intro

document.querySelector('#app').innerHTML = `
  <a class="skip-link" href="#koleksi">Langsung ke koleksi</a>
  <div class="page-shell">
    <header class="site-header">
      <a class="wordmark" href="#" aria-label="${escape(config.title)} — beranda">${book}<span>${escape(config.brand)}<span class="wordmark-dot">.</span></span></a>
      <a class="header-link" href="#koleksi">Direktori unduhan <span aria-hidden="true">↙</span></a>
    </header>
    <main>
      <section class="intro" aria-labelledby="page-title">
        <div class="eyebrow"><span class="status-dot" aria-hidden="true"></span> TERBUKA UNTUK SEMUA</div>
        <h1 id="page-title">${escape(config.title)}<span class="title-dot" aria-hidden="true">.</span></h1>
        <div class="intro-bottom"><p>${escape(config.intro)}</p><a class="browse-link" href="#koleksi">Lihat koleksi <span aria-hidden="true">↓</span></a></div>
      </section>
      <div class="collection-bar" id="koleksi"><span>KOLEKSI</span><span>${number(count)} FILE <span class="bar-divider">/</span> ${number(config.categories.length)} KATEGORI</span></div>
      <nav class="category-nav" aria-label="Kategori unduhan">${config.categories.map((category, index) => `<a href="#${escape(category.id)}"><span>${number(index + 1)}</span>${escape(category.title)}<span class="nav-count">${category.items.length}</span></a>`).join('')}</nav>
      <div class="categories">${config.categories.map((category, index) => `
        <section class="category" id="${escape(category.id)}" aria-labelledby="heading-${escape(category.id)}">
          <div class="category-heading"><span class="section-number">${number(index + 1)}</span><h2 id="heading-${escape(category.id)}">${escape(category.title)}</h2><p>${escape(category.description)}</p></div>
          <div class="category-content">${category.items.length ? `<ul class="download-list">${category.items.map(renderItem).join('')}</ul>` : `<div class="empty-state"><span class="empty-line" aria-hidden="true"></span><p>${escape(category.emptyText)}</p><span class="empty-label">BELUM ADA FILE</span></div>`}</div>
        </section>`).join('')}</div>
      <aside class="reading-note">${book}<p>Siapkan perangkatnya.<br><span>Sisakan waktu untuk membacanya.</span></p></aside>
    </main>
    <footer><span>${escape(config.footer)}</span><a href="#">Kembali ke atas <span aria-hidden="true">↑</span></a></footer>
  </div>
`

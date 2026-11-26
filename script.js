// ===== DATA & STATUS =====
// S = semua data website (dari data.json, atau cadangan di index.html)
// A = status admin (true kalau sudah login)
let BASE = document.getElementById('st').textContent, S, A = false, dirty = false;
const PV = {}, LS = k => { try {
    return localStorage.getItem(k);
}
catch (e) {
    return null;
} };
function load(t) { BASE = t; S = JSON.parse(t); try {
    const o = JSON.parse(LS('smprk-data') || 'null');
    if (o && o.b === BASE)
        S = o.d;
}
catch (e) { } S.t = S.t || {}; S.menu = S.menu || {}; S.hide = S.hide || {}; }
load(BASE);

// ===== PENGATURAN MENU =====
const TABS = [['beranda', 'Beranda'], ['profil', 'Profil'], ['kelas', 'Data Sekolah'], ['prestasi', 'Prestasi'], ['galeri', 'Galeri'], ['sambutan', 'Sambutan'], ['ekskul', 'Ekskul'], ['berita', 'Berita'], ['kontak', 'Kontak']];

// ===== FUNGSI BANTU =====
const $ = s => document.querySelector(s), esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const PH = t => 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="800" height="500" fill="#8a1c2b"/><text x="400" y="260" fill="#fff" font-size="30" text-anchor="middle" font-family="Georgia">${t}</text></svg>`);
const tab = () => (location.hash || '#beranda').slice(1);
const E = (p, v) => `<span data-p="${p}" contenteditable="${A}">${esc(v)}</span>`;
const IM = (p, v, c, t) => `<img class="${c}" data-i="${p}" src="${esc(PV[v] || v || PH(t || 'Klik untuk ganti foto'))}" alt="Foto sekolah">`;
function setP(p, v) { const k = p.split('.'); let o = S; k.slice(0, -1).forEach(x => o = o[x]); o[k.at(-1)] = v; dirty = true; }

// ===== TAMPILAN HALAMAN (satu per menu) =====
function view() {
    const t = tab();
    if (t == 'beranda')
        return `<div class="hero">${IM('hero', S.hero, '', 'Foto Gedung Sekolah')}<div class="t"><h1>${E('name', S.name)}</h1><div>${E('tag', S.tag)}</div><p><a href="#profil"><button>Lihat Profil</button></a> <a href="#kontak"><button class="g" style="color:#fff;border-color:#fff">Hubungi Kami</button></a></p></div></div>
<div class="grid">${S.stats.map((s, i) => `<div class="card stat"><b>${E('stats.' + i + '.1', s[1])}</b><span>${E('stats.' + i + '.0', s[0])}</span>${A ? `<br><button class="d" onclick="del('stats',${i})">×</button>` : ''}</div>`).join('')}</div>
${A ? `<p><button onclick="add('stats',['Label','0'])">+ Angka</button></p>` : ''}<h2>Tentang Sekolah</h2><p>${E('about', S.about)}</p>`;
    if (t == 'sambutan')
        return sambV();
    if (t == 'ekskul')
        return ekV();
    if (t == 'berita')
        return brV();
    if (t == 'profil')
        return `<h2>Visi</h2><div class="card">${E('visi', S.visi)}</div><h2>Misi</h2><div class="card"><ol>${S.misi.map((m, i) => `<li>${E('misi.' + i, m)} ${A ? `<button class="d" onclick="del('misi',${i})">×</button>` : ''}</li>`).join('')}</ol>${A ? `<button onclick="add('misi','Misi baru')">+ Misi</button>` : ''}</div>`;
    if (t == 'kelas')
        return dataView();
    if (t == 'kelas_old')
        return `<h2>Data Kelas</h2><div class="wrap"><table><tr><th>Tingkat</th><th>Jumlah Rombel</th><th>Jumlah Siswa</th>${A ? '<th></th>' : ''}</tr>${S.kelas.map((r, i) => `<tr>${r.map((c, j) => `<td>${E('kelas.' + i + '.' + j, c)}</td>`).join('')}${A ? `<td><button class="d" onclick="del('kelas',${i})">×</button></td>` : ''}</tr>`).join('')}</table></div>${A ? `<p><button onclick="add('kelas',['X','1','30'])">+ Baris</button></p>` : ''}`;
    if (t == 'prestasi')
        return `<h2>Prestasi</h2>${S.prestasi.map((r, i) => `<div class="pr card"><div class="y">${E('prestasi.' + i + '.0', r[0])}</div><div><b>${E('prestasi.' + i + '.1', r[1])}</b><br>${E('prestasi.' + i + '.2', r[2])}</div>${A ? `<button class="d" onclick="del('prestasi',${i})">×</button>` : ''}</div>`).join('')}${A ? `<button onclick="add('prestasi',['2026','Prestasi baru','Tingkat'])">+ Prestasi</button>` : ''}`;
    if (t == 'galeri')
        return `<h2>Galeri</h2><div class="gal">${S.galeri.map((g, i) => `<div>${IM('galeri.' + i, g, '', 'Foto ' + (i + 1))}${A ? `<button class="d" onclick="del('galeri',${i})">Hapus</button>` : ''}</div>`).join('')}</div>${A ? `<p><button onclick="add('galeri','')">+ Foto</button></p>` : ''}`;
    return `<h2>Kontak</h2><div class="card"><p>📍 ${E('kontak.0', S.kontak[0])}</p><p>📞 ${E('kontak.1', S.kontak[1])}</p><p>✉️ ${E('kontak.2', S.kontak[2])}</p></div><div class="card" style="margin-top:12px"><b>Lokasi</b><p style="color:var(--mu)">Lintang 3,5546 · Bujur 98,8847</p><iframe src="https://www.openstreetmap.org/export/embed.html?bbox=98.8797,3.5496,98.8897,3.5596&marker=3.5546,98.8847" style="width:100%;height:300px;border:0;border-radius:10px" loading="lazy" title="Peta lokasi sekolah"></iframe><p><a href="https://www.google.com/maps?q=3.5546,98.8847" target="_blank" rel="noopener"><button>Buka di Google Maps</button></a></p></div>`;
}
function dataView() { return '<h2>Data Sekolah</h2>' + charts() + S.tabel.map((t, i) => `<h3>${E('tabel.' + i + '.j', t.j)}</h3><div class="wrap"><table><tr>${t.h.map((h, k) => `<th>${E('tabel.' + i + '.h.' + k, h)}</th>`).join('')}${A ? '<th></th>' : ''}</tr>${t.r.map((r, j) => `<tr>${r.map((c, k) => `<td>${E('tabel.' + i + '.r.' + j + '.' + k, c)}</td>`).join('')}${A ? `<td><button class="d" onclick="delRow(${i},${j})">×</button></td>` : ''}</tr>`).join('')}</table></div>${A ? `<p><button onclick="addRow(${i})">+ Baris</button></p>` : ''}`).join(''); }

// ===== TAMBAH / HAPUS ITEM (mode admin) =====
function addRow(i) { S.tabel[i].r.push(S.tabel[i].h.map(() => '-')); dirty = true; R(); }
function delRow(i, j) { S.tabel[i].r.splice(j, 1); dirty = true; R(); }

// ===== MENU TAMBAHAN: Sambutan, Ekskul, Berita =====
function sambV() { const s = S.sambutan; return `<h2>Sambutan Kepala Sekolah</h2><div class="card kp">${IM('sambutan.foto', s.foto, 'pimg', 'Foto Kepala Sekolah')}<div><p>${E('sambutan.teks', s.teks)}</p><b>${E('sambutan.nama', s.nama)}</b><br><span style="color:var(--mu)">Kepala Sekolah</span></div></div>`; }
function ekV() { return `<h2>Ekstrakurikuler</h2><div class="grid">${S.ekskul.map((r, i) => `<div class="card"><div style="font-size:30px">${E('ekskul.' + i + '.0', r[0])}</div><b>${E('ekskul.' + i + '.1', r[1])}</b><br><span style="color:var(--mu)">${E('ekskul.' + i + '.2', r[2])}</span>${A ? `<br><button class="d" onclick="del('ekskul',${i})">Hapus</button>` : ''}</div>`).join('')}</div>${A ? `<button onclick="add('ekskul',['⭐','Ekskul baru','Deskripsi'])">+ Ekskul</button>` : ''}`; }
function brV() { return `<h2>Berita dan Kegiatan</h2>${A ? `<p><button onclick="add('berita',['Tanggal','Judul berita','Isi singkat berita.',''])">+ Tambah berita baru</button></p>` : ''}<div class="gal">${S.berita.map((r, i) => `<div class="card">${IM('berita.' + i + '.3', r[3], 'pimg', 'Foto Kegiatan')}<small style="color:var(--mu)">${E('berita.' + i + '.0', r[0])}</small><h3>${E('berita.' + i + '.1', r[1])}</h3><p>${E('berita.' + i + '.2', r[2])}</p>${A ? `<button class="d" onclick="del('berita',${i})">Hapus</button>` : ''}</div>`).join('')}</div>${A ? `<p><button onclick="add('berita',['Tanggal','Judul berita','Isi singkat berita.',''])">+ Berita</button></p>` : ''}`; }

// ===== GRAFIK, LIGHTBOX, ANIMASI =====
function charts() { if (!(S.tabel[1] && S.tabel[2]))
    return ''; const u = S.tabel[1].r, a = S.tabel[2].r, c = ['#8a1c2b', '#c9a24b', '#3b7d6b', '#5b6fb5', '#999']; const tot = a.reduce((s, r) => s + (+r[3] || 0), 0) || 1; let off = 0; const arcs = a.map((r, i) => { const v = (+r[3] || 0) / tot * 100; const e = `<circle cx="60" cy="60" r="40" fill="none" stroke="${c[i % 5]}" stroke-width="22" pathLength="100" stroke-dasharray="${v} ${100 - v}" stroke-dashoffset="${-off}" transform="rotate(-90 60 60)"/>`; off += v; return e; }).join(''); const mx = Math.max(...u.map(r => +r[1] || 0), 1); return `<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))"><div class="card"><b>Siswa menurut agama</b><div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap"><svg viewBox="0 0 120 120" width="140">${arcs}</svg><div>${a.map((r, i) => `<div><span style="color:${c[i % 5]}">●</span> ${esc(r[0])}: ${esc(r[3])}</div>`).join('')}</div></div></div><div class="card"><b>Siswa menurut usia</b>${u.map(r => `<div style="display:flex;align-items:center;gap:8px;font:13px system-ui"><span style="width:60px">${esc(r[0])}</span><span style="height:14px;border-radius:4px;background:var(--pr);width:${(+r[1] || 0) / mx * 60}%"></span>${esc(r[1])}</div>`).join('')}</div></div>`; }
function lb(i) { const L = S.galeri.map((g, k) => g ? k : -1).filter(k => k >= 0); let n = L.indexOf(i); const show = () => { $('#md').innerHTML = `<div class="modal" onclick="if(event.target==this)$('#md').innerHTML=''" style="background:rgba(0,0,0,.88);display:flex;gap:12px;align-items:center;justify-content:center"><button class="g" style="color:#fff" onclick="lbn(-1)">‹</button><img src="${S.galeri[L[n]]}" alt="Foto galeri" style="max-width:75vw;max-height:80vh;border-radius:10px"><button class="g" style="color:#fff" onclick="lbn(1)">›</button></div>`; }; window.lbn = d => { n = (n + d + L.length) % L.length; show(); }; show(); }
function fx() { document.documentElement.style.setProperty('--pr', S.warna || ''); document.title = S.name; const lk = document.querySelector('link[rel=icon]'); if (lk && S.logo)
    lk.href = S.logo; document.querySelectorAll('main h2:not([data-p])').forEach((h, i) => { const k = tab() + '_' + i; if (S.t[k] != null)
    h.textContent = S.t[k]; if (A) {
    h.dataset.p = 't.' + k;
    h.contentEditable = true;
} }); if (A)
    return; const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) {
    e.target.classList.add('in');
    io.unobserve(e.target);
} }), { threshold: .1 }); document.querySelectorAll('main .card,main h2,main h3,main>p,main .gal>div').forEach((n, i) => { n.classList.add('rv'); n.style.transitionDelay = (i % 4 * 90) + 'ms'; io.observe(n); }); document.querySelectorAll('.stat b span').forEach(s => { const v = parseInt(s.textContent.replace(/\D/g, '')); if (!v || s.textContent.trim() != String(v))
    return; const t0 = performance.now(); (function f(t) { const k = Math.min(1, (t - t0) / 1200); s.textContent = Math.round(v * k); if (k < 1)
    requestAnimationFrame(f); })(t0); }); }
function crop(file, ratio, done, opt = {}) { const im = new Image(); im.onload = () => { const W = 320, H = Math.round(W / ratio), b = Math.max(W / im.width, H / im.height); let z = 1, ox = (W - im.width * b) / 2, oy = (H - im.height * b) / 2, dr = null; $('#md').innerHTML = `<div class="modal"><div class="box"><b>Atur potongan foto</b><canvas id="cv" width="${W}" height="${H}" style="width:100%;touch-action:none;cursor:grab;border-radius:8px"></canvas><small>Geser foto, atur zoom dengan slider.</small><input type="range" id="zm" min="1" max="3" step="0.01" value="1"><div style="display:flex;gap:8px"><button id="ok">Gunakan</button><button class="g" id="no">Batal</button></div></div></div>`; const cv = $('#cv'), draw = () => { const s = b * z, w = im.width * s, h = im.height * s; ox = Math.min(0, Math.max(W - w, ox)); oy = Math.min(0, Math.max(H - h, oy)); const c = cv.getContext('2d'); c.clearRect(0, 0, W, H); c.drawImage(im, ox, oy, w, h); }; draw(); cv.onpointerdown = e => { dr = [e.clientX, e.clientY]; cv.setPointerCapture(e.pointerId); }; cv.onpointerup = () => dr = null; cv.onpointermove = e => { if (!dr)
    return; const k = W / cv.clientWidth; ox += (e.clientX - dr[0]) * k; oy += (e.clientY - dr[1]) * k; dr = [e.clientX, e.clientY]; draw(); }; $('#zm').oninput = e => { const o = b * z, cx = (W / 2 - ox) / o, cy = (H / 2 - oy) / o; z = +e.target.value; ox = W / 2 - cx * b * z; oy = H / 2 - cy * b * z; draw(); }; $('#no').onclick = () => $('#md').innerHTML = ''; $('#ok').onclick = () => { const f = (opt.w || 900) / W, o = document.createElement('canvas'); o.width = opt.w || 900; o.height = Math.round(H * f); o.getContext('2d').drawImage(im, ox * f, oy * f, im.width * b * z * f, im.height * b * z * f); done(o.toDataURL(opt.png ? 'image/png' : 'image/jpeg', .8)); }; }; im.src = URL.createObjectURL(file); }
async function unduh() { const m = $('#msg'), h = html(); try {
    if (typeof claude != 'undefined') {
        const d = await claude.use('downloads');
        if (d) {
            await d.save({ filename: 'index.html', data: h });
            return;
        }
    }
}
catch (e) { } const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([h], { type: 'text/html' })); a.download = 'index.html'; a.click(); m.textContent = ' Terunduh. Ganti index.html lama dengan file ini.'; }
let warned = 0;
setInterval(() => { if (!dirty)
    return; dirty = false; try {
    localStorage.setItem('smprk-data', JSON.stringify({ b: BASE, d: S }));
}
catch (e) {
    if (!warned++)
        alert('Penyimpanan browser penuh. Klik Unduh Website supaya perubahan aman.');
} }, 1200);

// ===== PENGATURAN & TERBIT KE GITHUB =====
const ADMIN_U = 'admin', ADMIN_H = '3b9e5f2ad2f04c3a7e5894f9f7b90938a42afb4756d6f1885c839683c40bd97e';
function setting() { const c = JSON.parse(LS('smprk-gh') || '{}'); $('#md').innerHTML = `<div class="modal"><div class="box" style="width:min(460px,100%);max-height:90vh;overflow:auto"><h3>Pengaturan</h3><b>Menu (nama dan tampil)</b>${TABS.map(t => `<label style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="mh-${t[0]}" ${S.hide[t[0]] ? '' : 'checked'}><input id="mn-${t[0]}" value="${esc(S.menu[t[0]] || t[1])}" style="flex:1"></label>`).join('')}<b>Terbitkan ke GitHub</b><small>Isi sekali. Token hanya disimpan di browser ini dan tidak ikut terbit.</small><input id="gh-o" placeholder="Username GitHub" value="${esc(c.o || '')}"><input id="gh-r" placeholder="Nama repository" value="${esc(c.r || '')}"><input id="gh-b" placeholder="Branch (main)" value="${esc(c.b || 'main')}"><input id="gh-t" type="password" placeholder="Personal access token" value="${esc(c.t || '')}"><div style="display:flex;gap:8px"><button onclick="setOk()">Simpan</button><button class="g" onclick="$('#md').innerHTML=''">Batal</button></div></div></div>`; }
function setOk() { TABS.forEach(t => { S.menu[t[0]] = $('#mn-' + t[0]).value.trim() || t[1]; S.hide[t[0]] = !$('#mh-' + t[0]).checked; }); try {
    localStorage.setItem('smprk-gh', JSON.stringify({ o: $('#gh-o').value.trim(), r: $('#gh-r').value.trim(), b: $('#gh-b').value.trim() || 'main', t: $('#gh-t').value.trim() }));
}
catch (e) { } dirty = true; R(); }
async function terbit() {
    const m = $('#msg'), c = JSON.parse(LS('smprk-gh') || '{}');
    if (!c.o || !c.r || !c.t) {
        m.textContent = ' Isi data GitHub dulu di Pengaturan.';
        return;
    }
    const api = p => `https://api.github.com/repos/${c.o}/${c.r}/contents/${p}`, H = { Authorization: 'Bearer ' + c.t, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' };
    const put = async (p, b64, msg) => { let sha; const g = await fetch(api(p) + '?ref=' + c.b, { headers: H }); if (g.ok)
        sha = (await g.json()).sha;
    else if (g.status != 404)
        throw new Error('GitHub ' + g.status + ' (cek token dan nama repository)'); const r = await fetch(api(p), { method: 'PUT', headers: H, body: JSON.stringify({ message: msg, content: b64, branch: c.b, sha }) }); if (!r.ok)
        throw new Error('GitHub ' + r.status + ' ' + ((await r.json()).message || '')); };
    try {
        const D = JSON.parse(JSON.stringify(S)), im = [], gr = (o, k) => { if (typeof o[k] == 'string' && o[k].startsWith('data:image'))
            im.push([o, k]); };
        gr(D, 'logo');
        gr(D, 'hero');
        gr(D.sambutan, 'foto');
        D.galeri.forEach((_, i) => gr(D.galeri, i));
        D.berita.forEach(r => gr(r, 3));
        let n = 0;
        for (const [o, k] of im) {
            m.textContent = ' Mengunggah foto ' + (++n) + '/' + im.length + '…';
            const f = 'foto/' + Date.now().toString(36) + n + (o[k].startsWith('data:image/png') ? '.png' : '.jpg');
            await put(f, o[k].split(',')[1], 'Tambah foto');
            PV[f] = o[k];
            o[k] = f;
        }
        m.textContent = ' Menyimpan data…';
        await put('data.json', btoa(unescape(encodeURIComponent(JSON.stringify(D, null, 1)))), 'Perbarui data website');
        S = D;
        dirty = true;
        m.textContent = ' Terbit! Tunggu 1-2 menit, lalu refresh website.';
    }
    catch (e) {
        m.textContent = ' Gagal: ' + e.message;
    }
}

// ===== RENDER ULANG HALAMAN =====
function R(m) {
    $('#app').className = A ? 'ed' : '';
    $('#app').innerHTML = `<nav>${S.logo || A ? `<img data-i="logo" src="${esc(PV[S.logo] || S.logo || PH('Logo'))}" alt="Logo sekolah" style="height:32px;width:32px;object-fit:cover;border-radius:6px;cursor:pointer">` : ''}${TABS.filter(t => A || !S.hide[t[0]]).map(t => `<a href="#${t[0]}" class="${tab() == t[0] ? 'on' : ''}">${esc(S.menu[t[0]] || t[1])}</a>`).join('')}<span class="sp"></span>${A ? '<button class="g" style="color:#fff" onclick="out()">Keluar</button>' : '<button onclick="login()">Login Admin</button>'}</nav>
${A ? `<div class="bar">Mode Admin: klik teks atau judul untuk edit, klik foto untuk ganti (ada crop). Draf tersimpan otomatis di browser ini; klik Terbitkan agar tampil untuk semua pengunjung. <label>Warna <input type="color" value="${S.warna || '#8a1c2b'}" oninput="S.warna=this.value;dirty=true;fx()" style="padding:0;height:28px"></label> <button onclick="terbit()">Terbitkan ke GitHub</button> <button onclick="setting()">Pengaturan</button> <button onclick="unduh()">Unduh cadangan</button><span id="msg"></span></div>` : ''}
<main>${view()}</main><footer>© ${E('name', S.name)}</footer><div id="md"></div><input id="f" type="file" accept="image/*" hidden>`;
    fx();
}
function add(k, v) { k == 'berita' ? S[k].unshift(v) : S[k].push(v); dirty = true; R(); }
function del(k, i) { S[k].splice(i, 1); dirty = true; R(); }

// ===== LOGIN ADMIN =====
// Username: admin. Password disimpan sebagai hash (ADMIN_H), lihat README untuk menggantinya.
function login() { $('#md').innerHTML = `<div class="modal"><form onsubmit="return go(event)"><h3>Login Admin</h3><input id="u" placeholder="Username" autocomplete="username"><input id="p" type="password" placeholder="Password" autocomplete="current-password"><div class="err" id="e"></div><button>Masuk</button><button type="button" class="g" onclick="$('#md').innerHTML=''">Batal</button></form></div>`; }
async function go(e) { e.preventDefault(); let ok = false; try {
    const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode($('#p').value));
    ok = $('#u').value == ADMIN_U && [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('') == ADMIN_H;
}
catch (x) { } if (ok) {
    A = true;
    R();
}
else
    $('#e').textContent = 'Username atau password salah.'; return false; }
function out() { A = false; R(); }

// ===== EDIT TEKS & GANTI FOTO =====
document.addEventListener('input', e => { const p = e.target.dataset?.p; if (p && A) {
    document.querySelectorAll(`[data-p="${p}"]`).forEach(n => { if (n !== e.target)
        n.textContent = e.target.textContent; });
    setP(p, e.target.textContent);
} });
document.addEventListener('click', e => { const p = e.target.dataset?.i; if (p && !A && p.startsWith('galeri') && S.galeri[+p.split('.')[1]]) {
    lb(+p.split('.')[1]);
    return;
} if (!p || !A)
    return; const f = $('#f'); f.onchange = () => { const fl = f.files[0]; f.value = ''; if (fl)
    crop(fl, p == 'logo' ? 1 : p == 'hero' ? 16 / 9 : p.startsWith('sambutan') ? 3 / 4 : 4 / 3, u => { setP(p, u); R(); }, p == 'logo' ? { w: 256, png: true } : {}); }; f.click(); });

// ===== UNDUH CADANGAN =====
function html() { const c = document.documentElement.cloneNode(true); c.querySelector('#app').innerHTML = ''; c.querySelector('#st').textContent = JSON.stringify(S).replace(/</g, '\\u003c'); return '<!doctype html>\n' + c.outerHTML; }

// ===== MULAI =====
addEventListener('hashchange', () => R());
fetch('data.json?' + Date.now(), { cache: 'no-store' }).then(x => x.ok ? x.text() : null).then(t => { if (t) {
    JSON.parse(t);
    load(t);
} }).catch(() => { }).finally(R);

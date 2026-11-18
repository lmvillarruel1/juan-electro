const $ = id => document.getElementById(id);
const money = n => "$" + Math.round(n).toLocaleString("es-AR");
const ld = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch(e) { return d; } };
const sv = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) {} };
const byId = id => productos.find(p => p.id === id);
const wa = t => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t)}`;
const F0 = { cat:"Todas", col:[], plancha:false, sale:false, max:1500000, favs:false, q:"", sort:"dest" };
let F = { ...F0 }, cart = ld("c", {}), favs = ld("f", []), cupon = false, D = null;
Object.keys(cart).forEach(k => { if(!byId(k.split("|")[0]) || !(cart[k] > 0)) delete cart[k]; });
favs = favs.filter(byId);
const off = p => Math.round(100 - p.precio * 100 / p.antes);

const card = p => `<article class="c"><a class="im" href="#p-${p.id}"><img class="a" src="${p.fotos[0]}" alt="${p.nombre}">${p.fotos[1] ? `<img class="b" src="${p.fotos[1]}" alt="">` : ""}${p.antes ? `<span class="bd s">-${off(p)}%</span>` : p.nuevo ? `<span class="bd">Nuevo</span>` : ""}</a><button class="hrt${favs.includes(p.id) ? " on" : ""}" data-fav="${p.id}" aria-label="Favorito">${favs.includes(p.id) ? "♥" : "♡"}</button><div class="t"><h3>${p.nombre}</h3><p>${p.color} · ${p.linea}</p><div class="pr"><b>${money(p.precio)}</b>${p.antes ? `<s>${money(p.antes)}</s>` : ""}</div><p>★ ${p.rating} (${p.res})</p></div></article>`;

function lista(){
  const cols = [...new Set(productos.map(p => p.color))];
  const orden = [["dest","Destacados"],["menor","Menor precio"],["mayor","Mayor precio"],["val","Mejor valorados"]];
  $("app").innerHTML = `<section class="hw"><div class="hero"><div><h1>Cocinas que<br>cocinan con vos</h1><p>Hornallas, plancha y horno en un solo equipo. Envío gratis desde ${money(ENVIO)}.</p><button class="btn" data-go>Ver cocinas</button></div><img src="${productos[4].fotos[0]}" alt=""></div></section>
  <section class="cat" id="catalogo"><div class="hdr"><h2 id="ttl"></h2><span id="cnt"></span><select id="sort" aria-label="Ordenar">${orden.map(([v,t]) => `<option value="${v}"${F.sort === v ? " selected" : ""}>${t}</option>`).join("")}</select></div>
  <div class="lay"><div class="flt"><details${innerWidth >= 800 ? " open" : ""}><summary class="fs">Filtros</summary>
    <details open><summary>Color</summary>${cols.map(c => `<label><input type="checkbox" data-col="${c}"${F.col.includes(c) ? " checked" : ""}>${c}</label>`).join("")}</details>
    <details open><summary>Características</summary><label><input type="checkbox" id="fp"${F.plancha ? " checked" : ""}>Con plancha</label><label><input type="checkbox" id="fo"${F.sale ? " checked" : ""}>Solo ofertas</label></details>
    <details open><summary>Precio máximo</summary><input type="range" id="fm" min="600000" max="1500000" step="50000" value="${F.max}"><div id="fmv">Hasta ${money(F.max)}</div></details>
    <button class="btn o" id="fc">Limpiar filtros</button></details></div>
  <div id="grid" class="grid"></div></div></section>`;
  pintar();
}

function pintar(){
  const l = productos.filter(p => (F.cat === "Todas" || p.linea === F.cat) && (!F.col.length || F.col.includes(p.color)) && (!F.plancha || p.plancha) && (!F.sale || p.antes) && p.precio <= F.max && (!F.favs || favs.includes(p.id)) && (p.nombre + " " + p.color + " " + p.linea).toLowerCase().includes(F.q));
  l.sort({ dest:() => 0, menor:(a,b) => a.precio - b.precio, mayor:(a,b) => b.precio - a.precio, val:(a,b) => b.rating - a.rating }[F.sort]);
  $("ttl").textContent = F.favs ? "Tus favoritos" : F.sale ? "Ofertas" : F.cat === "Todas" ? "Cocinas" : F.cat;
  $("cnt").textContent = l.length + (l.length === 1 ? " producto" : " productos");
  $("grid").innerHTML = l.length ? l.map(card).join("") : `<p class="em">No encontramos productos con esos filtros.</p>`;
  marcarNav();
}
function marcarNav(){
  document.querySelectorAll(".nav button").forEach(b => b.classList.toggle("on", !!$("grid") && !F.favs && (b.hasAttribute("data-sale") ? F.sale : !F.sale && b.dataset.cat === F.cat)));
}

function detalle(p){
  const rel = productos.filter(x => x.id !== p.id).slice(0, 4);
  D = { p, gas:null, q:1 };
  $("app").innerHTML = `<div class="crumb"><a href="#inicio">Cocinas</a> / ${p.nombre}</div>
  <div class="det"><div class="gl"><div class="th">${p.fotos.map((f,i) => `<button data-th="${i}" class="${i ? "" : "on"}" aria-label="Foto ${i+1}"><img src="${f}" alt=""></button>`).join("")}</div><div class="mn" id="mn"><img id="mi" src="${p.fotos[0]}" alt="${p.nombre}"></div></div>
  <div class="inf"><small>${p.linea} · ${p.color}</small><h1>${p.nombre}</h1>
    <div class="pr"><b>${money(p.precio)}</b>${p.antes ? `<s>${money(p.antes)}</s><span class="off">-${off(p)}%</span>` : ""}</div>
    <p class="mu">6 cuotas de ${money(p.precio / 6)} sin interés · ★ ${p.rating} (${p.res} opiniones)</p>
    <div class="opt"><b>Tipo de gas</b><div class="sz"><button data-gas="Natural">Gas natural</button><button data-gas="Envasado">Gas envasado</button></div><p class="er" id="er"></p></div>
    <div class="q"><button data-q="-1" aria-label="Menos">-</button><b id="qn">1</b><button data-q="1" aria-label="Más">+</button></div>
    <button class="btn" id="add">Agregar al carrito</button>
    <a class="btn o" target="_blank" rel="noopener" href="${wa("Hola, quiero consultar por: " + p.nombre + " (" + p.color + ")")}">Consultar por WhatsApp</a>
    <details open><summary>Descripción</summary><p>${p.desc}</p></details>
    <details><summary>Características</summary><table>${p.specs.map(([a,b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join("")}</table></details>
    <details><summary>Envíos y devoluciones</summary><p>Envío a todo el país. Cambios y devoluciones dentro de los 10 días de recibido el producto.</p></details>
  </div></div>
  <section class="rel"><h2>También te puede interesar</h2><div class="grid">${rel.map(card).join("")}</div></section>`;
}

function ruta(){
  const h = location.hash.slice(1), p = h.startsWith("p-") && byId(h.slice(2));
  if(h === "checkout") checkout();
  else if(p){ detalle(p); scrollTo(0, 0); } else lista();
  marcarNav();
}
function irLista(){
  if(location.hash.slice(1).startsWith("p-")) location.hash = "inicio"; else ruta();
  setTimeout(() => $("catalogo") && $("catalogo").scrollIntoView(), 60);
}

// Favoritos
function cont(){ $("fN").textContent = favs.length; }
function fav(id){
  favs = favs.includes(id) ? favs.filter(x => x !== id) : [...favs, id]; sv("f", favs); cont();
  if(F.favs && $("grid")) return pintar();
  document.querySelectorAll(`[data-fav="${id}"]`).forEach(b => { const on = favs.includes(id); b.classList.toggle("on", on); b.textContent = on ? "♥" : "♡"; });
}

// Carrito
const abrir = v => { $("cart").classList.toggle("open", v); $("ov").classList.toggle("open", v); };
function pintarCart(){
  const ks = Object.keys(cart);
  const sub = ks.reduce((s,k) => s + byId(k.split("|")[0]).precio * cart[k], 0), n = ks.reduce((s,k) => s + cart[k], 0);
  const dto = cupon ? sub * .1 : 0, tot = sub - dto, falta = ENVIO - tot;
  $("cN").textContent = n;
  $("ship").hidden = !ks.length;
  $("ship").innerHTML = (falta > 0 ? `Te faltan <b>${money(falta)}</b> para el envío gratis` : "<b>¡Tenés envío gratis!</b>") + `<div class="bar2"><i style="width:${Math.min(100, tot / ENVIO * 100)}%"></i></div>`;
  $("items").innerHTML = ks.length ? ks.map(k => { const [id, gas] = k.split("|"), p = byId(id);
    return `<div class="it"><img src="${p.fotos[0]}" alt=""><div><b>${p.nombre}</b><small>${p.color} · Gas ${gas.toLowerCase()}</small><div class="q"><button data-cq="${k}" data-d="-1" aria-label="Menos">-</button><b>${cart[k]}</b><button data-cq="${k}" data-d="1" aria-label="Más">+</button></div></div><div><b>${money(p.precio * cart[k])}</b><br><button class="rm" data-rm="${k}">Quitar</button></div></div>`; }).join("") : `<p class="em">Tu carrito está vacío.</p>`;
  $("tot").innerHTML = ks.length ? `<div class="tr"><span>Subtotal</span><span>${money(sub)}</span></div>${cupon ? `<div class="tr"><span>Cupón ALISON10</span><span>-${money(dto)}</span></div>` : ""}<div class="tr"><span>Envío</span><span>${falta > 0 ? "A calcular" : "Gratis"}</span></div><div class="tr t2"><span>Total</span><span>${money(tot)}</span></div>` : "";
  const lin = ks.map(k => { const [id, gas] = k.split("|"), p = byId(id); return `- ${cart[k]} x ${p.nombre} ${p.color} (gas ${gas.toLowerCase()}): ${money(p.precio * cart[k])}`; });
  $("wa").href = ks.length ? wa("Hola, quiero hacer este pedido:\n" + lin.join("\n") + (cupon ? "\nCupón ALISON10: -" + money(dto) : "") + "\nTotal: " + money(tot)) : "#";
  $("buy").classList.toggle("dis", !ks.length);
  $("wa").hidden = !ks.length;
  if($("ck")){ if(!ks.length) return ruta(); document.querySelector(".ckr").innerHTML = "<h2>Tu pedido</h2>" + resumenHTML(calc()) + '<a class="lnk" href="#inicio">Seguir comprando</a>'; }
}
function agregar(id, gas, q){ const k = id + "|" + gas; cart[k] = (cart[k] || 0) + q; sv("c", cart); pintarCart(); abrir(true); }

// ===== Checkout =====
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]));
function calc(){
  const ks = Object.keys(cart), sub = ks.reduce((s, k) => s + byId(k.split("|")[0]).precio * cart[k], 0), dto = cupon ? sub * .1 : 0, tot = sub - dto;
  return { ks, sub, dto, tot, gratis: tot >= ENVIO };
}
function resumenHTML(c){
  return c.ks.map(k => { const [id, gas] = k.split("|"), p = byId(id);
    return `<div class="it"><img src="${p.fotos[0]}" alt=""><div><b>${p.nombre}</b><small>${p.color} · Gas ${gas.toLowerCase()} · x${cart[k]}</small></div><b>${money(p.precio * cart[k])}</b></div>`; }).join("")
  + `<div class="tr"><span>Subtotal</span><span>${money(c.sub)}</span></div>` + (cupon ? `<div class="tr"><span>Cupón ALISON10</span><span>-${money(c.dto)}</span></div>` : "")
  + `<div class="tr"><span>Envío</span><span>${c.gratis ? "Gratis" : "A coordinar"}</span></div><div class="tr t2"><span>Total</span><span>${money(c.tot)}</span></div>`;
}
function msgPedido(o, total, pagado){
  const l = o.items.map(i => { const p = byId(i.id); return p ? `- ${i.qty} x ${p.nombre} ${p.color} (gas ${i.gas.toLowerCase()})` : ""; }).join("\n");
  const e = o.entrega.tipo === "envio" ? `Envío a: ${o.entrega.dir}, ${o.entrega.loc}, ${o.entrega.prov} (${o.entrega.cp})` : "Retiro en el local";
  return `Hola, soy ${o.comprador.nombre}. ${pagado ? "Pagué mi pedido por Mercado Pago" : "Quiero confirmar mi pedido"}:\n${l}\nTotal: ${money(total)}\n${e}\nTel: ${o.comprador.tel}` + (o.nota ? `\nNota: ${o.nota}` : "");
}
function checkout(){
  const c = calc();
  if(!c.ks.length){ $("app").innerHTML = `<div class="res"><h2>Tu carrito está vacío</h2><p>Agregá productos para continuar con la compra.</p><a class="btn" href="#inicio">Ver cocinas</a></div>`; return; }
  const inp = (n, l, a, t = "text", x = "") => `<label>${l}<input name="${n}" type="${t}" autocomplete="${a}" ${x}></label>`;
  $("app").innerHTML = `<div class="crumb"><a href="#inicio">Cocinas</a> / Checkout</div>
  <form id="ck" class="ck" novalidate><div class="ckf">
    <h2>Tus datos</h2>${inp("nombre", "Nombre y apellido", "name")}${inp("email", "Email", "email", "email")}${inp("tel", "Teléfono o WhatsApp", "tel", "tel")}
    <h2>Entrega</h2>
    <div class="sz"><label class="rd"><input type="radio" name="ent" value="envio" checked>Envío a domicilio</label><label class="rd"><input type="radio" name="ent" value="retiro">Retiro en el local</label></div>
    <div id="dir">${inp("dir", "Dirección", "street-address")}${inp("loc", "Localidad", "address-level2")}${inp("prov", "Provincia", "address-level1")}${inp("cp", "Código postal", "postal-code", "text", 'inputmode="numeric"')}</div>
    <label>Notas del pedido (opcional)<textarea name="nota" rows="2"></textarea></label>
    <h2>Pago</h2><p class="mu">Pagás de forma segura en Mercado Pago con tarjeta, dinero en cuenta o efectivo.</p>
    <p class="er" id="cke"></p>
    <button class="btn" id="pay" type="submit">Pagar con Mercado Pago</button>
    <a class="lnk" target="_blank" rel="noopener" href="${$("wa").href}">Prefiero coordinar por WhatsApp</a>
  </div><aside class="ckr"><h2>Tu pedido</h2>${resumenHTML(c)}<a class="lnk" href="#inicio">Seguir comprando</a></aside></form>`;
  scrollTo(0, 0);
}
function demo(orden, c){
  $("app").innerHTML = `<div class="res"><h2>Modo demostración</h2><p>En la tienda real, acá se abre Mercado Pago para pagar ${money(c.tot)}. Todavía no hay un servidor de pagos conectado.</p><div class="ckr">${resumenHTML(c)}</div><a class="btn" target="_blank" rel="noopener" href="${wa(msgPedido(orden, c.tot, false))}">Enviar el pedido por WhatsApp</a><a class="lnk" href="#inicio">Volver a la tienda</a></div>`;
  scrollTo(0, 0);
}
function resultado(pg){
  const P = ld("p", null), t = {
    ok: ["¡Gracias por tu compra!", "Recibimos tu pago. Para coordinar la entrega, enviános los datos de tu pedido por WhatsApp."],
    pendiente: ["Tu pago está pendiente", "Cuando Mercado Pago lo acredite, vamos a confirmar tu pedido. Mientras tanto, podés enviarnos los datos por WhatsApp."],
    error: ["El pago no se completó", "Podés intentar de nuevo o coordinar tu compra por WhatsApp."] }[pg];
  if(pg === "ok"){ cart = {}; cupon = false; sv("c", cart); pintarCart(); }
  $("app").innerHTML = `<div class="res"><h2>${t[0]}</h2><p>${t[1]}</p>${P ? `<a class="btn" target="_blank" rel="noopener" href="${wa(msgPedido(P.orden, P.total, pg === "ok"))}">Enviar mi pedido por WhatsApp</a>` : ""}<a class="lnk" href="${pg === "error" ? "#checkout" : "#inicio"}">${pg === "error" ? "Volver al checkout" : "Volver a la tienda"}</a></div>`;
}
document.addEventListener("submit", async e => {
  if(e.target.id !== "ck") return;
  e.preventDefault();
  const v = Object.fromEntries(new FormData(e.target)), er = [], envio = v.ent === "envio";
  if(v.nombre.trim().length < 3) er.push("Ingresá tu nombre y apellido.");
  if(!/^\S+@\S+\.\S+$/.test(v.email.trim())) er.push("Ingresá un email válido.");
  if(v.tel.replace(/\D/g, "").length < 8) er.push("Ingresá un teléfono válido.");
  if(envio && !(v.dir.trim() && v.loc.trim() && v.prov.trim() && v.cp.trim())) er.push("Completá la dirección de entrega.");
  $("cke").innerHTML = er.join("<br>");
  if(er.length) return;
  const c = calc();
  const orden = { items: c.ks.map(k => { const [id, gas] = k.split("|"); return { id, gas, qty: cart[k] }; }), cupon,
    comprador: { nombre: v.nombre.trim(), email: v.email.trim(), tel: v.tel.trim() },
    entrega: envio ? { tipo:"envio", dir:v.dir.trim(), loc:v.loc.trim(), prov:v.prov.trim(), cp:v.cp.trim() } : { tipo:"retiro" }, nota: v.nota.trim() };
  sv("p", { orden, total: c.tot });
  if(!API_URL) return demo(orden, c);
  const btn = $("pay"); btn.disabled = true; btn.textContent = "Redirigiendo a Mercado Pago...";
  try {
    const r = await fetch(API_URL, { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify(orden) });
    const d = await r.json();
    if(!r.ok || !d.url) throw new Error();
    location.href = d.url;
  } catch(err) { btn.disabled = false; btn.textContent = "Pagar con Mercado Pago"; $("cke").textContent = "No pudimos iniciar el pago. Probá de nuevo o coordiná por WhatsApp."; }
});

// Zoom de la foto principal
function origen(e){ const m = $("mn"), r = m.getBoundingClientRect(); $("mi").style.transformOrigin = ((e.clientX - r.left) / r.width * 100) + "% " + ((e.clientY - r.top) / r.height * 100) + "%"; }
document.addEventListener("mousemove", e => { const m = $("mn"); if(m && m.classList.contains("z")) origen(e); });

document.addEventListener("click", e => {
  const g = s => e.target.closest(s); let b;
  if(g("#buy")) abrir(false);
  if(b = g("[data-fav]")) return fav(b.dataset.fav);
  if(b = g(".nav button")){ F = { ...F0, q:F.q, cat:b.dataset.cat || "Todas", sale:b.hasAttribute("data-sale") }; return irLista(); }
  if(g("#fBtn")){ F = { ...F0, q:F.q, favs:!F.favs }; return irLista(); }
  if(g("#cBtn")) return abrir(true);
  if(g("#cX") || g("#ov")) return abrir(false);
  if(g("#sBtn")){ const s = $("srch"); s.hidden = !s.hidden; if(!s.hidden) $("q").focus(); return; }
  if(g("[data-go]")) return $("catalogo").scrollIntoView();
  if(g("#fc")){ F = { ...F0, q:F.q, sort:F.sort }; return lista(); }
  if(b = g("[data-th]")){ document.querySelectorAll("[data-th]").forEach(x => x.classList.toggle("on", x === b)); $("mi").src = D.p.fotos[+b.dataset.th]; $("mn").classList.remove("z"); return; }
  if(b = g("[data-gas]")){ D.gas = b.dataset.gas; document.querySelectorAll("[data-gas]").forEach(x => x.classList.toggle("on", x === b)); $("er").textContent = ""; return; }
  if(b = g("[data-q]")){ D.q = Math.max(1, D.q + +b.dataset.q); $("qn").textContent = D.q; return; }
  if(g("#mn")){ origen(e); $("mn").classList.toggle("z"); return; }
  if(g("#add")){ if(!D.gas) return $("er").textContent = "Elegí el tipo de gas para continuar"; return agregar(D.p.id, D.gas, D.q); }
  if(b = g("[data-cq]")){ const k = b.dataset.cq; cart[k] += +b.dataset.d; if(cart[k] <= 0) delete cart[k]; sv("c", cart); return pintarCart(); }
  if(b = g("[data-rm]")){ delete cart[b.dataset.rm]; sv("c", cart); return pintarCart(); }
  if(g("#cok")){ const ok = $("cin").value.trim().toUpperCase() === "ALISON10"; cupon = cupon || ok; $("cer").textContent = ok ? "Cupón aplicado: 10% de descuento" : "El código no es válido"; return pintarCart(); }
});
document.addEventListener("change", e => {
  const t = e.target;
  if(t.dataset.col){ F.col = [...document.querySelectorAll("[data-col]:checked")].map(i => i.dataset.col); pintar(); }
  if(t.id === "fp"){ F.plancha = t.checked; pintar(); }
  if(t.id === "fo"){ F.sale = t.checked; pintar(); }
  if(t.id === "sort"){ F.sort = t.value; pintar(); }
  if(t.name === "ent") $("dir").hidden = t.value === "retiro";
});
document.addEventListener("input", e => {
  if(e.target.id === "fm"){ F.max = +e.target.value; $("fmv").textContent = "Hasta " + money(F.max); pintar(); }
  if(e.target.id === "q"){ F.q = e.target.value.trim().toLowerCase(); if($("grid")) pintar(); else irLista(); }
});
document.addEventListener("keydown", e => { if(e.key === "Escape") abrir(false); });
addEventListener("hashchange", ruta);
cont(); pintarCart();
const pg = new URLSearchParams(location.search).get("pago");
if(["ok", "pendiente", "error"].includes(pg)){ try { history.replaceState(null, "", location.pathname); } catch(e) {} resultado(pg); } else ruta();

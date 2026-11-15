/* Arena Sport – logika toko */
const WA_NUMBER = "6281200000000"; // ganti dengan nomor WhatsApp kamu (format 62...)

const CATS = [
  { id: "sepatu", name: "Sepatu Futsal", icon: "👟", bg: "#d8ecff" },
  { id: "bola", name: "Bola Kaki", icon: "⚽", bg: "#e6f5d8" },
  { id: "mini", name: "Mini Soccer", icon: "🥅", bg: "#fff0c9" },
  { id: "jersey", name: "Jersey", icon: "👕", bg: "#ffe0d6" },
  { id: "kaos", name: "Kaos Kaki", icon: "🧦", bg: "#eadcff" },
  { id: "alat", name: "Alat Olahraga", icon: "🎒", bg: "#dcdcdc" },
];

const PRODUCTS = [
  { id: 1, cat: "sepatu", name: "Sepatu Futsal Striker Pro", brand: "Arena", price: 389000, old: 459000, rating: 4.8, badge: "Terlaris" },
  { id: 2, cat: "sepatu", name: "Sepatu Futsal Court Speed", brand: "Arena", price: 329000, rating: 4.6 },
  { id: 3, cat: "sepatu", name: "Sepatu Futsal Junior Kids", brand: "Arena", price: 199000, old: 249000, rating: 4.5, badge: "Diskon" },
  { id: 4, cat: "bola", name: "Bola Sepak Match Size 5", brand: "Arena", price: 189000, rating: 4.7, badge: "Baru" },
  { id: 5, cat: "bola", name: "Bola Futsal Size 4", brand: "Arena", price: 159000, old: 189000, rating: 4.6, badge: "Diskon" },
  { id: 6, cat: "bola", name: "Bola Latihan Set isi 5", brand: "Arena", price: 450000, rating: 4.4 },
  { id: 7, cat: "mini", name: "Bola Mini Soccer Size 4", brand: "Arena", price: 169000, rating: 4.5 },
  { id: 8, cat: "mini", name: "Gawang Mini Soccer Lipat", brand: "Arena", price: 525000, old: 599000, rating: 4.7, badge: "Diskon" },
  { id: 9, cat: "mini", name: "Rompi Training Set isi 10", brand: "Arena", price: 250000, rating: 4.5 },
  { id: 10, cat: "jersey", name: "Jersey Tim Home Merah", brand: "Arena", price: 149000, rating: 4.6, badge: "Terlaris" },
  { id: 11, cat: "jersey", name: "Jersey Tim Away Putih", brand: "Arena", price: 149000, rating: 4.5 },
  { id: 12, cat: "jersey", name: "Jersey Kiper Lengan Panjang", brand: "Arena", price: 175000, rating: 4.4 },
  { id: 13, cat: "kaos", name: "Kaos Kaki Bola Panjang", brand: "Arena", price: 35000, rating: 4.5 },
  { id: 14, cat: "kaos", name: "Kaos Kaki Anti Slip Grip", brand: "Arena", price: 59000, old: 75000, rating: 4.7, badge: "Baru" },
  { id: 15, cat: "alat", name: "Sarung Tangan Kiper", brand: "Arena", price: 135000, rating: 4.6 },
  { id: 16, cat: "alat", name: "Deker Shin Guard", brand: "Arena", price: 45000, rating: 4.5 },
  { id: 17, cat: "alat", name: "Tas Sepatu & Bola", brand: "Arena", price: 120000, rating: 4.4 },
  { id: 18, cat: "alat", name: "Botol Minum Sport 1L", brand: "Arena", price: 39000, rating: 4.3 },
  { id: 19, cat: "alat", name: "Pompa Bola + Jarum", brand: "Arena", price: 49000, rating: 4.5 },
  { id: 20, cat: "alat", name: "Peluit & Kartu Wasit", brand: "Arena", price: 55000, rating: 4.4 },
];

const $ = (s) => document.querySelector(s);
const rp = (n) => "Rp" + n.toLocaleString("id-ID");
const catOf = (id) => CATS.find((c) => c.id === id);

let state = { cat: "all", q: "", sort: "default" };
let cart = [];
try { cart = JSON.parse(localStorage.getItem("arena-cart")) || []; } catch (e) { cart = []; }

/* ---------- Kategori & filter ---------- */
function renderCats() {
  $("#cats").innerHTML = CATS.map((c) => {
    const n = PRODUCTS.filter((p) => p.cat === c.id).length;
    return `<button class="cat" data-cat="${c.id}"><span class="ic">${c.icon}</span><b>${c.name}</b><small>${n} produk</small></button>`;
  }).join("");
  $("#chips").innerHTML = [{ id: "all", name: "Semua" }, ...CATS]
    .map((c) => `<button class="chip ${state.cat === c.id ? "on" : ""}" data-cat="${c.id}">${c.name}</button>`).join("");
}

function renderProducts() {
  let list = PRODUCTS.filter((p) =>
    (state.cat === "all" || p.cat === state.cat) &&
    (p.name + " " + catOf(p.cat).name).toLowerCase().includes(state.q.toLowerCase())
  );
  if (state.sort === "low") list.sort((a, b) => a.price - b.price);
  if (state.sort === "high") list.sort((a, b) => b.price - a.price);
  if (state.sort === "rating") list.sort((a, b) => b.rating - a.rating);

  $("#grid").innerHTML = list.map((p) => {
    const c = catOf(p.cat);
    return `<article class="card">
      <div class="thumb" style="background:${c.bg}">${p.badge ? `<span class="badge">${p.badge}</span>` : ""}${c.icon}</div>
      <div class="info">
        <small>${c.name}</small>
        <h3>${p.name}</h3>
        <span class="rate">★ ${p.rating}</span>
        <div class="price"><b>${rp(p.price)}</b>${p.old ? `<s>${rp(p.old)}</s>` : ""}</div>
        <button class="add" data-add="${p.id}">Tambah ke keranjang</button>
      </div></article>`;
  }).join("");
  $("#empty").hidden = list.length > 0;
}

function setCat(id) {
  state.cat = id;
  renderCats();
  renderProducts();
}

document.addEventListener("click", (e) => {
  const catBtn = e.target.closest("[data-cat]");
  if (catBtn) {
    setCat(catBtn.dataset.cat);
    if (catBtn.classList.contains("cat")) $("#produk").scrollIntoView();
  }
  const add = e.target.closest("[data-add]");
  if (add) addToCart(+add.dataset.add);
});
$("#search").addEventListener("input", (e) => { state.q = e.target.value; renderProducts(); });
$("#sort").addEventListener("change", (e) => { state.sort = e.target.value; renderProducts(); });

/* ---------- Keranjang ---------- */
function saveCart() {
  try { localStorage.setItem("arena-cart", JSON.stringify(cart)); } catch (e) {}
  renderCart();
}

function addToCart(id) {
  const it = cart.find((x) => x.id === id);
  it ? it.qty++ : cart.push({ id, qty: 1 });
  saveCart();
  toast(PRODUCTS.find((p) => p.id === id).name + " masuk keranjang");
}

function changeQty(id, d) {
  const it = cart.find((x) => x.id === id);
  if (!it) return;
  it.qty += d;
  if (it.qty <= 0) cart = cart.filter((x) => x.id !== id);
  saveCart();
}

function renderCart() {
  const total = cart.reduce((s, it) => s + PRODUCTS.find((p) => p.id === it.id).price * it.qty, 0);
  $("#cartCount").textContent = cart.reduce((s, it) => s + it.qty, 0);
  $("#cartTotal").textContent = rp(total);
  $("#cartItems").innerHTML = cart.length
    ? cart.map((it) => {
        const p = PRODUCTS.find((x) => x.id === it.id);
        return `<div class="item"><div class="em">${catOf(p.cat).icon}</div>
          <div><p>${p.name}</p><small>${rp(p.price)}</small>
          <div class="qty"><button data-q="-1" data-id="${p.id}" aria-label="Kurangi">−</button><span>${it.qty}</span><button data-q="1" data-id="${p.id}" aria-label="Tambah">+</button></div></div>
          <button class="rm" data-q="-999" data-id="${p.id}">Hapus</button></div>`;
      }).join("")
    : `<p style="padding:24px 0;color:#5b6a62">Keranjang masih kosong. Pilih produk dan tekan "Tambah ke keranjang".</p>`;
}

$("#cartItems").addEventListener("click", (e) => {
  const b = e.target.closest("[data-q]");
  if (b) changeQty(+b.dataset.id, +b.dataset.q);
});
$("#clearCart").addEventListener("click", () => { cart = []; saveCart(); });

function toggleCart(open) {
  $("#drawer").classList.toggle("open", open);
  $("#overlay").classList.toggle("show", open);
  $("#drawer").setAttribute("aria-hidden", String(!open));
}
$("#openCart").addEventListener("click", () => toggleCart(true));
$("#closeCart").addEventListener("click", () => toggleCart(false));
$("#overlay").addEventListener("click", () => toggleCart(false));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") toggleCart(false); });

$("#checkout").addEventListener("click", () => {
  if (!cart.length) return toast("Keranjang masih kosong");
  let total = 0;
  const lines = cart.map((it, i) => {
    const p = PRODUCTS.find((x) => x.id === it.id);
    total += p.price * it.qty;
    return `${i + 1}. ${p.name} x${it.qty} = ${rp(p.price * it.qty)}`;
  });
  const msg = `Halo Arena Sport, saya ingin memesan:\n${lines.join("\n")}\n\nTotal: ${rp(total)}\n\nMohon info ukuran/stok dan ongkir. Terima kasih.`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
});

/* ---------- Lain-lain ---------- */
let tt;
function toast(text) {
  const t = $("#toast");
  t.textContent = text;
  t.classList.add("show");
  clearTimeout(tt);
  tt = setTimeout(() => t.classList.remove("show"), 2200);
}

$("#burger").addEventListener("click", () => $("#menu").classList.toggle("open"));
$("#menu").addEventListener("click", () => $("#menu").classList.remove("open"));

$("#newsForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const v = $("#email").value.trim();
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  $("#newsMsg").textContent = ok ? "Terima kasih! Info diskon akan dikirim ke " + v : "Alamat email belum valid. Contoh: nama@email.com";
  if (ok) e.target.reset();
});

renderCats();
renderProducts();
renderCart();

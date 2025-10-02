const PRODUCTS = [
  { id:1, title:"Men's Shoe", price:59.00, category:"men", images:["men.jpg"], desc:"Lightweight breathable shoe."},
  { id:2, title:"Women's Casual Shoe", price:49.99, category:"women", images:["women shoe.jpg"], desc:"Comfortable casual shoe."},
  { id:3, title:"School Shoes", price:26.00, category:"school shoes", images:["school shoe.jpg"], desc:"Durable school shoes."},
  { id:5, title:"Classic Leather", price:74.00, category:"men", images:["Formal shoe.jpg"], desc:"Premium leather formal shoes."},
  { id:6, title:"comfort shoe", price:29.00, category:"women", images:["women.jpg"], desc:"Daily comfort."}
];

const CART_KEY = "bata_cart_v2";

function getCart(){ return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); }
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); renderCartCount(); }

// add to cart by product id
function addToCart(id, qty=1){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  const cart = getCart();
  const item = cart.find(i=>i.id===id);
  if(item) item.qty += qty; else cart.push({ id, qty });
  saveCart(cart);
  showToast(`${p.title} added to cart`);
}

// remove a product from cart entirely
function removeFromCart(id){
  let cart = getCart().filter(i=>i.id!==id);
  saveCart(cart);
  renderCart(); // if drawer open
  renderCartPage(); // if on cart page
}

// update quantity (set)
function updateQty(id, qty){
  const cart = getCart();
  const item = cart.find(i=>i.id===id);
  if(!item) return;
  item.qty = qty;
  if(item.qty <= 0) {
    removeFromCart(id);
    return;
  }
  saveCart(cart);
  renderCart();
  renderCartPage();
}

// small toast
function showToast(msg){
  const t = document.createElement("div");
  t.textContent = msg;
  t.style.position = "fixed";
  t.style.right = "18px";
  t.style.bottom = "18px";
  t.style.background = "var(--primary)";
  t.style.color = "#fff";
  t.style.padding = "10px 14px";
  t.style.borderRadius = "10px";
  t.style.zIndex = 1000;
  document.body.appendChild(t);
  setTimeout(()=> t.remove(), 1400);
}

// render number in header cart count
function renderCartCount(){
  const count = getCart().reduce((s,i)=>s+i.qty,0);
  document.querySelectorAll(".cart-count").forEach(el=>el.textContent = count);
}

// Render a products array to a grid element id
function renderProductsGrid(targetId, items){
  const container = document.getElementById(targetId);
  if(!container) return;
  container.innerHTML = items.map(p => `
    <div class="card">
      <img src="${p.images[0]}" alt="${p.title}">
      <div class="card-body">
        <h3>${p.title}</h3>
        <div class="small">${p.category}</div>
        <div class="price">$${p.price.toFixed(2)}</div>
        <p class="small" style="margin-top:8px">${p.desc}</p>
        <div class="actions">
          <button class="btn" onclick="addToCart(${p.id})">Add to cart</button>
          <a class="btn-ghost" href="product.html?id=${p.id}">View</a>
        </div>
      </div>
    </div>
  `).join("");
  renderCartCount();
}

// Cart drawer rendering (for overlay)
function renderCart(){
  const wrap = document.getElementById("cart-drawer");
  if(!wrap) return;
  const cart = getCart();
  if(cart.length === 0){
    wrap.innerHTML = `<div class="info"><p class="small">Your cart is empty.</p><a href="products.html" class="btn">Shop products</a></div>`;
    return;
  }
  let total = 0;
  let html = '<div style="display:grid;gap:12px">';
  cart.forEach(i=>{
    const p = PRODUCTS.find(x=>x.id===i.id);
    const line = p.price * i.qty;
    total += line;
    html += `<div style="display:flex;gap:12px;align-items:center">
      <img src="${p.images[0]}" style="width:80px;height:60px;object-fit:cover;border-radius:8px">
      <div style="flex:1">
        <strong>${p.title}</strong>
        <div class="small">$${p.price} × ${i.qty} = $${line.toFixed(2)}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px">
        <button class="btn-ghost" onclick="removeFromCart(${p.id})">Remove</button>
      </div>
    </div>`;
  });
  html += `</div><div style="margin-top:12px;display:flex;justify-content:space-between;align-items:center"><strong>Total: $${total.toFixed(2)}</strong><a href="cart.html" class="btn">Go to Cart</a></div>`;
  wrap.innerHTML = html;
}

// Render cart page contents (cart.html)
function renderCartPage(){
  const wrap = document.getElementById("cart-list");
  if(!wrap) return;
  const cart = getCart();
  if(cart.length === 0){
    wrap.innerHTML = `<p>Your cart is empty. <a href="products.html">Start shopping</a></p>`;
    document.getElementById("cart-actions") && (document.getElementById("cart-actions").innerHTML = "");
    return;
  }
  let html = '<div style="display:grid;gap:12px">';
  let total = 0;
  cart.forEach(i=>{
    const p = PRODUCTS.find(x=>x.id===i.id);
    const line = p.price * i.qty;
    total += line;
    html += `<div style="display:flex;gap:12px;align-items:center;background:var(--card);padding:12px;border-radius:8px">
      <img src="${p.images[0]}" style="width:100px;height:80px;object-fit:cover;border-radius:6px">
      <div style="flex:1">
        <strong>${p.title}</strong>
        <div class="small">$${p.price} × ${i.qty} = $${line.toFixed(2)}</div>
        <div style="margin-top:8px"><label>Qty: <input type="number" value="${i.qty}" min="1" style="width:70px" onchange="updateQty(${p.id}, this.value)"></label></div>
      </div>
      <div><button class="btn-ghost" onclick="removeFromCart(${p.id})">Remove</button></div>
    </div>`;
  });
  html += `</div><div style="margin-top:14px"><strong>Total: $${total.toFixed(2)}</strong></div>`;
  wrap.innerHTML = html;
  document.getElementById("cart-actions") && (document.getElementById("cart-actions").innerHTML = `<a href="checkout.html" class="btn">Proceed to Checkout</a>`);
}

// Checkout summary rendering
function renderCheckoutSummary(){
  const wrap = document.getElementById("checkout-summary");
  if(!wrap) return;
  const cart = getCart();
  if(cart.length === 0){ wrap.innerHTML = "<p>Your cart is empty.</p>"; return; }
  let html = "";
  let total = 0;
  cart.forEach(i=>{
    const p = PRODUCTS.find(x=>x.id===i.id);
    total += p.price * i.qty;
    html += `<div style="display:flex;justify-content:space-between"><div>${p.title} × ${i.qty}</div><div>$${(p.price * i.qty).toFixed(2)}</div></div>`;
  });
  html += `<hr><div style="display:flex;justify-content:space-between"><strong>Total</strong><strong>$${total.toFixed(2)}</strong></div>`;
  wrap.innerHTML = html;
}

// utilities: open/close cart drawer
function openCart(){ document.getElementById("cart-overlay").style.display = "flex"; renderCart(); }
function closeCart(){ document.getElementById("cart-overlay").style.display = "none"; }

// Init
document.addEventListener("DOMContentLoaded", ()=>{
  renderCartCount();
  const grid = document.getElementById("products-grid");
  if(grid) renderProductsGrid("products-grid", PRODUCTS);
  // wire search (site search id: site-search)
  const search = document.getElementById("site-search");
  if(search){
    search.addEventListener("input", e=>{
      const q = e.target.value.toLowerCase();
      renderProductsGrid("products-grid", PRODUCTS.filter(p=>p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)));
    });
  }
  // cart overlay open/close
  document.getElementById("open-cart")?.addEventListener("click", openCart);
  document.getElementById("close-cart")?.addEventListener("click", closeCart);
  // If on product page, render product (product.html uses query ?id=)
  const prodTitle = document.getElementById("prod-title");
  if(prodTitle){
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));
    const prod = PRODUCTS.find(p => p.id === id);
    if(!prod){
      document.getElementById("product-page").innerHTML = `<p>Product not found. <button onclick="history.back()" class="back-btn">Back</button></p>`;
    } else {
      document.getElementById("prod-title").textContent = prod.title;
      document.getElementById("prod-img").src = prod.images[0];
      document.getElementById("prod-desc").textContent = prod.desc;
      document.getElementById("prod-price").textContent = "$" + prod.price.toFixed(2);
      document.getElementById("prod-add")?.addEventListener("click", ()=>{ addToCart(prod.id); });
    }
  }
  // If on cart page, render the cart page
  renderCartPage();
  renderCheckoutSummary();
});

// Sample product data
const products = [
  { id: 1, name: "school shoe", price: 50, img: "school shoe.jpg" },
  { id: 2, name: "women", price: 40, img: "women shoe.jpg" },
  { id: 3, name: "men's comfort", price: 75, img: "men.jpg" },
  { id: 4, name: "Formal Shoes", price: 45, img: "Formal shoe.jpg" },
 ];

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Add to cart function
function addToCart(id, name, price, img) {
  const item = cart.find(p => p.id === id);
  if (item) {
    item.qty++;
  } else {
    cart.push({ id, name, price, img, qty: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${name} added to cart!`);
}

// Display cart on cart.html
function displayCart() {
  const cartContainer = document.getElementById("cart-items");
  if (!cartContainer) return;

  cartContainer.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    cartContainer.innerHTML += `
      <div class="cart-item">
        <img src="${item.img}" width="60">
        <span>${item.name} (x${item.qty}) - $${item.price * item.qty}</span>
        <button onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `;
  });

  document.getElementById("cart-total").textContent = `$${total}`;
}

// Remove item
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// Clear cart (for checkout)
function checkout() {
  alert("Thank you for your purchase!");
  cart = [];
  localStorage.removeItem("cart");
  displayCart();
}

// Run displayCart if on cart.html
document.addEventListener("DOMContentLoaded", displayCart);

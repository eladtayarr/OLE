let cart = [];

function addToCart(product, price) {
  cart.push({ product, price: parseFloat(price) });
  updateCartDisplay();
  alert(product + " Added to cart");
}

function openCart() {
  const modal = document.getElementById("cartModal");
  const cartList = document.getElementById("cartList");
  cartList.innerHTML = "";
  if (cart.length === 0) {
    cartList.innerHTML = "<p>The Cart is empty</p>";
  } else {
    cart.forEach((item, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${item.product} - $${item.price.toFixed(2)}`;
      cartList.appendChild(listItem);
    });
  }
  modal.style.display = "block";
}

function closeCart() {
  document.getElementById("cartModal").style.display = "none";
}

function checkout() {
  alert("The order has been sent to the Management Team");
  cart = [];
  updateCartDisplay();
  closeCart();
}

function updateCartDisplay() {
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");
  cartCount.textContent = cart.length;
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = total.toFixed(2);
}

window.onclick = function (event) {
  const modal = document.getElementById("cartModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

document.addEventListener("DOMContentLoaded", (event) => {
  document.querySelectorAll(".order-add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const productName = this.getAttribute("data-product");
      const productPrice = this.getAttribute("data-price");
      addToCart(productName, productPrice);
    });
  });
});




function checkout() {
  const customerName = prompt("Enter your name:");
  if (!customerName) {
    alert("The customer name field is mandatory.");
    return;
  }
  fetch("/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cart, customer_name: customerName }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert("The order has been sent to the management team. Order Number: " + data.order_id);
      cart = [];
      updateCartDisplay();
      closeCart();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}


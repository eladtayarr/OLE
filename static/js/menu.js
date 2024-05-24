document.addEventListener("DOMContentLoaded", (event) => {
  fetch("/get_menu")
    .then((response) => response.json())
    .then((data) => {
      const menuTableBody = document.getElementById("menuTableBody");
      menuTableBody.innerHTML = "";
      if (data.length === 0) {
        menuTableBody.innerHTML =
          "<tr><td colspan='5'>There are no dishes on the menu</td></tr>";
      } else {
        data.forEach((dish, index) => {
          const row = document.createElement("tr");
          row.innerHTML = `
                    <td><b>${dish.name}</b></td>    
                    <td><b>${dish.description}</b></td>
                    <td><b>${dish.price} $</b></td>
                    <td><img class="menu-image" src="${dish.image}" alt="${dish.name}"></td>
                    <td><button class="order-add-to-cart" data-product="${dish.name}" data-price="${dish.price}">Add To cart</button></td>
                    `;
          menuTableBody.appendChild(row);
        });
        document.querySelectorAll(".order-add-to-cart").forEach((button) => {
          button.addEventListener("click", function () {
            const productName = this.getAttribute("data-product");
            const productPrice = this.getAttribute("data-price");
            addToCart(productName, productPrice);
          });
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

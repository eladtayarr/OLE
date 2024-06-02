

document.addEventListener('DOMContentLoaded', (event) => {
    fetch('/manager/orders')
        .then(response => response.json())
        .then(data => {
            const ordersTableBody = document.getElementById("ordersTableBody");
            ordersTableBody.innerHTML = "";
            if (data.length === 0) {
                ordersTableBody.innerHTML = "<tr><td colspan='4'>There is No Open Orders</td></tr>";
            } else {
                data.forEach((order, index) => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${order.order_id}</td>
                        <td>$${order.total_price.toFixed(2)}</td>
                        <td>${order.status}</td>
                        <td><button onclick="closeOrder('${order.order_id}')">Close Order</button></td>
                    `;
                    ordersTableBody.appendChild(row);
                });
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

function closeOrder(order_id) {
    fetch(`/manager/orders/${order_id}/close`, { method: 'POST' })
        .then(() => {
            alert('You Cloased That Order');
            location.reload();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}



document.addEventListener("DOMContentLoaded", (event) => {
    fetch("/get_reviews")
        .then((response) => response.json())
        .then((data) => {
            const reviewsTableBody = document.getElementById("reviewsTableBody");
            reviewsTableBody.innerHTML = "";
            if (data.length === 0) {
                reviewsTableBody.innerHTML = "<tr><td colspan='5'>There are no reviews</td></tr>";
            } else {
                data.forEach((review, index) => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${review.name}</td>
                        <td>${review.email}</td>
                        <td>${review.subject}</td>
                        <td>${review.message}</td>
                        <td>${review.rating}</td>
                    `;
                    reviewsTableBody.appendChild(row);
                });
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
});

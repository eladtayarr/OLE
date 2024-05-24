async function addNewOpinion(event) {
    event.preventDefault();
    
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;
    const rating = document.querySelector('input[name="rating"]:checked').value;

    const opinion = {
        name,
        email,
        subject,
        message,
        rating
    };

    try {
        const response = await fetch("/add_opinion", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(opinion),
        });

        if (response.ok) {
            alert("Opinion added successfully!");
            document.querySelector('.opnionForm').reset();
        } else {
            console.error("Failed to add opinion:", response.statusText);
            alert("Failed to add opinion. Please try again later.");
        }
    } catch (error) {
        console.error("Error adding opinion:", error);
        alert("An error occurred while adding the opinion. Please try again later.");
    }
}

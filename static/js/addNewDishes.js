document.getElementById('newDishForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('dishName', document.getElementById('dishName').value);
    formData.append('dishDescription', document.getElementById('dishDescription').value);
    formData.append('dishPrice', document.getElementById('dishPrice').value);
    formData.append('dishImage', document.getElementById('dishImage').files[0]);
    
    try {
        const response = await fetch('/add_new_dish', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('מנה נוספה בהצלחה');
            document.getElementById('newDishForm').reset();
        } else {
            alert('הייתה בעיה בהוספת המנה. נסה שוב מאוחר יותר.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('הייתה בעיה בהוספת המנה. נסה שוב מאוחר יותר.');
    }
});

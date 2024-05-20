//1.loginform
async function handleLoginFormSubmit(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();

        if (response.ok) {
            if (data.user.role === 'admin') {
                window.location.href = 'home.html';
            } else if (data.user.role === 'user') {
                window.location.href = 'user.html';
            }
        } else {
            alert('Invalid username or password');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        alert('An error occurred while logging in');
    }
}

function handleRequestLinkClick(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const mailtoLink = `mailto:eladt1010@gmail.com?subject=New%20User%20Request&body=Please%20add%20a%20new%20user%20to%20the%20system.%0D%0A%0D%0AUsername:%20${username}%0D%0APassword:%20${password}`;
    window.location.href = mailtoLink;
}

function handleVideoCanPlay() {
    const video = document.getElementById('video');
    video.play();
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', handleLoginFormSubmit);
    const requestLink = document.getElementById('requestLink');
    requestLink.addEventListener('click', handleRequestLinkClick);
    const video = document.getElementById('video');
    video.addEventListener('canplay', handleVideoCanPlay);
});

//2.bodyform
const fetchFunction = (html) => {
    fetch(html)
        .then(response => response.text())
        .then(htmlContent => {
            document.getElementById('body').innerHTML = htmlContent;
        });
}

// 3.add New dishes
async function addNewDish(event) {
    event.preventDefault();
    const Name = document.getElementById('Name').value;
    const Description = document.getElementById('Description').value;
    const Ingredients = document.getElementById('Ingredients').value;
    const price = document.getElementById('price').value;

    if (price <= 0) {
        alert('Price must be greater than 0.');
        return;
    }
    
    const dishes = {
        Name,
        Description,
        Ingredients,
        price
    };

    try {
        const response = await fetch('/dishes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dishes),
        });

        if (response.ok) {
            console.log('Dish added successfully!');
            alert('Dish added successfully!');
            document.getElementById('Name').value = '';
            document.getElementById('Description').value = '';
            document.getElementById('Ingredients').value = '';
            document.getElementById('price').value = '';
        } else {
            console.error('Failed to add dish:', response.statusText);
            alert('Failed to add dish. Please try again later.');
        }

    } catch (error) {
        console.error('Error adding dish:', error);
        alert('An error occurred while adding the dish. Please try again later.');
    }
}


async function addNewUser() {
    event.preventDefault(); 
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    
    if (username.trim() === '' || password.trim() === '') {
        alert('Username and password are required.');
        return;
    }
    const user = {
        username,
        password,
        role
    };

    try {
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        const response = await fetch('/customer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (response.ok) {
            console.log('User added successfully!');
            fetchUser(); // Update the user list
            alert('User added successfully!');

        } else {
            console.error('Failed to add user:', response.statusText);
            alert('Failed to add user. Please try again later.');
        }

    } catch (error) {
        console.error('Error adding user:', error);
        alert('An error occurred while adding the user. Please try again later.');
    }
}
//4.Date input
function convertDateFormat(inputDate) {
    const parts = inputDate.split('/');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

//5.show dishes
async function fetchDish() {
    const response = await fetch('/dishes');
    const data = await response.json();

    const DishList = document.getElementById('DishList');
    DishList.innerHTML = '';

    data.forEach((dishes) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${dishes.Name}</td>
            <td>${dishes.Description}</td>
            <td>${dishes.Ingredients}</td>
            <td>${dishes.price}</td>
        `;
        DishList.appendChild(row);
    });
}
fetchDish();

//6.add New Opinion
async function addNewOpinion() {
    event.preventDefault(); 
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    const rating = document.querySelector('input[name="rating"]:checked').value;

    const opinion = {
        name,
        email,
        subject,
        message,
        rating
    };

    try {
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('subject').value = '';
        document.getElementById('message').value = '';
        document.querySelector('input[name="rating"]:checked').checked = false;
        
        const response = await fetch('/opinion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(opinion),
        });

        if (response.ok) {
            console.log('Opinion added successfully!');
            fetchOpinion(); 
            alert('Opinion added successfully!');

        } else {
            console.error('Failed to add Opinion:', response.statusText);
            alert('Failed to add Opinion. Please try again later.');

        }

    } catch (error) {
        console.error('Error adding Opinion:', error);
        alert('An error occurred while adding the Opinion. Please try again later.');
    }
}

//7.show card Opinion
async function fetchOpinion() {
    const response = await fetch('/opinion');
    const data = await response.json();

    const opinionList = document.getElementById('opinionList');
    opinionList.innerHTML = '';

    data.forEach((opinion) => {
        const card = document.createElement('div');
        card.classList.add('opinion-card');

        card.innerHTML = `
            <h2><br>${opinion.subject}</h2>
            <h1>${opinion.name}</h1>
            <p>${opinion.email}</p>
            <h1>${opinion.rating}&nbspstars</h1>
            <p>${opinion.message}</p><br>   
        `;

        opinionList.appendChild(card);
    });
}
fetchOpinion();

//8.show Graph
function showGraph() {
    fetch('/opinion')
        .then(response => response.json())
        .then(data => {
            const opinions = data;
            const dataByName = {}; // Initialize data object to store rating counts and ratings sum by Name

            opinions.forEach(opinion => {
                const Name = opinion.subject; // Assuming the subject represents the Name
                const rating = parseInt(opinion.rating);

                if (!dataByName[Name]) {
                    dataByName[Name] = {
                        ratings: [],
                    };
                }

                dataByName[Name].ratings.push(rating);
            });

            const graphContainer = document.getElementById('barGraph');
            graphContainer.innerHTML = ''; // Clear any previous graph

            // Calculate the maximum score to determine logarithmic scaling
            let maxScore = 0;
            for (const Name in dataByName) {
                const ratingsMax = Math.max(...dataByName[Name].ratings);
                if (ratingsMax > maxScore) {
                    maxScore = ratingsMax;
                }
            }

            for (const Name in dataByName) {
                const barContainer = document.createElement('div');
                barContainer.classList.add('bar-container');

                const NameTitle = document.createElement('div');
                NameTitle.classList.add('Name-title');
                NameTitle.textContent = Name;
                barContainer.appendChild(NameTitle);

                const averageRating = document.createElement('div');
                averageRating.classList.add('average-rating');

                const ratingsSum = dataByName[Name].ratings.reduce((sum, rating) => sum + rating, 0);
                const average = ratingsSum / dataByName[Name].ratings.length;
                averageRating.textContent = `${average.toFixed(2)}★`;

                barContainer.appendChild(averageRating);

                // Use logarithmic scaling for height
                const normalizedHeight = (Math.log(average + 3) / Math.log(maxScore + 1)) * 200; // Adjust scaling as needed

                const bar = document.createElement('div');
                bar.classList.add('bar');
                bar.style.height = `${normalizedHeight}px`; // Set the bar height based on logarithmic scale
                barContainer.appendChild(bar);

                graphContainer.appendChild(barContainer);
            }
        })
        .catch(error => {
            console.error('Error fetching opinions:', error);
        });
}

showGraph();

//9.search by Name
async function searchDishs() {
    const NameInput = document.getElementById('Name');
    const Name = NameInput.value;

    const response = await fetch('/dishes');
    const data = await response.json();

    const DishList = document.getElementById('DishList');
    DishList.innerHTML = '';

    data.forEach((dishes) => {
        if (dishes.Name === Name) {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${dishes.Name}</td>
            <td>${dishes.Description}</td>
            <td>${dishes.Ingredients}</td>
            <td>${dishes.price}</td>
            `;
            DishList.appendChild(row);
        }
    });

    NameInput.value = '';
}

//10. show Specific Name
async function showSpecificNameInput() {
    const container = document.getElementById('specificNameInputContainer');
    container.style.display = 'block';
}

//11.search Dishs By Price
async function searchDishsByPriceRange() {
    const NameInput = document.getElementById('Name');
    const Name = NameInput.value;

    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const minPrice = parseFloat(minPriceInput.value);
    const maxPrice = parseFloat(maxPriceInput.value);

    // Check if the entered prices are valid and positive
    if (isNaN(minPrice) || isNaN(maxPrice) || minPrice < 0 || maxPrice < 0) {
        alert('Please enter valid positive numbers for the price range.');
        return;
    }
    
    const response = await fetch('/dishes');
    const data = await response.json();

    const DishList = document.getElementById('DishList');
    DishList.innerHTML = '';

    let DishsFound = false; // Starting point - no matching Dishs found

    data.forEach((dishes) => {
        const DishPrice = parseFloat(dishes.price);
        if (
            dishes.Name === Name &&
            DishPrice >= minPrice &&
            DishPrice <= maxPrice
        ) {
            DishsFound = true; // Matching dishes found
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${dishes.Name}</td>
            <td>${dishes.Description}</td>
            <td>${dishes.Ingredients}</td>
            <td>${dishes.price}</td>
            `;
            DishList.appendChild(row);
        }
    });

    if (!DishsFound) {
        alert('No Dishs found matching the criteria.'); // Error message
    }
    
    NameInput.value = '';
    minPriceInput.value = '';
    maxPriceInput.value = '';
}

//12.add discount for all
async function discountDish() {
    const discount = parseFloat(document.getElementById('discount').value);
    addNewCoupon()

    try {
        document.getElementById('discount').value = '';
        const response = await fetch('/updateAllDishs', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ discount }) 
        });

        const data = await response.json();
        const updatedDishsArray = Object.values(updatedDishs);
        const DishList = document.getElementById('DishList');
        DishList.innerHTML = '';

        data.Dishs.forEach((dishes) => {
            DishList.innerHTML += `<tr>
                <td>${dishes.Name}</td>
                <td>${dishes.Description}</td>
                <td>${dishes.Ingredients}</td>
                <td>${dishes.price}</td>
            </tr>`;
        });
    } catch (error) {
        console.error('Error updating and displaying Dishs:', error);
    }
    displayMessageBanner('All Dishs', 'Discount Applied to All', 'New Price', discount);
}

discountDish();

//13.ADD discount for specific
async function applyDiscount() {
    const specific = document.getElementById('specific').value;
    const discount = parseFloat(document.getElementById('discount').value);
    await addNewCoupon();

    try {
        document.getElementById('specific').value = '';
        document.getElementById('discount').value = '';
        const response = await fetch('/updateDiscount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ specific, discount }),
        });

        const updatedDishs = await response.json();
        const updatedDish = updatedDishs.find(dishes => dishes.Name === specific);

        if (updatedDish) {

            const oldPrice = updatedDish.oldPrice; 
            const newPrice = updatedDish.price;

            displayUpdatedDishs(updatedDishs);
            displayMessageBanner(specific, oldPrice, newPrice, discount);

        } else {
            console.log(`No updated dishes found for Name ${specific}`);
        }

    } catch (error) {
        console.error('Error updating and displaying Dishs:', error);
    }
}

//14.show  dishes
async function displayUpdatedDishs(updatedDishs) {
    const DishList = document.getElementById('DishList');
    DishList.innerHTML = '';

    updatedDishs.forEach((dishes) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${dishes.Name}</td>
            <td>${dishes.Description}</td>
            <td>${dishes.Ingredients}</td>
            <td>${dishes.price}</td>
        `;
        DishList.appendChild(row);
    });
}

//15.show Banner discount 
async function displayMessageBanner(Name, oldPrice, newPrice, discount) {
    
    const messageBanner = document.createElement('div');
    messageBanner.classList.add('message-banner');

    const bannerContent = document.createElement('div');
    bannerContent.innerHTML = `
        <div class="banner-row center-text">
            <span class="sale-text">SALE!</span><br><br>
        </div>
        <div class="banner-row">
            <strong>${Name}</strong><br>
        </div>
        <div class="banner-row">
            <span class="discount-percentage green-text">Discount: -${discount*100}%</span><br>
        </div>
        ${
            Name !== 'All Dishs'
                ? `
                <div class="banner-row">
                    <span class="price-details">
                        <span id="oldPriceSpan" class="old-price">${newPrice/(1-discount)}</span>
                        <span id="newPriceSpan" class="new-price">${newPrice}</span>
                    </span>
                </div><br>
            `
                : ''
        }
        <br>
        <div class="banner-row center-text">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
        &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
            <button class="see-discount-button gold-button larger-button">See Discount</button>
        </div>
        <span class="close-button">&times;</span>
    `;

    messageBanner.appendChild(bannerContent);
    document.body.appendChild(messageBanner);

    // Handle banner close button
    const closeButton = bannerContent.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(messageBanner);
    });

    const seeDiscountButton = bannerContent.querySelector('.see-discount-button');
    seeDiscountButton.addEventListener('click', () => {
        if (Name === 'All Dishs') {
            fetchFunction('search.html');
            setTimeout(() => {
                fetchDish(); 
            }, 500); 
        } else {
            fetchFunction('search.html');
            setTimeout(() => {

                document.getElementById('Name').value = Name;
                searchDishs(); 
            }, 500); 
        }
    });

    setTimeout(() => {
        document.body.removeChild(messageBanner);
    }, 9000);     
}

//16.trigger Banner
async function triggerBannerFromButton() {
    try {
        const response = await fetch('/coupon');
        const data = await response.json();
        const response2 = await fetch('/dishes');
        const data2 = await response2.json();

        if (data.length > 0) {
            const coupon = data[data.length - 1];
            const discount = coupon.discount;
            const Name = coupon.specific || 'All Dishs';
            
            let oldPrice;
            
            for (const dishes of data2) {
                if (dishes.Name === Name) {
                    oldPrice = (dishes.price) / (1 - discount);
                    break; 
                }
            }
            
            const newPrice = oldPrice * (1 - discount);
            displayMessageBanner(Name, oldPrice, newPrice, discount);
        }
        
    } catch (error) {
        console.log(error);
    }
}

//17.fetch Coupon
async function fetchCoupon() {
    const response = await fetch('/coupon');
    const data = await response.json();

    const couponList = document.getElementById('couponList');
    const couponDiscountElement = document.getElementById('couponDiscount');
    const couponSpecificElement = document.getElementById('couponSpecific');
    
    couponList.innerHTML = '';
    couponDiscountElement.textContent = '';
    couponSpecificElement.textContent = ' ';

    
    couponDiscountElement.textContent = coupon.discount;
    couponSpecificElement.textContent = coupon.specific;
    

    data.forEach((coupon) => {
        const discountElement = document.createElement('p');
        const specificElement = document.createElement('p');

        discountElement.textContent = `Discount: ${coupon.discount}`;
        specificElement.textContent = `Specific: ${coupon.specific}`;

        couponList.appendChild(discountElement);
        couponList.appendChild(specificElement);

        couponDiscountElement.textContent = coupon.discount;
        couponSpecificElement.textContent = coupon.specific;
    });
}

//18.add Coupon
async function addNewCoupon() {
    event.preventDefault(); 
    const discount = document.getElementById('discount').value;
    const specific = document.getElementById('specific').value;

    const coupon = {
        discount,
        specific
    };

    try {
        const response = await fetch('/coupon', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(coupon),
        });

        if (response.ok) { 
            console.log('Coupon added successfully!');
            fetchCoupon();
            alert('Coupon added successfully!');

        } else {
            console.error('Failed to add discount:', response.statusText);
            alert('Failed to add coupon. Please try again later.');
        }

    } catch (error) {
        console.error('Error adding discount:', error);
        alert('An error occurred while adding the coupon. Please try again later.');
    }
}

//19. fetch LastI tem
async function fetchLastItem() {
    try {
        const response = await fetch('/coupon');
        const data = await response.json();

        if (data.length > 0) {
            const coupon = data[data.length - 1];
            const couponDiscountElement = document.getElementById('couponDiscount');
            const couponSpecificElement = document.getElementById('couponSpecific');

            couponDiscountElement.textContent = `Discount: ${coupon.discount}`;
            couponSpecificElement.textContent = `Specific: ${coupon.specific}`;
        }

    } catch (error) {
        console.log(error);
    }
}

//20.add New user
async function addNewUser() {
    event.preventDefault(); 
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    
    if (username.trim() === '' || password.trim() === '') {
        alert('Username and password are required.');
        return;
    }
    const user = {
        username,
        password,
        role
    };

    try {
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        const response = await fetch('/customer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (response.ok) {
            console.log('User added successfully!');
            fetchUser(); // Update the user list
            alert('User added successfully!');

        } else {
            console.error('Failed to add user:', response.statusText);
            alert('Failed to add user. Please try again later.');
        }

    } catch (error) {
        console.error('Error adding user:', error);
        alert('An error occurred while adding the user. Please try again later.');
    }
}

//21.delete User
async function deleteUser(username) {
    try {
        const response = await fetch(`/customer/${username}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log('User deleted successfully!');
            fetchUser(); 
            alert('User deleted successfully!');

        } else {
            console.error('Failed to delete user:', response.statusText);
            alert('Failed to delete user. Please try again later.');

        }
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('An error occurred while deleting the user. Please try again later.');
    }
}

//22. show User
async function fetchUser() {
    const response = await fetch('/customer');
    const data = await response.json();

    const userList = document.getElementById('userList');
    userList.innerHTML = '';

    data.forEach((user) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.password}</td>
            <td>${user.role}</td>
            <td><label class="switch">
            <input type="checkbox" checked>
            <span class="slider round" onclick="deleteUser('${user.username}')"> </td>
        `;
        userList.appendChild(row);
    });
}

fetchUser();

 //23. add Feedback email
 async function submitFeedback() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const feedback = document.getElementById('feedback').value;

    const formData = {
        name: name,
        email: email,
        feedback: feedback
    };

    fetch('/submitFeedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Error submitting feedback:', data.error);
            alert('An error occurred while submitting feedback.');

        } else {
            console.log('Feedback submitted successfully:', data.message);
            alert(data.message);
            
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('feedback').value = '';
        }
    })
    .catch(error => {
        console.error('Error submitting feedback:', error);
        alert('An error occurred while submitting feedback.');
    });
}




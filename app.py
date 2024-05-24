import os
from flask import Flask, render_template, redirect, url_for, request, flash, jsonify
from flask_pymongo import PyMongo
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from bson.objectid import ObjectId
import database

app = Flask(__name__)
app.config['SECRET_KEY'] = '0rsppWZt0kr5v1zclzlMFi3PEmGVgUT0HKaQZ68oiiLBERCRufUYRFy3b9UFanm2'
app.config['MONGO_URI'] = "mongodb+srv://elad:elad@cluster0.ecf8sfr.mongodb.net/myNewDatabase?retryWrites=true&w=majority"
mongo = PyMongo(app)
db=mongo.db
app.config['UPLOAD_FOLDER'] = 'static/uploads/'

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

class User(UserMixin):
    def __init__(self, username, _id):
        self.username = username
        self.id = str(_id)

    @staticmethod
    def get(user_id):
        user_data = mongo.db.users.find_one({"_id": ObjectId(user_id)})
        if user_data:
            return User(username=user_data['username'], _id=user_data['_id'])
        return None


@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)

# CONNECTION --- LOGIN AND REGISTER

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        hashed_password = generate_password_hash(password)  # Default method 'pbkdf2:sha256'
        if mongo.db.users.find_one({"username": username}):
            flash('Username already exists', 'danger')
            return redirect(url_for('register'))
        mongo.db.users.insert_one({"username": username, "password": hashed_password})
        flash('Registration successful! Please log in.', 'success')
        return redirect(url_for('login'))
    return render_template('connection/register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        user_data = mongo.db.users.find_one({"username": username})
        if user_data and check_password_hash(user_data['password'], password):
            user = User(username=user_data['username'], _id=user_data['_id'])
            login_user(user)
            return redirect(url_for('home'))
        else:
            flash('Login Unsuccessful. Please check username and password', 'danger')
    return render_template('connection/login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))

# BASE

@app.route('/')
def home():
    return render_template('index.html')


@app.route('/user')
def user():
    return render_template('user.html')


# ADMIN

@app.route('/admin')
def admin():
    return render_template('Admin/admin.html')

@app.route('/AddDishes')
def addNewDishes():
    return render_template('Admin/addNewDishes.html')

@app.route('/ReviewView')
def ReviewView():
    return render_template('Admin/ReviewView.html')



# MENU

@app.route('/menu')
def menu():
    return render_template('menu.html')

@app.route('/get_menu', methods=['GET'])
def get_menu():
    menu = database.get_menu()
    return jsonify(menu)

# ADD NEW DISH
@app.route('/add_new_dish', methods=['POST'])
def add_new_dish():
    dish_name = request.form['dishName']
    dish_description = request.form['dishDescription']
    dish_price = request.form['dishPrice']
    dish_image = request.files['dishImage']
    
    if dish_image:
        filename = secure_filename(dish_image.filename)
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        dish_image.save(image_path)

        # Save to database
        database.add_dish(dish_name, dish_description, dish_price, image_path)
        
        return jsonify({"message": "Dish added successfully"}), 201
    else:
        return jsonify({"message": "Failed to add dish"}), 400



# MANAGER

@app.route('/management')
def management():
    return render_template('Manager/management.html')

@app.route('/manager')
def manager():
    return render_template('Manager/manager.html')

@app.route('/manager/orders', methods=['GET'])
def get_open_orders():
    orders = database.get_open_orders()
    return jsonify(orders)

@app.route('/manager/orders/<order_id>/close', methods=['POST'])
def close_order(order_id):
    database.close_order(order_id)
    return '', 204

@app.route('/checkout', methods=['POST'])
def checkout():
    data = request.json
    cart = data['cart']
    customer_name = data['customer_name']
    order_id = database.add_order(cart, customer_name)
    return jsonify({"order_id": order_id})


# CUSTOMER

@app.route('/CustomerHome')
def CustomerHome():
    return render_template('Customer/CustomerHome.html')

@app.route('/NewOrder')
def NewOrder():
    return render_template('Customer/NewOrder.html')

@app.route('/ProductReview')
def ProductReview():
    return render_template('Customer/ProductReview.html')

# Opinion

@app.route('/add_opinion', methods=['POST'])
def add_opinion():
    data = request.json
    name = data['name']
    email = data['email']
    subject = data['subject']
    message = data['message']
    rating = data['rating']
    success = database.add_opinion(name, email, subject, message, rating)
    if success:
        return jsonify({"message": "Opinion added successfully"}), 201
    else:
        return jsonify({"message": "Failed to add opinion"}), 400


# Review

@app.route('/get_reviews', methods=['GET'])
def get_reviews():
    reviews = database.get_reviews()
    return jsonify(reviews)



if __name__ == '__main__':
    app.run(debug=True)
import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from werkzeug.security import check_password_hash
from flask import Flask, render_template, redirect, url_for, request, flash, jsonify, send_from_directory
from flask_login import LoginManager, login_user, login_required, logout_user
from werkzeug.utils import secure_filename
import models.database as database

app = Flask(__name__, template_folder='../views/templates', static_folder='../views/static')
app.secret_key = '0rsppWZt0kr5v1zclzlMFi3PEmGVgUT0HKaQZ68oiiLBERCRufUYRFy3b9UFanm2'

app.config['UPLOAD_FOLDER'] = 'views/static/uploads/'

@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory('../controllers/js', filename)

#######################################
#           MAIN/INDEX                #      
#       INDEX OF THE WEBSITE          #
#######################################
@app.route('/')
def home():
    return render_template('index.html')

#######################################
#           CONNECTION                #      
#       LOGIN AND REGISTER            #
#######################################
login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return database.User.get(user_id)

#     REGISTER
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        if database.users.find_one({"username": username}):
            return render_template('connection/register.html')
        database.register(username, password)
        return redirect(url_for('login'))
    return render_template('connection/register.html')

#     LOGIN
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        user_data = database.users.find_one({"username": username})
        if user_data and check_password_hash(user_data['password'], password):
            user = database.User(username=user_data['username'], _id=user_data['_id'])
            login_user(user)
            return redirect(url_for('home'))
    return render_template('connection/login.html')

#     LOGOUT
@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))

#######################################
#               ADMIN                 #
#######################################

#     ADMIN HOME PAGE
@app.route('/admin')
def admin():
    return render_template('Admin/admin.html')

#     ADD NEW DISH TO THE MENU
@app.route('/AddDishes')
def addNewDishes():
    return render_template('Admin/addNewDishes.html')

#     UPDATE MENU INFO IN DATABASE
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

#     VIEW ALL THE COUSTOMES REVIEWS
@app.route('/ReviewView')
def ReviewView():
    return render_template('Admin/ReviewView.html')

#     GET ALL THE COUSTOMES REVIEWS FROM DATABASE
@app.route('/get_reviews', methods=['GET'])
def get_reviews():
    reviews = database.get_reviews()
    return jsonify(reviews)

#######################################
#               MANAGER               #
#######################################

#     MANAGER HOME PAGE
@app.route('/manager')
def manager():
    return render_template('Manager/manager.html')

#     MANAGER VIEW OPEN ORDERS
#     GET INFO FROM DATABASE
@app.route('/manager/orders', methods=['GET'])
def get_open_orders():
    orders = database.get_open_orders()
    return jsonify(orders)

#     UPDATE INFO OF ORDERS IN DATABASE
@app.route('/manager/orders/<order_id>/close', methods=['POST'])
def close_order(order_id):
    database.close_order(order_id)
    return '', 204

#     UPDATE THE MANAGER TABLE IN A NEW ORDERS (AFTER CHACKOUT)
@app.route('/checkout', methods=['POST'])
def checkout():
    data = request.json
    cart = data['cart']
    customer_name = data['customer_name']
    order_id = database.add_order(cart, customer_name)
    return jsonify({"order_id": order_id})

#######################################
#               CUSTOMER              #
#######################################

#     COUSTOMER HOME PAGE
@app.route('/CustomerHome')
def CustomerHome():
    return render_template('Customer/CustomerHome.html')

#     CREATE A NEW ORDER WINDOW
@app.route('/NewOrder')
def NewOrder():
    return render_template('Customer/NewOrder.html')

#     CREATE A NEW REVIEW WINDOW
@app.route('/ProductReview')
def ProductReview():
    return render_template('Customer/ProductReview.html')

#     ADD A NEW OPINION (REVIEW) TO THE DATABASE
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

#######################################
#               MENU                  #
#######################################

#     FULL MENU TABLE
@app.route('/menu')
def menu():
    return render_template('menu.html')

#     GET MENU INFO FROM DATABASE
@app.route('/get_menu', methods=['GET'])
def get_menu():
    menu = database.get_menu()
    return jsonify(menu)

#     RUN APP (CREATE THE WINDOW ON THE BROWSER)
if __name__ == '__main__':
    app.run(debug=True)

from flask import Flask, render_template, redirect, url_for, request, flash, jsonify
from flask_pymongo import PyMongo
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId

app = Flask(__name__)
app.config['SECRET_KEY'] = '0rsppWZt0kr5v1zclzlMFi3PEmGVgUT0HKaQZ68oiiLBERCRufUYRFy3b9UFanm2'
app.config['MONGO_URI'] = "mongodb+srv://elad:elad@cluster0.ecf8sfr.mongodb.net/myNewDatabase?retryWrites=true&w=majority"
mongo = PyMongo(app)
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
    return render_template('register.html')

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
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))

@app.route('/')
def home():
    return render_template('index.html')



@app.route('/add_dish',  methods=['POST'])
def add_dish():
    Name = request.form.get('Name')
    Description = request.form.get('Description')
    Ingredients = request.form.get('Ingredients')
    price = request.form.get('price')
    mongo.db.dishes.insert_one({"Name": Name, "Description": Description, "Ingredients": Ingredients, "price": price})
    return redirect(url_for('add_dish'))

        
@app.route('/blog')
def blog():
    return render_template('blog.html')

@app.route('/discount')
def discount():
    return render_template('discount.html')

@app.route('/graph')
def graph():
    return render_template('graph.html')

@app.route('/home')
def home_page():
    return render_template('home.html')

@app.route('/message')
def message():
    return render_template('message.html')

@app.route('/opinion')
def opinion():
    return render_template('opinion.html')

@app.route('/sale')
def sale():
    return render_template('sale.html')

@app.route('/search')
def search():
    return render_template('search.html')

@app.route('/user')
def user():
    return render_template('user.html')

@app.route('/menu')
def menu():
    menu_items = mongo.db.dishes.find()
    return render_template('menu.html', menu_items=menu_items)

# ADMIN

@app.route('/admin')
def admin():
    return render_template('Admin/admin.html')

@app.route('/DishesDetails')
def DishesDetails():
    return render_template('Admin/DishesDetails.html')

@app.route('/ExistingOrders')
def ExistingOrders():
    return render_template('Admin/ExistingOrders.html')

@app.route('/ClosedOrders')
def ClosedOrders():
    return render_template('Admin/ClosedOrders.html')

@app.route('/Graphs')
def Graphs():
    return render_template('graph.html')

# MANAGER

@app.route('/management')
def management():
    return render_template('Manager/management.html')

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



if __name__ == '__main__':
    app.run(debug=True)
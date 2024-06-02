import uuid
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from bson.objectid import ObjectId

MONGO_URI = "mongodb+srv://elad:elad@cluster0.ecf8sfr.mongodb.net/myNewDatabase?retryWrites=true&w=majority"

client = MongoClient(MONGO_URI)
db = client.myNewDatabase
users = db.users
orders_collection = db.OpenOrders
menu_collection = db.Menu
Opinion = db.Opinion

class User(UserMixin):
    def __init__(self, username, _id):
        self.username = username
        self.id = str(_id)

    @staticmethod
    def get(user_id):
        user_data = users.find_one({"_id": ObjectId(user_id)})
        if user_data:
            return User(username=user_data['username'], _id=user_data['_id'])
        return None

def register(username, password):
    hashed_password = generate_password_hash(password)  # Default method 'pbkdf2:sha256'
    user = {
        "username" : username,
        "password" : hashed_password
    }
    result = users.insert_one(user)
    return result.inserted_id is not None


def loginDatabase(user_data):
    hashed_password = generate_password_hash(password)  # Default method 'pbkdf2:sha256'
    user = {
        "username" : username,
        "password" : hashed_password
    }
    result = users.insert_one(user)
    return result.inserted_id is not None
    
#######################################
#          NEW   ORDER                #
#######################################
def add_order(cart, customer_name):
    order_id = str(uuid.uuid4())
    total_price = sum(item['price'] for item in cart)
    order = {
        "order_id": order_id,
        "customer_name": customer_name,
        "cart": cart,
        "total_price": total_price,
        "status": "open"
    }
    orders_collection.insert_one(order)
    return order_id

def convert_order_to_json(order):
    return {
        "_id": str(order["_id"]),
        "order_id": order.get("order_id", ""),
        "total_price": order.get("total_price", 0),
        "status": order.get("status", "")
    }
    
def get_open_orders():
    orders = list(orders_collection.find({"status": "open"}))
    return [convert_order_to_json(order) for order in orders]

def close_order(order_id):
    orders_collection.update_one({"order_id": order_id}, {"$set": {"status": "closed"}})




#######################################
#             OPINION                 #
#######################################

def add_opinion(name, email, subject, message, rating):
    opinion = {
        "name": name,
        "email": email,
        "subject": subject,
        "message": message,
        "rating": rating
    }
    result = Opinion.insert_one(opinion)
    return result.inserted_id is not None

def convert_review_to_json(review):
    return {
        "name": review.get("name", ""),
        "email": review.get("email", ""),
        "subject": review.get("subject", ""),
        "message": review.get("message", ""),
        "rating": review.get("rating", 0)
    }

def get_reviews():
    reviews = list(Opinion.find())
    return [convert_review_to_json(review) for review in reviews]


#######################################
#             MENU                    #
#######################################

def add_dish(name, description, price, image_path):
    dish = {
        "name": name,
        "description": description,
        "price": price,
        "image": image_path
    }
    menu_collection.insert_one(dish)

def convert_dish_to_json(dish):
    return {
        "name": dish.get("name", ""),
        "description": dish.get("description", ""),
        "price": dish.get("price", ""),
        "image": dish.get("image", "")
    }
    
def get_menu():
    menu = list(menu_collection.find())
    return [convert_dish_to_json(dish) for dish in menu]


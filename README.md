# הפרויקט הסופי: OLE-pâtisserie

## קורס: פיתוח מערכות Web

### שמות המגישים:
- אלעד טייר - 318784097
- אור מנחם - 323871335
- ליאור סיני - 206626640

---
# הסבר לקובץ App.py 

## ייבוא ספריות

- **OS**: מודול עבור מערכת הפעלה ופעולות הקשורות (MAC במקרה שלנו).
```python
import os
```
- **Flask**: מסגרת ליצירת אפליקציות מבוססות WEB. הוא כולל פונקציות עוזר לטיפול בתגובות HTTP, ניתוב ותבניות HTML.
  - Flask: מחלקה היוצרת את האפליקציה הוובית.
  - render emplate: פונקציה לרנדר קבצי HTML באמצעות Jinja2 template engine.
  - redirect: פונקציה להפניית המשתמש ל-URL אחר.
  - url_for: פונקציה ליצירת URL עבור פונקציות מוגדרות באפליקציה.
  - request: אובייקט המכיל מידע על הבקשה הנוכחית (GET או POST).
  - flash: פונקציה להצגת הודעות זמניות למשתמש.
  - jsonify: פונקציה להחזרת תגובות JSON.
```python
from flask import Flask, render_template, redirect, url_for, request, flash, jsonify
```
- **PyMongo**: מודול לחיבור למסד הנתונים MongoDB.
```python
from flask_pymongo import PyMongo
```
- **Flask_login**: מודול המספק יכולות כניסה של משתמשים ליישומים.
  - LoginManager: מחלקה לניהול התחברות משתמשים באפליקציה.
  - UserMixin: מחלקה שניתן להוריש למודלי המשתמשים כדי להוסיף תכונות שימושיות.
  - login_user: פונקציה לחיבור משתמש.
  - login_required: דקורטור להגבלת גישה לפונקציות למשתמשים מחוברים בלבד.
  - logout_user: פונקציה לניתוק משתמש.
  - current_user: אובייקט שמייצג את המשתמש הנוכחי המחובר.
```python
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
```
- **Werkzeug**: פונקציות להצפנת סיסמה ואימות.
  - generate_password_hash: פונקציה ליצירת hash מסיסמה (הצפנת סיסמה).
  - check_password_hash: פונקציה לבדיקת התאמה בין סיסמה וסיסמת hash.
  - secure_filename פונקציה שמסייעת לאבטח שמות קבצים שמעלים לאפליקציה.
```python
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
```
- **ObjectId**: יוצר מזהים עבור אובייקטים במסד הנתונים.
  - ObjectId מחלקה המשמשת לזיהוי ייחודי של מסמכים במסד הנתונים MongoDB.
```python
from bson.objectid import ObjectId
```
- **Database**: מבצעים קישור לקובץ הפייתון של בסיס הנתונים ע"י השורה יבוא קובץ הפייתון של מסד הנתונים
  - database, מייבא את המודול. ככל הנראה מודול מקומי המכיל פונקציות או מחלקות לעבודה עם מסד הנתונים באפליקציה.
```python
import database
```

## הגדרת תצוגה

-	הגדרת מופע של האפליקציה ע"י שימוש ב-FLASK. לאחריו מבוצע קישור לAPI ומייצרים תצוגה.
 ```python
app = Flask(__name__)
app.config['SECRET_KEY'] = '0rsppWZt0kr5v1zclzlMFi3PEmGVgUT0HKaQZ68oiiLBERCRufUYRFy3b9UFanm2'
app.config['MONGO_URI'] = "mongodb+srv://elad:elad@cluster0.ecf8sfr.mongodb.net/myNewDatabase?retryWrites=true&w=majority"
```

## מחלקת USER 
- אשר מייצגת את המשתמש, המחלקה מכילה שיטות להחזרת המשתמש מה-DB.
- מחלקה המייצגת משתמש באפליקציה. היא יורשת מהמחלקה UserMixin שמספקת מספר מתודות שימושיות לניהול משתמשים ב-Flask-Login.

 ```python
class User(UserMixin):
```
- הפונקציה המייצרת (constructor) של המחלקה. היא מקבלת את שם המשתמש (username) ואת ה-ID של המשתמש (המסד נתונים MongoDB משתמש ב-ObjectId).
- self.username = username: שומרת את שם המשתמש.
- self.id = str(_id): שומרת את ה-ID של המשתמש כטקסט.

```python
    def __init__(self, username, _id):
        self.username = username
        self.id = str(_id)
```
- פונקציה סטטית שניתן לקרוא לה בלי ליצור מופע של המחלקה User. היא מחפשת במסד הנתונים את המשתמש לפי ה-ID שלו.
- user_data = mongo.db.users.find_one({"_id": ObjectId(user_id)}): מחפש את המשתמש במסד הנתונים MongoDB על פי ה-ID.אם נמצא משתמש  
-   (if user_data:), היא יוצרת מופע חדש של המחלקה User עם שם המשתמש ו-ID מהמסד הנתונים ומחזירה אותו.
-   אם לא נמצא משתמש, היא מחזירה None.
```python
    @staticmethod
    def get(user_id):
        user_data = mongo.db.users.find_one({"_id": ObjectId(user_id)})
        if user_data:
            return User(username=user_data['username'], _id=user_data['_id'])
        return None
```

- פונקציה זו היא ה-user loader של Flask-Login. Flask-Login משתמש בה כדי לטעון את המשתמש המחובר כרגע לפי ה-ID שלו.
- @login_manager.user_loader: דקורטור של Flask-Login המסמן את הפונקציה הזאת כפונקציית הטעינה של המשתמשים.
- def load_user(user_id):: פונקציה שמקבלת את ה-ID של המשתמש.
- return User.get(user_id): מחזירה מופע של המחלקה User על ידי קריאה לפונקציה הסטטית get עם ה-ID של המשתמש.

```python
@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)
```
## ניהול התחברות המשתמשים
### מכיל את הפוקנציות להתחברות, התנתקות או רישום לאפליקציה.

- **Register**: פונקציה שבזמן בקשת POST היא מקבלת שם וסיסמא, מבצעת הצפנה לסיסמא ובודקת אם השם משתמש כבר קיים במסד נתונים, במידה וכן מקפיצה שגיאה למשתמש, אחרת מכניסה את המשתמש למסד נתונים ומודיעה על הרשמה.
 ```python
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
```
- **Login()**: פונקציה המאפשרת התחברות משתמשים קיימים, מקבלת שם משתמש וסיסמא ע"י בקשת POST, מחפשת את השם במסד הנתונים ובודקת את נכונות הסיסמא. במידה ויש התאמה מבצעת התחברות, אחרת מחזירה שגיאה למשתמש.
 ```python
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
```
- **Logout()**: פונקציה שמבצעת התנתקות של משתמש שמחובר למערכת ברגע זה, מבוצע פה שימוש בפונקציה שיובאה בהתחלה LOGOUT_USER().
 ```python
@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))
```
---

## ניהול דפי המשתמשים
 הגדרת תצורת עמודים לפי סוג משתמש (בכלל המקרים מבוצעת קריאה לקובצי JS)
### בעלים	Admin()
- דף הבית של הבעלים.
```python
@app.route('/admin')
def admin():
    return render_template('Admin/admin.html')
```
  - באפשרותו לגשת לדף addNewDish.html שיכיל את הפונקציה addNewDish שבאמצעותה יוכל להוסיף מנה לתפריט.
```python
@app.route('/AddDishes')
def addNewDishes():
    return render_template('Admin/addNewDishes.html')

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
```
  - בנוסף, באפשרותו לצפות בחוות דעת שניתנו ע"י הלקוחות reviewview().
  - לאחריה קיימת פונקציה מסוג GET שאחראית לקבלת הנתונים ממסד הנתונים. לבסוף מתרגמת את חוות הדעת מ- JSON ומחזירה.

```python
@app.route('/ReviewView')
def ReviewView():
    return render_template('Admin/ReviewView.html')

@app.route('/get_reviews', methods=['GET'])
def get_reviews():
    reviews = database.get_reviews()
    return jsonify(reviews)
```
---

### מנהל	Manager()
- דף הבית של המנהל.
```python
@app.route('/manager')
def manager():
    return render_template('Manager/manager.html')
```
  - באפשרותו לצפות בהזמנות פתוחות ע"י הפונקציה Checkout. הנ"ל מכיל 2 פונקציות, האחת מסוג GET שביכולתה לקבל מידע ממסד הנתונים, השניה מסוג POST שביכולתה לעדכן את מסד הנתונים.

```python
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
```
---



### לקוח	Customer()

- דף הבית של הלקוח.
```python
@app.route('/CustomerHome')
def CustomerHome():
    return render_template('Customer/CustomerHome.html')
```
  - באפשרותו לייצר הזמנה חדשה neworder()

```python
@app.route('/NewOrder')
def NewOrder():
    return render_template('Customer/NewOrder.html')
```
- לגשת לדף productreview.html המכיל פונקציית POST בשם addOpinion() שבאמצעותה יוכל להזין נתוני חוות דעת במסד הנתונים

```python
@app.route('/ProductReview')
def ProductReview():
    return render_template('Customer/ProductReview.html')

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
```
---


## תפריט המסעדה
- דף התפריט של המסעדה
```python
@app.route('/menu')
def menu():
    return render_template('menu.html')
```
  
- פונקציה ששמקבלת ממסד הנתונים את הפרטים אודות המנות הרלוונטיות
```python
@app.route('/get_menu', methods=['GET'])
def get_menu():
    menu = database.get_menu()
    return jsonify(menu)
```

# Database.py
## הגדרת כתובת API
```python
SECRET_KEY = '0rsppWZt0kr5v1zclzlMFi3PEmGVgUT0HKaQZ68oiiLBERCRufUYRFy3b9UFanm2'
MONGO_URI = "mongodb+srv://elad:elad@cluster0.ecf8sfr.mongodb.net/myNewDatabase?retryWrites=true&w=majority"
```
## הגדרת הקולקציות שבבסיס הנתונים
```python
client = MongoClient(MONGO_URI)
db = client.myNewDatabase
orders_collection = db.OpenOrders
menu_collection = db.Menu
```

## פונקציות שמופעלות על בסיס הנתונים

### NewOrder()
- Add_order - פונקציה שמוסיפה הזמנה חדשה לבסיס הנתונים
```python
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
```
- Convert_order_to_json - פונקציה שממירה את נתוני ההזנה החדשה לקובץ json
```python
def convert_order_to_json(order):
    return {
        "_id": str(order["_id"]),
        "order_id": order.get("order_id", ""),
        "total_price": order.get("total_price", 0),
        "status": order.get("status", "")
    }
```
- Get_open_orders - מקבלת מבסיס הנתונים הזמנות שסטטוס ההזמנה שלהם ״פתוח״
```python
def get_open_orders():
    orders = list(orders_collection.find({"status": "open"}))
    return [convert_order_to_json(order) for order in orders]
```
- Close_order - מבצע עדכון על בסיס הנתונים לפי מספר ההזמנה אודות ההזמנה שהסטטוס שלהם עודכן על ידי המנהל כ-״סגור״
```python
def close_order(order_id):
    orders_collection.update_one({"order_id": order_id}, {"$set": {"status": "closed"}})
```


### Opinion()
- Add_opinion - פונקציה שמוסיפה חוות דעת חדשה לבסיס הנתונים
```python
def add_opinion(name, email, subject, message, rating):
    opinion = {
        "name": name,
        "email": email,
        "subject": subject,
        "message": message,
        "rating": rating
    }
    result = db.Opinion.insert_one(opinion)
    return result.inserted_id is not None
```
- Convert_review_to_json - פונקציה שממירה את נתוני החוות דעת לקובץ json
```python
def convert_review_to_json(review):
    return {
        "name": review.get("name", ""),
        "email": review.get("email", ""),
        "subject": review.get("subject", ""),
        "message": review.get("message", ""),
        "rating": review.get("rating", 0)
    }
```
- get_reviews() - פונקציה שמקבלת מבסיס הנתונים את חוות הדעת שהוזנו ומציגה אותן
```python
def get_reviews():
    reviews = list(db.Opinion.find())
    return [convert_review_to_json(review) for review in reviews]
```

## הגדרת כתובת API


## הגדרת כתובת API




# App.py הסבר

## ייבוא ספריות

- **OS**: מודול עבור מערכת הפעלה ופעולות הקשורות (MAC במקרה שלנו).
- **Flask**: מסגרת ליצירת אפליקציות מבוססות WEB. הוא כולל פונקציות עוזר לטיפול בתגובות HTTP, ניתוב ותבניות HTML.
- **PyMongo**: מודול לחיבור למסד הנתונים MongoDB.
- **Flask_login**: מודול המספק יכולות כניסה של משתמשים ליישומים.
- **Werkzeug**: פונקציות להצפנת סיסמה ואימות.
- **ObjectId**: יוצר מזהים עבור אובייקטים במסד הנתונים.
- קישור נוסף לקובץ מסד הנתונים של Python באמצעות `ייבוא ​​מסד נתונים`.
- **Database**: מבצעים קישור לקובץ הפייתון של בסיס הנתונים ע"י השורה יבוא קובץ הפייתון של מסד הנתונים

## הגדרת תצוגה

-	הגדרת מופע של האפליקציה ע"י שימוש ב-FLASK. לאחריו מבוצע קישור לAPI ומייצרים תצוגה. 

## פתיחת מחלקת USER 
- אשר מייצגת את המשתמש, המחלקה מכילה שיטות להחזרת המשתמש מה-DB.

## ניהול משתמשים
### מכיל את הפוקנציות להתחברות, התנתקות או רישום לאפליקציה.

- **Register**: פונקציה שבזמן בקשת POST היא מקבלת שם וסיסמא, מבצעת הצפנה לסיסמא ובודקת אם השם משתמש כבר קיים במסד נתונים, במידה וכן מקפיצה שגיאה למשתמש, אחרת מכניסה את המשתמש למסד נתונים ומודיעה על הרשמה. 
- **Login()**: פונקציה המאפשרת התחברות משתמשים קיימים, מקבלת שם משתמש וסיסמא ע"י בקשת POST, מחפשת את השם במסד הנתונים ובודקת את נכונות הסיסמא. במידה ויש התאמה מבצעת התחברות, אחרת מחזירה שגיאה למשתמש. 
- **Logout()**: פונקציה שמבצעת התנתקות של משתמש שמחובר למערכת ברגע זה, מבוצע פה שימוש בפונקציה שיובאה בהתחלה LOGOUT_USER().

## Page Configurations

- **Home Page Setup**: Independent of user type.
- **User-Specific Pages**: In all cases, calls to JavaScript files are made.
  - **Admin()**: Access to add new dishes and view customer reviews.
  - **Manager()**: View open orders and update database with order statuses.
  - **Customer()**: Create new orders and submit product reviews.
  - **Menu()**: Access the menu page, retrieve dishes from the database.

## Database.py

- API address and password settings.
- Functions for interacting with the database:
  - Add new orders, update orders, convert orders to JSON, manage reviews, and get menu details.

## Scripts (JS)

- Includes redirections to functions in `app.py` or `database.py` written in Python.
- Functions include adding new dishes, managing cart operations, and submitting product review.

## Templates

- **Index**: Home page.
- Menu: Displays dishes in a tabular form.
- Different templates based on user type for login, registration, admin operations, and customer interactions.

## CSS

- Contains page designs.

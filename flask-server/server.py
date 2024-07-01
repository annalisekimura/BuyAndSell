from flask import Flask, request, jsonify, redirect
from flask.templating import render_template
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate, migrate
from datetime import datetime
from sqlalchemy import create_engine


app = Flask(__name__)


# adding configurations for using a sqlite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_BINDS'] = {'two' : 'sqlite:///two.db',
                                  'three' : 'sqlite:///three.db',
                                  'four' : 'sqlite:///four.db'}

# creating an SQLAlchemy instance
db = SQLAlchemy(app)

# get the engines for each bind key and set isolation level
with app.app_context():
    db.engine.execution_options(isolation_level='REPEATABLE READ')
    db.engines['two'].execution_options(isolation_level='REPEATABLE READ')
    db.engines['three'].execution_options(isolation_level='REPEATABLE READ')
    db.engines['four'].execution_options(isolation_level='REPEATABLE READ')

# settings for migrations
migrate = Migrate(app, db)


# models
class Profile(db.Model):
    # id: Field which stores unique id for every row in database table
    # first_name: Used to store the first name of the user
    # last_name: Used to store last name of the user
    # Age: Used to store the age of the user
    id = db.Column(db.Integer, primary_key=True, index = True)
    first_name = db.Column(db.String(20), unique=False, nullable=False)
    last_name = db.Column(db.String(20), unique=False, nullable=False)
    age = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f"Id : {self.id}, Name: {self.first_name}, Email: {self.last_name}, Number: {self.age}"

class Seller(db.Model):
    __bind_key__ = 'two'
    id = db.Column(db.Integer, primary_key=True, index = True)
    first_name = db.Column(db.String(20), unique=False, nullable=False)
    last_name = db.Column(db.String(20), unique=False, nullable=False)
    age = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f"Id : {self.id}, Name: {self.first_name}, Email: {self.last_name}, Number: {self.age}"
    
class Order(db.Model):
    __bind_key__ = 'three'
    buyer_id = db.Column(db.Integer, primary_key=False, index = True)
    order_id = db.Column(db.Integer, primary_key=True)
    listing_id = db.Column(db.Integer, nullable=False)
    seller_id = db.Column(db.Integer, nullable=False)
    date_ordered = db.Column(db.String(40), unique=False, nullable=False)

    def __repr__(self):
        return f"Buyer ID: {self.buyer_id}, Order ID : {self.order_id}, Buyer: {self.listing_id}, Seller: {self.seller_id}, Date: {self.date_ordered}"
    
class Listing(db.Model):
    __bind_key__ = 'four'
    listing_id = db.Column(db.Integer, primary_key=True, index=True)
    seller_id = db.Column(db.Integer, nullable=False)
    max_quantity = db.Column(db.Integer, nullable=False)
    ppu = db.Column(db.Integer, nullable=False)
    location = db.Column(db.String(20), unique=False, nullable=False)

    def __repr__(self):
        return f"Listing : {self.listing_id}, Seller: {self.seller_id}, Quantity: {self.max_quantity}, Price: {self.ppu}, Location: {self.location}"

# Members API Route
@app.route('/')
def index():
    db.create_all()
    return render_template('home.html')

@app.route('/one')
def index1():
    profiles = Profile.query.all()
    return render_template('index.html', profiles=profiles)

@app.route('/two')
def index2():
    seller = Seller.query.all()
    return render_template('index.html', seller=seller)



@app.route('/three')
def index3():
    order = Order.query.all()
    return render_template('order.html', order=order)

@app.route('/four')
def index4():
    listing = Listing.query.all()
    return render_template('listing.html', listing=listing)

@app.route('/five')
def index5():
    listing = Listing.query.all()
    return render_template('view_list.html', listing=listing)

@app.route('/add_data')
def add_data():
    return render_template('add_profile.html')

@app.route('/add_seller')
def add_seller():
    return render_template('add_profile.html')

@app.route('/add_order')
def add_order():
    return render_template('add_order.html')

@app.route('/add_listing')
def add_listing():
    return render_template('add_listing.html')

# function to add buyers
@app.route('/add', methods=["POST"])
def profile():

    first_name = request.form.get("first_name")
    last_name = request.form.get("last_name")
    age = request.form.get("age")

    if first_name != '' and last_name != '' and age is not None:
        p = Profile(first_name=first_name, last_name=last_name, age=age)
        db.session.add(p)
        db.session.commit()
        return redirect('/BuyerPage')
    else:
        return redirect('/BuyerPage')

# function to add sellers
@app.route('/add2', methods=["POST"])
def seller():
    first_name = request.form.get("first_name2")
    last_name = request.form.get("last_name2")
    age = request.form.get("age2")

    if first_name != '' and last_name != '' and age is not None:
        p = Seller(first_name=first_name, last_name=last_name, age=age)
        db.session.add(p)
        db.session.commit()
        return redirect('/SellerPage')
    else:
        return redirect('/SellerPage')

# function to add orders 
@app.route('/add3', methods=["POST"])
def order():
    buyer_id = request.form.get("buyer_id")
    listing_id = request.form.get("listing_id")
    seller_id = request.form.get("seller_id")
    date_ordered = request.form.get("date_ordered")

    if listing_id is not None and seller_id is not None and date_ordered is not None:
        p = Order(buyer_id = buyer_id, listing_id = listing_id, seller_id = seller_id, date_ordered = date_ordered)
        db.session.add(p)
        db.session.commit()
        return redirect('/three')
    else:
        return redirect('/three')
    
# function to sort through listings by ID
@app.route('/sort/<int:id>')
def sort(id):
    listings = Listing.query.filter_by(seller_id = id).all()
    listing_data = [{
        'listing_id' : listing.listing_id,
        'seller_id': listing.seller_id,
        'max_quantity': listing.max_quantity,
        'ppu': listing.ppu,
        'location': listing.location
    } for listing in listings]
    return jsonify(listing_data)

# function to sort through orders by buyer ID
@app.route('/sort2/<int:id>')
def sort2(id):
    orders = Order.query.filter_by(buyer_id = id).all()
    order_data = [{
        'buyer_id' : order.buyer_id,
        'order_id': order.order_id,
        'listing_id': order.listing_id,
        'seller_id': order.seller_id,
        'date_ordered': order.date_ordered
    } for order in orders]
    return jsonify(order_data)

# gets average price of orders per buyer
@app.route('/average_price/<int:id>')
def average_price(id):
    # fetch all orders for the given buyer ID
    orders = Order.query.filter_by(buyer_id=id).all()

    count = 0
    total = 0
    for order in orders:
        listing_id = order.listing_id
        list_entry = Listing.query.get(listing_id)
        price = list_entry.ppu
        total = total + price
        count = count + 1

    # calculate the average price
    avg_price_per_listing = total / count

    return jsonify(avg_price_per_listing)


# edits listing based on listing ID
@app.route('/edit/<int:id>')
def edit(id):
    listings = Listing.query.filter_by(listing_id = id).all()
    listing_data = [{
        'listing_id' : listing.listing_id,
        'seller_id': listing.seller_id,
        'max_quantity': listing.max_quantity,
        'ppu': listing.ppu,
        'location': listing.location
    } for listing in listings]
    return jsonify(listing_data)


@app.route('/save_changes/<int:id>/<int:max_quantity>/<int:ppu>/<string:location>')
def save(id, max_quantity, ppu, location):
    listing = Listing.query.get(id)
    if listing:
        listing.max_quantity = max_quantity
        listing.ppu = ppu
        listing.location = location

        db.session.commit()

    return redirect('/four')


# function to add listings  
@app.route('/add4', methods=["POST"])
def listing():
    seller_id = request.form.get("seller_id")
    max_quantity = request.form.get("max_quantity")
    ppu = request.form.get("ppu")
    location = request.form.get("location")

    if seller_id is not None and max_quantity is not None and ppu is not None and location != '':
        p = Listing(seller_id=seller_id, max_quantity=max_quantity, ppu=ppu, location=location)
        db.session.add(p)
        db.session.commit()
        return redirect('/SellPage')
    else:
        return redirect('/SellPage')

@app.route('/shop/<int:id>')
def shop(id):
    # Deletes the data on the basis of unique id and 
    # redirects to home page
    return redirect('/five')

#function to make an order from listing ID
@app.route('/buy/<int:id>', methods=["POST"])
def buy(id):
    buyer_id = request.form.get("buyer_id")
    data = Listing.query.get(id)
    if data:
        data.max_quantity = data.max_quantity - 1
        db.session.commit()
    
    new_order = Order(buyer_id = buyer_id, listing_id=id, seller_id=data.seller_id, date_ordered=datetime.now())
    db.session.add(new_order)
    db.session.commit()
    # deletes the data on the basis of unique id and 
    # redirects to home page
    order = Order.query.all()
    return redirect('/OrderPage')


# function to delete a row from sellers
@app.route('/delete2/<int:id>')
def erase2(id):
    # deletes the data on the basis of unique id and 
    # redirects to home page
    data = Seller.query.get(id)
    db.session.delete(data)
    db.session.commit()
    return redirect('/two')

@app.route('/sell/<int:id>')
def sell(id):
    return redirect('/four')

# deletes an order
@app.route('/delete_order/<int:id>')
def erase3(id):
    # deletes the data on the basis of unique id and 
    # redirects to home page
    data = Order.query.get(id)
    db.session.delete(data)
    db.session.commit()
    return redirect('/three')

@app.route('/delete_listing/<int:id>')
def erase4(id):
    # deletes the data on the basis of unique id and 
    # redirects to home page
    data = Listing.query.get(id)
    db.session.delete(data)
    db.session.commit()
    return redirect('/four')

@app.route('/api/sellers')
def get_sellers():
    sellers = Seller.query.all()
    sellers_data = [{
        'id': seller.id,
        'first_name': seller.first_name,
        'last_name': seller.last_name,
        'age': seller.age
    } for seller in sellers]
    return jsonify(sellers_data)

@app.route('/api/buyers')
def get_buyers():
    buyers = Profile.query.all()
    buyers_data = [{
        'id': buyer.id,
        'first_name': buyer.first_name,
        'last_name': buyer.last_name,
        'age': buyer.age
    } for buyer in buyers]
    return jsonify(buyers_data)

@app.route('/api/listings')
def get_listings():
    listings = Listing.query.all()
    listing_data = [{
        'listing_id' : listing.listing_id,
        'seller_id': listing.seller_id,
        'max_quantity': listing.max_quantity,
        'ppu': listing.ppu,
        'location': listing.location
    } for listing in listings]
    return jsonify(listing_data)

@app.route('/api/listings/${int:id}')
def get_listings2(id):
    listings = Listing.query.filter_by(listing_id=id).all()
    if not listings:
        return redirect('/api/listings')
    listing_data = [{
        'listing_id' : listing.listing_id,
        'seller_id': listing.seller_id,
        'max_quantity': listing.max_quantity,
        'ppu': listing.ppu,
        'location': listing.location
    } for listing in listings]
    return jsonify(listing_data)

@app.route('/api/orders')
def get_orders():
    orders = Order.query.all()
    order_data = [{
        'buyer_id': order.buyer_id,
        'order_id': order.order_id,
        'listing_id' : order.listing_id,
        'seller_id': order.seller_id,
        'date_ordered': order.date_ordered
    } for order in orders]
    return jsonify(order_data)


if __name__ == "__main__":
    app.run(debug=True)
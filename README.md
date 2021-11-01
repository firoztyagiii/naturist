<h1 align="center">
  <br>
  <br>
  Naturist
  <br>
</h1>

<h4 align="center">An awesome tour booking site built on top of Node.js, Express, MongoDB.</h4>

 <p align="center">
 <a href="#deployed-version">Demo</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#api-usage">API Usage</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#build-with">Build With</a> •
  <a href="#to-do">To-do</a> •
  <a href="#known-bugs">Known Bugs</a> • 
  <a href="#future-updates">Future Updates</a> • 
</p>

## Deployed Version
Live demo (Feel free to visit) API 👉 : https://naturist.herokuapp.com/
How to Use API - Here
Live demo front end : https://naturist-front.herokuapp.com/
(Decoupled from each others)


## Key Features

* Authentication and Authorization using JWT token.
* Login, Signup, Reset Password, 2 Factor Authentication (with sendgrid).
* User - Update user info like username, password and email.
* Tour - Check tours, create, update and delete.
* Review - Submit review, update and delete them.
* Bookmark/Cart - Add tour/items to cart.
* Credit Card Payment - Using Razorpay.
* Manage Bookings



## How To Use

### Book a tour
* Login to the site (test@example.com:test1234)
* Search for tours that you want to book
* Book a tour
* Proceed to the payment checkout page
* Enter the card details (Test Mood):
  ```
  - Card No. : 4242 4242 4242 4242
  - Expiry date: 02 / 22
  - CVV: 222
  ```
* Finished!



### Manage your booking

* Check the tour you have booked in "Manage Booking" page in your user settings. You'll be automatically redirected to this
  page after you have completed the booking.

### Update your profile

* You can update your own username, email and password.



## API Usage

Check [Naturist API Documentation](https://documenter.getpostman.com/view/8689170/SVmzvwpY?version=latest) for more info.

<b> API Features: </b>

Tours List 👉 https://naturist.herokuapp.com/api/v1/tours

Review List 👉 https://naturist.herokuapp.com/api/v1/review





## Deployment
The website is deployed with git into heroku. Below are the steps taken:
```
git init
git add -A
git commit -m "Commit message"
heroku login
heroku create
heroku config:set CONFIG_KEY=CONFIG_VALUE
parcel build ./public/js/index.js --out-dir ./public/js --out-file bundle.js
git push heroku master
heroku open
```
You can also changed your website url by running this command:
```
heroku apps:rename natours-users
```


## Build With

* [NodeJS](https://nodejs.org/en/) - JS runtime environment
* [Express](http://expressjs.com/) - The web framework used
* [Mongoose](https://mongoosejs.com/) - Object Data Modelling (ODM) library
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Cloud database service
* [JSON Web Token](https://jwt.io/) - Security token
* [Webpack](https://webpack.js.org/) - Blazing fast, zero configuration web application bundler
* [Razorpay](https://razorpay.com/) - Online payment gateway
* [Postman](https://www.getpostman.com/) - API testing
* [Sendgrid](https://sendgrid.com/) - Email delivery platform
* [Heroku](https://www.heroku.com/) - Cloud platform



## To-do

* Review and rating
  - Allow user to add a review directly at the website after they have taken a tour
* Booking
  - Prevent duplicate bookings after user has booked that exact tour, implement favourite tours
* Front End
  - Error page, Handle not logged in user.
* And More ! There's always room for improvement!




## Known Bugs
Feel free to email me at firoztyagi1783@gmail.com if you run into any issues or have questions, ideas or concerns.
Please enjoy and feel free to share your opinion, constructive criticism, or comments about my work. Thank you! 🙂


## Future Updates

* Improve overall UX/UI and fix bugs
* Featured Tours
* Recently Viewed Tours
* And More ! There's always room for improvement!

Thanks!! :)

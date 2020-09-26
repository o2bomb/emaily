# Emaily
[Live demo](https://powerful-meadow-90516.herokuapp.com/) (may take a while to load)

A fullstack web application for mass-emailing surveys to a large amount of users. Features included:

- OAuth authentication with Google
- Credit card payments
- Creation of new surveys
- Tracking of user responses

Created from Stephen Grider's [Node with React: Fullstack Web Development](https://www.udemy.com/course/node-with-react-fullstack-web-development/) course.



## Stack

**Front end:** React with Redux and MaterializeCSS

**Back end:** Express on top of Node, using the Passport library to handle oauth authentication

**Database:** MongoDB

**Third-party services:** 

- Heroku for hosting and deployment of the web app

- SendGrid API for sending out surveys and tracking user responses
- MongoDB Atlas for hosting the database
- Google API for OAuth authentication
- Stripe for handling credit card transactions and payments

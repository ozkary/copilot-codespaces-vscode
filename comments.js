// create web server with express
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const expressSanitizer = require('express-sanitizer');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

// connect to mongodb
mongoose.connect('mongodb://localhost:27017/restful_blog_app', { useNewUrlParser: true });
// set view engine
app.set('view engine', 'ejs');
// set public directory
app.use(express.static('public'));
// use body-parser
app.use(bodyParser.urlencoded({ extended: true }));
// use express-sanitizer
app.use(expressSanitizer());
// use method-override
app.use(methodOverride('_method'));

// Mongoose/Model Config
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type: Date, 
        default: Date.now
    }
});
const Blog = mongoose.model('Blog', blogSchema);

// RESTful Routes
app.get('/', (req, res) => {
    res.redirect('/blogs');
});

// INDEX ROUTE
app.get('/blogs', (req, res) => {
    Blog.find({}, (err, blogs) => {
        if(err) {
            console.log(err);
        } else {
            res.render('index', { blogs: blogs });
        }
    });
});

// NEW ROUTE
app.get('/blogs/new', (req, res) => {
    res.render('new');
});

// CREATE ROUTE
app.post('/blogs', (req, res) => {
    // create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (err, newBlog) => {
        if(err) {
            res.render('new');
        } else {
            // redirect to the index
            res.redirect('/blogs');
        }
    });
});

// SHOW ROUTE
app.get('/blogs/:id', (req, res) => {
    // find blog with provided ID
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err) {
            // redirect to the index
            res.redirect('/blogs');
        } else {
            // render show template with that blog
            res.render('show', { blog: foundBlog });
        }
    });
});

// EDIT ROUTE
app.get('/blogs/:id/edit', (req, res) => {
    // find


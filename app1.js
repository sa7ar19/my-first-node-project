const express = require('express');
const morgan = require('morgan')
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const { render } = require('ejs');

const app = express();

// connect to Mongo db
const DBURI = 'mongodb://localhost:27017/ninja-tuts';
mongoose.connect(DBURI)
    .then((result)=> app.listen(3000))
    .catch((err)=>console.log(err))

//register view engine
app.set('view engine', 'ejs');   


// middleware & static Files
app.use(express.static('public'))
app.use(express.urlencoded({extended: true})) //take the data from the ejs page and put it in variable
app.use(morgan('dev'))

// mongoose and mongo sandbox routes
// app.get('/add-blog', (req, res)=>{
//     const blog = new Blog({
//         title: 'new blog-2',
//         snippet: 'about my new blog',
//         body: 'more about my new blog'
//     });
//     blog.save()
//         .then((result)=>{
//             res.send(result)
//         })
//         .catch((err)=>{
//             console.log(err)
//         })
// })

// app.get('/all-blogs', (req, res)=>{
//     Blog.find()
//         .then((result)=>{
//             res.send(result)
//         })
//         .catch((err)=>{
//             console.log(err)
//         })
// });
// app.get('/single-blog', (req, res)=>{
//     Blog.findById('660253c807dc40d42fd0ad93')
//         .then((result)=>{
//             res.send(result)
//         })
//         .catch((err)=>{
//             console.log(err)
//         })
// })


// app.use((req, res, next)=>{
//     console.log('#####################- morgan is a middleware package -########################');
//     console.log('A new request made: ');
//     console.log('host: ', req.hostname);
//     console.log('path: ', req.path);
//     console.log('method: ', req.method);
//     console.log('#####################');
//     next();
// })
// app.use((req, res, next)=>{
//     console.log('in the next middleware');
//     console.log('######################');
//     next();
// })

// app.get('/', (req, res)=>{
//     const blogs = [
//         {title: 'Jon finds eggs', snippet: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'},
//         {title: 'Mario finds stars', snippet: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'},
//         {title: 'How to defeat bowser', snippet: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'}
//     ];
//     res.render('index', {title: 'Home', blogs});
// });

app.get('/', (req, res)=>{
   res.redirect('/blogs');
});

app.get('/about', (req, res)=>{
    res.render('about', {title: 'About'})
});

//blog routes
app.get('/blogs', (req, res)=>{
    Blog.find().sort({createdAt: -1})
        .then((result)=>{
            res.render('index', {title: 'Home', blogs: result});
        })
        .catch((err)=>{
            console.log(err)
        })
})

app.post('/blogs', (req, res)=>{
    const blog = new Blog(req.body);
    blog.save()
        .then(()=>{
            res.redirect('/blogs')
        })
        .catch( err => console.log(err) )

    console.log(req.body);
})

app.get("/blogs/:id", (req, res)=>{
    const id = req.params.id;
    Blog.findById(id)
        .then((result)=>{
            res.render('details', {title: 'Blog Details', blog : result})
        })
        .catch(err => console.log(err))
})

app.delete('/blogs/:id', (req, res)=>{
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
        .then( result =>{
            res.json({ redirect: '/blogs'})
        })
        .catch(err => console.log(err))
})


app.get('/blogs/create', (req, res)=>{
    res.render('create' ,{title: 'Create Blog'})
})

// 404 page
app.use((req, res)=>{  
    res.status(404).render("404", {title: '404'})
})
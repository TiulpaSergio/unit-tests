const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const port = process.env.PORT || 3000;
const { body, validationResult } = require('express-validator');

const User = require('./models/users.js');
const Post = require('./models/posts.js');
const Comm = require('./models/comm.js');

mongoose.connect('mongodb+srv://tyulpaserhey:Sexyboy7734@cluster0.lwqkvak.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

app.use(bodyParser.json());
app.use(session({ secret: 'secretKey', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


app.get('/api/posts', async (req, res) => {
    try {
      const posts = await Post.find();
      res.json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Помилка отримання постів' });
    }
  });

  app.get('/api/posts/:postId', async (req, res) => {
    try {
      const postId = req.params.postId;
      const post = await Post.findById(postId);
  
      if (!post) {
        return res.status(404).json({ success: false, message: 'Пост не знайдено' });
      }
  
      res.json({ success: true, post });
    } catch (error) {
      console.error('Error getting post by ID:', error);
      res.status(500).json({ success: false, error: 'Error getting post by ID' });
    }
  });

  app.post('/api/update-profile', async (req, res) => {
    try {
      const { username, email, birthdate, gender, address, website } = req.body;
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'Користувача не знайдено' });
      }
  
      user.email = email;
      user.birthdate = birthdate;
      user.gender = gender;
      user.address = address;
      user.website = website;
  
      await user.save();
  
      res.json({ success: true, message: 'Профіль успішно оновлено' });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ success: false, error: 'Error updating profile' });
    }
  });  

  app.post('/registration-endpoint', [
    body('username').notEmpty().withMessage("Нікнейм є обов'язковим"),
    body('password').notEmpty().withMessage("Пароль є обов'язковим"),
    body('email').isEmail().withMessage('Введіть дійсний email'),
  ], async (req, res) => {
    try {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
  
      const { username, email, password } = req.body;
  
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'Користувач з таким email вже існує' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        username,
        email,
        password: hashedPassword,
      });
  
      await user.save();
  
      req.login(user, (err) => {
        if (err) {
            return next(err);
        }
        return res.json({ success: true });
    });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post('/api/update-password', async (req, res) => {
    try {
      const { password } = req.body;
  
      if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: 'Користувач не автентифікований' });
      }
  
      const user = await User.findById(req.user.id);
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'Користувача не знайдено' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      user.password = hashedPassword;
      await user.save();
  
      res.json({ success: true, message: 'Пароль успішно оновлено' });
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ success: false, error: 'Помилка оновлення паролю', details: error.message });
    }
  });

app.use(flash());

app.use(express.json());

app.use(session({
  secret: true,
  resave: false,
  saveUninitialized: true
}));

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, done) => {
  try {
      const user = await User.findOne({ email: email });

      if (!user || !await bcrypt.compare(password, user.password)) {
          return done(null, false, { message: 'Invalid email or password' });
      }

      return done(null, user);
  } catch (error) {
      return done(error);
  }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.currentUsername = req.isAuthenticated() ? req.user.username : null;
    res.locals.getUserInfo = async () => {
      if (req.isAuthenticated()) {
        const user = await User.findById(req.user.id);
        return user;
      }
      return null;
    };
    next();
});

app.post('/authorization', passport.authenticate('local', { 
    failureRedirect: '/authorization', 
    failureFlash: true 
}), async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            const user = await res.locals.getUserInfo();
            console.log('Authenticated user:', user);
            console.log('Serialized user:', req.session.passport.user);
        }
        console.log('Sending JSON response:', { success: true });
        res.json({ success: true });
    } catch (error) {
        console.error('Error retrieving user information:', error);
        res.json({ success: false, error: 'Error retrieving user information' });
    }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Помилка при виході:', err);
      res.status(500).json({ success: false, message: 'Помилка при виході з системи' });
    } else {
      res.status(200).json({ success: true, message: 'Ви вийшли з системи' });
    }
  });
});

app.post('/create-post', async (req, res) => {
    try {
      const postData = req.body;
      const post = new Post({
        title: postData.title,
        author: postData.author,
        content: postData.body, 
        shortDescription: postData.desc, 
      });
      await post.save();
      res.json({ success: true, message: 'Пост успішно створено' });
      console.log('Received data:', postData);
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ success: false, error: 'Error creating post' });
    }
});

app.get('/api/posts/:postId/comments', async (req, res) => {
  try {
    const postId = req.params.postId;
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Пост не знайдено' });
    }

    const comments = await Comm.find({ post: postId });
    console.log('Comments retrieved from database:', comments);

    res.json({ success: true, comments });
  } catch (error) {
    console.error('Error getting comments:', error);
    res.status(500).json({ success: false, error: 'Помилка отримання коментарів', details: error.message });
  }
});

app.post('/api/posts/:postId/comments', async (req, res) => {
  try {
    const postId = req.params.postId;
    const { text } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Пост не знайдено' });
    }

    const user = await res.locals.getUserInfo();

    const newComment = new Comm({
      post: postId,
      user: user._id, 
      text: text,
    });

    const savedComment = await newComment.save();

    post.commentsCount += 1;
    await post.save();

    res.json({ success: true, newComment: savedComment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ success: false, error: 'Помилка додавання коментаря', details: error.message });
  }
});

app.get('/profile', async (req, res) => {
    const userInfo = await res.locals.getUserInfo();
    res.render('profile', { userInfo });
});

app.get('/api/getCurrentUser', async (req, res) => {
    try {
      if (req.isAuthenticated()) {
        const user = await User.findById(req.user.id);
        res.json({ success: true, user });
      } else {
        res.json({ success: false, message: 'User not authenticated' });
      }
    } catch (error) {
      console.error('Error retrieving current user:', error);
      res.status(500).json({ success: false, message: 'Error retrieving current user' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'viewPost.html'));
});

app.get('/authorization', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'auth.html'));
});

app.get('/registration', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'registration.html'));
});

app.get('/comments', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'comments.html'));
});

app.get('/newpassword', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'newpass.html'));
});

app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'user.html'));
});

app.get('/new', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'addPost.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

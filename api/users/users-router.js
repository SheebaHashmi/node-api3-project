const express = require('express');
const Users = require('./users-model');
const Posts = require('../posts/posts-model')
const {
  logger,
  validatePost,
  validateUser,
  validateUserId
} = require('../middleware/middleware')
// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/',logger, (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Users.get()
  .then(users => res.json(users))
});

router.get('/:id',validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.json(req.user)
});

router.post('/',validateUser, (req, res,next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  Users.insert(req.body)
  .then(newUser => res.json(newUser))
  .catch(err => next(err))
});

router.put('/:id',validateUserId,validateUser, (req, res,next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  Users.update(req.params.id,req.body)
  .then(updateUser => res.json(updateUser))
  .catch(err => next(err))
});

router.delete('/:id',validateUserId, (req, res,next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  Users.remove(req.params.id)
  .then(() => res.json(req.user))
  .catch(err => next(err))
});

router.get('/:id/posts',validateUserId, async (req, res,next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  try{
    const posts = await Users.getUserPosts(req.params.id)
    res.json(posts)
  }
  catch{next()}
 
  
});

router.post('/:id/posts',validateUserId,validatePost,async(req, res,next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try{
    const post = { ...req.body, user_id: req.user.id }
    const newPost = await Posts.insert(post)
    res.json(newPost)
  }
  catch(err){
    next(err)
  }
  
});

// do not forget to export the router
module.exports = router
const express = require("express")
const posts = require("../data/db")

const router = express.Router()

router.get("/api/posts", (req, res) => {
  posts
    .find(req.query)
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({
        message: "The posts information could not be retrieved",
      })
    })
})

router.get("/api/posts/:id", (req, res) => {
    posts
      .findById(req.params.id)
      .then((post) => {
          if (post) {
              res.status(200).json(post)
          } else {
              res.status(404).json({
                  message: "The post with the specified ID could not be found",
              })
          }
      })
      .catch((err) => {
          console.log(err)
          res.status(500).json({
              message: "The posts information could not be retrieved",
          })
      })
})

router.get("/api/posts/:id/comments", (req, res) => {
    posts
    .findCommentById(req.params.id)
    .then((comment) => {
        if (comment) {
            res.status(200).json(comment)
        } else {
            res.status(404).json({
                message: "The post with the specified ID could not be found",
            })
        }
    })
    .catch((err) => {
        console.log(err)
        res.status(500).json({
            message: "The comments information could not be retrieved",
        })
    })
})

router.post("/api/posts", (req, res) => {
    if (!req.body.title || !req.body.contents) {
        return res.status(400).json({
            message: "Please provide title and contents for the post",
        })
    }
    posts
     .insert(req.body)
     .then((post) => {
         res.status(201).json(post)
     })
     .catch((err) => {
         console.log(err)
         res.status(500).json({
             message: "There was an error while saving the post to the database",
         })
     })
})

router.post("/api/posts/:id/comments", (req, res) => {
    if (!req.body.text) {
        return res.status(400).json({
            message: "Please provide text for comment",
        })
    }
    posts
      .insertComment({ 
          ...req.body, post_id: req.params.id 
      })
      .then((post) => {
          if (post) {
              res.status(201).json(post)
          } else {
              res.status(404).json({
                  message: "The post with the specified ID does not exist",
              })
          }
      })
      .catch((err) => {
          console.log(err)
          res.status(500).json({
              message: "There was an error while saving the comment to the database",
          })
      })
})

router.delete("/api/posts/:id", (req, res) => {
    posts
      .remove(req.params.id)
      .then((count) => {
          if (count > 0) {
              res.status(200).json({
                  message: "The post has been removed",
              })
          } else {
              res.status(400).json({
                  message: "The post with the specified ID does not exist",
              })
          }
      })
      .catch((err) => {
          console.log(err)
          res.status(500).json({
              message: "The post could not be removed",
          })
      })
})

router.put("/api/posts/:id", (req, res) => {
    if (!req.body.title || !req.body.contents) {
        return res.status(400).json({
            message: "Please provide title and contents for the post",
        })
    }
    posts
      .update(req.params.id, req.body)
      .then((post) => {
          if (post) {
              res.status(200).json(post)
          } else {
              res.status(400).json({
                  message: "The post with the specified ID does not exist",
              })
          }
      })
      .catch((err) => {
          console.log(err)
          res.status(500).json({
              message: "The post information could not be modified",
          })
      })
})


module.exports = router
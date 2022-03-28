const express = require("express");

const router = express.Router();

let db = require("../fake-db");

router.get("/show/:userid", (req, res) => {
    let user = req.session.username ? req.session : null;
    let user_id = req.params.userid;
    let user_info = db.getUser(user_id);
    res.render("users/user-links", { user, user_info });
})

router.get("/show/:userid/posts/list", (req, res) => {
    let user = req.session.username ? req.session : null;
    let order = req.query.orderby;
    let user_id = req.params.userid;
    let contentUser = db.getUser(user_id);
    let userPosts = db.getUserPosts(user_id).map(post => {
        post = db.decoratePost(post);
        let votes = db.getVotesForPost(post.id);
        let vote_count;
        if (votes.length > 0) {
            vote_count = votes.map(v => v.value).reduce((acc, next) => acc + next);
        } else {
            vote_count = 0;
        }
        post.total_votes = vote_count;
        return post;
    });
    if (order === "date") {
        userPosts.sort((a, b) => {
            return b.timestamp - a.timestamp;
        })
    } else if (order === "votes") {
        userPosts.sort((a, b) => {
            return b.total_votes - a.total_votes;
        })
    } else {
        userPosts.sort((a, b) => {
            let titleA = a.title.toLowerCase(), titleB = b.title.toLowerCase();
            if (titleA < titleB) return -1;
            if (titleA > titleB) return 1;
            return 0;
        });
    }
    res.render("users/user-posts", { user, userPosts, contentUser });
})

router.get("/show/:userid/comments/list", (req, res) => {
    let user = req.session.username ? req.session : null;
    let user_id = req.params.userid;
    let userComments = db.getUserComments(user_id);
    let contentUser = db.getUser(user_id);
    res.render("users/user-comments", { user, userComments, contentUser });
})

module.exports = router;
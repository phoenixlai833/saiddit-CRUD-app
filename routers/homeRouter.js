const express = require("express");

const router = express.Router();

let db = require("../fake-db");

router.get("/", (req, res) => {
    let user = req.session.username ? req.session : null;
    let order = req.query.orderby;
    let all_posts = db.getPosts(20, sub = undefined).map(post => {
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
    })
    if (order === "date") {
        all_posts.sort((a, b) => {
            return b.timestamp - a.timestamp;
        })
    } else if (order === "votes") {
        all_posts.sort((a, b) => {
            return b.total_votes - a.total_votes;
        })
    } else {
        all_posts.sort((a, b) => {
            let titleA = a.title.toLowerCase(), titleB = b.title.toLowerCase();
            if (titleA < titleB) return -1;
            if (titleA > titleB) return 1;
            return 0;
        });
    }
    res.render("home/homepage", { user, all_posts });
})

router.get("/login", (req, res) => {
    res.render("home/login", {});
})

router.post("/login", (req, res) => {
    let givenUsername = req.body.username;
    let givenPassword = req.body.password;
    let foundUser = db.getUserByUsername(givenUsername);
    if (foundUser && foundUser.password === givenPassword) {
        console.log(`login attempt from user ${givenUsername}, SUCCESS`);
        req.session.username = givenUsername;
    } else {
        console.log(`login attempt from user ${givenUsername}, failure, might be a hacker`);
    }
    res.redirect("/");
})

router.get("/signup", (req, res) => {
    res.render("home/signup", {});
})

router.post("/signup", (req, res) => {
    let uname = req.body.username;
    let password = req.body.password;
    db.addUser(uname, password);
    res.redirect("/");
})

router.post("/logout", (req, res) => {
    res.clearCookie("username");
    req.session = null;
    res.redirect("/");
})

module.exports = router;
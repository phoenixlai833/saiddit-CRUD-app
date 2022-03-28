const express = require("express");

const router = express.Router();

const db = require("../fake-db");

router.get("/list", (req, res) => {
    let user = req.session.username ? req.session : null;
    let subs = db.getSubs().sort();
    res.render("subs/subs-list", { user, subs });
})

router.get("/show/:subname", (req, res) => {
    let user = req.session.username ? req.session : null;
    let order = req.query.orderby;
    const select_sub = req.params.subname;
    const sub_posts = db.getPosts(n = 20, sub = select_sub).map(post => {
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
        sub_posts.sort((a, b) => {
            return b.timestamp - a.timestamp;
        })
    } else if (order === "votes") {
        sub_posts.sort((a, b) => {
            return b.total_votes - a.total_votes;
        })
    } else {
        sub_posts.sort((a, b) => {
            let titleA = a.title.toLowerCase(), titleB = b.title.toLowerCase();
            if (titleA < titleB) return -1;
            if (titleA > titleB) return 1;
            return 0;
        });
    }
    res.render("subs/one-sub", { user, sub_posts, select_sub });
})

module.exports = router;
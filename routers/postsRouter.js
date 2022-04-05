const express = require("express");

const router = express.Router();

let db = require("../fake-db");

router.get("/show/:postid", (req, res) => {
    let user = req.session.username ? req.session : null;
    let post_id = req.params.postid;
    let select_post = db.getPost(post_id);
    let votes = db.getVotesForPost(post_id);
    let vote_count;
    if (votes.length > 0) {
        vote_count = votes.map(v => v.value).reduce((acc, next) => acc + next);
    } else {
        vote_count = 0;
    }
    select_post.total_votes = vote_count;
    res.render("posts/single-post", { user, select_post });
})

router.get("/create", (req, res) => {
    res.render("posts/post-create", {});
})

router.post("/create", (req, res) => {
    let user = req.session.username ? req.session : null;
    const title = req.body.title;
    const link = req.body.link;
    const creator = db.getUserByUsername(user.username).id;
    const description = req.body.description;
    const subgroup = req.body.subgroup;
    const select_post = db.addPost(title, link, creator, description, subgroup);
    res.redirect(`/posts/show/${select_post.id}`);
})

router.get("/edit/:postid", (req, res) => {
    const post_id = req.params.postid;
    let select_post = db.getPost(post_id);
    res.render("posts/edit-post", { post_id, select_post });
})

router.post("/edit/:postid", (req, res) => {
    const post_id = req.params.postid;
    const title = req.body.title;
    const link = req.body.link;
    const description = req.body.description;
    const subgroup = req.body.subgroup;
    let changes = {
        title,
        link,
        description,
        subgroup
    };
    db.editPost(post_id, changes);
    const select_post = db.getPost(post_id);
    res.redirect(`/posts/show/${post_id}`);
})

router.get("/deleteconfirm/:postid", (req, res) => {
    const post_id = req.params.postid;
    const select_post = db.getPost(post_id);
    res.render("posts/delete-post", { select_post });
})

router.post("/delete/:postid", (req, res) => {
    const post_id = req.params.postid;
    const post_subgroup = db.getPost(post_id).subgroup;
    db.deletePost(post_id);
    // res.redirect(`/subs/show/${post_subgroup}`);
    res.redirect("/");
})

router.post("/comment-create/:postid", (req, res) => {
    let user = req.session.username ? req.session : null;
    const post_id = req.params.postid;
    const creator = db.getUserByUsername(user.username).id;
    const description = req.body.description;
    db.addComment(post_id, creator, description);
    res.redirect(`/posts/show/${post_id}`);
})

router.post("/vote/:postid", (req, res) => {
    let user = req.session.username ? req.session : null;
    let post_id = req.params.postid;
    let vote = req.body.vote;
    let user_id = db.getUserByUsername(user.username).id;
    if (vote === "+") {
        let val = +1;
        db.addVote(user_id, post_id, val);
    } else {
        let val = -1;
        db.addVote(user_id, post_id, val);
    }
    res.redirect("/");
})

module.exports = router;
const express = require("express");

const router = express.Router();

let db = require("../fake-db");

router.get("/show/:commentid", (req, res) => {
    let user = req.session.username ? req.session : null;
    let comment_id = req.params.commentid;
    let select_comment = db.getComment(comment_id);
    select_comment = db.decorateComment(select_comment);
    res.render("comments/show-comment", { user, select_comment });
})

router.post("/reply/:commentid", (req, res) => {
    let user = req.session.username;
    let comment_id = req.params.commentid;
    let description = req.body.description;
    let user_id = db.getUserByUsername(user).id;
    db.addReply(user_id, comment_id, description);
    res.redirect(`/comments/show/${comment_id}`);
})

router.get("/edit/:commentid", (req, res) => {
    let comment_id = req.params.commentid;
    res.render("comments/edit-comment", { comment_id });
})

router.post("/edit/:commentid", (req, res) => {
    let comment_id = req.params.commentid;
    const description = req.body.description;
    let changes = {
        description
    };
    db.editComment(comment_id, changes);
    res.redirect(`/comments/show/${comment_id}`);

})

router.get("/deleteconfirm/:commentid", (req, res) => {
    let user = req.session.username ? req.session : null;
    let comment_id = req.params.commentid;
    let select_comment = db.getComment(comment_id);
    select_comment = db.decorateComment(select_comment);
    res.render("comments/delete-comment", { user, select_comment });
})

router.post("/delete/:commentid", (req, res) => {
    const comment_id = req.params.commentid;
    const post_id = db.getComment(comment_id).post_id;
    db.deleteComment(comment_id);
    res.redirect(`/posts/show/${post_id}`);
})

module.exports = router;
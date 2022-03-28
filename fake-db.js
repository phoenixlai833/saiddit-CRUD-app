
const users = {
  1: {
    id: 1,
    uname: 'alice',
    password: 'alpha',
  },
  2: {
    id: 2,
    uname: 'bob',
    password: 'bravo',
  },
  3: {
    id: 3,
    uname: 'carol',
    password: 'charlie',
  },
  4: {
    id: 4,
    uname: 'dave',
    password: 'delta',
  },
};

const posts = {
  101: {
    id: 101,
    title: "Fishsticks",
    link: "https://www.smithsonianmag.com/innovation/surprising-success-story-fish-sticks-180977578/",
    description: "I actually really do not like fish sticks",
    creator: 1,
    subgroup: 'food',
    timestamp: 1643648446955,
  },
  102: {
    id: 102,
    title: "Charlie the Unicorn",
    link: "https://www.youtube.com/watch?v=CsGYh8AacgY",
    description: "",
    creator: 2,
    subgroup: 'documentaries',
    timestamp: 1642611742010,
  },
};

const comments = {
  9001: {
    id: 9001,
    post_id: 102,
    creator: 1,
    description: "Actually I learned a lot :pepega:",
    timestamp: 1642691742010,
    replies: []
  }
}
// test reply:{ user_id: 2, comment_id: 9001, description: "This is so cool!" }

const votes = [
  { user_id: 2, post_id: 101, value: +1 },
  { user_id: 3, post_id: 101, value: +1 },
  { user_id: 4, post_id: 101, value: +1 },
  { user_id: 3, post_id: 102, value: -1 },
]

function debug() {
  console.log("==== DB DEBUGING ====");
  console.log("users", users);
  console.log("posts", posts);
  console.log("comments", comments);
  console.log("votes", votes);
  console.log("==== DB DEBUGING ====");
}

function getUser(id) {
  return users[Number(id)];
}

function getUserByUsername(uname) {
  let relevant_user_object = Object.values(users).filter(user => user.uname === uname)[0];
  if (relevant_user_object) {
    return getUser(relevant_user_object.id);
  } else {
    return undefined;
  }
}

function addUser(uname, password) {
  let id = Math.max(...Object.keys(users).map(Number)) + 1;
  let user = {
    id,
    uname,
    password,
  };
  users[id] = user;
  return user;
}

function getVotesForPost(post_id) {
  return votes.filter(vote => vote.post_id === Number(post_id));
}

function addVote(u_id, p_id, val) {
  let new_vote = {
    user_id: Number(u_id),
    post_id: Number(p_id),
    value: Number(val)
  };
  let same_vote = votes.filter(vote => vote.user_id === new_vote.user_id && vote.post_id === new_vote.post_id);

  if (same_vote.length > 0) {
    let new_val = 0;
    if (same_vote[0].value === 0 && new_vote.value === -1) {
      same_vote[0].value++;
    } else if (same_vote[0].value === 0 && new_vote.value === -1) {
      same_vote[0].value--;
    }
    let total_vote_set = [...new Set([same_vote[0].value, new_vote.value])];
    for (let vote of total_vote_set) {
      new_val = new_val + vote;
    }

    votes.pop();
    new_vote.value = new_val;
    votes.push(new_vote);
  } else {
    votes.push(new_vote);
  }
  return votes;
}

function decoratePost(post) {
  post = {
    ...post,
    creator: users[post.creator],
    votes: getVotesForPost(post.id),
    comments: Object.values(comments)
      .filter(comment => comment.post_id === post.id)
      .map(comment => ({
        ...comment, creator: users[comment.creator], timestamp: new Date(comment.timestamp), replies: comment.replies
          .map(reply => ({ ...reply, timestamp: new Date(reply.timestamp) }))
      })),
    timestamp: new Date(post.timestamp)
  };
  return post;
}

function decorateComment(comment) {
  comment = {
    ...comment,
    creator: users[comment.creator],
    timestamp: new Date(comment.timestamp),
    replies: comment.replies.map(reply => ({ ...reply, timestamp: new Date(reply.timestamp) }))
  };
  return comment;
}

/**
 * @param {*} n how many posts to get, defaults to 5
 * @param {*} sub which sub to fetch, defaults to all subs
 */
function getPosts(n = 5, sub = undefined) {
  let allPosts = Object.values(posts);
  if (sub) {
    allPosts = allPosts.filter(post => post.subgroup === sub);
  }
  allPosts.sort((a, b) => b.timestamp - a.timestamp);
  return allPosts.slice(0, n);
}

function getUserPosts(user_id) {
  let userPosts = Array.from(new Set(Object.values(posts).filter(post => post.creator === Number(user_id))));
  return userPosts;
}

function getPost(id) {
  return decoratePost(posts[Number(id)]);
}

function addPost(title, link, creator, description, subgroup) {
  let id = Math.max(...Object.keys(posts).map(Number)) + 1;
  let post = {
    id,
    title,
    link,
    description,
    creator: Number(creator),
    subgroup,
    timestamp: Date.now(),
  };
  posts[id] = post;
  return post;
}

function editPost(post_id, changes = {}) {
  let post = posts[Number(post_id)];
  if (changes.title) {
    post.title = changes.title;
  };
  if (changes.link) {
    post.link = changes.link;
  };
  if (changes.description) {
    post.description = changes.description;
  };
  if (changes.subgroup) {
    post.subgroup = changes.subgroup;
  };
}

function deletePost(post_id) {
  delete posts[Number(post_id)];
}

function getSubs() {
  return Array.from(new Set(Object.values(posts).map(post => post.subgroup)));
}

function addComment(post_id, creator, description) {
  let id = Math.max(...Object.keys(comments).map(Number)) + 1;
  let comment = {
    id,
    post_id: Number(post_id),
    creator: Number(creator),
    description,
    timestamp: Date.now(),
    replies: []
  };
  comments[id] = comment;
  return comment;
}

function editComment(comment_id, changes = {}) {
  let comment = comments[Number(comment_id)];
  if (changes.description) {
    comment.description = changes.description;
  };
}

function getComment(comment_id) {
  return comments[Number(comment_id)];
}

function deleteComment(comment_id) {
  delete comments[Number(comment_id)];
}

function getUserComments(user_id) {
  let userComments = Array.from(new Set(Object.values(comments).filter(comment => comment.creator === Number(user_id))));
  return userComments;
}

function addReply(user_id, comment_id, description) {
  let relevant_comment_object = Object.values(comments).filter(comment => comment.id === Number(comment_id))[0];
  let reply = {
    user_id: users[user_id],
    comment_id: Number(comment_id),
    description,
    timestamp: Date.now(),
  };
  relevant_comment_object.replies.push(reply);
  return;
}



module.exports = {
  debug,
  decoratePost,
  decorateComment,
  getUser,
  addUser,
  getUserByUsername,
  getUserPosts,
  getPosts,
  getPost,
  getVotesForPost,
  addVote,
  addPost,
  editPost,
  deletePost,
  getSubs,
  getUserComments,
  addComment,
  editComment,
  getComment,
  deleteComment,
  addReply
};


'use strict'

const router = require('express').Router();


router.get("/",function(req, res, next) {
    let COMMENT = req.app.locals.db.model('Comment');
    let summary = [];
    COMMENT.find( {}, function(err, allResult){
        if(err){
            console.log(err);
        }else{
            // res.render(title.handlebar);
            console.log(allResult);
            // Store a brief summary in summary
     		let ret = [];
     		for (let result of allResult) {
     			console.log(summary);
     			ret.push(
            {
     				title: result.title,
     				author: result.author,
     				commentBody: result.commentBody,
            keyword: result.keyword,
     				modified_at: result.modified_at,
            votes: result.votes.length,
            views: result.views,
            image: result.image,
            url: '/c/' + result.title.split(' ').join('-'),
     			}
        )
     		}
            res.render("Comment/comm", { comment: ret });
        }
    })
});
//--------------------------------------------------------------------

router.get("/:title",function(req, res, next) {
    let COMMENT = req.app.locals.db.model('Comment');

    let title = req.params.title.split("-").join(" ");

    COMMENT.find({'title': title }, function(err, results){
        if(err){
            console.log(err);
        }else{

        let result = results[0];

     		let ret = {
     				title: result.title,
     				author: result.author,
     				commentBody: result.commentBody,
            keyword: result.keyword,
            votes: result.votes.length,
            views: result.views,
            modified_at: result.modified_at,
            reply: result.reply
     			  }

        res.render("Comment/SingleComm", { comment: ret});
        }
    })
});
//---------------------------------------------------------------------
router.post("/SingleComm", async function(req, res, next){
  let username = req.body.user;
  if(username == undefined || username == ""){
    res.sendStatus(403);
    return next;
  }

  try{
    	username = await req.app.locals.auth(req.app.locals.token, username);
      let COMMENT = req.app.locals.db.model('Comment');
      let title = req.body.title;
      let author = req.body.author;
      let commentBody = req.body.commentBody;
      let keyword = req.body.keyword;
      let votes = req.body.votes;
      let views= req.body.views;
      let modified_at = req.body.modified_at;

      let newComment = new Comment({
        title: title,
        author: author,
        commentBody: commentBody,
        keyword: keyword,
        votes: votes,
        views: views,
        modified_at: modified_at,
      });

      newComment.save(function(err,newComment){
        if(err){
          console.log(err);
    			res.json({
    			    status: 'error',
    			    err: [
    			      { name: "repeat title", msg: "200" },
    			    ]
    			});
        }else{
          res.json({
            status: 'success',
            url: '/Comment/SingleComm' + newComment.title.split(' ').join('-')
          });
        }

      });

  }catch(errs){
    console.log(errs);
    res.sendStatus(403);
  }


});


module.exports = router;

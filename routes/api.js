var express = require('express');
var router = express.Router();
//var mongoose = require( 'mongoose' );
//var Post = mongoose.model('Post');
var mongojs = require('mongojs');
var db = mongojs('mongodb://alexivar:sisenjor94@ds139288.mlab.com:39288/historymakers_db', ['posts']);

router.route('/posts')
			.get(function(req, res){

				db.posts.find(function(err, docs){
        if(err){
            res.send(err);
        }
        		res.json(docs);
    		});
			})
			//post function for posts
			.post(function(req, res){
				var newPost = req.body;
				if(!newPost.title){
        		res.status(400);
        		res.json({
            	"error": "bad data"
        		});

    		}
    		else{
	        	db.posts.save(newPost, function(err, docs){
	            if(err){
	                res.send(err);
	            }
	            res.json(docs);
	        });
    		}
			})
			//delete function for posts
			.delete(function(req, res){
					 db.posts.remove({_id: mongojs.ObjectId(req.query._id)}, function(err, docs){
					 if(err){
							 res.send(err);
					 }
					 res.json(docs);
			 		});
			});

module.exports = router;

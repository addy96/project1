var router = require('express').Router();
var async = require('async');
var faker = require('faker');
var Category = require('../models/category');
var item = require('../models/item');

router.get('/:name', function(req, res, next){


	async.waterfall([
		function(callback){
			Category.findOne({ name: req.params.name }, function(err, category){
				if(err) next(err);
				callback(null, category);
			});
		},

		function(category, callback){
			for(var i = 0; i < 30; i++){
				var item = new item();

				item.category = category._id;
				item.name = faker.commerce.itemName();
				item.price = faker.commerce.price();
				item.image = faker.image.image();

				item.save();
			}
		}
	]);
	res.json({ message: 'success' });
});

module.exports = router;
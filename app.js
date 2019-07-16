var express = require("express"),
 methodOverride = require("method-override"),
 //expressSanitizer = require("express-sanitizer"),
 mongoose = require("mongoose"),
 bodyparser = require("body-parser"),
 app =express();

 app.use(bodyparser.urlencoded({extended:true}));
// app.use(expressSanitizer());
mongoose.connect("mongodb+srv://Nikhil:man@cluster0-f1ejb.mongodb.net/test?retryWrites=true&w=majority", function(err, db) {
    if(err){
    	console.log(err);
    }
 });
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(methodOverride("_method"));


//mongoose Schema
var SchemaZ = new mongoose.Schema({
	title:String,
	category:String,
	image: String,
	body: String,
	created:{type:Date, default: Date.now}
});

var FoodB = mongoose.model("FoodB", SchemaZ);

/*Blog.create({
	title : "New test",
	image : "https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
	body : "This is my new car."
})*/ 
//Routes
app.get("/",function(req,res){
	res.redirect("blogs");
});
app.get("blogs", function(req,res){
	FoodB.find({}, function(err,blogs){
		if(!err){
			res.render("main",{blogs : blogs});
		}
		
	});
});
app.get("/blogs/new",function(req,res){
	res.render("new");
});

app.post("/blogs", function(req,res){
	//sanitize the body content
//	req.body.blog.body = req.sanitize(req.body.blog.body);
	FoodB.create(req.body.blog, function(err,newblog){
			if(err){
				res.render("new");
			}		
			else{
				res.redirect("/blogs")
			}
	});
});

app.get("/blogs/:id", function(req,res){
	FoodB.findById(req.params.id, function(err, founditem){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("blogitem",{blogss : founditem});
		}
	});
});


app.get("/blogs/:id/edit", function(req,res){
	FoodB.findById(req.params.id, function(err, founditem){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("edititem",{blog : founditem});
		}
	});
});

app.put("/blogs/:id", function(req,res){
//	req.body.blog.body = req.sanitize(req.body.blog.body);
	FoodB.findByIdAndUpdate(req.params.id, req.body.blog,function(err, updatedblog){
		if(err){
			res.redirect("/blogs");
		} 
		else{
			res.redirect("/blogs/"+ req.params.id);
		}
	});
});

app.delete("/blogs/:id", function(req,res){
	FoodB.findByIdAndRemove(req.params.id,function(err){
			res.redirect("/blogs");
		 
	});
});
app.listen(process.env.PORT,process.env.IP); 
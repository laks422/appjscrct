const Express=require('express');
var app=new Express();
var request=require('request');
var bodyparser=require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:'true'}));
app.use(Express.static(__dirname+"/public"));
// For CORS,Pgm Line no 12 to 29
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200' );

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.set('view engine','ejs');
var mongoose=require('mongoose');
mongoose.connect("mongodb://localhost:27017/message");
//mongoose.connect("mongodb+srv://mongodb:mongodb@mycluster-rfooj.mongodb.net/test?retryWrites=true&w=majority");
mongoose.connect("mongodb+srv://2ammuammu:kichukichu@cluster0-zdx0e.mongodb.net/test?retryWrites=true&w=majority");
      
var MovieModel=mongoose.model('Message',{
    moviename:String,
    actor:String,
    actress:String,
    director:String
});
app.get('/',(req,res)=>
{
    res.render('index');
});
app.get('/index',(req,res)=>
{
    res.render('index');
});
app.post('/readApi',(req,res)=>{
   var message=new MovieModel(req.body);
   message.save((error)=>
   {
       if(error)
       {
           throw error
       }
       else{
           res.send(message);
       }
   });
});

app.get('/viewApi',(req,res)=>
{
    MovieModel.find((error,data)=>{
        if(error)
        {
            throw error
        }
        else{
            res.send(data);
        }

    });
});
app.get('/view',(req,res)=>
{
    var viewlink="http://localhost:3002/viewApi";

    request(viewlink,(error,response,body)=>{
        var data=JSON.parse(body);
        res.render('viewmessage',{data:data});
    });
});
app.post('/searchApi',(req,res)=>{


  var mov=req.body.moviename;
    MovieModel.find({moviename:mov},(error,data)=>
    {
        if(error)
        {
            throw error;

        }
        else{
            res.send(data);
        }
    })

});
app.post('/search',(req,res)=>
{
    var phonearg=req.body.phone;
    var viewlink="http://localhost:3002/searchApi"+phonearg;

    request(viewlink,(error,response,body)=>{
        var data=JSON.parse(body);
        res.render('searchresult',{data:data});
    });
});
app.get('/searchform',(req,res)=>{
    res.render('searchform');
})




app.listen(process.env.PORT || 3002,()=>
{
    console.log("Server is running");
})
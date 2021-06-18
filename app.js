//jshint esversion:6
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }
const express =require( "express");
const bodyParser =require( "body-parser");
const _ =require( "lodash");
const mongoose =require( "mongoose");
const ejs =require( "ejs");
const session =require( "express-session");
const passport =require( "passport");
const passportLocalMongoose =require( "passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy= require("passport-facebook").Strategy;
const findOrCreate = require("mongoose-findorcreate");
const productData=require(__dirname+"/data.js").productList;
const paypal=require("paypal-rest-sdk");
const Razorpay=require("razorpay");
const nodeMailer=require("nodemailer");


const app=express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.use(session({
    secret:"our little secret",
    resave:false,
    saveUninitialized:false
  }));
  app.use(passport.initialize());
  app.use(passport.session());

 var productid;
var Id,buyerName, buyerAddress,buyerPhone, orderIds;
var buyerTown, buyerPin, buyerEmail, buyerContact, buyerState ,orderUser, orderId, orders=[], order_id;

mongoose.connect("mongodb+srv://admin-nanda:Nanda13jan@cluster0.39bo6.mongodb.net/LNCollection", {useNewUrlParser:true,useUnifiedTopology: true});
mongoose.set("useCreateIndex",true);
// 

const userSchema=new mongoose.Schema({
    googleId:String,
    facebookId:String,
    username:String,
    password:String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User=new mongoose.model("User",userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
  
  paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': process.env.CLIENT_ID_PAYPAL,
    'client_secret': process.env.CLIENT_SECRET_PAYPAL
  });


  passport.use(new GoogleStrategy({
    clientID:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/product",
    userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    const googleUserName=profile.name.givenName;
    
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      orderUser=user.googleId;
      return cb(err, user);
    });
  }
));

passport.use(new FacebookStrategy({
    clientID:process.env.CLIENT_ID_FB,
    clientSecret:process.env.CLIENT_SECRET_FB,
    callbackURL: "http://localhost:3000/auth/facebook/product"
  },
  function(accessToken, refreshToken, profile, cb) {
   
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      orderUser=user.facebookId;
      return cb(err, user);
    });
  }
));


app.get("/",function(req,res){
    res.render("home");
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ["profile"] }));

  app.get("/auth/google/product",
    passport.authenticate("google", { failureRedirect: '/login' }),
    function(req, res) {
      
      res.redirect('/product');
    });

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/product',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
   
    res.redirect('/product');
  });

app.get("/signup",function(req,res){
    res.render("signup");
});
app.get("/login",function(req,res){
    res.render("login");
});

app.get("/product",function(req,res){
    if (req.isAuthenticated()){
    User.findOne({}, function(err, result) {
        if (err){
          console.log(err)
        } else{
    
          console.log(orderUser);
          
        res.render("product",{allProduct:productData});
      }
      });
    }
    else{
        res.redirect("/login");
    }
 
});


 app.post("/signup",function(req,res){

     User.register({username:req.body.username}, req.body.password,function(err,user){
         if(err){
             console.log(err);
             res.redirect("/signup")
         }
         else {
             passport.authenticate("local")(req,res, function(){
                 res.redirect("/product")
                 User.findOne({})
             });
            
         
         }
     });
 });

app.post("/login",function(req,res){
    
    const user= new User({
        username:req.body.username,
        password:req.body.password,
        
    });
    req.login(user,function (err){
        if (err){
        
            res.redirect("/login");
        }
        else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/product");
                orderUser=user.username;
               
            });
        }
    });
});

app.get("/buyerdetails",(req,res)=>{
  Id=(req.query.productID);
  res.render("buyerdetails");
 
 })

 //database schema for orders

 const orderSchema=new mongoose.Schema({
  user:String,
  productid:Number,
  date:String
});
const Order=mongoose.model("Order",orderSchema);

//database schema for save orders for us//
const orderforusSchema=new mongoose.Schema({
  orderTime:String,
  buyername:String,
  buyeraddress:String,
  buyertown:String,
  buyerpin:Number,
  buyeremail:String,
  buyerphone:Number,
  buyerstate:String,
  product:Number
  });
  const Orderforus=mongoose.model("Orderforus",orderforusSchema); 

app.post("/pay",(req,res) =>{
  // productid=req.body.id;
  buyerPhone=req.body.buyerphone;
  console.log(buyerPhone);
   
   const create_payment_json = {
      "intent": "sale",
      "payer": {
          "payment_method": "paypal"
      },
      "redirect_urls": {
          "return_url": "http://localhost:3000/success",
          "cancel_url": "http://localhost:3000/product"
      },
      "transactions": [{
          "item_list": {
              "items": [{
                  "name": productData[Id].name ,
                  "sku": Id,
                  "price": productData[Id].dollaramount,
                  "currency": "USD",
                  "quantity": 1,
                  
              }]
          },
          "amount": {
              "currency": "USD",
              "total": productData[Id].dollaramount
          },
          "description": productData[Id].description
      }]
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
   if (error) {
       throw error;
   } else {
     for(let i=0; i< payment.links.length;i++){
        if (payment.links[i].rel==='approval_url'){
           res.redirect(payment.links[i].href);
        }
     }
   }
});
});

app.get("/success",(req,res,productId)=>{
   const payerId=req.query.PayerID;
   const paymentId=req.query.paymentId;

   var execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
          "amount": {
              "currency": "USD",
              "total": productData[Id].dollaramount
          }
      }]
  };

  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
   if (error) {
       console.log(error.response);
       throw error;
   } else {
    // console.log(JSON.stringify(payment));
     
      //  console.log(JSON.stringify(payment.payer.payer_info));
      //  console.log(JSON.stringify(payment.transactions[0].amount))

       res.render("success",{Payment:payment,productList:productData});
       const orderPaypal=new Order({
        user:orderUser,
        productid:productData[Id].id,
        date:new Date().toLocaleDateString('en-US')
      })
      orderPaypal.save();
      
      const orderforus=new Orderforus({
        orderTime:new Date(),
        buyername:payment.payer.payer_info.shipping_address.recipient_name,
      buyeraddress:payment.payer.payer_info.shipping_address.line1,
      buyertown:payment.payer.payer_info.shipping_address.city,
      buyerpin:payment.payer.payer_info.shipping_address.postal_code,
      buyeremail:payment.transactions[0].payee.email,
      buyerphone:buyerPhone,
      buyerstate:payment.payer.payer_info.shipping_address.state,
      product:Id
      })
      orderforus.save();
  
       var todays = new Date();
       todays.setDate(todays.getDate() + 10);
       var deliveryDates=todays.toLocaleDateString('en-US');
       
         var transporters= nodeMailer.createTransport({
           service:'gmail',
           auth:{
             user:'lncollection.ltd@gmail.com',
             pass:process.env.EMAILPASSWORD
           }
         });
          
         var mailOption={
           from:'lncollection.ltd@gmail.com',
           to: payment.transactions[0].payee.email,
           subject:'order successful',
           html:"<h3>Thanks to Shop with us 😊</h3><h4>You have ordered </h4>"+productData[Id].name+"<h4>  of amount $</h4>"+productData[Id].dollaramount +
           "<span><h4>It will be reach you by</h4></span>"+deliveryDates + 
            
           "<h3>Contact details:</h3>" 
            +buyerName+"<br>"
            +buyerContact+
            "<h3>Hope you enjoyed </h3>"
         };
       
         // html: "'<h3> Thanks to Shop with us 😊</h3><br><h4>You have ordered </h4>'+productData[Id].name+ '<h4>of amount ₹</h4>' +productData[Id].price+'<br> <h4>It will be reach you by</h4>'+deliveryDate+'<h3>Hope you enjoyed </h3>' " 
       
         transporters.sendMail(mailOption,(err,info)=>{
           if(err){
             console.log(err);
           }
           else{
             console.log('Email sent: ' + info.response);
           }
         });


   }
});
});



const razorpay=new Razorpay({
  key_id:process.env.RAZORPAY_ID,
  key_secret:process.env.RAZORPAY_SECRET
})



app.get("/razorpay",(req,res)=>{
  if (req.isAuthenticated()){
    User.findOne({}, function(err, result) {
        if (err){
          console.log(err)
        } else{
          
        res.render("razorpay");
        buyerName=req.query.buyerName;
        buyerAddress=req.query.buyerAddress;
        buyerTown=req.query.buyerTown;
        buyerPin=req.query.buyerPin;
        buyerState=req.query.buyerState;
      }
      });
    }
    else{
        res.redirect("/login");
    }
  
  });



app.post("/order",(req,res)=>{
  const options = {
      amount:productData[Id].price+'00' ,  // amount in the smallest currency unit
      currency: "INR",

    };
    razorpay.orders.create(options, function(err, order) {
        order_id_var=order.id;
      // console.log(order);
      res.json(order)
    });
})
app.get("/razorpaysuccess",(req,res)=>{
  if (req.isAuthenticated()){
    User.findOne({}, function(err, result) {
        if (err){
          console.log(err)
        } else{
          res.render("razorpaysuccess",{buyername:buyerName,buyeraddress:buyerAddress,buyertown:buyerTown,buyerpin:buyerPin,buyeremail:buyerEmail,buyerphone:buyerContact,buyerstate:buyerState,product:productData[Id]})
      }
      });
    }
    else{
        res.redirect("/login");
    }
 
})
app.post("/razorpaysuccess",(req,res)=>{
const order=new Order({
  user:orderUser,
  productid:productData[Id].id,
  date:new Date().toLocaleDateString('en-US')
})
order.save();
  res.render("razorpaysuccess",{
    buyername:buyerName,
    buyeraddress:buyerAddress,
    buyertown:buyerTown,
    buyerpin:buyerPin,
    buyeremail:buyerEmail,
    buyerphone:buyerContact,
    buyerstate:buyerState,
    product:productData[Id]
    })
razorpay.payments.fetch(req.body.razorpay_payment_id).then((paymentDocument)=>{
 buyerEmail=(paymentDocument.email);
  buyerContact=(paymentDocument.contact);

 
    
  const orderforus=new Orderforus({
    orderTime:new Date(),
    buyername:buyerName,
    buyeraddress:buyerAddress,
    buyertown:buyerTown,
    buyerpin:buyerPin,
    buyeremail:buyerEmail,
    buyerphone:buyerContact,
    buyerstate:buyerState,
    product:Id
  })
  orderforus.save();

// mail Section
var today = new Date();
today.setDate(today.getDate() + 10);
var deliveryDate=today.toLocaleDateString('en-US');

  var transporter= nodeMailer.createTransport({
    service:'gmail',
    auth:{
      user:'lncollection.ltd@gmail.com',
      pass:process.env.EMAILPASSWORD
    }
  });
   
  var mailOptions={
    from:'lncollection.ltd@gmail.com',
    to: buyerEmail,
    subject:'order successful',
    html:"<h3>Thanks to Shop with us 😊</h3><h4>You have ordered </h4>"+productData[Id].name+"<h4>  of amount ₹</h4>"+productData[Id].price +
    "<span><h4>It will be reach you by</h4></span>"+deliveryDate + 
     
    "<h3>Contact details:</h3>" 
     +buyerName+"<br>"
     +buyerContact+
     "<h3>Hope you enjoyed </h3>"
  };

  // html: "'<h3> Thanks to Shop with us 😊</h3><br><h4>You have ordered </h4>'+productData[Id].name+ '<h4>of amount ₹</h4>' +productData[Id].price+'<br> <h4>It will be reach you by</h4>'+deliveryDate+'<h3>Hope you enjoyed </h3>' " 

  transporter.sendMail(mailOptions,(err,info)=>{
    if(err){
      console.log(err);
    }
    else{
      console.log('Email sent: ' + info.response);
    }
  });

}) 
})

//database for view order//

const vieworderSchema=new mongoose.Schema({
  user:String,
  id:String,
  date:String,
  img:String,
  brand:String,
  name:String,
  price:Number
});
const Vieworder=mongoose.model("Vieworder",vieworderSchema);

//view order section
app.get("/vieworder",(req,res)=>{
  Order.find({"user":orderUser}, function(err, result) {
    if (err){
      console.log(err)
    } else{
      result.forEach(element=>{
   orderId=element.productid;
   order_id=element._id;
   orderDate=element.date;

   const view=new Vieworder({
    user:orderUser,
   id:order_id,
   date:orderDate,
   img:productData[orderId].img,
   brand:productData[orderId].brand,
   name:productData[orderId].name,
   price:productData[orderId].price
  })

   Vieworder.findOneAndReplace({id:order_id},function(err,result){
     if(err){
       console.log(err)
     }else{
      view.save();
      user=orderUser,
      id=order_id,
      date=orderDate,
      img=productData[orderId].img,
      brand=productData[orderId].brand,
      name=productData[orderId].name,
      price=productData[orderId].price
    }
  })
  })
  Vieworder.find({"user":orderUser},function(err,result){
    if (err){
     console.log(err);
    }else{
      console.log(result)
     res.render("vieworder",{allProduct:result});
    }
  })



  } 
  })
})



app.get("/man",function(req,res){
  if (req.isAuthenticated()){
  User.findOne({}, function(err, result) {
      if (err){
        console.log(err)
      } else{
        const UserName=result.AppUserName;
      res.render("man",{allProduct:productData,appUserName:UserName});
    }
    });
  }
  else{
      res.redirect("/login");
  }

});
app.get("/woman",function(req,res){
  if (req.isAuthenticated()){
  User.findOne({}, function(err, result) {
      if (err){
        console.log(err)
      } else{
        const UserName=result.AppUserName;
      res.render("woman",{allProduct:productData,appUserName:UserName});
    }
    });
  }
  else{
      res.redirect("/login");
  }

});
app.get("/fogg",function(req,res){
  if (req.isAuthenticated()){
  User.findOne({}, function(err, result) {
      if (err){
        console.log(err)
      } else{
        const UserName=result.AppUserName;
      res.render("fogg",{allProduct:productData,appUserName:UserName});
    }
    });
  }
  else{
      res.redirect("/login");
  }

});
app.get("/denver",function(req,res){
  if (req.isAuthenticated()){
  User.findOne({}, function(err, result) {
      if (err){
        console.log(err)
      } else{
        const UserName=result.AppUserName;
      res.render("denver",{allProduct:productData,appUserName:UserName});
    }
    });
  }
  else{
      res.redirect("/login");
  }

});



 app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
  })

app.listen(3000,function (){
    console.log("This server runs at port 3000");
})

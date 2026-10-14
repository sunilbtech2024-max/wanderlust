const Review=require("../models/review");
const Listing=require("../models/listing");
const User=require("../models/user.js");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup=async(req,res)=>{
    try{
    let{username,email,password}=req.body;
   const newUser = new User({
    username,
    email,
    });
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    //automatically login banane ke liye
    req.login(registeredUser,(err)=>{
        if(err){
            next(err);
        }
        req.flash("success","Welcome to Wanderlust");
        res.redirect("/listings");
    });
    
}
catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
}
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};
//login se bahar janee ke kaam karata hai
module.exports.login=async (req, res) => {
        req.flash("success","Welcome to back Wanderlust!");
        let redirectUrl= res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
        return next(err);
        }
        req.flash("success","Logged You Out!");
        res.redirect("/listings");
    });
};
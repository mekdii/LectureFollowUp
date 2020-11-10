const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var subAdminSchema = new mongoose.Schema({
    firstName:{
        type:String,
        require:"First Name can\'t be empty "
      },
    middleName:{
        type:String,
        require:"Middle Name can\'t be empty "

    },  
    lastName:{
        type:String,
        require:"Last Name can\'t be empty ",
     },
    email:{
        type:String,
        require:"Email can\'t be empty "
    },
    mobile:{
        type:String,
        require:"Phone number can\'t be empty "
    },
    university:{
        type:String,
        require:"University can\'t be empty "

    },
    isActive:{
        type:Boolean,
        index:true,
        default:true
    },
    password:{
        type:String,
        require:"password can\'t be empty ",
        minlength:[4,'password must be at least 4 character']
    },
    salSecrete: String
});

subAdminSchema.path('email').validate((val)=>{
    emailRegex =/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(val);
    },'Invalid e-mail');

subAdminSchema.pre('save',function(next){
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(this.password,salt,(err,hash)=>{
            this.password = hash;
            this.salSecrete =salt;
            next();
        });
    });
});
/*
subAdminSchema.methods.comparePassword = function(condidatePassword,checkPassword){
    bcrypt.compare(condidatePassword,this.password,function(err,isMatch){
        if(err) return checkPassword(err);
        checkPassword(null,isMatch);
    });
}*/
subAdminSchema.methods.verifyPassword = function(password){
    return bcrypt.compareSync(password,this.password);
};

subAdminSchema.methods.generateJwt = function(){
    return jwt.sign({_id : this._id},
        process.env.JWT_SECRET,
        {
            expiresIn :process.env.JWT_EXP
 } );
    
 
}

subAdminSchema.index({firstName:'text',middleName:'text',lastName:'text'});

mongoose.model('Sub',subAdminSchema);
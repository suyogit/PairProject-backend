const validator= require("validator")

const validateSignUpData=(req)=>{
    const {firstName, lastName, emailId, password}= req.body;
    if(!firstName || !lastName)
    {
        throw new Error("Name is not valid!")
    }
    else if(!validator.isEmail(emailId))
    {
        throw new Error("Email is not valid")
    }
    else if(!validator.isStrongPassword(password))
    {
        throw new Error("Please enter strong password")
    }
}
const validateLoginData=(req)=>{
    const {firstName, lastName, emailId, password}= req.body;
   
    if(!validator.isEmail(emailId))
    {
        throw new Error("Email is not valid")
    }
    
}

module.exports={validateSignUpData, validateLoginData}
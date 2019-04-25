const validator = require('validator');
const isEmpty = require('./isEmpty');

const validateRegisterInput = (data) =>{
   let errors = {};
   if(!validator.isLength(data.name,{min: 2, max: 30})){
       errors.name = 'Name should be between 2 and 30 charecters';
   };

   return {
       errors,
       isValid: isEmpty(errors)
   }
};

module.exports = validateRegisterInput;
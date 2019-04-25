const validator = require('validator');
const isEmpty = require('./isEmpty');

const validateRegisterInput = (data) =>{
   let errors = {};

   data.name = !isEmpty(data.name) ? data.name : '';
   
   if(!validator.isLength(data.name,{min: 2, max: 30})){
       errors.name = 'Name should be between 2 and 30 charecters';
   };
   if(validator.isEmpty(data.name)){
       errors.name = 'Name field is required';
   }

   return {
       errors,
       isValid: isEmpty(errors)
   }
};

module.exports = validateRegisterInput;
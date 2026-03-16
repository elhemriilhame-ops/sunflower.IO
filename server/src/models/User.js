const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
     name: { type: String, 
           required: [true, 'Please add a name']
          },
            email: {   type: String, 
                  required: [true, 'Please add an email'],
                     unique: true,  
                       match: [ 
                            /^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$/,  
                               'Please add a valid email'  
                             ] 
                             },
                               password: {
                                   type: String,
                                      required: [true, 'Please add a password'],
                                        minlength: 6,   
                                         select: false  },
                                          role: {  type: String, 
                                              enum: ['admin', 'user', 'client', 'delivery', 'pepeniere_owner'],
                                                default: 'user'
                                             },
                                               createdAt: {
                                                   type: Date,
                                                     default: Date.now
                                                     }
                                                    });
                                                    
    // Encrypt password using bcrypt\nuserSchema.pre('save', async function(next) {\n  if (!this.isModified('password')) {\n    next();\n  }\n\n  const salt = await bcrypt.genSalt(10);\n  this.password = await bcrypt.hash(this.password, salt);\n});\n\n// Sign JWT and return\nuserSchema.methods.getSignedJwtToken = function() {\n  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {\n    expiresIn: '30d'\n  });\n};\n\n// Match user entered password to hashed password in database\nuserSchema.methods.matchPassword = async function(enteredPassword) {\n  return await bcrypt.compare(enteredPassword, this.password);\n};\n\nmodule.exports = mongoose.model('User', userSchema);\n

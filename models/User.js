const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: String,
    displayName: String,
    email: String,
    // Add more fields as needed
});

module.exports = mongoose.model('User', userSchema);

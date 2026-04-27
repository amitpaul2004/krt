const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    cgpa: { type: String },
    branch: { type: String },
    year: { type: String },
    techSkills: { type: String },
    tools: { type: String },
    interests: [{ type: String }],
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Profile', ProfileSchema);

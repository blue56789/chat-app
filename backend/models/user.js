const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        }
    }
);

userSchema.statics.signup = async function (username, password) {
    if (!username || !password)
        throw new Error('Please fill all fields');

    const exists = await this.findOne({ username });
    if (exists)
        throw new Error('Username is taken');

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({ username, password: hash });
    return user;
}

userSchema.statics.login = async function (username, password) {
    if (!username || !password)
        throw new Error('Please fill all fields');

    const user = await this.findOne({ username });
    // console.log(user);
    if (user) {
        const matches = await bcrypt.compare(password, user.password);
        if (matches)
            return user;
        else
            throw new Error('Invalid credentials');
    } else
        throw new Error('Invalid credentials');
}

module.exports = mongoose.model('User', userSchema);
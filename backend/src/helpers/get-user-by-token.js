const res = require('express/lib/response');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getUserByToken = async (token) => {

    if(!token) {
        return res.status(401).json({ message: 'Acesso Negado' });
    }

    const decoded = jwt.verify( token, '@gAl(y*se%5nbcr!ax,<et-=+vç~S^]');
    const userId = decoded.id;
    const user = await User.findOne({ _id: userId });
    return user;
}
module.exports = getUserByToken;
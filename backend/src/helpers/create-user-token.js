const jwt = require("jsonwebtoken");

const createUserToken = async(user, req, res) => {
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, "@gAl(y*se%5nbcr!ax,<et-=+vç~S^]");//O segundo parâmetro é o secret

    //retornar o token
    res.status(200).json({
        message: 'Voçê está autenticado',
        token: token,
        userId: user._id
    });
}

module.exports = createUserToken;
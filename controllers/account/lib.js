const User = require("../../schema/schemaUser.js");
const passwordHash = require("password-hash");


async function signup(req, res) {
    const { password, email } = req.body;
    if (!email || !password) {
        // le cas ou email OU le mdp est absent/nul 
        return res.status(400).json({
            text: "Requête invalide"
        })
    }

    // Création d'un objet user, dans lequel on hash le mot de passe
    const user = {
        email,
        password: passwordHash.generate(password)
    }
    // On check en base si l'utilisateur existe déjà
    try {
        const findUser = await User.findOne({
            email
        });

        if (findUser) {
            return res.status(400).json({
                text: "L'utilisateur existe déjà"
            });
        }

    } catch (error) {
        return res.status(400).json({ text: "" })
    }

    //Sauvegarde de l'utilisateur en base
    try {
        const userData = new User(user);
        const userObject = await userData.save();
        return res.status(200).json({
            text: "succès",
            token: userObject.getToken()
        });
    } catch (error) {
        return res.status(500).json({ error })
    }



}

async function login(req, res) {
    const { password, email } = req.body;
    if (!email || !password) {
        //Le cas où l'email ou le pswrd n'est pas soumis ou est nul
        return res.status(400).json({
            text: "Requête invalide"
        });
    }
    try {
        //on check si l'utilisateur existe en base de donnée
        const findUser = await User.findOne({ email });
        if (!findUser) {
            return res.status(401).json({
                text: "L'utilisateur n'existe pas"
            });
        }
        if (!findUser.authenticate(password)) {
            return res.status(401).json({ text: "mot de passe incorrect" });
        }
        return res.status(200).json({
            token: findUser.getToken(),
            text: "Authentification réussie"
        });
    } catch (error) {
        return res.status(500).json({
            error
        })
    }

}

exports.login = login;
exports.signup = signup;
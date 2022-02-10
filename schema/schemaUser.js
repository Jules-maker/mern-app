const mongoose = require("mongoose");
const passwordHash = require("password-hash");
const jwt = require("jwt-simple");
const config = require("../config/config");
// ici on crée un shema utilisateur, avec un email et un mdp
const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: { createdAt: "created_at" } }
);
// on assigne deux méthodes à ce shéma, un pour vérifier si le mdp correspond et l'autre créant un token àpartir du modèle et de la chaine de caractère secrete(clé) dans le fichier config
// TODO: faire un gitignore pour le dossier config
userSchema.methods = {
  authenticate: function(password) {
    return passwordHash.verify(password, this.password);
  },
  getToken: function() {
    return jwt.encode(this, config.secret);
  }
};

module.exports = mongoose.model("User", userSchema);
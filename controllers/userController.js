const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) 
      .then((hash) => {
        console.log("d5alna lel hash");
        console.log(req.body);
        /* const userObject=req.body.user;
        delete userObject._id; */
        me = {
          email: req.body.email,
          password: hash,
          fullname:req.body.fullname,
          pseudo:req.body.pseudo
          //photo: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        }
        const user = new User(me);
        user.joiValidate(me);
        user.save()
          .then(() => {
            res.status(201).json({ message: "utilisateur crée!" })})
          .catch(error => {
            console.log("masaretch el creation");
            console.log(error);
            res.status(500).json({ error })
          });

      })
    };
  /* bcrypt.hash(, 10)
    .then( 
      hash => {
       
    }).catch( 
      error => { console.log("mad5alnech lel hash");
      console.log(error);
        res.status(500).json({ error })
      }); */


exports.getAllUser = (req, res, next) => {
  User.find().then(
    (Users) => {
      res.status(200).json(Users);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
exports.login = (req, res, next) => {
  User.findOne({ 
    $or: [{
      "email": req.body.email
    }, {
      "pseudo": req.body.email
    }]
   })
    .then(
      user => {
        if (!user) {
           console.log("mal9inech user ", req.body.email);
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        console.log("l9ina user");
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              console.log("mot de passe moch s7i7");
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            console.log("mot de passe s7i7");
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => {
            console.log("mochkla fel compare");
            res.status(500).json({ error })
          });
      })
    .catch(error => res.status(500).json({ error }));
};

exports.deleteUser = (req, res, next) => {
  User.deleteOne({ _id: req.params.id }).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
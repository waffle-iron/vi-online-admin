import rdb from 'rethinkdb';
import config from '../config';
import {authenticate} from '../lib/auth';
import {generate} from '../lib/token';
import * as model from '../models/userModel';
import {verify} from '../lib/token'

class AuthController {

  static async loginWithToken(req, res) {
    console.log('loginWithToken');
    if (!req.body) {
      res.status(400);
      return res.send('Bad request.');
    }

    try {
      const {token}=req.body;

      const data = verify(token, (err)=> {
        throw err;
      });
      console.log(data);

      const user = await model.getUserByEmail(data.user.email);
      console.log('loginWithToken',user);

      if (user.blocked) {
        throw new Error('A felhasználó tiltva van.');
      }

      res.send({ user, token });
    } catch (err) {
      console.log(err.message);
      return res.send({ error: err.message });
    }

  }

  static async login(req, res) {

    console.log('login');
    if (!req.body) {
      res.status(400);
      return res.send('Bad request.');
    }
    try {
      const {email,password}=req.body;

      if (!(email || password) || email.length < 3) {
        throw new Error('Az email cím és jelszó megadása kötelező');
      }

      const user = await model.getUserByEmail(email);

      if (!user) {
        throw new Error('Az email cím vagy jelszó nem megfelelő');
      }

      if (user.blocked) {
        throw new Error('A fiókja jelenleg le van tiltva.');
      }

      const authenticated = await authenticate(password, user.password);

      if (authenticated) {
        return res.send({
          user,
          token: generate(user),
        });
      } else {
        throw new Error('Az email cím vagy jelszó nem megfelelő');
      }
    } catch (err) {
      return res.send({ error: err.message });
    }
  }
}

export default AuthController;

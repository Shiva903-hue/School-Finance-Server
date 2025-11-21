import MySQLStoreFactory from 'express-mysql-session';
 import session from 'express-session';
import db from '../DataBase/DBConn.js';

function setupSession(app) {
  const MySQLStore = MySQLStoreFactory(session);

  const sessionStore = new MySQLStore({}, db.promise ? db.promise() : undefined);

  app.use(session({
    key: 'sid',
    secret: process.env.SESSION_SECRET || 'school-system',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // maxAge: 1000 * 60 * 60 * 4, // 4 hours
      maxAge: 1000 * 60 * 15, // 15 minutes
      sameSite: 'lax'
      // secure: true // enable when using HTTPS
    }
  }));
}

export default setupSession;

import * as mysql from 'mysql2';
 
// Create the connection pool. The pool-specific settings are the defaults
const TutorialDatabasePool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'tutorial',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  password: 'Qweqwe12321'
}).promise();

export default TutorialDatabasePool;
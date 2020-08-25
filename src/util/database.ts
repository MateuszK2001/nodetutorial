import mongodb, { MongoClient } from 'mongodb';
import { Console } from 'console';

let _db:mongodb.Db;

const mongoConect = async ()=>{
  try {
    const client = await mongodb.connect('',{
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    _db = client.db();
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export const getDb = ()=>{
  if(_db){
    return _db;
  }
  throw 'No database found!';
}

export default mongoConect;
const {MongoClient} = require("mongodb");

let client;

// Use connect method to connect to the server
function connect() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(
      process.env.DB_URI,
      (err, res) => {
        if (err) {
          reject(err);
        }
        client = res.db();

        resolve(client);
      },
    );
  });
}


function query(options = {}){
    return client.collection('records').aggregate([
      {
        $match: { createdAt: {...options.createdAt}},
      },
      {
        $project: {
          _id: 0,
          key: 1,
          createdAt: 1,
          totalCount: { $sum: "$counts" },
        },
      },
      {
        $match: { totalCount: {...options.totalCount}},
      }
    ]).toArray();
}

module.exports = {connect, query} 
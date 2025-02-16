const express = require('express');
require('dotenv').config(); 
const app = express();
const PORT = process.env.PORT;
const { graphqlHTTP } = require('express-graphql');
const { schema, root } = require('./graphqlSchema')

// database connection
const connectDB = require('./lib/db');

// api setup for graphql
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

// start running
app.listen(PORT, () => {
  connectDB()
  console.log(`App is running on http://localhost:${PORT}`);
});

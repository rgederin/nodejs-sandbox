const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
var { graphqlHTTP } = require('express-graphql');

const multerUtils = require('./utils/multerUtils');
const middlewareUtils = require('./utils/middlewareUtils');

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const auth = require('./utils/auth');
const app = express();

app.use(bodyParser.json());
app.use(multer(multerUtils.multerSetup).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(middlewareUtils.corsHeadersMiddelware);

app.use(auth);

app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    formatError(err) {
        if (!err.originalError) {
            return err;
        }

        const data = err.originalError.data;
        const message = err.message || 'An error occcured';
        const code = err.originalError.code || 500;

        return {
            message: message,
            status: code,
            data: data
        };
    }
}));

app.use(middlewareUtils.handleErrorMiddelware);

mongoose.connect('mongodb+srv://rgederin:rownUovIp5jHzPQ2@cluster0.9acrc.mongodb.net/blog?retryWrites=true&w=majority')
    .then(result => {
        app.listen(8080);
    })
    .catch(err => {
        console.log(err);
    });
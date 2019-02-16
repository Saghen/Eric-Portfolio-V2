const Koa = require('koa');
const app = new Koa();

require('./routes/')(app)

app.listen(8080);
const http = require('./http')
const port = process.env.PORT

http.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
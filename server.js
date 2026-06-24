const env = require('dotenv').config({
  override:true
});
const app = require('./src/app');
const userRepository = require('./src/repositories/user.repository');
const PORT = process.env.PORT || 3000;

userRepository.createDefaultAdmin();

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

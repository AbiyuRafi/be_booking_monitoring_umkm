require("dotenv").config();
const cors = require('cors'); 
const app = require("./servers/Index");

app.use(cors({
  origin: [
    'https://kdosirak.com'
  ]
}));

const PORT = process.env.PORT || 8090;

app.listen(PORT, () => console.log(`Application running on port ${PORT}`));
const bcrypt = require("bcrypt");
const cryptPwd = async ()=>{
    const password = "123";

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(hashedPassword);
}

cryptPwd();
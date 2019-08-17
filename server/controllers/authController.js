exports.login = async (req, res, next) => {
    // email
    // password
    const { email, password } = req.body;

    // Check if email or password exist
    if (!email || !password) 
        // need to add error handling
    
    const user = await Users.find(req.body);

}
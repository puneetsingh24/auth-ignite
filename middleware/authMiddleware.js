import axios from 'axios';

export const authenticateUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            Description: 'The access_token is a required parameter.',
            ErrorCode: 908,
            Message: "A parameter is not formatted correctly",
          });
    }

    const token = authHeader.split(' ')[1];
    console.log(authHeader, process.env.THIRD_PARTY_API + "/identity/v2/auth/account",process.env.API_KEY)
    try {
        // LR auth
        const { data } = await axios.get(process.env.THIRD_PARTY_API + "/identity/v2/auth/account", {
            headers: {
                Authorization: authHeader
            },
            params: {
                apikey: process.env.API_KEY
            },
        });
        // Attach user data to request
        req.user = data;
        next();
    } catch (error) {
        console.error('Auth error:', error.message);
        if (error.response) {
            // Return exactly the external API's error response
            return res
              .status(error.response.status || 500)
              .json(error.response.data);
          }
      
          return res.status(401).json({
            Description: 'Internal Server Error',
            ErrorCode: 401,
            Message: "Invalid token",
          });
    }
};
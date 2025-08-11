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

export const orgValidation = async (req, res, next) => {

    const orgId = req.query.org_id
    if (!orgId || orgId == "") {
        return res.status(401).json({
            Description: 'The org_id is a required parameter.',
            ErrorCode: 908,
            Message: "A parameter is not formatted correctly",
          });
    }

    try {
        // LR auth
        const { data } = await axios.get(process.env.THIRD_PARTY_API + "/v2/manage/account/"+req.user.Uid+"/orgcontext/"+orgId, {
            params: {
                apikey: process.env.API_KEY,
                apisecret: process.env.API_SECRET
            },
        });
        console.log(data)
        // Attach user data to request
        let roleId = data.Data[0].RoleId;

        req.user.roleId = roleId
        req.user.orgId = orgId

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
            Message: error.message,
          });
    }
};
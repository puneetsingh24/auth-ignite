import { privateClient } from "../utils/httpClients.js";
import Credential from "../models/Credential.js";

export const verifyCredential = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            Description: 'The email is a required parameter.',
            ErrorCode: 908,
            Message: "A parameter is not formatted correctly",
        });
    }

    const response = await privateClient.get(
        `${process.env.THIRD_PARTY_API}/identity/v2/manage/account/identities`,
        {
          params: {
            email: email,
            apikey: process.env.API_KEY,
            apisecret: process.env.API_SECRET,
          },
        }
      );

      const uid = response.data?.Data?.[0]?.Uid || null;

      if (uid == null) {
        // show error
      }
      

      const didResponse = await privateClient.post(
        process.env.DID_API,
        {
        "authority": process.env.DID_AUTHORITY,
        "registration": { "clientName": "Auth Ignite" },
        "callback": {
            "url": `${process.env.BACKEND_URL}/credential/webhook/verify`,
            "state": uid
        },
        "requestedCredentials": [
            {
            "type": "MVP Email Credential",
            "constraints": [
                {
                "claimName": "email",
                "values": [
                    email
                ]
                }
            ],
            "configuration": {
                "validation": {
                "allowRevoked": false
                }
            },
            "purpose": "Verify a user with did credentials"
            }
        ]
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.DID_TOKEN}`,
            },
        }
      );
 
      res.json({
        "sucess":true, 
        "qrcode": didResponse.data.url,
        "guid": didResponse.data.requestId
      });
  
    } catch (error) {
      if (error.response) {
        return res
          .status(error.response.status || 500)
          .json(error.response.data);
      }
      res.status(500).json({
        Description: "Internal Server Error",
        ErrorCode: null,
        Message: error.message
      });
    }
  };

export const verifyWebhook = async (req, res) => {
    try {
        const { requestId, requestStatus, state } = req.body;

        await Credential.updateOne({requestId:requestId, state:state},{$set:{requestStatus: requestStatus}});

        res.json({ success: true });
        
    } catch (error) {
        if (error.response) {
            return res
            .status(error.response.status || 500)
            .json(error.response.data);
        }
        res.status(500).json({
            Description: "Internal Server Error",
            ErrorCode: null,
            Message: error.message
        });
    }
};

export const pingStatus = async (req, res) => {
    try {
        const requestId = req.params.requestId;

        let credential = await Credential.findOne({requestId:requestId});


        const loginResponse = await privateClient.get(
        `${process.env.THIRD_PARTY_API}/identity/v2/manage/account/access_token`,
        {
          params: {
            uid: credential.state,
            apikey: process.env.API_KEY,
            apisecret: process.env.API_SECRET,
          },
        }
      );

        res.json({ success: true, response: loginResponse.data });
        
    } catch (error) {
        if (error.response) {
            return res
            .status(error.response.status || 500)
            .json(error.response.data);
        }
        res.status(500).json({
            Description: "Internal Server Error",
            ErrorCode: null,
            Message: error.message
        });
    }
};
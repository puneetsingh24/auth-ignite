import { privateClient } from "../utils/httpClients.js";
import Credential from "../models/Credential.js";
import axios from "axios";

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
      let didToken = process.env.DID_TOKEN.replace(/(\r\n|\n|\r)/gm, '');
      
      const didResponse = await axios.post(
        `${process.env.DID_API}/createPresentationRequest`,
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
                "Content-Type": "application/json",
                Authorization: `Bearer ${didToken}`,
            },
            timeout: 10000 // 5 seconds
        }
      );


      let doc = await Credential.create({
        state: uid,
        requestStatus: "request_pending",
        requestId: didResponse.data.requestId
      });
    
      console.log("Inserted:", doc);
 
      res.json({
        "sucess":true, 
        "qrcode": didResponse.data.url,
        "guid": didResponse.data.requestId
      });
  
    } catch (error) {
      console.log(error)
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

  export const createCredential = async (req, res) => {
    try {
      const email = req.user.Email[0].Value;
  
      let didToken = process.env.DID_TOKEN.replace(/(\r\n|\n|\r)/gm, '');
  console.log("=======================",{
    "authority": process.env.DID_AUTHORITY,
    "registration": { "clientName": "Auth Ignite" },
    "type": "MVP Email Credential",             
    "manifest": process.env.DID_MANIFEST,
    "claims": { "email": email },
    "callback": {
      "url": `${process.env.BACKEND_URL}/credential/webhook/verify`,
      "state": req.user.Uid
    }
  })
        const didResponse = await axios.post(
          `${process.env.DID_API}/createIssuanceRequest`,
          {
            "authority": process.env.DID_AUTHORITY,
            "registration": { "clientName": "Auth Ignite" },
            "type": "MVP Email Credential",             
            "manifest": process.env.DID_MANIFEST,
            "claims": { "email": email },
            "callback": {
              "url": `${process.env.BACKEND_URL}/credential/webhook/verify`,
              "state": req.user.Uid
            }
          },
          {
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${didToken}`,
              },
              timeout: 10000 // 5 seconds
          }
        );
  
        let doc = await Credential.create({
          state: uid,
          requestStatus: "request_pending",
          requestId: didResponse.data.requestId
        });
      
        console.log("Inserted:", doc);
   
        res.json({
          "sucess":true, 
          "qrcode": didResponse.data.url,
          "guid": didResponse.data.requestId
        });
    
      } catch (error) {
        console.log(error)
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

        if (credential != null) {
          if (credential.requestStatus == "presentation_verified") {
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
      
            return res.json({ access_token: loginResponse.data.access_token});
          }
        }

        res.json({ access_token: null});
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
import User from "../models/User.js";
import { privateClient } from "../utils/httpClients.js";
import { CONSTANT } from "../config/constant.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = new User({ name, email });
    await user.save();
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const createOrg = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'name is required in request body',
      });
    }


    // Step 1: Create Organization
    const orgResponse = await privateClient.post(
      `${process.env.THIRD_PARTY_API}/v2/manage/organizations`,
      { name }, // POST body
      {
        params: {
          apikey: process.env.API_KEY,
          apisecret: process.env.API_SECRET,
        },
      }
    );

    const orgData = orgResponse.data;

    console.log("11111", orgData.Id)
    // Step 2: Add user to organization
    const ownershipResponse = await privateClient.put(
      `${process.env.THIRD_PARTY_API}/v2/manage/account/${req.user.Uid}/orgcontext/${orgData.Id}/roles`,
      { RoleIds: [CONSTANT.OWNER_ROLE_ID] },
      {
        params: {
          apikey: process.env.API_KEY,
          apisecret: process.env.API_SECRET,
        },
      }
    );

    res.json({
      success: true
    });

  } catch (error) {
    console.log("222222", error.message)
    if (error.response) {
      // Return exactly what the API sent
      return res
        .status(error.response.status || 500)
        .json(error.response.data);
    }

    res.status(500).json({
      Description: 'Internal Server Error',
      ErrorCode: null,
      Message: error.message,
    });
  }
};


export const sendInvitation = async (req, res) => {
  try {
    const { roleId, email, orgId } = req.body;

    let payload = {
      "Email": email,
      "OrgId": orgId,
      "RoleIds": [roleId],
      "InvitationUrl": process.env.FRONTEND_URL,
      "InviterUid": req.user.Uid
    }

    console.log(payload)
    // Step 1: send Inviation
    const invitationResponse = await privateClient.post(
      `${process.env.THIRD_PARTY_API}/v2/manage/invitations`,
      payload,
      {
        params: {
          apikey: process.env.API_KEY,
          apisecret: process.env.API_SECRET,
        },
      }
    );

    res.json({
      success: true
    });

  } catch (error) {
    if (error.response) {
      // Return exactly what the API sent
      return res
        .status(error.response.status || 500)
        .json(error.response.data);
    }

    res.status(500).json({
      Description: 'Internal Server Error',
      ErrorCode: null,
      Message: error.message,
    });
  }
};

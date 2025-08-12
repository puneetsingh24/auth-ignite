import { privateClient } from "../utils/httpClients.js";
import { CONSTANT } from "../config/constant.js";

export const createOrg = async (req, res) => {
  try {
    const { name, domain } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'name is required in request body',
      });
    }

    if (!domain) {
      return res.status(400).json({
        success: false,
        message: 'domain is required in request body',
      });
    }


    let payload = {
      "Name": name,
      "Domains": [
        {
          "DomainName": domain,
          "IsVerified": true
        }
      ]
    }

    // Step 1: Create Organization
    const orgResponse = await privateClient.post(
      `${process.env.THIRD_PARTY_API}/v2/manage/organizations`,
      payload, // POST body
      {
        params: {
          apikey: process.env.API_KEY,
          apisecret: process.env.API_SECRET,
        },
      }
    );

    const orgData = orgResponse.data;

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


export const getOrgMembers = async (req, res) => {

  try {
    let orgId = req.user.orgId

    // Step 1: Get all users with roles from the org
    const membersRes = await privateClient.get(
      `${process.env.THIRD_PARTY_API}/v2/manage/organizations/${orgId}/orgcontext`,
      {
        params: {
          apikey: process.env.API_KEY,
          apisecret: process.env.API_SECRET,
        },
      }
    );
    const members = membersRes.data?.Data || [];

    // Step 2: Cache for role details so we don’t fetch same role twice
    const roleCache = {};

    const memberDetails = await Promise.all(
      members.map(async (member) => {

        const roleId = member.Roles?.[0] || null;
        let roleData = null;

        if (roleId) {
          // If we haven't fetched this role before, fetch it now
          if (!roleCache[roleId]) {
            const roleRes = await privateClient.get(`${process.env.THIRD_PARTY_API}/v2/manage/roles/${roleId}`,{
              params: {
                apikey: process.env.API_KEY,
                apisecret: process.env.API_SECRET,
              },
            });
            roleCache[roleId] = roleRes.data;
          }
          roleData = roleCache[roleId];
        }

        return {
          Email: member.Email,
          Uid: member.UserId,
          Role: roleData
            ? { Id: roleData.Id, Name: roleData.Name }
            : null,
          Permissions: roleData
            ? roleData.Permissions.map((perm) => ({
                Id: perm.Id,
                Name: perm.Name
              }))
            : []
        };
      })
    );

    res.json({"sucess":true, "members": memberDetails});

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




export const sendInvitation = async (req, res) => {
  try {
    const { roleId, email } = req.body;

    let payload = {
      "Email": email,
      "OrgId": req.user.orgId,
      "RoleIds": [roleId],
      "InvitationUrl": process.env.FRONTEND_URL,
      "InviterUid": req.user.Uid
    }


    // Step 1: send Inviation
    const invitationResponse = await privateClient.post(
      `${process.env.THIRD_PARTY_API}/v2/manage/invitations`,
      payload,
      {
        params: {
          InvitationUrl:process.env.FRONTEND_URL,
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


export const deleteOrganization = async (req, res) => {
  try {
    
    let orgId = req.user.orgId

    // Delete Organization
    await privateClient.delete(
      `${process.env.THIRD_PARTY_API}/v2/manage/organizations/${orgId}`,
      {
        params: {
          apikey: process.env.API_KEY,
          apisecret: process.env.API_SECRET,
        },
      }
    );
 
    res.json({"sucess":true});

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





export const removeMember = async (req, res) => {
  try {
    
    let orgId = req.user.orgId
    let uid = req.params.uid

    // Delete member from organization
    await privateClient.delete(
      `${process.env.THIRD_PARTY_API}/v2/manage//account/${uid}/orgcontext/${orgId}`,
      {
        params: {
          apikey: process.env.API_KEY,
          apisecret: process.env.API_SECRET,
        },
      }
    );
 
    res.json({"sucess":true});

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


export const updateOrgMFA = async (req, res) => {
  try {
    const { MFAMandatory } = req.body;

    let enforcementMode = "optional"
    if (MFAMandatory) {
      enforcementMode = "force"
    }

    let payload = {
      "MFAPolicy": {
        "EnforcementMode": enforcementMode,
      },
    }

    const mfaResponse = await privateClient.put(
      `${process.env.THIRD_PARTY_API}/v2/manage/organizations/${req.user.orgId}/policy`,
      payload,
      {
        params: {
          apikey: process.env.API_KEY,
          apisecret: process.env.API_SECRET,
        },
      }
    );

    res.json({
      success: true,
      MFAMandatory: MFAMandatory
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
import { privateClient } from "../utils/httpClients.js";
import { ROLE_NAME_MAP } from "../config/constant.js";

export const listInvitations = async (req, res) => {
  try {
    let orgId = req.user.orgId

    const response = await privateClient.get(
        `${process.env.THIRD_PARTY_API}/v2/manage/invitations`,
        {
          params: {
            orgid: orgId,
            apikey: process.env.API_KEY,
            apisecret: process.env.API_SECRET,
          },
        }
      );

      const invitationList = response.data?.Data || [];

      res.json({
        "sucess":true, 
        "invitations": invitationList.map((invitation) => ({
                Id: invitation.Id,
                Role: ROLE_NAME_MAP[invitation.RoleIds[0]],
                Status: invitation.Status,
                Email: invitation.EmailId,
                InvitedDate: invitation.CreatedDate
              }))
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


export const revokeInvitation = async (req, res) => {
  try {
    
    let invitationId = req.params.invitationId

    // Remove invitation
    await privateClient.delete(
      `${process.env.THIRD_PARTY_API}/v2/manage/invitations/${invitationId}`,
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
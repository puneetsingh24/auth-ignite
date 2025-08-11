import User from "../models/User.js";
import { privateClient } from "../utils/httpClients.js";
import axios, { formToJSON } from "axios";

// const privateClient = axios.create({
//   baseURL: process.env.THIRD_PARTY_API,
//   params: {
//     apikey: process.env.API_KEY,
//     apisecret: process.env.API_SECRET
//   }
// });

export const getUserOrgsAndRoles = async (req, res) => {
  try {
    // Step 1: Get all org contexts for the user
    const userOrgsRes = await privateClient.get(
      `${process.env.THIRD_PARTY_API}/v2/manage/account/${req.user.Uid}/orgcontext`,
      {
        params: {
          apikey: process.env.API_KEY,
          apisecret: process.env.API_SECRET,
        },
      }
    );

    const orgContextList = userOrgsRes.data?.Data || [];

    // Step 2: Fetch org details in parallel
    const orgDetails = await Promise.all(
      orgContextList.map(orgCtx =>
        privateClient
          .get(`${process.env.THIRD_PARTY_API}/v2/manage/organizations/${orgCtx.OrgId}`,{
            params: {
              apikey: process.env.API_KEY,
              apisecret: process.env.API_SECRET,
            },
          })
          .then(resp => ({
            Id: resp.data.Id,
            Name: resp.data.Name
          }))
      )
    );

    // Step 3: Get all tenant roles
    const tenantRolesRes = await privateClient.get(`${process.env.THIRD_PARTY_API}/v2/manage/roles`,{
      params: {
        apikey: process.env.API_KEY,
        apisecret: process.env.API_SECRET,
      },
    });
    const tenantRoles = (tenantRolesRes.data?.Data || []).map(role => ({
      Id: role.Id,
      Name: role.Name
    }));

    // Step 4: Send response
    res.json({
      success: true,
      organizations: orgDetails,
      tenantRoles
    });

  } catch (error) {
    if (error.response) {
      return res
        .status(error.response.status || 500)
        .json(error.response.data);
    }
    console.log("fffffffffff")
    res.status(500).json({
      Description: "Internal Server Error",
      ErrorCode: null,
      Message: error.message
    });
  }
};


export const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = new User({ name, email });
    await user.save();
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const fetchExternalData = async (req, res) => {
  try {
    const response = await apiClient.get(process.env.THIRD_PARTY_API);
    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

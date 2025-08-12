import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const tenantId = process.env.AZURE_TENANT_ID;
const clientId = process.env.AZURE_CLIENT_ID;
const clientSecret = process.env.AZURE_CLIENT_SECRET;
const scope = "3db474b9-6a0c-4840-96ac-1fceb342124f/.default";

let tokenCache = {
  value: null,
  expiry: 0 // epoch seconds
};

/**
 * Get a cached Microsoft access token, refreshing only if expired.
 */
export async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);

  // If token exists and not about to expire (5 min buffer), reuse it
  if (tokenCache.value && now < tokenCache.expiry - 300) {
    return tokenCache.value;
  }

  try {
    const res = await axios.post(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
        scope: scope
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" }, timeout: 5000 }
    );

    tokenCache.value = res.data.access_token;
    tokenCache.expiry = now + res.data.expires_in;

    return tokenCache.value;
  } catch (err) {
    if (err.response) {
      throw new Error(
        `Token request failed: ${err.response.status} ${err.response.statusText} - ${JSON.stringify(err.response.data)}`
      );
    } else {
      throw new Error(`Token request error: ${err.message}`);
    }
  }
}

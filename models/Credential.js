import mongoose from "mongoose";

const credentialSchema = new mongoose.Schema(
  {
    state: { type: String, required: true },
    requestStatus: { type: String, required: true },
    requestId: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

export default mongoose.model("Credential", credentialSchema);

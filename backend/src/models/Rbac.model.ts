import { Schema, model, Types } from "mongoose";

const permissionSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    description: String
  },
  { timestamps: true }
);

const roleSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    permissions: [{ type: Types.ObjectId, ref: "Permission" }]
  },
  { timestamps: true }
);

export const PermissionModel = model("Permission", permissionSchema);
export const RoleModel = model("Role", roleSchema);

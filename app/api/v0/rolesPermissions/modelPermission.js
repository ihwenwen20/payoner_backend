const mongoose = require("mongoose");

// const roleSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       maxLength: [20, 'maxLength 20 karakter'],
//       default: 'Admin',
//     },
//   },
//   { timestamps: true }
// );

const PermissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxLength: [20, "maxLength 20 karakter"],
    },
    // assignedTo: [roleSchema],
    assignedTo: {
      type: mongoose.Types.ObjectId,
      ref: "Role",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Permission", PermissionSchema);

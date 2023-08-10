const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const permissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
});

const rolePermissionSchema = new mongoose.Schema({
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
});

// const Role = mongoose.model('Role', roleSchema);
// const Permission = mongoose.model('Permission', permissionSchema);
// const RolePermission = mongoose.model('RolePermission', rolePermissionSchema);

// module.exports = {
//   // Role,
//   // Permission,
//   RolePermission,
// };
module.exports = mongoose.model("RolePermission", rolePermissionSchema);
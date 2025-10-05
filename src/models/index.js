import { Reservations } from "./reservation.js";
import { User } from "./user.js";
import { Rooms } from "./rooms.js";
import { Sales } from "./sales.js";

User.hasMany(Reservations, { foreignKey: "user_Dni", sourceKey: "dni" });
Reservations.belongsTo(User, { foreignKey: "user_Dni", targetKey: "dni" });

Rooms.hasMany(Reservations, { foreignKey: "room_Id", sourceKey: "Id" });
Reservations.belongsTo(Rooms, { foreignKey: "room_Id", targetKey: "Id" });

export { User, Reservations, Sales };

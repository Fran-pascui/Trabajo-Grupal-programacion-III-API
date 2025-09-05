import { Reservations } from "./reservation.js";
import { User } from "./user.js";
import { Rooms } from "./rooms.js";

User.hasMany(Reservations, { foreignKey: "user_Dni", sourceKey: "Dni" });
Reservations.belongsTo(User, { foreignKey: "user_Dni", targetKey: "Dni" });

Rooms.hasMany(Reservations, { foreignKey: "room_Id", sourceKey: "Id" });
Reservations.belongsTo(Rooms, { foreignKey: "room_Id", targetKey: "Id" });

export { User, Rooms, Reservations };

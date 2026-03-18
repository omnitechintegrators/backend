import {verifyToken,allowRoles} from "../middleware/authMiddleware.js";


router.delete(

"/:id",

verifyToken,

allowRoles("owner","administrator"),

deleteDonation

);
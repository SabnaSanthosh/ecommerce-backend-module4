const r=require("express").Router(),a=require("../middleware/authMiddleware"),c=require("../controllers/userProfile");
r.use(a.authenticate);r.get("/me",c.getMe);r.patch("/me",c.updateMe);
r.get("/",a.authorize("admin"),c.list);r.patch("/:id/role",a.authorize("admin"),c.role);r.delete("/:id",a.authorize("admin"),c.remove);module.exports=r;
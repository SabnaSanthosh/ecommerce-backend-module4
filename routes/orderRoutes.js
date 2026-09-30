const r=require("express").Router(),a=require("../middleware/authMiddleware"),c=require("../controllers/orderController");
r.use(a.authenticate);r.post("/",c.create);r.get("/",c.list);r.get("/:id",c.get);
r.patch("/:id/status",a.authorize("admin"),c.status);r.delete("/:id",c.remove);module.exports=r;
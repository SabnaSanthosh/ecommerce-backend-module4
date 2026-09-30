const r=require("express").Router(),a=require("../middleware/authMiddleware"),c=require("../controllers/productController");
r.get("/",c.list);r.get("/:id",c.get);
r.post("/",a.authenticate,a.authorize("admin"),c.create);r.put("/:id",a.authenticate,a.authorize("admin"),c.update);r.delete("/:id",a.authenticate,a.authorize("admin"),c.remove);module.exports=r;
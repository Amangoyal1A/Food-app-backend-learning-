const express = require("express");
const {
  protectRouteFromAuth,
  isAuthorised,
} = require("../Controllers/authController");
const {
  getAllPlans,
  getPlan,
  deletePlan,
  updatePlan,
  createPlan,
  top3Plans,
} = require("../Controllers/planController");

const planRouter = express.Router();

planRouter.use(protectRouteFromAuth);
planRouter.route("/plan/:id").get(getPlan);

planRouter.route("/allPlans").get(getAllPlans);

planRouter.use(isAuthorised(["Admin"]));
planRouter.route("/crudPlan").post(createPlan);

planRouter.use(isAuthorised(["Admin", "restaurantowner"]));
planRouter.route("/crudPlan/:id").patch(updatePlan).delete(deletePlan);

module.exports = { planRouter };

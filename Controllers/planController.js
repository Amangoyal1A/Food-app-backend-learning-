const planModel = require("../models/planModel");

async function getAllPlans(req, res) {
  let plans = await planModel.find();
  try {
    if (plans) {
      res.json({
        message: "all plan retrieved",
        data: plans,
      });
    } else {
      res.json({
        message: "data not found",
        data: null,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

async function getPlan(req, res) {
  let id = req.params.id;

  let purchasePlan = await planModel.findById(id);
  try {
    if (purchasePlan) {
      res.json({
        message: "plan retrieved",
        data: purchasePlan,
      });
    } else {
      res.json({
        message: "data not found",
        data: null,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

async function createPlan(req, res) {
  try {
    let planData = req.body;

    let createPlan = await planModel.create(planData);

    return res.json({
      message: "plan created successfully",
      data: createPlan,
    });
  } catch (err) {
    res.json({
        message:err.message
    })
  }
}


async function deletePlan(req, res) {
    try {
      let deletePlanid = req.params.id;
  
      let deleteplan = await planModel.findByIdAndDelete(deletePlanid)
  
      return res.json({
        message: "plan deleted successfully",
        data: deleteplan,
      });
    } catch (err) {
      res.json({
          message:err.message
      })
    }
  }


  async function updatePlan(req, res) {
    try {
      const updatePlanId = req.params.id;
      const dataToBeUpdated = req.body;
      console.log(dataToBeUpdated)
      const updatedPlan = await planModel.findByIdAndUpdate(updatePlanId, dataToBeUpdated, { new: true });
      
      return res.json({
        message: "Plan updated successfully",
        data: updatedPlan,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
  
  

  async function top3Plans(req, res) {
    try {
      const top3Plans = await planModel
        .find()
        .sort({ ratingsAverage: -1 })
        .limit(3);
  
      return res.json({
        message: "Here are the top 3 plans",
        data: top3Plans,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
  


module.exports = {
  getAllPlans,
  getPlan,
  createPlan,
  deletePlan,updatePlan,top3Plans
};

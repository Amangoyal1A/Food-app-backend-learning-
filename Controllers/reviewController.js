const planModel = require("../models/planModel");
const reviewModel = require("../models/reviewModel");

async function getAllreviews(req, res) {
  try {
    const allreviews = await reviewModel.find();
    if (allreviews) {
      res.json({
        message: "all review here",
        data: allreviews,
      });
    } else {
      res.json({
        message: "review not found",
        data: null,
      });
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
}
async function top3reviews(req, res) {
  try {
    const top3Review = await reviewModel
      .find()
      .sort({ rating: -1 })
      .limit(3);

    return res.json({
      message: "Here are the top 3 reviews",
      data: top3Review,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function getPlanReviews(req, res) {
  try {
//plan click ->uske corresponding jitne bhi review vo laker de
let planid = req.params.id;

let review = await reviewModel.find();

(await review).filter(reviews=>{
  return reviews.plan._id==planid
})

res.json({
  message:"you plan review",
  body:review
})



  } catch (error) {
    res.json({
      message: error.message,
      data: null,
    });
  }
}

async function CreateReviews(req, res) {
  try {
    const planid = req.params.plan;
    const plan = await planModel.findById(planid);
    let review = await  reviewModel.create(req.body);

    plan.ratingsAverage = (plan.ratingsAverage + req.body.rating) / 2;

    await review.save();
    res.json({
      message: "review created",
      data: review,
    });
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
}
async function deleteReview(req, res) {
    try{
      //this also comes from frontend
    let deleteReview = req.body.id;
    
    let deleteddata = await reviewModel.findByIdAndDelete(deleteReview);
    res.json({
        message:"review deleted",
        data:deleteddata
    })

    }catch(error)
    {
      res.json({
        message:error.message
      })
    }
}
async function updatereview(req, res) {
    try {
      //from frontend
        const reviewid = req.body.id;
        const dataToBeUpdated = req.body;
        const updatedreview = await reviewModel.findByIdAndUpdate(reviewid, dataToBeUpdated, { new: true });
        
        return res.json({
          message: "review updated successfully",
          data: updatedreview,
        });
      } catch (err) {
        console.error(err);
        return res.status(500).json({
          message: "Internal server error",
        });
      }
}

module.exports = {
  getAllreviews,
  top3reviews,
  getPlanReviews,
  CreateReviews,
  deleteReview,
  updatereview,
};

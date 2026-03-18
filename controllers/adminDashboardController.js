import Donation from "../models/Donation.js";
import Volunteer from "../models/Volunteer.js";
import Event from "../models/Event.js";


export const getDashboard = async (req, res) => {

  try {

    const totalAmountAgg = await Donation.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    const totalAmount = totalAmountAgg[0]?.total || 0;


    const totalDonations = await Donation.countDocuments();


    const totalVolunteers = await Volunteer.countDocuments();


    const activeVolunteers = await Volunteer.countDocuments({
      status: "approved"
    });


    const totalEvents = await Event.countDocuments();


    const upcomingEvents = await Event.countDocuments({
      date: { $gte: new Date() }
    });


    const todayStart = new Date();
    todayStart.setHours(0,0,0,0);


    const todayAgg = await Donation.aggregate([
      {
        $match: {
          createdAt: { $gte: todayStart }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);


    const todayCollection = todayAgg[0]?.total || 0;


    const recentDonations = await Donation
      .find()
      .sort({ createdAt: -1 })
      .limit(5);


    const recentVolunteers = await Volunteer
      .find()
      .sort({ createdAt: -1 })
      .limit(5);


    const chartData = await Donation.aggregate([

      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          amount: { $sum: "$amount" }
        }
      },

      {
        $sort: { "_id.month": 1 }
      }

    ]);


    res.json({

      totalAmount,
      totalDonations,

      totalVolunteers,
      activeVolunteers,

      totalEvents,
      upcomingEvents,

      todayCollection,

      recentDonations,
      recentVolunteers,

      chartData

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Dashboard error"
    });

  }

};


// Hellow, Men Please do that you sould complkete this 
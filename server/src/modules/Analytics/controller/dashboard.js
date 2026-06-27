import { dashBoardAnalytics } from "../services/dashboartServices.js";
export const getDashBoradAnalytics = async (req, res) => {
    const userId = req.user.id;
   try {
      const analytics = await dashBoardAnalytics(userId);
       return res.status(200).json({
           success: true,
           data: analytics
       });
   } catch (error) {
       return res.status(500).json({
           success: false,
           message: error.message,
       });
   }

}
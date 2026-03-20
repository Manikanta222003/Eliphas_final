import Billing from "../models/Billing.js";


// ADD BILLING
export const addBilling = async (req, res) => {

  try {

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const billing = new Billing({

      clientName: req.body.clientName || "",
      companyName: req.body.companyName || "",
      phoneNumber: req.body.phoneNumber || "",
      vehicleNumber: req.body.vehicleNumber || "",
      challanNumber: req.body.challanNumber || "",

      loadType: req.body.loadType || "",
      fromLocation: req.body.fromLocation || "",
      toLocation: req.body.toLocation || "",
      weight: req.body.weight || "",

      billingType: req.body.billingType || "",    // direct / outsourced
      billingBasis: req.body.billingBasis || "",  // trip / contract / ton-km / machine

      companyFare: req.body.companyFare || "",
      clientFare: req.body.clientFare || "",

      dieselQuantity: req.body.dieselQuantity || "",
      dieselPrice: req.body.dieselPrice || "",

      companyLocation: req.body.companyLocation || "",

      date: req.body.date ? new Date(req.body.date) : new Date(),
      time: req.body.time || new Date().toLocaleTimeString(),

      createdBy: req.user.username,
      role: req.user.role

    });

    await billing.save();

    res.status(201).json({
      message: "Billing saved successfully",
      data: billing
    });

  }
  catch (error) {
    console.error("Add billing error:", error);
    res.status(500).json({ message: error.message });
  }

};


// SEARCH BILLING
// Supports: vehicleNumber, challanNumber, date (YYYY-MM-DD), fromLocation, toLocation, loadType
export const searchBilling = async (req, res) => {

  try {

    const { vehicleNumber, challanNumber, date, fromLocation, toLocation, loadType } = req.query;

    const hasFilter = vehicleNumber || challanNumber || date || fromLocation || toLocation || loadType;

    if (!hasFilter) {
      return res.json([]);
    }

    const filter = {};

    if (vehicleNumber) filter.vehicleNumber = { $regex: vehicleNumber, $options: "i" };
    if (challanNumber) filter.challanNumber = { $regex: challanNumber, $options: "i" };
    if (fromLocation)  filter.fromLocation  = { $regex: fromLocation,  $options: "i" };
    if (toLocation)    filter.toLocation    = { $regex: toLocation,    $options: "i" };
    if (loadType)      filter.loadType      = { $regex: loadType,      $options: "i" };

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }

    const result = await Billing.find(filter).sort({ createdAt: -1 });
    res.json(result);

  }
  catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: error.message });
  }

};


// UPDATE BILLING
export const updateBilling = async (req, res) => {

  try {

    const updated = await Billing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Updated successfully", data: updated });

  }
  catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: error.message });
  }

};


// DELETE BILLING — admin only
export const deleteBilling = async (req, res) => {

  try {

    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    await Billing.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });

  }
  catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: error.message });
  }

};

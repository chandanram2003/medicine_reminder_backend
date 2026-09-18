// const express = require("express");
// const router = express.Router();

// const { addMedicine } = require("../controllers/medicineController");

// router.post("/add", addMedicine);

// module.exports = router;

const express = require("express");
const router = express.Router();

const {
  addMedicine,
  getMedicines,
  deleteMedicine,
  updateMedicine,
  getMedicineById,
  setReminder,
} = require("../controllers/medicineController");

const { authenticateJWT } = require("../middleware/auth.middleware");

router.post("/add", authenticateJWT, addMedicine);
router.get("/:userId", getMedicines);
router.get("/singleUser/:id", getMedicineById);
router.put("/update/:id", authenticateJWT, updateMedicine);
router.delete("/:id", deleteMedicine);
router.put("/set-reminder", setReminder);


module.exports = router;

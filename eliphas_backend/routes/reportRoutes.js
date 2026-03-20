import express from "express";

import {
  dailyReport, weeklyReport, monthlyReport, yearlyReport, customReport,
  exportDailyExcel, exportWeeklyExcel, exportMonthlyExcel, exportYearlyExcel, exportCustomExcel,
  exportDailyPdf,   exportWeeklyPdf,   exportMonthlyPdf,   exportYearlyPdf,   exportCustomPdf,
  exportDailyCsv,   exportWeeklyCsv,   exportMonthlyCsv,   exportYearlyCsv,   exportCustomCsv
} from "../controllers/reportController.js";

const router = express.Router();

// ── View ──
router.get("/daily",   dailyReport);
router.get("/weekly",  weeklyReport);
router.get("/monthly", monthlyReport);
router.get("/yearly",  yearlyReport);
router.get("/custom",  customReport);

// ── Excel ──
router.get("/daily-excel",   exportDailyExcel);
router.get("/weekly-excel",  exportWeeklyExcel);
router.get("/monthly-excel", exportMonthlyExcel);
router.get("/yearly-excel",  exportYearlyExcel);
router.get("/custom-excel",  exportCustomExcel);

// ── PDF ──
router.get("/daily-pdf",   exportDailyPdf);
router.get("/weekly-pdf",  exportWeeklyPdf);
router.get("/monthly-pdf", exportMonthlyPdf);
router.get("/yearly-pdf",  exportYearlyPdf);
router.get("/custom-pdf",  exportCustomPdf);

// ── CSV ──
router.get("/daily-csv",   exportDailyCsv);
router.get("/weekly-csv",  exportWeeklyCsv);
router.get("/monthly-csv", exportMonthlyCsv);
router.get("/yearly-csv",  exportYearlyCsv);
router.get("/custom-csv",  exportCustomCsv);

export default router;

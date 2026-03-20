import Billing from "../models/Billing.js";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";


// =====================================================
// HELPERS
// =====================================================

const calculateTotals = (data) => {
  let totalCompanyFare = 0;
  let totalClientFare  = 0;
  data.forEach(item => {
    totalCompanyFare += Number(item.companyFare || 0);
    totalClientFare  += Number(item.clientFare  || 0);
  });
  return { totalCompanyFare, totalClientFare };
};

const getDateRange = (type, from, to) => {
  const now = new Date();

  if (type === "daily") {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end   = new Date(); end.setHours(23, 59, 59, 999);
    return { start, end };
  }
  if (type === "weekly") {
    const start = new Date();
    start.setDate(start.getDate() - 7);
    start.setHours(0, 0, 0, 0);
    return { start, end: now };
  }
  if (type === "monthly") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end   = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return { start, end };
  }
  if (type === "yearly") {
    const start = new Date(now.getFullYear(), 0, 1);
    const end   = new Date(now.getFullYear() + 1, 0, 1);
    return { start, end };
  }
  if (type === "custom" && from && to) {
    const start = new Date(from); start.setHours(0, 0, 0, 0);
    const end   = new Date(to);   end.setHours(23, 59, 59, 999);
    return { start, end };
  }
  return null;
};

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "";

const fmt = (n) => `Rs.${Number(n || 0).toLocaleString("en-IN")}`;


// =====================================================
// GENERATE EXCEL
// =====================================================

const generateExcel = async (res, data, fileName) => {
  try {
    const workbook  = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Billing Report");

    worksheet.columns = [
      { header: "Client Name",    key: "clientName",    width: 20 },
      { header: "Company Name",   key: "companyName",   width: 20 },
      { header: "Phone Number",   key: "phoneNumber",   width: 15 },
      { header: "Vehicle Number", key: "vehicleNumber", width: 15 },
      { header: "Challan Number", key: "challanNumber", width: 15 },
      { header: "From Location",  key: "fromLocation",  width: 15 },
      { header: "To Location",    key: "toLocation",    width: 15 },
      { header: "Load Type",      key: "loadType",      width: 15 },
      { header: "Weight (tons)",  key: "weight",        width: 12 },
      { header: "Billing Type",   key: "billingType",   width: 15 },
      { header: "Billing Basis",  key: "billingBasis",  width: 15 },
      { header: "Company Fare",   key: "companyFare",   width: 15 },
      { header: "Client Fare",    key: "clientFare",    width: 15 },
      { header: "Diesel Qty",     key: "dieselQuantity",width: 12 },
      { header: "Diesel Price",   key: "dieselPrice",   width: 12 },
      { header: "Created By",     key: "createdBy",     width: 15 },
      { header: "Date",           key: "date",          width: 20 },
    ];

    let grandCompanyFare = 0;
    let grandClientFare  = 0;

    data.forEach(item => {
      worksheet.addRow({
        clientName:    item.clientName    || "",
        companyName:   item.companyName   || "",
        phoneNumber:   item.phoneNumber   || "",
        vehicleNumber: item.vehicleNumber || "",
        challanNumber: item.challanNumber || "",
        fromLocation:  item.fromLocation  || "",
        toLocation:    item.toLocation    || "",
        loadType:      item.loadType      || "",
        weight:        item.weight        || "",
        billingType:   item.billingType   || "",
        billingBasis:  item.billingBasis  || "",
        companyFare:   Number(item.companyFare || 0),
        clientFare:    Number(item.clientFare  || 0),
        dieselQuantity:item.dieselQuantity|| "",
        dieselPrice:   item.dieselPrice   || "",
        createdBy:     item.createdBy     || "",
        date:          formatDate(item.date || item.createdAt),
      });
      grandCompanyFare += Number(item.companyFare || 0);
      grandClientFare  += Number(item.clientFare  || 0);
    });

    worksheet.addRow([]);
    const totalRow = worksheet.addRow([
      "GRAND TOTAL", "", "", "", "", "", "", "", "", "", "",
      grandCompanyFare, grandClientFare
    ]);
    totalRow.font = { bold: true, size: 14 };

    const buffer = await workbook.xlsx.writeBuffer();
    res.set({
      "Content-Type":        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Length":      buffer.length
    });
    return res.end(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Excel generation failed" });
  }
};


// =====================================================
// GENERATE PDF
// =====================================================

const generatePdf = (res, data, title, fileName) => {
  try {
    const doc = new PDFDocument({ margin: 30, size: "A4", layout: "landscape" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    doc.pipe(res);

    // ── Header ──
    doc.fontSize(16).font("Helvetica-Bold").text("ELIPHAS Billing", { align: "center" });
    doc.fontSize(11).font("Helvetica").text(title, { align: "center" });
    doc.fontSize(9).text(`Generated: ${new Date().toLocaleString("en-IN")}`, { align: "center" });
    doc.moveDown(0.8);

    // ── Table setup ──
    const cols = [
      { label: "Client",   key: "clientName",    w: 90 },
      { label: "Company",  key: "companyName",   w: 90 },
      { label: "Vehicle",  key: "vehicleNumber", w: 70 },
      { label: "Challan",  key: "challanNumber", w: 70 },
      { label: "From",     key: "fromLocation",  w: 70 },
      { label: "To",       key: "toLocation",    w: 70 },
      { label: "Co.Fare",  key: "companyFare",   w: 65, align: "right" },
      { label: "Cl.Fare",  key: "clientFare",    w: 65, align: "right" },
      { label: "Date",     key: "date",          w: 65 },
    ];

    const startX    = 30;
    const rowHeight = 20;
    let   y         = doc.y;

    // ── Draw header row ──
    doc.rect(startX, y, cols.reduce((s, c) => s + c.w, 0), rowHeight).fill("#1a1a2e");
    let x = startX;
    cols.forEach(col => {
      doc.fillColor("#ffffff").fontSize(8).font("Helvetica-Bold")
        .text(col.label, x + 4, y + 5, { width: col.w - 8, align: col.align || "left" });
      x += col.w;
    });
    y += rowHeight;

    // ── Draw data rows ──
    let grandCompanyFare = 0;
    let grandClientFare  = 0;

    data.forEach((item, i) => {
      if (y > 530) { doc.addPage(); y = 30; }

      const bg = i % 2 === 0 ? "#ffffff" : "#f5f5f5";
      doc.rect(startX, y, cols.reduce((s, c) => s + c.w, 0), rowHeight).fill(bg);

      x = startX;
      cols.forEach(col => {
        let val = item[col.key] || "";
        if (col.key === "companyFare" || col.key === "clientFare") {
          val = fmt(item[col.key]);
        }
        if (col.key === "date") val = formatDate(item.date || item.createdAt);

        doc.fillColor("#333333").fontSize(7.5).font("Helvetica")
          .text(String(val), x + 4, y + 6, { width: col.w - 8, align: col.align || "left", ellipsis: true });
        x += col.w;
      });

      grandCompanyFare += Number(item.companyFare || 0);
      grandClientFare  += Number(item.clientFare  || 0);
      y += rowHeight;
    });

    // ── Grand total row ──
    if (y > 530) { doc.addPage(); y = 30; }
    const totalW = cols.reduce((s, c) => s + c.w, 0);
    doc.rect(startX, y, totalW, rowHeight).fill("#1a1a2e");
    doc.fillColor("#ffffff").fontSize(8).font("Helvetica-Bold")
      .text(`GRAND TOTAL  (${data.length} records)`, startX + 4, y + 5, { width: cols.slice(0, 6).reduce((s, c) => s + c.w, 0) - 8 });

    const coFareX = startX + cols.slice(0, 6).reduce((s, c) => s + c.w, 0);
    doc.text(fmt(grandCompanyFare), coFareX + 4, y + 5, { width: cols[6].w - 8, align: "right" });
    doc.text(fmt(grandClientFare),  coFareX + cols[6].w + 4, y + 5, { width: cols[7].w - 8, align: "right" });

    doc.end();
  } catch (error) {
    console.error("PDF generation error:", error);
    if (!res.headersSent) res.status(500).json({ message: "PDF generation failed" });
  }
};


// =====================================================
// GENERATE CSV
// =====================================================

const generateCsv = (res, data, fileName) => {
  try {
    const headers = [
      "Client Name", "Company Name", "Phone Number", "Vehicle Number",
      "Challan Number", "From Location", "To Location", "Load Type",
      "Weight", "Billing Type", "Billing Basis", "Company Fare",
      "Client Fare", "Diesel Qty", "Diesel Price", "Created By", "Date"
    ];

    const escape = (val) => {
      const str = String(val ?? "").replace(/"/g, '""');
      return str.includes(",") || str.includes('"') || str.includes("\n") ? `"${str}"` : str;
    };

    const rows = data.map(item => [
      item.clientName, item.companyName, item.phoneNumber,
      item.vehicleNumber, item.challanNumber, item.fromLocation,
      item.toLocation, item.loadType, item.weight,
      item.billingType, item.billingBasis,
      Number(item.companyFare || 0), Number(item.clientFare || 0),
      item.dieselQuantity, item.dieselPrice, item.createdBy,
      formatDate(item.date || item.createdAt)
    ].map(escape).join(","));

    const grandCompanyFare = data.reduce((s, i) => s + Number(i.companyFare || 0), 0);
    const grandClientFare  = data.reduce((s, i) => s + Number(i.clientFare  || 0), 0);

    rows.push(`GRAND TOTAL,,,,,,,,,,,${grandCompanyFare},${grandClientFare},,,`);

    const csv = [headers.join(","), ...rows].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.send(csv);
  } catch (error) {
    console.error("CSV generation error:", error);
    res.status(500).json({ message: "CSV generation failed" });
  }
};


// =====================================================
// GENERIC REPORT HANDLER
// =====================================================

const handleReport = async (res, type, from, to) => {
  const range = getDateRange(type, from, to);
  if (!range) return res.status(400).json({ message: "Invalid date range" });

  const data   = await Billing.find({ createdAt: { $gte: range.start, $lte: range.end } }).sort({ createdAt: -1 });
  const totals = calculateTotals(data);
  res.json({ success: true, ...totals, count: data.length, data });
};

const getReportData = async (type, from, to) => {
  const range = getDateRange(type, from, to);
  if (!range) return null;
  return Billing.find({ createdAt: { $gte: range.start, $lte: range.end } }).sort({ createdAt: -1 });
};

const reportTitle = (type, from, to) => {
  if (type === "custom") return `Custom Report: ${from} to ${to}`;
  return `${type.charAt(0).toUpperCase() + type.slice(1)} Billing Report`;
};


// =====================================================
// REPORT VIEW ENDPOINTS
// =====================================================

export const dailyReport   = (req, res) => handleReport(res, "daily").catch(e => res.status(500).json({ message: e.message }));
export const weeklyReport  = (req, res) => handleReport(res, "weekly").catch(e => res.status(500).json({ message: e.message }));
export const monthlyReport = (req, res) => handleReport(res, "monthly").catch(e => res.status(500).json({ message: e.message }));
export const yearlyReport  = (req, res) => handleReport(res, "yearly").catch(e => res.status(500).json({ message: e.message }));

export const customReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) return res.status(400).json({ message: "from and to date required" });
    await handleReport(res, "custom", from, to);
  } catch (error) { res.status(500).json({ message: error.message }); }
};


// =====================================================
// EXCEL EXPORT ENDPOINTS
// =====================================================

export const exportDailyExcel   = async (req, res) => { const d = await getReportData("daily");   await generateExcel(res, d, "billing_daily.xlsx"); };
export const exportWeeklyExcel  = async (req, res) => { const d = await getReportData("weekly");  await generateExcel(res, d, "billing_weekly.xlsx"); };
export const exportMonthlyExcel = async (req, res) => { const d = await getReportData("monthly"); await generateExcel(res, d, "billing_monthly.xlsx"); };
export const exportYearlyExcel  = async (req, res) => { const d = await getReportData("yearly");  await generateExcel(res, d, "billing_yearly.xlsx"); };

export const exportCustomExcel = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) return res.status(400).json({ message: "from and to required" });
    const d = await getReportData("custom", from, to);
    await generateExcel(res, d, `billing_custom_${from}_to_${to}.xlsx`);
  } catch (error) { res.status(500).json({ message: error.message }); }
};


// =====================================================
// PDF EXPORT ENDPOINTS
// =====================================================

export const exportDailyPdf   = async (req, res) => { const d = await getReportData("daily");   generatePdf(res, d, reportTitle("daily"),   "billing_daily.pdf"); };
export const exportWeeklyPdf  = async (req, res) => { const d = await getReportData("weekly");  generatePdf(res, d, reportTitle("weekly"),  "billing_weekly.pdf"); };
export const exportMonthlyPdf = async (req, res) => { const d = await getReportData("monthly"); generatePdf(res, d, reportTitle("monthly"), "billing_monthly.pdf"); };
export const exportYearlyPdf  = async (req, res) => { const d = await getReportData("yearly");  generatePdf(res, d, reportTitle("yearly"),  "billing_yearly.pdf"); };

export const exportCustomPdf = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) return res.status(400).json({ message: "from and to required" });
    const d = await getReportData("custom", from, to);
    generatePdf(res, d, reportTitle("custom", from, to), `billing_custom_${from}_to_${to}.pdf`);
  } catch (error) { res.status(500).json({ message: error.message }); }
};


// =====================================================
// CSV EXPORT ENDPOINTS
// =====================================================

export const exportDailyCsv   = async (req, res) => { const d = await getReportData("daily");   generateCsv(res, d, "billing_daily.csv"); };
export const exportWeeklyCsv  = async (req, res) => { const d = await getReportData("weekly");  generateCsv(res, d, "billing_weekly.csv"); };
export const exportMonthlyCsv = async (req, res) => { const d = await getReportData("monthly"); generateCsv(res, d, "billing_monthly.csv"); };
export const exportYearlyCsv  = async (req, res) => { const d = await getReportData("yearly");  generateCsv(res, d, "billing_yearly.csv"); };

export const exportCustomCsv = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) return res.status(400).json({ message: "from and to required" });
    const d = await getReportData("custom", from, to);
    generateCsv(res, d, `billing_custom_${from}_to_${to}.csv`);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

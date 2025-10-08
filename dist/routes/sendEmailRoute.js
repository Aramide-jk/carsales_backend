"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sendEmail_1 = require("../utils/sendEmail");
const router = (0, express_1.Router)();
// POST /api/email/test
router.post("/test", async (req, res) => {
    try {
        const { to, subject, text } = req.body;
        const result = await (0, sendEmail_1.sendEmail)(to, subject, text);
        res.status(200).json({ success: true, result });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to send email" });
    }
});
exports.default = router;

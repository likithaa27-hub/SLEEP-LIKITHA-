const express = require('express');
const router = express.Router();
const axios = require('axios');

const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY;
const Otp = require('../models/Otp');

// Clean Modular Functions
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOTP = async (phone, otp) => {
  const response = await axios.post(
    "https://www.fast2sms.com/dev/bulkV2",
    {
      route: "q",
      message: `Your verification code is ${otp}`,
      language: "english",
      numbers: phone,
    },
    {
      headers: {
        authorization: FAST2SMS_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.data?.return === true) {
    return true;
  }

  throw new Error(response.data?.message || "Failed to send OTP");
};
const verifyOTP = async (phone, input) => {
  const record = await Otp.findOne({ phone });
  if (!record) return { success: false, message: 'No OTP requested for this number' };

  if (record.otp === input) {
    await Otp.deleteOne({ phone });
    return { success: true, message: 'OTP verified successfully' };
  }

  return { success: false, message: 'Invalid OTP' };
};

// Express Routes
router.post('/send', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: 'Phone is required' });

    const otp = generateOTP();
    await sendOTP(phone, otp);
    await Otp.findOneAndUpdate({ phone }, { otp, createdAt: Date.now() }, { upsert: true });

    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('OTP Send Error:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Server error while sending OTP' });
  }
});

router.post('/resend', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: 'Phone is required' });

    // Ensure we are not spamming (optional: add rate limiting here)
    const otp = generateOTP();
    await sendOTP(phone, otp);
    await Otp.findOneAndUpdate({ phone }, { otp, createdAt: Date.now() }, { upsert: true });

    res.json({ success: true, message: 'OTP resent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error while resending OTP' });
  }
});

router.post('/verify', async (req, res) => {
  const { phone, otp: input } = req.body;
  if (!phone || !input) return res.status(400).json({ success: false, message: 'Phone and OTP required' });

  const result = await verifyOTP(phone, input);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

module.exports = router;

const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { buildSystemPrompt, buildConsolidationPrompt } = require("../prompts/system-prompt");

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const ROOMS = ["bathroom", "entrance", "kitchen", "bedroom", "hallways"];

router.post("/evaluate", async (req, res) => {
  const { condition, photos, evaluationId } = req.body;

  if (!condition || !photos || photos.length < 5) {
    return res.status(400).json({ error: "condition and at least 5 photos required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const roomFindings = [];

    for (const photo of photos) {
      const { room, base64, mimeType } = photo;
      if (!ROOMS.includes(room)) continue;

      const systemPrompt = buildSystemPrompt(condition, room);

      const result = await model.generateContent([
        { text: systemPrompt },
        { inlineData: { mimeType: mimeType || "image/jpeg", data: base64 } },
        { text: "Analyze this photo and return the JSON report." },
      ]);

      const raw = result.response.text();
      let parsed;

      try {
        const clean = raw.replace(/```json|```/g, "").trim();
        parsed = JSON.parse(clean);
      } catch {
        parsed = {
          room, condition, findings: [],
          room_safety_score: 5,
          summary: "Unable to parse analysis. Please retry.",
          parse_error: true,
        };
      }

      roomFindings.push(parsed);
    }

    const consolidationPrompt = buildConsolidationPrompt(condition, roomFindings);
    const consolidationResult = await model.generateContent([{ text: consolidationPrompt }]);
    const consolidationRaw = consolidationResult.response.text();
    let finalReport;

    try {
      const clean = consolidationRaw.replace(/```json|```/g, "").trim();
      finalReport = JSON.parse(clean);
    } catch {
      finalReport = {
        condition,
        overall_score: 5,
        executive_summary: "Report consolidation failed. Room-level findings are available below.",
        immediate_actions: [],
        total_estimated_cost: { min: 0, max: 0 },
        findings_by_priority: { HIGH: [], MEDIUM: [], LOW: [] },
      };
    }

    finalReport.room_details = roomFindings;
    finalReport.evaluationId = evaluationId;
    finalReport.generated_at = new Date().toISOString();

    return res.json({ success: true, report: finalReport });

  } catch (err) {
    console.error("Evaluation error:", err);
    return res.status(500).json({ error: "Evaluation failed", details: err.message });
  }
});

router.post("/followup", async (req, res) => {
  const { condition, photos, originalReport } = req.body;

  if (!condition || !photos || !originalReport) {
    return res.status(400).json({ error: "condition, photos, and originalReport required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const followupFindings = [];

    for (const photo of photos) {
      const { room, base64, mimeType } = photo;
      const systemPrompt = buildSystemPrompt(condition, room);

      const result = await model.generateContent([
        { text: systemPrompt },
        { inlineData: { mimeType: mimeType || "image/jpeg", data: base64 } },
        { text: "Analyze this follow-up photo and note improvements since the original assessment." },
      ]);

      const raw = result.response.text();
      try {
        const clean = raw.replace(/```json|```/g, "").trim();
        followupFindings.push(JSON.parse(clean));
      } catch {
        followupFindings.push({ room, condition, findings: [], room_safety_score: 5 });
      }
    }

    const originalHighCount = (originalReport.findings_by_priority?.HIGH || []).length;
    const followupHighCount = followupFindings.reduce((acc, r) =>
      acc + r.findings.filter(f => f.priority === "HIGH").length, 0
    );

    return res.json({
      success: true,
      followup: {
        condition,
        room_details: followupFindings,
        progress: {
          original_high_risks: originalHighCount,
          remaining_high_risks: followupHighCount,
          resolved: Math.max(0, originalHighCount - followupHighCount),
        },
        generated_at: new Date().toISOString(),
      },
    });

  } catch (err) {
    console.error("Follow-up error:", err);
    return res.status(500).json({ error: "Follow-up failed", details: err.message });
  }
});

module.exports = router;

import express from "express";
import { User } from "../models/user.model.js";
import { verifyWebhook } from "@clerk/backend/webhooks";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const signingSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

    if (!signingSecret) {
      res.status(503).json({ message: "Webhook secret is not provided." });
      return;
    }

    //clerk's verifier expects a web request with the raw body; express.raw gives a buffer.
    const payload = Buffer.isBuffer(req.body)
      ? req.body.toString("utf8")
      : String(req.body);

    const request = new Request("http://internal/webhooks/clerk", {
      method: "POST",
      headers: new Headers(req.headers),
      body: payload,
    });

    //throws if the signature is wrong or the body was tampered with; only then do we trust event.
    const event = await verifyWebhook(request, { signingSecret });

    if (event.type === "user.created" || event.type === "user.updated") {
      const user = event.data;
      const email =
        user.email_addresses?.find(
          (e) => e.id === user.primary_email_address_id,
        )?.email_address ?? user.email_addresses?.[0]?.email_address;

      const fullName =
        [user.first_name, user.last_name].filter(Boolean).join(" ") ||
        user.username ||
        email?.split("@")[0];

      await User.findOneAndUpdate(
        { clerkId: user.id },
        { clerkId: user.id, email, fullName, profilePic: user.image_url },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      );
    }

    if (event.type === "user.deleted") {
      if (event.data.id)
        await User.findOneAndDelete({ clerkId: event.data.id });
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Error in Clerk webhook: ", error);
    res.status(400).json({ message: "Webhook verification failed" });
  }
});

export default router;

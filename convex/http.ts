import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { getUserByTokenIdentifier } from "./users"; // Temporary import
import type { WebhookEvent } from "@clerk/nextjs/server";
import type { FunctionReference } from "convex/server";

// Cast through unknown to satisfy TypeScript
const getUserByTokenIdentifierQuery = getUserByTokenIdentifier as unknown as FunctionReference<
  "query",
  "public",
  { tokenIdentifier: string },
  Promise<{
    _id: string;
    _creationTime: number;
    image?: string;
    name: string;
    email: string;
    isAdmin: boolean;
    role: "client" | "user" | "programmer";
    tokenIdentifier: string;
    isOnline: boolean;
  } | null>
>;

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const payloadString = await req.text();
    const headers = req.headers;

    try {
      const result = await ctx.runAction(internal.clerk.fulfill, {
        payload: payloadString,
        headers: {
          "svix-id": headers.get("svix-id")!,
          "svix-signature": headers.get("svix-signature")!,
          "svix-timestamp": headers.get("svix-timestamp")!,
        },
      });

      console.log("📩 Clerk Webhook Result:", result);

      if (!result || typeof result !== "object" || typeof result.type !== "string") {
        console.error("❌ Invalid webhook structure", result);
        return new Response("Invalid webhook payload", { status: 400 });
      }

      const { type, data } = result as WebhookEvent;

      switch (type) {
        case "user.created": {
          const tokenIdentifier = `${process.env.CLERK_APP_DOMAIN}|${data.id}`.replace(/^https?:\/\//, "");
          const existing = await ctx.runQuery(getUserByTokenIdentifierQuery, {
            tokenIdentifier,
          });

          if (existing) {
            console.log("🟡 User already exists, skipping user.created:", tokenIdentifier);
            break;
          }

          await ctx.runMutation(internal.users.createUser, {
            tokenIdentifier,
            email: data.email_addresses?.[0]?.email_address ?? "",
            name: `${data.first_name ?? "Guest"} ${data.last_name ?? ""}`.trim(),
            image: data.image_url,
          });
          break;
        }

        case "user.updated": {
          const tokenIdentifier = `${process.env.CLERK_APP_DOMAIN}|${data.id}`.replace(/^https?:\/\//, "");
          await ctx.runMutation(internal.users.updateUser, {
            tokenIdentifier,
            image: data.image_url,
          });
          break;
        }

        case "session.created": {
          const sessionData = data as WebhookEvent["data"] & { user_id: string };
          const tokenIdentifier = `${process.env.CLERK_APP_DOMAIN}|${sessionData.user_id}`.replace(/^https?:\/\//, "");

          const userExists = await ctx.runQuery(getUserByTokenIdentifierQuery, {
            tokenIdentifier,
          });

          if (!userExists) {
            console.warn("❌ User not found for session.created:", { tokenIdentifier, sessionData });
            return new Response("User not found", { status: 400 });
          }

          await ctx.runMutation(internal.users.setUserOnline, {
            tokenIdentifier,
          });
          break;
        }

        case "session.removed": {
          const sessionData = data as WebhookEvent["data"] & { user_id: string };
          const tokenIdentifier = `${process.env.CLERK_APP_DOMAIN}|${sessionData.user_id}`.replace(/^https?:\/\//, "");
          console.log("👋 Session ended for:", tokenIdentifier);
          await ctx.runMutation(internal.users.setUserOffline, {
            tokenIdentifier,
          });
          break;
        }

        default:
          console.warn("⚠️ Unhandled webhook event type:", type);
      }

      return new Response(null, { status: 200 });
    } catch (error) {
      console.error("🔥 Webhook Error:", error);
      return new Response("Webhook Error", { status: 400 });
    }
  }),
});

export default http;
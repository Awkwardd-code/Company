/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as blogs from "../blogs.js";
import type * as clerk from "../clerk.js";
import type * as conversations from "../conversations.js";
import type * as designations from "../designations.js";
import type * as http from "../http.js";
import type * as interviews from "../interviews.js";
import type * as messages from "../messages.js";
import type * as professionals from "../professionals.js";
import type * as projects from "../projects.js";
import type * as supportMessages from "../supportMessages.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  blogs: typeof blogs;
  clerk: typeof clerk;
  conversations: typeof conversations;
  designations: typeof designations;
  http: typeof http;
  interviews: typeof interviews;
  messages: typeof messages;
  professionals: typeof professionals;
  projects: typeof projects;
  supportMessages: typeof supportMessages;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

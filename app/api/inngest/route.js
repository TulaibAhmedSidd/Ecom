import { serve } from "inngest/next";
import { createUserOrder, inngest, syncDeletion, syncUpdation, syncUserCreation } from "@/config/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUpdation,
    syncDeletion,
    createUserOrder
  ],
});
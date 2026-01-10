import { useMutation } from "@tanstack/react-query";
import { api, type InsertAnalysis, type AnalyzeResponse } from "@shared/routes";

export function useAnalyzeContract() {
  return useMutation({
    mutationFn: async (data: InsertAnalysis) => {
      // Validate input using Zod schema from shared routes (optional but good practice)
      const validatedInput = api.analyze.process.input.parse(data);

      const res = await fetch(api.analyze.process.path, {
        method: api.analyze.process.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedInput),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to analyze contract");
      }

      // Parse response using Zod schema
      return api.analyze.process.responses[200].parse(await res.json());
    },
  });
}

import { z } from 'zod';
import { insertAnalysisSchema } from './schema';

export const api = {
  analyze: {
    process: {
      method: 'POST' as const,
      path: '/api/analyze',
      input: insertAnalysisSchema,
      responses: {
        200: z.object({
          originalClause: z.string(),
          plainEnglish: z.string(),
          audioUrl: z.string().optional(),
        }),
        500: z.object({
          message: z.string(),
        })
      },
    },
  },
};

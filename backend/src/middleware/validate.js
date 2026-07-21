const { z } = require('zod');

// Recursive list item: { text, children?: ListItem[] }
const listItemSchema = z.lazy(() =>
  z.object({
    text: z.string().min(1),
    children: z.array(listItemSchema).optional().default([]),
  })
);

const blockDataByType = {
  header: z.object({
    text: z.string().min(1),
    level: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional().default(2),
  }),
  paragraph: z.object({
    text: z.string().min(1),
  }),
  list: z.object({
    ordered: z.boolean().optional().default(false),
    items: z.array(listItemSchema).min(1),
  }),
  table: z.object({
    headers: z.array(z.string()).min(1),
    rows: z.array(z.array(z.string())).min(1),
  }),
  equation: z.object({
    equation: z.string().min(1),
    displayMode: z.boolean().optional().default(true),
  }),
};

const blockSchema = z
  .object({
    type: z.enum(['header', 'paragraph', 'list', 'table', 'equation']),
    data: z.record(z.any()),
    order: z.number().optional().default(0),
    _id: z.string().optional(),
  })
  .superRefine((block, ctx) => {
    const schema = blockDataByType[block.type];
    const result = schema.safeParse(block.data);
    if (!result.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Invalid data for block type "${block.type}": ${result.error.issues
          .map((i) => i.message)
          .join(', ')}`,
      });
    }
  });

const pageSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  status: z.enum(['draft', 'published']).optional().default('draft'),
  icon: z.string().optional().default(''),
  excerpt: z.string().optional().default(''),
  category: z.string().optional().default('general'),
  blocks: z.array(blockSchema).optional().default([]),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: result.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    });
  }
  req.body = result.data;
  next();
};

module.exports = { validateBody, pageSchema, loginSchema };

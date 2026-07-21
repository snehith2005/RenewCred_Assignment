const mongoose = require('mongoose');

/**
 * Block-based content model.
 *
 * Rather than one rigid schema per content type, a Page is an ordered array
 * of "blocks". Each block has a `type` that determines how `data` is shaped
 * and how the public frontend renders it. This keeps the schema flexible
 * enough to support long-form text, (nested) lists, tables, and math
 * equations without needing a schema migration every time a new content
 * shape shows up on the site.
 *
 * Supported types and their `data` shape (enforced at the API layer with
 * zod, not at the Mongo layer, since Mixed fields can't be validated by
 * Mongoose alone):
 *
 *  - header:    { text: string, level?: 1|2|3 }
 *  - paragraph: { text: string }
 *  - list:      { ordered: boolean, items: ListItem[] }
 *               ListItem = { text: string, children?: ListItem[] }  (recursive -> nested lists)
 *  - table:     { headers: string[], rows: string[][] }
 *  - equation:  { equation: string (LaTeX), displayMode: boolean }
 */
const BlockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['header', 'paragraph', 'list', 'table', 'equation'],
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { _id: true }
);

const PageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A page title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'],
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    // Optional presentation metadata used when a page is shown as a card in
    // a listing/hub page (e.g. the "Standards" index). Not required for
    // pages that are only ever linked to directly.
    icon: {
      type: String,
      trim: true,
      default: '',
    },
    excerpt: {
      type: String,
      trim: true,
      default: '',
    },
    // Free-form grouping key so the public frontend can query "all pages in
    // this category" (e.g. category=standards) to build hub/index pages
    // without hardcoding which slugs belong together.
    category: {
      type: String,
      trim: true,
      lowercase: true,
      default: 'general',
    },
    blocks: {
      type: [BlockSchema],
      default: [],
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Page', PageSchema);

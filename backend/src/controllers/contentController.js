const Page = require('../models/Page');

// GET /api/v1/content/pages  (admin: all pages, any status)
const listPages = async (req, res, next) => {
  try {
    const pages = await Page.find().sort({ updatedAt: -1 });
    res.json({ success: true, pages });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/content/pages/:slug (admin: fetch one page regardless of status)
const getPageBySlugAdmin = async (req, res, next) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ success: false, message: 'Page not found' });
    res.json({ success: true, page });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/content/pages (admin: create)
const createPage = async (req, res, next) => {
  try {
    const page = await Page.create({ ...req.body, updatedBy: req.admin.id });
    res.status(201).json({ success: true, page });
  } catch (err) {
    next(err);
  }
};

// PUT /api/v1/content/pages/:id (admin: update)
const updatePage = async (req, res, next) => {
  try {
    const page = await Page.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.admin.id },
      { new: true, runValidators: true }
    );
    if (!page) return res.status(404).json({ success: false, message: 'Page not found' });
    res.json({ success: true, page });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/v1/content/pages/:id (admin: delete)
const deletePage = async (req, res, next) => {
  try {
    const page = await Page.findByIdAndDelete(req.params.id);
    if (!page) return res.status(404).json({ success: false, message: 'Page not found' });
    res.json({ success: true, message: 'Page deleted' });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/public/pages/:slug (public: only published pages)
const getPublishedPageBySlug = async (req, res, next) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug, status: 'published' });
    if (!page) return res.status(404).json({ success: false, message: 'Page not found' });
    res.json({ success: true, page });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/public/pages (public: list published pages, lightweight)
// Optional ?category=standards filter so the frontend can build hub/index
// pages (e.g. "all Standards") without hardcoding slugs.
const listPublishedPages = async (req, res, next) => {
  try {
    const filter = { status: 'published' };
    if (req.query.category) filter.category = req.query.category;
    const pages = await Page.find(filter).select('title slug icon excerpt category updatedAt');
    res.json({ success: true, pages });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listPages,
  getPageBySlugAdmin,
  createPage,
  updatePage,
  deletePage,
  getPublishedPageBySlug,
  listPublishedPages,
};

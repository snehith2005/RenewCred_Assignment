const express = require('express');
const {
  listPages,
  getPageBySlugAdmin,
  createPage,
  updatePage,
  deletePage,
  getPublishedPageBySlug,
  listPublishedPages,
} = require('../controllers/contentController');
const protectRoute = require('../middleware/authMiddleware');
const { validateBody, pageSchema } = require('../middleware/validate');

const adminRouter = express.Router();
adminRouter.use(protectRoute);
adminRouter.get('/pages', listPages);
adminRouter.get('/pages/:slug', getPageBySlugAdmin);
adminRouter.post('/pages', validateBody(pageSchema), createPage);
adminRouter.put('/pages/:id', validateBody(pageSchema), updatePage);
adminRouter.delete('/pages/:id', deletePage);

const publicRouter = express.Router();
publicRouter.get('/pages', listPublishedPages);
publicRouter.get('/pages/:slug', getPublishedPageBySlug);

module.exports = { adminRouter, publicRouter };

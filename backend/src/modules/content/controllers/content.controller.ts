import { BlogPostModel, ContactFormModel, FAQModel } from "@/models/Content.model";
import { asyncHandler } from "@/utils/asyncHandler";

export const ContentController = {
  contact: asyncHandler(async (req, res) => {
    res.status(201).json({ success: true, data: await ContactFormModel.create(req.body) });
  }),
  newsletter: asyncHandler(async (req, res) => {
    res.status(201).json({ success: true, data: { email: req.body.email, subscribed: true } });
  }),
  blogList: asyncHandler(async (_req, res) => {
    res.json({ success: true, data: await BlogPostModel.find({ status: "published" }).sort({ publishedAt: -1 }).limit(20) });
  }),
  blogDetail: asyncHandler(async (req, res) => {
    res.json({ success: true, data: await BlogPostModel.findOne({ slug: req.params.slug, status: "published" }) });
  }),
  faqs: asyncHandler(async (_req, res) => {
    res.json({ success: true, data: await FAQModel.find({ published: true }).sort({ order: 1 }) });
  })
};

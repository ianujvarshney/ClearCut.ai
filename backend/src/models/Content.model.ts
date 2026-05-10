import { Schema, model } from "mongoose";

const contactFormSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    company: String,
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "reviewed", "closed"], default: "new", index: true }
  },
  { timestamps: true }
);

const blogPostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: String,
    content: { type: String, required: true },
    author: String,
    tags: [String],
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    publishedAt: Date
  },
  { timestamps: true }
);

const faqSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: "general" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const ContactFormModel = model("ContactForm", contactFormSchema);
export const BlogPostModel = model("BlogPost", blogPostSchema);
export const FAQModel = model("FAQ", faqSchema);

import cmsData from "./cms.json";

export interface Post {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  status: "published" | "draft" | "archived";
  publishedAt: string;
  views: number;
  excerpt?: string;
  content: string;
  featuredImage?: string | null;
  metaTitle?: string;
  metaDescription?: string;
}


export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export type PageStatus = "published" | "draft" | "archived" | "private";
export type PageTemplate = "default" | "full_width" | "landing" | "contact" | "sidebar_left" | "sidebar_right";

export interface CmsPage {
  id: string;
  title: string;
  slug: string;
  status: PageStatus;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  views: number;
  excerpt?: string;
  content: string;
  featuredImage?: string | null;
  template: PageTemplate;
  parentId?: string | null;
  order: number;
  metaTitle?: string;
  metaDescription?: string;
}

export const initialPosts: Post[] = cmsData.posts as unknown as Post[];
export const initialCategories: Category[] = cmsData.categories as Category[];
export const initialTags: Tag[] = cmsData.tags as Tag[];
export const initialPages: CmsPage[] = (cmsData.pages || []) as unknown as CmsPage[];

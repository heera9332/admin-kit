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

export const initialPosts: Post[] = cmsData.posts as unknown as Post[];
export const initialCategories: Category[] = cmsData.categories as Category[];
export const initialTags: Tag[] = cmsData.tags as Tag[];

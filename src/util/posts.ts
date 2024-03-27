import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDir = path.join(process.cwd(), "./src/posts");
// Define the structure of a post
export interface Post {
  id: string;
  date: Date;
  [key: string]: any; // for any other properties
}

// Define the structure of the matter function's return value
interface MatterResult {
  data: Post;
}

export const getSortedPosts = (): Post[] => {
  const fileNames = fs.readdirSync(postsDir);
  const allPosts: Post[] = fileNames.map((fileName: string): Post => {
    const id = fileName.replace(/\.md$/, "");

    const fullPath = path.join(postsDir, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);
    return {
      id,
      ...matterResult.data,
    } as Post;
  });

  // sort posts by date
  return allPosts.sort((a: Post, b: Post): number => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
};

interface Param {
  params: {
    id: string;
  };
}

export const getAllPostIds = (): Param[] => {
  const fileNames = fs.readdirSync(postsDir);

  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
};

export const getPostData = async (id: string) => {
  const fullPath = path.join(postsDir, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // use remark to convert markdown into a HTML string
  // Create a new processor first, by calling it: use `processor()` instead of `processor`.

  const processor = remark().use(html);

  const processedContent = await processor.process(matterResult.content);
  const contentHtml = processedContent.toString();
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
};

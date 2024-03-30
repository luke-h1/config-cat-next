import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import * as configcat from "configcat-js-ssr";
import { GetServerSideProps } from "next";
import utilStyles from "@/styles/utils.module.css";
import Date from "@/components/Date";
import { Post, getSortedPosts } from "../util/posts";
import Layout, { siteTitle } from "@/components/Layout";
import clsx from "clsx";
import Link from "next/link";

interface User {
  cell: string;
  dob: { date: string; age: number };
  email: string;
  gender: string;
  id: { name: string; value: string };
  location: {
    city: string;
    coordinates: { latitude: string; longitude: string };
    country: string;
    postcode: string;
    state: string;
    street: { number: number; name: string };
    timezone: { offset: string; description: string };
  };
  login: { uuid: string; username: string; password: string; salt: string };
  name: { first: string; last: string; title: string };
  nat: string;
  phone: string;
  picture: { large: string; medium: string };
  registered: { date: string; age: number };
}
interface Props {
  enableBlogFeature: boolean;
  posts: Post[];
}

const fetchUser = async () => {
  let id =
    typeof window !== "undefined" ? sessionStorage.getItem("userId") : null;

  if (!id) {
    id = crypto.getRandomValues(new Uint32Array(1))[0].toString();

    if (typeof window !== "undefined") {
      sessionStorage.setItem("userId", id);
    }
  }
  return id;
};

export default function Home({ posts, enableBlogFeature }: Props) {
  return (
    <>
      {enableBlogFeature ? (
        <section className={clsx(utilStyles.headingMd, utilStyles.padding1px)}>
          <h2 className={utilStyles.headingLg}>Blog</h2>
          <ul className={utilStyles.list}>
            {posts &&
              posts.map((post) => (
                <li className={utilStyles.listItem} key={post.id}>
                  <Link href={`/posts/${post.id}`}>{post.title}</Link>
                  <br />
                  <small className={utilStyles.lightText}>
                    <Date dateString={post.date as unknown as string} />
                  </small>
                </li>
              ))}
          </ul>
        </section>
      ) : (
        <div className="card">
          <h2>Feature is off</h2>
        </div>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const client = configcat.getClient(process.env.NEXT_PUBLIC_CONFIGCAT_SDK_KEY);
  const cookies = ctx.req.headers.cookie;

  const user = await fetchUser();

  // default value of false if the API call fails
  const enableBlogFeature = await client.getValueAsync("blogFeature", false, {
    identifier: user,
    custom: {},
  });
  const posts = getSortedPosts();

  return {
    props: {
      enableBlogFeature,
      posts,
    },
  };
};

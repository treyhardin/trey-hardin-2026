import { defineQuery } from 'groq';

export const HOMEPAGE_QUERY = defineQuery(`*[_type == "homepage"][0]{
  ...,
  hero{..., image->},
  featuredWork[]->,
  aboutSection{...}
}`);

export const CASE_STUDIES_QUERY = defineQuery(`*[_type == "caseStudy" && defined(slug.current)] | order(order asc) {
  _id, _type, title, "slug": slug.current, summary, category,
  "coverImage": coverImage->, "clientName": client->name, year
}`);

export const CASE_STUDY_QUERY = defineQuery(`*[_type == "caseStudy" && slug.current == $slug][0]{
  ..., coverImage->, "clientName": client->name, year, role, challenge, solution, outcome, team, timeline
}`);

export const BLOG_POSTS_QUERY = defineQuery(`*[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc) {
  _id, _type, title, "slug": slug.current, publishedAt, excerpt, category
}`);

export const BLOG_POST_QUERY = defineQuery(`*[_type == "blogPost" && slug.current == $slug][0]{
  ..., body[]{..., _type == "image" => {..., asset->{ _id, url, metadata { lqip, dimensions } }, alt}}
}`);

export const CLIENTS_QUERY = defineQuery(`*[_type == "client"] | order(name asc) {
  _id, _type, name, logo->, website, industry
}`);

export const HEADER_QUERY = defineQuery(`*[_type == "header"][0]{
  links[]{"label": text, "href": url, openInNewTab}
}`);

export const ABOUT_QUERY = defineQuery(`*[_type == "homepage"][0].aboutSection`);

import { defineQuery } from 'groq';

export const HOMEPAGE_QUERY = defineQuery(`*[_type == "homepage"][0]{
  ...,
  hero{..., image->},
  featuredWork[]->,
  aboutSection{...}
}`);

export const CASE_STUDIES_QUERY = defineQuery(`*[_type == "caseStudy" && defined(slug.current)] | order(order asc) {
  _id, _type, title, "slug": slug.current, summary, category,
  "coverImage": { "image": coverImage.image, "alt": coverImage.alt }, "clientName": client->name, year
}`);

export const CASE_STUDY_QUERY = defineQuery(`*[_type == "caseStudy" && slug.current == $slug][0]{
  ..., "coverImage": { "image": coverImage.image, "alt": coverImage.alt }, "clientName": client->name, year, role, challenge, solution, outcome, team, timeline
}`);

export const BLOG_POSTS_QUERY = defineQuery(`*[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc) {
  _id, _type, title, "slug": slug.current, excerpt, publishedAt,
  "coverImage": { "image": coverImage.image, "alt": coverImage.alt }
}`);

export const BLOG_POST_QUERY = defineQuery(`*[_type == "blogPost" && slug.current == $slug][0]{
  ..., "coverImage": { "image": coverImage.image, "alt": coverImage.alt },
  body[]{..., _type == "sanityImage" => { "image": image, "alt": alt }}
}`);

export const CLIENTS_QUERY = defineQuery(`*[_type == "client"] | order(name asc) {
  _id, _type, name, "logo": { "image": logo.image, "alt": logo.alt }, website, industry
}`);

export const HEADER_QUERY = defineQuery(`*[_type == "header"][0]{
  links[]{"label": text, "href": url, openInNewTab}
}`);

export const FOOTER_QUERY = defineQuery(`*[_type == "footer"][0]{
  links[]{"label": text, "href": url, openInNewTab},
  copyright
}`);

export const ABOUT_QUERY = defineQuery(`*[_type == "homepage"][0].aboutSection`);

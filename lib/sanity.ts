import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-21',
  useCdn: true,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export async function getFeaturedContent(section: string) {
  try {
    if (section === 'hero') {
      const query = `*[_type == "banner" && active == true][0] {
        title,
        subtitle,
        image,
        cta,
        link
      }`;
      return await client.fetch(query);
    }
    
    if (section === 'categories') {
      const query = `*[_type == "category"] {
        _id,
        name,
        "image": image.asset->url,
        description
      }`;
      return await client.fetch(query);
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching content from Sanity:', error);
    // Fallback content
    if (section === 'hero') {
      return null;
    }
    if (section === 'categories') {
      return [];
    }
    return null;
  }
}
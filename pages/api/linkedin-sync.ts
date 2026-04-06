import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  status?: string;
  message?: string;
  error?: string;
  posts?: any[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const linkedInToken = process.env.LINKEDIN_ACCESS_TOKEN;
    const orgIdEnv = process.env.LINKEDIN_ORG_ID;
    const orgUrl = process.env.LINKEDIN_ORG_URL || 'https://www.linkedin.com/company/sans-mercantile';
    const orgId = orgIdEnv || ((orgUrl.match(/linkedin\.com\/company\/(.+)$/) || [])[1] || '');

    if (!linkedInToken || !orgId) {
      // Fallback with friendly sandbox posts to avoid repeated 400s during dev
      return res.status(200).json({
        status: 'unconfigured',
        message:
          'LinkedIn integration is not configured. Set LINKEDIN_ACCESS_TOKEN and LINKEDIN_ORG_ID in .env.local to enable live sync.',
        posts: [
          {
            id: 'linkedin-placeholder-1',
            title: 'LinkedIn sync not configured',
            content:
              'Install a LinkedIn access token and organization ID to display live updates here.',
            postedDate: new Date().toLocaleDateString(),
            category: 'social',
            slug: 'linkedin-placeholder-1',
            featuredImage: '/images/linkedin-default.jpg',
            platform: 'LinkedIn',
            url: 'https://www.linkedin.com/company/sans-mercantile',
          },
        ],
      });
    }

    // Fetch LinkedIn posts for organization
    const response = await fetch(
      `https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(urn:li:organization:${orgId})&count=10`,
      {
        headers: {
          'Authorization': `Bearer ${linkedInToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `Failed to fetch LinkedIn posts: ${errorText}`,
      });
    }

    const data = await response.json();
    const posts = data.elements || [];

    // Transform LinkedIn posts to our format
    const transformedPosts = posts.map((post: any) => ({
      id: post.id,
      title: post.specificContent?.shareContent?.shareCommentary?.text?.substring(0, 100) + '...' || 'LinkedIn Post',
      content: post.specificContent?.shareContent?.shareCommentary?.text || '',
      postedDate: new Date(post.created?.time || Date.now()).toLocaleDateString(),
      category: 'social',
      slug: `linkedin-${post.id}`,
      featuredImage: post.specificContent?.shareContent?.media?.[0]?.originalUrl || '/images/linkedin-default.jpg',
      platform: 'LinkedIn',
      url: post.specificContent?.shareContent?.shareUrl || '',
    }));

    return res.status(200).json({
      status: 'success',
      message: `Fetched ${transformedPosts.length} posts from LinkedIn`,
      posts: transformedPosts,
    });
  } catch (error) {
    console.error('LinkedIn Sync Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}

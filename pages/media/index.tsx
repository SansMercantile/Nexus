import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import { fadeInUp, staggerContainer } from '../../lib/animations';
import { useState, useEffect } from 'react';

const networkPlaceholders = [
  {
    id: 'youtube-1',
    platform: 'YouTube',
    title: 'The Frictionless Future: Mini series',
    content: 'In this mini series we explore the future of frictionless technology. Watch the first episode now.',
    postedDate: new Date().toLocaleDateString(),
    url: 'https://www.youtube.com/playlist?list=PLecIy_-i6Lm8lMwM5cxijiWZOzFsQd_Qa',
    embed: '<iframe width="100%" height="200" src="https://www.youtube.com/embed/videoseries?list=PLecIy_-i6Lm8lMwM5cxijiWZOzFsQd_Qa" title="Sans Mercantile YouTube Playlist" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>',
  },
  {
    id: 'facebook-1',
    platform: 'Facebook',
    title: 'The Myth of AI Tools',
    content: 'The industry is obsessed with "Tools." We are building Infrastructure.',
    postedDate: new Date().toLocaleDateString(),
    url: 'https://www.facebook.com/photo/?fbid=1516072643860913&set=a.493775209424000',
    embed: '<iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fsansmercantile%2Fposts%2Fpfbid0qeSPh1RVjmJs2sBQfP4EWc4oWMFiEGqMAbnKUwXQXwjri2MnmPPx1MEyMYVjWJBZl&show_text=true&width=500" width="100%" height="200" style="border:none;overflow:hidden" scrolling="no" frameBorder="0" allowFullScreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>',
  },
  {
    id: 'twitter-1',
    platform: 'Twitter',
    title: 'New integration: Constellation SDK now supports event streaming',
    content: 'Check out how to connect to real-time telemetry with 5 lines of code.',
    postedDate: new Date().toLocaleDateString(),
    url: 'https://twitter.com/sansmercantile/status/placeholder',
    embed: '',
  },
  {
    id: 'instagram-1',
    platform: 'Instagram',
    title: 'The Frictionless Future | Episode 1 The Myth of "Smart" Everything',
    content: 'Is your home actually "smart," or is it just fragile? In the first episode of our new mini-series, we explore the hidden complexities and risks of the "smart" everything trend. Watch now to learn how to build a truly frictionless future.',
    postedDate: new Date().toLocaleDateString(),
    url: 'https://www.instagram.com/reel/DXjQU2JE8UU/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    embed: '<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/reel/DXjQU2JE8UU/?utm_source=ig_embed&utm_campaign=loading" data-instgrm-version="14" style="background:#FFF;border:0;border-radius:3px;box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15);margin:1px;max-width:540px;min-width:326px;padding:0;width:99.375%;width:calc(100% - 2px);"><div style="padding:16px;"><a href="https://www.instagram.com/reel/DXjQU2JE8UU/?utm_source=ig_embed&utm_campaign=loading" style="background:#FFFFFF;lineHeight:0;padding:0 0;textAlign:center;textDecoration:none;width:100%;display:block;" target="_blank" rel="noopener noreferrer"><div style="display:flex;flexDirection:row;alignItems:center;"><div style="background-color:#F4F4F4;borderRadius:50%;flexGrow:0;height:40px;marginRight:14px;width:40px;"></div><div style="display:flex;flexDirection:column;flexGrow:1;justifyContent:center;"><div style="background-color:#F4F4F4;borderRadius:4px;flexGrow:0;height:14px;marginBottom:6px;width:100px;"></div><div style="background-color:#F4F4F4;borderRadius:4px;flexGrow:0;height:14px;width:60px;"></div></div></div></a></div></blockquote><script async src="//www.instagram.com/embed.js"></script>',
  },
];

function mergeFeeds(linkedInPosts: any[], otherPosts: any[]) {
  const merged: any[] = [];
  const maxLength = Math.max(linkedInPosts.length, otherPosts.length);
  for (let i = 0; i < maxLength; i += 1) {
    if (i < linkedInPosts.length) merged.push({ ...linkedInPosts[i], platform: 'LinkedIn' });
    if (i < otherPosts.length) merged.push(otherPosts[i]);
  }
  return merged;
}

export default function MediaHubPage() {
  const [linkedinPosts, setLinkedinPosts] = useState<any[]>([]);
  const [socialPosts, setSocialPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/linkedin-sync')
      .then(res => res.json())
      .then(data => {
        const linkedData = Array.isArray(data.posts) ? data.posts.slice(0, 3) : [];
        setLinkedinPosts(linkedData);

        const merged = mergeFeeds(linkedData, networkPlaceholders);
        setSocialPosts(merged);

        setLoading(false);
      })
      .catch(() => {
        setSocialPosts(mergeFeeds([], networkPlaceholders));
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-nexus-gold mb-4">Media Center</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">News, insights, and announcements from Sans Mercantile</h1>
            <p className="text-xl text-nexus-gray-300 max-w-3xl mx-auto">
              Access our blog, press releases, social updates, and company media from one central hub.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
          >
            <motion.div variants={fadeInUp} className="rounded-3xl border border-nexus-gold/20 bg-[#0b1125] p-10">
              <span className="text-sm uppercase text-nexus-gold tracking-[0.3em] mb-4 inline-block">Blog</span>
              <h2 className="text-3xl font-bold text-white mb-4">Insights for enterprises, operators, and investors</h2>
              <p className="text-nexus-gray-300 leading-relaxed mb-8">
                Explore commentary on autonomous systems, financial intelligence, governance, and the future of intelligent commerce.
              </p>
              <Link href="/media/blog" className="inline-flex items-center gap-3 px-8 py-3 rounded-xl bg-nexus-gold text-black font-semibold hover:opacity-90 transition-opacity">
                Browse the Blog
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp} className="rounded-3xl border border-nexus-gold/20 bg-[#0b1125] p-10">
              <span className="text-sm uppercase text-nexus-gold tracking-[0.3em] mb-4 inline-block">Press</span>
              <h2 className="text-3xl font-bold text-white mb-4">Official announcements and company milestones</h2>
              <p className="text-nexus-gray-300 leading-relaxed mb-8">
                Read the latest press releases and executive communications from Sans Mercantile leadership.
              </p>
              <Link href="/media/press" className="inline-flex items-center gap-3 px-8 py-3 rounded-xl border border-nexus-gold text-nexus-gold font-semibold hover:bg-nexus-gold/10 transition-colors">
                View Press Releases
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-20 rounded-3xl border border-nexus-gold/20 bg-[#0b1125] p-10"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Media & Social Channel Access</h2>
            <p className="text-nexus-gray-300 leading-relaxed mb-6">
              The Media hub provides a central access point for our press announcements, editorial storytelling, and official social channels. Each channel is managed with a consistent editorial workflow and premium brand presentation.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
              {loading ? (
                <div className="text-center p-10 rounded-2xl border border-nexus-gold/20 bg-[#0b1125]">
                  <p className="text-nexus-gray-300">Loading latest social feed...</p>
                </div>
              ) : socialPosts.length > 0 ? (
                socialPosts.map((post, index) => {
                  const platformColors: Record<string, string> = {
                    LinkedIn: 'bg-[#0077b5]',
                    YouTube: 'bg-[#ff0000]',
                    Facebook: 'bg-[#1877f2]',
                    Twitter: 'bg-[#1da1f2]',
                    Instagram: 'bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#515bd4]',
                  };

                  const bColor = platformColors[post.platform] || 'bg-nexus-gold';

                  return (
                    <motion.div
                      key={`${post.id}-${index}`}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                      className="rounded-2xl border border-nexus-gold/20 bg-[#0b1125] p-6"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold text-white ${bColor}`}>{post.platform}</span>
                        <span className="text-xs text-nexus-gray-500">{post.postedDate}</span>
                      </div>
                      {post.embed ? (
                        <div className="mb-3 rounded-lg overflow-hidden" dangerouslySetInnerHTML={{ __html: post.embed }} />
                      ) : null}
                      <h3 className="text-lg text-white font-semibold mb-2 line-clamp-2">{post.title || 'Latest update'}</h3>
                      <p className="text-nexus-gray-300 text-sm leading-relaxed mb-4 line-clamp-4">{post.content}</p>
                      {post.url && (
                        <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-nexus-gold hover:text-white text-sm font-semibold">
                          Read more →
                        </a>
                      )}
                    </motion.div>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-nexus-gold/20 bg-[#0b1125] p-8 text-center">
                  <p className="text-nexus-gray-300">No social posts found yet. Configure LinkedIn + other feeds to populate the stream.</p>
                </div>
              )}
            </div>

            {/* Professional Pages Follow Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {[
                { name: 'LinkedIn', icon: 'linkedin', url: 'https://www.linkedin.com/company/sans-mercantile', isExternal: true },
                { name: 'Facebook', icon: 'facebook', url: 'https://www.facebook.com/sansmercantile', isExternal: true },
                { name: 'Twitter', icon: 'twitter', url: 'https://twitter.com/sansmercantile', isExternal: true },
                { name: 'Instagram', icon: 'instagram', url: 'https://www.instagram.com/sansmercantile', isExternal: true },
                { name: 'YouTube', icon: 'youtube', url: 'https://www.youtube.com/@sansmercantile', isExternal: true },
                { name: 'VC4A', icon: 'vc4a', url: 'https://vc4a.com/ventures/sans-mercantile/', isExternal: true },
                { name: 'Crunchbase', icon: 'crunchbase', url: 'https://www.crunchbase.com/organization/sans-mercantile', isExternal: true },
              ].map((network) => (
                <a
                  key={network.name}
                  href={network.url}
                  target={network.isExternal ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-nexus-gold/10 p-6 bg-gradient-to-br from-[#0f1425] to-[#0a0f22] hover:border-nexus-gold/30 transition-colors group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {network.icon === 'linkedin' && (
                      <svg className="w-5 h-5 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.208 24 24 23.227 24 22.271V1.729C24 .774 23.208 0 22.225 0h.001z"/></svg>
                    )}
                    {network.icon === 'facebook' && (
                      <svg className="w-5 h-5 text-[#1877f2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.363.099 2.363.099v2.633h-1.332c-1.32 0-1.733.834-1.733 1.688v2.105h3.859l-.615 3.47h-3.244v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    )}
                    {network.icon === 'twitter' && (
                      <svg className="w-5 h-5 text-[#1da1f2]" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.115 13.115 0 007.557 2.209c9.053 0 13.912-7.421 13.912-13.912 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                    )}
                    {network.icon === 'instagram' && (
                      <svg className="w-5 h-5" fill="url(#insta-gradient)" viewBox="0 0 24 24"><defs><linearGradient id="insta-gradient" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f09433"/><stop offset="25%" stopColor="#e6683c"/><stop offset="50%" stopColor="#dc2743"/><stop offset="75%" stopColor="#cc2366"/><stop offset="100%" stopColor="#bc1888"/></linearGradient></defs><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.665-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 8.164 8.976 8.976 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 8.16-2.618 8.876-8.976.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-8.16-8.976-8.976C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="url(#insta-gradient)"/></svg>
                    )}
                    {network.icon === 'youtube' && (
                      <svg className="w-5 h-5 text-[#ff0000]" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    )}
                    {network.icon === 'vc4a' && (
                      <svg className="w-5 h-5 text-nexus-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 17.703l-3.453-3.453 3.453-3.453-1.414-1.414-3.453 3.453-3.453-3.453-1.414 1.414 3.453 3.453-3.453 3.453 1.414 1.414 3.453-3.453 3.453 3.453 1.414-1.414z"/></svg>
                    )}
                    {network.icon === 'crunchbase' && (
                      <svg className="w-5 h-5 text-nexus-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.8a7.2 7.2 0 110 14.4 7.2 7.2 0 010-14.4zm0 2.4a4.8 4.8 0 100 9.6 4.8 4.8 0 000-9.6z"/></svg>
                    )}
                    <h3 className="text-lg font-semibold text-white group-hover:text-nexus-gold transition-colors">{network.name}</h3>
                  </div>
                  <p className="text-nexus-gray-400 text-sm">
                    {network.isExternal ? 'Follow our profile' : `Official professional portfolios, executive announcements, and funding rounds for ${network.name}.`}
                  </p>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

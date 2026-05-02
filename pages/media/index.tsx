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
      embed: '<iframe width="100%" height="594" src="https://www.youtube.com/embed/videoseries?list=PLecIy_-i6Lm8lMwM5cxijiWZOzFsQd_Qa&autoplay=1&mute=1&loop=1&rel=0" title="Sans Mercantile YouTube Playlist" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>',
    },
    {
      id: 'facebook-1',
      platform: 'Facebook',
      title: 'The Myth of AI Tools',
      content: 'The industry is obsessed with "Tools." We are building Infrastructure.',
      postedDate: new Date().toLocaleDateString(),
      url: 'https://www.facebook.com/photo/?fbid=1516072643860913&set=a.493775209424000',
      embed: '<iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fsansmercantile%2Fposts%2Fpfbid0qeSPh1RVjmJs2sBQfP4EWc4oWMFiEGqMAbnKUwXQXwjri2MnmPPx1MEyMYVjWJBZl&show_text=true&width=500" width="100%" height="594" style="border:none;overflow:hidden" scrolling="no" frameBorder="0" allowFullScreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>',
    },
    {
      id: 'instagram-1',
      platform: 'Instagram',
      title: 'The Frictionless Future | Episode 1 The Myth of "Smart" Everything',
      content: 'Is your home actually "smart," or is it just fragile? In the first episode of our new mini-series, we explore the hidden complexities and risks of the "smart" everything trend. Watch now to learn how to build a truly frictionless future.',
      postedDate: new Date().toLocaleDateString(),
      url: 'https://www.instagram.com/reel/DXjQU2JE8UU/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
      embed: '<iframe src="https://www.instagram.com/reel/DXjQU2JE8UU/embed" width="100%" height="594" frameBorder="0" scrolling="no" allowtransparency="true" allow="encrypted-media"></iframe>',
    },
{
  id: 'twitter-1',
  platform: 'Twitter',
  title: 'Agricultural Innovation: How KEL is Transforming Farming',
  content: 'How intelligent agricultural systems are delivering higher yields, better resource use, and faster logistics.',
  postedDate: 'May 2, 2026',
  url: 'https://twitter.com/sansmercantile/status/2050593461372391841',
  embed: `
    <blockquote class="twitter-tweet" data-theme="dark">
      <p lang="en" dir="ltr">Agricultural Innovation: How KEL is Transforming Farming</p>
      &mdash; Sans Mercantile (@sansmercantile) 
      <a href="https://twitter.com/sansmercantile/status/2050593461372391841?ref_src=twsrc%5Etfw">May 2, 2026</a>
    </blockquote>
  `,
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
      setSocialPosts(mergeFeeds(linkedData, networkPlaceholders));
      setLoading(false);
    })
    .catch(() => {
      setSocialPosts(mergeFeeds([], networkPlaceholders));
      setLoading(false);
    });

const win = window as any;
  if (!win.twttr) {
    const script = document.createElement("script");
    script.id = "twitter-wjs";
    script.setAttribute("src", "https://platform.twitter.com/widgets.js");
    script.setAttribute("async", "true");
    
    script.onload = () => {
      if (win.twttr?.widgets) win.twttr.widgets.load();
    };
    
    document.head.appendChild(script);
  } else if (win.twttr?.widgets) {
    win.twttr.widgets.load();
  }
}, [socialPosts]);

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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
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
                      {network.icon === 'vc4a' && (
                        <svg className="w-5 h-5 text-nexus-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 17.703l-3.453-3.453 3.453-3.453-1.414-1.414-3.453 3.453-3.453-3.453-1.414 1.414 3.453 3.453-3.453 3.453 1.414 1.414 3.453-3.453 3.453 3.453 1.414-1.414z"/></svg>
                      )}
                      {network.icon === 'crunchbase' && (
                        <svg className="w-5 h-5 text-nexus-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.8a7.2 7.2 0 110 14.4 7.2 7.2 0 010-14.4zm0 2.4a4.8 4.8 0 100 9.6 4.8 4.8 0 000-9.6z"/></svg>
                      )}
                      <h3 className="text-lg font-semibold text-white group-hover:text-nexus-gold transition-colors">{network.name}</h3>
                    </div>
                    <p className="text-nexus-gray-400 text-sm">
                      {network.isExternal ? 'Visit our professional portfolio' : `Official professional portfolios, executive announcements, and funding rounds for ${network.name}.`}
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

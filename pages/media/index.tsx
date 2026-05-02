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
    embed: '<iframe width="100%" height="200" src="https://www.youtube.com/embed/videoseries?list=PLecIy_-i6Lm8lMwM5cxijiWZOzFsQd_Qa&autoplay=1&mute=1&loop=1" title="Sans Mercantile YouTube Playlist" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>',
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
    embed: '<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/reel/DXjQU2JE8UU/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"> <a href="https://www.instagram.com/reel/DXjQU2JE8UU/?utm_source=ig_embed&amp;utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <div style=" display: flex; flex-direction: row; align-items: center;"> <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div></div></div><div style="padding: 19% 0;"></div> <div style="display:block; height:50px; margin:0 auto 12px; width:50px;"><svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path></g></g></g></svg></div><div style="padding-top: 8px;"> <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;">View this post on Instagram</div></div><div style="padding: 12.5% 0;"></div> <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;"><div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div> <div style="background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div><div style="margin-left: 8px;"> <div style=" background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;"></div> <div style=" width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; transform: translateX(16px) translateY(-4px) rotate(30deg)"></div></div><div style="margin-left: auto;"> <div style=" width: 0px; border-top: 8px solid #F4F4F4; border-right: 8px solid transparent; transform: translateY(16px);"></div> <div style=" background-color: #F4F4F4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);"></div> <div style=" width: 0; height: 0; border-top: 8px solid #F4F4F4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px);"></div></div></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center; margin-bottom: 24px;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 224px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 144px;"></div></div></a><p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><a href="https://www.instagram.com/reel/DXjQU2JE8UU/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_blank">A post shared by Sans Mercantile (@sansmercantile)</a></p></div></blockquote><script async src="//www.instagram.com/embed.js"></script> ',
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
                    {network.isExternal ? 'Visit our professional Prtfolio' : `Official professional portfolios, executive announcements, and funding rounds for ${network.name}.`}
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

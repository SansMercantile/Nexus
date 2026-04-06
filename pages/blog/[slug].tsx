import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function BlogPostRedirect() {
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (typeof slug === 'string') {
      router.replace(`/media/blog/${slug}`);
    }
  }, [router, slug]);

  return null;
}

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function BlogRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/media/blog');
  }, [router]);

  return null;
}

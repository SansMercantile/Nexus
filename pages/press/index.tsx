import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function PressIndexRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/media/press');
  }, [router]);

  return null;
}

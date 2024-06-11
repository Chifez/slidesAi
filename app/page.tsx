'use client';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [openAIKey, setOpenAIKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!session) return;
    const storedKey = localStorage.getItem('openAIKey');
    if (storedKey) {
      setOpenAIKey(storedKey);
      console.log('pushing');
      router.push('/dashboard');
    }
  }, [session]);

  const login = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (!openAIKey) {
        setIsLoading(false);
        return;
      }
      localStorage.setItem('openAIKey', openAIKey);
      signIn('google');
      console.log('pushing 2');
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  if (session) {
    return <p>Redirecting to dashboard...</p>;
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <form
        className=" flex flex-col items-center space-y-4 border border-black rounded-md py-8 px-4"
        onSubmit={login}
      >
        <input
          type="text"
          value={openAIKey}
          onChange={(e) => setOpenAIKey(e.target.value)}
          placeholder="Enter OpenAI Key"
          className="border border-black p-2 rounded-md"
          required
        />

        <button
          type="submit"
          className="bg-black text-white rounded-md p-2 hover:scale-90"
        >
          {isLoading ? 'Loading' : 'Sign in with Google'}
        </button>
      </form>
    </div>
  );
}

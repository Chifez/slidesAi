'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Emailcard from '../components/emailcard';

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [openAIKey, setOpenAIKey] = useState('');
  const [emails, setEmails] = useState([]);
  const [numEmails, setNumEmails] = useState(10);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({ image: '', email: '' });

  const fetchEmails = async (count) => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/emails', {
        params: { maxResults: count },
      });
      localStorage.setItem('emails', JSON.stringify(response.data));
      console.log('responss', response);
      setEmails(response?.data);
      setIsLoading(false);
    } catch (error) {
      console.log('error', error);
      setIsLoading(false);
    }
  };

  const handleNumEmailsChange = (e) => {
    const newNumEmails = parseInt(e.target.value);
    setNumEmails(newNumEmails);
    fetchEmails(newNumEmails);
  };

  const handleLogout = () => {
    signOut({ redirect: false }).then(() => router.push('/'));
  };

  const classifyEmails = async () => {
    const response = await axios.post('/api/gpt', {
      openAIKey,
      emails,
    });

    localStorage.setItem('classifiedEmails', JSON.stringify(response.data));
    setEmails(response.data);
  };

  const handleEmailClick = (email) => {
    console.log('email', email);
    setSelectedEmail(email);
  };

  const handleCloseModal = () => {
    setSelectedEmail(null);
  };

  useEffect(() => {
    if (!session) {
      router.push('/');
    } else {
      setUser({ image: session?.user?.image, email: session?.user?.email });
      console.log('session', session?.user?.image, session?.user?.email);
      const storedKey = localStorage.getItem('openAIKey');
      if (storedKey) {
        setOpenAIKey(storedKey);
      }
      fetchEmails(numEmails);
    }
  }, []);

  return (
    <section className="relative flex items-center justify-center w-full h-screen p-8 bg-purple-300">
      <div className="w-[60%] h-full">
        <div className="flex justify-between items-center mb-8">
          <span className="flex items-center gap-2">
            <img
              src={user.image || ''}
              alt="user avatar"
              className="border border-red-500 rounded-full size-8"
            />
            <div></div>
            <p className="font-semibold italic">
              {user.email ? user.email : 'userexample@gmail.com'}
            </p>
          </span>

          <button
            onClick={handleLogout}
            className="bg-red-700 text-white rounded-md p-2 hover:scale-90"
          >
            Logout
          </button>
        </div>
        <div className=" flex items-center justify-between ">
          <div className="flex flex-col">
            <label htmlFor="numEmails">No of Emails:</label>
            <select
              id="numEmails"
              value={numEmails}
              onChange={handleNumEmailsChange}
              className="border border-red-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <button
            onClick={classifyEmails}
            className="bg-blue-900 text-white rounded-md p-2 hover:scale-90"
          >
            Classify Emails
          </button>
        </div>
        {isLoading ? (
          <div className="absolute top-0 left-0 bg-black/50 w-screen h-screen flex items-center justify-center animate-pulse">
            <p>Loading emails</p>
          </div>
        ) : (
          <div className="space-y-4 py-4 h-[80%] w-full px-4 overflow-scroll no-scrollbar">
            {emails.map((email, idx) => (
              <span
                key={idx}
                onClick={() => handleEmailClick(email)}
                className="flex items-start max-w-full w-full cursor-pointer"
              >
                <Emailcard item={email} />
              </span>
            ))}
          </div>
        )}

        {selectedEmail && (
          <div
            className="absolute top-0 left-0 bg-black/50 w-screen h-screen flex items-center justify-center"
            onClick={handleCloseModal}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-md w-[50%] h-[50%] p-4 relative"
            >
              <div
                className="absolute top-2 right-2 flex items-center justify-center cursor-pointer hover:bg-black/10 rounded-full size-8"
                onClick={handleCloseModal}
              >
                <p className="text-4xl">&times;</p>
              </div>
              <div className="overflow-scroll h-full no-scrollbar py-4 my-8">
                <h3 className="font-semibold text-xl mb-4">
                  {selectedEmail.title}
                </h3>
                <p className="text-center break-all">{selectedEmail.body}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

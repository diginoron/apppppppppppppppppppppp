import React, { useState, useCallback } from 'react';
import { generateThesisTopics } from './services/geminiService';
import { ThesisTopic } from './types';
import InputForm from './components/InputForm';
import TopicDisplay from './components/TopicDisplay';

const App: React.FC = () => {
  const [keywords, setKeywords] = useState<string>('');
  const [topics, setTopics] = useState<ThesisTopic[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTopics = useCallback(async (currentKeywords: string) => {
    setIsLoading(true);
    setError(null);
    setTopics([]); // Clear previous topics
    try {
      const generatedTopics = await generateThesisTopics(currentKeywords);
      setTopics(generatedTopics);
    } catch (err: any) {
      console.error("Failed to generate thesis topics:", err);
      setError(err.message || "خطایی در تولید موضوعات رخ داد. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array means this function is created once

  const handleKeywordsSubmit = useCallback((inputKeywords: string) => {
    setKeywords(inputKeywords); // Update keywords state with the submitted value
    fetchTopics(inputKeywords);
  }, [fetchTopics]); // fetchTopics is stable due to useCallback

  const handleKeywordsChange = useCallback((newKeywords: string) => {
    setKeywords(newKeywords);
    // Optionally clear topics/error if user starts typing again after an error
    if (error || topics.length > 0) {
      setError(null);
      setTopics([]);
    }
  }, [error, topics.length]);


  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 border border-gray-200 transform hover:scale-[1.01] transition-transform duration-300 ease-in-out flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6 text-center leading-tight">
          مولد موضوع پایان نامه
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8 text-center max-w-prose">
          کلمات کلیدی خود را وارد کنید تا سه موضوع پایان نامه خلاقانه توسط هوش مصنوعی Gemini به شما پیشنهاد شود.
        </p>

        <InputForm
          onSubmit={handleKeywordsSubmit}
          isLoading={isLoading}
          onKeywordsChange={handleKeywordsChange}
          initialKeywords={keywords}
        />

        <TopicDisplay topics={topics} error={error} />
      </div>

      <footer className="mt-8 text-center text-gray-600 text-sm">
        <p>با ❤️ توسط Gemini API ساخته شده است.</p>
        <p className="mt-2">لطفاً کلید API را در متغیر محیطی Vercel (API_KEY) برای API Route بک‌اند تنظیم کنید.</p>
      </footer>
    </div>
  );
};

export default App;
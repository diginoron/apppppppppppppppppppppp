import React, { useState } from 'react';

interface InputFormProps {
  onSubmit: (keywords: string) => void;
  isLoading: boolean;
  onKeywordsChange: (keywords: string) => void;
  initialKeywords: string;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, onKeywordsChange, initialKeywords }) => {
  const [keywords, setKeywords] = useState<string>(initialKeywords);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keywords.trim()) {
      onSubmit(keywords.trim());
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setKeywords(e.target.value);
    onKeywordsChange(e.target.value); // Propagate changes up
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      <textarea
        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow-sm resize-y min-h-[120px] max-h-[200px] text-gray-800"
        value={keywords}
        onChange={handleChange}
        placeholder="کلمات کلیدی خود را وارد کنید (مثال: هوش مصنوعی، یادگیری عمیق، پردازش زبان طبیعی)"
        rows={4}
        disabled={isLoading}
        aria-label="Keywords for thesis topic generation"
      ></textarea>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-all duration-200 ease-in-out shadow-md disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        disabled={isLoading || !keywords.trim()}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>درحال تولید...</span>
          </>
        ) : (
          <span>تولید موضوعات پایان نامه</span>
        )}
      </button>
    </form>
  );
};

export default InputForm;

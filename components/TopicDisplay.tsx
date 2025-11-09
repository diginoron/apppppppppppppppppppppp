import React from 'react';
import { ThesisTopic } from '../types';

interface TopicDisplayProps {
  topics: ThesisTopic[];
  error: string | null;
}

const TopicDisplay: React.FC<TopicDisplayProps> = ({ topics, error }) => {
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mt-6" role="alert">
        <strong className="font-bold">خطا:</strong>
        <span className="block sm:inline ml-2">{error}</span>
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg relative mt-6" role="alert">
        <strong className="font-bold">نکته:</strong>
        <span className="block sm:inline ml-2">پس از وارد کردن کلمات کلیدی، موضوعات پایان نامه در اینجا نمایش داده می شوند.</span>
      </div>
    );
  }

  return (
    <div className="w-full mt-6 space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 text-center">موضوعات پیشنهادی پایان نامه:</h2>
      {topics.map((topic, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-blue-700 mb-2">{index + 1}. {topic.title}</h3>
          <p className="text-gray-700 leading-relaxed text-justify">{topic.description}</p>
        </div>
      ))}
    </div>
  );
};

export default TopicDisplay;

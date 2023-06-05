import React, { useState } from 'react';

interface Props {
  keywords: string[];
  setKeywords: (keywords: string[]) => void;
}

const KeywordInput: React.FC<Props> = ({ keywords, setKeywords }) => {
  const [currentKeyword, setCurrentKeyword] = useState<string>('');

  const handleKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentKeyword(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ' ' || event.key === ',' || event.key === 'Enter') {
      event.preventDefault();
      if (currentKeyword.trim()) {
        setKeywords([...keywords, currentKeyword.trim()]);
        setCurrentKeyword('');
      }
    }
  };

  const removeKeyword = (index: number) => {
    const newKeywords = [...keywords];
    newKeywords.splice(index, 1);
    setKeywords(newKeywords);
  };

  return (
    <div className="flex flex-col">
      <label htmlFor="keywords" className="flex items-center text-lg font-semibold mb-2">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 mr-1">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
      </svg>

        キーワード
      </label>

      <div className="border-2 border-gray-300 p-2 rounded-md">
        {keywords.map((keyword, index) => (
          <span
            key={index}
            className="bg-blue-500 text-white font-semibold py-1 px-2 mr-2 mb-2 rounded-md inline-flex items-center"
          >
            {keyword}
            <button
              onClick={() => removeKeyword(index)}
              className="text-sm ml-2 hover:text-gray-300 transition-colors duration-200"
            >
              &times;
            </button>
          </span>
        ))}
        <input
          type="text"
          id="keywords"
          name="keywords"
          value={currentKeyword}
          onChange={handleKeywordChange}
          onKeyDown={handleKeyPress}
          tabIndex={0}
          placeholder='キーワードを入力してください。'
          className="outline-none w-full"
        />
      </div>
      <p className='text-sm text-gray-600'>キーワード入力後はEnterキーを押すか、半角スペースまたはカンマを入力してください。</p>
    </div>
  );
};

export default KeywordInput;

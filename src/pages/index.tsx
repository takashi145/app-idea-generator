import React, { useEffect, useState } from 'react';
import KeywordInput from '@/components/KeywordInput';
import BouncingText from '@/components/BouncingText';
import AppLogo from '@/components/AppLogo';

interface Idea {
  name: string,
  description: string,
}

export default function Home() {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);

  // アイディアの生成
  const generateIdea = () => {
    setLoading(true);

    fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keywords })
    })
    .then((response) => {
      if(!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => setIdeas(data))
    .catch(() => alert('エラーが発生しました。しばらくしてから再度お試しください。'))
    .finally(() => setLoading(false));
  };

  // ローディング状態が変化したときにbodyのoverflowを変更(ローディング中はスクロールができないようにする)
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    }else {
      document.body.style.overflow = "auto";
    }
  }, [loading]);

  return (
    <main className="min-h-screen bg-blue-100 flex items-center justify-center p-4">

      {loading && (
        <div className='z-40 fixed inset-0 bg-black/50'>
          <div className='mt-40 text-2xl font-semibold animate-pulse z-50 text-white'>
            <BouncingText text="生成中" />
          </div>
        </div>
      )}

      <div className="bg-white px-8 pt-4 pb-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="flex items-center text-xl font-bold underline">
          <AppLogo />
          APP IDEA GENERATOR
        </h1>

        {/* キーワード入力フォーム */}
        <KeywordInput 
          keywords={keywords} 
          setKeywords={setKeywords} 
        />

        {/* アイディア生成ボタン */}
        <button
          onClick={generateIdea}
          className="bg-blue-500 text-white font-semibold py-2 px-4 mt-4 rounded-md hover:bg-blue-600 transition-colors duration-300"
        >
          アイディアを生成
        </button>

        {/* アイディアの表示 */}
        {ideas.map((idea, index) => (
          <div key={index} className='p-3 mt-6 border-b'>
            <h2 className='text-xl font-semibold mb-2'>{idea.name}</h2>
            <p className='text-gray-700'>{idea.description}</p>
          </div>
        ))}
      </div>
    </main>
  )
}

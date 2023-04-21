import React from 'react';

interface Props {
  text: string;
}

const BouncingText: React.FC<Props> = ({ text }) => {
  const letters = text.split('');

  return (
    <div className="flex justify-center space-x-3">
      {letters.map((letter, index) => (
        <div
          key={index}
          className={`animate-bounce`}
          style={{
            animationDelay: `${index * 200}ms`,
          }}
        >
          {letter}
        </div>
      ))}
    </div>
  );
};

export default BouncingText;

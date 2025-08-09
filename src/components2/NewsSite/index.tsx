import React from 'react';
import NewsLayout from './Layout';
import NewsHomePage from './HomePage';

const NewsSite: React.FC = () => {
  // Extract recent news titles from the homepage data
  const recentNews = [
    "Cultural Festival Celebrates Diversity in Local Community",
    "Local Restaurant Wins National Culinary Award", 
    "Street Art Project Transforms City Walls",
    "Community Theatre Announces New Season",
    "Weekend Markets Feature Local Artisans",
    "Music Festival Planning Committee Seeks Volunteers"
  ];

  return (
    <NewsLayout recentNews={recentNews}>
      <NewsHomePage />
    </NewsLayout>
  );
};

export default NewsSite;
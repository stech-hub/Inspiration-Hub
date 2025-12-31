
export interface Quote {
  id: string;
  text: string;
  author: string;
  category: QuoteCategory;
}

export enum QuoteCategory {
  RESILIENCE = 'Resilience',
  SUCCESS = 'Success',
  DISCIPLINE = 'Discipline',
  LEADERSHIP = 'Leadership',
  HUSTLE = 'Hustle',
  WISDOM = 'Wisdom'
}

export interface Collection {
  id: string;
  name: string;
  quoteIds: string[];
}

export interface User {
  username: string;
  favorites: string[];
  collections: Collection[];
}

export interface AiResponse {
  speech: string;
  title: string;
}

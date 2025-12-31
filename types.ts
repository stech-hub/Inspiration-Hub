
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

export interface AiResponse {
  speech: string;
  title: string;
}

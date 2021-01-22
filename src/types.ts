export type SearchOptions = {
  searchTerm: string;
  count: number;
  searchIn: string;
  reverse: boolean;
  sortBy: string;
  offset: number;
};

export type SearchInFictionOptions = {
  searchTerm: string;
  count: number;
  searchIn: string;
  offset: number;
  wildcardWords: boolean;
  language: string;
  extension: string;
};

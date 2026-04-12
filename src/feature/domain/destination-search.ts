export type Destination = {
  id: string;
  place: string;
  category: string;
  thumbnail_image: string;
};

export type DestinationSearchService = {
  getFilteredDestinations: ({ query }: { query: string }) => Destination[];
};

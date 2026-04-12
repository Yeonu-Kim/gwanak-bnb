import destinationsData from '@/data/destinations.json';
import type {
  Destination,
  DestinationSearchService,
} from '../domain/destination-search';

const destinations = destinationsData as Destination[];

const countCharMatches = (query: string, text: string): number => {
  let count = 0;
  for (const char of query) {
    if (text.includes(char)) {
      count++;
    }
  }
  return count;
};

export const implDestinationSearchService = (): DestinationSearchService => ({
  getFilteredDestinations: ({ query }: { query: string }): Destination[] => {
    if (query.trim() === '') {
      return [];
    }

    return destinations
      .map((d) => {
        const fullText = d.place + d.category;
        const totalScore = countCharMatches(query, fullText);
        const placeScore = countCharMatches(query, d.place);
        return { destination: d, totalScore, placeScore };
      })
      .filter(({ totalScore }) => {
        return totalScore > 0;
      })
      .sort((a, b) => {
        if (b.totalScore !== a.totalScore) {
          return b.totalScore - a.totalScore;
        }
        return b.placeScore - a.placeScore;
      })
      .slice(0, 6)
      .map(({ destination }) => destination);
  },
});

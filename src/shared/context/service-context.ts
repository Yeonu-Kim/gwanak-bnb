import { createContext } from 'react';
import type { DestinationSearchService } from '@/feature/domain/destination-search';

type ServiceContext = {
  destinationSearchService: DestinationSearchService;
};

export const ServiceContext = createContext<ServiceContext | null>(null);

import { Header } from '@/components/header/header';
import { implDestinationSearchService } from '@/feature/destination/destination-search-service';
import { ServiceContext } from '@/shared/context/service-context';

const App = () => {
  const services = {
    destinationSearchService: implDestinationSearchService(),
  };

  return (
    <ServiceContext.Provider value={services}>
      <div>
        <Header />
      </div>
    </ServiceContext.Provider>
  );
};

export default App;

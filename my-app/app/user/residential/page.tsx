import ResidentialServiceForm from './ResidentialServiceForm';
import CleanerList from './CleanerList';

export default function ResidentialPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-6">Residential Waste Collection</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <ResidentialServiceForm />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <CleanerList />
        </div>
      </div>
    </div>
  );
}

import { SearchIcon } from '../shared/Icons';

const EventFilters = ({ searchTerm, onSearch, categories, activeCategory, onCategoryChange }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm">
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Search events..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-300"
          value={searchTerm}
          onChange={(event) => onSearch(event.target.value)}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon />
        </div>
      </div>
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 -mb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition ${
              activeCategory === category ? 'bg-green-600 text-white shadow' : 'bg-gray-100 hover:bg-green-100'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default EventFilters;

import { SearchIcon } from '../shared/Icons';

const FilterSelect = ({ label, value, options, onChange }) => (
  <label className="flex flex-col gap-1 text-sm font-medium text-gray-600">
    <span>{label}</span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-lg border px-3 py-2 text-sm text-gray-700 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

const participationOptions = [
  { value: 'All', label: 'All students' },
  { value: 'Participated', label: 'Participated' },
  { value: 'Not Participated', label: 'Not participated' },
];

const statusOptions = [
  { value: 'All', label: 'All statuses' },
  { value: 'Active', label: 'Active only' },
  { value: 'Closed', label: 'Closed' },
];

const typeOptions = [
  { value: 'All', label: 'All types' },
  { value: 'Event', label: 'Events' },
  { value: 'Competition', label: 'Competitions' },
];

const EventFilters = ({
  searchTerm,
  onSearch,
  categories,
  activeCategory,
  onCategoryChange,
  participationFilter,
  onParticipationFilterChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  onResetFilters,
  filtersPristine = true,
}) => (
  <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
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
            type="button"
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
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:flex lg:flex-wrap lg:gap-3">
        <FilterSelect
          label="Participation status"
          value={participationFilter}
          onChange={onParticipationFilterChange}
          options={participationOptions}
        />
        <FilterSelect
          label="Competition status"
          value={statusFilter}
          onChange={onStatusFilterChange}
          options={statusOptions}
        />
        <FilterSelect label="Type" value={typeFilter} onChange={onTypeFilterChange} options={typeOptions} />
      </div>
      <button
        type="button"
        onClick={() => onResetFilters?.()}
        disabled={filtersPristine}
        className="self-start rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-green-400 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Reset filters
      </button>
    </div>
  </div>
);

export default EventFilters;

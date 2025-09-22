export const formatDate = (dateString, options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString(undefined, options);
};

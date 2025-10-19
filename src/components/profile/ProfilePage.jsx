import { useState } from 'react';

const ProfilePage = ({ initialProfile, onSave, saving = false, error, onSkip }) => {
  const [form, setForm] = useState({
    fullName: initialProfile?.fullName ?? '',
    department: initialProfile?.department ?? '',
    graduationYear: initialProfile?.graduationYear ?? '',
    phone: initialProfile?.phone ?? '',
    interests: initialProfile?.interests ?? '',
    bio: initialProfile?.bio ?? '',
    collegeId: initialProfile?.collegeId ?? '',
    collegeEmail: initialProfile?.collegeEmail ?? '',
  });
  const [formError, setFormError] = useState('');

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.fullName || !form.department || !form.graduationYear || !form.collegeId) {
      setFormError('Please complete your name, department, college ID, and graduation year.');
      return;
    }
    setFormError('');
    await onSave(form);
  };

  const disabled = saving;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-gray-800">Complete your profile</h1>
        <p className="mt-2 text-sm text-gray-500">
          Tell clubs who you are so they can curate the perfect competitions and hackathons for you.
        </p>
        {formError && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</div>
        )}
        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        )}
        <form className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2" onSubmit={handleSubmit}>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="fullName">
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange('fullName')}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              disabled={disabled}
              placeholder="Alex Sharma"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="department">
              Department
            </label>
            <input
              id="department"
              type="text"
              value={form.department}
              onChange={handleChange('department')}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              disabled={disabled}
              placeholder="Computer Science"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="collegeId">
              College unique ID
            </label>
            <input
              id="collegeId"
              type="text"
              value={form.collegeId}
              onChange={handleChange('collegeId')}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              disabled={disabled}
              placeholder="e.g. HCE2025CS123"
            />
            <p className="mt-1 text-xs text-gray-400">Used for verification with college records.</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="graduationYear">
              Graduation year
            </label>
            <input
              id="graduationYear"
              type="number"
              value={form.graduationYear}
              onChange={handleChange('graduationYear')}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              disabled={disabled}
              placeholder="2026"
              min={new Date().getFullYear()}
              max={new Date().getFullYear() + 6}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="collegeEmail">
              College email ID <span className="text-xs text-gray-400">(optional)</span>
            </label>
            <input
              id="collegeEmail"
              type="email"
              value={form.collegeEmail}
              onChange={handleChange('collegeEmail')}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              disabled={disabled}
              placeholder="your.name@college.edu"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="phone">
              Contact number
            </label>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange('phone')}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              disabled={disabled}
              placeholder="+91 98765 43210"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="interests">
              Clubs & interests
            </label>
            <input
              id="interests"
              type="text"
              value={form.interests}
              onChange={handleChange('interests')}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              disabled={disabled}
              placeholder="AI/ML, Classical Music, Product Design"
            />
            <p className="mt-1 text-xs text-gray-400">Helps club coordinators share relevant opportunities.</p>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="bio">
              About you
            </label>
            <textarea
              id="bio"
              value={form.bio}
              onChange={handleChange('bio')}
              rows={4}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              disabled={disabled}
              placeholder="Tell clubs about your past experiences or what you want to explore next."
            />
          </div>
          <div className="md:col-span-2 flex items-center justify-between gap-3">
            <button
              type="submit"
              disabled={disabled}
              className="rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Saving profile...' : 'Save profile'}
            </button>
            {onSkip && (
              <button type="button" onClick={onSkip} className="text-sm font-medium text-gray-500 hover:text-gray-700">
                I’ll finish this later
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;

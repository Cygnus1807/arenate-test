const ProfilePrompt = ({ onOpenProfile }) => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-10 shadow">
        <h1 className="text-3xl font-bold text-gray-800">Let’s personalise your experience</h1>
        <p className="mt-4 text-sm text-gray-600">
          We noticed this is your first time here. Finish your student profile so clubs know who you are and can invite you to the right competitions.
        </p>
        <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 px-5 py-4 text-sm text-blue-900">
          <p className="font-medium">Next steps:</p>
          <ol className="mt-2 list-decimal space-y-2 pl-5">
            <li>Tap the profile icon in the top-right corner of the dashboard.</li>
            <li>Fill in your department, college ID, graduation year, and interests.</li>
            <li>Save your profile to unlock registrations and recommendations.</li>
          </ol>
        </div>
        <button
          type="button"
          onClick={onOpenProfile}
          className="mt-8 rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
        >
          Go to My Profile
        </button>
        <p className="mt-4 text-xs text-gray-400">
          You can always come back here later from the top navigation.
        </p>
      </div>
    </div>
  );
};

export default ProfilePrompt;

export function GuardianSection() {
  return (
    <section className="w-full py-20 px-6 bg-blue-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center">
          For Parents & Guardians
        </h2>
        <div className="bg-white rounded-lg p-12 border-2 border-blue-200">
          <ul className="space-y-4 text-lg text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-4">✓</span>
              <span>Real-time progress tracking and detailed reports</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-4">✓</span>
              <span>Direct communication with tutors and instructors</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-4">✓</span>
              <span>Customizable learning goals and milestones</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-4">✓</span>
              <span>Safe, secure platform with parental controls</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

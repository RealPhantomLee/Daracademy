export function FinalCTASection() {
  return (
    <section className="w-full py-20 px-6 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-8">
          Ready to Transform Your Learning?
        </h2>
        <p className="text-xl mb-12">
          Join thousands of students and families who are already learning
          smarter
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-3 px-8 rounded-lg text-lg transition">
            Start Free Trial
          </button>
          <button className="border-2 border-white hover:bg-white hover:text-blue-900 font-bold py-3 px-8 rounded-lg text-lg transition">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}

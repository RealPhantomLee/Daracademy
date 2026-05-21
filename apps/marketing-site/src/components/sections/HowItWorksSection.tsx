export function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: "Sign Up",
      description: "Create your free account in seconds",
    },
    {
      number: 2,
      title: "Assessment",
      description: "Take a quick placement test",
    },
    {
      number: 3,
      title: "Personalize",
      description: "Choose your learning style and pace",
    },
    {
      number: 4,
      title: "Learn",
      description: "Start learning with expert instructors",
    },
  ];

  return (
    <section className="w-full py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-16 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white rounded-lg p-8 text-center"
            >
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

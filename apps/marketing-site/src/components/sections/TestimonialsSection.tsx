export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Student",
      quote:
        "DarAcademy changed how I approach learning. The personalized path made everything click!",
    },
    {
      name: "Michael Chen",
      role: "Parent",
      quote:
        "We love seeing our son excited about school again. The progress tracking is invaluable.",
    },
    {
      name: "Emily Rodriguez",
      role: "Student",
      quote:
        "My tutor understands my learning style and explains things in ways that make sense to me.",
    },
  ];

  return (
    <section className="w-full py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-16 text-center">
          What People Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-white rounded-lg p-8 shadow-md"
            >
              <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
              <div className="border-t pt-4">
                <p className="font-bold">{testimonial.name}</p>
                <p className="text-gray-600">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

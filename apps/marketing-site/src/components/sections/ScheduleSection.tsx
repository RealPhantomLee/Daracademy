import { CalendlyEmbed } from "@/components/integrations/CalendlyEmbed";

export function ScheduleSection() {
  return (
    <section className="w-full py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center">
          Schedule a Consultation
        </h2>
        <p className="text-lg text-gray-700 text-center mb-12">
          Book a free one-on-one consultation with our education specialists
        </p>
        <CalendlyEmbed />
      </div>
    </section>
  );
}

import { Metadata } from 'next';
import { Palette, Sprout, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us - Radhika\'s Homecraft',
  description: 'Learn about Radhika\'s Homecraft and our mission to bring authentic Indian handicrafts to your home.',
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="section bg-primary-600 text-white">
        <div className="section-container text-center">
          <h1 className="mb-4 font-serif text-5xl font-bold">About Radhika&rsquo;s Homecraft</h1>
          <p className="text-lg text-primary-100">
            Celebrating the art of authentic Indian handicrafts
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="section">
        <div className="section-container grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-6 font-serif text-4xl font-bold">Our Story</h2>
            <p className="mb-4 text-gray-700">
              Radhika&rsquo;s Homecraft is more than just a store&mdash;it&rsquo;s a celebration of centuries-old traditions
              and the talented artisans who keep these crafts alive.
            </p>
            <p className="mb-4 text-gray-700">
              Founded with a mission to bring authentic, handcrafted textiles and home decor from Jaipur,
              Rajasthan directly to your home, we work with skilled artisans who have mastered their craft
              over generations.
            </p>
            <p className="text-gray-700">
              Every product tells a story—of tradition, artistry, and the soul of Indian handicrafts woven
              into every print and pattern.
            </p>
          </div>
          <div className="flex items-center justify-center rounded-lg bg-neutral-50">
            <div className="text-center">
              <div className="mb-4 inline-flex rounded-full bg-primary-100 p-4">
                <Palette className="h-12 w-12 text-primary-600" />
              </div>
              <p className="text-gray-600">Authentic Handicrafts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section bg-neutral-50">
        <div className="section-container">
          <h2 className="mb-12 text-center font-serif text-4xl font-bold">Our Values</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Palette,
                title: 'Authenticity',
                description: 'We work directly with artisans and traditional craftspeople to bring genuine handmade products.',
              },
              {
                icon: Sprout,
                title: 'Sustainability',
                description: 'We support eco-friendly practices and fair trade to preserve our environment and communities.',
              },
              {
                icon: Heart,
                title: 'Quality',
                description: 'Every product is carefully crafted and quality-checked to ensure your complete satisfaction.',
              },
            ].map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="card text-center">
                  <div className="mb-4 inline-flex rounded-full bg-primary-100 p-4">
                    <IconComponent className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="mb-2 font-serif text-2xl font-bold">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section">
        <div className="section-container text-center">
          <h2 className="mb-4 font-serif text-4xl font-bold">Meet Our Team</h2>
          <p className="mb-12 text-gray-600">
            Passionate individuals dedicated to bringing you the best of Indian handicrafts
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {['CEO', 'Operations', 'Customer Care'].map((role) => (
              <div key={role} className="card text-center">
                <div className="mb-4 h-32 rounded-lg bg-gradient-to-br from-primary-200 to-primary-100 flex items-center justify-center">
                  <div className="text-4xl">👤</div>
                </div>
                <h3 className="font-serif text-lg font-bold">Team Member</h3>
                <p className="text-sm text-gray-600">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section bg-gradient-to-r from-secondary-600 to-secondary-700 text-white">
        <div className="section-container text-center">
          <h2 className="mb-4 font-serif text-4xl font-bold">Have Questions?</h2>
          <p className="mb-8 text-lg">Get in touch with our team</p>
          <div className="flex items-center justify-center gap-4">
            <a href="mailto:radhikashomekraft.in" className="btn bg-white text-secondary-600 hover:bg-gray-100">
              Email Us
            </a>
            <a href="tel:+918239316066" className="btn border-2 border-white text-white hover:bg-white/10">
              Call Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

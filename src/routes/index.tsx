import { Title } from "@solidjs/meta";
import Hero from "~/components/Hero";
import Footer from "~/components/Footer";

export default function Home() {
  return (
    <>
      <Title>Indy Boxing and Grappling</Title>
      <main>
        <Hero />

        {/* New Workouts Weekly */}
        <section class="py-16 px-6 md:px-12 lg:px-24">
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold uppercase">
              New Workouts <span class="text-red-600">Weekly</span>
            </h2>
          </div>
          <div class="flex flex-col md:flex-row gap-6">
            <div class="flex-1">
              <img
                src="https://placehold.co/600x400"
                alt="Trainer teaching boxing"
                class="w-full rounded-lg"
              />
            </div>
            <div class="flex-1 flex flex-col justify-center">
              <p class="text-lg">
                Keep it weekly! Train with new workouts designed every Monday
                including strength-building, speed, and endurance. From boxing
                techniques to kickboxing drills, we’ve got you covered!
              </p>
              <a
                href="#"
                class="mt-6 inline-block bg-red-600 text-white px-6 py-3 uppercase text-sm font-bold tracking-wide hover:bg-red-700"
              >
                Join Today
              </a>
            </div>
          </div>
        </section>

        {/* Membership Program */}
        <section class="py-16 px-6 md:px-12 lg:px-24 bg-gray-900">
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold uppercase">
              New Membership <span class="text-red-600">Program</span>
            </h2>
          </div>
          <div class="flex flex-col md:flex-row gap-6">
            <div class="flex-1 p-6 border border-gray-700 rounded-lg">
              <h3 class="text-xl font-bold uppercase">Monthly</h3>
              <p class="mt-4 text-lg">$19.99 USD</p>
              <p class="mt-2 text-sm">Pay every month. Cancel anytime.</p>
              <a
                href="#"
                class="mt-6 inline-block bg-red-600 text-white px-6 py-3 uppercase text-sm font-bold tracking-wide hover:bg-red-700"
              >
                Join Monthly
              </a>
            </div>
            <div class="flex-1 p-6 border border-gray-700 rounded-lg bg-red-600 text-white">
              <h3 class="text-xl font-bold uppercase">Quarterly</h3>
              <p class="mt-4 text-lg">$50.00 USD</p>
              <p class="mt-2 text-sm">Pay every 3 months. Cancel anytime.</p>
              <a
                href="#"
                class="mt-6 inline-block bg-black text-white px-6 py-3 uppercase text-sm font-bold tracking-wide hover:bg-gray-800"
              >
                Join Quarterly
              </a>
            </div>
            <div class="flex-1 p-6 border border-gray-700 rounded-lg">
              <h3 class="text-xl font-bold uppercase">Yearly</h3>
              <p class="mt-4 text-lg">$200.00 USD</p>
              <p class="mt-2 text-sm">Pay for the full year. Cancel anytime.</p>
              <a
                href="#"
                class="mt-6 inline-block bg-red-600 text-white px-6 py-3 uppercase text-sm font-bold tracking-wide hover:bg-red-700"
              >
                Join Yearly
              </a>
            </div>
          </div>
        </section>

        {/* View the Actions */}
        <section class="py-16 px-6 md:px-12 lg:px-24">
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold uppercase">
              View the <span class="text-red-600">Actions</span>
            </h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img
                src="https://placehold.co/600x400"
                alt="Boxing in action"
                class="w-full rounded-lg"
              />
              <p class="mt-4 text-lg">
                Hitting with different extremities of the body, such as knees
                and punches.
              </p>
            </div>
            <div>
              <img
                src="https://placehold.co/600x400"
                alt="Strength and endurance training"
                class="w-full rounded-lg"
              />
              <p class="mt-4 text-lg">
                Various types of boxing existed in ancient India.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}

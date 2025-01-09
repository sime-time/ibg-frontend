import { For } from "solid-js";

export default function FAQ() {
  const faqItems = [
    {
      question: "What do I need to bring?",
      answer: "For boxing please bring workout shoes, athletic wear, hand wraps, boxing gloves, and a mouthpiece/cup if you want to spar. For jiu-jitsu, athletic wear and a mouthpiece. Try to arrive 10 minutes before class to prepare.",
    },
    {
      question: "What are the classes like?",
      answer: "Boxing classes usually start with multiple rounds of cardio, followed by technique drills and heavy bag work. For competetive boxers, some classes also involve sparring sessions. Feel free to visit us during a class to see what training is like.",
    },
    {
      question: "Do you train kids?",
      answer: "We currently offer boxing classes for kids over the age of 8 provided they have parental supervision for the entirety of practice. Jiu-jitsu participants must be over the age of 14. Boxing for kids is $70/month and jiu-jitsu is $100/month.",
    },
    {
      question: "Where are you located?",
      answer: (<a href="https://maps.app.goo.gl/o84UTdgM7tfjiras7" target="_blank" class="link">4903 E 23rd St Indianapolis IN 46218</a>),
    },
    {
      question: "Can I pay membership dues in Cash App, Zelle, or cash?",
      answer: "Yes! Come in person and talk to one of the coaches about paying for your membership in cash or Zelle. (Our online payment system already allows you to pay with Cash App or debit/credit card).",
    },
  ];

  return (
    <section class="bg-slate-950 py-16 px-8 md:px-16 flex justify-center">
      <div class="flex flex-col gap-6 md:w-2/3">
        <h1 class="text-start font-bold text-4xl">Frequently Asked <span class="text-primary">Questions</span></h1>
        <For each={faqItems}>
          {(faq) => (
            <div class="collapse collapse-arrow bg-base-200">
              <input type="radio" name="faq-accordion" />
              <div class="collapse-title text-2xl font-medium">{faq.question}</div>
              <div class="collapse-content">
                <p class="text-lg opacity-70">{faq.answer}</p>
              </div>
            </div>
          )}
        </For>
      </div>
    </section>
  );
}

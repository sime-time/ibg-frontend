import { createSignal, Show } from "solid-js";
import { usePocket } from "~/context/PocketbaseContext";

export default function MemberWaiver() {
  const { waiverTimestamp, user } = usePocket();
  const [error, setError] = createSignal("");
  const [submitDisabled, setSubmitDisabled] = createSignal(false);

  // record the timestamp at the time of submission
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError("");
    setSubmitDisabled(true);
    const currentTime = new Date();

    try {
      const successful = await waiverTimestamp(user()?.id, currentTime);
      console.log("user: ", user())
      if (successful) {
        location.reload();
      } else {
        throw new Error("Internal server error");
      }
    } catch (err) {
      setError("Internal server error, please reload the page and try again.");
      console.error(err);
    } finally {
      setSubmitDisabled(false);
    }
  };

  return (
    <section class="bg-slate-950 py-16 px-8 md:px-16 flex justify-center">
      <div class="flex flex-col gap-6 md:w-2/3">
        <h1 class="font-bold text-4xl">
          Waiver, Release and Assumption of Risk
        </h1>
        <p class="uppercase text-xl">
          IN CONSIDERATION OF ME BEING ALLOWED TO PARTICIPATE IN ANY WAY IN INDY
          BOXING AND GRAPPLING (INDY BOXING LLC) ACTIVITIES, I AGREE:
        </p>
        <ol class="text-lg list-decimal flex flex-col gap-5">
          <li>
            I understand the nature of Indy Boxing LLC activities (boxing,
            jiu-jitsu, mixed martial arts training, sparring, and other physical
            fitness activities) and my experience and capabilities and believe I
            am qualified to participate in such activities in a safe and
            responsible manner. I further acknowledge that I am aware the
            activity will be conducted in facilities open to the public during
            the activity. I further agree and warrant that if I believe
            conditions to be unsafe, I will immediately discontinue further
            participation in the activity.
          </li>
          <li>
            I FULLY UNDERSTAND THAT: (a) Indy Boxing LLC activities involve
            risks and dangers of SERIOUS BODILY INJURY, INCLUDING SICKNESS AND
            DISEASE, INCLUDING PERMANENT DISABILITY, PARALYSIS, AND DEATH
            (“Risks”); (b) these Risks and dangers may be caused by me, other
            participants, or the actions or inactions of others, including the
            condition in which the activity takes place, or the NEGLIGENCE OF
            THE “RELEASEES” NAMED BELOW; (c) there may be other risks and social
            and economic losses either not known to me or not readily
            foreseeable at this time; and I FULLY ACCEPT AND ASSUME ALL SUCH
            RISKS AND ALL RESPONSIBILITY FOR LOSSES, COSTS, AND DAMAGES incurred
            as a result of my participation in these activities.
          </li>
          <li>
            I HEREBY RELEASE, DISCHARGE, COVENANT NOT TO SUE, AND AGREE TO
            INDEMNIFY AND SAVE AND HOLD HARMLESS Indy Boxing LLC, its owners,
            instructors, agents, volunteers, employees, other participants,
            sponsors, advertisers, and, if applicable, owners and lessors of
            premises on which the activities take place (each considered one of
            the “Releasees” herein) from all liability, claims, demands, losses,
            or damages on my account caused or alleged to be caused in whole or
            in part by the NEGLIGENCE OF THE “RELEASEES” or otherwise, including
            negligent rescue operations. I further agree that, if despite this
            release, I, or anyone on my behalf, makes a claim against any of the
            Releasees named above, I WILL INDEMNIFY, SAVE AND HOLD HARMLESS EACH
            OF THE RELEASEES FROM ANY LITIGATION EXPENSES, ATTORNEY FEES, LOSS
            LIABILITY, DAMAGE, OR COST ANY MAY INCUR AS THE RESULT OF ANY SUCH
            CLAIM.
          </li>
          <li>
            IT IS HEREBY AGREED THAT: in the event of a dispute between the
            undersigned (or another person acting on the undersigned’s behalf)
            and Indy Boxing LLC, the exclusive venue and jurisdiction for any
            lawsuit arising out of such dispute shall be in the State of
            Indiana, under Indiana law, unless federal jurisdiction applies.
          </li>
          <li>
            GOVERNING LAW: The undersigned understands and agrees that this
            document is intended to be as broad and inclusive as permitted under
            applicable law and shall be governed by Indiana law.
          </li>
          <li>
            SEVERABILITY: If any provision of this document is determined to be
            invalid for any reason, such invalidity shall not affect the
            validity of any other provisions, which provisions shall remain in
            full force and effect as if this document had been executed with the
            invalid provision omitted.
          </li>
        </ol>

        <form class="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div class="flex items-start gap-4">
            <input
              name="accept-release"
              class="checkbox checkbox-success"
              type="checkbox"
              required
            ></input>
            <label for="accept-release">
              I have read the above release and am fully familiar with the
              content thereof. In consideration for my participation in Indy
              Boxing LLC's activities and/or sparring, I hereby agree that this
              release shall be binding upon me, my heirs, legal representatives,
              and assigns.
            </label>
          </div>

          <div class="flex items-start gap-4">
            <input
              name="accept-terms-and-privacy"
              class="checkbox checkbox-success"
              type="checkbox"
              required
            ></input>
            <label for="accept-terms-and-privacy">
              I agree to the{" "}
              <a href="/termsconditions" class="link">
                terms and conditions
              </a>
              , and the{" "}
              <a href="/privacypolicy" class="link">
                privacy policy.
              </a>
            </label>
          </div>
          <Show when={error()}>
            <p class="text-error">{error()}</p>
          </Show>
          <button
            type="submit"
            class="btn btn-primary"
            disabled={submitDisabled()}
          >
            {submitDisabled() ? (
              <span class="loading loading-spinner loading-md"></span>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}

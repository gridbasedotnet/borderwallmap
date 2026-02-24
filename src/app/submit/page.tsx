import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

const EMAIL = "hello@nobigbendwall.com";
const SUBJECT = encodeURIComponent("Video Submission – Big Bend Impact Map");
const BODY = encodeURIComponent(`Hi,

I'd like to submit video footage for the Big Bend Impact Map.

Full name:
How I'd like to be credited (attribution):

I have read and agree to the Content License & Release below.

Description of footage:


[Please attach or link your video file(s)]
`);

export const metadata = {
  title: "Submit Video | See the Impact",
  description:
    "Submit your Big Bend field footage via email. Submissions are reviewed and may be GPS-tagged and added to the impact map.",
};

export default function SubmitPage() {
  return (
    <main className="min-h-screen bg-[#0d0b09] py-12 px-4">
      <div className="max-w-xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-taupe-400 hover:text-white active:text-white transition-colors text-sm mb-6 min-h-[44px]"
        >
          <ArrowLeft size={16} />
          Back to map
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Submit Your Footage
        </h1>
        <p className="text-taupe-400 text-sm leading-relaxed mb-8">
          If you have recorded video in or around Big Bend, we would love to see
          it. Email us your footage and our team will review it. If selected,
          your video will be GPS-tagged and added to the impact map.
        </p>

        <div className="glass glass-glow rounded-2xl p-6 md:p-8 space-y-6">
          {/* Instructions */}
          <div className="space-y-3">
            <h2 className="text-white text-lg font-semibold">
              How to submit
            </h2>
            <p className="text-taupe-300 text-sm leading-relaxed">
              Send an email to{" "}
              <span className="text-canyon-400 font-medium">{EMAIL}</span>{" "}
              with the following:
            </p>
            <ul className="text-taupe-300 text-sm space-y-2 list-disc list-inside">
              <li>Your <span className="text-white">full name</span></li>
              <li>
                How you&apos;d like to be{" "}
                <span className="text-white">credited</span> (attribution)
              </li>
              <li>
                Your <span className="text-white">video file(s)</span> as
                attachments or a link (Google Drive, Dropbox, etc.)
              </li>
              <li>
                A statement that you{" "}
                <span className="text-white">
                  agree to the Content License &amp; Release
                </span>{" "}
                below
              </li>
            </ul>
          </div>

          {/* Email CTA */}
          <a
            href={`mailto:${EMAIL}?subject=${SUBJECT}&body=${BODY}`}
            className="w-full py-3.5 min-h-[48px] glass glass-glow-canyon bg-canyon-600/25 hover:bg-canyon-600/35 active:bg-canyon-600/35 text-white rounded-xl transition-all text-sm font-medium flex items-center justify-center gap-2"
          >
            <Mail size={16} />
            Email Us Your Video
          </a>

          {/* Legal Disclaimer */}
          <div className="border-t border-white/[0.07] pt-5">
            <h3 className="text-taupe-300 text-xs font-semibold uppercase tracking-wider mb-3">
              Content License &amp; Release
            </h3>
            <div className="text-taupe-500 text-xs leading-relaxed space-y-2">
              <p>
                By submitting video footage, photographs, audio recordings, or
                any other content (&quot;Submitted Content&quot;) to No Big Bend
                Wall / nobigbendwall.com (&quot;We,&quot; &quot;Us,&quot; or
                &quot;Our&quot;), you (&quot;Submitter&quot;) agree to the
                following terms:
              </p>
              <p>
                <span className="text-taupe-400 font-medium">
                  1. Grant of License.
                </span>{" "}
                You hereby grant Us a perpetual, irrevocable, worldwide,
                royalty-free, fully paid-up, transferable, sublicensable
                (through multiple tiers), non-exclusive license to use,
                reproduce, modify, adapt, publish, translate, create derivative
                works from, distribute, publicly display, publicly perform,
                digitally transmit, broadcast, and otherwise exploit the
                Submitted Content, in whole or in part, in any form, format,
                media, or technology now known or hereafter developed, for any
                purpose whatsoever, including but not limited to editorial,
                educational, advocacy, commercial, promotional, and
                fundraising purposes, without any obligation of attribution,
                compensation, notice, or accounting to You.
              </p>
              <p>
                <span className="text-taupe-400 font-medium">
                  2. Representations &amp; Warranties.
                </span>{" "}
                You represent and warrant that: (a) You are the sole owner of
                the Submitted Content or have obtained all necessary rights,
                licenses, consents, and permissions to grant the license above;
                (b) the Submitted Content does not infringe, misappropriate, or
                violate any third party&apos;s intellectual property rights,
                privacy rights, publicity rights, or any other legal rights;
                (c) You have obtained the consent of any identifiable
                individuals appearing in the Submitted Content; and (d) You are
                at least 18 years of age or have obtained parental or guardian
                consent to submit the content.
              </p>
              <p>
                <span className="text-taupe-400 font-medium">
                  3. No Obligation.
                </span>{" "}
                We are under no obligation to use, publish, display, or
                otherwise exploit any Submitted Content. We reserve the right
                to remove, edit, or refuse any Submitted Content at Our sole
                discretion and for any reason.
              </p>
              <p>
                <span className="text-taupe-400 font-medium">
                  4. No Compensation.
                </span>{" "}
                You acknowledge and agree that no compensation of any kind,
                whether monetary or otherwise, is or will be due to You for the
                Submitted Content or for any use thereof by Us or Our
                licensees, assigns, or successors.
              </p>
              <p>
                <span className="text-taupe-400 font-medium">
                  5. Waiver of Moral Rights.
                </span>{" "}
                To the fullest extent permitted by applicable law, You
                irrevocably waive and agree not to assert any moral rights,
                rights of paternity, rights of integrity, or any other similar
                rights (collectively, &quot;Moral Rights&quot;) You may have in
                or to the Submitted Content.
              </p>
              <p>
                <span className="text-taupe-400 font-medium">
                  6. Indemnification.
                </span>{" "}
                You agree to indemnify, defend, and hold harmless Us, Our
                officers, directors, employees, agents, affiliates, successors,
                and assigns from and against any and all claims, damages,
                losses, liabilities, costs, and expenses (including reasonable
                attorneys&apos; fees) arising out of or related to: (a) Your
                breach of any representation, warranty, or obligation under
                this agreement; or (b) Our use of the Submitted Content as
                permitted herein.
              </p>
              <p>
                <span className="text-taupe-400 font-medium">
                  7. Governing Law.
                </span>{" "}
                This agreement shall be governed by and construed in accordance
                with the laws of the United States and the State of Texas,
                without regard to conflict-of-law principles.
              </p>
              <p>
                By sending Your submission, You confirm that You have read,
                understood, and agree to be bound by all of the above terms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

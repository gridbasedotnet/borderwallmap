import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy | No Big Bend Wall",
  description:
    "Privacy policy and content license for nobigbendwall.com, including terms for video submissions.",
};

export default function PrivacyPage() {
  return (
    <>
      <main className="min-h-screen bg-[#0d0b09] py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-taupe-400 hover:text-white active:text-white transition-colors text-sm mb-6 min-h-[44px]"
          >
            <ArrowLeft size={16} />
            Back to map
          </Link>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Privacy Policy
          </h1>
          <p className="text-taupe-500 text-xs mb-8">
            Last updated: February 24, 2026
          </p>

          <div className="text-taupe-300 text-sm leading-relaxed space-y-6">
            {/* Privacy Policy */}
            <section className="space-y-3">
              <h2 className="text-white text-lg font-semibold">
                Information We Collect
              </h2>
              <p>
                No Big Bend Wall / nobigbendwall.com (&quot;We,&quot;
                &quot;Us,&quot; or &quot;Our&quot;) collects only the
                information you voluntarily provide when submitting video
                footage or contacting us, which may include your name, email
                address, and any content you send.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-white text-lg font-semibold">
                How We Use Your Information
              </h2>
              <p>
                We use the information you provide solely to review and
                potentially publish submitted footage on Our interactive impact
                map, to communicate with you about your submission, and to
                attribute content as you direct. We do not sell, rent, or share
                your personal information with third parties for marketing
                purposes.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-white text-lg font-semibold">
                Cookies &amp; Analytics
              </h2>
              <p>
                This site may use basic analytics to understand aggregate
                visitor traffic. We do not use advertising cookies or
                third-party tracking pixels.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-white text-lg font-semibold">
                Data Retention
              </h2>
              <p>
                We retain personal information only as long as reasonably
                necessary to fulfill the purposes for which it was collected,
                including to satisfy any legal or reporting requirements. You
                may request deletion of your personal information at any time by
                emailing{" "}
                <a
                  href="mailto:hello@nobigbendwall.com"
                  className="text-canyon-400 hover:underline"
                >
                  hello@nobigbendwall.com
                </a>
                .
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-white text-lg font-semibold">
                Third-Party Services
              </h2>
              <p>
                This site may use third-party services for hosting, mapping, and
                video delivery. These providers may process data in accordance
                with their own privacy policies. We encourage you to review
                those policies independently.
              </p>
            </section>

            {/* Content License & Release */}
            <div className="border-t border-white/[0.07] pt-6">
              <h2 className="text-white text-lg font-semibold mb-4">
                Content License &amp; Release
              </h2>
              <p className="mb-4">
                By submitting video footage, photographs, audio recordings, or
                any other content (&quot;Submitted Content&quot;) to Us, you
                (&quot;Submitter&quot;) agree to the following terms:
              </p>

              <div className="space-y-3">
                <p>
                  <span className="text-white font-medium">
                    1. Grant of License.
                  </span>{" "}
                  You hereby grant Us a perpetual, irrevocable, worldwide,
                  royalty-free, fully paid-up, transferable, sublicensable
                  (through multiple tiers), non-exclusive license to use,
                  reproduce, modify, adapt, publish, translate, create
                  derivative works from, distribute, publicly display, publicly
                  perform, digitally transmit, broadcast, and otherwise exploit
                  the Submitted Content, in whole or in part, in any form,
                  format, media, or technology now known or hereafter developed,
                  for any purpose whatsoever, including but not limited to
                  editorial, educational, advocacy, commercial, promotional, and
                  fundraising purposes, without any obligation of attribution,
                  compensation, notice, or accounting to You.
                </p>
                <p>
                  <span className="text-white font-medium">
                    2. Representations &amp; Warranties.
                  </span>{" "}
                  You represent and warrant that: (a) You are the sole owner of
                  the Submitted Content or have obtained all necessary rights,
                  licenses, consents, and permissions to grant the license
                  above; (b) the Submitted Content does not infringe,
                  misappropriate, or violate any third party&apos;s intellectual
                  property rights, privacy rights, publicity rights, or any
                  other legal rights; (c) You have obtained the consent of any
                  identifiable individuals appearing in the Submitted Content;
                  and (d) You are at least 18 years of age or have obtained
                  parental or guardian consent to submit the content.
                </p>
                <p>
                  <span className="text-white font-medium">
                    3. No Obligation.
                  </span>{" "}
                  We are under no obligation to use, publish, display, or
                  otherwise exploit any Submitted Content. We reserve the right
                  to remove, edit, or refuse any Submitted Content at Our sole
                  discretion and for any reason.
                </p>
                <p>
                  <span className="text-white font-medium">
                    4. No Compensation.
                  </span>{" "}
                  You acknowledge and agree that no compensation of any kind,
                  whether monetary or otherwise, is or will be due to You for
                  the Submitted Content or for any use thereof by Us or Our
                  licensees, assigns, or successors.
                </p>
                <p>
                  <span className="text-white font-medium">
                    5. Waiver of Moral Rights.
                  </span>{" "}
                  To the fullest extent permitted by applicable law, You
                  irrevocably waive and agree not to assert any moral rights,
                  rights of paternity, rights of integrity, or any other similar
                  rights (collectively, &quot;Moral Rights&quot;) You may have
                  in or to the Submitted Content.
                </p>
                <p>
                  <span className="text-white font-medium">
                    6. Indemnification.
                  </span>{" "}
                  You agree to indemnify, defend, and hold harmless Us, Our
                  officers, directors, employees, agents, affiliates,
                  successors, and assigns from and against any and all claims,
                  damages, losses, liabilities, costs, and expenses (including
                  reasonable attorneys&apos; fees) arising out of or related to:
                  (a) Your breach of any representation, warranty, or obligation
                  under this agreement; or (b) Our use of the Submitted Content
                  as permitted herein.
                </p>
                <p>
                  <span className="text-white font-medium">
                    7. Governing Law.
                  </span>{" "}
                  This agreement shall be governed by and construed in
                  accordance with the laws of the United States and the State of
                  Texas, without regard to conflict-of-law principles.
                </p>
                <p className="text-taupe-400 italic">
                  By sending Your submission, You confirm that You have read,
                  understood, and agree to be bound by all of the above terms.
                </p>
              </div>
            </div>

            {/* Contact */}
            <section className="space-y-3 border-t border-white/[0.07] pt-6">
              <h2 className="text-white text-lg font-semibold">Contact</h2>
              <p>
                For questions about this Privacy Policy or to request data
                deletion, contact us at{" "}
                <a
                  href="mailto:hello@nobigbendwall.com"
                  className="text-canyon-400 hover:underline"
                >
                  hello@nobigbendwall.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

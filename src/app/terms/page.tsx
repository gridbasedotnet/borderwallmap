import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms of Service | No Big Bend Wall",
  description:
    "Terms of service for nobigbendwall.com.",
};

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-taupe-500 text-xs mb-8">
            Last updated: February 24, 2026
          </p>

          <div className="text-taupe-300 text-sm leading-relaxed space-y-6">
            <section className="space-y-3">
              <h2 className="text-white text-lg font-semibold">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using the website located at nobigbendwall.com
                (the &quot;Site&quot;), operated by No Big Bend Wall
                (&quot;We,&quot; &quot;Us,&quot; or &quot;Our&quot;), you
                (&quot;You&quot; or &quot;User&quot;) agree to be bound by these
                Terms of Service (&quot;Terms&quot;). If you do not agree to
                these Terms, you may not access or use the Site.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-white text-lg font-semibold">
                2. Description of the Site
              </h2>
              <p>
                The Site provides an interactive map displaying GPS-tagged video
                footage from Big Bend National Park and the surrounding region.
                The Site is provided for educational, informational, and
                advocacy purposes.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-white text-lg font-semibold">
                3. Use of the Site
              </h2>
              <p>
                You agree to use the Site only for lawful purposes and in
                accordance with these Terms. You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-taupe-400">
                <li>
                  Use the Site in any way that violates any applicable federal,
                  state, local, or international law or regulation
                </li>
                <li>
                  Attempt to gain unauthorized access to, interfere with,
                  damage, or disrupt any parts of the Site or any server,
                  computer, or database connected to the Site
                </li>
                <li>
                  Use any robot, spider, scraper, or other automated means to
                  access the Site for any purpose without Our express written
                  permission
                </li>
                <li>
                  Introduce any viruses, trojan horses, worms, or other
                  material that is malicious or technologically harmful
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-white text-lg font-semibold">
                4. Intellectual Property
              </h2>
              <p>
                All content on the Site, including but not limited to text,
                graphics, logos, images, video, audio, data compilations, and
                software, is the property of No Big Bend Wall or its content
                suppliers and is protected by United States and international
                copyright, trademark, and other intellectual property laws. You
                may not reproduce, distribute, modify, create derivative works
                of, publicly display, publicly perform, republish, download,
                store, or transmit any of the material on the Site without Our
                prior written consent, except as permitted by fair use under
                applicable law.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-white text-lg font-semibold">
                5. User Submissions
              </h2>
              <p>
                If you submit content to Us (including video footage,
                photographs, or other media), such submissions are governed by
                the Content License &amp; Release set forth in Our{" "}
                <Link href="/privacy" className="text-canyon-400 hover:underline">
                  Privacy Policy
                </Link>
                . By submitting content, you acknowledge that you have read and
                agree to those terms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-white text-lg font-semibold">
                6. Disclaimer of Warranties
              </h2>
              <p>
                THE SITE AND ALL CONTENT, MATERIALS, AND SERVICES PROVIDED ON
                OR THROUGH THE SITE ARE PROVIDED ON AN &quot;AS IS&quot; AND
                &quot;AS AVAILABLE&quot; BASIS, WITHOUT WARRANTIES OF ANY KIND,
                EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY
                LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING
                BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND
                NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SITE WILL BE
                UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE OF VIRUSES OR OTHER
                HARMFUL COMPONENTS.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-white text-lg font-semibold">
                7. Limitation of Liability
              </h2>
              <p>
                TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT
                SHALL NO BIG BEND WALL, ITS OFFICERS, DIRECTORS, EMPLOYEES,
                AGENTS, AFFILIATES, SUCCESSORS, OR ASSIGNS BE LIABLE FOR ANY
                INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
                DAMAGES, OR ANY LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER
                INTANGIBLE LOSSES, ARISING OUT OF OR RELATED TO YOUR ACCESS TO
                OR USE OF (OR INABILITY TO ACCESS OR USE) THE SITE, WHETHER
                BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE),
                STATUTE, OR ANY OTHER LEGAL THEORY, EVEN IF WE HAVE BEEN
                ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR TOTAL
                AGGREGATE LIABILITY FOR ALL CLAIMS ARISING OUT OF OR RELATED TO
                THE SITE SHALL NOT EXCEED ONE HUNDRED DOLLARS ($100.00).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-white text-lg font-semibold">
                8. Indemnification
              </h2>
              <p>
                You agree to indemnify, defend, and hold harmless No Big Bend
                Wall, its officers, directors, employees, agents, affiliates,
                successors, and assigns from and against any and all claims,
                damages, losses, liabilities, costs, and expenses (including
                reasonable attorneys&apos; fees) arising out of or related to
                Your use of the Site or Your violation of these Terms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-white text-lg font-semibold">
                9. Third-Party Links
              </h2>
              <p>
                The Site may contain links to third-party websites or services
                that are not owned or controlled by Us. We have no control over,
                and assume no responsibility for, the content, privacy
                policies, or practices of any third-party websites or services.
                You acknowledge and agree that We shall not be responsible or
                liable for any damage or loss caused by or in connection with
                the use of any such third-party content, goods, or services.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-white text-lg font-semibold">
                10. Modifications to Terms
              </h2>
              <p>
                We reserve the right to modify these Terms at any time. Changes
                will be effective immediately upon posting the revised Terms on
                the Site. Your continued use of the Site after any such changes
                constitutes Your acceptance of the new Terms. It is Your
                responsibility to review these Terms periodically.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-white text-lg font-semibold">
                11. Termination
              </h2>
              <p>
                We may terminate or suspend Your access to the Site immediately,
                without prior notice or liability, for any reason, including
                without limitation if You breach these Terms. Upon termination,
                Your right to use the Site will cease immediately.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-white text-lg font-semibold">
                12. Governing Law &amp; Jurisdiction
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance
                with the laws of the State of Texas, United States, without
                regard to its conflict-of-law provisions. Any legal action or
                proceeding arising under these Terms shall be brought
                exclusively in the federal or state courts located in Texas, and
                You consent to the personal jurisdiction and venue of such
                courts.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-white text-lg font-semibold">
                13. Severability
              </h2>
              <p>
                If any provision of these Terms is held to be invalid, illegal,
                or unenforceable, the remaining provisions shall continue in
                full force and effect.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-white text-lg font-semibold">
                14. Entire Agreement
              </h2>
              <p>
                These Terms, together with the{" "}
                <Link href="/privacy" className="text-canyon-400 hover:underline">
                  Privacy Policy
                </Link>
                , constitute the entire agreement between You and No Big Bend
                Wall with respect to Your use of the Site and supersede all
                prior or contemporaneous communications, proposals, and
                agreements, whether oral or written.
              </p>
            </section>

            {/* Contact */}
            <section className="space-y-3 border-t border-white/[0.07] pt-6">
              <h2 className="text-white text-lg font-semibold">Contact</h2>
              <p>
                For questions about these Terms, contact us at{" "}
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

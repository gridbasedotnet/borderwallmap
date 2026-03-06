import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";

const EMAIL = "hello@defendbigbend.com";
const SUBJECT = encodeURIComponent("Video Submission – Big Bend Impact Map");
const BODY = encodeURIComponent(`Hi,

I'd like to submit video footage for the Big Bend Impact Map.

Full name:
How I'd like to be credited (attribution):

I have read and agree to the Content License & Release at defendbigbend.com/privacy.

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
    <>
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
            If you have recorded video in or around Big Bend, we would love to
            see it. Email us your footage and our team will review it. If
            selected, your video will be GPS-tagged and added to the impact map.
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
                <li>
                  Your <span className="text-white">full name</span>
                </li>
                <li>
                  How you&apos;d like to be{" "}
                  <span className="text-white">credited</span> (attribution)
                </li>
                <li>
                  Your <span className="text-white">video file(s)</span> as
                  attachments or a link (Google Drive, Dropbox, etc.)
                </li>
                <li>
                  A statement that you agree to the{" "}
                  <Link
                    href="/privacy"
                    className="text-canyon-400 hover:underline"
                  >
                    Content License &amp; Release
                  </Link>
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

            <p className="text-taupe-500 text-xs text-center">
              By submitting, you agree to our{" "}
              <Link
                href="/privacy"
                className="text-taupe-400 hover:underline"
              >
                Content License &amp; Release
              </Link>{" "}
              and{" "}
              <Link
                href="/terms"
                className="text-taupe-400 hover:underline"
              >
                Terms of Service
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

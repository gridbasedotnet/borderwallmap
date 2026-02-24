import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SubmitVideoForm from "@/components/SubmitVideoForm";

export const metadata = {
  title: "Submit Video | See the Impact",
  description:
    "Upload your Big Bend field footage. Submissions are reviewed and may be GPS-tagged and added to the impact map.",
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

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Submit Your Footage</h1>
        <p className="text-taupe-400 text-sm leading-relaxed mb-8">
          If you have recorded video in or around Big Bend, we would love
          to see it. Upload your footage below and our team will review it.
          If selected, your video will be GPS tagged and added to the map.
          We may also reach out with follow-up questions, so a valid email
          is required.
        </p>

        <div className="bg-taupe-950 border border-taupe-900 rounded-xl p-6 md:p-8">
          <SubmitVideoForm />
        </div>

        <p className="text-taupe-600 text-xs mt-6 text-center">
          Accepted formats: MOV, MP4, and other common video formats. Max file
          size: 5 GB. Your email will only be used to contact you about your
          submission.
        </p>
      </div>
    </main>
  );
}

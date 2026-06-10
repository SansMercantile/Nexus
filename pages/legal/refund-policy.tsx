import { motion } from 'framer-motion';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { fadeInUp } from '@/lib/animations';

export default function RefundPolicyPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold text-white mb-6">Refund &amp; Dispute Policy</h1>
            <p className="text-xl text-nexus-gray-300">
              Our commitment to fair resolution — understand your rights regarding refunds, cancellations, and disputes.
            </p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-r from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-xl p-8"
          >
            <div className="prose prose-invert max-w-none">
              {/* ── Effective Date ────────────────────────── */}
              <p className="text-nexus-gray-400 text-sm mb-8">
                Effective Date: June 10, 2026 &nbsp;|&nbsp; Last Updated: June 10, 2026
              </p>

              {/* ── 1. Overview ──────────────────────────── */}
              <h2 className="text-2xl font-bold text-white mb-4">1. Overview</h2>
              <p className="text-nexus-gray-300 mb-6">
                Sans Mercantile Constellation (&quot;we,&quot; &quot;us,&quot; or &quot;the Company&quot;) is committed to customer satisfaction. This Refund &amp; Dispute Policy outlines the conditions under which refunds may be issued, how to request a refund, and the process for resolving disputes related to our products and services.
              </p>

              {/* ── 2. Eligibility for Refunds ───────────── */}
              <h2 className="text-2xl font-bold text-white mb-4">2. Eligibility for Refunds</h2>
              <p className="text-nexus-gray-300 mb-3">
                You may be eligible for a full or partial refund under the following circumstances:
              </p>
              <ul className="list-disc list-inside text-nexus-gray-300 mb-6 space-y-2 pl-2">
                <li><span className="font-semibold text-white">Service not delivered:</span> If a purchased service or feature was not provisioned within the stated timeframe.</li>
                <li><span className="font-semibold text-white">Billing error:</span> If you were charged an incorrect amount or charged for a service you did not authorize.</li>
                <li><span className="font-semibold text-white">Duplicate charges:</span> If a payment was processed more than once for the same transaction.</li>
                <li><span className="font-semibold text-white">Early cancellation (pro-rated):</span> If you cancel an active subscription within the first 14 days, you are entitled to a pro-rated refund for the unused portion of the billing period.</li>
                <li><span className="font-semibold text-white">Material defect:</span> If the service fails to perform substantially as described in its official documentation.</li>
              </ul>

              {/* ── 3. Non-Refundable Items ──────────────── */}
              <h2 className="text-2xl font-bold text-white mb-4">3. Non-Refundable Items</h2>
              <p className="text-nexus-gray-300 mb-3">
                The following are generally <span className="font-semibold text-white">not eligible</span> for a refund:
              </p>
              <ul className="list-disc list-inside text-nexus-gray-300 mb-6 space-y-2 pl-2">
                <li>One-time setup, onboarding, or professional-services fees once work has commenced.</li>
                <li>Subscription fees for billing periods that have already elapsed (beyond the 14-day window).</li>
                <li>Services consumed or fully delivered (e.g., completed consulting engagements, API usage already metered).</li>
                <li>Third-party integrations or licenses purchased through our platform where the vendor does not permit refunds.</li>
                <li>Accounts terminated due to violation of our Terms of Service.</li>
              </ul>

              {/* ── 4. How to Request a Refund ───────────── */}
              <h2 className="text-2xl font-bold text-white mb-4">4. How to Request a Refund</h2>
              <p className="text-nexus-gray-300 mb-3">
                To request a refund, please follow these steps:
              </p>
              <ol className="list-decimal list-inside text-nexus-gray-300 mb-6 space-y-2 pl-2">
                <li><span className="font-semibold text-white">Submit a request</span> — Email <a href="mailto:billing@sansmercantile.com" className="text-nexus-gold hover:underline">billing@sansmercantile.com</a> or use the &quot;Request Refund&quot; option in your account dashboard under <span className="italic">Billing → Support</span>.</li>
                <li><span className="font-semibold text-white">Include details</span> — Provide your account ID, the transaction or invoice number, the amount in question, and a brief description of why you are requesting a refund.</li>
                <li><span className="font-semibold text-white">Acknowledgment</span> — You will receive an acknowledgment within <span className="font-semibold text-white">2 business days</span>.</li>
                <li><span className="font-semibold text-white">Review period</span> — Our billing team will review the request and issue a decision within <span className="font-semibold text-white">10 business days</span>.</li>
              </ol>

              {/* ── 5. Refund Processing ─────────────────── */}
              <h2 className="text-2xl font-bold text-white mb-4">5. Refund Processing</h2>
              <p className="text-nexus-gray-300 mb-6">
                Approved refunds will be credited to the original payment method within <span className="font-semibold text-white">5–10 business days</span> after approval. If the original payment method is no longer available, we will work with you to arrange an alternative credit. Refunds for credit card payments may take an additional 1–2 billing cycles to appear on your statement, depending on your card issuer.
              </p>

              {/* ── 6. Subscription Cancellations ────────── */}
              <h2 className="text-2xl font-bold text-white mb-4">6. Subscription Cancellations</h2>
              <p className="text-nexus-gray-300 mb-6">
                You may cancel your subscription at any time from your account dashboard. Upon cancellation:
              </p>
              <ul className="list-disc list-inside text-nexus-gray-300 mb-6 space-y-2 pl-2">
                <li>Your access will continue until the end of the current billing period.</li>
                <li>No further charges will be applied after cancellation.</li>
                <li>Cancellations made within the first <span className="font-semibold text-white">14 days</span> of a new subscription or renewal are eligible for a pro-rated refund (see Section 2).</li>
                <li>After 14 days, the current billing period is non-refundable but the subscription will not renew.</li>
              </ul>

              {/* ── 7. Dispute Resolution ────────────────── */}
              <h2 className="text-2xl font-bold text-white mb-4">7. Dispute Resolution</h2>
              <p className="text-nexus-gray-300 mb-3">
                If you disagree with a refund decision or have a billing dispute, we encourage resolution through the following escalation process:
              </p>
              <div className="bg-[#141833] border border-nexus-gold/10 rounded-lg p-6 mb-6 space-y-4">
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-nexus-gold/20 text-nexus-gold font-bold text-sm">1</span>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Informal Resolution</h4>
                    <p className="text-nexus-gray-300 text-sm">Contact our support team at <a href="mailto:support@sansmercantile.com" className="text-nexus-gold hover:underline">support@sansmercantile.com</a>. Most disputes are resolved at this stage within 5 business days.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-nexus-gold/20 text-nexus-gold font-bold text-sm">2</span>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Formal Escalation</h4>
                    <p className="text-nexus-gray-300 text-sm">If unresolved, submit a written dispute to <a href="mailto:legal@sansmercantile.com" className="text-nexus-gold hover:underline">legal@sansmercantile.com</a> with supporting documentation. Our legal team will respond within 15 business days with a written determination.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-nexus-gold/20 text-nexus-gold font-bold text-sm">3</span>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Mediation &amp; Arbitration</h4>
                    <p className="text-nexus-gray-300 text-sm">If the dispute remains unresolved, either party may initiate binding arbitration in accordance with the rules of the American Arbitration Association (AAA). Arbitration will take place in the jurisdiction specified in our Terms of Service. Each party bears its own costs unless the arbitrator determines otherwise.</p>
                  </div>
                </div>
              </div>

              {/* ── 8. Chargebacks ────────────────────────── */}
              <h2 className="text-2xl font-bold text-white mb-4">8. Chargebacks</h2>
              <p className="text-nexus-gray-300 mb-6">
                We strongly encourage you to contact us before filing a chargeback with your bank or credit card provider. Filing a chargeback without first attempting resolution with us may result in temporary suspension of your account while the dispute is investigated. We will cooperate fully with any chargeback inquiry and provide relevant transaction records.
              </p>

              {/* ── 9. Exceptions & Special Circumstances ── */}
              <h2 className="text-2xl font-bold text-white mb-4">9. Exceptions &amp; Special Circumstances</h2>
              <p className="text-nexus-gray-300 mb-6">
                We reserve the right to grant refunds outside the scope of this policy on a case-by-case basis (e.g., extended service outages, force majeure events, or significant platform failures). Such exceptions are at the sole discretion of Sans Mercantile Constellation management and do not set precedent for future requests.
              </p>

              {/* ── 10. Changes to This Policy ────────────── */}
              <h2 className="text-2xl font-bold text-white mb-4">10. Changes to This Policy</h2>
              <p className="text-nexus-gray-300 mb-6">
                We may update this Refund &amp; Dispute Policy from time to time. Any changes will be posted on this page with an updated &quot;Last Updated&quot; date. Continued use of our services after changes are posted constitutes acceptance of the revised policy. For material changes, we will notify active subscribers via email at least 30 days in advance.
              </p>

              {/* ── 11. Contact Information ──────────────── */}
              <h2 className="text-2xl font-bold text-white mb-4">11. Contact Information</h2>
              <p className="text-nexus-gray-300">
                If you have any questions about this Refund &amp; Dispute Policy, please contact us:
              </p>
              <ul className="list-none text-nexus-gray-300 mt-3 space-y-1">
                <li>📧 &nbsp;<a href="mailto:billing@sansmercantile.com" className="text-nexus-gold hover:underline">billing@sansmercantile.com</a> — Refund requests &amp; billing inquiries</li>
                <li>📧 &nbsp;<a href="mailto:legal@sansmercantile.com" className="text-nexus-gold hover:underline">legal@sansmercantile.com</a> — Formal disputes &amp; escalations</li>
                <li>📧 &nbsp;<a href="mailto:support@sansmercantile.com" className="text-nexus-gold hover:underline">support@sansmercantile.com</a> — General support</li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-12"
          >
            <Link
              href="/legal"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border border-nexus-gold text-nexus-gold hover:bg-nexus-gold/10 transition-colors"
            >
              Back to Legal
            </Link>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

import Head from "next/head";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import Footer from "@/components/layout/Footer";

export default function TermsAndConditions({ lastUpdated }) {
  return (
    <>
      <Head>
        <title>Terms & Conditions - SocialLens</title>
        <meta
          name="description"
          content="Read SocialLens Terms and Conditions. Understand the rules and guidelines for using our social media platform."
        />
      </Head>

      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileTextOutlined className="text-4xl text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Terms & Conditions
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Last updated: {lastUpdated}
              </p>
            </div>

            {/* Terms Content */}
            <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
              {/* Introduction */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  1. Introduction
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Welcome to SocialLens. These Terms and Conditions ("Terms")
                  govern your use of our website and services. By accessing or
                  using SocialLens, you agree to be bound by these Terms and our
                  Privacy Policy.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  If you do not agree to these Terms, please do not use our
                  services. We reserve the right to modify these Terms at any
                  time, and such modifications will be effective immediately
                  upon posting.
                </p>
              </section>

              {/* Definitions */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  2. Definitions
                </h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      "Service"
                    </h3>
                    <p className="text-gray-700">
                      Refers to the SocialLens website and mobile application.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">"User"</h3>
                    <p className="text-gray-700">
                      Refers to any individual who accesses or uses our Service.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      "Content"
                    </h3>
                    <p className="text-gray-700">
                      Refers to any text, images, videos, or other materials
                      posted on our platform.
                    </p>
                  </div>
                </div>
              </section>

              {/* Account Registration */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  3. Account Registration
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    To use certain features of our Service, you must create an
                    account. You agree to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>
                      Provide accurate, current, and complete information during
                      registration
                    </li>
                    <li>
                      Maintain and update your account information to keep it
                      accurate and current
                    </li>
                    <li>Keep your password secure and confidential</li>
                    <li>
                      Accept responsibility for all activities that occur under
                      your account
                    </li>
                    <li>
                      Notify us immediately of any unauthorized use of your
                      account
                    </li>
                  </ul>
                </div>
              </section>

              {/* Acceptable Use */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  4. Acceptable Use Policy
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    You agree not to use our Service to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>
                      Post content that is illegal, harmful, threatening,
                      abusive, or defamatory
                    </li>
                    <li>Harass, bully, or intimidate other users</li>
                    <li>Impersonate another person or entity</li>
                    <li>
                      Share personal information of others without their consent
                    </li>
                    <li>Upload viruses, malware, or other harmful code</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>
                      Use automated tools to scrape or collect data from our
                      platform
                    </li>
                    <li>Violate any applicable laws or regulations</li>
                  </ul>
                </div>
              </section>

              {/* Content Ownership */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  5. Content Ownership and License
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    You retain ownership of the content you post on SocialLens.
                    However, by posting content, you grant us a worldwide,
                    non-exclusive, royalty-free license to use, reproduce,
                    modify, and distribute your content in connection with our
                    Service.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    You represent and warrant that you have all necessary rights
                    to grant this license and that your content does not
                    infringe on the rights of any third party.
                  </p>
                </div>
              </section>

              {/* Privacy */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  6. Privacy
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Your privacy is important to us. Please review our Privacy
                  Policy, which also governs your use of the Service, to
                  understand our practices regarding the collection and use of
                  your personal information.
                </p>
              </section>

              {/* Intellectual Property */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  7. Intellectual Property Rights
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    The Service and its original content, features, and
                    functionality are owned by SocialLens and are protected by
                    international copyright, trademark, patent, trade secret,
                    and other intellectual property laws.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    You may not copy, modify, distribute, sell, or lease any
                    part of our Service without our prior written consent.
                  </p>
                </div>
              </section>

              {/* Termination */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  8. Account Termination
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    We may terminate or suspend your account immediately,
                    without prior notice, for conduct that we believe violates
                    these Terms or is harmful to other users, us, or third
                    parties.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    You may terminate your account at any time by deleting it
                    through your account settings. Upon termination, your right
                    to use the Service will cease immediately.
                  </p>
                </div>
              </section>

              {/* Disclaimers */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  9. Disclaimers
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                    WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    We do not guarantee that the Service will be uninterrupted,
                    secure, or error-free, or that any defects will be
                    corrected.
                  </p>
                </div>
              </section>

              {/* Limitation of Liability */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  10. Limitation of Liability
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  IN NO EVENT SHALL SOCIALLENS BE LIABLE FOR ANY INDIRECT,
                  INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
                  INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE,
                  GOODWILL, OR OTHER INTANGIBLE LOSSES.
                </p>
              </section>

              {/* Governing Law */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  11. Governing Law
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  These Terms shall be governed by and construed in accordance
                  with the laws of [Your Jurisdiction], without regard to its
                  conflict of law provisions.
                </p>
              </section>

              {/* Changes to Terms */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  12. Changes to Terms
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to modify these Terms at any time. We
                  will notify users of any material changes by posting the new
                  Terms on this page and updating the "Last updated" date.
                </p>
              </section>

              {/* Contact Information */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  13. Contact Information
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about these Terms, please contact us
                  at:
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Email:</strong> legal@sociallens.com
                    <br />
                    <strong>Address:</strong> 123 Social Street, Tech City, TC
                    12345
                    <br />
                    <strong>Phone:</strong> +1 (555) 123-4567
                  </p>
                </div>
              </section>
            </div>

            {/* Acceptance Section */}
            <div className="mt-8 bg-green-50 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <CheckCircleOutlined className="text-3xl text-green-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Terms Acceptance
                </h2>
              </div>
              <p className="text-gray-700">
                By using SocialLens, you acknowledge that you have read,
                understood, and agree to be bound by these Terms and Conditions.
              </p>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

// SSG - Static Site Generation for Terms page
export async function getStaticProps() {
  return {
    props: {
      lastUpdated: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
    // ISR - Revalidate every month
    revalidate: 2592000,
  };
}

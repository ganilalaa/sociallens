import Head from "next/head";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

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

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <FileTextOutlined className="mr-3 text-blue-500" />
            Terms & Conditions
          </h1>
          <p className="text-gray-600">Last updated: {lastUpdated}</p>
        </div>

        {/* Introduction */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <p className="text-gray-700 leading-relaxed">
            Welcome to SocialLens. By accessing and using our platform, you
            agree to be bound by these Terms and Conditions. Please read them
            carefully before using our services.
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-8">
          {/* Acceptance of Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Acceptance of Terms
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                By accessing or using SocialLens, you agree to be bound by these
                Terms and Conditions. If you do not agree to these terms, please
                do not use our platform.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these terms at any time.
                Continued use of the platform after changes constitutes
                acceptance of the new terms.
              </p>
            </div>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. User Accounts
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircleOutlined className="text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Account Creation
                    </h3>
                    <p className="text-gray-700 text-sm">
                      You must provide accurate and complete information when
                      creating your account. You are responsible for maintaining
                      the security of your account credentials.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleOutlined className="text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Account Responsibility
                    </h3>
                    <p className="text-gray-700 text-sm">
                      You are responsible for all activities that occur under
                      your account. Notify us immediately of any unauthorized
                      use.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleOutlined className="text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Age Requirement
                    </h3>
                    <p className="text-gray-700 text-sm">
                      You must be at least 13 years old to create an account.
                      Users under 18 must have parental consent to use our
                      services.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Acceptable Use
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree to use SocialLens only for lawful purposes and in
                accordance with these terms.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-green-600 mb-3 flex items-center">
                    <CheckCircleOutlined className="mr-2" />
                    What You Can Do
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Share original content and photos</li>
                    <li>• Connect with friends and family</li>
                    <li>• Engage in respectful discussions</li>
                    <li>• Report inappropriate content</li>
                    <li>• Customize your privacy settings</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-red-600 mb-3 flex items-center">
                    <ExclamationCircleOutlined className="mr-2" />
                    What You Cannot Do
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Share harmful or illegal content</li>
                    <li>• Harass or bully other users</li>
                    <li>• Impersonate others</li>
                    <li>• Spam or send unwanted messages</li>
                    <li>• Violate intellectual property rights</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Content Guidelines */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Content Guidelines
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Your Content
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    You retain ownership of content you post, but grant us a
                    license to use, display, and distribute it on our platform.
                    You are responsible for ensuring you have the rights to
                    share any content you post.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Prohibited Content
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    We prohibit content that is illegal, harmful, threatening,
                    abusive, defamatory, obscene, or otherwise objectionable. We
                    reserve the right to remove such content and suspend or
                    terminate accounts that violate these guidelines.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Content Moderation
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    We use automated systems and human moderators to review
                    content. We may remove content that violates our guidelines
                    without prior notice.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Privacy and Data */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Privacy and Data
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Data Collection
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    We collect and process your data as described in our Privacy
                    Policy. By using our platform, you consent to such
                    processing.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Data Security
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    We implement appropriate security measures to protect your
                    data. However, no method of transmission over the internet
                    is 100% secure.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Third-Party Services
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Our platform may integrate with third-party services. These
                    services have their own privacy policies and terms of
                    service.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Intellectual Property
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Platform Rights
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    SocialLens and its original content, features, and
                    functionality are owned by us and are protected by
                    international copyright, trademark, and other intellectual
                    property laws.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    User Content License
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    By posting content, you grant us a worldwide, non-exclusive,
                    royalty-free license to use, reproduce, modify, and
                    distribute your content on our platform.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Copyright Infringement
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    If you believe your copyright has been infringed, please
                    contact us with the required information as outlined in our
                    Copyright Policy.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Termination
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Account Termination
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    You may terminate your account at any time. We may terminate
                    or suspend your account for violations of these terms.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Effect of Termination
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Upon termination, your right to use the platform ceases
                    immediately. We may retain certain information as required
                    by law or for legitimate business purposes.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Limitation of Liability
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-700 leading-relaxed">
                To the maximum extent permitted by law, SocialLens shall not be
                liable for any indirect, incidental, special, consequential, or
                punitive damages resulting from your use of the platform.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Contact Information
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms and Conditions,
                please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Email:</strong> legal@sociallens.com
                </p>
                <p>
                  <strong>Address:</strong> 123 Social Street, Tech City, TC
                  12345
                </p>
                <p>
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600">
          <p>
            By using SocialLens, you acknowledge that you have read, understood,
            and agree to be bound by these Terms and Conditions.
          </p>
        </div>
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

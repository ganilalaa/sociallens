import Head from "next/head";
import { useState } from "react";
import {
  QuestionCircleOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import Footer from "@/components/layout/Footer";

export default function FAQ({ faqs }) {
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <>
      <Head>
        <title>FAQ - SocialLens</title>
        <meta
          name="description"
          content="Frequently asked questions about SocialLens. Find answers to common questions about our social media platform."
        />
      </Head>

      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Find answers to the most common questions about SocialLens.
                Can't find what you're looking for?{" "}
                <a
                  href="/contact"
                  className="text-blue-600 hover:text-blue-700"
                >
                  Contact us
                </a>
                .
              </p>
            </div>

            {/* FAQ Categories */}
            <div className="space-y-12">
              {/* Account & Security */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <QuestionCircleOutlined className="mr-3 text-blue-500" />
                  Account & Security
                </h2>
                <div className="space-y-4">
                  {faqs.account.map((faq, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md">
                      <button
                        onClick={() => toggleItem(`account-${index}`)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold text-gray-900">
                          {faq.question}
                        </span>
                        {openItems.has(`account-${index}`) ? (
                          <UpOutlined className="text-gray-500" />
                        ) : (
                          <DownOutlined className="text-gray-500" />
                        )}
                      </button>
                      {openItems.has(`account-${index}`) && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-700 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Posts & Content */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <QuestionCircleOutlined className="mr-3 text-green-500" />
                  Posts & Content
                </h2>
                <div className="space-y-4">
                  {faqs.content.map((faq, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md">
                      <button
                        onClick={() => toggleItem(`content-${index}`)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold text-gray-900">
                          {faq.question}
                        </span>
                        {openItems.has(`content-${index}`) ? (
                          <UpOutlined className="text-gray-500" />
                        ) : (
                          <DownOutlined className="text-gray-500" />
                        )}
                      </button>
                      {openItems.has(`content-${index}`) && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-700 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy & Safety */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <QuestionCircleOutlined className="mr-3 text-purple-500" />
                  Privacy & Safety
                </h2>
                <div className="space-y-4">
                  {faqs.privacy.map((faq, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md">
                      <button
                        onClick={() => toggleItem(`privacy-${index}`)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold text-gray-900">
                          {faq.question}
                        </span>
                        {openItems.has(`privacy-${index}`) ? (
                          <UpOutlined className="text-gray-500" />
                        ) : (
                          <DownOutlined className="text-gray-500" />
                        )}
                      </button>
                      {openItems.has(`privacy-${index}`) && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-700 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Support */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <QuestionCircleOutlined className="mr-3 text-orange-500" />
                  Technical Support
                </h2>
                <div className="space-y-4">
                  {faqs.technical.map((faq, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md">
                      <button
                        onClick={() => toggleItem(`technical-${index}`)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold text-gray-900">
                          {faq.question}
                        </span>
                        {openItems.has(`technical-${index}`) ? (
                          <UpOutlined className="text-gray-500" />
                        ) : (
                          <DownOutlined className="text-gray-500" />
                        )}
                      </button>
                      {openItems.has(`technical-${index}`) && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-700 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Still have questions?
              </h3>
              <p className="text-gray-600 mb-6">
                Can't find the answer you're looking for? Our support team is
                here to help.
              </p>
              <a
                href="/contact"
                className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

// SSG - Static Site Generation for FAQ page
export async function getStaticProps() {
  const faqs = {
    account: [
      {
        question: "How do I create an account?",
        answer:
          "You can create an account by clicking the 'Sign Up' button on our homepage. You'll need to provide your email address, choose a username, and create a password. We'll send you a verification email to complete the registration process.",
      },
      {
        question: "How do I reset my password?",
        answer:
          "To reset your password, click the 'Forgot Password' link on the login page. Enter your email address, and we'll send you a link to create a new password. Make sure to check your spam folder if you don't see the email.",
      },
      {
        question: "Can I delete my account?",
        answer:
          "Yes, you can delete your account at any time. Go to your profile settings, scroll down to 'Account Management', and click 'Delete Account'. Please note that this action is permanent and cannot be undone.",
      },
      {
        question: "How do I change my profile picture?",
        answer:
          "To change your profile picture, go to your profile page and click the 'Edit Profile' button. You can then upload a new image from your device. We support JPG, PNG, and GIF formats up to 5MB.",
      },
    ],
    content: [
      {
        question: "How do I create a post?",
        answer:
          "To create a post, click the 'Create Post' button in the top navigation or on your profile page. You can add text, images, or both. Once you're satisfied with your content, click 'Post' to share it with your followers.",
      },
      {
        question: "Can I edit or delete my posts?",
        answer:
          "Yes, you can edit or delete your posts. Click the three dots menu on any of your posts to see the edit and delete options. Note that editing is only available for a limited time after posting.",
      },
      {
        question: "How do I like and comment on posts?",
        answer:
          "To like a post, click the heart icon below the post. To comment, click the comment icon and type your message in the text box that appears. You can also reply to other users' comments.",
      },
      {
        question: "What file types can I upload?",
        answer:
          "We support JPG, PNG, GIF, and MP4 files for uploads. Images can be up to 10MB, and videos can be up to 50MB. We recommend using high-quality images for the best experience.",
      },
    ],
    privacy: [
      {
        question: "Who can see my posts?",
        answer:
          "By default, your posts are visible to your followers. You can change the privacy settings for individual posts or your entire account in your profile settings. You can choose between public, followers only, or private.",
      },
      {
        question: "How do I report inappropriate content?",
        answer:
          "To report inappropriate content, click the three dots menu on any post or comment and select 'Report'. Choose the reason for your report and provide any additional details. Our team will review the content within 24 hours.",
      },
      {
        question: "Is my personal information safe?",
        answer:
          "Yes, we take your privacy seriously. We never share your personal information with third parties without your consent. All data is encrypted and stored securely. You can read our full privacy policy for more details.",
      },
      {
        question: "How do I block someone?",
        answer:
          "To block a user, go to their profile page and click the three dots menu. Select 'Block User' from the options. Blocked users won't be able to see your posts or contact you.",
      },
    ],
    technical: [
      {
        question: "The app is loading slowly. What should I do?",
        answer:
          "Try refreshing the page or clearing your browser cache. If the problem persists, check your internet connection. You can also try accessing SocialLens from a different browser or device.",
      },
      {
        question: "I can't upload images. What's wrong?",
        answer:
          "Make sure your image file is in a supported format (JPG, PNG, GIF) and under 10MB. If you're still having issues, try uploading from a different browser or check if your internet connection is stable.",
      },
      {
        question: "How do I enable notifications?",
        answer:
          "To enable notifications, go to your profile settings and click on 'Notifications'. You can choose which types of notifications you want to receive, such as new followers, likes, comments, and messages.",
      },
      {
        question: "The app isn't working on my mobile device.",
        answer:
          "Make sure you're using the latest version of your mobile browser. SocialLens works best on Chrome, Safari, and Firefox. If you're still having issues, try clearing your browser cache or restarting your device.",
      },
    ],
  };

  return {
    props: {
      faqs,
    },
    // ISR - Revalidate every week
    revalidate: 604800,
  };
}

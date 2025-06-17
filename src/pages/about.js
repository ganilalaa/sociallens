import Head from "next/head";
import {
  TeamOutlined,
  HeartOutlined,
  SafetyOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

export default function AboutUs({ stats }) {
  return (
    <>
      <Head>
        <title>About Us - SocialLens</title>
        <meta
          name="description"
          content="Learn more about SocialLens - A modern social media platform for connecting people through meaningful content."
        />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About SocialLens
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connecting people through meaningful content and authentic
            relationships. SocialLens is more than just a social media platform
            - it's a community.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Our Mission
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg text-gray-700 mb-4">
                At SocialLens, we believe in the power of authentic connections.
                Our mission is to create a platform where people can share their
                stories, connect with others, and build meaningful relationships
                in a safe and supportive environment.
              </p>
              <p className="text-lg text-gray-700">
                We're committed to fostering a community that values creativity,
                empathy, and genuine human connection over superficial metrics
                and engagement.
              </p>
            </div>
            <div className="text-center">
              <HeartOutlined className="text-6xl text-red-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Authentic Connections
              </h3>
              <p className="text-gray-600">
                Building real relationships through meaningful content
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <TeamOutlined className="text-4xl text-blue-500 mb-3" />
            <div className="text-2xl font-bold text-gray-900">
              {stats.users.toLocaleString()}
            </div>
            <div className="text-gray-600">Active Users</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <HeartOutlined className="text-4xl text-red-500 mb-3" />
            <div className="text-2xl font-bold text-gray-900">
              {stats.posts.toLocaleString()}
            </div>
            <div className="text-gray-600">Posts Shared</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <SafetyOutlined className="text-4xl text-green-500 mb-3" />
            <div className="text-2xl font-bold text-gray-900">
              {stats.connections.toLocaleString()}
            </div>
            <div className="text-gray-600">Connections Made</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <GlobalOutlined className="text-4xl text-purple-500 mb-3" />
            <div className="text-2xl font-bold text-gray-900">
              {stats.countries}
            </div>
            <div className="text-gray-600">Countries</div>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeartOutlined className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Authenticity
              </h3>
              <p className="text-gray-600">
                We encourage real, genuine content that reflects who you truly
                are.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafetyOutlined className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Safety
              </h3>
              <p className="text-gray-600">
                Your privacy and security are our top priorities.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TeamOutlined className="text-2xl text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Community
              </h3>
              <p className="text-gray-600">
                Building meaningful connections and supportive communities.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Our Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl text-gray-600">👨‍💻</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                John Doe
              </h3>
              <p className="text-blue-600 mb-2">Founder & CEO</p>
              <p className="text-gray-600 text-sm">
                Passionate about creating meaningful social experiences.
              </p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl text-gray-600">👩‍💻</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                Jane Smith
              </h3>
              <p className="text-blue-600 mb-2">CTO</p>
              <p className="text-gray-600 text-sm">
                Leading our technical vision and platform development.
              </p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl text-gray-600">👨‍🎨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                Mike Johnson
              </h3>
              <p className="text-blue-600 mb-2">Head of Design</p>
              <p className="text-gray-600 text-sm">
                Creating beautiful and intuitive user experiences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// SSG - Static Site Generation for About page
export async function getStaticProps() {
  // Mock stats - in a real app, these would come from your database
  const stats = {
    users: 15420,
    posts: 89250,
    connections: 125000,
    countries: 45,
  };

  return {
    props: {
      stats,
    },
    // ISR - Revalidate every hour
    revalidate: 3600,
  };
}

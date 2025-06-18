# Social Lens - Modern Social Media Platform

A full-featured social media application built with Next.js, featuring real-time messaging, stories, posts, and user interactions. Social Lens provides a complete social networking experience with modern UI/UX design.

## 🌐 Live Application

**Visit the live application:** [Social Lens](https://sociallens-omega.vercel.app/auth/login?callbackUrl=https%3A%2F%2Fsociallens-omega.vercel.app%2F)

## ✨ Features

### 🔐 Authentication & User Management

- Secure user registration and login with NextAuth.js
- User profile management with customizable avatars and bios
- Follow/unfollow functionality
- User search and discovery

### 📱 Social Features

- **Posts**: Create, view, like, and comment on posts with image/video support
- **Stories**: Share temporary stories that expire after 24 hours
- **Real-time Chat**: Instant messaging with Socket.IO
- **Feed**: Personalized feed showing posts from followed users
- **User Profiles**: Detailed user profiles with posts and followers

### 🎨 Modern UI/UX

- Responsive design optimized for mobile and desktop
- Modern UI with Tailwind CSS
- Real-time notifications and interactions
- Smooth animations and transitions

### 🔧 Technical Features

- Server-side rendering (SSR) for optimal performance
- Real-time updates with WebSocket connections
- Image upload and storage
- Protected routes and API endpoints
- Comprehensive error handling

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS v4
- **Backend**: Next.js API Routes, Socket.IO
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js with JWT
- **Real-time**: Socket.IO for live messaging
- **File Upload**: Formidable for image handling
- **Styling**: Tailwind CSS with Ant Design Icons
- **Testing**: Jest with React Testing Library

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18+
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd sociallens
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/sociallens
# For production: mongodb+srv://username:password@cluster.mongodb.net/sociallens

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# For production, use a strong secret:
# NEXTAUTH_SECRET=$(openssl rand -base64 32)
```

### 4. Database Setup

**Option A: Local MongoDB**

```bash
# Install MongoDB locally and start the service
mongod
```

**Option B: MongoDB Atlas**

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Replace `MONGODB_URI` in your `.env.local` file

### 5. Generate NextAuth Secret (Optional but Recommended)

```bash
openssl rand -base64 32
```

Use the output as your `NEXTAUTH_SECRET` in the environment file.

### 6. Run the Development Server

```bash
npm run dev
```

### 7. Open Your Browser

Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
sociallens/
├── src/
│   ├── components/          # React components
│   │   ├── authentication/  # Login, register, logout components
│   │   ├── chat/           # Real-time messaging components
│   │   ├── feed/           # Posts, stories, comments components
│   │   ├── layout/         # Layout and footer components
│   │   ├── navigation/     # Navigation bars and sidebars
│   │   └── profile/        # User profile components
│   ├── contexts/           # React contexts (Socket.IO)
│   ├── lib/                # Utility functions
│   │   ├── mongodb.js      # Database connection
│   │   └── auth.js         # Authentication utilities
│   ├── models/             # Mongoose data models
│   │   ├── User.js         # User schema
│   │   ├── Post.js         # Post schema
│   │   ├── Story.js        # Story schema
│   │   └── Message.js      # Message schema
│   ├── pages/              # Next.js pages and API routes
│   │   ├── api/            # API endpoints
│   │   │   ├── auth/       # Authentication endpoints
│   │   │   ├── messages/   # Messaging endpoints
│   │   │   ├── posts/      # Posts endpoints
│   │   │   ├── stories/    # Stories endpoints
│   │   │   ├── users/      # User management endpoints
│   │   │   ├── upload.js   # File upload endpoint
│   │   │   └── socketio.js # Socket.IO server
│   │   ├── auth/           # Authentication pages
│   │   ├── messages.jsx    # Messaging page
│   │   ├── profile/        # User profile pages
│   │   └── index.js        # Home page
│   └── styles/             # Global styles
├── public/                 # Static assets and uploads
├── __mocks__/             # Jest mocks for testing
├── middleware.js          # Next.js middleware for route protection
└── next.config.mjs        # Next.js configuration
```

## 🗄️ Database Models

### User Model

- Basic info: name, email, username, password
- Profile: profilePicture, bio
- Social: followers, following arrays
- Posts: array of user's posts
- Timestamps: createdAt, updatedAt

### Post Model

- Content: description, media (image/video)
- Social: likes, comments arrays
- Metadata: author reference, timestamps
- Features: sponsored posts support

### Story Model

- Content: media (image/video)
- Metadata: user reference, timestamps
- Expiration: automatic 24-hour expiration

### Message Model

- Content: message text
- Metadata: sender, receiver references
- Status: read/unread tracking
- Timestamps: createdAt, updatedAt

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Posts

- `GET /api/posts` - Fetch posts
- `POST /api/posts` - Create post
- `POST /api/posts/[id]/like` - Like/unlike post
- `POST /api/posts/[id]/comment` - Add comment

### Users

- `GET /api/users/search` - Search users
- `GET /api/users/[id]` - Get user profile
- `POST /api/users/[id]/follow` - Follow/unfollow user

### Stories

- `GET /api/stories` - Fetch stories
- `POST /api/stories` - Create story
- `GET /api/stories/me` - Get user's stories

### Messages

- `GET /api/messages` - Fetch conversations
- `POST /api/messages` - Send message
- `PUT /api/messages/read` - Mark messages as read
- `DELETE /api/messages` - Delete message

### File Upload

- `POST /api/upload` - Upload images/videos

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
4. Deploy!

### Other Platforms

1. Build the project:

   ```bash
   npm run build
   ```

2. Start the production server:

   ```bash
   npm start
   ```

3. Set up environment variables on your hosting platform

## 🧪 Testing

Run the test suite:

```bash
npm test
```

## 🔒 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT-based authentication
- ✅ Protected API routes with middleware
- ✅ Input validation and sanitization
- ✅ CORS protection
- ✅ Secure file upload handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

## 🔄 Updates

Stay updated with the latest features and improvements by:

- Watching the repository
- Checking the releases page
- Following the development branch

---

**Built with ❤️ using Next.js, React, and MongoDB**

# Social Lens - Next.js Social Media App

A modern social media application built with Next.js, MongoDB, and NextAuth.js.

## Features

- 🔐 **Authentication**: Secure user registration and login with NextAuth.js
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- 🗄️ **Database**: MongoDB with Mongoose ODM
- 🔒 **Protected Routes**: Middleware-based route protection
- 📝 **Posts**: Create and view posts with images
- 🖼️ **Create Post Modal**: Reusable modal for creating posts with image upload
- 👥 **User Profiles**: User management with profile pictures and bios
- 💬 **Comments**: Comment system on posts
- ❤️ **Likes**: Like/unlike posts functionality

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS v4
- **Icons**: Ant Design Icons

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd sociallens
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/sociallens
   # For production: mongodb+srv://username:password@cluster.mongodb.net/sociallens

   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here-change-in-production
   ```

4. **Set up MongoDB**

   - **Local MongoDB**: Install and start MongoDB locally
   - **MongoDB Atlas**: Create a cluster and get your connection string

5. **Generate NextAuth Secret**

   ```bash
   openssl rand -base64 32
   ```

   Use the output as your `NEXTAUTH_SECRET`

6. **Run the development server**

   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
sociallens/
├── src/
│   ├── components/          # React components
│   │   ├── authentication/  # Auth-related components
│   │   ├── feed/           # Post feed components
│   │   └── navigation/     # Navigation components
│   ├── lib/                # Utility functions
│   │   ├── mongodb.js      # Database connection
│   │   └── auth.js         # Auth utilities
│   ├── models/             # Mongoose models
│   │   ├── User.js         # User schema
│   │   └── Post.js         # Post schema
│   ├── pages/              # Next.js pages
│   │   ├── api/            # API routes
│   │   │   ├── auth/       # Auth API endpoints
│   │   │   └── posts/      # Posts API endpoints
│   │   └── auth/           # Auth pages
│   └── styles/             # Global styles
├── public/                 # Static assets
├── middleware.js           # Next.js middleware
└── next.config.mjs         # Next.js configuration
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Posts

- `GET /api/posts` - Fetch all posts
- `POST /api/posts` - Create a new post

## Database Models

### User Schema

```javascript
{
  name: String,
  email: String (unique),
  username: String (unique),
  password: String (hashed),
  profilePicture: String,
  bio: String,
  followers: [User],
  following: [User],
  posts: [Post],
  createdAt: Date,
  updatedAt: Date
}
```

### Post Schema

```javascript
{
  author: User (ref),
  description: String,
  media: {
    url: String,
    type: String (enum: 'image', 'video')
  },
  likes: [User],
  comments: [{
    user: User,
    text: String,
    createdAt: Date
  }],
  isSponsored: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Environment Variables

| Variable          | Description               | Example                                |
| ----------------- | ------------------------- | -------------------------------------- |
| `MONGODB_URI`     | MongoDB connection string | `mongodb://localhost:27017/sociallens` |
| `NEXTAUTH_URL`    | Your app's base URL       | `http://localhost:3000`                |
| `NEXTAUTH_SECRET` | Secret for JWT encryption | `your-secret-key-here`                 |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

- Set up environment variables
- Build the project: `npm run build`
- Start the production server: `npm start`

## Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT-based authentication
- ✅ Protected API routes
- ✅ Input validation
- ✅ CORS protection
- ✅ Rate limiting (can be added)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@sociallens.com or create an issue in the repository.

## Create Post Feature

The application includes a reusable modal component for creating posts:

### Features:

- **Image Upload**: Drag and drop or click to upload images
- **Image Preview**: Real-time preview of selected images
- **File Validation**: Supports common image formats with 5MB size limit
- **Description**: Rich text description with character counter (500 max)
- **Authentication**: Requires user login to create posts
- **Responsive Design**: Works on all device sizes

### Usage:

1. Click the "Create" button in the sidebar
2. Upload an image by clicking "Choose File" or dragging an image
3. Add a description (optional but recommended)
4. Click "Create Post" to publish

### Technical Details:

- **Component**: `CreatePostModal.jsx` in `/src/components/feed/`
- **API Endpoint**: `POST /api/posts`
- **Image Storage**: Base64 encoding (for demo purposes)
- **Authentication**: NextAuth.js session-based
- **Validation**: Client and server-side validation

### Post Model Structure:

```javascript
{
  author: User (ref),
  description: String (max 500 chars),
  media: {
    url: String (base64 or URL),
    type: String (enum: 'image', 'video')
  },
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-updated)
}
```

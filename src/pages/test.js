import { useSession } from "next-auth/react";

export default function Test() {
  const { data: session, status } = useSession();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <div className="space-y-4">
        <div>
          <strong>Status:</strong> {status}
        </div>
        {session ? (
          <div>
            <strong>User:</strong> {session.user.name} ({session.user.email})
          </div>
        ) : (
          <div>
            <strong>User:</strong> Not authenticated
          </div>
        )}
        <div>
          <strong>Environment:</strong> {process.env.NODE_ENV}
        </div>
        <div>
          <strong>MongoDB URI:</strong>{" "}
          {process.env.MONGODB_URI ? "Set" : "Not set"}
        </div>
        <div>
          <strong>NextAuth Secret:</strong>{" "}
          {process.env.NEXTAUTH_SECRET ? "Set" : "Not set"}
        </div>
      </div>
    </div>
  );
}

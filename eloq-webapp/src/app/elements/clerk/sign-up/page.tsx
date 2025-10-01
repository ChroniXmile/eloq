import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-[25rem] space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Sign Up</h1>
          <p className="text-muted-foreground">
            Create your account using Clerk's built-in component
          </p>
        </div>

        <SignUp />
      </div>
    </div>
  );
}
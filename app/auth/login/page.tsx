import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Social Media</h1>
          <p className="text-gray-600">Connect with friends and share your thoughts</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

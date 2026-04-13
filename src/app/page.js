import RegistrationForm from "./components/register-from";


export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <RegistrationForm />
      </div>
    </main>
  )
}


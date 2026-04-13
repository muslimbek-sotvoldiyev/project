import SuccessMessage from "../components/success-from";

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <SuccessMessage />
      </div>
    </main>
  )
}


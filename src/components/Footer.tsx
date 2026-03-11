export function Footer() {
  return (
    <footer className="w-full border-t border-gray-100 mt-auto bg-green-50 py-8">
      <div className="container mx-auto px-4 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Ecoyaan. All rights reserved.</p>
        <p className="mt-2 text-green-700 font-medium tracking-wide">
          Sustainable living, made simple.
        </p>
      </div>
    </footer>
  );
}

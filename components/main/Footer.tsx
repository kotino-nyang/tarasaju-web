"use client";

export default function Footer() {
  return (
    <footer className="relative bg-gray-900 py-8 text-white">
      {/* Gradient divider */}
      <div
        className="absolute left-0 top-0 h-px w-full"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(96, 165, 250, 0.3) 50%, transparent 100%)",
        }}
      />

      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Logo */}
          <img
            src="https://i.imgur.com/sdU9nRt.png"
            alt="타라사주 로고"
            className="mb-6 h-12 w-auto"
            onError={(e) => {
              e.currentTarget.src = "https://i.imgur.com/sdU9nRt.jpg";
            }}
          />

          {/* Company Info */}
          <div className="mb-6 space-y-2 text-sm text-gray-400">
            <p>노마릿 (452-01-02701) | 대표 : 고수빈</p>
            <p>© 2026 TARA SAJU. All rights reserved.</p>
          </div>

          {/* Contact Info */}
          <div className="space-y-2 text-sm text-gray-400">
            <p>
              <span className="text-gray-500">CS:</span>{" "}
              <a href="tel:010-4648-0046" className="hover:text-white transition-colors">
                010-4648-0046
              </a>
            </p>
            <p>
              <span className="text-gray-500">Contact:</span>{" "}
              <a href="mailto:binzzz010101@gmail.com" className="hover:text-white transition-colors">
                binzzz010101@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

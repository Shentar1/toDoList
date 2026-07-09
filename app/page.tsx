"use client";

import Image from "next/image";
import { getSession } from "./authContext";
import { useState, useEffect } from "react";

export default function Home() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (loading) {
      getSession().then((session) => {
        if (session.uuid !== undefined) {
          document.location.href = "/home";
        }
      });
    } else {
      setLoading(false);
    }
  });
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <section className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-2 items-center">
          <div>
            <h2 className="text-4xl font-extrabold mb-4">
              Simple, fast task management
            </h2>
            <p className="text-gray-600 mb-6">
              Organize your day and focus on what matters. Lightweight,
              privacy-focused, and fast.
            </p>
            <div className="flex gap-3">
              <a
                id="getstarted"
                href="/login"
                className="inline-block btnBlue px-5 py-2 rounded font-medium"
              >
                Login
              </a>
              <a
                id="getstarted"
                href="/register"
                className="inline-block btnWhite px-5 py-2 rounded font-medium"
              >
                Create Account
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-80 h-56 bg-gray-100 rounded-lg flex items-center justify-center">
              {/* Placeholder image: replace with actual app screenshot */}
              <Image
                src="/favicon.ico"
                alt="App preview"
                width={300}
                height={300}
                loading="eager"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      <section id="pricing" className="bg-white border-t">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h3 className="text-2xl font-bold mb-4">Pricing</h3>
          <p className="text-gray-600 mb-6">
            Free to use. Optional pro features coming soon. (Never)
          </p>
        </div>
      </section>

      <footer className="max-w-4xl mx-auto px-6 py-6 text-sm text-gray-500">
        <div className="flex items-center justify-between">
          <span>© {new Date().getFullYear()} toDoList</span>
          <span>Built with Next.js</span>
        </div>
      </footer>
    </main>
  );
}

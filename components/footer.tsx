"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-white/10 bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-center ">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              Vinamra Garg
            </span>
            . All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

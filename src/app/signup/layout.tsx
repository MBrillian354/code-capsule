import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - CodeCapsule",
  description: "Create a new account for CodeCapsule",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

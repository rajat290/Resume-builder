import { useEffect, useState } from "react";
import AuthModal from "./components/AuthModal";
import LandingPage from "./components/LandingPage";
import ResumeWorkspace from "./components/ResumeWorkspace";
import { apiFetch, authStorage, isApiConnectionError } from "./utils/api";

export default function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [session, setSession] = useState(null);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const savedSession = authStorage.get();
    if (savedSession) {
      setSession(savedSession);
    }
  }, []);

  const persistSession = (nextSession) => {
    setSession(nextSession);
    authStorage.set(nextSession);
  };

  const handleGoogleCredential = async (credential) => {
    setIsAuthenticating(true);
    setAuthError("");

    try {
      const response = await apiFetch("/auth/google", {
        method: "POST",
        body: JSON.stringify({ credential })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Google authentication failed.");
      }

      persistSession({
        token: data.token,
        user: data.user
      });
      setAuthModalOpen(false);
    } catch (error) {
      console.error("Google sign-in failed", error);
      setAuthError(
        isApiConnectionError(error)
          ? "The backend server is offline. Start the API and try Google sign-in again."
          : error.message || "Google sign-in failed."
      );
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleDemoContinue = () => {
    const nextSession = {
      token: null,
      user: {
        provider: "demo",
        name: "Demo User",
        mode: "demo"
      }
    };

    persistSession(nextSession);
    setAuthModalOpen(false);
    setAuthError("");
  };

  const handleSignOut = () => {
    setSession(null);
    authStorage.clear();
  };

  if (session) {
    return <ResumeWorkspace currentUser={session.user} onSignOut={handleSignOut} />;
  }

  return (
    <>
      <LandingPage
        onPrimaryCta={() => {
          setAuthError("");
          setAuthModalOpen(true);
        }}
        onSecondaryCta={handleDemoContinue}
      />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onGoogleCredential={handleGoogleCredential}
        onDemoContinue={handleDemoContinue}
        isLoading={isAuthenticating}
        clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
        errorMessage={authError}
      />
    </>
  );
}

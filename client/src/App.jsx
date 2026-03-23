import { useEffect, useState } from "react";
import AuthModal from "./components/AuthModal";
import LandingPage from "./components/LandingPage";
import ResumeWorkspace from "./components/ResumeWorkspace";

const STORAGE_KEY = "smart-resume-builder-auth";

export default function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const savedSession = window.localStorage.getItem(STORAGE_KEY);
    if (savedSession) {
      setSession(JSON.parse(savedSession));
    }
  }, []);

  const persistSession = (nextSession) => {
    setSession(nextSession);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
  };

  const handleGoogleContinue = () => {
    setIsAuthenticating(true);

    window.setTimeout(() => {
      const nextSession = {
        provider: "google",
        name: "Google User",
        mode: "authenticated"
      };

      persistSession(nextSession);
      setIsAuthenticating(false);
      setAuthModalOpen(false);
    }, 900);
  };

  const handleDemoContinue = () => {
    const nextSession = {
      provider: "demo",
      name: "Demo User",
      mode: "demo"
    };

    persistSession(nextSession);
    setAuthModalOpen(false);
  };

  const handleSignOut = () => {
    setSession(null);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  if (session) {
    return <ResumeWorkspace currentUser={session} onSignOut={handleSignOut} />;
  }

  return (
    <>
      <LandingPage
        onPrimaryCta={() => setAuthModalOpen(true)}
        onSecondaryCta={handleDemoContinue}
      />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onGoogleContinue={handleGoogleContinue}
        onDemoContinue={handleDemoContinue}
        isLoading={isAuthenticating}
      />
    </>
  );
}

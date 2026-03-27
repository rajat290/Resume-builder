import { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, X } from "lucide-react";

function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve(window.google);
      return;
    }

    const existing = document.querySelector('script[data-google-identity="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(window.google));
      existing.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.dataset.googleIdentity = "true";
    script.onload = () => resolve(window.google);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export default function AuthModal({
  isOpen,
  onClose,
  onGoogleCredential,
  onDemoContinue,
  isLoading,
  clientId,
  errorMessage
}) {
  const googleButtonRef = useRef(null);
  const [googleStatus, setGoogleStatus] = useState("idle");

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    if (!clientId) {
      setGoogleStatus("error");
      return undefined;
    }

    let cancelled = false;

    const setupGoogleButton = async () => {
      try {
        setGoogleStatus("loading");
        const google = await loadGoogleScript();
        if (cancelled || !googleButtonRef.current) {
          return;
        }

        google.accounts.id.initialize({
          client_id: clientId,
          callback: ({ credential }) => {
            if (credential) {
              onGoogleCredential(credential);
            }
          }
        });

        googleButtonRef.current.innerHTML = "";
        google.accounts.id.renderButton(googleButtonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "pill",
          width: googleButtonRef.current.offsetWidth || 320
        });

        setGoogleStatus("ready");
      } catch (_error) {
        if (!cancelled) {
          setGoogleStatus("error");
        }
      }
    };

    setupGoogleButton();

    return () => {
      cancelled = true;
    };
  }, [clientId, isOpen, onGoogleCredential]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.24)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="bg-[linear-gradient(180deg,_#eff6ff_0%,_#ffffff_100%)] p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-600">
                Secure Sign In
              </p>
              <h2 className="mt-2 font-display text-3xl text-slate-950">
                Continue with Google
              </h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
                Jump into your resume workspace in one step. Your account keeps your
                optimized resumes, rewrites, and activity in sync.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
              aria-label="Close authentication modal"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-8 space-y-4">
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-sky-50 p-2 text-sky-700">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Google-secured access</p>
                  <p className="text-sm text-slate-500">
                    No passwords to manage. Sign in with the Google account you already use.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold text-slate-900">What you get after login</p>
              <div className="mt-4 space-y-3">
                {[
                  "Save a master resume and tailor it for every role.",
                  "Keep AI rewrites, score changes, and downloads in one place.",
                  "Switch between resume templates and compare versions easily."
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="mt-0.5 text-emerald-600" />
                    <p className="text-sm leading-6 text-slate-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Welcome Back
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950">
              Access your dashboard
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Use Google to continue, or try the product in demo mode first.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4">
                <label className="field-label">Google account</label>
                <div className="mt-2 min-h-[46px]" ref={googleButtonRef} />
                {googleStatus === "loading" && (
                  <p className="mt-3 text-sm text-slate-500">Preparing secure Google sign-in…</p>
                )}
                {googleStatus === "error" && (
                  <p className="mt-3 text-sm text-amber-700">
                    Google sign-in could not be initialized. Check your client ID and allowed origins.
                  </p>
                )}
                {errorMessage && (
                  <p className="mt-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {errorMessage}
                  </p>
                )}
                {isLoading && (
                  <p className="mt-3 text-sm font-medium text-sky-700">Signing you in…</p>
                )}
              </div>

              <button
                type="button"
                onClick={onDemoContinue}
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <ArrowRight size={18} />
                Try Demo First
              </button>
            </div>

            <div className="mt-6 rounded-[1.5rem] bg-slate-950 p-4 text-white">
              <div className="flex items-center gap-2 text-sky-300">
                <Sparkles size={16} />
                <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                  Why teams like this flow
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-200">
                Faster onboarding, cleaner trust signals, and a direct path into the product without password friction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

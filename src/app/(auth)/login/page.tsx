"use client";

import { useState } from "react";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendOTP() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      if (res.ok) {
        setStep("code");
      } else {
        setError("Erreur lors de l'envoi du code.");
      }
    } catch {
      setError("Erreur réseau.");
    }
    setLoading(false);
  }

  async function verifyOTP() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      if (res.ok) {
        window.location.href = "/";
      } else {
        setError("Code incorrect ou expiré.");
      }
    } catch {
      setError("Erreur réseau.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#0f0520] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-medium text-[#e8b4f0] mb-2 text-center">
          Noctis
        </h1>
        <p className="text-[#9a7aaa] text-center text-sm mb-8">
          La nuit t'appartient
        </p>

        <div className="bg-[#1a0a2e] rounded-2xl p-6 border border-[#2d1050]">
          {step === "phone" ? (
            <>
              <p className="text-[#f0d6f8] text-sm mb-4">
                Entre ton numéro de téléphone
              </p>
              <input
                type="tel"
                placeholder="+225 07 00 00 00 00"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#0f0520] border border-[#2d1050] rounded-xl px-4 py-3 text-[#f0d6f8] text-sm mb-4 outline-none focus:border-[#c453e0]"
              />
              {error && (
                <p className="text-red-400 text-xs mb-3">{error}</p>
              )}
              <button
                onClick={sendOTP}
                disabled={loading || !phone}
                className="w-full bg-[#c453e0] text-white rounded-xl py-3 text-sm font-medium disabled:opacity-50"
              >
                {loading ? "Envoi..." : "Recevoir le code SMS"}
              </button>
            </>
          ) : (
            <>
              <p className="text-[#f0d6f8] text-sm mb-1">
                Code envoyé au {phone}
              </p>
              <p
                className="text-[#c453e0] text-xs mb-4 cursor-pointer"
                onClick={() => setStep("phone")}
              >
                Changer de numéro
              </p>
              <input
                type="text"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                className="w-full bg-[#0f0520] border border-[#2d1050] rounded-xl px-4 py-3 text-[#f0d6f8] text-sm mb-4 outline-none focus:border-[#c453e0] text-center text-2xl tracking-widest"
              />
              {error && (
                <p className="text-red-400 text-xs mb-3">{error}</p>
              )}
              <button
                onClick={verifyOTP}
                disabled={loading || code.length !== 6}
                className="w-full bg-[#c453e0] text-white rounded-xl py-3 text-sm font-medium disabled:opacity-50"
              >
                {loading ? "Vérification..." : "Confirmer le code"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
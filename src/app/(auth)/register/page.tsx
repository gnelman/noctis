"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    pseudo: "",
    age: "",
    gender: "",
    status: "",
    city: "",
    country: "",
    lookingFor: "",
    bio: "",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function submit() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/members/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, phone: "" }),
      });
      if (res.ok) {
        router.push("/");
      } else {
        const data = await res.json();
        setError(data.error || "Erreur lors de l inscription.");
      }
    } catch {
      setError("Erreur reseau.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#0f0520] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-medium text-[#e8b4f0] mb-1 text-center">
          Cree ton profil
        </h1>
        <p className="text-[#9a7aaa] text-center text-xs mb-6">
          Ton identite reste toujours anonyme
        </p>

        <div className="bg-[#1a0a2e] rounded-2xl p-6 border border-[#2d1050]">

          {step === 1 && (
            <div>
              <p className="text-[#f0d6f8] text-sm font-medium mb-4">
                Etape 1 — Ton identite publique
              </p>

              <label className="text-[#9a7aaa] text-xs mb-1 block">Pseudo</label>
              <input
                type="text"
                placeholder="ex: Luna_Abi"
                value={form.pseudo}
                onChange={(e) => update("pseudo", e.target.value)}
                className="w-full bg-[#0f0520] border border-[#2d1050] rounded-xl px-4 py-3 text-[#f0d6f8] text-sm mb-4 outline-none"
              />

              <label className="text-[#9a7aaa] text-xs mb-1 block">Age</label>
              <input
                type="number"
                placeholder="ex: 28"
                value={form.age}
                onChange={(e) => update("age", e.target.value)}
                min="18"
                max="99"
                className="w-full bg-[#0f0520] border border-[#2d1050] rounded-xl px-4 py-3 text-[#f0d6f8] text-sm mb-4 outline-none"
              />

              <label className="text-[#9a7aaa] text-xs mb-2 block">Genre</label>
              <div className="flex gap-2 mb-4">
                {["Homme", "Femme", "Autre"].map((g) => (
                  <button
                    key={g}
                    onClick={() => update("gender", g)}
                    className={`flex-1 py-2 rounded-xl text-xs border ${form.gender === g ? "bg-[#c453e0] text-white border-[#c453e0]" : "bg-[#0f0520] text-[#9a7aaa] border-[#2d1050]"}`}
                  >
                    {g}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!form.pseudo || !form.age || !form.gender}
                className="w-full bg-[#c453e0] text-white rounded-xl py-3 text-sm font-medium disabled:opacity-50"
              >
                Continuer
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-[#f0d6f8] text-sm font-medium mb-4">
                Etape 2 — Ta situation
              </p>

              <label className="text-[#9a7aaa] text-xs mb-2 block">Statut</label>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {["Celibataire", "En couple", "Marie(e)", "Divorce(e)"].map((s) => (
                  <button
                    key={s}
                    onClick={() => update("status", s)}
                    className={`py-2 rounded-xl text-xs border ${form.status === s ? "bg-[#c453e0] text-white border-[#c453e0]" : "bg-[#0f0520] text-[#9a7aaa] border-[#2d1050]"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <label className="text-[#9a7aaa] text-xs mb-2 block">Je recherche</label>
              <div className="flex flex-col gap-2 mb-4">
                {["Homme", "Femme", "Les deux"].map((l) => (
                  <button
                    key={l}
                    onClick={() => update("lookingFor", l)}
                    className={`py-2 rounded-xl text-xs border ${form.lookingFor === l ? "bg-[#c453e0] text-white border-[#c453e0]" : "bg-[#0f0520] text-[#9a7aaa] border-[#2d1050]"}`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-[#0f0520] text-[#9a7aaa] border border-[#2d1050] rounded-xl py-3 text-sm"
                >
                  Retour
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!form.status || !form.lookingFor}
                  className="flex-1 bg-[#c453e0] text-white rounded-xl py-3 text-sm font-medium disabled:opacity-50"
                >
                  Continuer
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="text-[#f0d6f8] text-sm font-medium mb-4">
                Etape 3 — Ta localisation
              </p>

              <label className="text-[#9a7aaa] text-xs mb-1 block">Pays</label>
              <select
                value={form.country}
                onChange={(e) => update("country", e.target.value)}
                className="w-full bg-[#0f0520] border border-[#2d1050] rounded-xl px-4 py-3 text-[#f0d6f8] text-sm mb-4 outline-none"
              >
                <option value="">Choisir...</option>
                <option value="CI">Cote d Ivoire</option>
                <option value="SN">Senegal</option>
                <option value="CM">Cameroun</option>
                <option value="BF">Burkina Faso</option>
                <option value="TG">Togo</option>
                <option value="ML">Mali</option>
                <option value="GN">Guinee</option>
                <option value="BJ">Benin</option>
              </select>

              <label className="text-[#9a7aaa] text-xs mb-1 block">Ville</label>
              <input
                type="text"
                placeholder="ex: Abidjan"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                className="w-full bg-[#0f0520] border border-[#2d1050] rounded-xl px-4 py-3 text-[#f0d6f8] text-sm mb-4 outline-none"
              />

              <label className="text-[#9a7aaa] text-xs mb-1 block">Bio courte</label>
              <textarea
                placeholder="Dis quelque chose de toi sans te devoiler..."
                value={form.bio}
                onChange={(e) => update("bio", e.target.value)}
                maxLength={150}
                rows={3}
                className="w-full bg-[#0f0520] border border-[#2d1050] rounded-xl px-4 py-3 text-[#f0d6f8] text-sm mb-1 outline-none resize-none"
              />
              <p className="text-[#5a3a6a] text-xs mb-4 text-right">
                {form.bio.length}/150
              </p>

              {error && (
                <p className="text-red-400 text-xs mb-3">{error}</p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-[#0f0520] text-[#9a7aaa] border border-[#2d1050] rounded-xl py-3 text-sm"
                >
                  Retour
                </button>
                <button
                  onClick={submit}
                  disabled={loading || !form.city || !form.country}
                  className="flex-1 bg-[#c453e0] text-white rounded-xl py-3 text-sm font-medium disabled:opacity-50"
                >
                  {loading ? "Creation..." : "Creer mon profil"}
                </button>
              </div>
            </div>
          )}

        </div>

        <p className="text-[#5a3a6a] text-xs text-center mt-4">
          En t inscrivant tu acceptes nos CGU et confirmes avoir 18 ans minimum.
        </p>
      </div>
    </div>
  );
}
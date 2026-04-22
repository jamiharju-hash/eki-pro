import React, { useState } from "react";

const tokens = {
  primary: "#0D1B2A",
  accent: "#007AFF",
  bgMain: "#FFFFFF",
  bgSubtle: "#F5F5F7",
  shadow: "0 4px 12px rgba(13,27,42,0.08)",
  shadowMd: "0 8px 24px rgba(13,27,42,0.12)",
  border: "#E5E5EA",
  text: "#0D1B2A",
  textMid: "#6B7280",
  textLight: "#9CA3AF",
  green: "#34C759",
  orange: "#FF9500",
  red: "#FF3B30",
};

const screens = [
  "Dashboard",
  "Liidit",
  "Liidi — Yksityiskohta",
  "Tarjouskone",
  "Tarjous — Valmis",
  "Asetukset",
];

// ── Shared Components ──────────────────────────────────────

const Phone = ({ children, title, onBack, showBack }: {
  children: React.ReactNode;
  title: string;
  onBack?: () => void;
  showBack?: boolean;
}) => (
  <div style={{
    width: 375,
    minHeight: 812,
    background: tokens.bgSubtle,
    borderRadius: 48,
    border: `10px solid ${tokens.primary}`,
    boxShadow: `0 32px 80px rgba(13,27,42,0.3), inset 0 0 0 1px rgba(255,255,255,0.1)`,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    fontFamily: "-apple-system, 'SF Pro Display', system-ui, sans-serif",
  }}>
    {/* Status bar */}
    <div style={{
      background: tokens.bgMain,
      padding: "14px 24px 0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: 12,
      fontWeight: 600,
      color: tokens.text,
    }}>
      <span>9:41</span>
      <div style={{
        width: 120, height: 28,
        background: tokens.primary,
        borderRadius: 20,
        position: "absolute",
        left: "50%", transform: "translateX(-50%)",
        top: 8,
      }} />
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <span>●●●</span>
        <span>▲</span>
        <span>🔋</span>
      </div>
    </div>

    {/* Nav bar */}
    <div style={{
      background: tokens.bgMain,
      padding: "12px 20px 14px",
      display: "flex",
      alignItems: "center",
      gap: 12,
      borderBottom: `1px solid ${tokens.border}`,
    }}>
      {showBack && (
        <button onClick={onBack} style={{
          background: "none", border: "none", cursor: "pointer",
          color: tokens.accent, fontSize: 17, fontWeight: 400,
          display: "flex", alignItems: "center", gap: 4, padding: 0,
        }}>
          ‹ Takaisin
        </button>
      )}
      <span style={{
        flex: 1,
        fontSize: 17, fontWeight: 600,
        color: tokens.text,
        textAlign: showBack ? "center" : "left",
        marginRight: showBack ? 60 : 0,
      }}>{title}</span>
    </div>

    {/* Content */}
    <div style={{ flex: 1, overflowY: "auto" }}>
      {children}
    </div>

    {/* Tab bar */}
    <TabBar />
  </div>
);

const TabBar = () => {
  const tabs = [
    { icon: "⬜", label: "Koti" },
    { icon: "◎", label: "Liidit" },
    { icon: "＋", label: "" },
    { icon: "◈", label: "Kalenteri" },
    { icon: "◉", label: "Profiili" },
  ];
  return (
    <div style={{
      background: tokens.bgMain,
      borderTop: `1px solid ${tokens.border}`,
      display: "flex",
      padding: "8px 0 24px",
    }}>
      {tabs.map((t, i) => (
        <div key={i} style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          cursor: "pointer",
        }}>
          {i === 2 ? (
            <div style={{
              width: 44, height: 44,
              borderRadius: 22,
              background: tokens.accent,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontSize: 22, fontWeight: 300,
              marginBottom: 2,
              boxShadow: `0 4px 12px rgba(0,122,255,0.4)`,
            }}>+</div>
          ) : (
            <>
              <span style={{ fontSize: 20, color: i === 0 ? tokens.accent : tokens.textLight }}>{t.icon}</span>
              <span style={{ fontSize: 10, color: i === 0 ? tokens.accent : tokens.textLight, fontWeight: i === 0 ? 600 : 400 }}>{t.label}</span>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

const Card = ({ children, style = {}, onClick, ...props }: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
} & React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props} onClick={onClick} style={{
    background: tokens.bgMain,
    border: `1px solid ${tokens.bgSubtle}`,
    boxShadow: tokens.shadow,
    borderRadius: 16,
    padding: 20,
    cursor: onClick ? "pointer" : "default",
    transition: "transform 0.15s, box-shadow 0.15s",
    ...style,
  }}
  onMouseEnter={e => { if (onClick) { e.currentTarget.style.transform = "scale(1.01)"; e.currentTarget.style.boxShadow = tokens.shadowMd; }}}
  onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = tokens.shadow; }}
  >
    {children}
  </div>
);

const Badge = ({ color, children }) => (
  <span style={{
    background: color + "18",
    color,
    fontSize: 11,
    fontWeight: 600,
    padding: "3px 8px",
    borderRadius: 6,
    letterSpacing: 0.3,
  }}>{children}</span>
);

const Btn = ({ children, variant = "primary", onClick, style = {} }: {
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "secondary";
  onClick?: () => void;
  style?: React.CSSProperties;
}) => (
  <button onClick={onClick} style={{
    background: variant === "primary" ? tokens.accent : variant === "ghost" ? "transparent" : tokens.bgSubtle,
    color: variant === "primary" ? "white" : variant === "ghost" ? tokens.accent : tokens.text,
    border: variant === "ghost" ? `1px solid ${tokens.accent}` : "none",
    borderRadius: 12,
    padding: "14px 24px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    width: "100%",
    transition: "opacity 0.15s, transform 0.1s",
    boxShadow: variant === "primary" ? "0 4px 12px rgba(0,122,255,0.3)" : "none",
    ...style,
  }}
  onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
  >{children}</button>
);

// ── SCREENS ────────────────────────────────────────────────

const DashboardScreen = ({ onNav }) => (
  <Phone title="Yleiskatsaus">
    <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Greeting */}
      <div style={{ padding: "4px 4px 0" }}>
        <div style={{ fontSize: 13, color: tokens.textMid }}>Hyvää huomenta 👋</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: tokens.text, marginTop: 2 }}>Jami Harju</div>
      </div>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[
          { label: "Uudet liidit", value: "7", color: tokens.accent },
          { label: "Avoimet tarj.", value: "3", color: tokens.orange },
          { label: "Kuun tulot", value: "4.2k", color: tokens.green },
        ].map((k, i) => (
          <Card key={i} style={{ padding: 14, textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 10, color: tokens.textMid, marginTop: 4, fontWeight: 500 }}>{k.label}</div>
          </Card>
        ))}
      </div>

      {/* Pipeline */}
      <Card>
        <div style={{ fontSize: 13, fontWeight: 600, color: tokens.text, marginBottom: 14 }}>Myyntiputki</div>
        {[
          { stage: "Uusi liidi", count: 7, color: tokens.accent, pct: 100 },
          { stage: "Kontaktoitu", count: 4, color: tokens.orange, pct: 57 },
          { stage: "Tarjous lähetetty", count: 3, color: "#9B59B6", pct: 43 },
          { stage: "Klousattu", count: 1, color: tokens.green, pct: 14 },
        ].map((s, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 12, color: tokens.textMid }}>{s.stage}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: tokens.text }}>{s.count}</span>
            </div>
            <div style={{ height: 4, background: tokens.bgSubtle, borderRadius: 2 }}>
              <div style={{ height: 4, width: s.pct + "%", background: s.color, borderRadius: 2, transition: "width 0.6s ease" }} />
            </div>
          </div>
        ))}
      </Card>

      {/* Recent leads */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, padding: "0 4px" }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: tokens.text }}>Viimeisimmät</span>
          <span onClick={() => onNav(1)} style={{ fontSize: 13, color: tokens.accent, cursor: "pointer", fontWeight: 500 }}>Kaikki →</span>
        </div>
        {[
          { name: "Kami Works Oy", type: "Märkätila", status: "Uusi", statusColor: tokens.accent, time: "tänään" },
          { name: "Karhu24 Oy", type: "Kartoitus", status: "Yhteys otettu", statusColor: tokens.green, time: "tänään" },
          { name: "Peltonen LVI", type: "Kylpyhuone", status: "Tarjous", statusColor: tokens.orange, time: "eilen" },
        ].map((l, i) => (
          <Card key={i} style={{ marginBottom: 8, padding: 14 }} onClick={() => onNav(2)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: tokens.text }}>{l.name}</div>
                <div style={{ fontSize: 12, color: tokens.textMid, marginTop: 2 }}>{l.type} · {l.time}</div>
              </div>
              <Badge color={l.statusColor}>{l.status}</Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <Card>
        <div style={{ fontSize: 13, fontWeight: 600, color: tokens.text, marginBottom: 12 }}>Pikavalinnat</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { icon: "✦", label: "Uusi liidi", color: tokens.accent },
            { icon: "◈", label: "Tarjouskone", color: "#9B59B6" },
            { icon: "📅", label: "Aikataulu", color: tokens.orange },
            { icon: "📊", label: "Raportti", color: tokens.green },
          ].map((q, i) => (
            <div key={i} onClick={() => i === 1 && onNav(3)} style={{
              background: q.color + "10",
              borderRadius: 10,
              padding: "12px 14px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              border: `1px solid ${q.color}20`,
            }}>
              <span style={{ fontSize: 16 }}>{q.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: q.color }}>{q.label}</span>
            </div>
          ))}
        </div>
      </Card>

    </div>
  </Phone>
);

const Liidilista = ({ onNav }) => (
  <Phone title="Liidit">
    <div style={{ padding: "16px" }}>
      {/* Search */}
      <div style={{
        background: tokens.bgSubtle,
        borderRadius: 10,
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 16,
      }}>
        <span style={{ color: tokens.textLight, fontSize: 14 }}>🔍</span>
        <span style={{ fontSize: 14, color: tokens.textLight }}>Hae liidejä...</span>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto" }}>
        {["Kaikki", "Uudet", "Tarjous", "Klousattu"].map((f, i) => (
          <div key={i} style={{
            background: i === 0 ? tokens.primary : tokens.bgMain,
            color: i === 0 ? "white" : tokens.textMid,
            border: `1px solid ${i === 0 ? tokens.primary : tokens.border}`,
            borderRadius: 20,
            padding: "6px 14px",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}>{f}</div>
        ))}
      </div>

      {/* List */}
      {[
        { name: "Kami Works Oy", contact: "Markus Tuominen", type: "Märkätilaremontti", value: "~4 800€", status: "Uusi", statusColor: tokens.accent, score: 92 },
        { name: "Karhu24 Oy", contact: "Kartoitusvaraus", type: "Kartoitus ke 22.4.", value: "—", status: "Aktiivinen", statusColor: tokens.green, score: 78 },
        { name: "Peltonen LVI", contact: "Mikko Peltonen", type: "Kylpyhuoneremontti", value: "~6 200€", status: "Tarjous", statusColor: tokens.orange, score: 65 },
        { name: "Salminen & Co", contact: "Anna Salminen", type: "Keittiöremontti", value: "~3 500€", status: "Tarjous", statusColor: tokens.orange, score: 55 },
        { name: "Virtanen Isännöinti", contact: "Pasi Virtanen", type: "Pintaremontti", value: "~2 100€", status: "Yhteys otettu", statusColor: "#9B59B6", score: 40 },
      ].map((l, i) => (
        <Card key={i} style={{ marginBottom: 10, padding: 16 }} onClick={() => onNav(2)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: tokens.text }}>{l.name}</div>
              <div style={{ fontSize: 12, color: tokens.textMid, marginTop: 2 }}>{l.contact}</div>
            </div>
            <Badge color={l.statusColor}>{l.status}</Badge>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: tokens.textMid }}>{l.type}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: l.value === "—" ? tokens.textLight : tokens.text }}>{l.value}</span>
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: tokens.textLight }}>Liidiscore</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: l.score > 70 ? tokens.green : l.score > 50 ? tokens.orange : tokens.textMid }}>{l.score}/100</span>
            </div>
            <div style={{ height: 3, background: tokens.bgSubtle, borderRadius: 2 }}>
              <div style={{ height: 3, width: l.score + "%", background: l.score > 70 ? tokens.green : l.score > 50 ? tokens.orange : tokens.textLight, borderRadius: 2 }} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  </Phone>
);

const LiidiDetail = ({ onNav }) => (
  <Phone title="Kami Works Oy" onBack={() => onNav(1)} showBack>
    <div style={{ padding: "16px" }}>
      {/* Header card */}
      <Card style={{ marginBottom: 16, background: tokens.primary }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "white" }}>Kami Works Oy</div>
            <div style={{ fontSize: 13, color: "#8899AA", marginTop: 3 }}>Markus Tuominen</div>
          </div>
          <Badge color={tokens.accent}>Uusi</Badge>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { label: "Tyyppi", value: "Märkätila" },
            { label: "Arvo", value: "~4 800€" },
            { label: "Score", value: "92/100" },
            { label: "Lähde", value: "WhatsApp" },
          ].map((d, i) => (
            <div key={i}>
              <div style={{ fontSize: 10, color: "#8899AA", letterSpacing: 0.5, textTransform: "uppercase" }}>{d.label}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "white", marginTop: 2 }}>{d.value}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Contact actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 16 }}>
        {[
          { icon: "📞", label: "Soita" },
          { icon: "💬", label: "WhatsApp" },
          { icon: "📧", label: "Sähköposti" },
          { icon: "📅", label: "Tapaaminen" },
        ].map((a, i) => (
          <div key={i} style={{
            background: tokens.bgMain,
            border: `1px solid ${tokens.border}`,
            borderRadius: 12,
            padding: "12px 8px",
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 6, cursor: "pointer",
          }}>
            <span style={{ fontSize: 20 }}>{a.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: tokens.textMid }}>{a.label}</span>
          </div>
        ))}
      </div>

      {/* Notes */}
      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: tokens.text, marginBottom: 10 }}>Muistiinpanot</div>
        <div style={{ fontSize: 13, color: tokens.textMid, lineHeight: 1.6, background: tokens.bgSubtle, padding: 12, borderRadius: 8 }}>
          "Iltaa, olitte lähettäneet yrityksemme toimarille sähköpostia märkätilaremonteista ja tarjousta 35€/h hintaan koeprojektista..."
        </div>
        <div style={{ fontSize: 11, color: tokens.textLight, marginTop: 8 }}>WhatsApp · 22.4.2026 klo 19:55</div>
      </Card>

      {/* Timeline */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: tokens.text, marginBottom: 14 }}>Aikajana</div>
        {[
          { event: "Puhelu sovittu", time: "23.4. klo 8:00", icon: "📞", color: tokens.accent },
          { event: "WhatsApp-viesti vastaanotettu", time: "22.4. klo 19:55", icon: "💬", color: tokens.green },
          { event: "Liidi lisätty", time: "22.4. klo 20:01", icon: "✦", color: tokens.textLight },
        ].map((t, i) => (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < 2 ? 14 : 0 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 16,
              background: t.color + "18",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, flexShrink: 0,
            }}>{t.icon}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: tokens.text }}>{t.event}</div>
              <div style={{ fontSize: 11, color: tokens.textLight, marginTop: 2 }}>{t.time}</div>
            </div>
          </div>
        ))}
      </Card>

      {/* CTA */}
      <Btn onClick={() => onNav(3)}>Avaa tarjouskone ›</Btn>
      <div style={{ height: 8 }} />
      <Btn variant="secondary">Muuta statusta</Btn>
      <div style={{ height: 20 }} />
    </div>
  </Phone>
);

const Tarjouskone = ({ onNav }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      q: "Minkä tyyppinen remontti?",
      options: ["Kylpyhuone / märkätila", "Keittiöremontti", "Pintaremontti", "Muu"],
      key: "type",
    },
    {
      q: "Mikä on tilan koko?",
      options: ["Alle 5 m²", "5–10 m²", "10–20 m²", "Yli 20 m²"],
      key: "size",
    },
    {
      q: "Milloin työ pitäisi tehdä?",
      options: ["Mahdollisimman pian", "1–2 kuukauden sisällä", "3–6 kuukauden sisällä", "Ei kiire"],
      key: "timing",
    },
    {
      q: "Missä kohde sijaitsee?",
      options: ["Vihti", "Lohja", "Muu Uusimaa", "Muu"],
      key: "location",
    },
    {
      q: "Onko putkitöille tarvetta?",
      options: ["Kyllä, arviolta paljon", "Jonkin verran", "Ei juurikaan", "En osaa sanoa"],
      key: "plumbing",
    },
    {
      q: "Mikä on budjettinne arvio?",
      options: ["Alle 5 000€", "5 000–10 000€", "10 000–20 000€", "Yli 20 000€"],
      key: "budget",
    },
  ];

  const progress = ((step) / questions.length) * 100;

  if (step >= questions.length) {
    onNav(4);
    return null;
  }

  const q = questions[step];

  return (
    <Phone title="Tarjouskone" onBack={() => step > 0 ? setStep(s => s - 1) : onNav(2)} showBack>
      <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", minHeight: 600 }}>

        {/* Progress */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: tokens.textMid, fontWeight: 500 }}>Kysymys {step + 1} / {questions.length}</span>
            <span style={{ fontSize: 12, color: tokens.accent, fontWeight: 600 }}>{Math.round(progress)}%</span>
          </div>
          <div style={{ height: 4, background: tokens.bgSubtle, borderRadius: 2 }}>
            <div style={{ height: 4, width: progress + "%", background: tokens.accent, borderRadius: 2, transition: "width 0.4s ease" }} />
          </div>
        </div>

        {/* Question */}
        <div style={{
          fontSize: 22, fontWeight: 700, color: tokens.text,
          margin: "32px 0 24px", lineHeight: 1.3,
        }}>{q.q}</div>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
          {q.options.map((opt, i) => (
            <div
              key={i}
              onClick={() => {
                setAnswers(a => ({ ...a, [q.key]: opt }));
                setTimeout(() => setStep(s => s + 1), 200);
              }}
              style={{
                background: answers[q.key] === opt ? tokens.accent : tokens.bgMain,
                color: answers[q.key] === opt ? "white" : tokens.text,
                border: `1.5px solid ${answers[q.key] === opt ? tokens.accent : tokens.border}`,
                borderRadius: 14,
                padding: "18px 20px",
                fontSize: 15,
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "all 0.15s",
                boxShadow: answers[q.key] === opt ? "0 4px 12px rgba(0,122,255,0.25)" : tokens.shadow,
              }}
            >
              {opt}
              <span style={{ opacity: 0.5 }}>›</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20, padding: "12px 16px", background: tokens.bgSubtle, borderRadius: 10 }}>
          <div style={{ fontSize: 11, color: tokens.textLight, textAlign: "center" }}>
            Saat hinta-arvion heti kun vastaat kaikkiin kysymyksiin
          </div>
        </div>
      </div>
    </Phone>
  );
};

const TarjousValmis = ({ onNav }) => (
  <Phone title="Hinta-arvio" onBack={() => onNav(2)} showBack>
    <div style={{ padding: "20px 16px" }}>

      {/* Success */}
      <div style={{ textAlign: "center", padding: "24px 0 32px" }}>
        <div style={{
          width: 72, height: 72, borderRadius: 36,
          background: tokens.green + "18",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 32, margin: "0 auto 16px",
          border: `2px solid ${tokens.green}30`,
        }}>✓</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: tokens.text, marginBottom: 6 }}>Arvio laskettu!</div>
        <div style={{ fontSize: 14, color: tokens.textMid }}>Perustuu vastattuihin tietoihin</div>
      </div>

      {/* Price card */}
      <Card style={{ background: tokens.primary, marginBottom: 16, padding: 28 }}>
        <div style={{ fontSize: 12, color: "#8899AA", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Arvioitu hinta</div>
        <div style={{ fontSize: 48, fontWeight: 800, color: "white", letterSpacing: -1, marginBottom: 4 }}>4 800 €</div>
        <div style={{ fontSize: 13, color: "#8899AA" }}>+ alv — suuntaa antava, tarkentuu kartoituksessa</div>
        <div style={{ height: 1, background: "#ffffff18", margin: "20px 0" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { label: "Tyyppi", value: "Märkätila" },
            { label: "Koko", value: "5–10 m²" },
            { label: "Aikataulu", value: "Pian" },
            { label: "Score", value: "Korkea" },
          ].map((d, i) => (
            <div key={i}>
              <div style={{ fontSize: 10, color: "#8899AA", textTransform: "uppercase", letterSpacing: 0.5 }}>{d.label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "white", marginTop: 2 }}>{d.value}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Breakdown */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: tokens.text, marginBottom: 14 }}>Erittely</div>
        {[
          { item: "Purkutyöt", price: "400–600€" },
          { item: "Vedeneristys", price: "600–800€" },
          { item: "Laattaus", price: "1 200–1 600€" },
          { item: "Putkityöt", price: "800–1 000€" },
          { item: "Viimeistely", price: "400–600€" },
        ].map((r, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between",
            padding: "10px 0",
            borderBottom: i < 4 ? `1px solid ${tokens.bgSubtle}` : "none",
          }}>
            <span style={{ fontSize: 13, color: tokens.textMid }}>{r.item}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: tokens.text }}>{r.price}</span>
          </div>
        ))}
      </Card>

      {/* Actions */}
      <Btn style={{ marginBottom: 10 }}>Lähetä asiakkaalle</Btn>
      <Btn variant="ghost" style={{ marginBottom: 10 }}>Varaa kartoituskäynti</Btn>
      <Btn variant="secondary" onClick={() => onNav(2)}>Tallenna liidille</Btn>
      <div style={{ height: 20 }} />
    </div>
  </Phone>
);

const Asetukset = ({ onNav: _onNav }) => (
  <Phone title="Profiili">
    <div style={{ padding: "16px" }}>

      {/* Profile header */}
      <Card style={{ textAlign: "center", padding: 28, marginBottom: 16 }}>
        <div style={{
          width: 72, height: 72, borderRadius: 36,
          background: tokens.primary,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26, fontWeight: 700, color: "white",
          margin: "0 auto 14px",
        }}>JH</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: tokens.text }}>Jami Harju</div>
        <div style={{ fontSize: 13, color: tokens.textMid, marginTop: 3 }}>Self-Made Capital Oy</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 16 }}>
          {[
            { label: "Liidit", value: "47" },
            { label: "Tarjoukset", value: "18" },
            { label: "Kaupat", value: "12" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: tokens.accent }}>{s.value}</div>
              <div style={{ fontSize: 11, color: tokens.textLight }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Settings sections */}
      {[
        {
          title: "Yritystiedot",
          items: ["Self-Made Capital Oy", "Y: 3193115-8", "Helsinki, Uusimaa"],
        },
        {
          title: "Hinnoittelu",
          items: ["Tuntihinta: 45€/h", "Minimitilaus: 500€", "ALV: 25,5%"],
        },
        {
          title: "Ilmoitukset",
          items: ["Uudet liidit", "Tarjouspyynnöt", "Kalenterimuistutukset"],
        },
      ].map((s, si) => (
        <Card key={si} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: tokens.textMid, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.title}</div>
          {s.items.map((item, ii) => (
            <div key={ii} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "11px 0",
              borderBottom: ii < s.items.length - 1 ? `1px solid ${tokens.bgSubtle}` : "none",
            }}>
              <span style={{ fontSize: 14, color: tokens.text }}>{item}</span>
              <span style={{ color: tokens.textLight, fontSize: 16 }}>›</span>
            </div>
          ))}
        </Card>
      ))}
      <div style={{ height: 20 }} />
    </div>
  </Phone>
);

// ── FLOW MAP ───────────────────────────────────────────────

const FlowArrow = ({ label }) => (
  <div style={{
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", gap: 6, padding: "0 8px",
    color: tokens.textLight, fontSize: 11,
  }}>
    <div style={{ width: 40, height: 1, background: tokens.border, position: "relative" }}>
      <div style={{ position: "absolute", right: -4, top: -4, color: tokens.textMid, fontSize: 10 }}>›</div>
    </div>
    {label && <div style={{ fontSize: 10, color: tokens.textLight, textAlign: "center", maxWidth: 60 }}>{label}</div>}
  </div>
);

// ── MAIN ──────────────────────────────────────────────────

export default function App() {
  const [activeScreen, setActiveScreen] = useState(0);
  const [view, setView] = useState("prototype"); // "prototype" | "flow"

  const renderScreen = () => {
    switch (activeScreen) {
      case 0: return <DashboardScreen onNav={setActiveScreen} />;
      case 1: return <Liidilista onNav={setActiveScreen} />;
      case 2: return <LiidiDetail onNav={setActiveScreen} />;
      case 3: return <Tarjouskone onNav={setActiveScreen} />;
      case 4: return <TarjousValmis onNav={setActiveScreen} />;
      case 5: return <Asetukset onNav={setActiveScreen} />;
      default: return <DashboardScreen onNav={setActiveScreen} />;
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F0EEE8",
      fontFamily: "-apple-system, system-ui, sans-serif",
      padding: "32px 24px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 32,
    }}>

      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: "#999", textTransform: "uppercase", marginBottom: 8 }}>App UI / UX</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: tokens.primary, letterSpacing: -1 }}>Myyntijärjestelmä · Wireframe</div>
      </div>

      {/* View toggle */}
      <div style={{
        display: "flex", gap: 0,
        background: tokens.bgMain,
        border: `1px solid ${tokens.border}`,
        borderRadius: 10, overflow: "hidden",
        boxShadow: tokens.shadow,
      }}>
        {["prototype", "flow"].map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            background: view === v ? tokens.primary : "transparent",
            color: view === v ? "white" : tokens.textMid,
            border: "none",
            padding: "10px 24px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            letterSpacing: 0.3,
          }}>
            {v === "prototype" ? "📱 Prototyyppi" : "🗺 Flow-kartta"}
          </button>
        ))}
      </div>

      {view === "prototype" ? (
        <>
          {/* Screen nav */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {screens.map((s, i) => (
              <button key={i} onClick={() => setActiveScreen(i)} style={{
                background: activeScreen === i ? tokens.primary : tokens.bgMain,
                color: activeScreen === i ? "white" : tokens.textMid,
                border: `1px solid ${activeScreen === i ? tokens.primary : tokens.border}`,
                borderRadius: 20,
                padding: "7px 16px",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}>{s}</button>
            ))}
          </div>

          {/* Active phone */}
          <div style={{ animation: "fadeIn 0.25s ease" }}>
            {renderScreen()}
          </div>
        </>
      ) : (
        /* Flow map */
        <div style={{ maxWidth: 1100, width: "100%" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 0, overflowX: "auto", paddingBottom: 20 }}>
            {[
              { screen: 0, label: "Dashboard" },
              { screen: 1, label: "Liidit" },
              { screen: 2, label: "Liidi" },
              { screen: 3, label: "Tarjouskone" },
              { screen: 4, label: "Tarjous" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <div
                  onClick={() => { setActiveScreen(item.screen); setView("prototype"); }}
                  style={{
                    width: 160, cursor: "pointer",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
                  }}
                >
                  <div style={{
                    width: 140, height: 220,
                    background: tokens.bgMain,
                    borderRadius: 20,
                    border: `2px solid ${activeScreen === item.screen ? tokens.accent : tokens.border}`,
                    overflow: "hidden",
                    boxShadow: tokens.shadowMd,
                    display: "flex", flexDirection: "column",
                    padding: "10px 8px 6px",
                    gap: 5,
                    transition: "transform 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                  >
                    <div style={{ height: 8, background: tokens.bgSubtle, borderRadius: 4, width: "60%", margin: "0 auto 4px" }} />
                    {[...Array(i === 3 ? 4 : 6)].map((_, r) => (
                      <div key={r} style={{
                        height: i === 3 ? 28 : 18,
                        background: r === 0 ? tokens.primary + "20" : tokens.bgSubtle,
                        borderRadius: 6,
                        width: r % 2 === 0 ? "100%" : "75%",
                      }} />
                    ))}
                    {i === 3 && (
                      <div style={{ height: 4, background: tokens.accent, borderRadius: 2, width: "60%", marginTop: 4 }} />
                    )}
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: tokens.text }}>{item.label}</div>
                    <div style={{ fontSize: 10, color: tokens.textLight, marginTop: 2 }}>Screen {item.screen + 1}</div>
                  </div>
                </div>
                {i < 4 && (
                  <FlowArrow label={["Valitse liidi", "Avaa", "Tarjouskone", "Valmis"][i]} />
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div style={{
            marginTop: 24,
            background: tokens.bgMain,
            border: `1px solid ${tokens.border}`,
            borderRadius: 12,
            padding: "20px 24px",
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: tokens.text, marginBottom: 12 }}>User Flow — Liidi → Klousaus</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20, fontSize: 12, color: tokens.textMid }}>
              {[
                { label: "Dashboard", desc: "KPI:t, pipeline, viimeisimmät" },
                { label: "Liidit", desc: "Lista + liidiscore + filtterit" },
                { label: "Liidi", desc: "Yksityiskohdat + aikajana + kontaktointi" },
                { label: "Tarjouskone", desc: "6 kysymystä → hinta-arvio" },
                { label: "Tarjous", desc: "Erittely + lähetys + tallennus" },
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ color: tokens.accent, fontWeight: 700 }}>{i + 1}.</span>
                  <div>
                    <div style={{ fontWeight: 600, color: tokens.text }}>{f.label}</div>
                    <div style={{ fontSize: 11, color: tokens.textLight }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

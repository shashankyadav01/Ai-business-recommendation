import { useState, useEffect } from "react";
import {
  Building2,
  Mail,
  Phone,
  ArrowLeft,
  Briefcase,
  Sparkles,
  MapPin,
  ExternalLink,
} from "lucide-react";

function CompanyDetailPage({
  company,
  recommendations,
  onBack,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!company) {
    return (
      <div style={styles.root}>
        <div style={styles.blob1} />
        <div style={styles.grid} />
        <div style={styles.notFound}>
          <div style={styles.emptyIcon}>
            <Building2 size={28} color="#f59e0b" />
          </div>
          <h2 style={{ color: "#fff", margin: "0 0 8px", fontSize: "18px" }}>Company not found</h2>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px", margin: "0 0 1.5rem" }}>
            The company data could not be loaded.
          </p>
          <button
            onClick={onBack}
            style={styles.backBtn}
            onMouseOver={(e) => (e.currentTarget.style.borderColor = "rgba(245,158,11,0.5)")}
            onMouseOut={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
          >
            <ArrowLeft size={15} color="rgba(255,255,255,0.7)" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    );
  }

  const others = recommendations?.filter((c) => c.name !== company.name) || [];

  return (
    <div style={styles.root}>
      {/* Ambient blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.grid} />

      {/* Navbar */}
      <div style={styles.navbar}>
        <div style={styles.navInner}>
          <div style={styles.navBrand}>
            <div style={styles.navIconBadge}>
              <Building2 size={18} color="#f59e0b" />
            </div>
            <div>
              <h1 style={styles.navTitle}>CompanyMatch AI</h1>
              <p style={styles.navSub}>AI-Powered Business Recommendations</p>
            </div>
          </div>
          <button
            onClick={onBack}
            style={styles.backBtn}
            onMouseOver={(e) => (e.currentTarget.style.borderColor = "rgba(245,158,11,0.4)")}
            onMouseOut={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
          >
            <ArrowLeft size={15} color="rgba(255,255,255,0.6)" />
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>Back</span>
          </button>
        </div>
      </div>

      <div
        style={{
          ...styles.container,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.5s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Top accent line */}
        <div style={styles.accentLine} />

        {/* Main detail card */}
        <div style={styles.mainCard}>
          {/* Header */}
          <div style={styles.cardHeader}>
            <div style={styles.companyIconLarge}>
              <Building2 size={28} color="#f59e0b" />
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={styles.companyName}>{company.name}</h1>
              <div style={styles.badgeRow}>
                <span style={styles.verifiedBadge}>
                  <Sparkles size={11} color="#f59e0b" />
                  AI Matched
                </span>
              </div>
            </div>
          </div>

          <div style={styles.divider} />

          {/* Description */}
          <p style={styles.description}>{company.description}</p>

          {/* Services */}
          {company.services?.length > 0 && (
            <div style={styles.section}>
              <div style={styles.sectionLabel}>
                <Briefcase size={14} color="#22c55e" />
                <span style={styles.sectionLabelText}>Services</span>
              </div>
              <div style={styles.tags}>
                {company.services.map((service, i) => (
                  <span key={i} style={styles.tag}>{service}</span>
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          <div style={styles.section}>
            <div style={styles.sectionLabel}>
              <Mail size={14} color="#60a5fa" />
              <span style={styles.sectionLabelText}>Contact</span>
            </div>
            <div style={styles.contactGrid}>
              {company.email && (
                <a href={`mailto:${company.email}`} style={styles.contactCard}>
                  <Mail size={16} color="#60a5fa" />
                  <div>
                    <p style={styles.contactCardLabel}>Email</p>
                    <p style={styles.contactCardValue}>{company.email}</p>
                  </div>
                  <ExternalLink size={12} color="rgba(255,255,255,0.2)" style={{ marginLeft: "auto" }} />
                </a>
              )}
              {company.phone && (
                <a href={`tel:${company.phone}`} style={styles.contactCard}>
                  <Phone size={16} color="#22c55e" />
                  <div>
                    <p style={styles.contactCardLabel}>Phone</p>
                    <p style={styles.contactCardValue}>{company.phone}</p>
                  </div>
                  <ExternalLink size={12} color="rgba(255,255,255,0.2)" style={{ marginLeft: "auto" }} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Other recommendations */}
        {others.length > 0 && (
          <div style={styles.recommendSection}>
            <div style={styles.recommendHeader}>
              <Sparkles size={16} color="#f59e0b" />
              <h2 style={styles.recommendTitle}>Similar Companies</h2>
              <span style={styles.recommendCount}>{others.length} results</span>
            </div>
            <p style={styles.recommendSub}>Other AI-matched companies for your requirement</p>

            <div style={styles.recommendGrid}>
              {others.map((item, index) => (
                <SmallCard
                  key={index}
                  item={item}
                  index={index}
                  allCompanies={recommendations}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        a { text-decoration: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function SmallCard({
  item,
  index,
  allCompanies,
  onCompanyClick,
}) {
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
  if (onCompanyClick) {
    onCompanyClick(
      item,
      allCompanies
    );
  }
};

  return (
    <div
      onClick={handleClick}
      style={{
        ...styles.smallCard,
        borderColor: hovered ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.08)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        cursor: "pointer",
        animation: `fadeUp 0.4s ease ${index * 60}ms both`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.smallCardHeader}>
        <div style={styles.smallCardIcon}>
          <Building2 size={15} color="#f59e0b" />
        </div>
        <h4 style={styles.smallCardName}>{item.name}</h4>
      </div>
      <p style={styles.smallCardDesc}>{item.description}</p>
      {item.services?.length > 0 && (
        <div style={styles.smallCardTags}>
          {item.services.slice(0, 3).map((s, i) => (
            <span key={i} style={styles.smallTag}>{s}</span>
          ))}
          {item.services.length > 3 && (
            <span style={styles.smallTag}>+{item.services.length - 3}</span>
          )}
        </div>
      )}
      <div style={styles.smallCardFooter}>
        {item.email && (
          <div style={styles.smallContact}>
            <Mail size={11} color="#60a5fa" />
            <span style={styles.smallContactText}>{item.email}</span>
          </div>
        )}
        <span style={styles.viewMore}>
          View details →
        </span>
      </div>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#0a0a0a",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  blob1: {
    position: "fixed",
    top: "-100px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "600px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 65%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  blob2: {
    position: "fixed",
    bottom: "0",
    right: "-100px",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 65%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  grid: {
    position: "fixed",
    inset: 0,
    backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
    backgroundSize: "40px 40px",
    pointerEvents: "none",
    zIndex: 0,
  },
  navbar: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "rgba(10,10,10,0.85)",
    backdropFilter: "blur(16px)",
    borderBottom: "0.5px solid rgba(255,255,255,0.08)",
  },
  navInner: {
    maxWidth: "860px",
    margin: "0 auto",
    padding: "14px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navBrand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  navIconBadge: {
    width: "36px",
    height: "36px",
    background: "rgba(245,158,11,0.1)",
    border: "0.5px solid rgba(245,158,11,0.25)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#ffffff",
    margin: 0,
    letterSpacing: "-0.02em",
  },
  navSub: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.3)",
    margin: 0,
  },
  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "8px 16px",
    background: "rgba(255,255,255,0.04)",
    border: "0.5px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "border-color 0.2s",
  },
  container: {
    maxWidth: "860px",
    margin: "0 auto",
    padding: "2rem 1.5rem 4rem",
    position: "relative",
    zIndex: 1,
  },
  accentLine: {
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.5), transparent)",
    marginBottom: "1.5rem",
  },
  mainCard: {
    background: "rgba(255,255,255,0.04)",
    border: "0.5px solid rgba(255,255,255,0.1)",
    borderRadius: "20px",
    padding: "2rem",
    backdropFilter: "blur(16px)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    marginBottom: "1.25rem",
  },
  companyIconLarge: {
    width: "56px",
    height: "56px",
    minWidth: "56px",
    background: "rgba(245,158,11,0.1)",
    border: "0.5px solid rgba(245,158,11,0.3)",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  companyName: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#ffffff",
    margin: "0 0 8px",
    letterSpacing: "-0.02em",
    lineHeight: 1.2,
  },
  badgeRow: {
    display: "flex",
    gap: "8px",
  },
  verifiedBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "4px 10px",
    background: "rgba(245,158,11,0.1)",
    border: "0.5px solid rgba(245,158,11,0.25)",
    borderRadius: "20px",
    fontSize: "11px",
    color: "#f59e0b",
  },
  divider: {
    height: "0.5px",
    background: "rgba(255,255,255,0.07)",
    marginBottom: "1.25rem",
  },
  description: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.55)",
    lineHeight: 1.75,
    margin: "0 0 1.5rem",
  },
  section: {
    marginBottom: "1.5rem",
  },
  sectionLabel: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    marginBottom: "10px",
  },
  sectionLabelText: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "7px",
  },
  tag: {
    padding: "5px 14px",
    background: "rgba(245,158,11,0.08)",
    border: "0.5px solid rgba(245,158,11,0.2)",
    borderRadius: "20px",
    fontSize: "12px",
    color: "#f59e0b",
  },
  contactGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "10px",
  },
  contactCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 14px",
    background: "rgba(255,255,255,0.04)",
    border: "0.5px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    transition: "border-color 0.2s",
    color: "inherit",
  },
  contactCardLabel: {
    fontSize: "10px",
    color: "rgba(255,255,255,0.3)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    margin: "0 0 2px",
  },
  contactCardValue: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.7)",
    margin: 0,
  },
  recommendSection: {
    marginTop: "2.5rem",
  },
  recommendHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "4px",
  },
  recommendTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#ffffff",
    margin: 0,
    letterSpacing: "-0.02em",
  },
  recommendCount: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.3)",
    background: "rgba(255,255,255,0.06)",
    border: "0.5px solid rgba(255,255,255,0.1)",
    padding: "3px 10px",
    borderRadius: "20px",
  },
  recommendSub: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.3)",
    margin: "0 0 1.25rem",
  },
  recommendGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "12px",
  },
  smallCard: {
    background: "rgba(255,255,255,0.04)",
    border: "0.5px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "1.125rem",
    transition: "border-color 0.2s, transform 0.2s",
  },
  smallCardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "8px",
  },
  smallCardIcon: {
    width: "30px",
    height: "30px",
    minWidth: "30px",
    background: "rgba(245,158,11,0.1)",
    border: "0.5px solid rgba(245,158,11,0.2)",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  smallCardName: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#ffffff",
    margin: 0,
    lineHeight: 1.3,
  },
  smallCardDesc: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.4)",
    lineHeight: 1.6,
    margin: "0 0 10px",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  smallCardTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "5px",
    marginBottom: "10px",
  },
  smallTag: {
    padding: "3px 8px",
    background: "rgba(255,255,255,0.05)",
    border: "0.5px solid rgba(255,255,255,0.09)",
    borderRadius: "20px",
    fontSize: "10px",
    color: "rgba(255,255,255,0.4)",
  },
  smallCardFooter: {
    borderTop: "0.5px solid rgba(255,255,255,0.07)",
    paddingTop: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  smallContact: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  smallContactText: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.35)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "140px",
  },
  viewMore: {
    fontSize: "11px",
    color: "#f59e0b",
    fontWeight: 500,
  },
  notFound: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    zIndex: 1,
  },
  emptyIcon: {
    width: "64px",
    height: "64px",
    background: "rgba(245,158,11,0.1)",
    border: "0.5px solid rgba(245,158,11,0.25)",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1.25rem",
  },
};

export default CompanyDetailPage;
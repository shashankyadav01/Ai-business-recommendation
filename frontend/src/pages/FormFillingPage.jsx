import { useState, useEffect } from "react";
import { Building2, User, Mail, Briefcase, ChevronRight, Users, ArrowRight } from "lucide-react";
import { updateUserProfile } from "../services/api";

function FormFillingPage({ onFormSubmit }) {
  const [membershipType, setMembershipType] = useState(null); // null, "annual", or "partner"
  const [formData, setFormData] = useState({
    // Annual member fields
    fullName: "",
    email: "",
    company: "",
    position: "",
    industry: "",
    businessCategory: "",
    
    // Partner member fields
    partnerName: "",
    partnerEmail: "",
    partnerCompany: "",
    partnerServiceType: "",
    partnerIndustry: "",
    partnerExperience: "",
  });
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateAnnualForm = () => {
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.company.trim() || !formData.position.trim() || !formData.industry.trim() || !formData.businessCategory.trim()) {
      alert("Please fill all fields");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email");
      return false;
    }
    return true;
  };

  const validatePartnerForm = () => {
    if (!formData.partnerName.trim() || !formData.partnerEmail.trim() || !formData.partnerCompany.trim() || !formData.partnerServiceType.trim() || !formData.partnerIndustry.trim() || !formData.partnerExperience.trim()) {
      alert("Please fill all fields");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.partnerEmail)) {
      alert("Please enter a valid email");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = false;
    if (membershipType === "annual") {
      isValid = validateAnnualForm();
    } else if (membershipType === "partner") {
      isValid = validatePartnerForm();
    }

    if (!isValid) return;

    try {
      setLoading(true);
      const profileData = {
        membershipType,
        ...(membershipType === "annual" && {
          fullName: formData.fullName,
          email: formData.email,
          company: formData.company,
          position: formData.position,
          industry: formData.industry,
          businessCategory: formData.businessCategory,
        }),
        ...(membershipType === "partner" && {
          partnerName: formData.partnerName,
          partnerEmail: formData.partnerEmail,
          partnerCompany: formData.partnerCompany,
          partnerServiceType: formData.partnerServiceType,
          partnerIndustry: formData.partnerIndustry,
          partnerExperience: formData.partnerExperience,
        }),
      };
      
      // Save to backend
      await updateUserProfile(profileData);
      
      // Save to localStorage as well
      localStorage.setItem("userProfile", JSON.stringify(profileData));
      
      if (onFormSubmit) onFormSubmit();
    } catch (err) {
      alert(err?.response?.data?.message || "Error saving form data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.root}>
      {/* Ambient glow blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      {/* Grid overlay */}
      <div style={styles.grid} />

      <div style={{ ...styles.wrapper, opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(24px)", transition: "all 0.6s cubic-bezier(0.22,1,0.36,1)" }}>

        {/* Top accent line */}
        <div style={styles.accentLine} />

        {/* Card */}
        <div style={styles.card}>

          {/* Show Membership Type Selector */}
          {membershipType === null ? (
            <>
              {/* Logo area */}
              <div style={styles.logoArea}>
                <div style={styles.iconBadge}>
                  <Users size={22} color="#f59e0b" />
                </div>
                <h1 style={styles.title}>Choose Your Membership</h1>
                <p style={styles.subtitle}>Select the membership type that best fits you</p>
              </div>

              {/* Divider */}
              <div style={styles.divider} />

              {/* Membership Options */}
              <div style={styles.membershipOptions}>
                {/* Annual Member */}
                <div 
                  style={styles.membershipCard}
                  onClick={() => setMembershipType("annual")}
                  onMouseOver={(e) => (e.currentTarget.style.background = "rgba(245,158,11,0.12)")}
                  onMouseOut={(e) => (e.currentTarget.style.background = "rgba(245,158,11,0.08)")}
                >
                  <div style={styles.membershipIcon}>
                    <User size={24} color="#f59e0b" />
                  </div>
                  <h2 style={styles.membershipTitle}>Annual Member</h2>
                  <p style={styles.membershipDesc}>Looking for business recommendations and partnerships</p>
                  <div style={styles.membershipFeatures}>
                    <span style={styles.feature}>✓ Get AI-powered matches</span>
                    <span style={styles.feature}>✓ Access to partner network</span>
                    <span style={styles.feature}>✓ Business insights</span>
                  </div>
                  <div style={styles.selectBtn}>
                    <span>Select</span>
                    <ArrowRight size={14} />
                  </div>
                </div>

                {/* Partner Member */}
                <div 
                  style={styles.membershipCard}
                  onClick={() => setMembershipType("partner")}
                  onMouseOver={(e) => (e.currentTarget.style.background = "rgba(34,197,94,0.12)")}
                  onMouseOut={(e) => (e.currentTarget.style.background = "rgba(34,197,94,0.08)")}
                >
                  <div style={styles.membershipIcon}>
                    <Building2 size={24} color="#22c55e" />
                  </div>
                  <h2 style={styles.membershipTitle}>Partner Member</h2>
                  <p style={styles.membershipDesc}>Offering services or products to businesses</p>
                  <div style={styles.membershipFeatures}>
                    <span style={styles.feature}>✓ Showcase your services</span>
                    <span style={styles.feature}>✓ Connect with prospects</span>
                    <span style={styles.feature}>✓ Grow your business</span>
                  </div>
                  <div style={styles.selectBtn}>
                    <span>Select</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Logo area for form */}
              <div style={styles.logoArea}>
                <div style={styles.iconBadge}>
                  <Briefcase size={22} color="#f59e0b" />
                </div>
                <h1 style={styles.title}>Complete Your Profile</h1>
                <p style={styles.subtitle}>
                  {membershipType === "annual" ? "Tell us about your business" : "Tell us about your services"}
                </p>
              </div>

              {/* Divider */}
              <div style={styles.divider} />

              {/* Form */}
              <form style={styles.form} onSubmit={handleSubmit}>
                {membershipType === "annual" ? (
                  <>
                    {/* Annual Member Form */}
                    <div style={styles.fieldWrap}>
                      <label style={styles.label}>Full Name</label>
                      <div style={styles.inputWrap}>
                        <User size={16} color="rgba(245,158,11,0.5)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                        <input
                          type="text"
                          name="fullName"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={handleChange}
                          style={{ ...styles.input, paddingLeft: "44px" }}
                          onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.6)")}
                          onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                        />
                      </div>
                    </div>

                    <div style={styles.fieldWrap}>
                      <label style={styles.label}>Email Address</label>
                      <div style={styles.inputWrap}>
                        <Mail size={16} color="rgba(245,158,11,0.5)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                        <input
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleChange}
                          style={{ ...styles.input, paddingLeft: "44px" }}
                          onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.6)")}
                          onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                        />
                      </div>
                    </div>

                    <div style={styles.fieldWrap}>
                      <label style={styles.label}>Company Name</label>
                      <div style={styles.inputWrap}>
                        <Building2 size={16} color="rgba(245,158,11,0.5)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                        <input
                          type="text"
                          name="company"
                          placeholder="Enter your company name"
                          value={formData.company}
                          onChange={handleChange}
                          style={{ ...styles.input, paddingLeft: "44px" }}
                          onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.6)")}
                          onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                        />
                      </div>
                    </div>

                    <div style={styles.fieldWrap}>
                      <label style={styles.label}>Job Position</label>
                      <div style={styles.inputWrap}>
                        <Briefcase size={16} color="rgba(245,158,11,0.5)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                        <input
                          type="text"
                          name="position"
                          placeholder="Enter your job position"
                          value={formData.position}
                          onChange={handleChange}
                          style={{ ...styles.input, paddingLeft: "44px" }}
                          onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.6)")}
                          onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                        />
                      </div>
                    </div>

                    <div style={styles.fieldWrap}>
                      <label style={styles.label}>Industry</label>
                      <input
                        type="text"
                        name="industry"
                        placeholder="e.g., IT, Manufacturing, Retail"
                        value={formData.industry}
                        onChange={handleChange}
                        style={styles.input}
                        onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.6)")}
                        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                      />
                    </div>

                    <div style={styles.fieldWrap}>
                      <label style={styles.label}>Business Category</label>
                      <select
                        name="businessCategory"
                        value={formData.businessCategory}
                        onChange={handleChange}
                        style={styles.select}
                        onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.6)")}
                        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                      >
                        <option value="">Select category</option>
                        <option value="B2B">B2B</option>
                        <option value="B2C">B2C</option>
                        <option value="Startup">Startup</option>
                        <option value="Enterprise">Enterprise</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Partner Member Form */}
                    <div style={styles.fieldWrap}>
                      <label style={styles.label}>Contact Person Name</label>
                      <div style={styles.inputWrap}>
                        <User size={16} color="rgba(34,197,94,0.5)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                        <input
                          type="text"
                          name="partnerName"
                          placeholder="Enter contact person name"
                          value={formData.partnerName}
                          onChange={handleChange}
                          style={{ ...styles.input, paddingLeft: "44px", borderColor: "rgba(34,197,94,0.25)" }}
                          onFocus={(e) => (e.target.style.borderColor = "rgba(34,197,94,0.6)")}
                          onBlur={(e) => (e.target.style.borderColor = "rgba(34,197,94,0.25)")}
                        />
                      </div>
                    </div>

                    <div style={styles.fieldWrap}>
                      <label style={styles.label}>Email Address</label>
                      <div style={styles.inputWrap}>
                        <Mail size={16} color="rgba(34,197,94,0.5)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                        <input
                          type="email"
                          name="partnerEmail"
                          placeholder="Enter your email"
                          value={formData.partnerEmail}
                          onChange={handleChange}
                          style={{ ...styles.input, paddingLeft: "44px", borderColor: "rgba(34,197,94,0.25)" }}
                          onFocus={(e) => (e.target.style.borderColor = "rgba(34,197,94,0.6)")}
                          onBlur={(e) => (e.target.style.borderColor = "rgba(34,197,94,0.25)")}
                        />
                      </div>
                    </div>

                    <div style={styles.fieldWrap}>
                      <label style={styles.label}>Company Name</label>
                      <div style={styles.inputWrap}>
                        <Building2 size={16} color="rgba(34,197,94,0.5)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                        <input
                          type="text"
                          name="partnerCompany"
                          placeholder="Enter your company name"
                          value={formData.partnerCompany}
                          onChange={handleChange}
                          style={{ ...styles.input, paddingLeft: "44px", borderColor: "rgba(34,197,94,0.25)" }}
                          onFocus={(e) => (e.target.style.borderColor = "rgba(34,197,94,0.6)")}
                          onBlur={(e) => (e.target.style.borderColor = "rgba(34,197,94,0.25)")}
                        />
                      </div>
                    </div>

                    <div style={styles.fieldWrap}>
                      <label style={styles.label}>Service Type</label>
                      <select
                        name="partnerServiceType"
                        value={formData.partnerServiceType}
                        onChange={handleChange}
                        style={{ ...styles.select, borderColor: "rgba(34,197,94,0.25)" }}
                        onFocus={(e) => (e.target.style.borderColor = "rgba(34,197,94,0.6)")}
                        onBlur={(e) => (e.target.style.borderColor = "rgba(34,197,94,0.25)")}
                      >
                        <option value="">Select service type</option>
                        <option value="Consulting">Consulting</option>
                        <option value="Software">Software/IT Solutions</option>
                        <option value="Marketing">Marketing/Advertising</option>
                        <option value="Logistics">Logistics/Supply Chain</option>
                        <option value="Finance">Finance/Accounting</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div style={styles.fieldWrap}>
                      <label style={styles.label}>Industry Specialization</label>
                      <input
                        type="text"
                        name="partnerIndustry"
                        placeholder="e.g., Tech, Healthcare, Finance"
                        value={formData.partnerIndustry}
                        onChange={handleChange}
                        style={{ ...styles.input, borderColor: "rgba(34,197,94,0.25)" }}
                        onFocus={(e) => (e.target.style.borderColor = "rgba(34,197,94,0.6)")}
                        onBlur={(e) => (e.target.style.borderColor = "rgba(34,197,94,0.25)")}
                      />
                    </div>

                    <div style={styles.fieldWrap}>
                      <label style={styles.label}>Years of Experience</label>
                      <input
                        type="text"
                        name="partnerExperience"
                        placeholder="e.g., 5+ years"
                        value={formData.partnerExperience}
                        onChange={handleChange}
                        style={{ ...styles.input, borderColor: "rgba(34,197,94,0.25)" }}
                        onFocus={(e) => (e.target.style.borderColor = "rgba(34,197,94,0.6)")}
                        onBlur={(e) => (e.target.style.borderColor = "rgba(34,197,94,0.25)")}
                      />
                    </div>
                  </>
                )}

                {/* Button Group */}
                <div style={styles.buttonGroup}>
                  <button
                    type="button"
                    onClick={() => setMembershipType(null)}
                    style={styles.backBtn}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
                    onMouseOver={(e) => (e.currentTarget.style.background = "#fbbf24")}
                    onMouseOut={(e) => (e.currentTarget.style.background = "#f59e0b")}
                  >
                    <span>{loading ? "Processing..." : "Continue to Chat"}</span>
                    {!loading && <ChevronRight size={16} />}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* Footer */}
          {membershipType !== null && (
            <div style={styles.footer}>
              <span style={styles.footerText}>Your information is secure and encrypted</span>
            </div>
          )}
        </div>

      </div>

      <style>{`
        input::placeholder { color: rgba(255,255,255,0.25); }
        input:disabled { cursor: not-allowed; }
        select { appearance: none; }
        select option {
          background-color: #1a1a1a;
          color: #ffffff;
          padding: 8px;
        }
        select option:first-child {
          color: #555555;
        }
        select option:hover {
          background-color: #2a2a2a;
        }
        select option:checked {
          background: linear-gradient(#555555, #555555);
          color: #ffffff;
        }
      `}</style>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#0a0a0a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1.5rem",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },
  blob1: {
    position: "absolute",
    top: "-120px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 65%)",
    pointerEvents: "none",
  },
  blob2: {
    position: "absolute",
    bottom: "-150px",
    right: "-100px",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 65%)",
    pointerEvents: "none",
  },
  grid: {
    position: "absolute",
    inset: 0,
    backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
    backgroundSize: "40px 40px",
    pointerEvents: "none",
  },
  wrapper: {
    width: "100%",
    maxWidth: "480px",
    position: "relative",
    zIndex: 1,
  },
  accentLine: {
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.6), transparent)",
    marginBottom: "0",
    borderRadius: "1px",
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "0.5px solid rgba(255,255,255,0.1)",
    borderTop: "none",
    borderRadius: "0 0 20px 20px",
    padding: "2rem",
    backdropFilter: "blur(16px)",
  },
  logoArea: {
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  iconBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "52px",
    height: "52px",
    background: "rgba(245,158,11,0.1)",
    border: "0.5px solid rgba(245,158,11,0.3)",
    borderRadius: "14px",
    marginBottom: "1rem",
  },
  title: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#ffffff",
    margin: "0 0 6px",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.3)",
    margin: 0,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  divider: {
    height: "0.5px",
    background: "rgba(255,255,255,0.07)",
    marginBottom: "1.5rem",
  },
  membershipOptions: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "12px",
  },
  membershipCard: {
    background: "rgba(245,158,11,0.08)",
    border: "0.5px solid rgba(245,158,11,0.3)",
    borderRadius: "12px",
    padding: "1.25rem",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  membershipIcon: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    background: "rgba(245,158,11,0.1)",
    borderRadius: "8px",
    marginBottom: "0.75rem",
  },
  membershipTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#ffffff",
    margin: "0 0 6px",
  },
  membershipDesc: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.4)",
    margin: "0 0 1rem",
    lineHeight: 1.4,
  },
  membershipFeatures: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "1rem",
  },
  feature: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.3)",
  },
  selectBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#f59e0b",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  fieldWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  inputWrap: {
    position: "relative",
  },
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "0.5px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    padding: "12px 14px",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  select: {
    width: "100%",
    background: "rgba(0,0,0,0.4)",
    border: "0.5px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    padding: "12px 14px",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    cursor: "pointer",
  },
  buttonGroup: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: "10px",
    marginTop: "0.25rem",
  },
  backBtn: {
    background: "rgba(255,255,255,0.08)",
    border: "0.5px solid rgba(255,255,255,0.2)",
    borderRadius: "10px",
    padding: "13px",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  submitBtn: {
    width: "100%",
    background: "#f59e0b",
    border: "none",
    borderRadius: "10px",
    padding: "13px",
    color: "#000",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.2s, transform 0.1s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  footer: {
    marginTop: "1.75rem",
    paddingTop: "1.25rem",
    borderTop: "0.5px solid rgba(255,255,255,0.07)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.2)",
    letterSpacing: "0.03em",
  },
};

export default FormFillingPage;

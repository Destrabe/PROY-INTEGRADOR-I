// app/perfil/styles.js

export const s = {
  // Layout y contenedores
  root: {
    minHeight: "calc(100vh - 90px)",
    backgroundColor: "#0a0a0f",
    fontFamily: "var(--font-dm-sans), sans-serif",
    padding: "32px 24px",
    margin: "0 auto",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 90px)",
    color: "#555",
    fontSize: "14px",
    backgroundColor: "#0a0a0f",
  },
  notFound: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "calc(100vh - 90px)",
    color: "#555",
    backgroundColor: "#0a0a0f",
    gap: "12px",
  },
  emptyMsg: {
    color: "#444",
    fontSize: "13px",
    textAlign: "center",
    padding: "24px 0",
  },

  // Navegación
  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    color: "#dddddd",
    fontSize: "13px",
    cursor: "pointer",
    marginBottom: "20px",
    background: "none",
    border: "none",
    fontFamily: "var(--font-dm-sans), sans-serif",
  },

  // Header y avatar
  headerCard: {
    backgroundColor: "#13131f",
    border: "1px solid #1e1e30",
    borderRadius: "20px",
    padding: "28px 32px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "flex-start",
    gap: "24px",
    flexWrap: "wrap",
  },
  avatarWrap: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    backgroundColor: "#2a1f6e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    fontWeight: 800,
    color: "#a78bfa",
    flexShrink: 0,
    fontFamily: "var(--font-syne), sans-serif",
    overflow: "hidden",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  headerMain: {
    flex: 1,
    minWidth: "180px",
  },
  nameRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "4px",
  },
  name: {
    fontFamily: "var(--font-syne), sans-serif",
    fontWeight: 800,
    fontSize: "24px",
    color: "#fff",
  },
  verifiedBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    backgroundColor: "#1e1a3a",
    color: "#a78bfa",
    border: "1px solid #4a3aaa",
    borderRadius: "20px",
    fontSize: "12px",
    padding: "3px 12px",
    fontWeight: 600,
  },
  rolBadge: (rol) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    backgroundColor: rol === "cliente" ? "#1a2d1a" : "#1a1a2e",
    color: rol === "cliente" ? "#4ade80" : "#a78bfa",
    border: `1px solid ${rol === "cliente" ? "#166534" : "#4a3aaa"}`,
    borderRadius: "20px",
    fontSize: "11px",
    padding: "3px 10px",
    fontWeight: 600,
  }),
  email: {
    color: "#555",
    fontSize: "13px",
    marginBottom: "8px",
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    color: "#888",
    fontSize: "13px",
    marginBottom: "8px",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  dot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    backgroundColor: "#4ade80",
    display: "inline-block",
  },
  bioText: {
    color: "#888",
    fontSize: "14px",
    lineHeight: "1.7",
    marginTop: "8px",
  },

  // Acciones del header
  headerActions: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    minWidth: "140px",
  },
  btnPrimary: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    backgroundColor: "#500fe9",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "11px 20px",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "var(--font-dm-sans), sans-serif",
    whiteSpace: "nowrap",
  },
  btnSecondary: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    backgroundColor: "transparent",
    color: "#ccc",
    border: "1px solid #2e2e45",
    borderRadius: "10px",
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "var(--font-dm-sans), sans-serif",
    whiteSpace: "nowrap",
  },
  btnContratar: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    backgroundColor: "#0f2d1a",
    color: "#22c55e",
    border: "1px solid #16a34a",
    borderRadius: "10px",
    padding: "11px 20px",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "var(--font-dm-sans), sans-serif",
    whiteSpace: "nowrap",
  },
  btnContratarLoading: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2a2a3e",
    color: "#666",
    border: "none",
    borderRadius: "10px",
    padding: "11px 20px",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "not-allowed",
    fontFamily: "var(--font-dm-sans), sans-serif",
    whiteSpace: "nowrap",
  },

  // Stats grid
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(120px, 1fr))",
    gap: "12px",
    marginBottom: "20px",
  },
  statCard: {
    backgroundColor: "#13131f",
    border: "1px solid #1e1e30",
    borderRadius: "14px",
    padding: "18px 12px",
    textAlign: "center",
  },
  statValue: {
    fontFamily: "var(--font-syne), sans-serif",
    fontWeight: 800,
    fontSize: "22px",
    color: "#fff",
    marginBottom: "4px",
  },
  statLabel: {
    color: "#666",
    fontSize: "12px",
  },

  // Columnas
  columns: {
    display: "flex",
    gap: "16px",
    alignItems: "flex-start",
  },
  leftCol: {
    width: "240px",
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  rightCol: {
    flex: 1,
    minWidth: 0,
  },

  // Secciones de información
  section: {
    backgroundColor: "#13131f",
    border: "1px solid #1e1e30",
    borderRadius: "16px",
    padding: "22px",
    marginBottom: "14px",
  },
  sectionTitle: {
    fontFamily: "var(--font-syne), sans-serif",
    fontWeight: 700,
    fontSize: "13px",
    color: "#888",
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginBottom: "16px",
  },
  infoRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#ccc",
    fontSize: "14px",
    marginBottom: "12px",
  },
  infoIcon: {
    color: "#a78bfa",
    fontSize: "16px",
    width: "20px",
    textAlign: "center",
  },
  chip: {
    display: "inline-block",
    backgroundColor: "#1e1a3a",
    color: "#a78bfa",
    border: "1px solid #2e2060",
    borderRadius: "20px",
    fontSize: "12px",
    padding: "5px 14px",
    marginRight: "6px",
    marginBottom: "6px",
    fontWeight: 500,
  },

  // Reputación (barras de progreso)
  repRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
    fontSize: "13px",
  },
  repLabel: {
    color: "#888",
    width: "110px",
    flexShrink: 0,
  },
  repBarBg: {
    flex: 1,
    height: "4px",
    backgroundColor: "#1e1e30",
    borderRadius: "4px",
    overflow: "hidden",
  },
  repBarFill: (pct) => ({
    height: "100%",
    width: `${pct}%`,
    background: "linear-gradient(90deg, #500fe9, #a78bfa)",
    borderRadius: "4px",
  }),
  repValue: {
    color: "#ccc",
    fontSize: "13px",
    fontWeight: 600,
    width: "28px",
    textAlign: "right",
  },

  // Tabs
  tabs: {
    display: "flex",
    borderBottom: "1px solid #1e1e30",
    marginBottom: "18px",
    flexWrap: "wrap",
  },
  tab: (active) => ({
    padding: "10px 18px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    border: "none",
    background: "none",
    color: active ? "#a78bfa" : "#555",
    borderBottom: active ? "2px solid #a78bfa" : "2px solid transparent",
    fontFamily: "var(--font-dm-sans), sans-serif",
    transition: "color .2s",
  }),

  // Tarjetas de trabajos / postulaciones
  workCard: {
    backgroundColor: "#0d0d1a",
    border: "1px solid #1e1e30",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "10px",
  },
  workTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "4px",
  },
  workTitle: {
    color: "#fff",
    fontSize: "15px",
    fontWeight: 700,
  },
  workAmount: {
    color: "#a78bfa",
    fontSize: "14px",
    fontWeight: 700,
  },
  workMeta: {
    color: "#555",
    fontSize: "12px",
    marginBottom: "8px",
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  workDesc: {
    color: "#666",
    fontSize: "13px",
    lineHeight: "1.5",
    marginBottom: "10px",
  },
  tagRow: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "#1a1a2e",
    color: "#888",
    borderRadius: "20px",
    fontSize: "11px",
    padding: "3px 10px",
    border: "1px solid #2a2a40",
  },
  statusBadge: (estado) => ({
    display: "inline-block",
    borderRadius: "20px",
    fontSize: "11px",
    padding: "3px 10px",
    fontWeight: 600,
    backgroundColor:
      estado === "completada"
        ? "#14532d"
        : estado === "en_progreso"
        ? "#1e3a5f"
        : estado === "cancelada"
        ? "#450a0a"
        : "#1e1a3a",
    color:
      estado === "completada"
        ? "#4ade80"
        : estado === "en_progreso"
        ? "#60a5fa"
        : estado === "cancelada"
        ? "#f87171"
        : "#a78bfa",
    border: `1px solid ${
      estado === "completada"
        ? "#16a34a"
        : estado === "en_progreso"
        ? "#3b82f6"
        : estado === "cancelada"
        ? "#dc2626"
        : "#4a3aaa"
    }`,
  }),

  // Tarjetas de reseñas
  reviewCard: {
    borderBottom: "1px solid #1a1a2e",
    paddingBottom: "16px",
    marginBottom: "16px",
  },
  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "4px",
  },
  reviewAuthor: {
    color: "#ccc",
    fontSize: "14px",
    fontWeight: 700,
  },
  reviewDate: {
    color: "#444",
    fontSize: "12px",
  },
  stars: {
    color: "#f59e0b",
    fontSize: "13px",
    marginBottom: "6px",
  },
  reviewText: {
    color: "#666",
    fontSize: "13px",
    lineHeight: "1.5",
  },
};
// Section ids per page, in their default order, with the names the dashboard
// shows. The pages pass their sections to <Sections>, which applies the
// order and visibility saved from the dashboard.
export const pageSections: Record<string, { id: string; label: string }[]> = {
  home: [
    { id: "hero", label: "Hero (statement + work wall)" },
    { id: "logos", label: "Client logos strip" },
    { id: "featured", label: "Selected work (case studies)" },
    { id: "master", label: "Key Visuals" },
    { id: "brands", label: "Brand identities" },
    { id: "concepts", label: "Concept lab (self-initiated key visuals)" },
    { id: "craft", label: "The craft (tabs: AI, social, lettering, storyboards, motion, 3D, web)" },
    { id: "academy", label: "Academy band" },
    { id: "recommendations", label: "Recommendations" },
    { id: "services", label: "Services" },
    { id: "hire", label: "Hire band" },
  ],
  about: [
    { id: "aboutHero", label: "About hero" },
    { id: "about", label: "Bio" },
    { id: "clients", label: "Clients" },
    { id: "experience", label: "Experience" },
    { id: "recommendations", label: "Recommendations" },
    { id: "featured", label: "Featured on LinkedIn" },
    { id: "teaching", label: "Academy band" },
    { id: "skills", label: "Capabilities" },
    { id: "tools", label: "Toolkit" },
    { id: "hire", label: "Hire band" },
  ],
};

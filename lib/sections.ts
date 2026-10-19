// Section ids per page, in their default order, with the names the dashboard
// shows. The pages pass their sections to <Sections>, which applies the
// order and visibility saved from the dashboard.
export const pageSections: Record<string, { id: string; label: string }[]> = {
  home: [
    { id: "hero", label: "Hero banner" },
    { id: "logos", label: "Client logos strip" },
    { id: "ai", label: "AI Work Flow" },
    { id: "master", label: "Key Visuals" },
    { id: "type", label: "Type Design" },
    { id: "social", label: "Social Media Designs" },
    { id: "slider", label: "Selected designs wall" },
    { id: "storyboards", label: "Storyboards" },
    { id: "motion", label: "Motion & Video" },
    { id: "threeD", label: "3D Product Rendering" },
    { id: "web", label: "Vibe Coding (websites)" },
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
    { id: "teaching", label: "Teaching" },
    { id: "skills", label: "Capabilities" },
    { id: "tools", label: "Toolkit" },
    { id: "hire", label: "Hire band" },
  ],
};

/* =====================================================================
   SITE CONFIG  -  EDIT THIS FILE to update the website.
   - Paste LinkedIn / Google Scholar / DOI / email here.
   - Add/remove papers in the "papers" array (they auto-fill the
     Publications list, the hero Highlights, and the "Learn more" popup).
   - Put image files in the  images/  folder and reference them below
     (logo.png, sir.png, pub-1.png.., gallery-1.jpg..).
   If this file is missing, the site still works with built-in defaults.
   ===================================================================== */
window.SITE_CONFIG = {

  lab: {
    name: "AQAR Lab",
    logo: "images/logo.png"          // drop your lab logo as images/logo.png
  },

  pi: {
    name: "Dr. Debananda Roy",
    title: "Assistant Professor · Department of Earth Sciences, IISER Kolkata",
    topic: "Airborne particulate matter, microplastics & black carbon, and bioaerosols; human health risk assessment in subway, indoor, and ambient environments.",
    photo: "images/sir.png",
    email: "debanandaroy@iiserkol.ac.in",
    linkedin: "https://www.linkedin.com/in/debananda-roy-56582a26",
    scholar: "https://scholar.google.com/citations?user=OiG1xgsAAAAJ&hl=en",
    // Live publication count: leave publicationCount "" to fetch it live (Semantic Scholar).
    // Google Scholar blocks live browser reads, so set an exact number here to override.
    scholarAuthorId: "14198324",
    publicationCount: "42"
  },

  // Each paper auto-appears in Publications + the hero Highlights + the popup.
  // Provide "doi" and/or "scholar"; either or both will show as buttons.
  papers: [
    { year: 2025, type: "journal",
      title: "Microplastics bound to fine particulate matter in subway air: a pathway for toxic metal transport to enhanced carcinogenicity in human lungs",
      authors: "D. Roy, M. Murmu, S. Mandal, P. Banerjee, M. Lee, J. Park",
      venue: "Journal of Hazardous Materials, 140721",
      img: "images/pub-1.png",
      doi: "https://doi.org/10.1016/j.jhazmat.2025.140721",
      scholar: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=OiG1xgsAAAAJ&citation_for_view=OiG1xgsAAAAJ:isC4tDSrTZIC" },

    { year: 2024, type: "journal",
      title: "PM10-bound microplastics and trace metals: a public health insight from the Korean subway and indoor environments",
      authors: "D. Roy, J. Kim, M. Lee, S. Kim, J. Park",
      venue: "Journal of Hazardous Materials, Vol. 477, 135156",
      img: "images/pub-2.png",
      doi: "https://doi.org/10.1016/j.jhazmat.2024.135156",
      scholar: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=OiG1xgsAAAAJ&citation_for_view=OiG1xgsAAAAJ:4JMBOYKVnBMC" },

    { year: 2024, type: "journal",
      title: "Particulate matter and black carbon exposure in Seoul subway: implications for human health risk",
      authors: "D. Roy, H. Lim, S. Kim, S. Song, J. Park",
      venue: "Journal of Building Engineering, Vol. 95, 110091",
      img: "images/pub-3.png",
      doi: "https://doi.org/10.1016/j.jobe.2024.110091",
      scholar: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=OiG1xgsAAAAJ&citation_for_view=OiG1xgsAAAAJ:j3f4tGmQtD8C" },

    { year: 2024, type: "conference",
      title: "Public health perspectives on PM10-bound microplastics and trace metals in Korean subways and indoor environments",
      authors: "D. Roy, W. Jung, M. Lee, S. Kim, J. Park",
      venue: "KSCE Annual Conference, pp. 228-229",
      img: "images/pub-4.png",
      scholar: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=OiG1xgsAAAAJ&citation_for_view=OiG1xgsAAAAJ:iH-uZ7U-co4C" },

    { year: 2023, type: "journal",
      title: "Adverse impacts of Asian dust events on human health and the environment: a probabilistic risk assessment study on PM-bound metals and bacteria in Seoul",
      authors: "D. Roy, J. Kim, M. Lee, J. Park",
      venue: "Science of the Total Environment, Vol. 875, 162637",
      img: "images/pub-5.png",
      doi: "https://doi.org/10.1016/j.scitotenv.2023.162637",
      scholar: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=OiG1xgsAAAAJ&citation_for_view=OiG1xgsAAAAJ:9ZlFYXVOiuMC" },

    { year: 2023, type: "conference",
      title: "Particulate matter pollution levels and adverse impacts on human health and the environment during Asian dust events in Seoul",
      authors: "D. Roy, J. Kim, M. Lee, J. Park",
      venue: "AGU Fall Meeting 2023 (AGU23)",
      img: "images/pub-6.png",
      scholar: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=OiG1xgsAAAAJ&citation_for_view=OiG1xgsAAAAJ:IWHjjKOFINEC" },

    { year: 2022, type: "journal",
      title: "Commuters' health risk associated with particulate matter exposures in subway system, globally",
      authors: "D. Roy, E.S. Lyou, J. Kim, T.K. Lee, J. Park",
      venue: "Building and Environment",
      scholar: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=OiG1xgsAAAAJ&citation_for_view=OiG1xgsAAAAJ:4DMP91E08xMC" },

    { year: 2022, type: "journal",
      title: "Polycyclic aromatic hydrocarbons in soil and human health risk levels for various land-use areas in Ulsan, South Korea",
      authors: "D. Roy, W. Jung, J. Kim, M. Lee, J. Park",
      venue: "Frontiers in Environmental Science, Vol. 9, 744387",
      doi: "https://doi.org/10.3389/fenvs.2021.744387",
      scholar: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=OiG1xgsAAAAJ&citation_for_view=OiG1xgsAAAAJ:dhFuZR0502QC" },

    { year: 2021, type: "journal",
      title: "Cancer risk levels for sediment- and soil-bound polycyclic aromatic hydrocarbons in coastal areas of South Korea",
      authors: "D. Roy, W. Jung, J. Kim, M. Lee, J. Park",
      venue: "Frontiers in Environmental Science, Vol. 9, 719243",
      doi: "https://doi.org/10.3389/fenvs.2021.719243",
      scholar: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=OiG1xgsAAAAJ&citation_for_view=OiG1xgsAAAAJ:M3ejUd6NZC8C" },

    { year: 2022, type: "book",
      title: "Solid waste management and landfill in high-income countries",
      authors: "D. Roy, A. Tarafdar",
      venue: "Circular Economy in Municipal Solid Waste Landfilling, Springer",
      doi: "https://doi.org/10.1007/978-3-031-07785-2_1" }
  ],

  // Drop gallery photos into images/ and list them here (or leave [] for placeholders)
  gallery: [],

  // MEMBERS: paste each person's LinkedIn and email here; the site updates automatically.
  // Email buttons open a Gmail compose window. Leave a value as "" to keep the icon placeholder.
  members: {
    aashish:   { name: "Aashish Kumar",        linkedin: "https://in.linkedin.com/in/aashish-kumar-933a4516a", email: "ak25rs078@iiserkol.ac.in" },
    aviyank:   { name: "Aviyank Aryan",        linkedin: "https://in.linkedin.com/in/aviyank-aryan-67a520207", email: "aa22ms030@iiserkol.ac.in" },
    shashi:    { name: "Shashi Ranjan Singh",  linkedin: "https://in.linkedin.com/in/shashi-ranjan-singh-bbb964251", email: "srs22ms084@iiserkol.ac.in" },
    pritam:    { name: "Pritam Konai",         linkedin: "https://in.linkedin.com/in/pritam-konai-a46a74293", email: "pk23ms182@iiserkol.ac.in" },
    dheeraj:   { name: "Dheeraj Kumar Mandal", linkedin: "https://in.linkedin.com/in/dheeraj-kumar-mandal-b976b5229", email: "dkm25ip003@iiserkol.ac.in" },
    kaoshikii: { name: "Kaoshikii Sinha",      linkedin: "https://in.linkedin.com/in/kaoshikii-sinha-78613937b", email: "ks25mp009@iiserkol.ac.in" },
    subhankar: { name: "Subhankar Gharui",     linkedin: "https://in.linkedin.com/in/subhankar-gharui-56669934a", email: "sg25mp027@iiserkol.ac.in" },
    shubham:   { name: "Shubham Mishra",       linkedin: "https://in.linkedin.com/in/shubham-mishra-162b18254", email: "sm25mp047@iiserkol.ac.in" },
    tanveen:   { name: "Tanveen Nayad Islam",  linkedin: "https://in.linkedin.com/in/tanveen-nayad-366963182", email: "tni25mp032@iiserkol.ac.in" },
    asmit:     { name: "Asmit Gupta",          linkedin: "https://in.linkedin.com/in/asmit-gupta-45851a271", email: "ag22ms225@iiserkol.ac.in" },
    rahul:     { name: "Rahul Ranjan",         linkedin: "https://in.linkedin.com/in/rahul-ranjan022", email: "rr25mp020@iiserkol.ac.in" }
  }
};

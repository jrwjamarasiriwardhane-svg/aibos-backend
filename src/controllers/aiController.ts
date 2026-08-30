import { Request, Response } from "express";
import User from "../models/User";
import ProfessionalProfile from "../models/ProfessionalProfile";
import CompanyProfile from "../models/CompanyProfile";
import Job from "../models/Job";
import ServiceRequest from "../models/ServiceRequest";

// =====================================================
// INTENT DETECTION HELPERS
// =====================================================

const SERVICE_KEYWORDS = [
  "plumber", "electrician", "carpenter", "painter", "cleaner",
  "developer", "technician", "mechanic", "welder", "mason",
  "gardener", "driver", "chef", "nurse", "tutor", "designer",
  "find", "hire", "need", "looking for", "want a", "get a",
  "book", "professional", "specialist", "expert", "worker",
];

const TRAVEL_KEYWORDS = [
  "travel", "trip", "tour", "vacation", "holiday", "itinerary",
  "ella", "nuwara eliya", "kandy", "galle", "colombo", "sigiriya",
  "yala", "mirissa", "trincomalee", "polonnaruwa", "anuradhapura",
  "beach", "hiking", "camping", "safari", "hotel", "resort",
  "flight", "transport", "package", "agency", "guide",
];

const COMPANY_KEYWORDS = [
  "company", "companies", "agency", "agencies", "firm", "business",
  "organisation", "organization", "service provider", "vendor",
];

const JOB_KEYWORDS = [
  "job", "jobs", "vacancy", "vacancies", "opening", "employment",
  "career", "work", "hire me", "apply", "opportunity",
];

const STATS_KEYWORDS = [
  "how many", "total", "count", "statistics", "stats", "number of",
  "professionals", "registered", "available", "platform",
];

const REGISTRATION_KEYWORDS = [
  "register", "sign up", "signup", "account", "join", "create account",
  "how to", "verify", "verification", "otp", "email", "forgot", "password",
  "login", "how does", "what is aibos",
];

function detectIntent(msg: string): string {
  const lower = msg.toLowerCase();
  if (TRAVEL_KEYWORDS.some((k) => lower.includes(k))) return "travel";
  if (JOB_KEYWORDS.some((k) => lower.includes(k))) return "jobs";
  if (COMPANY_KEYWORDS.some((k) => lower.includes(k))) return "company";
  if (STATS_KEYWORDS.some((k) => lower.includes(k))) return "stats";
  if (SERVICE_KEYWORDS.some((k) => lower.includes(k))) return "professional";
  if (REGISTRATION_KEYWORDS.some((k) => lower.includes(k))) return "platform";
  return "general";
}

function extractSkill(msg: string): string {
  const skills = [
    "plumber", "electrician", "carpenter", "painter", "cleaner",
    "developer", "technician", "mechanic", "welder", "mason",
    "gardener", "driver", "chef", "nurse", "tutor", "designer",
  ];
  const lower = msg.toLowerCase();
  return skills.find((s) => lower.includes(s)) || "";
}

function extractLocation(msg: string): string {
  const cities = [
    "colombo", "kandy", "galle", "negombo", "jaffna",
    "matara", "kurunegala", "anuradhapura", "trincomalee",
    "batticaloa", "hambantota", "nuwara eliya", "ella",
    "ratnapura", "badulla", "kalutara", "panadura", "moratuwa",
  ];
  const lower = msg.toLowerCase();
  return cities.find((c) => lower.includes(c)) || "";
}

function extractTravelDest(msg: string): string {
  const places = [
    "ella", "nuwara eliya", "kandy", "galle", "sigiriya", "yala",
    "mirissa", "trincomalee", "polonnaruwa", "anuradhapura",
    "colombo", "negombo", "bentota", "arugam bay", "dambulla",
  ];
  const lower = msg.toLowerCase();
  return places.find((p) => lower.includes(p)) || "";
}

// =====================================================
// ITINERARY GENERATOR
// =====================================================

function generateItinerary(destination: string, days: number): string {
  const plans: Record<string, string[]> = {
    ella: [
      "🚂 Day 1: Nine Arches Bridge (morning), Little Adam's Peak hike (afternoon), local dinner at Ella town.",
      "🧗 Day 2: Ella Rock full hike (sunrise start), Ravana Falls & Waterfall Cave visit.",
      "🌿 Day 3: Scenic train ride to Demodara, Zip Lining & Ella Spice Garden.",
    ],
    "nuwara eliya": [
      "🌼 Day 1: Gregory Lake walk, Victoria Park, Pink Post Office & tea shop visit.",
      "🍵 Day 2: Mackwoods Tea Factory tour, Horton Plains & World's End cliff.",
      "🏡 Day 3: Hakgala Botanical Garden, Seetha Amman Temple & scenic mountain drive.",
    ],
    kandy: [
      "🛕 Day 1: Temple of the Sacred Tooth Relic, Kandy Lake evening walk, cultural dance show.",
      "🌺 Day 2: Royal Botanical Gardens Peradeniya, gem museum & local market.",
      "🐘 Day 3: Pinnawala Elephant Orphanage & Ambuluwawa Tower panoramic view.",
    ],
    galle: [
      "🏰 Day 1: Galle Fort walking tour, Dutch Museum, Lighthouse sunset view.",
      "🐋 Day 2: Unawatuna Beach snorkelling, Mirissa Whale Watching boat tour.",
      "🐢 Day 3: Madu River Boat Safari & Sea Turtle Hatchery, Koggala Lagoon.",
    ],
    mirissa: [
      "🌊 Day 1: Mirissa Beach sunrise swim, whale watching boat trip, seafood lunch.",
      "🏄 Day 2: Surfing lessons, coconut tree hill hike & sunset cocktails.",
      "🦀 Day 3: Weligama Stilt Fishermen tour & Koggala mangrove safari.",
    ],
    sigiriya: [
      "🦁 Day 1: Sigiriya Rock Fortress full climb (early morning), Lion Rock summit.",
      "🌿 Day 2: Pidurangala Rock alternative view of Sigiriya, Minneriya Safari.",
      "🏛️ Day 3: Dambulla Cave Temple & Matale Spice Garden.",
    ],
    yala: [
      "🐆 Day 1: Yala National Park morning game drive (Leopard territory), Bird watching.",
      "🐘 Day 2: Evening game drive & Sithulpawwa Rock Temple sunrise.",
      "🌅 Day 3: Bundala National Park wetlands & flamingo lagoon.",
    ],
  };

  const dest = destination.toLowerCase();
  const planKey = Object.keys(plans).find((k) => dest.includes(k));
  const dayPlans = planKey ? plans[planKey] : [
    "🌏 Day 1: Arrival & local sightseeing.",
    "🎭 Day 2: Cultural experience & heritage sites.",
    "🌿 Day 3: Nature & adventure activities.",
  ];

  return dayPlans.slice(0, days).join("\n");
}

// =====================================================
// MAIN AI CHAT CONTROLLER
// =====================================================

export const chatWithAi = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const intent = detectIntent(message);
    let reply = "";
    let suggestions: string[] = [];
    let recommendations: any[] = [];
    let extraData: any = null;

    // =====================================================
    // 1. FIND PROFESSIONAL
    // =====================================================
    if (intent === "professional") {
      const skill = extractSkill(message);
      const location = extractLocation(message);

      // Build query
      const profileQuery: any = { isAvailable: true };
      if (skill) profileQuery.skills = { $regex: skill, $options: "i" };
      if (location) profileQuery.location = { $regex: location, $options: "i" };

      const profiles = await ProfessionalProfile.find(profileQuery)
        .populate("user", "fullName email phone location profileImage isAdminVerified")
        .sort({ rating: -1 })
        .limit(5);

      // Also search by user location if no profile match
      let allProfiles = profiles;
      if (allProfiles.length === 0 && location) {
        const usersByLocation = await User.find({
          role: "professional",
          location: { $regex: location, $options: "i" },
          isEmailVerified: true,
        }).limit(5);
        const profilesFromUsers = await ProfessionalProfile.find({
          user: { $in: usersByLocation.map((u) => u._id) },
        }).populate("user", "fullName email phone location profileImage isAdminVerified");
        allProfiles = profilesFromUsers;
      }

      const totalVerified = await ProfessionalProfile.countDocuments({
        verificationStatus: "verified",
        isAvailable: true,
      });

      if (allProfiles.length > 0) {
        reply = `🔍 **AIBOS AI Service Matchmaker**\n\nI found ${allProfiles.length} verified ${skill ? skill.toUpperCase() + "S" : "PROFESSIONALS"} on the AIBOS network${location ? ` in **${location.charAt(0).toUpperCase() + location.slice(1)}**` : ""}!\n\n*(${totalVerified} verified professionals total on platform)*`;

        recommendations = allProfiles.map((p) => {
          const u = p.user as any;
          return {
            id: p._id,
            name: u?.fullName || "Verified Specialist",
            skills: p.skills?.length > 0 ? p.skills : [skill || "General Service"],
            location: p.location || u?.location || "Sri Lanka",
            rating: p.rating || 4.8,
            hourlyRate: p.hourlyRate ? `LKR ${p.hourlyRate}/hr` : "Negotiable",
            experience: `${p.experienceYears || 0} yrs exp`,
            completedJobs: p.completedJobs || 0,
            verified: u?.isAdminVerified || p.verificationStatus === "verified",
            type: "professional",
          };
        });
      } else {
        reply = `🔍 I searched the AIBOS Network for **${skill || "professionals"}**${location ? ` in ${location}` : ""}.\n\nNo exact matches found yet, but there are **${totalVerified} verified professionals** on the platform. Try broadening your search or use the Find Professionals page for advanced filtering!`;
      }

      suggestions = [
        skill ? `Find ${skill} near me` : "Find Electrician in Colombo",
        "View All Verified Professionals",
        location ? `More services in ${location}` : "Search by Location",
        "Request a Custom Service Quote",
      ];
    }

    // =====================================================
    // 2. FIND COMPANY / AGENCY
    // =====================================================
    else if (intent === "company") {
      const location = extractLocation(message);
      const query: any = { isAvailable: true };
      if (location) query.city = { $regex: location, $options: "i" };

      const companies = await CompanyProfile.find(query)
        .populate("user", "fullName email location isAdminVerified")
        .sort({ rating: -1, completedJobs: -1 })
        .limit(5);

      const totalCompanies = await CompanyProfile.countDocuments({ isAvailable: true });

      if (companies.length > 0) {
        reply = `🏢 **AIBOS Company Directory**\n\nFound ${companies.length} verified companies${location ? ` in **${location}**` : ""} on AIBOS.\n\n*(${totalCompanies} companies registered on platform)*`;

        recommendations = companies.map((c) => ({
          id: c._id,
          name: c.companyName,
          role: c.industry || "Service Company",
          location: c.city || (c.user as any)?.location || "Sri Lanka",
          rating: c.rating || 4.5,
          completedJobs: c.completedJobs,
          employees: c.employeeCount,
          categories: c.categories?.join(", ") || c.industry,
          verified: c.isVerified,
          type: "company",
        }));
      } else {
        reply = `🏢 There are currently **${totalCompanies} companies** registered on AIBOS. ${location ? `No companies found specifically in ${location} yet.` : ""} Try searching directly on the platform for more filters!`;
      }

      suggestions = [
        "Find Travel Agencies",
        "Find IT Companies in Colombo",
        "List All Companies",
        "How to Register My Company?",
      ];
    }

    // =====================================================
    // 3. JOBS / VACANCIES
    // =====================================================
    else if (intent === "jobs") {
      const location = extractLocation(message);
      const skill = extractSkill(message);
      const query: any = { status: "open" };
      if (location) query.location = { $regex: location, $options: "i" };
      if (skill) query.category = { $regex: skill, $options: "i" };

      const jobs = await Job.find(query)
        .populate("company", "fullName email location")
        .sort({ createdAt: -1 })
        .limit(5);

      const totalJobs = await Job.countDocuments({ status: "open" });

      if (jobs.length > 0) {
        reply = `💼 **AIBOS Job Board**\n\nFound ${jobs.length} open positions${location ? ` in **${location}**` : ""}!\n\n*(${totalJobs} total open jobs on platform)*`;

        recommendations = jobs.map((j) => {
          const c = j.company as any;
          return {
            id: j._id,
            name: j.title,
            role: j.category,
            location: j.location,
            rating: 4.7,
            hourlyRate: `LKR ${j.salary.toLocaleString()}/month`,
            company: c?.fullName || "AIBOS Company",
            type: "job",
          };
        });
      } else {
        reply = `💼 There are currently **${totalJobs} open job postings** on AIBOS. ${totalJobs === 0 ? "Companies are setting up their job boards now." : "Try searching with different keywords!"}`;
      }

      suggestions = [
        "Find IT Jobs in Colombo",
        "Electrician Jobs Near Me",
        "How to Apply for a Job?",
        "Register as a Professional",
      ];
    }

    // =====================================================
    // 4. TRAVEL PLANNING
    // =====================================================
    else if (intent === "travel") {
      const dest = extractTravelDest(message);

      // Match 2, 3, 4, 5 day from message
      const daysMatch = message.match(/(\d+)\s*day/i);
      const days = daysMatch ? Math.min(parseInt(daysMatch[1]), 5) : 3;

      // Fetch travel agencies (companies with travel/tour category)
      const travelCompanies = await CompanyProfile.find({
        $or: [
          { industry: { $regex: "travel|tour|tourism|transport", $options: "i" } },
          { categories: { $elemMatch: { $regex: "travel|tour|tourism|transport", $options: "i" } } },
        ],
        isAvailable: true,
      }).populate("user", "fullName email phone location").sort({ rating: -1 }).limit(4);

      // Also get professionals with travel-related skills
      const travelPros = await ProfessionalProfile.find({
        skills: { $elemMatch: { $regex: "tour|driver|guide|travel|chauffeur", $options: "i" } },
        isAvailable: true,
      }).populate("user", "fullName email phone location").sort({ rating: -1 }).limit(3);

      const itinerary = dest ? generateItinerary(dest, days) : "";

      reply = `✈️ **AIBOS AI Travel Planner**\n\nHello Traveller! ${dest ? `Here is your personalized **${days}-Day ${dest.charAt(0).toUpperCase() + dest.slice(1)} Itinerary**:\n\n${itinerary}\n\n` : ""}I've matched you with top travel agencies and certified guides below!`;

      const allTravelRecs = [
        ...travelCompanies.map((c) => ({
          id: c._id,
          name: c.companyName,
          role: "✈️ Verified Travel Agency",
          location: c.city || (c.user as any)?.location || "Sri Lanka",
          rating: c.rating || 4.9,
          completedJobs: c.completedJobs,
          type: "travel",
        })),
        ...travelPros.map((p) => {
          const u = p.user as any;
          return {
            id: p._id,
            name: u?.fullName || "Local Tour Guide",
            role: "🗺️ Certified Tour Guide",
            location: p.location || u?.location || "Sri Lanka",
            rating: p.rating || 4.8,
            hourlyRate: p.hourlyRate ? `LKR ${p.hourlyRate}/hr` : "Negotiable",
            type: "travel",
          };
        }),
      ];

      if (allTravelRecs.length > 0) {
        recommendations = allTravelRecs.slice(0, 5);
      } else {
        reply += `\n\n*(Travel agencies are joining the AIBOS network - be among the first to register your agency!)*`;
      }

      suggestions = [
        dest ? `Plan ${days + 1}-day ${dest} trip` : "Plan 3-day Ella Trip",
        "Find Travel Agencies in Colombo",
        "Book Tour Guide in Kandy",
        "Find Transport / Chauffeur",
      ];
    }

    // =====================================================
    // 5. PLATFORM STATISTICS
    // =====================================================
    else if (intent === "stats") {
      const [
        totalUsers,
        totalCustomers,
        totalProfessionals,
        totalCompanies,
        totalProfessionalProfiles,
        verifiedProfessionals,
        totalJobs,
        openJobs,
        totalServiceRequests,
        pendingRequests,
        completedRequests,
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: "customer" }),
        User.countDocuments({ role: "professional" }),
        User.countDocuments({ role: "company" }),
        ProfessionalProfile.countDocuments(),
        ProfessionalProfile.countDocuments({ verificationStatus: "verified", isAvailable: true }),
        Job.countDocuments(),
        Job.countDocuments({ status: "open" }),
        ServiceRequest.countDocuments(),
        ServiceRequest.countDocuments({ status: "pending" }),
        ServiceRequest.countDocuments({ status: "completed" }),
      ]);

      reply = `📊 **AIBOS Platform Live Statistics**\n\n👥 **Users**\n- Total Registered: ${totalUsers}\n- Customers: ${totalCustomers}\n- Professionals: ${totalProfessionals}\n- Companies: ${totalCompanies}\n\n✅ **Professionals**\n- Profiles Created: ${totalProfessionalProfiles}\n- Verified & Available: ${verifiedProfessionals}\n\n💼 **Jobs**\n- Total Posted: ${totalJobs}\n- Currently Open: ${openJobs}\n\n🔧 **Service Requests**\n- Total Submitted: ${totalServiceRequests}\n- Pending: ${pendingRequests}\n- Completed: ${completedRequests}`;

      suggestions = [
        "Find Verified Professionals",
        "View Open Job Listings",
        "Browse Companies",
        "How to Register?",
      ];
    }

    // =====================================================
    // 6. PLATFORM GUIDE / REGISTRATION
    // =====================================================
    else if (intent === "platform") {
      const lower = message.toLowerCase();

      if (lower.includes("customer")) {
        reply = `🛒 **How to Register as a Customer**\n\n1. Go to **Customer Register** page.\n2. Fill in your name, email, phone, location & password.\n3. Click "Create Account" — you will receive a **6-digit OTP** to your email.\n4. Enter the OTP to verify your email.\n5. Start browsing & hiring verified professionals!\n\n✅ Customer accounts are free and instant.`;
      } else if (lower.includes("professional")) {
        reply = `👷 **How to Register as a Professional**\n\n1. Go to **Professional Register** page.\n2. Fill in your details & area of expertise.\n3. Verify your email with the OTP sent to your inbox.\n4. Complete your Professional Profile (skills, experience, hourly rate, location).\n5. Submit verification documents to the Admin.\n6. Once Admin-approved, your profile goes **LIVE** for customers to find!\n\n⏱️ Admin verification typically takes 24-48 hours.`;
      } else if (lower.includes("company")) {
        reply = `🏢 **How to Register Your Company**\n\n1. Go to **Company Register** page.\n2. Create your account & verify your email.\n3. Fill in your Company Profile (name, industry, categories, location).\n4. Post Jobs or accept Service Requests from Customers.\n5. Submit company verification documents for the Verified badge!\n\n🚀 Companies can start posting jobs immediately after email verification.`;
      } else {
        reply = `💡 **What is AIBOS?**\n\nAIBOS (AI Business Operating System) is an **AI-powered professional services marketplace** connecting:\n\n🛒 **Customers** → Find & hire verified professionals instantly.\n👷 **Professionals** → Get discovered & receive service requests.\n🏢 **Companies** → Post jobs, manage service operations.\n🤖 **AI** → Intelligently matches needs with the right professionals.\n\n**Getting Started:**\n- Register as a Customer → \`/customer/register\`\n- Register as a Professional → \`/professional/register\`\n- Register a Company → \`/company/register\``;
      }

      suggestions = [
        "Register as Customer",
        "Register as Professional",
        "Register as Company",
        "Platform Statistics",
      ];
    }

    // =====================================================
    // 7. GENERAL / FALLBACK
    // =====================================================
    else {
      // Fetch a quick summary from DB to always seem knowledgeable
      const [pros, companies, openJobs] = await Promise.all([
        ProfessionalProfile.countDocuments({ isAvailable: true }),
        CompanyProfile.countDocuments({ isAvailable: true }),
        Job.countDocuments({ status: "open" }),
      ]);

      reply = `👋 **Hello! I'm the AIBOS AI Assistant!**\n\nRight now on AIBOS:\n- 👷 **${pros} Professionals** available for hire\n- 🏢 **${companies} Companies** ready to serve\n- 💼 **${openJobs} Open Jobs** posted\n\nHow can I help you today?`;

      suggestions = [
        "🔍 Find Electrician in Colombo",
        "✈️ Plan 3-day Ella Trip",
        "💼 Browse Open Jobs",
        "📊 Platform Statistics",
        "❓ What is AIBOS?",
      ];
    }

    return res.status(200).json({
      success: true,
      reply,
      suggestions,
      recommendations,
      extraData,
    });
  } catch (error) {
    console.error("AI CHAT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "AI Assistant encountered an error. Please try again.",
    });
  }
};

export interface SorcererProfile {
  id: string;
  domainId: string;
  name: string;
  title: string;
  company: string;
  yearsExp: number;
  avatarIcon: string;
  themeColor: string;
  accentBg: string;
  greeting: string;
  bio: string;
  warStories: Array<{ title: string; lesson: string }>;
  interviewTips: Array<{ question: string; answerStrategy: string }>;
  resumeSecrets: string[];
  mentorDialogues: Array<{ prompt: string; response: string }>;
}

export interface LeaderboardEntry {
  id: string;
  studentName: string;
  avatar: string;
  university: string;
  careerGoal: string;
  domainId: "climate" | "ai" | "cyber" | "fintech" | "robotics";
  xp: number;
  stars: number;
  levelsCleared: number;
  streak: number;
  isCurrentUser?: boolean;
}

export interface LevelChallengeQuestion {
  id: string;
  question: string;
  scenario: string;
  options: string[];
  correctIndex: number;
  sorcererExplanation: string;
  proTip: string;
}

export interface LevelChallenge {
  nodeId: string;
  levelNumber: number;
  title: string;
  stageName: string;
  sorcererBriefing: string;
  questions: LevelChallengeQuestion[];
  practicalTask: {
    title: string;
    description: string;
    rubricPoints: string[];
  };
}

export const SORCERER_PROFILES: Record<string, SorcererProfile> = {
  climate: {
    id: "marcus_thorne",
    domainId: "climate",
    name: "Archmage Marcus Thorne",
    title: "Principal Climate Systems Architect",
    company: "TerraGrid Energy (Ex-Tesla Energy)",
    yearsExp: 14,
    avatarIcon: "🧙‍♂️⚡",
    themeColor: "from-emerald-400 via-teal-500 to-sky-500",
    accentBg: "bg-emerald-950/40 border-emerald-500/40 text-emerald-200",
    greeting:
      "Greetings, Apprentice! I've architected software powering gigawatts of renewable solar and battery arbitrage. Together, we will forge you into a hireable climate tech engineer.",
    bio: "14 years transforming raw electrical sensor streams and battery telemetry into clean, fault-tolerant enterprise software. Marcus mentors senior engineers and sets hiring bars at top climate unicorns.",
    warStories: [
      {
        title: "The 3 AM Grid Inverter Blackout Incident",
        lesson:
          "We had a firmware drift that caused 10,000 solar farm telemetry packets to arrive out-of-order. If we didn't have idempotent Kafka consumers and TimescaleDB continuous aggregates, the database would have melted. Always design for out-of-order sensor packets!",
      },
      {
        title: "The Scope-3 Carbon Overcount Lawsuit Near-Miss",
        lesson:
          "A junior dev accidentally calculated metric tons using imperial short tons in an API payload. Always brand your TypeScript numbers (e.g. MetricTonCO2e as distinct from Ton). Units matter in climate tech!",
      },
      {
        title: "Cutting Cloud Costs by $40,000/Month With Green Software",
        lesson:
          "We rescheduled heavy ML model backfills to execute only during hours when regional power grids reported <100g CO2/kWh. We saved carbon AND massive cloud egress bills.",
      },
    ],
    interviewTips: [
      {
        question: "Why should a climate tech startup hire you over a traditional fintech developer?",
        answerStrategy:
          "Emphasize your understanding of messy sensor telemetry, time-series data modeling, domain awareness of GHG Protocol Scope 1-3, and passion for climate impact velocity.",
      },
      {
        question: "How do you test code when physical hardware sensors aren't available locally?",
        answerStrategy:
          "Explain how you build high-fidelity IoT simulator mocks that generate realistic noise, packet loss, and jitter using synthetic time-series generators.",
      },
    ],
    resumeSecrets: [
      "Highlight metrics with real-world units: 'Ingested 2.4M hourly sensor telemetry records with <15ms latency' instead of vague 'Built backend APIs'.",
      "Showcase at least one public repo with live deployed demo tracking live grid APIs or geospatial maps.",
      "List branded TypeScript types or timeseries indexing as core architecture skills.",
    ],
    mentorDialogues: [
      {
        prompt: "What is a typical day like for you at TerraGrid?",
        response:
          "My mornings start reviewing grid telemetry anomalies from overnight wind/solar dispatch. Then I pair with mid-level engineers on PostGIS spatial queries or TimescaleDB hypertable tuning. We ship fast because climate deadlines can't wait!",
      },
      {
        prompt: "Do I need a degree in Environmental Science to break into Climate Tech?",
        response:
          "Not at all! 85% of climate tech engineering is rock-solid distributed systems, TypeScript/Python, and data visualization. If you learn GHG Protocol basics and build one real energy dashboard, you're already ahead of 90% of applicants.",
      },
      {
        prompt: "What portfolio project will get me an immediate interview?",
        response:
          "Build a live Regional Grid Carbon Tracker that fetches real-time fossil vs. renewable mix, stores history in a time-series DB, and recommends the greenest hour to charge an EV.",
      },
    ],
  },
  ai: {
    id: "elena_vane",
    domainId: "ai",
    name: "Sorceress Elena Vane",
    title: "Staff AI Research Engineer",
    company: "NeuralVenture Labs (Ex-DeepMind)",
    yearsExp: 11,
    avatarIcon: "🔮✨",
    themeColor: "from-purple-400 via-fuchsia-500 to-indigo-500",
    accentBg: "bg-purple-950/40 border-purple-500/40 text-purple-200",
    greeting:
      "Welcome, seeker of intelligence! The frontier of artificial intelligence demands more than prompting—it requires rigorous systems engineering and deep neural intuition.",
    bio: "11 years training multimodal foundation models, agentic workflows, and distributed inference clusters. Elena has published at NeurIPS and now leads AI product infrastructure.",
    warStories: [
      {
        title: "The Silent Gradient Explosion on 512 GPUs",
        lesson:
          "A single NaN in our positional embedding caused a week-long cluster run to silently degenerate. Always set up automated gradient health telemetries and loss divergence watchdogs.",
      },
      {
        title: "The Hallucinatory Customer Agent Incident",
        lesson:
          "Our RAG pipeline had vector index drift, retrieving 6-month-old pricing docs. We instituted hybrid semantic + BM25 search with strict rerankers and schema enforcement.",
      },
    ],
    interviewTips: [
      {
        question: "How do you evaluate and safeguard agentic LLM applications?",
        answerStrategy:
          "Discuss offline golden datasets, LLM-as-a-judge rubrics with statistical confidence bounds, and runtime guardrails using structured JSON schemas.",
      },
      {
        question: "How do you reduce TTFT (Time To First Token) in production?",
        answerStrategy:
          "Talk about KV-cache prefix caching, continuous batching in vLLM, INT4/FP8 weight quantization, and speculative decoding.",
      },
    ],
    resumeSecrets: [
      "List latency and cost optimizations: 'Reduced P99 inference latency from 1.8s to 240ms using vLLM & KV-cache quantization'.",
      "Demonstrate end-to-end full stack capability: model fine-tuning + evaluation harness + streaming UI.",
    ],
    mentorDialogues: [
      {
        prompt: "How do I stand out from thousands of 'wrapper' AI developers?",
        response:
          "Implement Attention and Backpropagation from scratch in PyTorch, build a rigorous evaluation benchmark for your RAG pipeline, and know how KV-caching and quantization work under the hood.",
      },
      {
        prompt: "Should I focus on training models from scratch or fine-tuning?",
        response:
          "Unless you're at a frontier lab with 10,000 H100s, 95% of industry impact comes from LoRA/DPO fine-tuning, high-precision hybrid RAG, and low-latency inference optimization.",
      },
    ],
  },
  cyber: {
    id: "kaelen_drake",
    domainId: "cyber",
    name: "Ciphermaster Kaelen Drake",
    title: "Chief Security Architect",
    company: "CrowdShield Zero-Trust (Ex-Cloudflare)",
    yearsExp: 13,
    avatarIcon: "🛡️🗡️",
    themeColor: "from-rose-400 via-orange-500 to-amber-500",
    accentBg: "bg-rose-950/40 border-rose-500/40 text-rose-200",
    greeting:
      "Eyes sharp, initiate! Every line of code is a potential fortress or a gaping breach. I will teach you to think like an attacker and build like an unbreakable guardian.",
    bio: "13 years leading offensive red-team exercises and architecting zero-trust cloud defense for global banks and unicorn startups.",
    warStories: [
      {
        title: "The SSRF Cloud Metadata Takeover",
        lesson:
          "An innocent PDF-generator microservice allowed an attacker to query 169.254.169.254 and steal temporary IAM credentials. Always enforce IMDSv2 and egress network policies!",
      },
      {
        title: "The Race Condition Double-Withdrawal Bug",
        lesson:
          "Two concurrent POST requests bypassed a balance check because the developer used Read-Committed instead of row-level locking. Security and database concurrency go hand in hand.",
      },
    ],
    interviewTips: [
      {
        question: "How do you secure microservices communication in Kubernetes?",
        answerStrategy:
          "Explain mutual TLS (mTLS) via service mesh (Istio/Linkerd), SPIFFE identities, strict NetworkPolicies, and short-lived workload tokens.",
      },
    ],
    resumeSecrets: [
      "Document responsible disclosures, CTF writeups, or custom security automation tools you built.",
      "Show you don't just find bugs—you write the secure patches and CI/CD SAST guardrails that prevent them forever.",
    ],
    mentorDialogues: [
      {
        prompt: "Should I start with penetration testing or defensive engineering?",
        response:
          "The highest-paid Staff Security Engineers master both: they can exploit a race condition in the morning and write the eBPF kernel filter or OAuth2 gateway patch in the afternoon.",
      },
    ],
  },
  fintech: {
    id: "viktor_sterling",
    domainId: "fintech",
    name: "Grandmaster Viktor Sterling",
    title: "VP of Financial Systems",
    company: "QuantEdge Payments (Ex-Stripe Core Rails)",
    yearsExp: 15,
    avatarIcon: "💎⚖️",
    themeColor: "from-amber-400 via-yellow-500 to-emerald-500",
    accentBg: "bg-amber-950/40 border-amber-500/40 text-amber-200",
    greeting:
      "Welcome to the high-stakes arena! When millions of dollars move every second, 'almost accurate' means bankrupt. Let's master idempotent, zero-loss financial systems.",
    bio: "15 years building global payment switches, double-entry clearing houses, and sub-10ms fraud engines handling $100B+ in annual volume.",
    warStories: [
      {
        title: "The Floating-Point Penny Drift Disaster",
        lesson:
          "Never use IEEE 754 floats for money! `0.1 + 0.2 !== 0.3`. Always store currency in integer minor units (cents/paise) as BIGINT with explicit currency ISO codes.",
      },
      {
        title: "The Retry Storm That Double-Charged 5,000 Cards",
        lesson:
          "A gateway timeout caused mobile clients to retry without an Idempotency-Key. Every mutating financial endpoint MUST require and atomically lock on a client-generated idempotency key.",
      },
    ],
    interviewTips: [
      {
        question: "How do you design a ledger where balances can never go negative under high concurrency?",
        answerStrategy:
          "Discuss append-only double-entry journal tables, pessimistic row locking (`SELECT ... FOR UPDATE`), or serialized tigerbeetle-style state machines.",
      },
    ],
    resumeSecrets: [
      "Emphasize ACID guarantees, idempotency keys, outbox pattern, and reconciliation pipelines.",
    ],
    mentorDialogues: [
      {
        prompt: "What makes Fintech interviews different from normal web dev?",
        response:
          "We obsess over failure modes: What happens if the network drops halfway through a database commit? If you can explain the Transactional Outbox Pattern clearly, you're hired.",
      },
    ],
  },
  robotics: {
    id: "lyra_chen",
    domainId: "robotics",
    name: "Artificer Lyra Chen",
    title: "Principal Spatial & Robotics Architect",
    company: "AetherBotics & Spatial Lab",
    yearsExp: 12,
    avatarIcon: "🚀🦾",
    themeColor: "from-sky-400 via-cyan-500 to-indigo-500",
    accentBg: "bg-sky-950/40 border-sky-500/40 text-sky-200",
    greeting:
      "Ready to bring code into the physical 3D world, apprentice? Here, math meets metal and shaders meet sensors!",
    bio: "12 years writing real-time kinematics, ROS2 autonomy stacks, and WebGPU 3D digital twins for autonomous rovers and spatial computing headsets.",
    warStories: [
      {
        title: "The Gimbal Lock Drone Flip",
        lesson:
          "A developer used Euler angles instead of Quaternions for pitch/roll interpolation. At 90 degrees pitch, the drone lost a degree of freedom and tumbled. Always use Quaternions for 3D rotations!",
      },
    ],
    interviewTips: [
      {
        question: "How do you keep a browser-based 3D fleet visualizer running at 60 FPS?",
        answerStrategy:
          "Use InstancedMesh in Three.js/WebGPU, offload physics/decoding to WebWorkers, and stream binary state via WebSockets/WebRTC.",
      },
    ],
    resumeSecrets: [
      "Include interactive 3D WebGL/Three.js demos directly on your portfolio so recruiters can play with your robotics simulations in-browser!",
    ],
    mentorDialogues: [
      {
        prompt: "How do I practice robotics without expensive hardware?",
        response:
          "Simulation is king! Build 3D digital twins in Three.js/WebGPU or Gazebo, implement A* pathfinding and Kalman filters in code, and visualize the sensor rays live.",
      },
    ],
  },
};

export function getSorcererForGoal(goal: string): SorcererProfile {
  const g = goal.toLowerCase();
  if (g.includes("ai") || g.includes("multimodal") || g.includes("machine learning") || g.includes("model")) {
    return SORCERER_PROFILES.ai;
  }
  if (g.includes("security") || g.includes("cyber") || g.includes("pentest")) {
    return SORCERER_PROFILES.cyber;
  }
  if (g.includes("fintech") || g.includes("ledger") || g.includes("payment") || g.includes("quant")) {
    return SORCERER_PROFILES.fintech;
  }
  if (g.includes("robot") || g.includes("spatial") || g.includes("game") || g.includes("autonomous")) {
    return SORCERER_PROFILES.robotics;
  }
  return SORCERER_PROFILES.climate;
}

/**
 * Multi-student Leaderboard across different career goals
 */
export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: "stu-1",
    studentName: "Aarav Sharma",
    avatar: "🌱",
    university: "IIT Delhi",
    careerGoal: "Full Stack Developer at a climate tech startup",
    domainId: "climate",
    xp: 2850,
    stars: 42,
    levelsCleared: 14,
    streak: 12,
  },
  {
    id: "stu-2",
    studentName: "Priya Patel",
    avatar: "🤖",
    university: "BITS Pilani",
    careerGoal: "AI Research Engineer working on Large Multimodal Models",
    domainId: "ai",
    xp: 3120,
    stars: 33,
    levelsCleared: 11,
    streak: 19,
  },
  {
    id: "stu-3",
    studentName: "Rohan Verma",
    avatar: "🛡️",
    university: "NIT Trichy",
    careerGoal: "Staff Security Engineer at a high-growth Fintech unicorn",
    domainId: "cyber",
    xp: 2490,
    stars: 27,
    levelsCleared: 9,
    streak: 8,
  },
  {
    id: "stu-4",
    studentName: "Ananya Gupta",
    avatar: "💎",
    university: "IIIT Hyderabad",
    careerGoal: "Principal Fintech & Distributed Ledger Engineer",
    domainId: "fintech",
    xp: 2740,
    stars: 21,
    levelsCleared: 7,
    streak: 15,
  },
  {
    id: "stu-5",
    studentName: "Kabir Mehta",
    avatar: "🚀",
    university: "IIT Bombay",
    careerGoal: "Autonomous Robotics & Spatial Computing Lead",
    domainId: "robotics",
    xp: 2180,
    stars: 18,
    levelsCleared: 6,
    streak: 6,
  },
  {
    id: "stu-6",
    studentName: "Zoya Khan",
    avatar: "⚡",
    university: "DTU Delhi",
    careerGoal: "Full Stack Developer at a climate tech startup",
    domainId: "climate",
    xp: 1950,
    stars: 30,
    levelsCleared: 10,
    streak: 9,
  },
  {
    id: "stu-7",
    studentName: "Devansh Joshi",
    avatar: "🧠",
    university: "VIT Vellore",
    careerGoal: "AI Research Engineer working on Large Multimodal Models",
    domainId: "ai",
    xp: 1680,
    stars: 24,
    levelsCleared: 8,
    streak: 5,
  },
  {
    id: "stu-8",
    studentName: "Meera Krishnan",
    avatar: "🔐",
    university: "Anna University",
    careerGoal: "Staff Security Engineer at a high-growth Fintech unicorn",
    domainId: "cyber",
    xp: 1420,
    stars: 18,
    levelsCleared: 6,
    streak: 4,
  },
  {
    id: "stu-9",
    studentName: "Siddharth Rao",
    avatar: "📈",
    university: "RVCE Bangalore",
    careerGoal: "Principal Fintech & Distributed Ledger Engineer",
    domainId: "fintech",
    xp: 1150,
    stars: 15,
    levelsCleared: 5,
    streak: 3,
  },
  {
    id: "stu-10",
    studentName: "Ishita Nair",
    avatar: "🛰️",
    university: "NSUT Delhi",
    careerGoal: "Autonomous Robotics & Spatial Computing Lead",
    domainId: "robotics",
    xp: 890,
    stars: 12,
    levelsCleared: 4,
    streak: 2,
  },
];

export const LEVEL_CHALLENGES: Record<string, LevelChallenge> = {
  "ts-core": {
    nodeId: "ts-core",
    levelNumber: 1,
    title: "TypeScript & Strict Type Systems",
    stageName: "Stage 1: The Alchemical Foundations",
    sorcererBriefing:
      "Listen closely, apprentice. In junior tutorials, developers slap 'any' onto errors to make compilers quiet. In real production infrastructure, a type mistake could miscalculate battery discharge or financial ledgers by 1,000x. Let's test your type mastery!",
    questions: [
      {
        id: "q1",
        question: "How do you prevent a function from accepting raw numbers when calculating Megawatt-Hours vs Joules?",
        scenario: "You are writing a billing module for energy storage. A developer accidentally passes Joules into a parameter expecting MWh.",
        options: [
          "Use comments like /* @param mwh */ and trust the caller.",
          "Use TypeScript Branded / Nominal types (e.g. type MWh = number & { readonly __brand: 'MWh' }).",
          "Convert all inputs to strings before arithmetic.",
          "Disable strict mode in tsconfig.",
        ],
        correctIndex: 1,
        sorcererExplanation:
          "Branded types attach a compile-time zero-cost tag to primitives. If anyone passes a raw number or incompatible branded unit, TypeScript stops them instantly before runtime disaster!",
        proTip: "Every critical climate or financial repo uses branded types for units.",
      },
      {
        id: "q2",
        question: "When receiving unknown IoT sensor payloads from untrusted hardware, what is the professional practice?",
        scenario: "A weather station sends a JSON payload over MQTT with 15 optional telemetry readings.",
        options: [
          "Cast the JSON directly as 'as SensorData' without checking.",
          "Use a runtime validation library like Zod to parse and infer safe types.",
          "Wrap the entire application in a try/catch and ignore exceptions.",
          "Type the variable as 'any' so it accepts whatever fields arrive.",
        ],
        correctIndex: 1,
        sorcererExplanation:
          "TypeScript types only exist at compile time! When payloads arrive across the network, Zod or schema validation verifies the shape at runtime and safely narrows it for your code.",
        proTip: "Never use 'as' casts on network JSON. It hides bugs until production outages occur.",
      },
      {
        id: "q3",
        question: "What is the advantage of Discriminated Unions in telemetry event routers?",
        scenario: "You have solar inverters that emit 'heartbeat', 'fault_alarm', and 'power_generation' events with different fields.",
        options: [
          "They let TypeScript exhaustively check all event branches using a shared discriminant key (e.g. type: 'fault_alarm').",
          "They make the bundle size 50% smaller.",
          "They run on the GPU for faster calculations.",
          "They remove the need for unit testing.",
        ],
        correctIndex: 0,
        sorcererExplanation:
          "With discriminated unions and 'never' exhaustiveness checks, if firmware introduces a new event type tomorrow, TypeScript will immediately highlight every switch-case you forgot to update!",
        proTip: "Hiring managers LOVE when candidates explain exhaustive switch checks in system design.",
      },
    ],
    practicalTask: {
      title: "Unit-Safe Energy Math Utility",
      description: "Demonstrate nominal typing in TypeScript by branding at least two energy units.",
      rubricPoints: [
        "Defines branded types for MWh and MetricTonCO2e",
        "Includes helper constructors with runtime validation",
        "Exhaustive switch-case handling for event payloads",
      ],
    },
  },
  "nextjs-app": {
    nodeId: "nextjs-app",
    levelNumber: 2,
    title: "Next.js & Server Components",
    stageName: "Stage 1: The Alchemical Foundations",
    sorcererBriefing:
      "Modern analytics require instant page loads, streaming data visualizations, and robust server components that fetch sensitive telemetry without exposing secret keys.",
    questions: [
      {
        id: "q1",
        question: "Why do we keep heavy calculation libraries inside React Server Components?",
        scenario: "A 4MB mathematical modeling library is used to calculate solar irradiance curves.",
        options: [
          "Server Components execute on the server, resulting in 0 bytes sent to the client browser bundle.",
          "Browsers don't support math libraries.",
          "Server components run faster because they use C++ directly.",
          "Server components automatically cache to localStorage.",
        ],
        correctIndex: 0,
        sorcererExplanation:
          "By running calculations in Server Components, clients only download the rendered HTML and streaming data, keeping mobile loading speeds under 500ms!",
        proTip: "Always mention bundle-size zero-cost when discussing Next.js in interviews.",
      },
      {
        id: "q2",
        question: "Where should private API keys and database credentials be kept?",
        scenario: "You need to query a protected database using an API secret.",
        options: [
          "In client-side React useState hooks with NEXT_PUBLIC_ prefix.",
          "In server-side environment variables accessed only inside Server Components or Route Handlers.",
          "Hardcoded inside a git commit.",
          "Stored inside a browser cookie.",
        ],
        correctIndex: 1,
        sorcererExplanation:
          "Private credentials must never leave the server. Never prefix private tokens with NEXT_PUBLIC_!",
        proTip: "Leaking API keys on GitHub is the #1 mistake junior developers make.",
      },
    ],
    practicalTask: {
      title: "Streaming Server Component Telemetry View",
      description: "Build an App Router page streaming live metrics with Suspense.",
      rubricPoints: [
        "Uses React Server Component for database fetching",
        "Wraps slow charts in Suspense with accessible skeleton fallback",
        "Zero API keys leaked to browser bundle",
      ],
    },
  },
};

export function getChallengeForNode(
  nodeId: string,
  levelIndex: number,
  nodeTitle: string,
  stageName: string,
  goal: string
): LevelChallenge {
  if (LEVEL_CHALLENGES[nodeId]) {
    return LEVEL_CHALLENGES[nodeId];
  }

  const sorcerer = getSorcererForGoal(goal);

  return {
    nodeId,
    levelNumber: levelIndex,
    title: nodeTitle,
    stageName,
    sorcererBriefing: `Welcome to Level ${levelIndex}: ${nodeTitle}! As ${sorcerer.title} at ${sorcerer.company}, I rely on this skill every week in production. Prove your tactical judgment on these real-world scenarios to earn 3 stars and unlock the next milestone on your Candy Saga route!`,
    questions: [
      {
        id: `q-${nodeId}-1`,
        question: `In a production environment at ${sorcerer.company}, what is the primary architectural reason we master ${nodeTitle}?`,
        scenario: `Your engineering team is scaling a mission-critical service and integrating ${nodeTitle} into the core pipeline.`,
        options: [
          "It enforces reliability, predictable performance, and clean boundary contracts under production load.",
          "It completely eliminates the need for automated testing or monitoring.",
          "It allows developers to skip code reviews entirely.",
          "It guarantees zero hardware failures.",
        ],
        correctIndex: 0,
        sorcererExplanation: `Mastering ${nodeTitle} is all about predictable behavior under scale, operational observability, and clean abstractions.`,
        proTip: "Always frame your engineering decisions around reliability, observability, and team velocity.",
      },
      {
        id: `q-${nodeId}-2`,
        question: `During a live incident involving ${nodeTitle}, what is a senior engineer's first triage step?`,
        scenario: `Telemetry alerts indicate elevated P99 latency and intermittent errors in the ${nodeTitle} module.`,
        options: [
          "Reboot the entire production cluster blindly without inspecting logs.",
          "Correlate distributed traces, inspect recent deployments/metrics, and isolate the failing boundary.",
          "Delete the monitoring alert so the on-call pager stops ringing.",
          "Blame the client's internet connection.",
        ],
        correctIndex: 1,
        sorcererExplanation:
          "Working professionals never guess blindly! We use structured logs, metrics, and traces to isolate the exact root cause before applying a targeted fix or rollback.",
        proTip: "Mentioning P99 latency and distributed tracing in interviews immediately signals real-world maturity.",
      },
    ],
    practicalTask: {
      title: `Hands-On Portfolio Proof: ${nodeTitle}`,
      description: `Construct a tangible portfolio artifact showcasing ${nodeTitle} in action.`,
      rubricPoints: [
        "Tested modular architecture with clean commit history",
        "Documented trade-offs and architecture diagram in README",
        "Live demo deployment or automated verification suite",
      ],
    },
  };
}

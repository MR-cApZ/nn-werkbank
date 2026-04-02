window.MASTER_DB = [

    // ==========================================
    // WAFFENTEILE (Komponenten)
    // ==========================================
    {
        item: "Waffenteil (Klein)",
        herstellung: { "Eisen": 12, "Stahl": 12 },
        blueprint: "-",
        xp: "-",
        herstellzeit: 15,
        rewards: { "Waffenteil (Klein)": 1, "Waffen XP": 50 },
        cat: "Komponenten"
    },
    {
        item: "Waffenteil (Mittel)",
        herstellung: { "Eisen": 20, "Stahl": 15, "Wolfram": 2 },
        blueprint: "-",
        xp: "-",
        herstellzeit: 15,
        rewards: { "Waffenteil (Mittel)": 1, "Waffen XP": 50 },
        cat: "Komponenten"
    },
    {
        item: "Waffenteil (Groß)",
        herstellung: { "Eisen": 45, "Stahl": 45 },
        blueprint: "-",
        xp: "-",
        herstellzeit: 15,
        rewards: { "Waffenteil (Groß)": 1, "Waffen XP": 50 },
        cat: "Komponenten"
    },

    // ==========================================
    // WAFFEN
    // ==========================================

    // --- PISTOLEN ---
    {
        item: "Wolther P99",
        herstellung: { "Waffenteil (Klein)": 3 },
        blueprint: "-",
        xp: "-",
        herstellzeit: 120,
        rewards: { "Wolther P99": 1, "Waffen XP": 50 },
        cat: "Waffen",
        ucat: "Pistolen"
    },
    {
        item: "NDW SVP9",
        herstellung: { "Waffenteil (Klein)": 2 },
        blueprint: "-",
        xp: "Level 2 - Waffen",
        herstellzeit: 120,
        rewards: { "NDW SVP9": 1, "Waffen XP": 200 },
        cat: "Waffen",
        ucat: "Pistolen"
    },
    {
        item: "2011",
        herstellung: { "Waffenteil (Klein)": 3 },
        blueprint: "-",
        xp: "Level 3 - Waffen",
        herstellzeit: 120,
        rewards: { "2011": 1, "Waffen XP": 200 },
        cat: "Waffen",
        ucat: "Pistolen"
    },
    {
        item: "S17",
        herstellung: { "Waffenteil (Klein)": 3, "Plastik": 3, "Wolfram": 2 },
        blueprint: "-",
        xp: "Level 4 - Waffen",
        herstellzeit: 120,
        rewards: { "S17": 1, "Waffen XP": 200 },
        cat: "Waffen",
        ucat: "Pistolen"
    },
    {
        item: "NDW.50 Pistole",
        herstellung: { "Waffenteil (Klein)": 5, "Kunststoffgriff": 1 },
        blueprint: "-",
        xp: "Level 15 - Waffen",
        herstellzeit: 180,
        rewards: { "NDW.50": 1, "Waffen XP": 1000 },
        cat: "Waffen",
        ucat: "Pistolen"
    },

    // --- SNIPER ---
    {
        item: "M28",
        herstellung: { "Waffenteil (Groß)": 7, "Waffenteil (Mittel)": 3 },
        blueprint: "Scharfschützengewehr",
        xp: "Level 15 - Waffen",
        herstellzeit: 240,
        rewards: { "M28": 1, "Waffen XP": 500 },
        cat: "Waffen",
        ucat: "Sniper"
    },

    // --- STURMGEWEHRE ---
    {
        item: "NDW 47M",
        herstellung: { "Waffenteil (Klein)": 3, "Waffenteil (Mittel)": 1 },
        blueprint: "Karabiner",
        xp: "Level 5 - Waffen",
        herstellzeit: 180,
        rewards: { "NDW 47M": 1, "Waffen XP": 200 },
        cat: "Waffen",
        ucat: "Sturmgewehre"
    },
    {
        item: "PP-19",
        herstellung: { "Waffenteil (Mittel)": 3, "Waffenteil (Groß)": 1, "Plastik": 4, "Wolfram": 3 },
        blueprint: "Karabiner",
        xp: "Level 6 - Waffen",
        herstellzeit: 180,
        rewards: { "PP-19": 1, "Waffen XP": 200 },
        cat: "Waffen",
        ucat: "Sturmgewehre"
    },
    {
        item: "NDW4V7 11.5 - Black/Coyote/OD",
        herstellung: { "Waffenteil (Mittel)": 4, "Waffenteil (Groß)": 2 },
        blueprint: "Spezialkarabiner",
        xp: "Level 8 - Waffen",
        herstellzeit: 180,
        rewards: { "NDW4V7 11.5 - Black/Coyote/OD": 1, "Waffen XP": 200 },
        cat: "Waffen",
        ucat: "Sturmgewehre"
    },
    {
        item: "NDW 36",
        herstellung: { "Waffenteil (Groß)": 3, "Waffenteil (Mittel)": 4 },
        blueprint: "Spezialkarabiner",
        xp: "Level 8 - Waffen",
        herstellzeit: 100,
        rewards: { "NDW 36": 1, "Waffen XP": 200 },
        cat: "Waffen",
        ucat: "Sturmgewehre"
    },
    {
        item: "NDW4V7 14.5 - Black/Coyote/OD",
        herstellung: { "Waffenteil (Mittel)": 3, "Waffenteil (Groß)": 3 },
        blueprint: "Spezialkarabiner",
        xp: "Level 10 - Waffen",
        herstellzeit: 180,
        rewards: { "NDW4V7 14.5 - Black/Coyote/OD": 1, "Waffen XP": 200 },
        cat: "Waffen",
        ucat: "Sturmgewehre"
    },
    {
        item: "NDW4V7 16 - Black/Coyote/OD",
        herstellung: { "Waffenteil (Mittel)": 4, "Waffenteil (Groß)": 4 },
        blueprint: "Spezialkarabiner",
        xp: "Level 15 - Waffen",
        herstellzeit: 180,
        rewards: { "NDW4V7 16 - Black/Coyote/OD": 1, "Waffen XP": 200 },
        cat: "Waffen",
        ucat: "Sturmgewehre"
    },

    // ==========================================
    // AUFSÄTZE
    // ==========================================

    // --- GRIFFE ---
    {
        item: "Grip",
        herstellung: { "Wolfram": 3, "Plastik": 2 },
        blueprint: "-",
        xp: "-",
        herstellzeit: 30,
        rewards: { "Grip": 1, "Aufsätze XP": 50 },
        cat: "Aufsätze",
        ucat: "Griffe"
    },
    {
        item: "BCM Vertical Grip Mod 3 (Black/Coyote/OD)",
        herstellung: { "Aluminium": 4, "Kupfer": 4, "Metallschrott": 8 },
        blueprint: "-",
        xp: "-",
        herstellzeit: 30,
        rewards: { "BCM Grip": 1, "Aufsätze XP": 50 },
        cat: "Aufsätze",
        ucat: "Griffe"
    },
    {
        item: "Kunststoffgriff",
        herstellung: { "Plastik": 5 },
        blueprint: "-",
        xp: "-",
        herstellzeit: 15,
        rewards: { "Kunststoffgriff": 1 },
        cat: "Aufsätze",
        ucat: "Griffe"
    },

    // --- LÄUFE ---
    {
        item: "Automatisches Abzugsgehäuse",
        herstellung: { "Plastik": 2 },
        blueprint: "-",
        xp: "-",
        herstellzeit: 15,
        rewards: { "Autom. Abzug": 1 },
        cat: "Aufsätze",
        ucat: "Läufe"
    },

    // --- LICHT ---
    {
        item: "Flashlight",
        herstellung: { "Wolfram": 1, "Plastik": 1 },
        blueprint: "-",
        xp: "0",
        herstellzeit: 30,
        rewards: { "Flashlight": 1, "Aufsätze XP": 50 },
        cat: "Aufsätze",
        ucat: "Licht"
    },
    {
        item: "11.5 SureFire ScoutLight (Single Switch)",
        herstellung: { "Wolfram": 6, "Plastik": 8 },
        blueprint: "-",
        xp: "-",
        herstellzeit: 30,
        rewards: { "ScoutLight": 1, "Aufsätze XP": 80 },
        cat: "Aufsätze",
        ucat: "Licht"
    },

    // --- MAGAZINERWEITERUNG ---
    {
        item: "PMAG 30r with Rangerplate",
        herstellung: { "Aluminium": 8, "Kupfer": 6, "Metallschrott": 12 },
        blueprint: "-",
        xp: "-",
        herstellzeit: 30,
        rewards: { "PMAG 30r RP": 1, "Aufsätze XP": 50 },
        cat: "Aufsätze",
        ucat: "Magazinerweiterung"
    },
    {
        item: "PMAG 40r (Black)",
        herstellung: { "Aluminium": 8, "Kupfer": 6, "Metallschrott": 12 },
        blueprint: "-",
        xp: "-",
        herstellzeit: 30,
        rewards: { "PMAG 40r": 1, "Aufsätze XP": 50 },
        cat: "Aufsätze",
        ucat: "Magazinerweiterung"
    },
    {
        item: "PMAG 60r [Maglinked]",
        herstellung: { "Aluminium": 8, "Kupfer": 6, "Metallschrott": 12 },
        blueprint: "-",
        xp: "-",
        herstellzeit: 30,
        rewards: { "PMAG 60r": 1, "Munition XP": 50 },
        cat: "Aufsätze",
        ucat: "Magazinerweiterung"
    },

    // --- SCHALLDÄMPFER ---
    {
        item: "Schalldämpfer",
        herstellung: { "Wolfram": 2, "Plastik": 2 },
        blueprint: "-",
        xp: "0",
        herstellzeit: 30,
        rewards: { "Schalldämpfer": 1, "Aufsätze XP": 50 },
        cat: "Aufsätze",
        ucat: "Schalldämpfer"
    },

    // --- VISIERE ---
    {
        item: "Scope",
        herstellung: { "Wolfram": 2, "Plastik": 3 },
        blueprint: "-",
        xp: "-",
        herstellzeit: 30,
        rewards: { "Scope": 1, "Aufsätze XP": 50 },
        cat: "Aufsätze",
        ucat: "Visiere"
    },
    {
        item: "Aimpoint Pro Red Dot Sight",
        herstellung: { "Schwefel": 8, "Messing": 4, "Aluminium": 3 },
        blueprint: "-",
        xp: "-",
        herstellzeit: 35,
        rewards: { "Aimpoint Pro": 1, "Aufsätze XP": 50 },
        cat: "Aufsätze",
        ucat: "Visiere"
    },

    // ==========================================
    // ROHMATERIALIEN
    // ==========================================
    {
        item: "Aluminium",
        herstellung: null,
        cat: "Rohmaterialien",
        desc: "Leichtmetall für Visiere und Griffe."
    },
    {
        item: "Eisen",
        herstellung: null,
        cat: "Rohmaterialien",
        desc: "Basis-Metall für einfache Komponenten."
    },
    {
        item: "Kohle",
        herstellung: null,
        cat: "Rohmaterialien",
        desc: "Brennstoff für die Schmelze."
    },
    {
        item: "Kupfer",
        herstellung: null,
        cat: "Rohmaterialien",
        desc: "Wichtig für die Herstellung von Munition."
    },
    {
        item: "Messing",
        herstellung: null,
        cat: "Rohmaterialien",
        desc: "Legierung für Hülsen und Optiken."
    },
    {
        item: "Metallschrott",
        herstellung: null,
        cat: "Rohmaterialien",
        desc: "Alte Metallteile zur Wiederverwertung."
    },
    {
        item: "Plastik",
        herstellung: null,
        cat: "Rohmaterialien",
        desc: "Leichtes Material für moderne Griffe und Gehäuse."
    },
    {
        item: "Schwefel",
        herstellung: null,
        cat: "Rohmaterialien",
        desc: "Wird für Schwarzpulver und Munition benötigt."
    },
    {
        item: "Stahl",
        herstellung: null,
        cat: "Rohmaterialien",
        desc: "Veredeltes Eisen für stabilere Teile."
    },
    {
        item: "Wolfram",
        herstellung: null,
        cat: "Rohmaterialien",
        desc: "Extrem hartes Metall für High-End Aufsätze."
    }
];

/* Greek Life unit — history of fraternities + ADPhi at Illinois (from the lecture slide deck). Hand-edited. */
(function () {
  "use strict";
  const SEC = {
    origins: "Origins & triads",
    adphi: "Why ADPhi was founded",
    illinois: "ADPhi at Illinois",
    houses: "Chapter houses",
    rebirth: "Downfall & rebirth"
  };

  // ---- reading notes (one block per slide) -------------------------------------------------
  const NOTES = [
    { id: "n1", sec: "origins", title: "Why were fraternities founded?", bullets: [
      "First Greek letter organization: <b>Phi Beta Kappa</b>, founded at <b>William & Mary</b> on <b>Dec 5, 1776</b>.",
      "<b>1825</b>: Kappa Alpha Society founded at <b>Union College</b>.",
      "<b>1827</b>: Sigma Phi and Delta Phi, also at Union College.",
      "These 3 = the <b>Union Triad</b>.",
      "Members mainly met to discuss disagreements with university administrators and to discuss world issues."] },
    { id: "n2", sec: "origins", title: "Phi Beta Kappa", bullets: [
      "Dec 5, 1776 · founded at William & Mary College · “the nation's most prestigious academic honor society.”",
      "Yale and Harvard chapters by <b>1779</b>.",
      "Increasing focus on academics over time; <b>anti-Masonic pressure</b>.",
      "Became a national academic honor society in <b>1831</b>."] },
    { id: "n3", sec: "origins", title: "Midwest — the Miami Triad", bullets: [
      "Greek life was really brought to life in the Midwest through the <b>Miami Triad</b>.",
      "<b>Sigma Chi, Phi Delta Theta, Beta Theta Pi</b>."] },
    { id: "n4", sec: "origins", title: "Deep South — the Lexington Triad", bullets: [
      "Formed right after the Civil War; monument dedicated April 9, 1983.",
      "<b>Alpha Tau Omega</b> (VMI, 1865), <b>Sigma Nu</b> (VMI, 1869), <b>Kappa Alpha Order</b> (Washington & Lee, 1865).",
      "ATO and SNU → founded at <b>Virginia Military Institute</b>; KAO → <b>Washington and Lee University</b>."] },
    { id: "n5", sec: "adphi", title: "Why were WE founded?", bullets: [
      "At <b>Hamilton College</b>, <b>Samuel Eells</b> found two literary societies — the <b>Phoenix</b> and the <b>Philolpeuthian</b> (as spelled on the slide); he joined the latter.",
      "He found their recruitment tactics distasteful and disliked the small size of the groups; he wanted a society that did not promote jealousy or hatred.",
      "<b>1830</b>: Eells selected 2 men from each society and founded a new society based on “the loftiest of intellectual and moral ideas.”",
      "<b>1832</b>: he had founded Alpha Delta Phi.",
      "5 founders: Samuel Eells, Lorenzo Latham, John Curtiss Underwood, Oliver Andrew Morse, Henry Lemuel Storrs.",
      "Eells and Latham designed the emblem and symbols.",
      "Fun fact: <b>1878</b> — the ADPhi chapter at <b>Cornell</b> was the first established residential chapter home of any fraternity.",
      "Photos: <b>Kirkland House</b> — birthplace of ADPhi."] },
    { id: "n6", sec: "adphi", title: "ADPhi was “first” on 12 campuses", bullets: [
      "<b>First</b> Greek-letter fraternity at: Miami University, New York University, Columbia, Yale, Amherst, Brown, Harvard, Hobart, Western Reserve, Bowdoin, University of Rochester, City College of New York.",
      "<b>Second</b> at: Hamilton College, University of Alabama, McGill University."] },
    { id: "n7", sec: "illinois", title: "Our story continued (Illinois)", bullets: [
      "<b>Pi Theta</b> officially chartered in <b>1911</b>; the Illinois Chapter was installed at the University Club in Chicago on <b>Jan 13, 1912</b>.",
      "Lived in the original Pi Theta house until <b>1915</b>, then the mansion of the University's first President until <b>1922</b>.",
      "Then the Historic Chapter House — built <b>1924–1925</b>, placed on the National Register of Historic Places in <b>1990</b>.",
      "Always known as a house of “stand-up men”: leaders and prominent athletes."] },
    { id: "n8", sec: "houses", title: "Chapter house locations", bullets: [
      "1910–1915 · 206 East Green Street (Pi Theta)",
      "1915–1922 · 709 S Fourth Street (President's mansion)",
      "1923–1924 · 205 Green Street (temporary quarters)",
      "1924–2018 · 310 East John Street (The New House)",
      "Fall 1943 – Spring 1946 · unknown — most fraternities became army barracks and women's residences because of WW2",
      "2020 and beyond · 401 East Daniel Street (where we are now)"] },
    { id: "n9", sec: "rebirth", title: "Our downfall", bullets: [
      "Brothers were kicked out of the house in <b>2015</b>.",
      "Reasons: hazing; destruction of the house (throwing kegs out of the window); overall people not caring / not taking care of the house.",
      "NOT kicked off campus by the University — the <b>alumni</b> realized change was needed and pulled the chapter off campus.",
      "Still, they planned to one day create a new ADPhi at Illinois."] },
    { id: "n10", sec: "rebirth", title: "New & improved", bullets: [
      "After the <b>2018</b> shutdown the old house was demolished and sold (not worth saving) — now apartment buildings.",
      "Sale money bought the recently abandoned <b>Alpha Kappa Lambda</b> house.",
      "New house designed by ADPhi <b>alumni architects</b>, keeping historic features: wood panel ceilings, paintings, fire pit.",
      "Construction began <b>2020</b>, finished <b>Fall 2021</b>."] },
    { id: "n11", sec: "rebirth", title: "Our 6 founding fathers (re-founding)", bullets: [
      "Jacob Byrkit ('23) · Henry Byrkit ('24) · D.J. Dutton ('24) · Paul Rampersaud ('24) · Zach Harrison ('24) · Cam Ezell (transferred).",
      "Closing message: you are the future of the fraternity — <b>get involved</b>: get a position, join a committee."] }
  ];

  // ---- flashcards: q ↔ a.  s = short answer (used for multiple choice / typing); g = answer type ----
  const C = (id, sec, q, a, s, g) => ({ id, sec, q, a, s, g });
  const CARDS = [
    C("po1", "origins", "First Greek-letter organization", "Phi Beta Kappa", "Phi Beta Kappa", "frat"),
    C("po2", "origins", "Phi Beta Kappa — founding date", "Dec 5, 1776", "December 5, 1776", "date"),
    C("po3", "origins", "Phi Beta Kappa — where founded", "William & Mary (College)", "William & Mary", "school"),
    C("po4", "origins", "Other early PBK chapters (by 1779)", "Yale and Harvard", "Yale and Harvard", "school"),
    C("po5", "origins", "Year PBK became a national academic honor society", "1831", "1831", "year"),
    C("po6", "origins", "Outside pressure on PBK that pushed it toward academics", "Anti-Masonic pressure", "Anti-Masonic pressure", "text"),
    C("po7", "origins", "Kappa Alpha Society — year & school", "1825 · Union College", "1825", "year"),
    C("po8", "origins", "Sigma Phi & Delta Phi — year & school", "1827 · Union College", "1827", "year"),
    C("po9", "origins", "The Union Triad", "Kappa Alpha Society, Sigma Phi, Delta Phi (all at Union College)", "Kappa Alpha Society, Sigma Phi, Delta Phi", "triad"),
    C("po10", "origins", "What early members mainly met to discuss", "Disagreements with university administrators + world issues", "Disagreements with administrators and world issues", "text"),
    C("po11", "origins", "Miami Triad — region it brought Greek life to", "The Midwest", "The Midwest", "region"),
    C("po12", "origins", "The Miami Triad", "Sigma Chi, Phi Delta Theta, Beta Theta Pi", "Sigma Chi, Phi Delta Theta, Beta Theta Pi", "triad"),
    C("po13", "origins", "Lexington Triad — region", "The Deep South (formed right after the Civil War)", "The Deep South", "region"),
    C("po14", "origins", "The Lexington Triad", "Alpha Tau Omega, Kappa Alpha Order, Sigma Nu", "Alpha Tau Omega, Kappa Alpha Order, Sigma Nu", "triad"),
    C("po15", "origins", "ATO and Sigma Nu were founded at…", "Virginia Military Institute (ATO 1865, SNU 1869)", "Virginia Military Institute", "school"),
    C("po16", "origins", "Kappa Alpha Order was founded at…", "Washington and Lee University (1865)", "Washington and Lee", "school"),
    C("po17", "origins", "Lexington Triad monument dedicated", "April 9, 1983", "April 9, 1983", "date"),
    C("pa1", "adphi", "Who founded ADPhi after finding two literary societies at Hamilton College?", "Samuel Eells", "Samuel Eells", "person"),
    C("pa2", "adphi", "The two Hamilton literary societies Eells found", "The Phoenix and the Philolpeuthian", "The Phoenix and the Philolpeuthian", "text"),
    C("pa3", "adphi", "Why Eells wanted his own society", "Disliked their recruitment tactics and small size; wanted no jealousy or hatred", "Disliked recruitment tactics & small size", "text"),
    C("pa4", "adphi", "1830 — what Eells did", "Selected 2 men from each society and founded a new society on “the loftiest of intellectual and moral ideas”", "Picked 2 men from each society", "text"),
    C("pa5", "adphi", "Year Eells had founded Alpha Delta Phi", "1832", "1832", "year"),
    C("pa6", "adphi", "The 5 founders", "Samuel Eells, Lorenzo Latham, John Curtiss Underwood, Oliver Andrew Morse, Henry Lemuel Storrs", "Eells, Latham, Underwood, Morse, Storrs", "person"),
    C("pa7", "adphi", "Who designed the ADPhi emblem and symbols?", "Eells and Latham", "Eells and Latham", "person"),
    C("pa8", "adphi", "1878 fun fact", "Cornell's ADPhi chapter = first established residential chapter home of any fraternity", "Cornell", "school"),
    C("pa9", "adphi", "Kirkland House", "Birthplace of ADPhi (Hamilton College)", "Birthplace of ADPhi", "text"),
    C("pa10", "adphi", "ADPhi was the first Greek-letter fraternity at (name any): Miami, NYU, Columbia, Yale, Amherst, Brown, Harvard, Hobart, Western Reserve, Bowdoin, Rochester, CCNY", "12 campuses (see Recall mode)", null, null),
    C("pa11", "adphi", "ADPhi was the SECOND fraternity at…", "Hamilton College, University of Alabama, McGill University", "Hamilton, Alabama, McGill", "school"),
    C("pi1", "illinois", "Pi Theta charter year", "1911", "1911", "year"),
    C("pi2", "illinois", "Illinois Chapter installed — date & place", "Jan 13, 1912 · University Club in Chicago", "January 13, 1912", "date"),
    C("pi3", "illinois", "Where the chapter lived until 1915", "The original Pi Theta house", "The original Pi Theta house", "text"),
    C("pi4", "illinois", "1915–1922 home", "Mansion of the University's first President", "The first President's mansion", "text"),
    C("pi5", "illinois", "Historic Chapter House built", "1924–1925", "1924–1925", "year"),
    C("pi6", "illinois", "Historic Chapter House on the National Register of Historic Places", "1990", "1990", "year"),
    C("pi7", "illinois", "Illinois ADPhi's reputation", "A house of stand-up men: leaders and prominent athletes", "House of stand-up men", "text"),
    C("ph1", "houses", "1910–1915 chapter house", "206 East Green Street (Pi Theta)", "206 East Green Street", "addr"),
    C("ph2", "houses", "1915–1922 chapter house", "709 S Fourth Street (President's mansion)", "709 S Fourth Street", "addr"),
    C("ph3", "houses", "1923–1924 chapter house", "205 Green Street (temporary quarters)", "205 Green Street", "addr"),
    C("ph4", "houses", "1924–2018 chapter house", "310 East John Street (The New House)", "310 East John Street", "addr"),
    C("ph5", "houses", "Fall 1943 – Spring 1946", "Unknown — fraternities became army barracks and women's residences (WW2)", "Unknown (WW2 barracks)", "text"),
    C("ph6", "houses", "2020 and beyond — current house", "401 East Daniel Street", "401 East Daniel Street", "addr"),
    C("pr1", "rebirth", "Year the brothers were kicked out of the house (slide)", "2015", "2015", "year"),
    C("pr2", "rebirth", "Reasons the brothers were kicked out", "Hazing; destruction of the house (kegs out the window); not caring for the house", "Hazing, destruction, not caring", "text"),
    C("pr3", "rebirth", "Who pulled the chapter off campus?", "The alumni — NOT the University", "The alumni", "person"),
    C("pr4", "rebirth", "What happened to the old house after the 2018 shutdown?", "Demolished and sold — now apartment buildings", "Demolished and sold", "text"),
    C("pr5", "rebirth", "Whose abandoned house did ADPhi buy with the sale money?", "Alpha Kappa Lambda", "Alpha Kappa Lambda", "frat"),
    C("pr6", "rebirth", "Who designed the new house?", "ADPhi alumni architects", "ADPhi alumni architects", "person"),
    C("pr7", "rebirth", "Historic features kept in the new house", "Wood panel ceilings, paintings, fire pit", "Wood panel ceilings, paintings, fire pit", "text"),
    C("pr8", "rebirth", "New house construction", "Began 2020, finished Fall 2021", "2020 – Fall 2021", "year"),
    C("pr9", "rebirth", "The 6 founding fathers (re-founding)", "Jacob Byrkit, Henry Byrkit, D.J. Dutton, Paul Rampersaud, Zach Harrison, Cam Ezell", "Jacob & Henry Byrkit, Dutton, Rampersaud, Harrison, Ezell", "person"),
    C("pr10", "rebirth", "Class years of the founding fathers", "Jacob Byrkit '23; Henry Byrkit, D.J. Dutton, Paul Rampersaud, Zach Harrison '24; Cam Ezell transferred", "Mostly Class of '24", "year"),
    C("pr11", "rebirth", "Closing message to new members", "GET INVOLVED — get a position, join a committee, make the house special to you", "Get involved", "text")
  ];

  // Extra distractors so every answer-type has enough options
  const POOL = {
    date: ["December 5, 1825", "July 4, 1776", "April 9, 1865", "January 13, 1922", "June 12, 1832", "November 11, 1918"],
    year: ["1776", "1779", "1825", "1827", "1830", "1832", "1865", "1869", "1878", "1911", "1912", "1915", "1922", "1924", "1946", "1990", "2015", "2018", "2020", "2021"],
    school: ["Union College", "Hamilton College", "Cornell", "Yale", "Harvard", "Miami University", "Virginia Military Institute", "Washington and Lee", "William & Mary", "University of Alabama", "McGill"],
    frat: ["Phi Beta Kappa", "Kappa Alpha Society", "Sigma Phi", "Delta Phi", "Sigma Chi", "Beta Theta Pi", "Alpha Tau Omega", "Alpha Kappa Lambda", "Pi Theta"],
    person: ["Samuel Eells", "Lorenzo Latham", "Henry Lemuel Storrs", "The University", "The national office", "The alumni", "ADPhi alumni architects", "The city council"],
    text: ["Anti-Masonic pressure", "Hazing", "Pressure from the Church", "A house of stand-up men", "Get involved"],
    triad: ["Sigma Chi, Phi Delta Theta, Beta Theta Pi", "Alpha Tau Omega, Kappa Alpha Order, Sigma Nu", "Kappa Alpha Society, Sigma Phi, Delta Phi", "Phi Beta Kappa, Sigma Chi, Sigma Nu", "Delta Phi, Beta Theta Pi, Alpha Tau Omega"],
    region: ["The Midwest", "The Deep South", "New England", "The West Coast"],
    addr: ["206 East Green Street", "709 S Fourth Street", "205 Green Street", "310 East John Street", "401 East Daniel Street", "310 East Daniel Street", "401 East John Street"]
  };

  // ---- hand-written multiple choice (first option = correct; runner shuffles) ----------------
  const Q = (tag, q, opts, why) => ({ tags: ["greek", "greek-" + tag], q, opts, ans: 0, why });
  const QUESTIONS = [
    Q("origins", "Which was the first Greek-letter organization?", ["Phi Beta Kappa", "Kappa Alpha Society", "Sigma Phi", "Alpha Delta Phi"], "Phi Beta Kappa, William & Mary, Dec 5, 1776."),
    Q("origins", "Phi Beta Kappa was founded at…", ["William & Mary", "Union College", "Hamilton College", "Miami University"], "William & Mary College, 1776."),
    Q("origins", "Which three societies make up the Union Triad?", ["Kappa Alpha Society, Sigma Phi, Delta Phi", "Sigma Chi, Phi Delta Theta, Beta Theta Pi", "ATO, Kappa Alpha Order, Sigma Nu", "Phi Beta Kappa, Yale, Harvard"], "All founded at Union College (1825, 1827)."),
    Q("origins", "The Miami Triad is associated with Greek life in which region?", ["The Midwest", "The Deep South", "New England", "The Mid-Atlantic"], "Sigma Chi, Phi Delta Theta, Beta Theta Pi."),
    Q("origins", "Which fraternity belongs to the Miami Triad?", ["Beta Theta Pi", "Sigma Nu", "Delta Phi", "Alpha Tau Omega"], "Miami Triad = Sigma Chi, Phi Delta Theta, Beta Theta Pi."),
    Q("origins", "Which fraternity belongs to the Lexington Triad?", ["Sigma Nu", "Sigma Chi", "Sigma Phi", "Phi Delta Theta"], "Lexington Triad = ATO, Kappa Alpha Order, Sigma Nu. Careful: Sigma Chi (Miami), Sigma Phi (Union)."),
    Q("origins", "Which Lexington Triad fraternity was founded at Washington and Lee rather than VMI?", ["Kappa Alpha Order", "Alpha Tau Omega", "Sigma Nu", "Sigma Chi"], "ATO and SNU → VMI; KAO → W&L."),
    Q("origins", "The Lexington Triad was formed…", ["right after the Civil War", "right after the Revolution", "during World War II", "in 1983"], "(The monument was dedicated in 1983.)"),
    Q("origins", "Why did PBK shift toward academics and national honor-society status (1831)?", ["Anti-Masonic pressure plus growing academic focus", "A ban by the University of Virginia", "The Civil War", "The founding of ADPhi"], "Anti-Masonic pressure; became a national academic honor society in 1831."),
    Q("origins", "What did the earliest members mainly do at meetings?", ["Discuss disagreements with administrators and world issues", "Plan social events and parties", "Organize intramural sports", "Raise money for chapter houses"], "Per the slide."),
    Q("adphi", "Who founded Alpha Delta Phi?", ["Samuel Eells", "Lorenzo Latham", "Oliver Andrew Morse", "Henry Byrkit"], "Samuel Eells at Hamilton College."),
    Q("adphi", "Samuel Eells disliked the Phoenix and Philolpeuthian because of…", ["their recruitment tactics and small size", "their ties to the Masons", "their location", "their cost"], "He wanted a society that did not promote jealousy or hatred."),
    Q("adphi", "ADPhi was founded on “the loftiest of…”", ["intellectual and moral ideas", "social and athletic ideals", "military and political goals", "religious and charitable aims"], "Eells, 1830 → ADPhi by 1832."),
    Q("adphi", "How many founders does ADPhi have (original)?", ["5", "6", "3", "12"], "Eells, Latham, Underwood, Morse, Storrs. (6 is the Illinois re-founding.)"),
    Q("adphi", "Who designed the ADPhi emblem and symbols?", ["Eells and Latham", "Underwood and Morse", "Storrs and Eells", "The Cornell chapter"], "Eells and Latham."),
    Q("adphi", "Which ADPhi chapter was the first established residential chapter home of any fraternity (1878)?", ["Cornell", "Hamilton", "Yale", "Illinois"], "Fun fact from the slide."),
    Q("adphi", "Which is the “birthplace of ADPhi”?", ["Kirkland House", "Union Hall", "The University Club", "310 East John Street"], "Kirkland House at Hamilton College."),
    Q("adphi", "ADPhi was the SECOND Greek-letter fraternity at…", ["McGill University", "Harvard University", "Yale University", "Brown University"], "Second at Hamilton, Alabama, McGill; first at Harvard, Yale, Brown."),
    Q("adphi", "ADPhi was the FIRST Greek-letter fraternity at…", ["Columbia University", "University of Alabama", "Hamilton College", "McGill University"], "First on 12 campuses; second at Hamilton, Alabama, McGill."),
    Q("illinois", "Illinois's ADPhi chapter began as…", ["Pi Theta, chartered 1911", "Kappa Alpha Society", "Alpha Kappa Lambda", "Phi Beta Kappa, 1776"], "Chapter installed in Chicago Jan 13, 1912."),
    Q("illinois", "Where was the Illinois Chapter installed (Jan 13, 1912)?", ["The University Club in Chicago", "Kirkland House", "310 East John Street", "Union College"], "University Club, Chicago."),
    Q("illinois", "When was the Historic Chapter House placed on the National Register of Historic Places?", ["1990", "1925", "1946", "2018"], "Built 1924–25; NRHP 1990."),
    Q("illinois", "ADPhi at Illinois was known as a house of…", ["stand-up men: leaders and prominent athletes", "scholars only", "military cadets", "artists"], "Per the slide."),
    Q("houses", "Which house did the chapter occupy 1924–2018?", ["310 East John Street", "401 East Daniel Street", "206 East Green Street", "709 S Fourth Street"], "“The New House”."),
    Q("houses", "Which address is the current house (2020 and beyond)?", ["401 East Daniel Street", "310 East John Street", "205 Green Street", "709 S Fourth Street"], "Former Alpha Kappa Lambda house."),
    Q("houses", "In 1915–1922 the chapter lived in…", ["the President's mansion at 709 S Fourth Street", "205 Green Street", "206 East Green Street", "401 East Daniel Street"], "Mansion of the University's first President."),
    Q("houses", "The 1923–1924 address (205 Green Street) was…", ["temporary quarters", "the President's mansion", "the New House", "an army barracks"], "Between the mansion and the New House."),
    Q("houses", "Why is the Fall 1943 – Spring 1946 house listed as “unknown”?", ["Most fraternities became army barracks and women's residences in WW2", "The chapter was suspended for hazing", "The house burned down", "It was moved to Chicago"], "World War II."),
    Q("rebirth", "In what year were the brothers kicked out of the house (per the slide)?", ["2015", "2018", "2020", "2021"], "Hazing, destruction, not caring for the house. (House then shut down / sold after 2018.)"),
    Q("rebirth", "Which was NOT a reason the brothers were kicked out?", ["Falling grades below the honor-society standard", "Hazing", "Throwing kegs out of the window", "Not taking care of the house"], "Hazing, destruction and neglect were the reasons."),
    Q("rebirth", "Who pulled the chapter off campus?", ["The alumni", "The University", "The Interfraternity Council", "The Cornell chapter"], "The slide stresses: NOT kicked off campus by the University."),
    Q("rebirth", "What happened to the old house after the 2018 shutdown?", ["Demolished and sold for apartment buildings", "Turned into a museum", "Renovated in place", "Given to the University"], "Not worth saving."),
    Q("rebirth", "The new house was formerly the…", ["Alpha Kappa Lambda house", "Pi Theta house", "President's mansion", "Kirkland House"], "Bought with sale money."),
    Q("rebirth", "Who designed the new house?", ["ADPhi alumni architects", "The University", "Cornell's chapter", "The national headquarters"], "They kept wood panel ceilings, paintings and the fire pit."),
    Q("rebirth", "When was the new house built?", ["Began 2020, finished Fall 2021", "Began 2015, finished 2018", "Began 1924, finished 1925", "Began 2021, finished 2023"], "“To New Beginnings!”"),
    Q("rebirth", "Which person is NOT one of the 6 founding fathers of the Illinois re-founding?", ["Samuel Eells", "Jacob Byrkit", "D.J. Dutton", "Cam Ezell"], "Eells was an original 1830s founder."),
    Q("rebirth", "Which re-founder is listed as having transferred?", ["Cam Ezell", "Zach Harrison", "Paul Rampersaud", "Henry Byrkit"], "Everyone else is Class of '23/'24.")
  ];

  // ---- ordering sets (correct order listed; the mode shuffles) -------------------------------
  const ORDER = {
    history: { name: "Greek-life history", items: [
      ["Phi Beta Kappa founded (William & Mary)", "1776"], ["PBK at Yale and Harvard", "1779"], ["Kappa Alpha Society founded (Union)", "1825"],
      ["Sigma Phi & Delta Phi founded (Union)", "1827"], ["PBK becomes national honor society", "1831"], ["ATO and KAO founded (after Civil War)", "1865"]] },
    adphi: { name: "ADPhi story", items: [
      ["Eells finds the Phoenix and Philolpeuthian at Hamilton", "pre-1830"], ["Eells selects 2 men from each society", "1830"], ["Alpha Delta Phi founded", "1832"],
      ["Cornell: first residential fraternity chapter home", "1878"], ["Pi Theta chartered", "1911"], ["Illinois Chapter installed in Chicago", "Jan 1912"]] },
    illinois: { name: "Illinois chapter timeline", items: [
      ["Pi Theta chartered", "1911"], ["Illinois Chapter installed", "1912"], ["Move to President's mansion", "1915"],
      ["Historic Chapter House built", "1924–25"], ["Army barracks / women's residence era", "1943–46"], ["Historic house on National Register", "1990"],
      ["Brothers kicked out of the house", "2015"], ["Shutdown; old house sold", "2018"], ["Construction of new house begins", "2020"], ["New house finished", "Fall 2021"]] },
    houses: { name: "Chapter houses in order", items: [
      ["206 East Green Street (Pi Theta)", "1910–15"], ["709 S Fourth Street (President's mansion)", "1915–22"], ["205 Green Street (temporary)", "1923–24"],
      ["310 East John Street (The New House)", "1924–2018"], ["401 East Daniel Street (current)", "2020+"]] }
  };

  // ---- sort sets: put each item in the right bucket ------------------------------------------
  const SORT = {
    triads: { name: "Which triad?", buckets: ["Union Triad", "Miami Triad", "Lexington Triad"], items: [
      ["Kappa Alpha Society", 0], ["Sigma Phi", 0], ["Delta Phi", 0], ["Sigma Chi", 1], ["Phi Delta Theta", 1], ["Beta Theta Pi", 1],
      ["Alpha Tau Omega", 2], ["Kappa Alpha Order", 2], ["Sigma Nu", 2]] },
    where: { name: "Founded where?", buckets: ["Union College", "VMI", "Washington & Lee", "William & Mary"], items: [
      ["Kappa Alpha Society", 0], ["Sigma Phi", 0], ["Delta Phi", 0], ["Alpha Tau Omega", 1], ["Sigma Nu", 1], ["Kappa Alpha Order", 2], ["Phi Beta Kappa", 3]] },
    when: { name: "Which century / era?", buckets: ["1700s", "1800s", "1900s", "2000s"], items: [
      ["Phi Beta Kappa founded", 0], ["PBK at Yale & Harvard", 0], ["ADPhi founded (1832)", 1], ["Cornell residential home (1878)", 1], ["Illinois chapter installed (1912)", 2],
      ["Historic house on the National Register (1990)", 2], ["Kicked out of the house (2015)", 3], ["New house finished (2021)", 3]] },
    houseEra: { name: "Which house?", buckets: ["206 E Green", "709 S Fourth", "310 E John", "401 E Daniel"], items: [
      ["Original Pi Theta house", 0], ["President's mansion", 1], ["“The New House”", 2], ["Built 1924–25", 2], ["Demolished and sold for apartments", 2],
      ["Former Alpha Kappa Lambda house", 3], ["Designed by alumni architects", 3], ["Fire pit & wood panel ceilings kept", 3]] }
  };

  // ---- cloze (type the missing word/number; | separates accepted answers) -------------------
  const CLOZE = [
    ["The first Greek letter organization was ___ , founded at William and Mary.", "Phi Beta Kappa"],
    ["Phi Beta Kappa was founded on December 5th, ___ .", "1776"],
    ["Kappa Alpha Society was founded at ___ College in 1825.", "Union"],
    ["Kappa Alpha Society, Sigma Phi and Delta Phi became known as the ___ Triad.", "Union"],
    ["Greek life came to the Midwest through the ___ Triad.", "Miami"],
    ["The Miami Triad: Sigma Chi, Phi Delta Theta and ___ .", "Beta Theta Pi"],
    ["The ___ Triad was formed right after the Civil War.", "Lexington"],
    ["ATO and Sigma Nu were founded at the ___ Military Institute.", "Virginia"],
    ["Kappa Alpha Order was founded at ___ and Lee University.", "Washington"],
    ["ADPhi's founder ___ found two literary societies at Hamilton College.", "Samuel Eells|Eells"],
    ["Eells selected ___ men from each society.", "2|two"],
    ["Alpha Delta Phi had been founded by the year ___ .", "1832"],
    ["Eells and ___ designed the fraternity's emblem and symbols.", "Latham|Lorenzo Latham"],
    ["In 1878 the ADPhi chapter at ___ was the first residential chapter home of any fraternity.", "Cornell"],
    ["Pi Theta was officially granted a charter in ___ .", "1911"],
    ["The Illinois Chapter was installed at the University Club in ___ .", "Chicago"],
    ["The chapter moved into the mansion of the University's first ___ in 1915.", "President"],
    ["The Historic Chapter House was placed on the National Register of Historic Places in ___ .", "1990"],
    ["ADPhi was known as a house of ___ men.", "stand-up|stand up"],
    ["1924–2018: ___ East John Street (The New House).", "310"],
    ["Today the chapter lives at 401 East ___ Street.", "Daniel"],
    ["During WW2 most fraternities became army ___ and women's residences.", "barracks"],
    ["The brothers were kicked out of the house for hazing and ___ of the house.", "destruction"],
    ["The chapter was pulled off campus by the ___ , not the University.", "alumni|alumnus"],
    ["The old house was sold and the money bought the abandoned ___ house.", "Alpha Kappa Lambda|AKL"],
    ["The new house was designed by ADPhi alumni ___ .", "architects|architect"],
    ["Construction of the new house began in 2020 and finished in Fall ___ .", "2021"],
    ["The closing message of the deck: GET ___ .", "involved"]
  ];

  // ---- free-recall lists ---------------------------------------------------------------------
  const RECALL = [
    { id: "first12", name: "ADPhi was FIRST on these 12 campuses", answers: [
      ["Miami University", "Miami"], ["New York University", "NYU"], ["Columbia University", "Columbia"], ["Yale University", "Yale"], ["Amherst College", "Amherst"],
      ["Brown University", "Brown"], ["Harvard University", "Harvard"], ["Hobart College", "Hobart"], ["Western Reserve University", "Western Reserve"],
      ["Bowdoin College", "Bowdoin"], ["University of Rochester", "Rochester"], ["College of City of New York", "CCNY|City College|City College of New York"]] },
    { id: "second3", name: "ADPhi was SECOND on these 3 campuses", answers: [["Hamilton College", "Hamilton"], ["University of Alabama", "Alabama"], ["McGill University", "McGill"]] },
    { id: "adphiFounders", name: "The 5 ADPhi founders", answers: [["Samuel Eells", "Eells"], ["Lorenzo Latham", "Latham"], ["John Curtiss Underwood", "Underwood"], ["Oliver Andrew Morse", "Morse"], ["Henry Lemuel Storrs", "Storrs"]] },
    { id: "refounders", name: "The 6 re-founding fathers (Illinois)", answers: [["Jacob Byrkit", "Jacob"], ["Henry Byrkit", "Henry"], ["D.J. Dutton", "Dutton|DJ"], ["Paul Rampersaud", "Rampersaud|Paul"], ["Zach Harrison", "Harrison|Zach"], ["Cam Ezell", "Ezell|Cam"]] },
    { id: "triads", name: "All 9 triad fraternities (Union, Miami, Lexington)", answers: [
      ["Kappa Alpha Society", "KA Society"], ["Sigma Phi", "Sigma Phi"], ["Delta Phi", "Delta Phi"], ["Sigma Chi", "Sigma Chi"], ["Phi Delta Theta", "Phi Delt"],
      ["Beta Theta Pi", "Beta"], ["Alpha Tau Omega", "ATO"], ["Kappa Alpha Order", "KAO"], ["Sigma Nu", "SNU"]] },
    { id: "reasons", name: "Reasons the brothers were kicked out (3)", answers: [["Hazing", "hazing"], ["Destruction of the house", "destruction|kegs|window"], ["Not caring / not taking care of the house", "not caring|neglect|not taking care"]] },
    { id: "features", name: "Historic features kept in the new house (3)", answers: [["Wood panel ceilings", "wood|ceilings|panel"], ["Paintings", "paintings|painting"], ["Fire pit", "fire pit|firepit"]] }
  ];

  // ---- match sets (merged into the existing #/match page) ------------------------------------
  const MATCH = {
    g_triads: { name: "Greek Life: fraternity ↔ triad", pairs: [["Sigma Chi", "Miami Triad"], ["Phi Delta Theta", "Miami Triad (2nd)"], ["Beta Theta Pi", "Miami Triad (3rd)"],
      ["Sigma Phi", "Union Triad"], ["Alpha Tau Omega", "Lexington Triad (VMI)"], ["Kappa Alpha Order", "Lexington Triad (W&L)"], ["Sigma Nu", "Lexington Triad (VMI, 1869)"]] },
    g_dates: { name: "Greek Life: event ↔ year", pairs: [["Phi Beta Kappa founded", "1776"], ["PBK becomes national", "1831"], ["Kappa Alpha Society", "1825"], ["Sigma Phi & Delta Phi", "1827"],
      ["ADPhi founded", "1832"], ["Cornell residential house", "1878"], ["Pi Theta chartered", "1911"], ["Illinois chapter installed", "1912"], ["Chapter House on NRHP", "1990"], ["New house finished", "2021"]] },
    g_houses: { name: "Greek Life: years ↔ house", pairs: [["1910–1915", "206 East Green Street"], ["1915–1922", "709 S Fourth Street"], ["1923–1924", "205 Green Street"],
      ["1924–2018", "310 East John Street"], ["2020 and beyond", "401 East Daniel Street"], ["WW2", "army barracks"]] },
    g_people: { name: "Greek Life: person ↔ role", pairs: [["Samuel Eells", "ADPhi founder; designed emblem"], ["Lorenzo Latham", "co-designed emblem"], ["Jacob Byrkit", "re-founder, Class of '23"],
      ["Cam Ezell", "re-founder who transferred"], ["Alumni architects", "designed new house"], ["Alumni", "pulled chapter off campus"]] }
  };

  window.DATA_GREEK = { SEC, NOTES, CARDS, POOL, QUESTIONS, ORDER, SORT, CLOZE, RECALL, MATCH };
  window.DATA_GREEK_MATCH = MATCH;
})();

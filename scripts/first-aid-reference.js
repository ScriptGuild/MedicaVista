const CATEGORIES = [
    { name: "Life-threatening — call 911 first", items: ["cpr", "choking", "bleeding", "stroke", "heartattack", "anaphylaxis", "shock"] },
    { name: "Injuries", items: ["burns", "fractures", "headinjury", "sprains", "nosebleed"] },
    { name: "Environmental", items: ["heatstroke", "heatexhaustion", "hypothermia", "frostbite"] },
    { name: "Neurological", items: ["seizure", "fainting"] },
    { name: "Poisoning", items: ["poisoning"] }
];

const SCENARIOS = {

    cpr: {
        name: "Cardiac Arrest — Hands-Only CPR",
        urgency: "high",
        urgencyLabel: "Call 911 immediately — begin compressions without delay",
        recognize: [
            "Unresponsive to tapping and shouting",
            "Not breathing, or only gasping",
            "No pulse (if you're trained to check)"
        ],
        steps: [
            "Tap the person's shoulder and shout, \"Are you okay?\"",
            "Call 911 (or point at someone and tell them to) and ask for an AED if one is nearby",
            "Lay the person on their back on a firm, flat surface",
            "Place the heel of one hand on the center of the chest, other hand on top, fingers interlaced",
            "Push hard and fast: at least 2 inches deep, at 100–120 compressions per minute",
            "Let the chest fully rise between compressions; avoid pausing",
            "If trained and willing, give 2 rescue breaths after every 30 compressions",
            "Continue until the person shows signs of life, an AED is ready to use, or EMS takes over"
        ],
        avoid: [
            "Don't stop compressions to repeatedly check for a pulse",
            "Don't hold back — cracked ribs heal; cardiac arrest doesn't wait"
        ],
        source: "Source: American Heart Association; Mayo Clinic"
    },

    choking: {
        name: "Choking (adult or child over 1 year)",
        urgency: "high",
        urgencyLabel: "Call 911 if the person cannot cough, speak, or breathe",
        recognize: [
            "Clutching the throat",
            "Cannot cough, speak, cry, or breathe",
            "Skin turning blue or dusky"
        ],
        steps: [
            "Ask, \"Are you choking?\" — if they can cough forcefully, encourage them to keep coughing",
            "If they cannot cough, speak, or breathe, have someone call 911",
            "Stand slightly behind and to the side; bend them forward at the waist",
            "Give 5 firm back blows between the shoulder blades with the heel of your hand",
            "If that doesn't work, give 5 abdominal thrusts: stand behind them, make a fist above the navel, grasp it with your other hand, and pull sharply inward and upward",
            "Alternate 5 back blows and 5 abdominal thrusts until the object is expelled or the person becomes unresponsive",
            "If they become unresponsive, lower them to the ground and begin CPR, checking the mouth for a visible object before giving breaths"
        ],
        avoid: [
            "Never do a blind finger sweep — only remove an object you can actually see"
        ],
        source: "Source: American Red Cross; Mayo Clinic"
    },

    bleeding: {
        name: "Severe / Life-Threatening Bleeding",
        urgency: "high",
        urgencyLabel: "Call 911 — do not wait to see if it slows on its own",
        recognize: [
            "Blood spurting or pooling rapidly",
            "Bandages or clothing soaking through quickly",
            "Signs of shock: pale, cool skin, rapid weak pulse"
        ],
        steps: [
            "Call 911",
            "Wear gloves if available",
            "Expose the wound — remove or cut away clothing over it",
            "Apply firm, direct pressure with a sterile dressing or clean cloth",
            "If blood soaks through, add more dressing on top — don't remove the first layer",
            "For a limb wound that won't stop with pressure, apply a tourniquet 2–3 inches above the wound (never on a joint) if trained and one is available",
            "Note the time the tourniquet was applied and tell EMS",
            "Keep the person warm and still; treat for shock"
        ],
        avoid: [
            "Don't remove an embedded object — bandage around it instead",
            "Don't lift the dressing to check on the bleeding"
        ],
        source: "Source: American Red Cross"
    },

    stroke: {
        name: "Stroke — BE FAST",
        urgency: "high",
        urgencyLabel: "Call 911 immediately — even one sign is enough",
        recognize: [
            "Balance loss, sudden dizziness, or trouble walking",
            "Eye / vision changes, sudden blurred or double vision",
            "Face drooping — ask them to smile",
            "Arm weakness — ask them to raise both arms",
            "Speech difficulty — ask them to repeat a simple sentence"
        ],
        steps: [
            "Note the exact time symptoms started",
            "Call 911 right away — never drive the person yourself",
            "Have them lie down with head and shoulders slightly elevated",
            "Loosen tight clothing",
            "Do not give food, drink, or medication",
            "If unconscious but breathing, place them in the recovery position on their side",
            "Monitor breathing closely and begin CPR if it stops"
        ],
        source: "Source: American Stroke Association; CDC"
    },

    heartattack: {
        name: "Heart Attack / Chest Pain",
        urgency: "high",
        urgencyLabel: "Call 911 — don't wait to see if it passes",
        recognize: [
            "Chest pressure, tightness, or pain lasting more than a few minutes",
            "Pain spreading to the arm, back, neck, or jaw",
            "Shortness of breath, cold sweat, nausea, or lightheadedness",
            "Symptoms can be subtler in women — nausea or unexplained fatigue alone is possible"
        ],
        steps: [
            "Call 911 immediately",
            "Have the person sit or lie down and stay as calm as possible",
            "Loosen tight clothing",
            "If they have prescribed nitroglycerin, help them take it as directed",
            "Only give aspirin if the 911 dispatcher or a clinician advises it — don't delay the call to do this",
            "If they become unresponsive with no breathing or pulse, begin CPR and use an AED if one is available"
        ],
        avoid: [
            "Don't let the person drive themselves to the hospital",
            "Don't wait to see if symptoms go away"
        ],
        source: "Source: Mayo Clinic"
    },

    anaphylaxis: {
        name: "Anaphylaxis (Severe Allergic Reaction)",
        urgency: "high",
        urgencyLabel: "Call 911 — use epinephrine first if available",
        recognize: [
            "Hives, swelling of the face, lips, tongue, or throat",
            "Difficulty breathing or wheezing",
            "Dizziness, fainting, or a rapid, weak pulse"
        ],
        steps: [
            "Call 911",
            "Ask if they carry an epinephrine auto-injector (EpiPen, Auvi-Q, or similar) and help them use it — press firmly against the outer thigh per the device's instructions",
            "Have them lie flat with legs raised, unless breathing is difficult, in which case let them sit up",
            "Loosen tight clothing and cover with a blanket",
            "If vomiting or bleeding from the mouth, turn them onto their side",
            "A second epinephrine dose can be given after 5–15 minutes if symptoms persist and another injector is available",
            "Begin CPR if there are no signs of breathing, coughing, or movement"
        ],
        avoid: [
            "Don't rely on an antihistamine (like diphenhydramine) alone — it works too slowly for anaphylaxis"
        ],
        source: "Source: Mayo Clinic"
    },

    shock: {
        name: "Shock",
        urgency: "high",
        urgencyLabel: "Call 911 — shock can follow many kinds of trauma",
        recognize: [
            "Cool, clammy, pale, or ashen skin",
            "Rapid, weak pulse and rapid breathing",
            "Nausea, dizziness, or confusion",
            "Bluish tinge to lips or fingernails"
        ],
        steps: [
            "Call 911",
            "Lay the person down and elevate the legs about 12 inches, unless this causes pain or a spinal or leg injury is suspected",
            "Keep them warm with a blanket",
            "Turn them onto their side if vomiting or bleeding from the mouth",
            "Treat any visible injury — bleeding, burns — while you wait",
            "Do not give anything to eat or drink",
            "Monitor breathing and begin CPR if it stops"
        ],
        source: "Source: Mayo Clinic"
    },

    burns: {
        name: "Burns",
        urgency: "moderate",
        urgencyLabel: "Call 911 for major burns — treat minor burns at home",
        recognize: [
            "1st degree: red, painful, no blisters",
            "2nd degree: blistering, deep red, very painful",
            "3rd degree: white, charred, or leathery skin — may be painless from nerve damage"
        ],
        steps: [
            "For minor burns: cool under cool (not cold) running water for 10–15 minutes",
            "Remove rings or tight items near the area before swelling starts",
            "Don't break blisters",
            "Cover loosely with a clean, non-fluffy bandage",
            "Take an OTC pain reliever if needed",
            "Once cooled, apply aloe vera or a moisturizing lotion",
            "For major burns: call 911, don't remove clothing stuck to the skin, and cover loosely with a cool, moist, sterile cloth"
        ],
        avoid: [
            "Don't use ice, butter, or ointments on a major burn",
            "Don't immerse a large severe burn in cold water — risk of hypothermia"
        ],
        escalate: "Call 911 for burns larger than the palm of the hand, on the face/hands/genitals, that look white or charred, or from chemicals or electricity.",
        source: "Source: Mayo Clinic"
    },

    fractures: {
        name: "Fractures (Broken Bones)",
        urgency: "moderate",
        urgencyLabel: "Call 911 for major trauma, deformity, or bone through skin",
        recognize: [
            "Visible deformity or swelling",
            "Inability to bear weight or move the area",
            "Severe pain with any movement",
            "Bone visibly protruding through skin"
        ],
        steps: [
            "Call 911 if there's major trauma, heavy bleeding, deformity, or bone through the skin",
            "Stop any bleeding with firm pressure on a sterile dressing",
            "Keep the injured area from moving — don't try to realign the bone",
            "If trained, splint above and below the fracture site, with padding",
            "Apply ice wrapped in cloth to reduce swelling — never directly on skin",
            "Treat for shock: lay the person down, head slightly lower than the trunk, and elevate the legs if there's no lower-limb injury"
        ],
        avoid: [
            "Don't move someone with a suspected neck, back, or head injury unless necessary for safety"
        ],
        source: "Source: Mayo Clinic"
    },

    headinjury: {
        name: "Head Injury / Concussion",
        urgency: "moderate",
        urgencyLabel: "Call 911 for loss of consciousness or any warning sign below",
        recognize: [
            "Loss of consciousness, even briefly",
            "Confusion, repeated vomiting, or worsening headache",
            "One pupil larger than the other, or slurred speech",
            "Concussion signs: nausea, ringing in the ears, poor balance, blurry vision, memory loss"
        ],
        steps: [
            "Call 911 for any warning sign above or after major trauma",
            "Keep the person still, lying down with head and shoulders slightly elevated",
            "Don't move their neck; don't remove a helmet if they're wearing one",
            "Apply firm pressure to any bleeding wound — unless a skull fracture is suspected",
            "Watch closely for changes in breathing or alertness",
            "Begin CPR if there are no signs of breathing, coughing, or movement"
        ],
        source: "Source: Mayo Clinic"
    },

    sprains: {
        name: "Sprains & Strains — RICE",
        urgency: "low",
        urgencyLabel: "Usually manageable at home with RICE",
        recognize: [
            "Swelling, bruising, and pain around a joint or muscle",
            "Limited range of motion",
            "No visible deformity (if deformed, treat as a possible fracture)"
        ],
        steps: [
            "Rest — stop using the injured area",
            "Ice — apply an ice pack wrapped in cloth for 10–20 minutes, several times a day, for the first 1–2 days",
            "Compress — wrap with an elastic bandage, snug but not tight",
            "Elevate — raise the injured area above heart level when possible",
            "Take an OTC pain reliever if needed"
        ],
        escalate: "Seek care if the person can't bear weight, there's visible deformity, numbness, or no improvement after a few days.",
        source: "Source: Mayo Clinic"
    },

    nosebleed: {
        name: "Nosebleed",
        urgency: "low",
        urgencyLabel: "Usually manageable at home",
        steps: [
            "Sit up and lean slightly forward — don't tilt the head back",
            "Gently blow the nose once to clear any clots",
            "Pinch the soft part of the nose shut with thumb and finger",
            "Hold continuously for 10–15 minutes, breathing through the mouth",
            "If still bleeding, pinch again for up to 15 more minutes",
            "Once stopped, avoid blowing the nose or bending over for several hours"
        ],
        escalate: "Seek emergency care if bleeding lasts more than 30 minutes, follows a fall or head injury, or the person feels faint.",
        source: "Source: Mayo Clinic"
    },

    heatstroke: {
        name: "Heatstroke",
        urgency: "high",
        urgencyLabel: "Call 911 — heatstroke is life-threatening",
        recognize: [
            "Body temperature 104°F (40°C) or higher",
            "Confusion, agitation, or slurred speech",
            "Hot, dry skin or heavy sweating; rapid pulse and breathing"
        ],
        steps: [
            "Call 911 immediately",
            "Move the person out of the heat right away",
            "Cool them by any means available: a cool tub or shower, wet sponging with fanning, or ice packs to the neck, armpits, and groin",
            "Do not give fluids if they're confused or vomiting",
            "Monitor closely and begin CPR if breathing stops"
        ],
        source: "Source: Mayo Clinic"
    },

    heatexhaustion: {
        name: "Heat Exhaustion",
        urgency: "moderate",
        urgencyLabel: "Treat immediately — can progress to heatstroke if ignored",
        recognize: [
            "Heavy sweating, weakness, headache",
            "Nausea and cool, clammy skin",
            "Dizziness or fatigue"
        ],
        steps: [
            "Move to a shady or air-conditioned place",
            "Lay the person down and raise the legs and feet slightly",
            "Remove tight or heavy clothing",
            "Have them sip cool water or an electrolyte drink — avoid caffeine and alcohol",
            "Cool with a cool spray or sponge and fan them",
            "Monitor them closely"
        ],
        escalate: "Seek medical care if symptoms worsen or don't improve within an hour.",
        source: "Source: Mayo Clinic"
    },

    hypothermia: {
        name: "Hypothermia",
        urgency: "high",
        urgencyLabel: "Call 911",
        recognize: [
            "Intense shivering (may stop as it worsens)",
            "Slurred speech, confusion, or drowsiness",
            "Slow, shallow breathing and a weak pulse",
            "Clumsiness or loss of coordination"
        ],
        steps: [
            "Call 911",
            "Gently move the person out of the cold; shield them from wind",
            "Remove wet clothing and replace with warm, dry layers",
            "Insulate them from the cold ground",
            "Apply warm (not hot) compresses to the neck, chest, and groin — wrap any heat source in a towel first",
            "Offer warm, sweet, non-alcoholic drinks if they're alert and can swallow",
            "Begin CPR if there are no signs of life"
        ],
        avoid: [
            "Don't rewarm too quickly or rub/massage the limbs — this can trigger dangerous heart rhythms"
        ],
        source: "Source: Mayo Clinic"
    },

    frostbite: {
        name: "Frostbite",
        urgency: "moderate",
        urgencyLabel: "Seek medical care for anything beyond mild frostnip",
        recognize: [
            "Cold, numb skin that regains feeling as it's warmed (frostnip)",
            "Pale, waxy, or hardened skin",
            "Blistering after rewarming"
        ],
        steps: [
            "Get out of the cold",
            "Protect the area from further damage — don't rub or massage it",
            "If there's any chance the area will refreeze, don't thaw it — refreezing causes more damage",
            "Warm gently in water around 99–104°F (37–40°C)",
            "Seek medical care for anything beyond mild frostnip"
        ],
        avoid: [
            "Don't apply direct heat — a heating pad, blow-dryer, or car heater can burn numb skin"
        ],
        source: "Source: Mayo Clinic; CDC"
    },

    seizure: {
        name: "Seizures",
        urgency: "moderate",
        urgencyLabel: "Call 911 if it lasts over 5 minutes, repeats, or it's a first seizure",
        recognize: [
            "Convulsions or loss of awareness",
            "Staring, unusual movements, or unresponsiveness"
        ],
        steps: [
            "Stay calm and time the seizure",
            "Ease the person to the ground and clear the area of hazards",
            "Cushion their head with something soft",
            "Turn them onto their side to keep the airway clear",
            "Loosen tight clothing around the neck; remove glasses",
            "Stay with them until they're fully alert, and offer reassurance afterward"
        ],
        avoid: [
            "Don't restrain the person or hold them down",
            "Never put anything in their mouth"
        ],
        escalate: "Call 911 if the seizure lasts more than 5 minutes, another follows without regaining consciousness, it's a first seizure, an injury occurred, or they don't wake up.",
        source: "Source: Mayo Clinic; Epilepsy Foundation; CDC"
    },

    fainting: {
        name: "Fainting",
        urgency: "moderate",
        urgencyLabel: "Usually brief — treat as a medical event until the cause is known",
        recognize: [
            "Sudden, brief loss of consciousness",
            "Often preceded by paleness, sweating, or lightheadedness"
        ],
        steps: [
            "If you feel faint: sit or lie down and place your head between your knees",
            "If someone else faints: lay them on their back",
            "If breathing and uninjured, raise their legs about 12 inches above heart level",
            "Loosen belts, collars, or tight clothing",
            "Don't let them get up too quickly once they're conscious",
            "Treat any bumps or cuts from the fall with direct pressure"
        ],
        escalate: "Call 911 if they don't regain consciousness within one minute, or if they were injured in the fall.",
        source: "Source: Mayo Clinic"
    },

    poisoning: {
        name: "Poisoning",
        urgency: "high",
        urgencyLabel: "Call Poison Control — or 911 if unconscious, not breathing, or seizing",
        recognize: [
            "Burns or redness around the mouth",
            "Vomiting, drowsiness, or confusion",
            "Unusual breath odor or empty medication/chemical containers nearby"
        ],
        steps: [
            "Call Poison Control at 1-800-222-1222 (US), or 911 if the person is unconscious, not breathing, or having seizures",
            "Try to identify what, how much, and when it was taken — keep the container or label if you can",
            "Follow Poison Control's specific instructions for the substance involved",
            "If it's on the skin, remove contaminated clothing and rinse with running water",
            "If inhaled, get the person to fresh air immediately",
            "If it's in the eye, flush with lukewarm water for 15–20 minutes"
        ],
        avoid: [
            "Don't give anything by mouth unless instructed to",
            "Don't induce vomiting unless a poison control specialist or clinician tells you to"
        ],
        source: "Source: Mayo Clinic; U.S. Poison Control (1-800-222-1222)"
    }
};

let currentScenario = null;

/* =========================================================
   NAV
   ========================================================= */

function renderNav() {
    const navList = document.getElementById("navList");
    navList.innerHTML = CATEGORIES.map(cat => `
        <div class="cat-block" data-cat="${escapeHTML(cat.name)}">
            <div class="cat-title">${escapeHTML(cat.name)}</div>
            ${cat.items.map(id => `
                <a class="calc-link" data-id="${id}" onclick="selectScenario('${id}')">
                    <span class="dot ${SCENARIOS[id].urgency}"></span>
                    ${escapeHTML(SCENARIOS[id].name)}
                </a>
            `).join("")}
        </div>
    `).join("");
}

function selectScenario(id) {
    currentScenario = id;
    document.querySelectorAll(".calc-link").forEach(el => {
        el.classList.toggle("active", el.dataset.id === id);
    });
    renderScenario(id);
}

function filterNav() {
    const q = document.getElementById("calcSearch").value.trim().toLowerCase();
    document.querySelectorAll(".cat-block").forEach(block => {
        let anyVisible = false;
        block.querySelectorAll(".calc-link").forEach(link => {
            const match = link.textContent.toLowerCase().includes(q);
            link.classList.toggle("hidden", !match);
            if (match) anyVisible = true;
        });
        block.classList.toggle("hidden", !anyVisible);
    });
}

document.getElementById("calcSearch").addEventListener("input", filterNav);

/* =========================================================
   RENDER SCENARIO
   ========================================================= */

function categoryOf(id) {
    const cat = CATEGORIES.find(c => c.items.includes(id));
    return cat ? cat.name : "";
}

function renderScenario(id) {
    const s = SCENARIOS[id];

    const recognizeHtml = s.recognize ? `
        <h3 class="sub">Recognize</h3>
        <ul class="recognize">
            ${s.recognize.map(r => `<li>${escapeHTML(r)}</li>`).join("")}
        </ul>
    ` : "";

    const stepsHtml = `
        <h3 class="sub">What to do</h3>
        <ol class="steps">
            ${s.steps.map(step => `<li>${escapeHTML(step)}</li>`).join("")}
        </ol>
    `;

    const avoidHtml = s.avoid ? `
        <div class="avoid-box">
            <span class="avoid-title">Avoid</span>
            <ul>
                ${s.avoid.map(a => `<li>${escapeHTML(a)}</li>`).join("")}
            </ul>
        </div>
    ` : "";

    const escalateHtml = s.escalate ? `
        <div class="escalate-box">
            <span class="esc-title">When to escalate</span>
            ${escapeHTML(s.escalate)}
        </div>
    ` : "";

    document.getElementById("panel").innerHTML = `
        <div class="scenario-head">
            <div class="cat-eyebrow">${escapeHTML(categoryOf(id))}</div>
            <h2>${escapeHTML(s.name)}</h2>
        </div>
        <div class="urgency-banner ${s.urgency}">${escapeHTML(s.urgencyLabel)}</div>
        ${recognizeHtml}
        ${stepsHtml}
        ${avoidHtml}
        ${escalateHtml}
        <div class="scenario-source">${escapeHTML(s.source)}</div>
        <div class="disclaimer">
            <strong>Reference use only</strong>
            This summarizes established first-aid guidance but does not replace certified
            first-aid/CPR training or professional medical care. When in doubt, call your
            local emergency number.
        </div>
    `;
}

function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

renderNav();

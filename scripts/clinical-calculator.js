const CATEGORIES = [
    {
        name: "General & Anthropometrics",
        items: ["bmi", "bsa", "ibw"]
    },
    {
        name: "Cardiology",
        items: ["chadsvasc", "hasbled", "qtc", "map"]
    },
    {
        name: "Nephrology & Electrolytes",
        items: ["crcl", "egfr", "corrsodium", "corrcalcium", "aniongap", "fwd"]
    },
    {
        name: "Pulmonology & Critical Care",
        items: ["wellspe", "curb65", "gcs", "pfratio"]
    },
    {
        name: "Hepatology",
        items: ["childpugh", "meldna"]
    },
    {
        name: "Hematology",
        items: ["anc"]
    },
    {
        name: "Endocrinology",
        items: ["homair"]
    },
    {
        name: "Obstetrics",
        items: ["edd", "ga"]
    }
];

const CALC_NAMES = {
    bmi: "BMI",
    bsa: "Body Surface Area (Mosteller)",
    ibw: "Ideal Body Weight (Devine)",
    chadsvasc: "CHA₂DS₂-VASc Score",
    hasbled: "HAS-BLED Score",
    qtc: "Corrected QT Interval",
    map: "Mean Arterial Pressure",
    crcl: "Creatinine Clearance (Cockcroft-Gault)",
    egfr: "eGFR (CKD-EPI 2021)",
    corrsodium: "Corrected Sodium (Hyperglycemia)",
    corrcalcium: "Corrected Calcium (Hypoalbuminemia)",
    aniongap: "Anion Gap",
    fwd: "Free Water Deficit",
    wellspe: "Wells Score — Pulmonary Embolism",
    curb65: "CURB-65 (Pneumonia Severity)",
    gcs: "Glasgow Coma Scale",
    pfratio: "PaO₂ / FiO₂ Ratio",
    childpugh: "Child-Pugh Score",
    meldna: "MELD-Na Score",
    anc: "Absolute Neutrophil Count",
    homair: "HOMA-IR (Insulin Resistance)",
    edd: "Estimated Due Date (Naegele's Rule)",
    ga: "Gestational Age"
};

let currentCalc = null;

/* =========================================================
   NAV rendering
   ========================================================= */

function renderNav() {
    const navList = document.getElementById("navList");
    navList.innerHTML = CATEGORIES.map(cat => `
        <div class="cat-block" data-cat="${escapeHTML(cat.name)}">
            <div class="cat-title">${escapeHTML(cat.name)}</div>
            ${cat.items.map(id => `
                <a class="calc-link" data-id="${id}" onclick="selectCalc('${id}')">
                    ${escapeHTML(CALC_NAMES[id])}
                </a>
            `).join("")}
        </div>
    `).join("");
}

function selectCalc(id) {
    currentCalc = id;
    document.querySelectorAll(".calc-link").forEach(el => {
        el.classList.toggle("active", el.dataset.id === id);
    });
    RENDERERS[id]();
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
   Shared render helpers
   ========================================================= */

function panel() {
    return document.getElementById("panel");
}

function calcShell(id, cols, bodyHtml, formulaText) {
    const gridClass = cols === 1 ? "field-grid single" : "field-grid";
    panel().innerHTML = `
        <div class="calc-head">
            <div class="cat-eyebrow">${escapeHTML(categoryOf(id))}</div>
            <h2>${escapeHTML(CALC_NAMES[id])}</h2>
        </div>
        <div class="${gridClass}" id="calcFields">
            ${bodyHtml}
        </div>
        <div class="result-box" id="calcResult">
            <span class="r-value">—</span>
        </div>
        ${formulaText ? `<div class="formula-note">${escapeHTML(formulaText)}</div>` : ""}
        <div class="disclaimer">
            <strong>Reference use only</strong>
            Results are calculated references, not clinical judgments. Verify inputs and
            confirm against current guidelines before acting on any value shown here.
        </div>
    `;
}

function categoryOf(id) {
    const cat = CATEGORIES.find(c => c.items.includes(id));
    return cat ? cat.name : "";
}

function field(labelText, inputHtml) {
    return `<div class="field"><label>${escapeHTML(labelText)}</label>${inputHtml}</div>`;
}

function checkField(id, labelText) {
    return `
        <div class="field checkfield" onclick="document.getElementById('${id}').click()">
            <input type="checkbox" id="${id}" onclick="event.stopPropagation(); compute()">
            <label for="${id}">${escapeHTML(labelText)}</label>
        </div>
    `;
}

function numInput(id, placeholder) {
    return `<input type="number" id="${id}" step="any" placeholder="${escapeHTML(placeholder || "")}" oninput="compute()">`;
}

function selectInput(id, options) {
    return `<select id="${id}" onchange="compute()">${options.map(o => `<option value="${o.v}">${escapeHTML(o.l)}</option>`).join("")}</select>`;
}

function setResult(valueHtml, tag, tagClass, note) {
    document.getElementById("calcResult").innerHTML = `
        ${valueHtml}
        ${tag ? `<div><span class="r-tag ${tagClass || "neutral"}">${escapeHTML(tag)}</span></div>` : ""}
        ${note ? `<div class="r-note">${note}</div>` : ""}
    `;
}

function val(id) {
    const el = document.getElementById(id);
    if (!el) return null;
    if (el.type === "checkbox") return el.checked;
    if (el.tagName === "SELECT") return parseFloat(el.value);
    const n = parseFloat(el.value);
    return isNaN(n) ? null : n;
}

function compute() {
    if (currentCalc && COMPUTERS[currentCalc]) {
        COMPUTERS[currentCalc]();
    }
}

function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

/* =========================================================
   RENDERERS — build the input form for each calculator
   ========================================================= */

const RENDERERS = {

    bmi: () => calcShell("bmi", 2, `
        ${field("Weight (kg)", numInput("bmi_wt", "70"))}
        ${field("Height (cm)", numInput("bmi_ht", "175"))}
    `, "BMI = weight(kg) / height(m)²"),

    bsa: () => calcShell("bsa", 2, `
        ${field("Weight (kg)", numInput("bsa_wt", "70"))}
        ${field("Height (cm)", numInput("bsa_ht", "175"))}
    `, "BSA(m²) = √( height(cm) × weight(kg) / 3600 )  — Mosteller formula"),

    ibw: () => calcShell("ibw", 2, `
        ${field("Sex", selectInput("ibw_sex", [{v:"m",l:"Male"},{v:"f",l:"Female"}]))}
        ${field("Height (cm)", numInput("ibw_ht", "175"))}
    `, "Devine: Male = 50 + 2.3 × (height(in) − 60)\nFemale = 45.5 + 2.3 × (height(in) − 60)"),

    chadsvasc: () => calcShell("chadsvasc", 2, `
        ${checkField("cv_chf", "Congestive heart failure / LV dysfunction (1)")}
        ${checkField("cv_htn", "Hypertension (1)")}
        ${checkField("cv_age75", "Age ≥ 75 (2)")}
        ${checkField("cv_dm", "Diabetes mellitus (1)")}
        ${checkField("cv_stroke", "Prior stroke / TIA / thromboembolism (2)")}
        ${checkField("cv_vasc", "Vascular disease (MI, PAD, aortic plaque) (1)")}
        ${checkField("cv_age65", "Age 65–74 (1)")}
        ${checkField("cv_female", "Female sex (1)")}
    `, "Score range 0–9. Guides anticoagulation decisions in atrial fibrillation."),

    hasbled: () => calcShell("hasbled", 2, `
        ${checkField("hb_htn", "Uncontrolled hypertension (1)")}
        ${checkField("hb_renal", "Abnormal renal function (1)")}
        ${checkField("hb_liver", "Abnormal liver function (1)")}
        ${checkField("hb_stroke", "Prior stroke (1)")}
        ${checkField("hb_bleed", "Prior major bleeding or predisposition (1)")}
        ${checkField("hb_inr", "Labile INR (time in range < 60%) (1)")}
        ${checkField("hb_elderly", "Age > 65 (1)")}
        ${checkField("hb_drugs", "Antiplatelet / NSAID use (1)")}
        ${checkField("hb_alcohol", "Alcohol use ≥ 8 drinks/week (1)")}
    `, "Score range 0–9. Estimates 1-year major bleeding risk on anticoagulation."),

    qtc: () => calcShell("qtc", 2, `
        ${field("QT interval (ms)", numInput("qtc_qt", "400"))}
        ${field("Heart rate (bpm)", numInput("qtc_hr", "70"))}
    `, "RR(sec) = 60 / HR\nBazett: QTc = QT / √RR\nFridericia: QTc = QT / RR^(1/3)"),

    map: () => calcShell("map", 2, `
        ${field("Systolic BP (mmHg)", numInput("map_sbp", "120"))}
        ${field("Diastolic BP (mmHg)", numInput("map_dbp", "80"))}
    `, "MAP = DBP + (SBP − DBP) / 3"),

    crcl: () => calcShell("crcl", 2, `
        ${field("Age (years)", numInput("crcl_age", "60"))}
        ${field("Weight (kg)", numInput("crcl_wt", "70"))}
        ${field("Serum creatinine (mg/dL)", numInput("crcl_scr", "1.0"))}
        ${field("Sex", selectInput("crcl_sex", [{v:"m",l:"Male"},{v:"f",l:"Female"}]))}
    `, "Cockcroft-Gault:\nCrCl = [(140 − age) × weight(kg) × (0.85 if female)] / (72 × SCr)"),

    egfr: () => calcShell("egfr", 2, `
        ${field("Age (years)", numInput("egfr_age", "60"))}
        ${field("Serum creatinine (mg/dL)", numInput("egfr_scr", "1.0"))}
        ${field("Sex", selectInput("egfr_sex", [{v:"m",l:"Male"},{v:"f",l:"Female"}]))}
    `, "CKD-EPI 2021 (race-free) creatinine equation."),

    corrsodium: () => calcShell("corrsodium", 2, `
        ${field("Measured sodium (mEq/L)", numInput("cs_na", "135"))}
        ${field("Serum glucose (mg/dL)", numInput("cs_glu", "300"))}
    `, "Corrected Na = measured Na + 1.6 × [(glucose − 100) / 100]"),

    corrcalcium: () => calcShell("corrcalcium", 2, `
        ${field("Measured calcium (mg/dL)", numInput("cc_ca", "8.5"))}
        ${field("Serum albumin (g/dL)", numInput("cc_alb", "3.0"))}
    `, "Corrected Ca = measured Ca + 0.8 × (4.0 − albumin)"),

    aniongap: () => calcShell("aniongap", 2, `
        ${field("Sodium (mEq/L)", numInput("ag_na", "140"))}
        ${field("Chloride (mEq/L)", numInput("ag_cl", "104"))}
        ${field("Bicarbonate (mEq/L)", numInput("ag_hco3", "24"))}
    `, "Anion gap = Na − (Cl + HCO₃)   |   normal ≈ 8–12 mEq/L"),

    fwd: () => calcShell("fwd", 2, `
        ${field("Sex", selectInput("fwd_sex", [{v:"m",l:"Male"},{v:"f",l:"Female"}]))}
        ${field("Weight (kg)", numInput("fwd_wt", "70"))}
        ${field("Current sodium (mEq/L)", numInput("fwd_na", "155"))}
    `, "TBW = weight × (0.6 male / 0.5 female)\nFree water deficit = TBW × [(Na / 140) − 1]"),

    wellspe: () => calcShell("wellspe", 2, `
        ${checkField("w_dvt", "Clinical signs of DVT (3)")}
        ${checkField("w_altdx", "PE is #1 diagnosis, or equally likely (3)")}
        ${checkField("w_hr", "Heart rate > 100 bpm (1.5)")}
        ${checkField("w_immob", "Immobilization ≥ 3 days or surgery in past 4 weeks (1.5)")}
        ${checkField("w_prior", "Prior DVT or PE (1.5)")}
        ${checkField("w_hemop", "Hemoptysis (1)")}
        ${checkField("w_malig", "Malignancy (treated within 6 months, or palliative) (1)")}
    `, "3-tier: Low < 2, Moderate 2–6, High > 6\n2-tier: PE unlikely ≤ 4, PE likely > 4"),

    curb65: () => calcShell("curb65", 2, `
        ${checkField("cb_confusion", "New confusion (1)")}
        ${checkField("cb_urea", "Urea > 7 mmol/L (BUN > 19 mg/dL) (1)")}
        ${checkField("cb_rr", "Respiratory rate ≥ 30/min (1)")}
        ${checkField("cb_bp", "SBP < 90 mmHg or DBP ≤ 60 mmHg (1)")}
        ${checkField("cb_age", "Age ≥ 65 (1)")}
    `, "Score 0–1: outpatient. 2: consider admission. 3–5: severe, consider ICU."),

    gcs: () => calcShell("gcs", 1, `
        ${field("Eye opening", selectInput("gcs_eye", [
            {v:4,l:"4 — Spontaneous"},
            {v:3,l:"3 — To speech"},
            {v:2,l:"2 — To pain"},
            {v:1,l:"1 — None"}
        ]))}
        ${field("Verbal response", selectInput("gcs_verbal", [
            {v:5,l:"5 — Oriented"},
            {v:4,l:"4 — Confused"},
            {v:3,l:"3 — Inappropriate words"},
            {v:2,l:"2 — Incomprehensible sounds"},
            {v:1,l:"1 — None"}
        ]))}
        ${field("Motor response", selectInput("gcs_motor", [
            {v:6,l:"6 — Obeys commands"},
            {v:5,l:"5 — Localizes pain"},
            {v:4,l:"4 — Withdraws from pain"},
            {v:3,l:"3 — Abnormal flexion"},
            {v:2,l:"2 — Extension"},
            {v:1,l:"1 — None"}
        ]))}
    `, "Total = Eye + Verbal + Motor (range 3–15)"),

    pfratio: () => calcShell("pfratio", 2, `
        ${field("PaO₂ (mmHg)", numInput("pf_pao2", "90"))}
        ${field("FiO₂ (%, e.g. 40 for 40%)", numInput("pf_fio2", "40"))}
    `, "P/F ratio = PaO₂ / FiO₂(decimal)   — Berlin ARDS criteria"),

    childpugh: () => calcShell("childpugh", 2, `
        ${field("Total bilirubin (mg/dL)", selectInput("cp_bili", [
            {v:1,l:"< 2"}, {v:2,l:"2 – 3"}, {v:3,l:"> 3"}
        ]))}
        ${field("Albumin (g/dL)", selectInput("cp_alb", [
            {v:1,l:"> 3.5"}, {v:2,l:"2.8 – 3.5"}, {v:3,l:"< 2.8"}
        ]))}
        ${field("INR", selectInput("cp_inr", [
            {v:1,l:"< 1.7"}, {v:2,l:"1.7 – 2.3"}, {v:3,l:"> 2.3"}
        ]))}
        ${field("Ascites", selectInput("cp_ascites", [
            {v:1,l:"None"}, {v:2,l:"Mild"}, {v:3,l:"Moderate–severe"}
        ]))}
        ${field("Hepatic encephalopathy", selectInput("cp_enceph", [
            {v:1,l:"None"}, {v:2,l:"Grade 1–2"}, {v:3,l:"Grade 3–4"}
        ]))}
    `, "Sum 5–6: Class A. 7–9: Class B. 10–15: Class C."),

    meldna: () => calcShell("meldna", 2, `
        ${field("Bilirubin (mg/dL)", numInput("mn_bili", "1.0"))}
        ${field("INR", numInput("mn_inr", "1.1"))}
        ${field("Creatinine (mg/dL)", numInput("mn_cr", "1.0"))}
        ${field("Sodium (mEq/L)", numInput("mn_na", "137"))}
    `, "MELD = 3.78×ln(bili) + 11.2×ln(INR) + 9.57×ln(creat) + 6.43\nMELD-Na adjusts for sodium when MELD > 11. Values are bounded per UNOS convention."),

    anc: () => calcShell("anc", 2, `
        ${field("WBC (×10³/µL)", numInput("anc_wbc", "6.0"))}
        ${field("Segmented neutrophils (%)", numInput("anc_segs", "55"))}
        ${field("Band forms (%)", numInput("anc_bands", "3"))}
    `, "ANC = WBC × [(% segs + % bands) / 100] × 1000 cells/µL"),

    homair: () => calcShell("homair", 2, `
        ${field("Fasting glucose (mg/dL)", numInput("homa_glu", "90"))}
        ${field("Fasting insulin (µIU/mL)", numInput("homa_ins", "8"))}
    `, "HOMA-IR = (fasting glucose × fasting insulin) / 405"),

    edd: () => calcShell("edd", 1, `
        ${field("First day of last menstrual period", `<input type="date" id="edd_lmp" onchange="compute()">`)}
    `, "Naegele's Rule: EDD = LMP + 280 days"),

    ga: () => calcShell("ga", 1, `
        ${field("First day of last menstrual period", `<input type="date" id="ga_lmp" onchange="compute()">`)}
        ${field("As-of date", `<input type="date" id="ga_today" onchange="compute()">`)}
    `, "Gestational age = (as-of date − LMP) in completed weeks + days")
};

/* =========================================================
   COMPUTERS — formulas + interpretation
   ========================================================= */

const COMPUTERS = {

    bmi: () => {
        const wt = val("bmi_wt"), ht = val("bmi_ht");
        if (wt == null || ht == null || ht <= 0) return setResult(`<span class="r-value">—</span>`);
        const m = ht / 100;
        const bmi = wt / (m * m);
        let tag = "Normal", cls = "low";
        if (bmi < 18.5) { tag = "Underweight"; cls = "moderate"; }
        else if (bmi >= 25 && bmi < 30) { tag = "Overweight"; cls = "moderate"; }
        else if (bmi >= 30) { tag = "Obese"; cls = "high"; }
        setResult(`<span class="r-value">${bmi.toFixed(1)}</span><span class="r-unit">kg/m²</span>`, tag, cls);
    },

    bsa: () => {
        const wt = val("bsa_wt"), ht = val("bsa_ht");
        if (wt == null || ht == null) return setResult(`<span class="r-value">—</span>`);
        const bsa = Math.sqrt((ht * wt) / 3600);
        setResult(`<span class="r-value">${bsa.toFixed(2)}</span><span class="r-unit">m²</span>`);
    },

    ibw: () => {
        const sex = val("ibw_sex"), ht = val("ibw_ht");
        if (ht == null) return setResult(`<span class="r-value">—</span>`);
        const inches = ht / 2.54;
        const base = sex === 0 ? 45.5 : 50; // select default is index0=male value "m" -> handled below
        const isFemale = document.getElementById("ibw_sex").value === "f";
        const ibw = (isFemale ? 45.5 : 50) + 2.3 * (inches - 60);
        setResult(`<span class="r-value">${ibw.toFixed(1)}</span><span class="r-unit">kg</span>`,
            null, null, `Height: ${inches.toFixed(1)} in`);
    },

    chadsvasc: () => {
        let score = 0;
        if (val("cv_chf")) score += 1;
        if (val("cv_htn")) score += 1;
        if (val("cv_age75")) score += 2;
        if (val("cv_dm")) score += 1;
        if (val("cv_stroke")) score += 2;
        if (val("cv_vasc")) score += 1;
        if (val("cv_age65")) score += 1;
        if (val("cv_female")) score += 1;
        let tag = "Low", cls = "low";
        if (score === 1) { tag = "Low–moderate"; cls = "moderate"; }
        else if (score >= 2) { tag = "Anticoagulation generally indicated"; cls = "high"; }
        setResult(`<span class="r-value">${score}</span><span class="r-unit">/ 9</span>`, tag, cls);
    },

    hasbled: () => {
        let score = 0;
        ["hb_htn","hb_renal","hb_liver","hb_stroke","hb_bleed","hb_inr","hb_elderly","hb_drugs","hb_alcohol"]
            .forEach(id => { if (val(id)) score += 1; });
        let tag = "Low bleeding risk", cls = "low";
        if (score === 3) { tag = "Moderate bleeding risk"; cls = "moderate"; }
        else if (score >= 4) { tag = "High bleeding risk — caution"; cls = "high"; }
        setResult(`<span class="r-value">${score}</span><span class="r-unit">/ 9</span>`, tag, cls);
    },

    qtc: () => {
        const qt = val("qtc_qt"), hr = val("qtc_hr");
        if (qt == null || hr == null || hr <= 0) return setResult(`<span class="r-value">—</span>`);
        const rr = 60 / hr;
        const bazett = qt / Math.sqrt(rr);
        const fridericia = qt / Math.cbrt(rr);
        let tag = "Normal", cls = "low";
        if (bazett > 460) { tag = "Prolonged"; cls = "high"; }
        else if (bazett > 440) { tag = "Borderline"; cls = "moderate"; }
        setResult(
            `<span class="r-value">${bazett.toFixed(0)}</span><span class="r-unit">ms (Bazett)</span>`,
            tag, cls,
            `Fridericia: ${fridericia.toFixed(0)} ms`
        );
    },

    map: () => {
        const sbp = val("map_sbp"), dbp = val("map_dbp");
        if (sbp == null || dbp == null) return setResult(`<span class="r-value">—</span>`);
        const map = dbp + (sbp - dbp) / 3;
        let tag = "Adequate perfusion", cls = "low";
        if (map < 65) { tag = "Below target (< 65)"; cls = "high"; }
        setResult(`<span class="r-value">${map.toFixed(0)}</span><span class="r-unit">mmHg</span>`, tag, cls);
    },

    crcl: () => {
        const age = val("crcl_age"), wt = val("crcl_wt"), scr = val("crcl_scr");
        const sex = document.getElementById("crcl_sex")?.value;
        if (age == null || wt == null || scr == null || scr <= 0) return setResult(`<span class="r-value">—</span>`);
        let crcl = ((140 - age) * wt) / (72 * scr);
        if (sex === "f") crcl *= 0.85;
        setResult(`<span class="r-value">${crcl.toFixed(0)}</span><span class="r-unit">mL/min</span>`);
    },

    egfr: () => {
        const age = val("egfr_age"), scr = val("egfr_scr");
        const sex = document.getElementById("egfr_sex")?.value;
        if (age == null || scr == null || scr <= 0) return setResult(`<span class="r-value">—</span>`);
        let egfr;
        if (sex === "f") {
            const k = 0.7;
            const a = scr <= k ? -0.241 : -1.200;
            egfr = 142 * Math.pow(scr / k, a) * Math.pow(0.9938, age) * 1.012;
        } else {
            const k = 0.9;
            const a = scr <= k ? -0.302 : -1.200;
            egfr = 142 * Math.pow(scr / k, a) * Math.pow(0.9938, age);
        }
        let tag = "Normal / high", cls = "low";
        if (egfr < 15) { tag = "Kidney failure (G5)"; cls = "high"; }
        else if (egfr < 30) { tag = "Severely decreased (G4)"; cls = "high"; }
        else if (egfr < 45) { tag = "Moderate–severe (G3b)"; cls = "moderate"; }
        else if (egfr < 60) { tag = "Mild–moderate (G3a)"; cls = "moderate"; }
        else if (egfr < 90) { tag = "Mildly decreased (G2)"; cls = "low"; }
        setResult(`<span class="r-value">${egfr.toFixed(0)}</span><span class="r-unit">mL/min/1.73m²</span>`, tag, cls);
    },

    corrsodium: () => {
        const na = val("cs_na"), glu = val("cs_glu");
        if (na == null || glu == null) return setResult(`<span class="r-value">—</span>`);
        const corrected = na + 1.6 * ((glu - 100) / 100);
        setResult(`<span class="r-value">${corrected.toFixed(1)}</span><span class="r-unit">mEq/L</span>`);
    },

    corrcalcium: () => {
        const ca = val("cc_ca"), alb = val("cc_alb");
        if (ca == null || alb == null) return setResult(`<span class="r-value">—</span>`);
        const corrected = ca + 0.8 * (4.0 - alb);
        setResult(`<span class="r-value">${corrected.toFixed(1)}</span><span class="r-unit">mg/dL</span>`);
    },

    aniongap: () => {
        const na = val("ag_na"), cl = val("ag_cl"), hco3 = val("ag_hco3");
        if (na == null || cl == null || hco3 == null) return setResult(`<span class="r-value">—</span>`);
        const gap = na - (cl + hco3);
        let tag = "Normal", cls = "low";
        if (gap > 12) { tag = "High anion gap"; cls = "high"; }
        setResult(`<span class="r-value">${gap.toFixed(0)}</span><span class="r-unit">mEq/L</span>`, tag, cls);
    },

    fwd: () => {
        const wt = val("fwd_wt"), na = val("fwd_na");
        const sex = document.getElementById("fwd_sex")?.value;
        if (wt == null || na == null) return setResult(`<span class="r-value">—</span>`);
        const tbwFactor = sex === "f" ? 0.5 : 0.6;
        const tbw = wt * tbwFactor;
        const deficit = tbw * ((na / 140) - 1);
        setResult(`<span class="r-value">${deficit.toFixed(1)}</span><span class="r-unit">L</span>`,
            null, null, `Total body water estimate: ${tbw.toFixed(1)} L`);
    },

    wellspe: () => {
        let score = 0;
        if (val("w_dvt")) score += 3;
        if (val("w_altdx")) score += 3;
        if (val("w_hr")) score += 1.5;
        if (val("w_immob")) score += 1.5;
        if (val("w_prior")) score += 1.5;
        if (val("w_hemop")) score += 1;
        if (val("w_malig")) score += 1;
        let tag = "Low probability", cls = "low";
        if (score > 6) { tag = "High probability"; cls = "high"; }
        else if (score >= 2) { tag = "Moderate probability"; cls = "moderate"; }
        setResult(`<span class="r-value">${score}</span>`, tag, cls,
            score > 4 ? "2-tier: PE likely (> 4)" : "2-tier: PE unlikely (≤ 4)");
    },

    curb65: () => {
        let score = 0;
        ["cb_confusion","cb_urea","cb_rr","cb_bp","cb_age"].forEach(id => { if (val(id)) score += 1; });
        let tag = "Low risk — outpatient", cls = "low";
        if (score === 2) { tag = "Moderate — consider admission"; cls = "moderate"; }
        else if (score >= 3) { tag = "Severe — consider ICU"; cls = "high"; }
        setResult(`<span class="r-value">${score}</span><span class="r-unit">/ 5</span>`, tag, cls);
    },

    gcs: () => {
        const eye = val("gcs_eye") ?? 4, verbal = val("gcs_verbal") ?? 5, motor = val("gcs_motor") ?? 6;
        const total = eye + verbal + motor;
        let tag = "Mild", cls = "low";
        if (total <= 8) { tag = "Severe"; cls = "high"; }
        else if (total <= 12) { tag = "Moderate"; cls = "moderate"; }
        setResult(`<span class="r-value">${total}</span><span class="r-unit">/ 15</span>`, tag, cls,
            `E${eye} V${verbal} M${motor}`);
    },

    pfratio: () => {
        const pao2 = val("pf_pao2"), fio2pct = val("pf_fio2");
        if (pao2 == null || fio2pct == null || fio2pct <= 0) return setResult(`<span class="r-value">—</span>`);
        const ratio = pao2 / (fio2pct / 100);
        let tag = "Normal", cls = "low";
        if (ratio < 100) { tag = "Severe ARDS"; cls = "high"; }
        else if (ratio < 200) { tag = "Moderate ARDS"; cls = "high"; }
        else if (ratio < 300) { tag = "Mild ARDS"; cls = "moderate"; }
        setResult(`<span class="r-value">${ratio.toFixed(0)}</span>`, tag, cls);
    },

    childpugh: () => {
        const score = (val("cp_bili")||1) + (val("cp_alb")||1) + (val("cp_inr")||1) + (val("cp_ascites")||1) + (val("cp_enceph")||1);
        let tag = "Class A", cls = "low";
        if (score >= 10) { tag = "Class C"; cls = "high"; }
        else if (score >= 7) { tag = "Class B"; cls = "moderate"; }
        setResult(`<span class="r-value">${score}</span><span class="r-unit">/ 15</span>`, tag, cls);
    },

    meldna: () => {
        let bili = val("mn_bili"), inr = val("mn_inr"), cr = val("mn_cr"), na = val("mn_na");
        if (bili == null || inr == null || cr == null || na == null) return setResult(`<span class="r-value">—</span>`);
        bili = Math.max(bili, 1.0);
        inr = Math.max(inr, 1.0);
        cr = Math.min(Math.max(cr, 1.0), 4.0);
        na = Math.min(Math.max(na, 125), 137);
        let meld = 3.78 * Math.log(bili) + 11.2 * Math.log(inr) + 9.57 * Math.log(cr) + 6.43;
        meld = Math.round(meld);
        let meldNa = meld;
        if (meld > 11) {
            meldNa = meld + 1.32 * (137 - na) - (0.033 * meld * (137 - na));
        }
        meldNa = Math.round(Math.min(Math.max(meldNa, 6), 40));
        let tag = "Lower short-term mortality risk", cls = "low";
        if (meldNa >= 25) { tag = "High short-term mortality risk"; cls = "high"; }
        else if (meldNa >= 15) { tag = "Increased mortality risk"; cls = "moderate"; }
        setResult(`<span class="r-value">${meldNa}</span>`, tag, cls, `Raw MELD (unadjusted): ${meld}`);
    },

    anc: () => {
        const wbc = val("anc_wbc"), segs = val("anc_segs"), bands = val("anc_bands");
        if (wbc == null || segs == null || bands == null) return setResult(`<span class="r-value">—</span>`);
        const anc = wbc * ((segs + bands) / 100) * 1000;
        let tag = "Normal", cls = "low";
        if (anc < 500) { tag = "Severe neutropenia"; cls = "high"; }
        else if (anc < 1000) { tag = "Moderate neutropenia"; cls = "high"; }
        else if (anc < 1500) { tag = "Mild neutropenia"; cls = "moderate"; }
        setResult(`<span class="r-value">${anc.toFixed(0)}</span><span class="r-unit">cells/µL</span>`, tag, cls);
    },

    homair: () => {
        const glu = val("homa_glu"), ins = val("homa_ins");
        if (glu == null || ins == null) return setResult(`<span class="r-value">—</span>`);
        const homa = (glu * ins) / 405;
        let tag = "Normal insulin sensitivity", cls = "low";
        if (homa >= 2.5) { tag = "Suggestive of insulin resistance"; cls = "moderate"; }
        setResult(`<span class="r-value">${homa.toFixed(2)}</span>`, tag, cls);
    },

    edd: () => {
        const lmpStr = document.getElementById("edd_lmp")?.value;
        if (!lmpStr) return setResult(`<span class="r-value">—</span>`);
        const lmp = new Date(lmpStr + "T00:00:00");
        const edd = new Date(lmp.getTime() + 280 * 86400000);
        setResult(`<span class="r-value">${edd.toLocaleDateString(undefined, {year:"numeric", month:"short", day:"numeric"})}</span>`);
    },

    ga: () => {
        const lmpStr = document.getElementById("ga_lmp")?.value;
        const todayStr = document.getElementById("ga_today")?.value;
        if (!lmpStr || !todayStr) return setResult(`<span class="r-value">—</span>`);
        const lmp = new Date(lmpStr + "T00:00:00");
        const today = new Date(todayStr + "T00:00:00");
        const days = Math.round((today - lmp) / 86400000);
        if (days < 0) return setResult(`<span class="r-value">—</span>`, "Check dates", "moderate");
        const weeks = Math.floor(days / 7);
        const rem = days % 7;
        setResult(`<span class="r-value">${weeks}w ${rem}d</span>`);
    }
};

renderNav();

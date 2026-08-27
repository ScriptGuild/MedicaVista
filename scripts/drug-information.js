const RXNORM = "https://rxnav.nlm.nih.gov/REST";


async function api(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("API request failed");
    }
    return await response.json();
}


async function searchDrug() {

    const input = document.getElementById("drugInput");
    const status = document.getElementById("status");
    const results = document.getElementById("results");

    const drug = input.value.trim();

    results.innerHTML = "";

    if (!drug) {
        status.innerHTML = '<span class="error">Enter a drug name.</span>';
        return;
    }

    status.innerHTML = '<span class="loading">Querying RxNorm…</span>';

    try {

        const searchData = await api(
            `${RXNORM}/rxcui.json?name=${encodeURIComponent(drug)}&search=9`
        );

        const ids = searchData.idGroup?.rxnormId;

        if (!ids || ids.length === 0) {
            status.innerHTML = '<span class="error">No match found.</span>';
            return;
        }

        const rxcui = ids[0];

        const propertiesData = await api(
            `${RXNORM}/rxcui/${rxcui}/properties.json`
        );
        const properties = propertiesData.properties || {};

        let relatedData = {};
        try {
            relatedData = await api(`${RXNORM}/rxcui/${rxcui}/allrelated.json`);
        } catch (e) {
            console.log("Related concepts unavailable.");
        }

        let ndcData = {};
        try {
            ndcData = await api(`${RXNORM}/rxcui/${rxcui}/ndcs.json`);
        } catch (e) {
            console.log("NDC information unavailable.");
        }

        let classData = {};
        try {
            classData = await api(
                `${RXNORM}/rxclass/class/byRxcui.json?rxcui=${rxcui}`
            );
        } catch (e) {
            console.log("Drug class information unavailable.");
        }

        const name = properties.name || "Unknown";
        const synonym = properties.synonym || "—";
        const tty = properties.tty || "—";
        const language = properties.language || "English";
        const suppress = properties.suppress || "—";

        let ingredients = [];
        let relatedConcepts = [];

        const groups = relatedData.allRelatedGroup?.conceptGroup || [];

        groups.forEach(group => {
            const ttyType = group.tty;
            const concepts = group.conceptProperties || [];

            concepts.forEach(concept => {
                const conceptName = concept.name || "";

                if (ttyType === "IN") {
                    ingredients.push(conceptName);
                }
                if (ttyType === "SBD" || ttyType === "SCD") {
                    relatedConcepts.push(conceptName);
                }
            });
        });

        const ndcs = ndcData.ndcGroup?.ndcList?.ndc || [];

        let classes = [];
        const classGroups = classData.rxclassDrugInfoList?.rxclassDrugInfo || [];

        classGroups.forEach(item => {
            const className = item.rxclassMinConceptItem?.className;
            if (className) classes.push(className);
        });

        ingredients = [...new Set(ingredients)];
        relatedConcepts = [...new Set(relatedConcepts)];
        classes = [...new Set(classes)];

        status.innerHTML = "";

        results.innerHTML = `
            <div class="result">

                <div class="head-row">
                    <h2>${escapeHTML(name)}</h2>
                    <div class="rxcui">RXCUI ${escapeHTML(rxcui)}</div>
                </div>

                <table class="fields">
                    <tr><td class="k">Concept type</td><td class="v">${escapeHTML(tty)}</td></tr>
                    <tr><td class="k">Synonym</td><td class="v">${escapeHTML(synonym)}</td></tr>
                    <tr><td class="k">Language</td><td class="v">${escapeHTML(language)}</td></tr>
                    <tr><td class="k">Status</td><td class="v">${escapeHTML(suppress)}</td></tr>
                    <tr><td class="k">Search term</td><td class="v">${escapeHTML(drug)}</td></tr>
                </table>

                <div class="section">
                    <h3>Ingredients</h3>
                    ${makeChips(ingredients, "No ingredient data available.")}
                </div>

                <div class="section">
                    <h3>Drug classes</h3>
                    ${makeChips(classes, "No drug-class data available.")}
                </div>

                <div class="section">
                    <h3>Related concepts (SCD / SBD)</h3>
                    ${makeChips(relatedConcepts, "No related concepts available.")}
                </div>

                <div class="section">
                    <h3>NDC codes</h3>
                    ${makePlainList(ndcs, "No NDC data available for this concept.")}
                </div>

                <div class="section">
                    <div class="warning">
                        <strong>Reference use only</strong>
                        Data is sourced from RxNorm/RxNav and may be incomplete or out of date.
                        Confirm all clinical decisions against current prescribing information
                        and institutional protocol.
                    </div>
                </div>

                <div class="source">Source: NLM RxNorm / RxNav API</div>

            </div>
        `;
    }

    catch (error) {
        console.error(error);
        status.innerHTML = '<span class="error">Request failed. Try again.</span>';
    }
}


function makeChips(items, emptyMessage) {
    if (!items || items.length === 0) {
        return `<div class="empty">${escapeHTML(emptyMessage)}</div>`;
    }
    return `
        <ul class="itemlist">
            ${items.map(item => `<li>${escapeHTML(item)}</li>`).join("")}
        </ul>
    `;
}


function makePlainList(items, emptyMessage) {
    if (!items || items.length === 0) {
        return `<div class="empty">${escapeHTML(emptyMessage)}</div>`;
    }
    return `
        <ul class="plainlist">
            ${items.map(item => `<li>${escapeHTML(item)}</li>`).join("")}
        </ul>
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


document.getElementById("drugInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchDrug();
    }
});

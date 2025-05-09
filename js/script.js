// Dados de benchmark incorporados diretamente no JavaScript
// Contém informações setoriais sobre taxas de conversão e ciclos de decisão
const benchmarkData = {
  setores: {
    SaaS: {
      taxa_conversao_total_benchmark: 3.8,
      fonte:
        "Taxa de conversão varia por setor, dispositivo e rede social (mLabs, Outubro 2024)",
      taxas_conversao: {
        lead_para_mql: 20,
        mql_para_sql: 30,
        sql_para_oportunidade: 50,
        oportunidade_para_cliente: 25,
        total_benchmark: 0,
      },
      ciclo_decisao_dias: {
        transacional: [0, 30],
        consultivo_medio_valor: [31, 90],
        consultivo_alto_valor: [91, 180],
        enterprise: [181, 360],
      },
    },
    "E-commerce": {
      taxa_conversao_total_benchmark: 3.28,
      fonte:
        "Panorama de Geração de Leads no Brasil 2025 (Leadster, via Agendor - Taxa para B2C em geral)",
      taxas_conversao: {
        visitante_para_carrinho: 10,
        carrinho_para_checkout: 60,
        checkout_para_compra: 70,
        total_benchmark: 0,
      },
      ciclo_decisao_dias: {
        transacional: [0, 30],
        consultivo_medio_valor: [31, 90],
        consultivo_alto_valor: [91, 180],
        enterprise: [181, 360],
      },
    },
    Indústria: {
      taxa_conversao_total_benchmark: 3.81,
      fonte:
        "Panorama de Geração de Leads no Brasil 2025 (Leadster, via Agendor)",
      taxas_conversao: {
        contato_para_qualificacao: 25,
        qualificacao_para_proposta: 40,
        proposta_para_negociacao: 60,
        negociacao_para_fechamento: 30,
        total_benchmark: 0,
      },
      ciclo_decisao_dias: {
        transacional: [0, 30],
        consultivo_medio_valor: [31, 90],
        consultivo_alto_valor: [91, 180],
        enterprise: [181, 360],
      },
    },
    "Serviços B2B": {
      taxa_conversao_total_benchmark: 2.5,
      fonte:
        "Panorama de Geração de Leads no Brasil 2025 (Leadster, via Agendor - Taxa para B2B em geral)",
      taxas_conversao: {
        lead_para_reuniao: 15,
        reuniao_para_proposta: 50,
        proposta_para_negociacao: 65,
        negociacao_para_cliente: 35,
        total_benchmark: 0,
      },
      ciclo_decisao_dias: {
        transacional: [0, 30],
        consultivo_medio_valor: [31, 90],
        consultivo_alto_valor: [91, 180],
        enterprise: [181, 360],
      },
    },
    Educação: {
      taxa_conversao_total_benchmark: 8.4,
      fonte:
        "Taxa de conversão varia por setor, dispositivo e rede social (mLabs, Outubro 2024)",
      taxas_conversao: {
        interessado_para_inscrito: 10,
        inscrito_para_matriculado: 40,
        total_benchmark: 0,
      },
      ciclo_decisao_dias: {
        transacional: [0, 30],
        consultivo_medio_valor: [31, 90],
        consultivo_alto_valor: [91, 180],
        enterprise: [181, 360],
      },
    },
    Consultoria: {
      taxa_conversao_total_benchmark: 1.55,
      fonte:
        "Panorama de Geração de Leads no Brasil 2025 (Leadster, via Agendor)",
      taxas_conversao: {
        primeiro_contato_para_diagnostico: 30,
        diagnostico_para_proposta: 60,
        proposta_para_fechamento: 40,
        total_benchmark: 0,
      },
      ciclo_decisao_dias: {
        transacional: [0, 30],
        consultivo_medio_valor: [31, 90],
        consultivo_alto_valor: [91, 180],
        enterprise: [181, 360],
      },
    },

    Saúde: {
      taxa_conversao_total_benchmark: 4.07,
      fonte:
        "Panorama de Geração de Leads no Brasil 2025(Leadster, via Agendor)",
      taxas_conversao: {
        total_benchmark: 4.07,
      },
      ciclo_decisao_dias: {
        transacional: [0, 30],
        consultivo_medio_valor: [31, 90],
        consultivo_alto_valor: [91, 180],
        enterprise: [181, 360],
      },
    },
  },
};

for (const sector in benchmarkData.setores) {
  if (
    benchmarkData.setores[sector].taxas_conversao &&
    !benchmarkData.setores[sector].taxa_conversao_total_benchmark
  ) {
    let etapas = benchmarkData.setores[sector].taxas_conversao;
    let benchmarkTotal = 1;
    let countEtapas = 0;
    for (const etapa in etapas) {
      if (etapa !== "total_benchmark" && etapas[etapa] > 0) {
        benchmarkTotal *= etapas[etapa] / 100;
        countEtapas++;
      }
    }
    if (countEtapas > 0) {
      benchmarkData.setores[sector].taxas_conversao.total_benchmark =
        parseFloat((benchmarkTotal * 100).toFixed(2));
    }
  }
}

let currentPdfData = {}; // Variável global para armazenar os dados para o PDF

async function fetchFont(url) {
  const response = await fetch(url);
  if (!response.ok)
    throw new Error(`Failed to fetch font: ${response.statusText}`);
  return response.arrayBuffer();
}

async function fetchSvgAsBase64(url) {
  const response = await fetch(url);
  if (!response.ok)
    throw new Error(`Failed to fetch SVG: ${response.statusText}`);
  const svgText = await response.text();
  return `data:image/svg+xml;base64,${btoa(
    unescape(encodeURIComponent(svgText))
  )}`; // Ensure UTF-8 characters are handled
}

function downloadPdf(data, filename) {
  const blob = new Blob([data], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function extractTextAndStyle(htmlString) {
  const div = document.createElement("div");
  div.innerHTML = htmlString;
  return div.textContent || "";
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("current-year").textContent =
    new Date().getFullYear();
  // pdfme is loaded via CDN, so it should be available globally.
  // const { અસરકારકતા, generate } = pdfme; // This line might cause issues if pdfme is not loaded yet or has a different structure.
  // Let's ensure pdfme and its properties are accessed safely.

  const form = document.getElementById("calculator-form");
  const resultsSection = document.getElementById("results");
  const conversionTypeSelect = document.getElementById("conversion-type");
  const totalConversionGroup = document.getElementById(
    "total-conversion-group"
  );
  const stagesInputsDiv = document.getElementById("stages-inputs");
  const stageAnalysisDiv = document.getElementById("stage-analysis");
  const stageGapListDiv = document.getElementById("stage-gap-list");
  const worstStageInfoDiv = document.getElementById("worst-stage-info");
  const includeDecisionCycleCheckbox = document.getElementById(
    "include-decision-cycle"
  );
  const decisionCycleFields = document.getElementById("decision-cycle-fields");
  const decisionCycleResultsDiv = document.getElementById(
    "decision-cycle-results"
  );
  const downloadPdfButton = document.getElementById("download-pdf-btn");

  const steps = Array.from(document.querySelectorAll(".form-step"));
  const nextButtons = Array.from(document.querySelectorAll(".next-step"));
  const prevButtons = Array.from(document.querySelectorAll(".prev-step"));
  let currentStep = 0;

  const inputs = {
    "company-name": {
      element: document.getElementById("company-name"),
      errorElement: document.getElementById("company-name-error"),
      validator: (val) => val.trim() !== "",
      step: 0,
      required: true,
    },
    "contact-name": {
      element: document.getElementById("contact-name"),
      errorElement: document.getElementById("contact-name-error"),
      validator: (val) => val.trim() !== "",
      step: 0,
      required: true,
    },
    email: {
      element: document.getElementById("email"),
      errorElement: document.getElementById("email-error"),
      validator: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      step: 0,
      required: true,
    },
    whatsapp: {
      element: document.getElementById("whatsapp"),
      errorElement: document.getElementById("whatsapp-error"),
      validator: (val) => /^\d{10,15}$/.test(val),
      step: 0,
      required: true,
    },
    sector: {
      element: document.getElementById("sector"),
      errorElement: document.getElementById("sector-error"),
      validator: (val) => val !== "",
      step: 1,
      required: true,
    },
    traffic: {
      element: document.getElementById("traffic"),
      errorElement: document.getElementById("traffic-error"),
      validator: (val) => parseFloat(val) > 0,
      step: 1,
      required: true,
    },
    ticket: {
      element: document.getElementById("ticket"),
      errorElement: document.getElementById("ticket-error"),
      validator: (val) => parseFloat(val) > 0,
      step: 1,
      required: true,
    },
    "conversion-rate": {
      element: document.getElementById("conversion-rate"),
      errorElement: document.getElementById("conversion-rate-error"),
      validator: (val) =>
        val === "" || (parseFloat(val) >= 0 && parseFloat(val) <= 100),
      step: 2,
      required: () => conversionTypeSelect.value === "total",
    },
    "lead-to-mql": {
      element: document.getElementById("lead-to-mql"),
      errorElement: document.getElementById("lead-to-mql-error"),
      validator: (val) =>
        val === "" || (parseFloat(val) >= 0 && parseFloat(val) <= 100),
      step: 2,
      required: false,
    },
    "mql-to-sql": {
      element: document.getElementById("mql-to-sql"),
      errorElement: document.getElementById("mql-to-sql-error"),
      validator: (val) =>
        val === "" || (parseFloat(val) >= 0 && parseFloat(val) <= 100),
      step: 2,
      required: false,
    },
    "sql-to-opportunity": {
      element: document.getElementById("sql-to-opportunity"),
      errorElement: document.getElementById("sql-to-opportunity-error"),
      validator: (val) =>
        val === "" || (parseFloat(val) >= 0 && parseFloat(val) <= 100),
      step: 2,
      required: false,
    },
    "opportunity-to-client": {
      element: document.getElementById("opportunity-to-client"),
      errorElement: document.getElementById("opportunity-to-client-error"),
      validator: (val) =>
        val === "" || (parseFloat(val) >= 0 && parseFloat(val) <= 100),
      step: 2,
      required: false,
    },
    "current-cycle": {
      element: document.getElementById("current-cycle"),
      errorElement: document.getElementById("current-cycle-error"),
      validator: (val) => val === "" || parseFloat(val) > 0,
      step: 3,
      required: () => includeDecisionCycleCheckbox.checked,
    },
  };

  function updateStepVisibility() {
    steps.forEach((step, index) => {
      step.style.display = index === currentStep ? "block" : "none";
      step.classList.toggle("step-active", index === currentStep);
    });

    // Atualiza o texto do botão de submit quando chegar na última etapa
    if (currentStep === steps.length - 1) {
      document.getElementById("calculate-btn").style.display = "block";
    } else {
      document.getElementById("calculate-btn").style.display = "none";
    }
  }
  function validateInput(inputId) {
    const inputConfig = inputs[inputId];
    if (!inputConfig || !inputConfig.element) return true;
    const value = inputConfig.element.value.trim();
    let isRequired =
      typeof inputConfig.required === "function"
        ? inputConfig.required()
        : inputConfig.required;
    inputConfig.element.classList.remove("is-invalid");
    if (inputConfig.errorElement)
      inputConfig.errorElement.style.display = "none";
    if (isRequired && value === "") {
      inputConfig.element.classList.add("is-invalid");
      if (inputConfig.errorElement)
        inputConfig.errorElement.style.display = "block";
      return false;
    }
    if (value !== "") {
      const numericValue = parseFloat(value);
      const validationValue =
        inputConfig.element.type === "number" && !isNaN(numericValue)
          ? numericValue
          : value;
      if (!inputConfig.validator(validationValue)) {
        inputConfig.element.classList.add("is-invalid");
        if (inputConfig.errorElement)
          inputConfig.errorElement.style.display = "block";
        return false;
      }
    }
    return true;
  }

  function validateCurrentStepFields() {
    let stepIsValid = true;
    for (const id in inputs) {
      if (inputs[id].step === currentStep) {
        if (!validateInput(id)) {
          stepIsValid = false;
        }
      }
    }
    return stepIsValid;
  }

  nextButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (validateCurrentStepFields()) {
        if (currentStep < steps.length - 1) {
          currentStep++;
          updateStepVisibility();
        }
      }
    });
  });

  prevButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (currentStep > 0) {
        currentStep--;
        updateStepVisibility();
      }
    });
  });

  Object.keys(inputs).forEach((id) => {
    if (inputs[id].element) {
      inputs[id].element.addEventListener("input", () => validateInput(id));
    }
  });

  conversionTypeSelect.addEventListener("change", (e) => {
    const isTotal = e.target.value === "total";
    totalConversionGroup.style.display = isTotal ? "block" : "none";
    stagesInputsDiv.style.display = isTotal ? "none" : "block";
    inputs["conversion-rate"].element.required = isTotal;
    if (isTotal) {
      inputs["conversion-rate"].element.value = "";
      validateInput("conversion-rate");
      clearStageInputsErrorsAndValues();
    } else {
      inputs["conversion-rate"].element.value = "";
      inputs["conversion-rate"].element.classList.remove("is-invalid");
      if (inputs["conversion-rate"].errorElement)
        inputs["conversion-rate"].errorElement.style.display = "none";
    }
  });

  includeDecisionCycleCheckbox.addEventListener("change", (e) => {
    decisionCycleFields.style.display = e.target.checked ? "block" : "none";
    inputs["current-cycle"].element.required = e.target.checked;
    if (!e.target.checked) {
      inputs["current-cycle"].element.value = "";
      inputs["current-cycle"].element.classList.remove("is-invalid");
      if (inputs["current-cycle"].errorElement)
        inputs["current-cycle"].errorElement.style.display = "none";
    }
  });

  function clearStageInputsErrorsAndValues() {
    [
      "lead-to-mql",
      "mql-to-sql",
      "sql-to-opportunity",
      "opportunity-to-client",
    ].forEach((id) => {
      if (inputs[id] && inputs[id].element) {
        inputs[id].element.value = "";
        inputs[id].element.classList.remove("is-invalid");
        if (inputs[id].errorElement)
          inputs[id].errorElement.style.display = "none";
      }
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateCurrentStepFields()) {
      resultsSection.style.display = "none";
      return;
    }
    // Preencher informações de contato nos resultados
    document.getElementById("result-company-name").textContent =
      inputs["company-name"].element.value;
    document.getElementById("result-contact-name").textContent =
      inputs["contact-name"].element.value;
    document.getElementById("result-email").textContent =
      inputs["email"].element.value;
    document.getElementById("result-whatsapp").textContent =
      inputs["whatsapp"].element.value;

    let formIsValid = true;
    for (const id in inputs) {
      let isRequired =
        typeof inputs[id].required === "function"
          ? inputs[id].required()
          : inputs[id].required;
      if (isRequired) {
        if (!validateInput(id)) {
          formIsValid = false;
        }
      }
    }
    if (conversionTypeSelect.value === "stages") {
      const stageInputsIds = [
        "lead-to-mql",
        "mql-to-sql",
        "sql-to-opportunity",
        "opportunity-to-client",
      ];
      let atLeastOneStageFilled = stageInputsIds.some(
        (id) => inputs[id].element.value.trim() !== ""
      );
      if (!atLeastOneStageFilled) {
        formIsValid = false;
        inputs["lead-to-mql"].element.classList.add("is-invalid");
        if (inputs["lead-to-mql"].errorElement) {
          inputs["lead-to-mql"].errorElement.textContent =
            "Preencha ao menos uma taxa de etapa ou use a Taxa Total.";
          inputs["lead-to-mql"].errorElement.style.display = "block";
        }
      } else {
        if (inputs["lead-to-mql"].errorElement) {
          inputs["lead-to-mql"].errorElement.textContent =
            "Valor entre 0 e 100.";
        }
      }
    }

    if (!formIsValid) {
      resultsSection.style.display = "none";
      const firstInvalid = form.querySelector(".is-invalid");
      if (firstInvalid) {
        firstInvalid.focus();
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Coleta os dados básicos
    const sector = inputs["sector"].element.value;
    const trafficVal = parseFloat(inputs["traffic"].element.value);
    const ticketVal = parseFloat(inputs["ticket"].element.value);
    const conversionType = conversionTypeSelect.value;
    let currentConversion = 0;
    let stageConversions = {};

    if (conversionType === "total") {
      if (inputs["conversion-rate"].element.value) {
        currentConversion =
          parseFloat(inputs["conversion-rate"].element.value) / 100;
      }
    } else {
      const leadToMql = parseFloat(inputs["lead-to-mql"].element.value) || 0;
      const mqlToSql = parseFloat(inputs["mql-to-sql"].element.value) || 0;
      const sqlToOpportunity =
        parseFloat(inputs["sql-to-opportunity"].element.value) || 0;
      const opportunityToClient =
        parseFloat(inputs["opportunity-to-client"].element.value) || 0;
      stageConversions = {
        "Lead para MQL": leadToMql,
        "MQL para SQL": mqlToSql,
        "SQL para Oportunidade": sqlToOpportunity,
        "Oportunidade para Cliente": opportunityToClient,
      };
      let calculatedConversion = 1;
      let activeStagesInCalculation = 0;
      if (leadToMql > 0) {
        calculatedConversion *= leadToMql / 100;
        activeStagesInCalculation++;
      }
      if (mqlToSql > 0) {
        calculatedConversion *= mqlToSql / 100;
        activeStagesInCalculation++;
      }
      if (sqlToOpportunity > 0) {
        calculatedConversion *= sqlToOpportunity / 100;
        activeStagesInCalculation++;
      }
      if (opportunityToClient > 0) {
        calculatedConversion *= opportunityToClient / 100;
        activeStagesInCalculation++;
      }
      currentConversion =
        activeStagesInCalculation > 0 ? calculatedConversion : 0;
    }

    const currentRevenue = trafficVal * currentConversion * ticketVal;
    const sectorBenchmarks = benchmarkData.setores[sector];
    let benchmarkConversion = 0;
    let benchmarkStageConversions = {};
    if (sectorBenchmarks) {
      if (
        sectorBenchmarks.taxa_conversao_total_benchmark &&
        (conversionType === "total" || sector === "E-commerce")
      ) {
        benchmarkConversion =
          sectorBenchmarks.taxa_conversao_total_benchmark / 100;
      } else if (sectorBenchmarks.taxas_conversao) {
        benchmarkStageConversions = sectorBenchmarks.taxas_conversao;
        benchmarkConversion =
          (benchmarkStageConversions.total_benchmark || 0) / 100;
      }
    }
    const benchmarkSourceText = document.getElementById(
      "benchmark-source-text"
    );

    if (sectorBenchmarks.fonte) {
      benchmarkSourceText.textContent = `Fonte: ${sectorBenchmarks.fonte}`;
      benchmarkSourceText.style.display = "block";
    } else if (sectorBenchmarks.fontes) {
      benchmarkSourceText.textContent = `Fonte: ${sectorBenchmarks.fontes.join(
        "; "
      )}`;
      benchmarkSourceText.style.display = "block";
    } else {
      benchmarkSourceText.textContent = "";
      benchmarkSourceText.style.display = "none";
    }

    const potentialRevenue = trafficVal * benchmarkConversion * ticketVal;
    const wastedRevenue = Math.max(0, potentialRevenue - currentRevenue);
    const revenueProgress =
      potentialRevenue > 0
        ? (currentRevenue / potentialRevenue) * 100
        : currentRevenue > 0
        ? 100
        : 0;
    const conversionProgressVal =
      benchmarkConversion > 0
        ? (currentConversion / benchmarkConversion) * 100
        : currentConversion > 0
        ? 100
        : 0;
    const conversionGap = benchmarkConversion - currentConversion;
    const capturePercentage =
      potentialRevenue > 0
        ? (currentRevenue / potentialRevenue) * 100
        : currentRevenue > 0
        ? 100
        : 0;
    const wastePercentage = Math.max(0, 100 - capturePercentage);

    document.getElementById(
      "current-revenue"
    ).textContent = `R$ ${currentRevenue.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
    document.getElementById(
      "potential-revenue"
    ).textContent = `R$ ${potentialRevenue.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
    document.getElementById(
      "wasted-revenue"
    ).textContent = `R$ ${wastedRevenue.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
    document.getElementById("revenue-progress").style.width = `${Math.min(
      Math.max(revenueProgress, 0),
      100
    )}%`;
    document
      .getElementById("revenue-progress")
      .setAttribute("aria-valuenow", revenueProgress.toFixed(0));
    document.getElementById("current-conversion-display").textContent = `${(
      currentConversion * 100
    ).toFixed(2)}%`;
    document.getElementById("benchmark-conversion-display").textContent = `${(
      benchmarkConversion * 100
    ).toFixed(2)}%`;
    document.getElementById("conversion-progress").style.width = `${Math.min(
      Math.max(conversionProgressVal, 0),
      100
    )}%`;
    document
      .getElementById("conversion-progress")
      .setAttribute("aria-valuenow", conversionProgressVal.toFixed(0));
    document.getElementById("conversion-gap").textContent = `${(
      Math.abs(conversionGap) * 100
    ).toFixed(2)}%`;
    document.getElementById("conversion-comparison").textContent =
      conversionGap > 0 ? "abaixo" : conversionGap < 0 ? "acima" : "igual";
    document.getElementById(
      "capture-percentage"
    ).textContent = `${capturePercentage.toFixed(1)}%`;
    document.getElementById(
      "waste-percentage"
    ).textContent = `${wastePercentage.toFixed(1)}%`;
    document.getElementById("waste-progress").style.width = `${Math.min(
      Math.max(wastePercentage, 0),
      100
    )}%`;
    document
      .getElementById("waste-progress")
      .setAttribute("aria-valuenow", wastePercentage.toFixed(0));

    currentPdfData = {
      clientInfo: {
        company: inputs["company-name"].element.value,
        contact: inputs["contact-name"].element.value,
        email: inputs["email"].element.value,
        phone: inputs["whatsapp"].element.value,
      },
      sector: sector,
      traffic: trafficVal.toLocaleString("pt-BR"),
      ticket: `R$ ${ticketVal.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      conversionTypeText:
        conversionType === "total"
          ? "Taxa de Conversão Total"
          : "Taxas por Etapa do Funil",
      currentRevenue: document.getElementById("current-revenue").textContent,
      potentialRevenue:
        document.getElementById("potential-revenue").textContent,
      wastedRevenue: document.getElementById("wasted-revenue").textContent,
      currentConversionDisplay: document.getElementById(
        "current-conversion-display"
      ).textContent,
      benchmarkConversionDisplay: document.getElementById(
        "benchmark-conversion-display"
      ).textContent,
      conversionGapValue: `${(Math.abs(conversionGap) * 100).toFixed(2)}%`,
      conversionComparison: document.getElementById("conversion-comparison")
        .textContent,
      capturePercentage: `${capturePercentage.toFixed(1)}%`,
      wastePercentage: `${wastePercentage.toFixed(1)}%`,
      stageAnalysisData: [],
      worstStageInfoText: "",
      showStageAnalysis: false,
      decisionCycleData: {},
      showDecisionCycle: false,
    };

    if (
      conversionType === "stages" &&
      sectorBenchmarks &&
      sectorBenchmarks.taxas_conversao &&
      Object.keys(sectorBenchmarks.taxas_conversao).length > 1 &&
      sector !== "E-commerce"
    ) {
      stageGapListDiv.innerHTML = "";
      let worstGap = -Infinity;
      let worstStageName = "N/A";
      let hasRelevantStages = false;
      currentPdfData.showStageAnalysis = true;

      for (const stageKey in stageConversions) {
        const currentStageRate = stageConversions[stageKey] || 0;
        const benchmarkKey = getKeyByFuzzyMatch(
          benchmarkStageConversions,
          stageKey.toLowerCase().replace(/ /g, "_")
        );
        const benchmarkStageRate = benchmarkKey
          ? benchmarkStageConversions[benchmarkKey] || 0
          : 0;

        if (currentStageRate > 0 || benchmarkStageRate > 0) {
          hasRelevantStages = true;
          const gap = benchmarkStageRate - currentStageRate;
          const item = document.createElement("div");
          item.classList.add("stage-gap-item");
          item.innerHTML = `
                        <span class="stage-name">${stageKey}:</span>
                        <span>Sua taxa: ${currentStageRate.toFixed(
                          1
                        )}% | Benchmark: ${benchmarkStageRate.toFixed(
            1
          )}% | Gap: <span style="color:${
            gap > 0
              ? "var(--warning-color)"
              : gap < 0
              ? "var(--accent-color)"
              : "inherit"
          };">${gap.toFixed(1)}%</span></span>
                    `;
          stageGapListDiv.appendChild(item);
          currentPdfData.stageAnalysisData.push({
            name: stageKey,
            current_rate: `${currentStageRate.toFixed(1)}%`,
            benchmark_rate: `${benchmarkStageRate.toFixed(1)}%`,
            gap: `${gap.toFixed(1)}%`,
            gap_color: gap > 0 ? "#ffc107" : gap < 0 ? "#198754" : "#212529",
          });
          if (gap > worstGap) {
            worstGap = gap;
            worstStageName = stageKey;
          }
        }
      }
      if (!hasRelevantStages) {
        const msg =
          "Nenhuma taxa de conversão por etapa foi informada ou não há benchmarks correspondentes.";
        worstStageInfoDiv.innerHTML = `<p class="alert alert-info">${msg}</p>`;
        currentPdfData.worstStageInfoText = msg;
      } else if (worstGap <= 0) {
        const msg =
          "Parabéns! Suas taxas de conversão por etapa estão iguais ou acima dos benchmarks.";
        worstStageInfoDiv.innerHTML = `<p class="alert alert-success">${msg}</p>`;
        currentPdfData.worstStageInfoText = msg;
      } else {
        const msg = `Maior Gargalo: A etapa "${worstStageName}" está ${worstGap.toFixed(
          1
        )}% abaixo do benchmark.`;
        worstStageInfoDiv.innerHTML = `<p class="alert alert-warning"><strong>Maior Gargalo:</strong> A etapa \"${worstStageName}\" está ${worstGap.toFixed(
          1
        )}% abaixo do benchmark e representa sua maior oportunidade de melhoria.</p>`;
        currentPdfData.worstStageInfoText = msg;
      }
      stageAnalysisDiv.style.display = "block";
    } else {
      stageAnalysisDiv.style.display = "none";
      currentPdfData.showStageAnalysis = false;
    }

    if (
      includeDecisionCycleCheckbox.checked &&
      inputs["current-cycle"].element.value
    ) {
      const currentCycleVal = parseFloat(inputs["current-cycle"].element.value);
      const saleTypeElement = document.getElementById("sale-type");
      const saleType = saleTypeElement.value; // "transacional", "consultivo_medio_valor", etc.
      const saleTypeText =
        saleTypeElement.options[saleTypeElement.selectedIndex].text;

      // Acessar os benchmarks corretamente
      let benchmarkMin = 0;
      let benchmarkMax = 0;
      let hasBenchmark = false;

      if (sectorBenchmarks && sectorBenchmarks.ciclo_decisao_dias) {
        // Verifica primeiro com a chave exata
        if (sectorBenchmarks.ciclo_decisao_dias[saleType]) {
          const cycleBenchmark = sectorBenchmarks.ciclo_decisao_dias[saleType];
          benchmarkMin = cycleBenchmark[0];
          benchmarkMax = cycleBenchmark[1];
          hasBenchmark = true;
        }
        // Se não encontrou, tenta mapear para nomes alternativos
        else {
          const alternativeNames = {
            transacional: ["cursos_curtos", "pequenos_projetos"],
            consultivo_medio_valor: ["graduacao_pos"],
            consultivo_alto_valor: ["grandes_projetos"],
          };

          if (alternativeNames[saleType]) {
            for (const altName of alternativeNames[saleType]) {
              if (sectorBenchmarks.ciclo_decisao_dias[altName]) {
                const cycleBenchmark =
                  sectorBenchmarks.ciclo_decisao_dias[altName];
                benchmarkMin = cycleBenchmark[0];
                benchmarkMax = cycleBenchmark[1];
                hasBenchmark = true;
                break;
              }
            }
          }
        }
      }

      // Restante do código permanece igual...
      currentPdfData.showDecisionCycle = true;
      document.getElementById("sale-type-display").textContent = saleTypeText;
      document.getElementById("current-cycle-value").textContent =
        currentCycleVal.toFixed(1);

      if (hasBenchmark) {
        let cicloTexto = "";
        if (benchmarkMin <= 1 && benchmarkMax <= 1) {
          cicloTexto = "Até 30 dias";
        } else if (benchmarkMin >= 1 && benchmarkMax <= 30) {
          cicloTexto = "De 30 a 90 dias";
        } else if (benchmarkMin >= 90 && benchmarkMax <= 180) {
          cicloTexto = "De 90 a 180 dias";
        } else if (benchmarkMin >= 180) {
          cicloTexto = "Mais de 180 dias";
        } else {
          cicloTexto = `${benchmarkMin}-${benchmarkMax} dias`;
        }
        document.getElementById("benchmark-cycle-range").textContent =
          cicloTexto;

        let difference = 0;
        let comparisonText = "";

        if (currentCycleVal < benchmarkMin) {
          difference = benchmarkMin - currentCycleVal;
          comparisonText = `Seu ciclo de decisão está ${difference.toFixed(
            1
          )} dias abaixo do mínimo do benchmark.`;
        } else if (currentCycleVal > benchmarkMax) {
          difference = currentCycleVal - benchmarkMax;
          comparisonText = `Seu ciclo de decisão está ${difference.toFixed(
            1
          )} dias acima do máximo do benchmark.`;
        } else {
          comparisonText = `Seu ciclo de decisão está dentro do benchmark do setor (${benchmarkMin}-${benchmarkMax} dias).`;
        }

        document.getElementById("cycle-comparison-text").textContent =
          comparisonText;

        currentPdfData.decisionCycleData = {
          saleType: saleTypeText,
          currentCycleValue: `${currentCycleVal.toFixed(1)} dias`,
          benchmarkCycleRange: `${benchmarkMin}-${benchmarkMax} dias`,
          comparisonText: comparisonText,
        };
      } else {
        const msg = `Benchmark não disponível para "${saleTypeText}" no setor ${sector}.`;
        document.getElementById("benchmark-cycle-range").textContent = "N/A";
        document.getElementById("cycle-comparison-text").textContent = msg;

        currentPdfData.decisionCycleData = {
          saleType: saleTypeText,
          currentCycleValue: `${currentCycleVal.toFixed(1)} dias`,
          benchmarkCycleRange: "N/A",
          comparisonText: msg,
        };
      }

      decisionCycleResultsDiv.style.display = "block";
    } else {
      decisionCycleResultsDiv.style.display = "none";
      currentPdfData.showDecisionCycle = false;
    }
    resultsSection.style.display = "block";
    resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  downloadPdfButton.addEventListener("click", async () => {
    if (!window.jspdf || !window.html2canvas) {
      alert("As bibliotecas necessárias não foram carregadas corretamente.");
      return;
    }

    downloadPdfButton.disabled = true;
    downloadPdfButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Gerando PDF...`;

    try {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF("p", "pt", "a4");

      const contentToPrint = document.getElementById("results");

      const canvas = await html2canvas(contentToPrint, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      // Carrega a logo como imagem para marca d’água
      const logoImg = new Image();
      logoImg.src = "img/logo.png";

      await new Promise((resolve) => {
        logoImg.onload = resolve;
      });

      const logoWidth = 200; // Largura da logo (ajustável)
      const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
      const logoX = (pdfWidth - logoWidth) / 2;
      const logoY = (pdfHeight - logoHeight) / 2;

      let position = 0;

      if (imgHeight < pdfHeight) {
        // Página única
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

        pdf.setGState(new pdf.GState({ opacity: 0.1 }));
        pdf.addImage(logoImg, "PNG", logoX, logoY, logoWidth, logoHeight);
      } else {
        // Múltiplas páginas
        let pageHeight = pdfHeight;
        let remainingHeight = imgHeight;

        const canvasWidth = canvas.width;
        const pageImgHeight = Math.floor((pageHeight * canvasWidth) / pdfWidth);

        const pageCanvas = document.createElement("canvas");
        const pageCtx = pageCanvas.getContext("2d");

        pageCanvas.width = canvasWidth;
        pageCanvas.height = pageImgHeight;

        let pageCount = 0;

        while (remainingHeight > 0) {
          pageCtx.clearRect(0, 0, canvasWidth, pageImgHeight);
          pageCtx.drawImage(
            canvas,
            0,
            position,
            canvasWidth,
            pageImgHeight,
            0,
            0,
            canvasWidth,
            pageImgHeight
          );

          const pageData = pageCanvas.toDataURL("image/png");
          if (pageCount > 0) pdf.addPage();
          pdf.addImage(pageData, "PNG", 0, 0, imgWidth, pageHeight);

          // Marca d’água da logo
          pdf.setGState(new pdf.GState({ opacity: 0.1 }));
          pdf.addImage(logoImg, "PNG", logoX, logoY, logoWidth, logoHeight);
          pdf.setGState(new pdf.GState({ opacity: 1 }));

          position += pageImgHeight;
          remainingHeight -= pageHeight;
          pageCount++;
        }
      }

      pdf.save("relatorio-salesprime.pdf");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Houve um erro ao gerar o PDF. Tente novamente.");
    } finally {
      downloadPdfButton.disabled = false;
      downloadPdfButton.innerHTML = `<i class="bi bi-download"></i> Baixar Relatório em PDF`;
    }
  });
  function getKeyByFuzzyMatch(object, keyToMatch) {
    if (!object) return undefined;
    const keys = Object.keys(object);
    const directMatch = keys.find(
      (k) => k.toLowerCase().replace(/ /g, "_") === keyToMatch
    );
    if (directMatch) return directMatch;
    const includesMatch = keys.find((k) =>
      k.toLowerCase().replace(/ /g, "_").includes(keyToMatch)
    );
    if (includesMatch) return includesMatch;
    return undefined;
  }

  updateStepVisibility();
  conversionTypeSelect.dispatchEvent(new Event("change"));
  includeDecisionCycleCheckbox.dispatchEvent(new Event("change"));
});
// Descrições dos tipos de venda
const saleTypeDescriptions = {
  transacional:
    "Até R$ 15 mil (Ciclo curto, baixo envolvimento consultivo, menor número de decisores)",
  consultivo_medio_valor:
    "De R$ 15 mil a R$ 80 mil (Envolve diagnóstico, múltiplos decisores, maior análise de ROI)",
  consultivo_alto_valor:
    "De R$ 80 mil a R$ 300 mil (Processo estruturado, geralmente requer demonstrações, estudos de caso, e comitê de compras)",
  enterprise:
    "Acima de R$ 300 mil (Alto grau de personalização, contratos longos, múltiplas etapas, envolvimento do C-level)",
};

// Elementos do DOM
const saleTypeSelect = document.getElementById("sale-type");
const saleTypeDescription = document.getElementById("sale-type-description");

// Função para atualizar a descrição
function updateSaleTypeDescription() {
  const selectedValue = saleTypeSelect.value;
  saleTypeDescription.textContent = saleTypeDescriptions[selectedValue];
}

// Event listener para mudanças no select
saleTypeSelect.addEventListener("change", updateSaleTypeDescription);

// Inicializa com a descrição do valor padrão
updateSaleTypeDescription();

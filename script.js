// Smooth scroll to sections
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

const steps = Array.from(document.querySelectorAll(".step"));
const stepPills = Array.from(document.querySelectorAll(".step-pill"));
const progressBar = document.getElementById("progress-bar");
const progressLabel = document.getElementById("progress-label");
const progressPercent = document.getElementById("progress-percent");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const form = document.getElementById("resume-form");
const previewPaper = document.getElementById("preview-paper");
const downloadBtn = document.getElementById("download-btn");

let currentStep = 1;
const totalSteps = steps.length;

function updateStepUI() {
  steps.forEach((step) => {
    step.classList.toggle(
      "active",
      Number(step.dataset.step) === currentStep
    );
  });

  stepPills.forEach((pill) => {
    pill.classList.toggle(
      "active",
      Number(pill.dataset.stepPill) === currentStep
    );
  });

  const percent = Math.round((currentStep / totalSteps) * 100);
  progressBar.style.width = percent + "%";
  progressLabel.textContent = `Step ${currentStep} of ${totalSteps}`;
  progressPercent.textContent = `${percent}% complete`;

  prevBtn.disabled = currentStep === 1;
  nextBtn.textContent = currentStep === totalSteps ? "Finish" : "Next →";
}

function goToStep(stepNumber) {
  if (stepNumber < 1 || stepNumber > totalSteps) return;
  currentStep = stepNumber;
  updateStepUI();
}

prevBtn.addEventListener("click", () => {
  goToStep(currentStep - 1);
});

nextBtn.addEventListener("click", () => {
  if (currentStep < totalSteps) {
    goToStep(currentStep + 1);
  } else {
    // On finish, scroll to preview
    scrollToSection("preview");
  }
});

stepPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    const target = Number(pill.dataset.stepPill);
    goToStep(target);
  });
});

// Build HTML for preview
function buildPreviewHTML(data) {
  const name = data.fullName || "Your Name";
  const role = data.roleTitle || "Your Role / Headline";
  const email = data.email || "";
  const phone = data.phone || "";
  const city = data.city || "";
  const summary =
    data.summary ||
    "Write a short summary about your skills, interest and career goal. Keep it 2–3 lines only.";
  const expTitle = data.expTitle || "";
  const expCompany = data.expCompany || "";
  const expStart = data.expStart || "";
  const expEnd = data.expEnd || "";
  const expDesc = data.expDesc || "";
  const eduDegree = data.eduDegree || "";
  const eduCollege = data.eduCollege || "";
  const eduStart = data.eduStart || "";
  const eduEnd = data.eduEnd || "";
  const skills = data.skills || "";
  const extra = data.extra || "";

  const skillsArray = skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  let skillsHTML = "";
  if (skillsArray.length) {
    skillsHTML =
      `<div class="preview-section">
        <div class="preview-section-title">Skills</div>
        <div class="preview-skills">` +
      skillsArray
        .map(
          (skill) =>
            `<span class="preview-skill-pill">${skill}</span>`
        )
        .join("") +
      `</div>
      </div>`;
  }

  let experienceHTML = "";
  if (expTitle || expCompany || expDesc) {
    experienceHTML = `
      <div class="preview-section">
        <div class="preview-section-title">Experience</div>
        <div>
          <div class="preview-item-title">${expTitle || "Position / Role"}</div>
          <div class="preview-item-sub">${expCompany || "Company / Organisation"}</div>
          <div class="preview-item-dates">
            ${[expStart, expEnd].filter(Boolean).join(" – ")}
          </div>
          ${
            expDesc
              ? `<div class="preview-item-desc">${expDesc}</div>`
              : ""
          }
        </div>
      </div>`;
  }

  let educationHTML = "";
  if (eduDegree || eduCollege || eduStart || eduEnd) {
    educationHTML = `
      <div class="preview-section">
        <div class="preview-section-title">Education</div>
        <div>
          <div class="preview-item-title">${eduDegree || "Degree"}</div>
          <div class="preview-item-sub">${eduCollege || "College / University"}</div>
          <div class="preview-item-dates">
            ${[eduStart, eduEnd].filter(Boolean).join(" – ")}
          </div>
        </div>
      </div>`;
  }

  let extraHTML = "";
  if (extra) {
    extraHTML = `
      <div class="preview-section">
        <div class="preview-section-title">Projects & Achievements</div>
        <div class="preview-item-desc">${extra}</div>
      </div>`;
  }

  const contactPieces = [];
  if (email) contactPieces.push(`<span>${email}</span>`);
  if (phone) contactPieces.push(`<span>${phone}</span>`);
  if (city) contactPieces.push(`<span>${city}</span>`);

  return `
    <header>
      <div class="preview-name">${name}</div>
      <div class="preview-role">${role}</div>
      <div class="preview-contact">
        ${contactPieces.join(" • ")}
      </div>
    </header>

    <section class="preview-section">
      <div class="preview-section-title">Profile</div>
      <p class="preview-item-desc">${summary}</p>
    </section>

    ${experienceHTML}
    ${educationHTML}
    ${skillsHTML}
    ${extraHTML}
  `;
}

function updatePreview() {
  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value.toString();
  });
  previewPaper.innerHTML = buildPreviewHTML(data);

  // Update mini hero preview
  document.getElementById("mini-name").textContent =
    data.fullName || "Your Name";
  document.getElementById("mini-role").textContent =
    data.roleTitle || "Your role";
  document.getElementById("mini-summary").textContent =
    data.summary ||
    "Passionate learner excited about software development and technology.";
  document.getElementById("mini-exp-title").textContent =
    data.expTitle || "Intern / Trainee";
  document.getElementById("mini-exp-company").textContent =
    (data.expCompany || "Your organisation") +
    (data.expStart || data.expEnd
      ? " · " + [data.expStart, data.expEnd].filter(Boolean).join(" – ")
      : "");
  document.getElementById("mini-skills").textContent =
    data.skills ||
    "C · C++ · HTML · CSS · JavaScript · Problem Solving";
}

// Listen to input changes
form.addEventListener("input", updatePreview);

// Initial preview
updatePreview();

// Print / Save as PDF
downloadBtn.addEventListener("click", () => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>My Resume</title>
        <style>
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            background: #e5e7eb;
            padding: 20px;
          }
          .paper {
            max-width: 800px;
            margin: 0 auto;
            background: #ffffff;
            padding: 24px 28px;
            box-shadow: 0 0 0.5cm rgba(0,0,0,0.3);
            font-size: 13px;
            color: #111827;
          }
          .preview-name {
            font-size: 22px;
            font-weight: 700;
          }
          .preview-role {
            font-size: 14px;
            color: #4b5563;
            margin-bottom: 4px;
          }
          .preview-contact {
            font-size: 12px;
            color: #4b5563;
            margin-bottom: 12px;
          }
          .preview-contact span {
            margin-right: 10px;
          }
          .preview-section {
            margin-top: 10px;
          }
          .preview-section-title {
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            padding-bottom: 4px;
            margin-bottom: 4px;
            border-bottom: 1px solid #e5e7eb;
          }
          .preview-item-title {
            font-size: 13px;
            font-weight: 600;
          }
          .preview-item-sub {
            font-size: 12px;
            color: #4b5563;
          }
          .preview-item-dates {
            font-size: 11px;
            color: #6b7280;
            margin-top: 2px;
          }
          .preview-item-desc {
            font-size: 12px;
            color: #374151;
            margin-top: 4px;
          }
          .preview-skills {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            margin-top: 4px;
          }
          .preview-skill-pill {
            border-radius: 999px;
            border: 1px solid #d1d5db;
            padding: 2px 6px;
            font-size: 11px;
          }
        </style>
      </head>
      <body>
        <div class="paper">
          ${previewPaper.innerHTML}
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
});

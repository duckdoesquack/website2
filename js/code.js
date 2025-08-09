
//accordion shift to open accordion
document.addEventListener("DOMContentLoaded", function() {
  const accordion = document.getElementById('historyAccordion');

  accordion.addEventListener('shown.bs.collapse', function(event) {
    const openedSection = event.target;  // the opened .collapse element
    const header = openedSection.previousElementSibling; // usually the header

    if (header) {
      header.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      openedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// misconception quiz
document.addEventListener("DOMContentLoaded", () => {
  // Utility function to shuffle an array in place
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const quizDataOriginal = [
    {
      question: "Is Taoism only a religion?",
      options: [
        "Yes, it's only a religion.",
        "No, it's both a philosophy and spiritual path.",
        "No, it's only a philosophy."
      ],
      correct: "No, it's both a philosophy and spiritual path.",
      explanations: {
        "Yes, it's only a religion.": "Incorrect. Taoism is both a philosophy and a spiritual path. Many follow its principles without religious rituals.",
        "No, it's both a philosophy and spiritual path.": "Correct! Taoism can be both a philosophy and a religion, embracing spiritual and practical teachings.",
        "No, it's only a philosophy.": "Incorrect. Taoism also involves spiritual practices and beliefs beyond pure philosophy."
      }
    },
    {
      question: "Is Taoism mainly about worshiping gods?",
      options: [
        "Yes, Taoism is mainly about gods worship.",
        "No, worship of immortals is symbolic and not the core focus.",
        "Taoism rejects all spiritual beings."
      ],
      correct: "No, worship of immortals is symbolic and not the core focus.",
      explanations: {
        "Yes, Taoism is mainly about gods worship.": "Incorrect. Worship of gods is not the main focus; Taoism emphasizes harmony with nature and spiritual symbolism.",
        "No, worship of immortals is symbolic and not the core focus.": "Correct! Worship of immortals is symbolic and represents spiritual ideals, not literal polytheism.",
        "Taoism rejects all spiritual beings.": "Incorrect. Taoism reveres spiritual beings symbolically rather than rejecting them."
      }
    },
    {
      question: "Does Taoism teach total passivity?",
      options: [
        "Yes, Taoism teaches total passivity.",
        "No, Taoism promotes balance and natural action (Wu Wei).",
        "Taoism encourages constant struggle."
      ],
      correct: "No, Taoism promotes balance and natural action (Wu Wei).",
      explanations: {
        "Yes, Taoism teaches total passivity.": "Incorrect. Taoism teaches balance and natural action, not total passivity.",
        "No, Taoism promotes balance and natural action (Wu Wei).": "Correct! Taoism emphasizes Wu Wei — effortless action in harmony with the flow of life.",
        "Taoism encourages constant struggle.": "Incorrect. Taoism teaches harmony and flow, not struggle."
      }
    }
  ];

  // Shuffle questions once at quiz start
  let quizData = [];

  // Container to hold all modals
  const modalsContainer = document.createElement("div");
  document.body.appendChild(modalsContainer);

  let modals = [];
  let score = 0;

  // Function to start the quiz and dynamically build modals
  function startQuiz() {
    score = 0;
    modalsContainer.innerHTML = ""; // Clear previous modals
    modals = [];

    // Deep copy original quiz data to avoid mutation
    quizData = JSON.parse(JSON.stringify(quizDataOriginal));
    shuffleArray(quizData);

    quizData.forEach(q => {
      // Shuffle options for each question
      shuffleArray(q.options);
    });

    // Build modals dynamically
    quizData.forEach((q, index) => {
      const modalId = `quizModal${index + 1}`;
      const feedbackId = `feedback${index + 1}`;
      const nextBtnId = `nextBtn${index + 1}`;

      const modalHTML = `
        <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content shadow">
              <div class="modal-header">
                <h5 class="modal-title">Misconception #${index + 1}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <p>${q.question}</p>
                ${q.options.map(opt => `
                  <button class="btn btn-outline-primary answer-btn w-100 my-1" data-answer="${opt}">${opt}</button>
                `).join('')}
                <div id="${feedbackId}" class="mt-3 fw-semibold"></div>
              </div>
              <div class="modal-footer">
                <button id="${nextBtnId}" class="btn btn-success" disabled>Next</button>
              </div>
            </div>
          </div>
        </div>
      `;

      modalsContainer.insertAdjacentHTML("beforeend", modalHTML);
      const modal = new bootstrap.Modal(document.getElementById(modalId));
      modals.push(modal);
    });

    // Add final summary modal (same as before)
    const finalModalId = "finalSummaryModal";
    modalsContainer.insertAdjacentHTML("beforeend", `
      <div class="modal fade" id="${finalModalId}" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content shadow">
            <div class="modal-header">
              <h5 class="modal-title">Quiz Completed!</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p id="finalScoreText" class="fs-5 text-center"></p>
            </div>
            <div class="modal-footer">
              <button id="closeFinalBtn" type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    `);

    const finalModalEl = document.getElementById(finalModalId);
    const finalModal = new bootstrap.Modal(finalModalEl);

    // Attach event listeners for each modal after rendering
    quizData.forEach((q, index) => {
      const modalEl = document.getElementById(`quizModal${index + 1}`);
      const feedbackDiv = modalEl.querySelector(`#feedback${index + 1}`);
      const nextBtn = modalEl.querySelector(`#nextBtn${index + 1}`);
      const buttons = modalEl.querySelectorAll('.answer-btn');

      modalEl.addEventListener('show.bs.modal', () => {
        feedbackDiv.textContent = "";
        feedbackDiv.style.color = "";
        nextBtn.disabled = true;
        buttons.forEach(btn => {
          btn.disabled = false;
          btn.classList.remove('btn-success', 'btn-danger');
        });
      });

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          if (!nextBtn.disabled) return;
          const userAnswer = btn.getAttribute('data-answer');
          const explanation = q.explanations[userAnswer] || "";

          if (userAnswer === q.correct) {
            feedbackDiv.style.color = "green";
            feedbackDiv.textContent = explanation;
            btn.classList.add('btn-success');
            score++;
          } else {
            feedbackDiv.style.color = "red";
            feedbackDiv.textContent = explanation;
            btn.classList.add('btn-danger');
          }

          buttons.forEach(b => b.disabled = true);
          nextBtn.disabled = false;
        });
      });

      nextBtn.addEventListener('click', () => {
        modals[index].hide();
        if (index + 1 < modals.length) {
          modals[index + 1].show();
        } else {
          document.getElementById("finalScoreText").textContent = `You answered correctly ${score} out of ${quizData.length} questions!`;
          finalModal.show();
        }
      });
    });
  }

  // Start quiz button handler
  document.getElementById('startQuizBtn').addEventListener('click', () => {
    startQuiz();
    modals[0].show();
  });
});

//form 
const form = document.getElementById("newsletterForm");

// Field references
const nameField = document.getElementById("fullName");
const nameError = document.getElementById("nameError");
const emailField = document.getElementById("email");
const emailError = document.getElementById("emailError");
const ageField = document.getElementById("age");
const ageError = document.getElementById("ageError");
const birthdayField = document.getElementById("birthday");
const birthdayError = document.getElementById("birthdayError");
const frequencyRadios = document.querySelectorAll('input[name="frequency"]');
const frequencyError = document.getElementById("frequencyError");
const topicCheckboxes = document.querySelectorAll('input[name="topics"]');
const topicsError = document.getElementById("topicsError");

// Patterns
const namePattern = /^[A-Za-z\s]+$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Helpers for text inputs only
function setValid(field, errorElem) {
  errorElem.textContent = "";
  errorElem.style.display = "none";
  field.setAttribute("aria-invalid", "false");
  field.classList.add("valid");
}

function setInvalid(field, errorElem, message) {
  errorElem.textContent = message;
  errorElem.style.display = "block";
  field.setAttribute("aria-invalid", "true");
  field.classList.remove("valid");
}

// Validation functions for text inputs
function validateName() {
  if (!nameField.value.trim()) {
    setInvalid(nameField, nameError, "Please enter your full name.");
    return false;
  } else if (!namePattern.test(nameField.value)) {
    setInvalid(nameField, nameError, "Full name can only contain letters and spaces.");
    return false;
  } else {
    setValid(nameField, nameError);
    return true;
  }
}

function validateEmail() {
  if (!emailField.value.trim()) {
    setInvalid(emailField, emailError, "Please enter your email.");
    return false;
  } else if (!emailPattern.test(emailField.value)) {
    setInvalid(emailField, emailError, "Please enter a valid email address.");
    return false;
  } else {
    setValid(emailField, emailError);
    return true;
  }
}

function validateAge() {
  if (!ageField.value) {
    setInvalid(ageField, ageError, "Please enter your age.");
    return false;
  } else if (isNaN(ageField.value) || ageField.value < 10 || ageField.value > 120) {
    setInvalid(ageField, ageError, "Age must be a number between 10 and 120.");
    return false;
  } else {
    setValid(ageField, ageError);
    return true;
  }
}

function validateBirthday() {
  if (!birthdayField.value) {
    setInvalid(birthdayField, birthdayError, "Please select your birthday.");
    return false;
  } else {
    const today = new Date();
    const birthDate = new Date(birthdayField.value);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (birthDate > today) {
      setInvalid(birthdayField, birthdayError, "Birthday cannot be in the future.");
      return false;
    } else if (age < 10 || age > 120) {
      setInvalid(birthdayField, birthdayError, "Age must be between 10 and 120 years.");
      return false;
    } else {
      setValid(birthdayField, birthdayError);
      return true;
    }
  }
}

// Validation functions for radio and checkbox (no style changes on inputs)
function validateFrequency() {
  let selected = false;
  frequencyRadios.forEach(radio => {
    if (radio.checked) selected = true;
  });

  if (!selected) {
    frequencyError.textContent = "Please select a newsletter frequency.";
    frequencyError.style.display = "block";
    return false;
  } else {
    frequencyError.textContent = "";
    frequencyError.style.display = "none";
    return true;
  }
}

function validateTopics() {
  let selected = false;
  topicCheckboxes.forEach(box => {
    if (box.checked) selected = true;
  });

  if (!selected) {
    topicsError.textContent = "Please select at least one topic of interest.";
    topicsError.style.display = "block";
    return false;
  } else {
    topicsError.textContent = "";
    topicsError.style.display = "none";
    return true;
  }
}

// Event listeners
nameField.addEventListener('blur', validateName);
emailField.addEventListener('blur', validateEmail);
ageField.addEventListener('blur', validateAge);
birthdayField.addEventListener('blur', validateBirthday);

frequencyRadios.forEach(radio => {
  radio.addEventListener('change', validateFrequency);
});

topicCheckboxes.forEach(box => {
  box.addEventListener('change', validateTopics);
});

// Submit handler
form.addEventListener("submit", function(event) {
  event.preventDefault();

  const validName = validateName();
  const validEmail = validateEmail();
  const validAge = validateAge();
  const validBirthday = validateBirthday();
  const validFrequency = validateFrequency();
  const validTopics = validateTopics();

  if (validName && validEmail && validAge && validBirthday && validFrequency && validTopics) {
    alert("Form submitted successfully!");
    this.submit();
  }
});

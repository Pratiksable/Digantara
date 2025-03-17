
const steps = document.querySelectorAll(".form-step");
const progressSteps = document.querySelectorAll(".progress-tracker div");
const nextBtns = document.querySelectorAll(".next-btn");
const backBtns = document.querySelectorAll(".back-btn");
const submitBtn = document.querySelector("#multiStepForm button[type='submit']");
const orbit = document.querySelector(".orbit");
const summaryDiv = document.querySelector("#summary");
const formElements = document.querySelectorAll("input, select, textarea");

let currentStep = 0;


function updateForm() {
    steps.forEach((step, index) => {
        step.classList.toggle("active", index === currentStep);
    });

    progressSteps.forEach((step, index) => {
        step.classList.toggle("active", index === currentStep);
    });

    if (currentStep === steps.length - 1) {
        generateSummary();
    }
}


function moveOrbitForward() {
    gsap.to(orbit, { rotation: "+=120", duration: 1, ease: "power2.out" });
}


function moveOrbitBackward() {
    gsap.to(orbit, { rotation: "-=120", duration: 1, ease: "power2.out" });
}


gsap.to(".spaceship", {
    rotation: 360,
    repeat: -1,
    duration: 10,
    ease: "linear"
});


let step = 0;
function goNext() {
    if (validateStep(currentStep)) {
        if (currentStep < steps.length - 1) {
            currentStep++;
            step++;
            gsap.to(".spaceship", { rotation: step * 120, duration: 1, ease: "power2.out" });
            moveOrbitForward();
            updateForm();
        }
    } else {
        showToast("Please fix errors before proceeding!", "error");
    }
}

function goBack() {
    if (currentStep > 0) {
        currentStep--;
        step--;
        gsap.to(".spaceship", { rotation: step * 120, duration: 1, ease: "power2.out" });
        moveOrbitBackward();
        updateForm();
    }
}


function showError(input, message) {
    let errorMsg = input.nextElementSibling;

    if (!errorMsg || !errorMsg.classList.contains("error-message")) {
        const errorElement = document.createElement("span");
        errorElement.classList.add("error-message");
        errorElement.innerText = message;
        errorElement.style.opacity = "0";
        input.after(errorElement);
        setTimeout(() => (errorElement.style.opacity = "1"), 100);
    }

    input.classList.add("error");
    input.style.border = "2px solid red";
}

// Function to clear error messages
function clearError(input) {
    let errorMsg = input.nextElementSibling;
    if (errorMsg && errorMsg.classList.contains("error-message")) {
        errorMsg.remove();
    }
    input.classList.remove("error");
    input.style.border = "2px solid #ccc"; 
}


function validateStep(stepIndex) {
    let isValid = true;
    const inputs = steps[stepIndex].querySelectorAll("input, select, textarea");

    inputs.forEach(input => {
        const value = input.value.trim();
        const id = input.id;

        if (!value) {
            showError(input, "This field is required!");
            isValid = false;
        } else {
            clearError(input);
        }


        if (id === "name" && !/^[A-Za-z\s]+$/.test(value)) {
            showError(input, "Name can only contain alphabets!");
            isValid = false;
        }

        if (id === "dob") {
            const birthDate = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            if (birthDate >= today || age < 13) {
                showError(input, "Invalid Date! You must be at least 13 years old.");
                isValid = false;
            }
        }

        if (id === "email" && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
            showError(input, "Enter a valid email!");
            isValid = false;
        }

        if (id === "phone" && !/^\d{10}$/.test(value)) {
            showError(input, "Phone number must be 10 digits!");
            isValid = false;
        }

        if (id === "address" && value.length < 10) {
            showError(input, "Address must be at least 10 characters!");
            isValid = false;
        }
    });

    return isValid;
}


function generateSummary() {
    const name = document.querySelector("#name").value || "N/A";
    const dob = document.querySelector("#dob").value || "N/A";
    const gender = document.querySelector("#gender").value || "N/A";
    const email = document.querySelector("#email").value || "N/A";
    const phone = document.querySelector("#phone").value || "N/A";
    const address = document.querySelector("#address").value || "N/A";

    summaryDiv.innerHTML = `
        <p>👩‍🚀 <strong>Name:</strong> ${name}</p>
        <p>🎂 <strong>Date of Birth:</strong> ${dob}</p>
        <p>🚻 <strong>Gender:</strong> ${gender}</p>
        <p>📧 <strong>Email:</strong> ${email}</p>
        <p>📞 <strong>Phone:</strong> ${phone}</p>
        <p>🏠 <strong>Address:</strong> ${address}</p>
    `;
}


function saveFormData() {
    const formData = {};
    formElements.forEach(input => {
        if (input.type === "checkbox" || input.type === "radio") {
            formData[input.id] = input.checked; 
        } else {
            formData[input.id] = input.value;
        }
    });

    localStorage.setItem("formData", JSON.stringify(formData));
    console.log("Data saved:", formData); 
}


function loadFormData() {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
        const formData = JSON.parse(savedData);
        formElements.forEach(input => {
            if (formData.hasOwnProperty(input.id)) {
                if (input.type === "checkbox" || input.type === "radio") {
                    input.checked = formData[input.id]; 
                } else {
                    input.value = formData[input.id];
                }
            }
        });
        console.log("Data loaded:", formData); 
    }
}


submitBtn.addEventListener("click", () => {
    if (validateStep(currentStep)) {
        localStorage.removeItem("formData"); 
        showToast("Form Submitted Successfully!", "success");
    } else {
        showToast("Fix errors before submitting!", "error");
    }
});


formElements.forEach(input => {
    input.addEventListener("blur", () => validateStep(currentStep));
    input.addEventListener("input", saveFormData);
});


document.addEventListener("DOMContentLoaded", loadFormData);

function updateForm() {
  steps.forEach((step, index) => {
      step.classList.toggle("active", index === currentStep);
  });

  progressSteps.forEach((step, index) => {
      step.classList.toggle("active", index === currentStep);
  });

  updateProgressBar();

  if (currentStep === steps.length - 1) {
      generateSummary();
  }
}


function updateProgressBar() {
  const progress = ((currentStep + 1) / steps.length) * 100;
  document.querySelector(".progress-bar").style.width = `${progress}%`;
}


function goNext() {
  if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
          currentStep++;
          step++;
          gsap.to(".spaceship", { rotation: step * 120, duration: 1, ease: "power2.out" });
          moveOrbitForward();
          updateForm();
      }
  } else {
      showToast("Please fix errors before proceeding!", "error");
  }
}

function goBack() {
  if (currentStep > 0) {
      currentStep--;
      step--;
      gsap.to(".spaceship", { rotation: step * 120, duration: 1, ease: "power2.out" });
      moveOrbitBackward();
      updateForm();
  }
}


document.addEventListener("DOMContentLoaded", updateProgressBar);


updateForm();

// registration.js – Registration Page Form Validation & Success Flow Handling
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('hdaBookingForm');
  const formContainer = document.querySelector('.registration-container');
  const formMessage = document.getElementById('formMessage');

  if (!form) return;

  // Helper to display error message for an input
  const showError = (input, msg) => {
    const parent = input.closest('.form-group') || input.parentNode;
    let err = parent.querySelector('.error-msg');
    if (err) err.remove();
    err = document.createElement('div');
    err.className = 'error-msg';
    err.style.color = '#ff4d4f';
    err.style.fontSize = '0.82rem';
    err.style.marginTop = '0.4rem';
    err.style.fontFamily = 'var(--font-body)';
    err.style.fontWeight = '500';
    err.textContent = msg;
    parent.appendChild(err);
    
    // Add input error state styling
    input.style.borderColor = '#ff4d4f';
    input.style.boxShadow = '0 0 10px rgba(255, 77, 79, 0.2)';
  };

  // Helper to clear error state for an input
  const clearError = (input) => {
    const parent = input.closest('.form-group') || input.parentNode;
    const err = parent.querySelector('.error-msg');
    if (err) err.remove();
    
    // Restore styling
    input.style.borderColor = '';
    input.style.boxShadow = '';
  };

  // Field validators
  const validateField = (input) => {
    const val = input.value.trim();
    let isValid = true;
    let errorMsg = '';

    if (input.required) {
      if (input.type === 'checkbox') {
        if (!input.checked) {
          isValid = false;
          errorMsg = 'You must agree to continue.';
        }
      } else if (val === '') {
        isValid = false;
        errorMsg = 'This field is required.';
      }
    }

    if (isValid && val !== '') {
      if (input.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
          isValid = false;
          errorMsg = 'Please enter a valid email address.';
        }
      } else if (input.type === 'tel') {
        const digits = val.replace(/\D/g, '');
        if (digits.length < 10 || digits.length > 15) {
          isValid = false;
          errorMsg = 'Please enter a valid phone number (10-15 digits).';
        }
      }
    }

    if (!isValid) {
      showError(input, errorMsg);
    } else {
      clearError(input);
    }

    return isValid;
  };

  // Live validation on input & change
  form.querySelectorAll('input, select, textarea').forEach((input) => {
    input.addEventListener('input', () => {
      if (input.hasAttribute('required') || input.value.trim() !== '') {
        validateField(input);
      }
    });

    input.addEventListener('change', () => {
      if (input.hasAttribute('required') || input.value.trim() !== '') {
        validateField(input);
      }
    });
  });

  // Submit Handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Required fields: Full Name, Email, Phone, Service Required, Event Type, Project Details, Agreement
    const requiredInputs = Array.from(
      form.querySelectorAll('input[required], select[required], textarea[required]')
    );

    let isFormValid = true;

    // Validate all required fields
    requiredInputs.forEach((input) => {
      const isValid = validateField(input);
      if (!isValid) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      formMessage.innerHTML = '<span style="color: #ff4d4f; font-weight: 500; display: inline-block; padding: 0.5rem 1rem; background: rgba(255,77,79,0.1); border-radius: 4px;">❌ Please fill in all required fields highlighted above.</span>';
      
      // Scroll smoothly to the first error element
      const firstError = form.querySelector('.error-msg');
      if (firstError) {
        firstError.closest('.form-group').scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Hide form elements and display Success View
    let successContainer = document.getElementById('registrationSuccessCard');
    if (!successContainer) {
      successContainer = document.createElement('div');
      successContainer.id = 'registrationSuccessCard';
      successContainer.style.textAlign = 'center';
      successContainer.style.padding = '4rem 2rem';
      successContainer.style.background = 'var(--bg-secondary)';
      successContainer.style.border = '1px solid var(--gold-primary)';
      successContainer.style.borderRadius = '12px';
      successContainer.style.boxShadow = '0 15px 40px rgba(0,0,0,0.6), 0 0 30px var(--gold-glow)';
      
      formContainer.parentNode.insertBefore(successContainer, formContainer);
    }

    successContainer.innerHTML = `
      <div style="width: 80px; height: 80px; background: rgba(212, 175, 55, 0.15); border: 2px solid var(--gold-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem; color: var(--gold-primary); font-size: 2.5rem;">
        <i class="fa-solid fa-check"></i>
      </div>
      <h2 style="color: var(--gold-primary); font-family: var(--font-heading); font-size: clamp(1.8rem, 3.5vw, 2.5rem); font-weight: 800; letter-spacing: 0.1em; margin-bottom: 1rem;">
        REGISTRATION SUBMITTED
      </h2>
      <p style="color: var(--text-secondary); max-width: 650px; margin: 0 auto 2.5rem; font-family: var(--font-body); font-size: 1.05rem; line-height: 1.7;">
        Thank you for contacting HDA Production. Our team will review your requirements and contact you shortly.
      </p>
      <button type="button" id="resetRegistrationFormBtn" class="btn-gold" style="padding: 1rem 2.5rem; font-size: 0.9rem; cursor: pointer;">
        Submit Another Request
      </button>
    `;

    // Hide the main form container
    formContainer.style.display = 'none';
    successContainer.style.display = 'block';

    // Handle "Submit Another Request" click
    document.getElementById('resetRegistrationFormBtn').addEventListener('click', () => {
      form.reset();
      formMessage.innerHTML = '';
      form.querySelectorAll('.form-control, input[type="checkbox"]').forEach((input) => {
        clearError(input);
      });

      successContainer.style.display = 'none';
      formContainer.style.display = 'block';

      formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
});


    document.getElementById("submit").addEventListener("click", async (e) => {
      e.preventDefault();
      const mobileNumberInput = document.getElementById("mobileNumber");
      const codeDisplay = document.getElementById("codeDisplay");
      const loadingSpinner = document.getElementById("loading");

      const mobileNumber = mobileNumberInput.value.trim();
      if (!mobileNumber) {
        codeDisplay.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-circle"></i> Please enter your WhatsApp number</div>';
        document.getElementById("copy").style.display = "none";
        return;
      }

      loadingSpinner.style.display = "block";
      codeDisplay.innerHTML = '';
      document.getElementById("copy").style.display = "none";

      try {
        const response = await axios(`/code?number=${mobileNumber.replace(/[^0-9]/g, "")}`);
        const code = response.data.code || "Service Unavailable";
        if (code === "Service Unavailable") {
          codeDisplay.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-circle"></i> Service Unavailable</div>';
        } else {
          codeDisplay.innerHTML = `<div class="success-message"><i class="fas fa-check-circle"></i> CODE: ${code}</div>`;
          document.getElementById("copy").style.display = "flex";
        }
      } catch (error) {
        console.error("Error generating code:", error);
        codeDisplay.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-circle"></i> Error generating code. Please try again.</div>';
      } finally {
        loadingSpinner.style.display = "none";
      }
    });

    function copyCode() {
      const codeDisplay = document.getElementById("codeDisplay").innerText;
      const code = codeDisplay.replace('CODE: ', '');
      const copyBtn = document.getElementById("copy");

      navigator.clipboard.writeText(code).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyBtn.disabled = true;
        copyBtn.style.opacity = "0.6";
        copyBtn.style.cursor = "not-allowed";

        const toast = document.getElementById("toast");
        toast.style.display = "block";
        toast.style.opacity = "1";

        setTimeout(() => {
          copyBtn.innerHTML = originalText;
          copyBtn.disabled = false;
          copyBtn.style.opacity = "1";
          copyBtn.style.cursor = "pointer";

          toast.style.opacity = "0";
          setTimeout(() => {
            toast.style.display = "none";
          }, 300);
        }, 2000);
      }).catch(err => {
        console.error("Failed to copy text: ", err);
      });
    }
  
export const DivemasterUI = {
    init: () => {
        const checklistResetBtn = document.getElementById('global-checklist-reset-btn');
        if (checklistResetBtn) {
            checklistResetBtn.addEventListener('click', function (e) {
                e.preventDefault();

                // Find active checklist sub-tab
                const activeChecklist = document.querySelector('#divemaster-tools .sub-tab-content.active-sub-tab');

                if (activeChecklist) {
                    const checkboxes = activeChecklist.querySelectorAll('input[type="checkbox"]:checked');
                    checkboxes.forEach(checkbox => {
                        checkbox.checked = false;
                    });

                    // Optional visual feedback
                    const wrapper = checklistResetBtn.closest('.global-reset-wrapper');
                    if (wrapper) {
                        wrapper.style.animation = 'none';
                        setTimeout(() => {
                            wrapper.style.animation = 'pulse-glow-dark 3s infinite ease-in-out';
                        }, 10);
                    }
                }
            });
        }
    }
};

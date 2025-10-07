const numberInput = document.getElementById('numberInput')
const fahrenheitRadio = document.querySelector('#fahrenheitBox .radio')
const celsiusRadio = document.querySelector('#celsiusBox .radio')
const convertButton = document.getElementById('convertBox')
const resultOutput = document.getElementById('resultOutput')

// Theme: toggle + persistence
const THEME_STORAGE_KEY = 'theme'
const themeToggleButton = document.getElementById('themeToggle')

function updateThemeToggleIcon(theme) {
    if (!themeToggleButton) return
    if (theme === 'dark') {
        themeToggleButton.textContent = '☀️'
        themeToggleButton.setAttribute('aria-label', 'Switch to light mode')
        themeToggleButton.title = 'Switch to light mode'
    } else {
        themeToggleButton.textContent = '🌙'
        themeToggleButton.setAttribute('aria-label', 'Switch to dark mode')
        themeToggleButton.title = 'Switch to dark mode'
    }
}

function applyTheme(theme) {
    const themeToApply = theme === 'dark' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', themeToApply)
    updateThemeToggleIcon(themeToApply)
}

function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    if (saved === 'dark' || saved === 'light') return saved
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || getPreferredTheme()
    const next = current === 'dark' ? 'light' : 'dark'
    localStorage.setItem(THEME_STORAGE_KEY, next)
    applyTheme(next)
}

// Initialize theme on load
applyTheme(getPreferredTheme())

// React to system changes only if user hasn't chosen
if (window.matchMedia) {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    mql.addEventListener('change', (e) => {
        const saved = localStorage.getItem(THEME_STORAGE_KEY)
        if (saved !== 'dark' && saved !== 'light') {
            applyTheme(e.matches ? 'dark' : 'light')
        }
    })
}

// Hook up toggle UI
if (themeToggleButton) {
    themeToggleButton.addEventListener('click', toggleTheme)
}

function triggerAnimation() {
    const resultBox = document.getElementById('resultBox')
    resultBox.classList.add('updated')
    setTimeout(() => {
        resultBox.classList.remove('updated')
    }, 300)
}

function convertTemperature() {
    const value = parseFloat(numberInput.value)
    let temp;

    if (isNaN(value)) {
        resultOutput.innerText = "Please enter a number."
        triggerAnimation()
        return;
    }

    if (fahrenheitRadio.checked) {
        temp = (value * 9/5) + 32
        resultOutput.innerText = `Result: ${temp.toFixed(2)}˚F`
    } else if (celsiusRadio.checked) {
        temp = (value - 32) * 5/9
        resultOutput.innerText = `Result: ${temp.toFixed(2)}˚C`
    } else {
        resultOutput.innerText = "Please select a unit."
    }
    
    triggerAnimation()
}

// Run when user clicks the convert box
convertButton.addEventListener('click', convertTemperature)

// Optional: press Enter to convert
numberInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') convertTemperature()
})

// Clear input only when user focuses
numberInput.addEventListener('focus', () => {
    numberInput.value = ""
})

function makeRadioToggleable(radio) {
    // Capture the checked state BEFORE the click toggles it
    radio.addEventListener('pointerdown', () => {
        radio.dataset.wasChecked = radio.checked ? 'true' : 'false'
    })
    // On click, if it was already checked, allow deselect; otherwise keep default selection
    radio.addEventListener('click', () => {
        const wasChecked = radio.dataset.wasChecked === 'true'
        if (wasChecked) {
            radio.checked = false
        }
    })
}

// Apply to your radios
makeRadioToggleable(fahrenheitRadio)
makeRadioToggleable(celsiusRadio)


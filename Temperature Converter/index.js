const numberInput = document.getElementById('numberInput')
const fahrenheitRadio = document.querySelector('#fahrenheitBox .radio')
const celsiusRadio = document.querySelector('#celsiusBox .radio')
const convertButton = document.getElementById('convertBox')
const resultOutput = document.getElementById('resultOutput')

// Theme: toggle + persistence
const THEME_STORAGE_KEY = 'theme'
const themeToggleButton = document.getElementById('themeToggle')
const themeToggleIcon = document.getElementById('themeToggleIcon')

function updateThemeToggleIcon(theme) {
    if (!themeToggleButton) return
    const isDark = theme === 'dark'
    themeToggleButton.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode')
    themeToggleButton.title = isDark ? 'Switch to light mode' : 'Switch to dark mode'
    if (themeToggleIcon) {
        if (!themeToggleIcon.dataset.lightSrc) {
            // Default light icon data URL fallback (moon emoji SVG via data URL could be replaced if needed)
            themeToggleIcon.dataset.lightSrc = themeToggleIcon.getAttribute('src') || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"/></svg>'
        }
        // Expect user-provided NightMode icons; use conventional names as fallback
        const darkIcon = themeToggleIcon.dataset.darkSrc || 'NightMode_toggle-dark.svg'
        themeToggleIcon.src = isDark ? darkIcon : themeToggleIcon.dataset.lightSrc
    } else {
        // Text fallback
        themeToggleButton.textContent = isDark ? '☀️' : '🌙'
    }
}

function applyTheme(theme) {
    const themeToApply = theme === 'dark' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', themeToApply)
    updateThemeToggleIcon(themeToApply)
    applyThemeAssets(themeToApply)
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

// Swap icons/images for dark mode assets
function applyThemeAssets(theme) {
    // favicon swap
    const faviconLink = document.querySelector('link[rel="icon"]')
    if (faviconLink) {
        if (!faviconLink.dataset.lightHref) {
            faviconLink.dataset.lightHref = faviconLink.getAttribute('href') || 'favicon.png'
        }
        // Allow HTML to specify data-dark-href, otherwise use a conventional name
        const darkHref = faviconLink.dataset.darkHref || 'favicon-dark.png'
        faviconLink.setAttribute('href', theme === 'dark' ? darkHref : faviconLink.dataset.lightHref)
    }

    // Helper to set themed image source with graceful fallback
    function setThemedImage(imgEl, darkSrc) {
        if (!imgEl) return
        if (!imgEl.dataset.boundError) {
            imgEl.addEventListener('error', () => {
                // Revert to light image if dark asset is missing
                if (document.documentElement.getAttribute('data-theme') === 'dark' && imgEl.dataset.lightSrc) {
                    imgEl.src = imgEl.dataset.lightSrc
                }
            })
            imgEl.dataset.boundError = 'true'
        }
        if (theme === 'dark') {
            if (!imgEl.dataset.lightSrc) imgEl.dataset.lightSrc = imgEl.src
            const preferredDark = imgEl.dataset.darkSrc || darkSrc
            imgEl.src = preferredDark
        } else if (imgEl.dataset.lightSrc) {
            imgEl.src = imgEl.dataset.lightSrc
        }
    }

    // Celsius & Fahrenheit artwork swaps
    const celsiusImg = document.querySelector('#celsiusBox .row img')
    const fahrenheitImg = document.querySelector('#fahrenheitBox .row img')
    // Support user-provided NightMode_*. assets embedded as data URLs or files
    if (celsiusImg) {
        celsiusImg.dataset.darkSrc = celsiusImg.dataset.darkSrc || 'NightMode_celsius.png'
        setThemedImage(celsiusImg, celsiusImg.dataset.darkSrc)
    }
    if (fahrenheitImg) {
        fahrenheitImg.dataset.darkSrc = fahrenheitImg.dataset.darkSrc || 'NightMode_fahrenheit.png'
        setThemedImage(fahrenheitImg, fahrenheitImg.dataset.darkSrc)
    }

    // Theme Toggle icon
    if (themeToggleIcon) {
        themeToggleIcon.dataset.darkSrc = themeToggleIcon.dataset.darkSrc || 'NightMode_toggle-dark.svg'
        // ensure icon updates after dataset defaults
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light'
        updateThemeToggleIcon(currentTheme)
    }
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


const numberInput = document.getElementById('numberInput')
const fahrenheitRadio = document.querySelector('#fahrenheitBox .radio')
const celsiusRadio = document.querySelector('#celsiusBox .radio')
const convertButton = document.getElementById('convertBox')
const resultOutput = document.getElementById('resultOutput')

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
    radio.addEventListener('click', function() {
        if (this.wasChecked) {
            this.checked = false
        }
        // Save the current state
        this.wasChecked = this.checked
    });
}

// Apply to your radios
makeRadioToggleable(fahrenheitRadio)
makeRadioToggleable(celsiusRadio)


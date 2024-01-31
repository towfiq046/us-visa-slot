const CITY_DROPDOWN_ID = "#post_select";
const DATE_PICKER_ID = "#datepicker";
const RADIO_BUTTON_SELECTOR = '[name="schedule-entries"]';
const SUBMIT_BUTTON_ID = "#submitbtn";
const MONTH_DROPDOWN_SELECTOR = '[data-handler="selectMonth"]';
const cityIndex = {
    chennai: 1,
    hydrabad: 2,
    kolkata: 3,
    mumbai: 4,
    newDelhi: 5,
};
const months = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
};

function waitForElementToBeClickable(elementSelector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const startTime = new Date().getTime();
        let intervalId;

        function checkElement() {
            const element = document.querySelector(elementSelector);

            if (element) {
                const rect = element.getBoundingClientRect();
                const isClickable = rect.width > 0 && rect.height > 0;
                const isDisplayed = window.getComputedStyle(element).display !== "none";

                if (isClickable && isDisplayed) {
                    clearInterval(intervalId);
                    resolve(element);
                }
            }

            const currentTime = new Date().getTime();
            if (currentTime - startTime > timeout) {
                clearInterval(intervalId);
                reject(new Error(`Timeout waiting for element with selector: ${elementSelector}`));
            }
        }

        intervalId = setInterval(checkElement, 100); // Check every 100 milliseconds
    });
}

async function selectCityFromDropdown(selector) {
    if (typeof selector !== "string") {
        console.error("Invalid argument type. Please provide a string.");
        return;
    }

    const dropdown = document.querySelector(selector);
    for (const index in cityIndex) {
        dropdown.selectedIndex = cityIndex[index];
        await _triggerEventChange(dropdown);
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for dates to show.
        await clickAvailableDate();
    }
}

async function clickAvailableDate() {
    const datePicker = document.querySelector(DATE_PICKER_ID);
    if (datePicker.classList.contains("hasDatepicker")) {
        $(DATE_PICKER_ID).datepicker("show");
        await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for dates to show.

        for (const month in months) {
            const monthDropdown = document.querySelector(MONTH_DROPDOWN_SELECTOR);
            monthDropdown.selectedIndex = months[month];
            await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for dates to show.
            await _triggerEventChange(monthDropdown);
            await new Promise((resolve) => setTimeout(resolve, 500));
            await clickAllButtons();
            await new Promise((resolve) => setTimeout(resolve, 300));
        }
        $(DATE_PICKER_ID).datepicker("hide");
    }
}

async function clickAllButtons() {
    const greenDay = document.querySelector(".greenday");
    if (greenDay) {
        greenDay.click();
        try {
            await waitForElementToBeClickable(RADIO_BUTTON_SELECTOR, 5000);
            await new Promise((resolve) => setTimeout(resolve, 500));
            document.querySelector(RADIO_BUTTON_SELECTOR).click();
            await waitForElementToBeClickable(SUBMIT_BUTTON_ID, 5000);
            await new Promise((resolve) => setTimeout(resolve, 500));
            document.querySelector(SUBMIT_BUTTON_ID).click();
            await new Promise((resolve) => setTimeout(resolve, 5000));
        } catch (error) {
            console.error("Error clicking button:", error.message);
        }
    }
}

async function _triggerEventChange(element) {
    const changeEvent = new Event("change", { bubbles: true });
    element.dispatchEvent(changeEvent);
}

async function main() {
    while (true) {
        await selectCityFromDropdown(CITY_DROPDOWN_ID);
    }
}

main();

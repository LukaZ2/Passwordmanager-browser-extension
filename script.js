function replaceValue(element, value) {
    if (element) {
        element.focus();
        document.execCommand('selectAll');
        if (!document.execCommand('insertText', false, value)) {
            element.value = value;
        }
        element.dispatchEvent(new Event('change', { bubbles: true }));
    }
    return element;
}

function autofillPasswordAndUsername() {

    let inputs = document.getElementsByTagName("input")

    let usernameField = null
    let passwordField = null

    for (let i = 0; i < inputs.length; i++) {
        let input = inputs[i]
        if (usernameField === null && input.autocomplete.includes("username")) usernameField = input
        if (passwordField === null && input.autocomplete.includes("password")) passwordField = input
    }

    console.log(usernameField)
    console.log(passwordField)

    if (usernameField === null && passwordField === null) return

    fetch(
        "http://localhost:23232",
        {
            method: "POST",
            body: JSON.stringify({
                type: "GET_PASSWORD",
                body: {
                    url: window.location.href
                }
            })
        }
    )
        .then((response) => response.json())
        .then((json) => {
            if (json === null || !json.found) return
            if (usernameField !== null) replaceValue(usernameField, json.username)
            if (passwordField !== null) replaceValue(passwordField, json.password)
        })

}

setTimeout(function () {
    autofillPasswordAndUsername()
}, 2000)

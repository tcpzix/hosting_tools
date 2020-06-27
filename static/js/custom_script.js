// tools check Go button 
const Go = document.querySelector('#dosearch');


// Event Listeners
Go.addEventListener('click',()=>{toolsCheck()});


// called when need to get multi checkbox value and pass name of its
function getCheckboxesValue(name) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    let values = [];
    checkboxes.forEach((checkbox) => {
        values.push(checkbox.value);
    });
    return values;
}


// Get text inputbox  value
function getInputValue(name) {
    const input = document.getElementById(name);
    value = input.value;
    return value;
}

function toolsCheck() {
    // get domain and tools checkboxes value
    const domain = JSON.stringify(getInputValue('tools-check-input'));
    const tools = JSON.stringify(getCheckboxesValue('tool-checkbox'));

    url = 'tools_check';
    data = domain + '-' + tools;

    
    let sendData = ajaxGet(url, data);
    sendData.done(function(data) {
        console.log(data);
    });

}


function ajaxGet(url, data) {
    return $.ajax({
        url: window.origin+'/'+url,
        data: data,
        contentType: 'application/json',
        type: 'POST'
    });
}

getInputValue('tools-check-input');
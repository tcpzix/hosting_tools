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
    const domain = getInputValue('tools-check-input');
    const tool = getCheckboxesValue('tool-checkbox');
    let tools = JSON.stringify(tool);
    let domains = JSON.stringify(domain);
    url = 'tools_check';
    data = {
        domains,
        tools
        
    }

    console.log('sended data: ', data);

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
var addArt = document.getElementById(addArt);
let testChannelId = 'newChannel';
let bearer = "Bearer keyGsjks4OkZO7RHi";

let userId = window.sessionStorage.getItem('userId');

(
    function () {
        console.log('auto run');
        window.Twitch.ext.onAuthorized(function (auth) {
            console.log('The JWT that will be passed to the EBS is', auth.token);
            console.log('The channel ID is', auth.channelId);
            getChannels(auth.channelId);
        });
        getChannels(testChannelId);
        document.getElementById('addArt').addEventListener('click', function () {
            createProduct();
        })
    }
)()


function getChannels(channelId) {
    let channelList = [];
    fetch('https://api.airtable.com/v0/apptcVgm2Qw2hUIWU/User?maxRecords=3&view=Grid%20view', {
        headers: {
            Authorization: bearer,
            "Content-Type": "application/json"
        },
        method: "GET",
    })
        .then(response => response.json())
        .then(function (data) {
            console.log("Success Retrieved Channels", data);
            channelList = data.records;
            let foundChannel = false;
            channelList.forEach(function ({ fields, id }, iteration) {
                if (fields && fields.channel_id && fields.channel_id === channelId) {
                    console.log("Channel" + '\nID-' + fields.channel_id);
                    foundChannel = true;
                    getProducts(id);
                    window.sessionStorage.setItem('airId', id);
                }
                if (iteration === channelList.length - 1 && !foundChannel) {
                    console.error("Could Not Find Matching User")
                    createChannel(channelId)
                }
            })
        })
    return channelList;
}
function getProducts(channel_id) {
    fetch('https://api.airtable.com/v0/apptcVgm2Qw2hUIWU/Products?maxRecords=3&view=Grid%20view', {
        headers: {
            Authorization: bearer,
            "Content-Type": "application/json"
        },
        method: "GET",
    })
        .then(response => response.json())
        .then(function (data) {
            console.log("Success Retrieved Products", data);
            productList = data.records;
            productList.forEach(function ({ fields, id }, iteration) {
                if (fields && fields.channel_id && fields.channel_id[0] === channel_id) {
                    let { url, description, img_url, price, title } = fields;
                    console.log("Found Matching Product", fields.channel_id[0], url, description, img_url)
                    addProductBoxToDom({ url, description, img_url, title, price, id });
                }
            })
        })
}


function createProduct() {
    let _channel_id = window.sessionStorage.getItem('airId') || false;
    if (_channel_id) {
        fetch('https://api.airtable.com/v0/apptcVgm2Qw2hUIWU/Products', {
            headers: {
                Authorization: bearer,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                fields: {
                    channel_id : [_channel_id],
                }
            })
        })
            .then(response => response.json())
            .then(function (data) {
                console.log("Success Added new Channel", data);
                let id = data.id || false;
                addProductBoxToDom({id})
            })
            .catch(error => {
                console.error("Error", error);
            });
    }
}
function addProductBoxToDom({ url = '', description = '', img_url = '', price = '0.00', title = '', id = false }) {
    var formList = document.getElementById('form-list');
        var newInputBox = `
    <ol id="url-list" class="form-container">
     <li class="something">
        <div class="field-container">
            <div class="field-title">
                <p>Title</p>
            </div>
            <input id='title-${id}' name='title' type="text" value="${title}" placeholder="add your title here" onchange='handleInputChange(this)'/>
        </div>
        <div class="field-container">
            <div class="field-url">
                <p>URL</p>
            </div>
            <input id='url-${id}' type="url" name='url' value='${url}' placeholder="add a url use https://" onchange='handleInputChange(this)'/>
        </div>
        <div class="field-container">
            <div class="field-cost">
                <p>PRICE</p>
            </div>
            <input id='price-${id}' type="text" name='price' value='${price}' placeholder="add a price if you need one" onchange='handleInputChange(this)'/>
        </div>
        <div class="field-container">
            <div class="field-file">
                <input type="file"/>
            </div>
        </div>
        <div class="field-container">
        <div class="field-color">
            <p>Color</p>
             <input type="color"/>
         </div>
         </div>
         <div class="dumpster">
         <i class="far fa-trash-alt"></i>
     </div>
    
    </div>
    </li>
    </ol>`;
    $('#form-list').append(newInputBox);



}
function handleInputChange(event) {
    if (event && event.getAttribute('id')) {
        console.log('handle input change')
        let id = event.getAttribute('id');
        let parsed = id.split('-');
        let productId = parsed[1];
        let fields = {};
        fields[parsed[0]] = event.value || '';
        var url = 'https://api.airtable.com/v0/apptcVgm2Qw2hUIWU/Products/' + productId;
        fetch(url, {
            method: 'PATCH', // or 'PUT'
            body: JSON.stringify({
                fields
            }),
            headers: {
                Authorization: bearer,
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                response.json().then(function (resp) {
                    console.log('Success Patched Field', resp);
                })
            })
            .catch(function (error) {
                console.error(error);
            })
    }
    console.log('handling input change', event.getAttribute('id'));

}
function handleChange(event) {
    console.log("Handling Change", event);
}
function createChannel(channel_id) {
    fetch("https://api.airtable.com/v0/apptcVgm2Qw2hUIWU/User", {
        headers: {
            Authorization: bearer,
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
            fields: {
                channel_id,
            }
        })
    })
        .then(response => response.json())
        .then(function (data) {
            console.log("Success Added new Channel", data);
            let returnedId = data.id || false;
            if (returnedId) {
                window.sessionStorage.setItem('airId', data.id);
            }
        })
        .catch(error => {
            console.error("Error", error);
        });
}
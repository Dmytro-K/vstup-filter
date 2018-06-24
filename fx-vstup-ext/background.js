

// var color_icon_data;
// var gray_icon_data;

// function copyImageData(orig)
// {
//     return new ImageData(orig.data.slice(), orig.width, orig.height);
// }

function convert_to_gray(image_data)
{
    var px = image_data.data;

    var image_data_out = new ImageData(image_data.width, image_data.height);
    var px_out = image_data_out.data;

    var len = px.length;
    for (var i=0; i<len; i += 4)
    {
        var gray = px[i] * 0.3 + px[i+1] * 0.59 + px[i+2] * 0.11;
        px_out[i] = gray;
        px_out[i+1] = gray;
        px_out[i+2] = gray;
        px_out[i+3] = px[i+3];
    }

    return image_data_out;
}

function init_image_data(cb=null)
{
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");

    // ctx.fillStyle = "green";
    // ctx.fillRect(4, 4, 8, 8);
    var image = new Image();
    image.onload = function(){
        ctx.drawImage(image, 0, 0);

        var color_icon_data = ctx.getImageData(0, 0, 16, 16);

        var gray_icon_data = convert_to_gray(color_icon_data);
        if (null != cb)
        {
            cb(color_icon_data, gray_icon_data);
        }
    };
    image.src = "favicon.png";
}

function main()
{
    var enabled = false;

    // browser.tabs.query({active: true, currentWindow: true, url: "*://*.vstup.info/*"});

    var color_icon_data;
    var gray_icon_data;
    init_image_data(function (color, gray) {
        color_icon_data = color;
        gray_icon_data = gray;
    });

    function vstup_button_click_handler () {
        console.log("sdsadas");

        enabled = !enabled;

        // browser.browserAction.setIcon({path: {16: enabled ? "favicon.png" : "favicon-gray.png"}});
        // getImageData(x => browser.browserAction.setIcon({imageData: x}));
        browser.browserAction.setIcon({imageData: {16: enabled ? color_icon_data : gray_icon_data}});

        browser.tabs.query({active: true, currentWindow: true, url: "*://*.vstup.info/*"})
            .then(
                function (tabs) {
                    tabs.forEach(function (tab) {
                        console.log(tab.url);
                        browser.tabs.sendMessage(tab.id, {command: 3, data: enabled});
                    });
                },
                function onError(error) {
                    console.log(`Error: ${error}`);
                }
            );
    }

    browser.browserAction.onClicked.addListener(vstup_button_click_handler);

    // browser.browserAction.setTitle({title: "ggggggg"});
    browser.runtime.onMessage.addListener(notify);

    function notify(message) {
        // console.log("message:", message);
        var ggg = {
            "type": "basic",
            "iconUrl": browser.runtime.getURL("favicon.png"),
            "title": "You clicked a link!",
            "message": message.url
        };
        // console.log("ggg:", ggg);
        browser.notifications.create(ggg);
    }
}

main();

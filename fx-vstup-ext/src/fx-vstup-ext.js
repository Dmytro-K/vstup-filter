
// 'use strict';

function main()
{
    if (null == document.querySelector('head meta[content$="Список абітурієнтів"]'))
    {
        return 0;
    }

    window.browser = (function () {
        return window.msBrowser ||
            window.browser ||
            window.chrome;
    })();

    // document.body.querySelectorAll('*').forEach(x => x.style.backgroundColor = '#BB0000');

    const red_box_enable = false;
    var red_box;

    if (false != red_box_enable)
    {
        red_box = document.getElementById('myRedBox');
        if (!red_box)
        {
            red_box = document.createElement('div');
            red_box.id = "myRedBox";
            red_box.style.backgroundColor = '#BB0000';
            red_box.style.position = 'fixed';
            red_box.style.left = '100px';
            red_box.style.bottom = '100px';
            red_box.style.width = '100px';
            red_box.style.height = '100px';
            red_box.style.zIndex = '999';
            red_box.style.display = 'none';
        }
        document.body.appendChild(red_box);
    }

    console.log("dad");

    var badItems = Array.prototype.slice.call(
        document.getElementById('legend').previousElementSibling.querySelectorAll('tr'))
        .filter(x => ((y => y[y.length-1].innerHTML == '—')(x.childNodes)))
        // .map(x => ({prevState: x.style.display, elem: x}))
        ;
    // badItems.forEach(x => x.elem.style.display = 'none');
    // badItems.forEach(x => x.style.display = 'none');

    // browser.browserAction.setTitle({title: "ggggggg"});

    if (false != red_box_enable)
    {
        red_box.addEventListener('click', function (e) {
            browser.runtime.sendMessage({url: e.target.id});
        });
    }

    function state_set(state)
    {
        if (state)
        {
            if (false != red_box_enable)
            {
                red_box.style.display = 'block';
            }
            badItems.forEach(x => x.style.display = 'none');
        }
        else
        {
            if (false != red_box_enable)
            {
                red_box.style.display = 'none';
            }
            badItems.forEach(x => x.style.display = 'table-row');
        }
    }
    var stateState = false;
    function state_toggle()
    {
        stateState = !stateState;
        console.log("stateState: ", stateState);
        state_set(stateState);
    }

    function messageHadnler(msg)
    {
        switch (msg.command)
        {
            case 3:
            {
                console.log("Got command", msg.command);
                state_set(msg.data);
                break;
            }
            default:
            {
                console.log("Received unknown command", msg.command);
            }
        }
    }

    browser.runtime.onMessage.addListener(messageHadnler);
}

main();

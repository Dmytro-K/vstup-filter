
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
    var el;
    el = document.getElementById('myRedBox');
    if (!el)
    {
        el = document.createElement('div');
        el.id = "myRedBox";
        el.style.backgroundColor = '#BB0000';
        el.style.position = 'fixed';
        el.style.left = '100px';
        el.style.bottom = '100px';
        el.style.width = '100px';
        el.style.height = '100px';
        el.style.zIndex = '999';
        el.style.display = 'none';
    }
    document.body.appendChild(el);
    console.log("dad");
    var badItems = Array.prototype.slice.call(
        document.getElementById('legend').previousElementSibling.querySelectorAll('tr'))
        .filter(x => ((y => y[y.length-1].innerHTML == '—')(x.childNodes)))
        // .map(x => ({prevState: x.style.display, elem: x}))
        ;
    // badItems.forEach(x => x.elem.style.display = 'none');
    // badItems.forEach(x => x.style.display = 'none');

    // browser.browserAction.setTitle({title: "ggggggg"});
    el.addEventListener('click', function (e) {
        browser.runtime.sendMessage({url: e.target.id});
    });

    function state_set(state)
    {
        if (state)
        {
            el.style.display = 'block';
            badItems.forEach(x => x.style.display = 'none');
        }
        else
        {
            el.style.display = 'none';
            badItems.forEach(x => x.style.display = 'table-row');
        }
    }
    var stateState = false;
    function state_toggle()
    {
        stateState = !stateState;
        console.log("stateState: ", stateState);
        // if (stateState)
        // {
        //     el.style.display = 'block';
        //     badItems.forEach(x => x.style.display = 'none');
        // }
        // else
        // {
        //     el.style.display = 'none';
        //     badItems.forEach(x => x.style.display = 'table-row');
        // }
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

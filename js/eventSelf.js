/**
 * Created by lenovo on 2016/7/21.
 */
function on(ele, type, fn) {
    if (/^self/.test(type)) {
        //处理自定义的事件绑定:构建程序池，并且把需要绑定的方法保存到程序池中
        if (!ele['aSelf' + type]) {
            ele['aSelf' + type] = []
        }
        var arySelf = ele['aSelf' + type];
        for (var j = 0; j < arySelf.length; j++) {
            if (arySelf[j] === fn) return
        }
        arySelf.push(fn)
    } else if (ele.addEventListener) {
        //处理标准浏览器的事件绑定
        ele.addEventListener(type, fn, false)
    } else {//一下是处理IE浏览器的事件绑定
        if (!ele['aEvent' + type]) {
            ele['aEvent' + type] = [];
            ele.attachEvent('on' + type, function () {
                run.call(ele)
            })
        }
        var ary = ele['aEvent' + type];
        for (var i = 0; i < ary.length; i++) {
            if (ary[i] === fn) return
        }
        ary.push(fn)
    }
}
function run() {//IE中专门负责按顺序执行程序池里的方法的，浏览器事件中真正绑定的是这个run方法
    var e = window.event;
    var type = e.type;
    var ary = this['aEvent' + type];
    if (ary && ary.length) {
        if (!e.target) {
            e.target = e.srcElement;
            e.pageX = (document.documentElement.scrollLeft || document.body.scrollLeft) + e.clientX;
            e.pageY = (document.documentElement.scrollTop || document.body.scrollTop) + e.clientY;
            e.preventDefault = function () {
                e.returnValue = false
            };
            e.stopPropagation = function () {
                e.cancelBubble = true
            }
        }
        for (var i = 0; i < ary.length; i++) {
            if (typeof ary[i] === 'function') {
                ary[i].call(this, e)
            } else {
                ary.splice(i, 1);
                i--
            }
        }
    }
}
function selfRun(selfRun, e) {//负责通知，专门处理自定义事件的通知
    var ary = this['aSelf' + selfRun];
    if (ary && ary.length) {
        for (var i = 0; i < ary.length; i++) {
            if (typeof ary[i] === 'function') {
                ary[i].call(this, e)
            } else {
                ary.splice(i, 1);
                i--
            }
        }
    }
}
function off(ele, type, fn) {
    if (/^self/.test(type)) {
        var arySelf = ele['aSelf' + type];
        if (arySelf) {
            for (var i = 0; i < arySelf.length; i++) {
                if (arySelf[i] === fn) {
                    arySelf[i] = null;
                    return
                }
            }
        }
    } else if (ele.removeEventListener) {
        ele.removeEventListener(type, fn, false)
    } else {
        var ary = ele['aEvent' + type];
        if (ary) {
            for (var j = 0; j < ary.length; j++) {
                if (ary[j] === fn) {
                    ary[j] = null;
                    return
                }
            }
        }
    }
}
function processThis(fn, obj) {
    return function (e) {
        fn.call(obj, e)
    }
}